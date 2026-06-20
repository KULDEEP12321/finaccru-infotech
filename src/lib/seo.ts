// SEO + LLMO utilities for TanStack Start.
// Pattern adapted from the reference build (Zapify) but rewritten to read from
// our single `siteConfig` source of truth so there are no hard-coded strings.
//
//   meta/links  -> route `head()` spreads these into the document head.
//   *Schema()   -> JSON-LD <script> objects passed to route `head().scripts`.
//
// Docs: https://tanstack.com/start/latest/docs/framework/react/guide/seo

import { siteConfig, absoluteUrl } from './site-config'

type JsonLd = { type: 'application/ld+json'; children: string }

const jsonLd = (data: Record<string, unknown>): JsonLd => ({
  type: 'application/ld+json',
  children: JSON.stringify({ '@context': 'https://schema.org', ...data }),
})

// ── Page meta + canonical ─────────────────────────────────────────────────

export interface SeoInput {
  /** Full <title>. Pass the final string; we don't auto-template here. */
  title: string
  description?: string
  /** Site-relative path (e.g. "/services"); drives canonical + og:url. */
  path?: string
  /** Share image, relative or absolute. Defaults to the site OG image. */
  image?: string
  type?: 'website' | 'article' | 'profile'
  keywords?: string
  /** Set true to emit `noindex, nofollow` (e.g. thank-you / preview pages). */
  noindex?: boolean
  publishedTime?: string
  modifiedTime?: string
  author?: string
}

/**
 * Build the `meta` + `links` (canonical) for a route head.
 * Spread into `head()`:  `head: () => ({ ...seo({ ... }) })`
 */
export function seo(input: SeoInput): {
  meta: Array<Record<string, string>>
  links: Array<Record<string, string>>
} {
  const url = absoluteUrl(input.path ?? '/')
  const image = absoluteUrl(input.image ?? siteConfig.ogImage)
  const description = input.description ?? siteConfig.description

  const meta: Array<Record<string, string>> = [
    { title: input.title },
    { name: 'description', content: description },
    {
      name: 'robots',
      content: input.noindex ? 'noindex, nofollow' : 'index, follow',
    },
    // Open Graph
    { property: 'og:title', content: input.title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: url },
    { property: 'og:site_name', content: siteConfig.name },
    { property: 'og:type', content: input.type ?? 'website' },
    { property: 'og:locale', content: siteConfig.locale },
    { property: 'og:image', content: image },
    { property: 'og:image:width', content: siteConfig.ogImageWidth },
    { property: 'og:image:height', content: siteConfig.ogImageHeight },
    { property: 'og:image:alt', content: input.title },
    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: input.title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:url', content: url },
    { name: 'twitter:image', content: image },
  ]

  if (siteConfig.twitterHandle) {
    meta.push({ name: 'twitter:site', content: siteConfig.twitterHandle })
    meta.push({ name: 'twitter:creator', content: siteConfig.twitterHandle })
  }
  if (input.keywords) meta.push({ name: 'keywords', content: input.keywords })
  if (input.author) meta.push({ name: 'author', content: input.author })
  if (input.publishedTime)
    meta.push({ property: 'article:published_time', content: input.publishedTime })
  if (input.modifiedTime)
    meta.push({ property: 'article:modified_time', content: input.modifiedTime })

  return { meta, links: [{ rel: 'canonical', href: url }] }
}

// ── JSON-LD builders ───────────────────────────────────────────────────────

/** Organization knowledge-graph entry. Emit once, globally (root route). */
export function organizationSchema(): JsonLd {
  const sameAs = siteConfig.sameAs.filter(Boolean)
  return jsonLd({
    '@type': 'Organization',
    '@id': `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    url: siteConfig.url,
    logo: { '@type': 'ImageObject', url: absoluteUrl(siteConfig.ogImage) },
    description: siteConfig.description,
    ...(sameAs.length ? { sameAs } : {}),
    contactPoint: {
      '@type': 'ContactPoint',
      email: siteConfig.email,
      telephone: siteConfig.phone,
      contactType: 'Customer Support',
    },
  })
}

/** WebSite entry — enables the search/sitelinks treatment in results. */
export function webSiteSchema(): JsonLd {
  return jsonLd({
    '@type': 'WebSite',
    '@id': `${siteConfig.url}/#website`,
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    publisher: { '@id': `${siteConfig.url}/#organization` },
  })
}

