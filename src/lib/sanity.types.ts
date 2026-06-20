/**
 * UI-facing Sanity content types.
 *
 * These shapes are produced by the GROQ projections in `sanity/lib/queries.ts`
 * — the server function maps Sanity's internal `_id` / `_type` / asset refs
 * into friendly field names so blog components don't have to know about
 * Sanity's internals.
 *
 * Note: we use a plain Record type for portable-text blocks rather than
 * importing `PortableTextBlock` from `@portabletext/react`. The library's
 * type uses `unknown` index signatures on `markDefs` which are incompatible
 * with TanStack Start's serialization inference (`{} vs unknown`). The
 * `<PortableText>` component accepts `value: unknown` anyway, so this is safe.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PortableTextBody = Record<string, any>[]

export type SanityImage = {
  url: string
  alternativeText: string
  width?: number
  height?: number
  caption?: string
}

export type SanityAuthor = {
  name: string
  slug?: string
  avatarUrl?: string
  bio?: string
}

export type SanityCategory = {
  name: string
  slug: string
  description?: string
}

export type SanityArticleSummary = {
  id: string
  slug: string
  title: string
  description: string
  cover: SanityImage | null
  publishedAt: string
  createdAt: string
  updatedAt: string
  author?: SanityAuthor | null
  category?: SanityCategory | null
  tags?: string[]
  featured?: boolean
  readingTime?: number
}

export type SanityArticle = SanityArticleSummary & {
  body: PortableTextBody
}

export type SanityCategoryWithCount = {
  id: number | string
  documentId: string
  name: string
  slug: string
  description: string | null
  count: number
}

export type SanityRecentPost = {
  id: string
  title: string
  slug: string
  publishedAt: string
  cover: { url: string; alternativeText: string } | null
}
