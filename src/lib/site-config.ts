// Single source of truth for SEO/site identity.
// Every canonical URL, OG tag, sitemap <loc>, and JSON-LD block reads from here,
// so flipping the production domain or share image is a one-line change.

export const siteConfig = {
  name: 'Finaccru Infotech',
  shortName: 'Finaccru',
  // %s is replaced with the page title; the home page uses `title` verbatim.
  titleTemplate: '%s | Finaccru Infotech',
  defaultTitle: 'Finaccru Infotech — Custom Software, Cloud & AI Engineering',
  description:
    'Finaccru Infotech is a Dubai software company that designs, builds, and runs custom software, cloud & DevOps, mobile & web apps, data, AI & ML, and cybersecurity — plus penetration testing, managed IT, and dedicated developers to hire.',
  // Canonical production host. Every canonical tag, OG/share URL, sitemap <loc>,
  // robots Sitemap line, and JSON-LD @id reads from here, so flipping the brand
  // domain is a one-line change. Attach this domain to the Cloudflare Worker
  // deployment (custom domain / route) so these URLs resolve on the live host.
  url: 'https://finaccruinfotech.com',
  // Bare host (no scheme) — used for SMTP EHLO and anywhere a hostname (not a
  // full URL) is required. Kept in lock-step with `url` above.
  domain: 'finaccruinfotech.com',
  locale: 'en_US',
  themeColor: '#FFFAF0', // cream canvas — matches the Clay top-nav (design2.md)
  // Branded 1200x630 share card served from /public.
  ogImage: '/og-image.png',
  ogImageWidth: '1200',
  ogImageHeight: '630',
  // Social handles — leave a value empty to omit the corresponding tag.
  twitterHandle: '',
  email: 'hello@finaccru.com',
  phone: '+971 4 000 0000',
  // Geographic service scope advertised in the `Service` JSON-LD (schema.org).
  areaServed: 'Worldwide',
  // Same-as profiles strengthen the Organization knowledge-graph entry. Add real
  // profile URLs as they go live; empty entries are filtered out before render.
  sameAs: [] as string[],
} as const

// Build an absolute URL from a site-relative path (idempotent for absolute input).
export function absoluteUrl(path = '/'): string {
  if (/^https?:\/\//i.test(path)) return path
  return `${siteConfig.url}${path.startsWith('/') ? path : `/${path}`}`
}

// Apply the brand title template (e.g. "Services" -> "Services | Finaccru Infotech").
export function pageTitle(title: string): string {
  return siteConfig.titleTemplate.replace('%s', title)
}
