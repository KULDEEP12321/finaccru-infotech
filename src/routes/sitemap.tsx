import { createFileRoute } from '@tanstack/react-router'
import Sitemap from '@/components/pages/Sitemap'
import { pageTitle, siteConfig } from '@/lib/site-config'
import { seo, webPageSchema, breadcrumbSchema } from '@/lib/seo'

const description =
  `A human-readable index of every page on the ${siteConfig.name} website — services, company, and legal.`

export const Route = createFileRoute('/sitemap')({
  head: () => ({
    ...seo({
      title: pageTitle('Sitemap'),
      description,
      path: '/sitemap',
      image: '/og/sitemap.png',
      keywords: `${siteConfig.name} sitemap, site index, all pages`,
    }),
    scripts: [
      webPageSchema({
        name: pageTitle('Sitemap'),
        description,
        path: '/sitemap',
      }),
      breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Sitemap', path: '/sitemap' },
      ]),
    ],
  }),
  component: Sitemap,
})
