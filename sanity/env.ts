/**
 * Sanity project environment configuration.
 *
 * Resolution order (first defined wins):
 *   1. Vite build-time env  — `import.meta.env.VITE_SANITY_*`  (Studio + browser)
 *   2. Runtime process env  — `process.env.SANITY_*`          (Nitro/Vercel SSR)
 *   3. The hard-coded defaults below.
 *
 * These are PUBLIC values — the projectId/dataset appear in every Sanity CDN
 * URL — so they are safe to ship to the browser. No read token is needed while
 * the dataset is public (`Allow unauthenticated reads` in Sanity settings).
 *
 * ── Point at a DIFFERENT Finaccru project ─────────────────────────────────
 * The live project id is baked in as the default below (it is public, so this
 * is safe and keeps the CLI / Vercel / fresh clones working with zero config).
 * To target another project/dataset (e.g. a `staging` dataset) without editing
 * source, create a `.env`:
 *   VITE_SANITY_PROJECT_ID=xxxxxxxx
 *   VITE_SANITY_DATASET=production
 */

type ViteEnv = {
  VITE_SANITY_PROJECT_ID?: string
  VITE_SANITY_DATASET?: string
  VITE_SANITY_API_VERSION?: string
}

// Live Finaccru Infotech Sanity project (org "Finaccru Infotech", id oTX5BdNtV).
// These are PUBLIC values — the projectId appears in every Sanity CDN URL — so
// baking them in as defaults is safe and lets every context (Vite, Nitro SSR on
// Vercel, and the plain-Node Sanity CLI, which doesn't read `.env`) resolve the
// project without extra wiring. Override via the VITE_/SANITY_ env vars above.
export const defaultProjectId = '2jhreob8'
export const defaultDataset = 'production'
export const defaultApiVersion = '2024-12-01'

// Sentinel kept so `isSanityConfigured` still means "a real project is wired in"
// rather than the original placeholder — defensive guards key off this.
const PLACEHOLDER_PROJECT_ID = 'your-project-id'

const viteEnv: ViteEnv =
  typeof import.meta !== 'undefined' &&
  (import.meta as unknown as { env?: ViteEnv }).env
    ? ((import.meta as unknown as { env: ViteEnv }).env ?? {})
    : {}

const processEnv =
  typeof process !== 'undefined' && process.env ? process.env : ({} as NodeJS.ProcessEnv)

export const projectId =
  viteEnv.VITE_SANITY_PROJECT_ID ||
  processEnv.SANITY_PROJECT_ID ||
  defaultProjectId

export const dataset =
  viteEnv.VITE_SANITY_DATASET ||
  processEnv.SANITY_DATASET ||
  defaultDataset

export const apiVersion =
  viteEnv.VITE_SANITY_API_VERSION ||
  processEnv.SANITY_API_VERSION ||
  defaultApiVersion

/** True once a real project id has been configured (not the placeholder). */
export const isSanityConfigured = projectId !== PLACEHOLDER_PROJECT_ID
