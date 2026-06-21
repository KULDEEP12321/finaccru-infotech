import { createFileRoute } from '@tanstack/react-router'
import LegalPage from '@/components/pages/Legal'
import { siteContent } from '@/lib/site-content'
const { legal } = siteContent
import { pageTitle } from '@/lib/site-config'
import { seo, webPageSchema, breadcrumbSchema } from '@/lib/seo'

const doc = legal.privacy

export const Route = createFileRoute('/privacy')({
  head: () => ({
    ...seo({
      title: pageTitle('Privacy Policy'),
      description: doc.summary,
      path: '/privacy',
      keywords: 'Finaccru Infotech privacy policy, data protection, personal information',
    }),
    scripts: [
      webPageSchema({
        name: pageTitle('Privacy Policy'),
        description: doc.summary,
        path: '/privacy',
      }),
      breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Privacy Policy', path: '/privacy' },
      ]),
    ],
  }),
  component: () => <LegalPage doc={doc} />,
})
