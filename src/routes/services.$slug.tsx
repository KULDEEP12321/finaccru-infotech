import { createFileRoute } from '@tanstack/react-router'
import ServiceCategory from '@/components/pages/ServiceCategory'
import { siteContent } from '@/lib/site-content'
const { serviceCategories } = siteContent
import { pageTitle, siteConfig } from '@/lib/site-config'
import { seo, serviceSchema, breadcrumbSchema, howToSchema } from '@/lib/seo'

export const Route = createFileRoute('/services/$slug')({
  head: ({ params }) => {
    const cat = serviceCategories.find((c) => c.slug === params.slug)

    // Unknown slug -> the component renders NotFound, so keep it out of the index.
    if (!cat) {
      return {
        ...seo({
          title: pageTitle('Service not found'),
          path: `/services/${params.slug}`,
          noindex: true,
        }),
      }
    }

    const path = `/services/${cat.slug}`
    return {
      ...seo({
        title: pageTitle(cat.label),
        description: cat.summary,
        path,
        // Per-service share card; drop `public/og/services/<slug>.png` to replace.
        image: `/og/services/${cat.slug}.png`,
        keywords: cat.subservices.map((s) => s.title).join(', '),
      }),
      scripts: [
        serviceSchema({
          name: cat.name,
          description: cat.summary,
          path,
          serviceType: cat.name,
        }),
        breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Services', path: '/services' },
          { name: cat.label, path },
        ]),
        // HowTo only where the page actually renders a visible process staircase
        // (ServiceCategory renders `cat.process`). Built from the same source so
        // the structured data always matches on-page content.
        ...(cat.process
          ? [
              howToSchema({
                name: `How ${siteConfig.name} delivers ${cat.label}`,
                description: cat.summary,
                steps: cat.process.map((s) => ({ name: s.title, text: s.body })),
              }),
            ]
          : []),
      ],
    }
  },
  component: ServiceCategoryRoute,
})

function ServiceCategoryRoute() {
  const { slug } = Route.useParams()
  return <ServiceCategory slug={slug} />
}
