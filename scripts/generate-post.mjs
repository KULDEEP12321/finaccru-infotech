#!/usr/bin/env node
/**
 * Autonomous blog-post generator for the Finaccru Infotech site.
 *
 * Runs on a schedule (GitHub Actions — see .github/workflows/blog-autopost.yml)
 * and, with no human in the loop:
 *   1. reads existing article titles from Sanity so it never repeats a topic,
 *   2. asks Claude to invent an on-brand topic AND write the full article
 *      (title, description, category, tags, body, + image briefs) in one call,
 *   3. converts the Markdown body into Sanity Portable Text blocks,
 *   4. pulls a cover image + a few inline images from Unsplash and uploads them
 *      to Sanity (visual-first layout),
 *   5. creates the `article` document with publishedAt = now → published live.
 *
 * The live site reads with a token-less client; this script is the only place a
 * WRITE token is used, and it never runs inside the deployed app. See
 * scripts/README.md for required secrets and how to test locally.
 *
 * Usage:
 *   node scripts/generate-post.mjs            # generate + publish
 *   node scripts/generate-post.mjs --dry-run  # generate, print the doc, publish nothing
 */

import { createClient } from '@sanity/client'
import { Schema } from '@sanity/schema'
import { htmlToBlocks } from '@sanity/block-tools'
import { JSDOM } from 'jsdom'
import { marked } from 'marked'
import Anthropic from '@anthropic-ai/sdk'
import { randomUUID } from 'node:crypto'

// ── Config ──────────────────────────────────────────────────────────────────

const DRY_RUN = process.argv.includes('--dry-run') || process.env.DRY_RUN === '1'

const PROJECT_ID = process.env.SANITY_PROJECT_ID || '2jhreob8'
const DATASET = process.env.SANITY_DATASET || 'production'
const API_VERSION = process.env.SANITY_API_VERSION || '2024-12-01'
const WRITE_TOKEN = process.env.SANITY_WRITE_TOKEN
const UNSPLASH_KEY = process.env.UNSPLASH_ACCESS_KEY
const MODEL = process.env.BLOG_MODEL || 'claude-opus-4-8'

// The editorial guardrails. This is the one knob to turn if you want to steer
// what the blog writes about — keep it aligned with src/lib/site-content.ts.
const SERVICE_AREAS = [
  'Custom software development (products built to fit a business)',
  'Cloud & DevOps — infrastructure that scales',
  'Mobile & web app development (one codebase, every screen)',
  'Data & AI / machine learning — decisions, not dashboards',
  'Cybersecurity — defended by design',
  'Managed IT services — systems always on',
  'Hiring & staff augmentation — frontend, backend, full-stack, mobile, DevOps, AI/ML developers',
]

const DEFAULT_AUTHOR = {
  name: 'Finaccru Infotech Team',
  slug: 'finaccru-infotech-team',
  bio: 'Engineering notes and field reports from the Finaccru Infotech team on building custom software, cloud platforms, and intelligent systems.',
}

if (!WRITE_TOKEN && !DRY_RUN) {
  console.error('Missing SANITY_WRITE_TOKEN (required unless --dry-run).')
  process.exit(1)
}
if (!process.env.ANTHROPIC_API_KEY) {
  console.error('Missing ANTHROPIC_API_KEY.')
  process.exit(1)
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: API_VERSION,
  token: WRITE_TOKEN, // undefined in dry-run is fine for reads on a public dataset
  useCdn: false, // always read fresh so dedupe sees the latest posts
})

const anthropic = new Anthropic() // reads ANTHROPIC_API_KEY from env

// ── Portable Text conversion ─────────────────────────────────────────────────