/** Generic WebPage / AboutPage / ContactPage. */
export function webPageSchema(page: {
  name: string
  description: string
  path: string
  type?: 'WebPage' | 'AboutPage' | 'ContactPage'
}): JsonLd {
  return jsonLd({
    '@type': page.type ?? 'WebPage',
    name: page.name,
    description: page.description,
    url: absoluteUrl(page.path),
    isPartOf: { '@id': `${siteConfig.url}/#website` },
    publisher: { '@id': `${siteConfig.url}/#organization` },
  })
}

/** A single service offering (Service detail pages). */
export function serviceSchema(service: {
  name: string
  description: string
  path: string
  serviceType?: string
}): JsonLd {
  return jsonLd({
    '@type': 'Service',
    name: service.name,
    description: service.description,
    url: absoluteUrl(service.path),
    ...(service.serviceType ? { serviceType: service.serviceType } : {}),
    provider: { '@id': `${siteConfig.url}/#organization` },
    areaServed: 'Worldwide',
  })
}

/** Breadcrumb trail for any nested page. */
export function breadcrumbSchema(
  items: { name: string; path: string }[],
): JsonLd {
  return jsonLd({
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  })
}

/** ItemList / CollectionPage for index pages (e.g. /services). */
export function collectionSchema(collection: {
  name: string
  description: string
  path: string
  items: { name: string; path: string }[]
}): JsonLd {
  return jsonLd({
    '@type': 'CollectionPage',
    name: collection.name,
    description: collection.description,
    url: absoluteUrl(collection.path),
    isPartOf: { '@id': `${siteConfig.url}/#website` },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: collection.items.length,
      itemListElement: collection.items.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: item.name,
        url: absoluteUrl(item.path),
      })),
    },
  })
}

/** FAQPage rich-result schema. */
export function faqSchema(
  faqs: { question: string; answer: string }[],
): JsonLd {
  return jsonLd({
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  })
}

/** HowTo rich-result schema — step-by-step process / guide content. */
export function howToSchema(howTo: {
  name: string
  description: string
  steps: { name: string; text: string }[]
}): JsonLd {
  return jsonLd({
    '@type': 'HowTo',
    name: howTo.name,
    description: howTo.description,
    step: howTo.steps.map((step, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: step.name,
      text: step.text,
    })),
  })
}

/** Offer catalogue for the pricing page. `price` is omitted for custom plans. */
export function offerCatalogSchema(plans: {
  name: string
  description: string
  price?: string
  priceCurrency: string
}[]): JsonLd {
  return jsonLd({
    '@type': 'OfferCatalog',
    name: `${siteConfig.name} engagement models`,
    url: absoluteUrl('/pricing'),
    itemListElement: plans.map((plan) => ({
      '@type': 'Offer',
      name: plan.name,
      description: plan.description,
      ...(plan.price
        ? { price: plan.price, priceCurrency: plan.priceCurrency }
        : {}),
      availability: 'https://schema.org/InStock',
      seller: { '@id': `${siteConfig.url}/#organization` },
    })),
  })
}

/** Blog index entry — declares the /blog collection to search engines. */
export function blogSchema(blog: {
  name: string
  description: string
  path: string
}): JsonLd {
  return jsonLd({
    '@type': 'Blog',
    name: blog.name,
    description: blog.description,
    url: absoluteUrl(blog.path),
    isPartOf: { '@id': `${siteConfig.url}/#website` },
    publisher: { '@id': `${siteConfig.url}/#organization` },
  })
}

/** BlogPosting rich-result schema for a single article. */
export function articleSchema(article: {
  headline: string
  description: string
  path: string
  image?: string
  datePublished?: string
  dateModified?: string
  authorName?: string
  authorPath?: string
}): JsonLd {
  const url = absoluteUrl(article.path)
  return jsonLd({
    '@type': 'BlogPosting',
    headline: article.headline,
    description: article.description,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    image: absoluteUrl(article.image ?? siteConfig.ogImage),
    ...(article.datePublished ? { datePublished: article.datePublished } : {}),
    ...(article.dateModified ? { dateModified: article.dateModified } : {}),
    author: article.authorName
      ? {
          '@type': 'Person',
          name: article.authorName,
          ...(article.authorPath ? { url: absoluteUrl(article.authorPath) } : {}),
        }
      : { '@id': `${siteConfig.url}/#organization` },
    publisher: { '@id': `${siteConfig.url}/#organization` },
  })
}
