import { createFileRoute } from '@tanstack/react-router'
import Pricing from '@/components/pages/Pricing'
import { siteContent } from '@/lib/site-content'
const { pricing, faqs } = siteContent
import { pageTitle, siteConfig } from '@/lib/site-config'
import {
  seo,
  offerCatalogSchema,
  faqSchema,
  breadcrumbSchema,
} from '@/lib/seo'

const description =
  `${siteConfig.name} engagement models: fixed-scope projects, dedicated teams, and managed retainers. Transparent pricing built around how you want to work.`

export const Route = createFileRoute('/pricing')({
  head: () => ({
    ...seo({
      title: pageTitle('Pricing'),
      description,
      path: '/pricing',
      image: '/og/pricing.png',
      keywords:
        'software development pricing, dedicated team cost, fixed project pricing, managed IT retainer, engagement models',
    }),
    scripts: [
      offerCatalogSchema(
        pricing.map((p) => {
          // "from $18k" -> "18000"; "from $9k" -> "9000"; "Custom" -> undefined.
          const m = p.price.match(/([0-9]+)\s*(k)?/i)
          const price = m
            ? String(Number(m[1]) * (m[2] ? 1000 : 1))
            : undefined
          return {
            name: p.name,
            description: p.summary,
            price,
            priceCurrency: 'USD',
          }
        }),
      ),
      faqSchema(faqs.map((f) => ({ question: f.q, answer: f.a }))),
      breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Pricing', path: '/pricing' },
      ]),
    ],
  }),
  component: Pricing,
})
