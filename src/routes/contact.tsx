import { createFileRoute } from '@tanstack/react-router'
import Contact from '@/components/pages/Contact'
import { pageTitle, siteConfig } from '@/lib/site-config'
import { seo, webPageSchema, breadcrumbSchema } from '@/lib/seo'

const description =
  `Get in touch with ${siteConfig.name} to scope a project, build a dedicated team, or talk through a managed engagement. We typically reply within one business day.`

export const Route = createFileRoute('/contact')({
  head: () => ({
    ...seo({
      title: pageTitle('Contact'),
      description,
      path: '/contact',
      image: '/og/contact.png',
      keywords:
        `contact ${siteConfig.name}, hire software developers, start a software project, software consultation`,
    }),
    scripts: [
      webPageSchema({
        name: pageTitle('Contact'),
        description,
        path: '/contact',
        type: 'ContactPage',
      }),
      breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Contact', path: '/contact' },
      ]),
    ],
  }),
  component: Contact,
})
