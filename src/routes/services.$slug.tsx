import { createFileRoute } from '@tanstack/react-router'
import ServiceCategory from '@/components/pages/ServiceCategory'

export const Route = createFileRoute('/services/$slug')({
  component: ServiceCategoryRoute,
})

function ServiceCategoryRoute() {
  const { slug } = Route.useParams()
  return <ServiceCategory slug={slug} />
}
