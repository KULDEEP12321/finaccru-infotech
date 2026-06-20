import createImageUrlBuilder from '@sanity/image-url'
import { dataset, projectId } from '../env'

// Config-driven (reads the same resolved projectId/dataset as the client). These
// are public values — they appear in every Sanity CDN URL — so building image
// URLs on the client is fine.
const imageBuilder = createImageUrlBuilder({ projectId, dataset })

/**
 * Returns a chainable image URL builder for a Sanity image reference.
 * Usage: `urlForImage(article.coverImage)?.width(1200).height(630).url()`
 */
export function urlForImage(source: unknown) {
  if (!source) return undefined
  return imageBuilder.image(source)
}
