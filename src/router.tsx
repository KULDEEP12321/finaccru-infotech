import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

// TanStack Start calls getRouter() on both server and client to build a fresh
// router per request (SSR) / once (client).
export function getRouter() {
  const router = createRouter({
    routeTree,
    defaultPreloadStaleTime: 0,
  })
  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
