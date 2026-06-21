import { createFileRoute } from '@tanstack/react-router'
import { siteConfig } from '@/lib/site-config'
import { siteContent } from '@/lib/site-content'
const { serviceCategories } = siteContent
import { client } from '../../sanity/lib/client'
import { ALL_ARTICLE_SLUGS_QUERY } from '../../sanity/lib/queries'

// Static base pages are derived from the route map plus the service catalogue,
// so new service slugs appear automatically. Blog article URLs are pulled live
// from Sanity at request time (with a safe fallback if Sanity isn't reachable).
type Entry = { path: string; changefreq: string; priority: string; lastmod?: string }

const staticPages: Entry[] = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/services', changefreq: 'weekly', priority: '0.9' },
  { path: '/pricing', changefreq: 'monthly', priority: '0.8' },
  { path: '/blog', changefreq: 'weekly', priority: '0.8' },
  { path: '/about', changefreq: 'monthly', priority: '0.7' },
  { path: '/contact', changefreq: 'monthly', priority: '0.7' },
  { path: '/sitemap', changefreq: 'monthly', priority: '0.3' },
  { path: '/privacy', changefreq: 'yearly', priority: '0.3' },
  { path: '/terms', changefreq: 'yearly', priority: '0.3' },
  { path: '/cookies', changefreq: 'yearly', priority: '0.3' },
]

const servicePages: Entry[] = serviceCategories.map((c) => ({
  path: `/services/${c.slug}`,
  changefreq: 'monthly',
  priority: '0.8',
}))

async function articlePages(): Promise<Entry[]> {
  try {
    const articles = await client.fetch<Array<{ slug: string; updatedAt?: string }>>(
      ALL_ARTICLE_SLUGS_QUERY,
    )
    return (articles ?? [])
      .filter((a) => a?.slug)
      .map((a) => ({
        path: `/article/${a.slug}`,
        changefreq: 'monthly',
        priority: '0.7',
        lastmod: a.updatedAt,
      }))
  } catch {
    // Sanity not configured / unreachable — ship the static map only.
    return []
  }
}

function buildSitemap(entries: Entry[]): string {
  const urls = entries
    .map(
      (page) => `  <url>
    <loc>${siteConfig.url}${page.path}</loc>${
        page.lastmod ? `\n    <lastmod>${page.lastmod}</lastmod>` : ''
      }
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`,
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`
}

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async () => {
        const entries = [...staticPages, ...servicePages, ...(await articlePages())]
        return new Response(buildSitemap(entries), {
          headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=3600',
          },
        })
      },
    },
  },
})