// Mirror of sanity/schemas/blockContent.ts so block-tools maps headings, lists,
// marks and links to the exact same shapes the Studio + renderer expect.
const compiledSchema = Schema.compile({
  name: 'default',
  types: [
    {
      name: 'post',
      type: 'object',
      fields: [
        {
          name: 'body',
          type: 'array',
          of: [
            {
              type: 'block',
              styles: [
                { title: 'Normal', value: 'normal' },
                { title: 'H2', value: 'h2' },
                { title: 'H3', value: 'h3' },
                { title: 'H4', value: 'h4' },
                { title: 'Quote', value: 'blockquote' },
              ],
              lists: [
                { title: 'Bullet', value: 'bullet' },
                { title: 'Numbered', value: 'number' },
              ],
              marks: {
                decorators: [
                  { title: 'Strong', value: 'strong' },
                  { title: 'Emphasis', value: 'em' },
                  { title: 'Code', value: 'code' },
                  { title: 'Underline', value: 'underline' },
                ],
                annotations: [
                  { name: 'link', type: 'object', fields: [{ name: 'href', type: 'url' }] },
                ],
              },
            },
            { type: 'image', name: 'image', fields: [{ name: 'alt', type: 'string' }, { name: 'caption', type: 'string' }] },
            { type: 'object', name: 'codeBlock', fields: [{ name: 'language', type: 'string' }, { name: 'code', type: 'text' }] },
          ],
        },
      ],
    },
  ],
})
const blockContentType = compiledSchema
  .get('post')
  .fields.find((f) => f.name === 'body').type

const key = () => randomUUID().replace(/-/g, '').slice(0, 12)

// Sanity requires a _key on every array item; backfill any block-tools missed.
function ensureKeys(blocks) {
  for (const block of blocks) {
    if (!block._key) block._key = key()
    if (Array.isArray(block.children)) {
      for (const child of block.children) if (!child._key) child._key = key()
    }
    if (Array.isArray(block.markDefs)) {
      for (const def of block.markDefs) if (!def._key) def._key = key()
    }
  }
  return blocks
}

function markdownToBlocks(md) {
  const html = marked.parse(md)
  const blocks = htmlToBlocks(html, blockContentType, {
    parseHtml: (h) => new JSDOM(h).window.document,
    rules: [
      // Map fenced code (<pre><code>) to the schema's codeBlock object.
      {
        deserialize(el, _next, block) {
          if (el.tagName && el.tagName.toLowerCase() === 'pre') {
            const codeEl = el.querySelector('code') || el
            return block({ _type: 'codeBlock', code: codeEl.textContent || '' })
          }
          return undefined
        },
      },
    ],
  })
  return ensureKeys(blocks)
}

const blockText = (block) =>
  Array.isArray(block?.children)
    ? block.children.map((c) => c.text || '').join('')
    : ''

// ── Unsplash → Sanity asset ──────────────────────────────────────────────────

async function fetchUnsplash(query) {
  if (!UNSPLASH_KEY) return null
  try {
    const url = `https://api.unsplash.com/search/photos?per_page=1&orientation=landscape&content_filter=high&query=${encodeURIComponent(query)}`
    const res = await fetch(url, { headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` } })
    if (!res.ok) {
      console.warn(`Unsplash search failed (${res.status}) for "${query}"`)
      return null
    }
    const data = await res.json()
    const photo = data.results?.[0]
    if (!photo) return null
    // Unsplash API guideline: trigger a download event when using a photo.
    fetch(photo.links.download_location, {
      headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` },
    }).catch(() => {})
    const imgRes = await fetch(photo.urls.regular)
    const buf = Buffer.from(await imgRes.arrayBuffer())
    return {
      buf,
      credit: `Photo by ${photo.user?.name || 'Unsplash'} on Unsplash`,
      describe: photo.alt_description || query,
    }
  } catch (err) {
    console.warn(`Unsplash error for "${query}": ${err.message}`)
    return null
  }
}

async function uploadImageBlock(query, alt, caption) {
  const photo = await fetchUnsplash(query)
  if (!photo) return null
  const asset = await client.assets.upload('image', photo.buf, {
    filename: `${query.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40)}.jpg`,
    contentType: 'image/jpeg',
  })
  return {
    assetId: asset._id,
    alt: alt || photo.describe,
    caption: caption ? `${caption} — ${photo.credit}` : photo.credit,
  }
}

// ── Sanity reference bootstrapping ───────────────────────────────────────────

