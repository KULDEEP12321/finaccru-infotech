import { createFileRoute } from '@tanstack/react-router'
import Home from '@/components/pages/Home'
import { siteConfig } from '@/lib/site-config'
import { seo, webPageSchema } from '@/lib/seo'

export const Route = createFileRoute('/')({
  head: () => ({
    ...seo({
      title: siteConfig.defaultTitle,
      description: siteConfig.description,
      path: '/',
      keywords:
        'custom software development, cloud and DevOps, AI and ML development, mobile app development, cybersecurity services, managed IT, software company Dubai',
    }),
    // Organization + WebSite are emitted globally in __root; the home page adds
    // a WebPage entry so the landing URL has its own node in the graph.
    scripts: [
      webPageSchema({
        name: siteConfig.defaultTitle,
        description: siteConfig.description,
        path: '/',
      }),
    ],
  }),
  component: Home,
})
