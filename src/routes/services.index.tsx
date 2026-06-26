import { createFileRoute } from '@tanstack/react-router'
import Services from '@/components/pages/Services'
import { siteContent } from '@/lib/site-content'
const { serviceCategories } = siteContent
import { pageTitle, siteConfig } from '@/lib/site-config'
import { seo, collectionSchema, breadcrumbSchema } from '@/lib/seo'

const description =
  `Explore ${siteConfig.name} services: AI & ML development, custom software, mobile apps, cloud & DevOps, cybersecurity, and managed IT — engineered end-to-end.`

export const Route = createFileRoute('/services/')({
  head: () => ({
    ...seo({
      title: pageTitle('Services'),
      description,
      path: '/services',
      image: '/og/services.png',
      keywords:
        'software development services, AI ML development, mobile app development, cloud DevOps, cybersecurity, managed IT services',
    }),
    scripts: [
      collectionSchema({
        name: `${siteConfig.name} Services`,
        description,
        path: '/services',
        items: serviceCategories.map((c) => ({
          name: c.label,
          path: `/services/${c.slug}`,
        })),
      }),
      breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Services', path: '/services' },
      ]),
    ],
  }),
  component: Services,
})
