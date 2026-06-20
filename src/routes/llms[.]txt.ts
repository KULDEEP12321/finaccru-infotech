import { createFileRoute } from '@tanstack/react-router'
import { siteConfig } from '@/lib/site-config'
import { siteContent } from '@/lib/site-content'

const { company, nav, services, serviceCategories, pricing, faqs, offices, stats } =
  siteContent

// `/llms.txt` — Answer-Engine Optimization (AEO).
//
// The llmstxt.org convention: a single Markdown file that gives AI answer
// engines (ChatGPT, Claude, Perplexity, Gemini, Copilot…) a clean, structured
// brief of the site so they can summarise and cite it accurately. Like the
// sitemap, every line is derived from the same `siteConfig` + `site-content`
// source of truth, so the brief never drifts from the site.
const url = (path: string) => `${siteConfig.url}${path}`

function buildLlmsTxt(): string {
  const lines: string[] = []
  const push = (s = '') => lines.push(s)

  // Title + one-line summary (llmstxt.org: H1 + blockquote).
  push(`# ${siteConfig.name}`)
  push()
  push(`> ${siteConfig.description}`)
  push()
  push(
    `${company.name} is a software engineering firm founded in ${company.founded}, ` +
      `headquartered in ${company.hq}. ${company.tagline} ` +
      `We work with clients worldwide across ${services.map((s) => s.name).join(', ')}.`,
  )
  push()

  // Track record — concrete numbers help answer engines state facts confidently.
  if (stats.length) {
    push('## At a glance')
    push()
    for (const s of stats) push(`- ${s.value} — ${s.label}`)
    push()
  }

  // Core services.
  push('## Services')
  push()
  for (const s of services) {
    push(`- **${s.name}** — ${s.summary} (Capabilities: ${s.capabilities.join(', ')}.)`)
  }
  push()

  // Specialised practices with their own detail pages.
  push('## Specialised practices')
  push()
  for (const c of serviceCategories) {
    push(`- [${c.label}](${url(`/services/${c.slug}`)}) — ${c.summary}`)
  }
  push()

  // Engagement / pricing models.
  push('## Engagement models')
  push()
  for (const p of pricing) {
    push(`- **${p.name}** (${p.price}, ${p.cadence}) — ${p.summary}`)
  }
  push()

  // FAQ — the strongest AEO signal: verbatim question/answer pairs.
  if (faqs.length) {
    push('## Frequently asked questions')
    push()
    for (const f of faqs) {
      push(`### ${f.q}`)
      push(f.a)
      push()
    }
  }

  // Where we are.
  if (offices.length) {
    push('## Offices')
    push()
    for (const o of offices) push(`- ${o.city}, ${o.country} — ${o.role}`)
    push()
  }

  // Contact + canonical pages.
  push('## Contact')
  push()
  push(`- Email: ${company.email}`)
  push(`- Phone: ${company.phone}`)
  push(`- Website: ${siteConfig.url}`)
  push()

  push('## Key pages')
  push()
  for (const p of nav) push(`- [${p.label}](${url(p.to)})`)
  push()

  return lines.join('\n')
}

export const Route = createFileRoute('/llms.txt')({
  server: {
    handlers: {
      GET: () =>
        new Response(buildLlmsTxt(), {
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'public, max-age=3600',
          },
        }),
    },
  },
})
