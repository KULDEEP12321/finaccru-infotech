import { siteConfig } from '@/lib/site-config'

// Environment + URL resolution — mirrored from the reference architecture's
// `urls` module. The reference resolves cross-subdomain app/auth base URLs for a
// SaaS (APP_URL / AUTH_URL) consumed by its auth flow. Finaccru is a single
// marketing site with no separate app or auth origin, so this module keeps the
// genuinely reusable half — environment detection — and exposes an env-aware
// SITE_URL in place of the app/auth URLs.
//
// The CANONICAL public URL for SEO (canonical tags, sitemap, JSON-LD) lives in
// site-config.ts as `siteConfig.url` and must be used there regardless of
// environment. This module is for runtime environment branching only.

export const isDevelopment = import.meta.env.MODE === 'development'
export const isStaging = import.meta.env.VITE_ENV === 'staging'
export const isProduction = import.meta.env.MODE === 'production'

// Env-aware origin: the local Vite dev server in development, the canonical
// production domain (single-sourced from site-config) otherwise. Use
// `siteConfig.url` directly for anything that must always be the canonical host.
export const SITE_URL = isDevelopment ? 'http://localhost:5173' : siteConfig.url

export const ENV = {
  isDevelopment,
  isStaging,
  isProduction,
  current: import.meta.env.MODE || 'development',
} as const
