import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router'
import { sanityStudioHead } from '@/components/SanityStudioMeta'

export const Route = createFileRoute('/studio/$')({
  head: sanityStudioHead,
  component: lazyRouteComponent(
    () => import('@/components/SanityStudio'),
    'SanityStudio',
  ),
})
