import { createClient, type SanityClient } from '@sanity/client'
import { apiVersion, dataset, projectId } from '../env'

/**
 * Read-only Sanity client. Safe to import from anywhere — no token attached.
 *
 * This project runs on Cloudflare Workers (workerd) with the `nodejs_compat`
 * flag, so `process.env` is available at runtime via the Node compat layer —
 * a single client built from the resolved `projectId`/`dataset` (see `../env`)
 * serves both SSR server functions and the browser. CDN is on for cache-friendly
 * public reads, and the `published` perspective hides drafts.
 *
 * If the dataset is ever made private, set `SANITY_READ_TOKEN` and add
 * `token: process.env.SANITY_READ_TOKEN` below.
 */
export const client: SanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
})
