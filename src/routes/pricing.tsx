import { createFileRoute } from '@tanstack/react-router'
import Pricing from '@/components/pages/Pricing'

export const Route = createFileRoute('/pricing')({
  component: Pricing,
})
