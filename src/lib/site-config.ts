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
    'Finaccru Infotech designs, builds, and runs custom software, cloud platforms, and intelligent systems for ambitious businesses.',
  // The intended production domain (currently also live on Vercel). All canonical
  // URLs point here so the canonical host is indexed, not the preview deployment.
  url: 'https://finaccruinfotech.com',
  locale: 'en_US',
  themeColor: '#0A0A0A',
  // Branded 1200x630 share card served from /public.
  ogImage: '/og-image.png',
  ogImageWidth: '1200',
  ogImageHeight: '630',
  // Social handles — leave a value empty to omit the corresponding tag.
  twitterHandle: '',
  email: 'hello@finaccru.com',
  phone: '+971 4 000 0000',
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
