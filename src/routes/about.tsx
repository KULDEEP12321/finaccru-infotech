import { createFileRoute } from '@tanstack/react-router'
import About from '@/components/pages/About'
import { siteContent } from '@/lib/site-content'
const { company } = siteContent
import { pageTitle } from '@/lib/site-config'
import { seo, webPageSchema, breadcrumbSchema } from '@/lib/seo'

const description = `${company.name} is an engineering team that designs, builds, and runs custom software, cloud platforms, and intelligent systems. Founded ${company.founded}, headquartered in ${company.hq}.`

export const Route = createFileRoute('/about')({
  head: () => ({
    ...seo({
      title: pageTitle('About'),
      description,
      path: '/about',
      keywords:
        'about Finaccru Infotech, software engineering team, Dubai software company, custom software experts',
    }),
    scripts: [
      webPageSchema({
        name: pageTitle('About'),
        description,
        path: '/about',
        type: 'AboutPage',
      }),
      breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
      ]),
    ],
  }),
  component: About,
})
