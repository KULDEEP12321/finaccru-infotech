import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { installChunkRecovery } from './lib/chunk-recovery'

// Auto-reload past stale code-split chunks (no-op on the server). Installed at
// module load — the earliest point of client bootstrap, before any navigation —
// so a route chunk that 404s after a redeploy recovers instead of throwing
// "Failed to fetch dynamically imported module".
installChunkRecovery()

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
