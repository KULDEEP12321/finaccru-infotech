import { createServerFn } from '@tanstack/react-start'
import { client } from '../../sanity/lib/client'
import {
  ARTICLES_COUNT_QUERY,
  ARTICLES_PAGE_QUERY,
  ARTICLE_BY_SLUG_QUERY,
  CATEGORIES_WITH_COUNTS_QUERY,
  RECENT_POSTS_BY_AUTHOR_QUERY,
  ALL_TAGS_QUERY,
  RELATED_POSTS_QUERY,
} from '../../sanity/lib/queries'
import type {
  SanityArticle,
  SanityArticleSummary,
  SanityCategoryWithCount,
  SanityRecentPost,
} from './sanity.types'

/**
 * Sanity read layer, wrapped in TanStack Start server functions so GROQ runs on
 * the server (Cloudflare Workers) and the browser only ever sees the projected,
 * UI-friendly shapes in `sanity.types.ts`.
 *
 * The dataset is public, so a single token-less client (`sanity/lib/client.ts`)
 * serves every read — no Cloudflare Worker env binding is needed here. Each
 * handler is defensively wrapped: if Sanity isn't configured yet (placeholder
 * projectId) or a request fails, it returns an empty result and the UI renders
 * an empty state rather than throwing.
 */

type ArticlesPage = {
  articles: SanityArticleSummary[]
  pagination: {
    page: number
    pageSize: number
    pageCount: number
    total: number
  }
}

export const getArticles = createServerFn({ method: 'GET' })
  .validator(
    (data: { page?: number; pageSize?: number; query?: string; category?: string }) => data,
  )
  .handler(async ({ data }): Promise<ArticlesPage> => {
    const { page = 1, pageSize = 10, query, category } = data
    const validPage = !page || page < 1 ? 1 : page
    const start = (validPage - 1) * pageSize
    const end = start + pageSize

    try {
      // GROQ `match` wants a wildcard to behave like `containsi`; empty
      // string short-circuits the filter in the query body.
      const matchQuery = query && query.trim().length > 0 ? `*${query.trim()}*` : ''
      const categoryFilter = category && category.trim().length > 0 ? category.trim() : ''

      const [articles, total] = await Promise.all([
        client.fetch<SanityArticleSummary[]>(ARTICLES_PAGE_QUERY, {
          start,
          end,
          search: matchQuery,
          category: categoryFilter,
        }),
        client.fetch<number>(ARTICLES_COUNT_QUERY, {
          search: matchQuery,
          category: categoryFilter,
        }),
      ])

      const safeTotal = typeof total === 'number' ? total : 0
      const pageCount = Math.max(1, Math.ceil(safeTotal / pageSize))

      return {
        articles: articles ?? [],
        pagination: {
          page: validPage,
          pageSize,
          pageCount,
          total: safeTotal,
        },
      }
    } catch (error) {
      console.error('Error fetching articles from Sanity:', error)
      return {
        articles: [],
        pagination: { page: validPage, pageSize, pageCount: 1, total: 0 },
      }
    }
  })

export const getArticle = createServerFn({ method: 'GET' })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }): Promise<SanityArticle | null> => {
    try {
      const article = await client.fetch<SanityArticle | null>(ARTICLE_BY_SLUG_QUERY, {
        slug,
      })
      return article ?? null
    } catch (error) {
      console.error('Error fetching article from Sanity:', error)
      return null
    }
  })

export const getCategories = createServerFn({ method: 'GET' }).handler(
  async (): Promise<SanityCategoryWithCount[]> => {
    try {
      const categories = await client.fetch<
        Array<{
          id: string
          documentId: string
          name: string
          slug: string
          description: string | null
          count: number
        }>
      >(CATEGORIES_WITH_COUNTS_QUERY)

      return (categories ?? []).map((category) => ({
        id: category.id,
        documentId: category.documentId,
        name: category.name,
        slug: category.slug,
        description: category.description,
        count: category.count ?? 0,
      }))
    } catch (error) {
      console.error('Error fetching categories from Sanity:', error)
      return []
    }
  },
)

export const getRecentPostsByAuthor = createServerFn({ method: 'GET' })
  .validator((data: { authorSlug: string; currentId: string }) => data)
  .handler(async ({ data }): Promise<SanityRecentPost[]> => {
    try {
      const posts = await client.fetch<SanityRecentPost[]>(RECENT_POSTS_BY_AUTHOR_QUERY, {
        authorSlug: data.authorSlug,
        currentId: data.currentId,
      })
      return posts ?? []
    } catch (error) {
      console.error('Error fetching recent posts by author:', error)
      return []
    }
  })

export const getAllTags = createServerFn({ method: 'GET' }).handler(
  async (): Promise<string[]> => {
    try {
      const tags = await client.fetch<string[]>(ALL_TAGS_QUERY)
      return (tags ?? []).slice(0, 8)
    } catch (error) {
      console.error('Error fetching tags:', error)
      return []
    }
  },
)

export const getRelatedPosts = createServerFn({ method: 'GET' })
  .validator((data: { currentId: string; categoryId: string }) => data)
  .handler(async ({ data }): Promise<SanityArticleSummary[]> => {
    try {
      const posts = await client.fetch<SanityArticleSummary[]>(RELATED_POSTS_QUERY, {
        currentId: data.currentId,
        categoryId: data.categoryId,
      })
      return posts ?? []
    } catch (error) {
      console.error('Error fetching related posts:', error)
      return []
    }
  })