async function ensureAuthor() {
  const existing = await client.fetch(`*[_type=="author" && slug.current==$slug][0]._id`, {
    slug: DEFAULT_AUTHOR.slug,
  })
  if (existing) return existing
  if (DRY_RUN) return 'dry-run-author'
  const created = await client.create({
    _type: 'author',
    name: DEFAULT_AUTHOR.name,
    slug: { _type: 'slug', current: DEFAULT_AUTHOR.slug },
    bio: DEFAULT_AUTHOR.bio,
  })
  console.log(`Created author: ${DEFAULT_AUTHOR.name}`)
  return created._id
}

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96)

async function ensureCategory(name) {
  const slug = slugify(name)
  const existing = await client.fetch(`*[_type=="category" && slug.current==$slug][0]._id`, { slug })
  if (existing) return existing
  if (DRY_RUN) return 'dry-run-category'
  const created = await client.create({
    _type: 'category',
    name,
    slug: { _type: 'slug', current: slug },
  })
  console.log(`Created category: ${name}`)
  return created._id
}

async function uniqueSlug(title) {
  const base = slugify(title)
  const taken = await client.fetch(`*[_type=="article" && slug.current match $p].slug.current`, {
    p: `${base}*`,
  })
  if (!taken.includes(base)) return base
  let i = 2
  while (taken.includes(`${base}-${i}`)) i++
  return `${base}-${i}`
}

// ── Generation ───────────────────────────────────────────────────────────────

const OUTPUT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    title: { type: 'string' },
    description: { type: 'string' },
    categoryName: { type: 'string' },
    tags: { type: 'array', items: { type: 'string' } },
    coverImageQuery: { type: 'string' },
    coverImageAlt: { type: 'string' },
    bodyMarkdown: { type: 'string' },
    inlineImages: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          afterHeading: { type: 'string' },
          query: { type: 'string' },
          alt: { type: 'string' },
          caption: { type: 'string' },
        },
        required: ['afterHeading', 'query', 'alt', 'caption'],
      },
    },
  },
  required: [
    'title',
    'description',
    'categoryName',
    'tags',
    'coverImageQuery',
    'coverImageAlt',
    'bodyMarkdown',
    'inlineImages',
  ],
}

const SYSTEM_PROMPT = `You are the editorial voice of Finaccru Infotech, a software engineering company. You write authoritative, genuinely useful blog articles for a technical-but-business audience (founders, CTOs, product leaders).

Finaccru Infotech's service areas:
${SERVICE_AREAS.map((s) => `- ${s}`).join('\n')}

Rules:
- Invent ONE fresh, specific, timely topic inside the service areas above. Prefer a concrete angle ("How to cut cloud spend with autoscaling policies") over a generic survey ("What is the cloud").
- Never repeat or lightly reword a topic from the "already published" list provided by the user.
- Voice: clear, confident, concrete. No fluff, no hype, no emoji. Lead with substance.
- Body in Markdown: ~900–1400 words. Use ## and ### headings to structure it. Do NOT include an H1 (the title is stored separately). Use bullet/numbered lists, bold for emphasis, and a short blockquote takeaway where it helps. Use fenced code blocks only when a code example genuinely adds value.
- description: 1–2 sentences (max ~160 chars) used on cards and meta tags.
- categoryName: pick the single best category for this post (e.g. "Cloud & DevOps", "Data & AI", "Cybersecurity", "Engineering", "Product"). Reuse one of the existing categories the user lists if a good fit; otherwise propose a clean new one.
- tags: 3–6 short lowercase tags.
- coverImageQuery: 2–4 word search phrase for a relevant, professional stock photo (used against Unsplash).
- coverImageAlt: descriptive alt text for the cover.
- inlineImages: 2–3 images to enrich the article visually. For each, "afterHeading" must be the EXACT text of a "##" or "###" heading in your body, after which the image will be inserted; "query" is the stock-photo search phrase; "alt" and "caption" describe it. Spread them across the article.`

