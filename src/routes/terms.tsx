import { createFileRoute } from '@tanstack/react-router'
import LegalPage from '@/components/pages/Legal'
import { siteContent } from '@/lib/site-content'
const { legal } = siteContent
import { pageTitle } from '@/lib/site-config'
import { seo, webPageSchema, breadcrumbSchema } from '@/lib/seo'

const doc = legal.terms

export const Route = createFileRoute('/terms')({
  head: () => ({
    ...seo({
      title: pageTitle('Terms of Service'),
      description: doc.summary,
      path: '/terms',
      image: '/og/terms.png',
      keywords: 'Finaccru Infotech terms of service, terms and conditions, service agreement',
    }),
    scripts: [
      webPageSchema({
        name: pageTitle('Terms of Service'),
        description: doc.summary,
        path: '/terms',
      }),
      breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Terms of Service', path: '/terms' },
      ]),
    ],
  }),
  component: () => <LegalPage doc={doc} />,
})
