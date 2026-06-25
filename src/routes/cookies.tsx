import { createFileRoute } from '@tanstack/react-router'
import LegalPage from '@/components/pages/Legal'
import { siteContent } from '@/lib/site-content'
const { legal } = siteContent
import { pageTitle } from '@/lib/site-config'
import { seo, webPageSchema, breadcrumbSchema } from '@/lib/seo'

const doc = legal.cookies

export const Route = createFileRoute('/cookies')({
  head: () => ({
    ...seo({
      title: pageTitle('Cookie Policy'),
      description: doc.summary,
      path: '/cookies',
      image: '/og/cookies.png',
      keywords: 'Finaccru Infotech cookie policy, cookies, tracking technologies',
    }),
    scripts: [
      webPageSchema({
        name: pageTitle('Cookie Policy'),
        description: doc.summary,
        path: '/cookies',
      }),
      breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Cookie Policy', path: '/cookies' },
      ]),
    ],
  }),
  component: () => <LegalPage doc={doc} />,
})