async function generateArticle(recentTitles, existingCategories) {
  const userPrompt = `Write today's article.

Already published (do not repeat these topics):
${recentTitles.length ? recentTitles.map((t) => `- ${t}`).join('\n') : '- (none yet — this is the first post)'}

Existing categories (reuse if a good fit):
${existingCategories.length ? existingCategories.map((c) => `- ${c}`).join('\n') : '- (none yet)'}`

  const stream = anthropic.messages.stream({
    model: MODEL,
    max_tokens: 8000,
    thinking: { type: 'adaptive' },
    output_config: { effort: 'medium', format: { type: 'json_schema', schema: OUTPUT_SCHEMA } },
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userPrompt }],
  })
  const message = await stream.finalMessage()
  const textBlock = message.content.find((b) => b.type === 'text')
  if (!textBlock) throw new Error('No text block in Claude response')
  return JSON.parse(textBlock.text)
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n▶ Generating blog post (${DRY_RUN ? 'DRY RUN' : 'LIVE'}) with ${MODEL}\n`)

  const [recentTitles, existingCategories] = await Promise.all([
    client.fetch(`*[_type=="article"] | order(publishedAt desc)[0...40].title`),
    client.fetch(`*[_type=="category"].name`),
  ])

  console.log('1/5  Asking Claude for a topic + draft…')
  const article = await generateArticle(recentTitles || [], existingCategories || [])
  console.log(`     → "${article.title}"  [${article.categoryName}]`)

  console.log('2/5  Converting Markdown → Portable Text…')
  const body = markdownToBlocks(article.bodyMarkdown)

  console.log('3/5  Fetching + inserting images…')
  // Inline images: insert each after its target heading block.
  for (const img of article.inlineImages || []) {
    const idx = body.findIndex(
      (b) =>
        b._type === 'block' &&
        ['h2', 'h3', 'h4'].includes(b.style) &&
        blockText(b).trim().toLowerCase() === img.afterHeading.trim().toLowerCase(),
    )
    if (idx === -1) continue
    const uploaded = DRY_RUN
      ? { assetId: 'dry-run-asset', alt: img.alt, caption: img.caption }
      : await uploadImageBlock(img.query, img.alt, img.caption)
    if (!uploaded) continue
    body.splice(idx + 1, 0, {
      _type: 'image',
      _key: key(),
      alt: uploaded.alt,
      caption: uploaded.caption,
      asset: { _type: 'reference', _ref: uploaded.assetId },
    })
  }

  // Cover image.
  let coverImage
  const cover = DRY_RUN
    ? { assetId: 'dry-run-cover', alt: article.coverImageAlt }
    : await uploadImageBlock(article.coverImageQuery, article.coverImageAlt, '')
  if (cover) {
    coverImage = {
      _type: 'image',
      alt: cover.alt,
      asset: { _type: 'reference', _ref: cover.assetId },
    }
  }

  console.log('4/5  Resolving author + category + slug…')
  const [authorId, categoryId, slug] = await Promise.all([
    ensureAuthor(),
    ensureCategory(article.categoryName),
    uniqueSlug(article.title),
  ])

  const doc = {
    _type: 'article',
    title: article.title,
    slug: { _type: 'slug', current: slug },
    description: article.description,
    publishedAt: new Date().toISOString(),
    author: { _type: 'reference', _ref: authorId },
    category: { _type: 'reference', _ref: categoryId },
    tags: article.tags,
    featured: false,
    ...(coverImage ? { coverImage } : {}),
    body,
  }

  console.log('5/5  Publishing…')
  if (DRY_RUN) {
    console.log('\n--- DRY RUN: document that WOULD be created ---')
    console.log(JSON.stringify({ ...doc, body: `[${body.length} Portable Text blocks]` }, null, 2))
    console.log(`\n✓ Dry run complete. ${body.length} blocks, ${(article.inlineImages || []).length} inline image(s) requested.`)
    return
  }
  const created = await client.create(doc)
  console.log(`\n✓ Published: /article/${slug}  (id ${created._id})`)
}

main().catch((err) => {
  console.error('\n✗ Generation failed:', err)
  process.exit(1)
})
