import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import BlogList from '@/components/blog/BlogList'
import { getArticles, getCategories } from '@/lib/sanity.data'
import { pageTitle } from '@/lib/site-config'
import { seo, blogSchema, breadcrumbSchema } from '@/lib/seo'

const description =
  'Engineering notes, product thinking, and field reports from the Finaccru Infotech team on building custom software, cloud platforms, and intelligent systems.'

const parsePositivePage = (value: unknown) => {
  const page =
    typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : 1
  return Number.isFinite(page) && page > 0 ? Math.floor(page) : 1
}

const parseOptionalString = (value: unknown) =>
  typeof value === 'string' && value.length > 0 ? value : undefined

export const Route = createFileRoute('/blog')({
  // q/category typed optional so Links/navigates don't have to restate every
  // param — only `page` is always present.
  validateSearch: (search): { page: number; q?: string; category?: string } => ({
    page: parsePositivePage(search.page),
    q: parseOptionalString(search.q),
    category: parseOptionalString(search.category),
  }),
  loaderDeps: ({ search: { page, q, category } }) => ({ page, q, category }),
  loader: async ({ deps: { page, q, category } }) => {
    const [{ articles, pagination }, categories] = await Promise.all([
      getArticles({ data: { page, pageSize: 9, query: q, category } }),
      getCategories(),
    ])
    // If the requested page is beyond the last page and there are articles,
    // clamp to the last page so users don't see an empty grid.
    if (articles.length === 0 && pagination.total > 0 && page > 1) {
      const clamped = await getArticles({
        data: { page: pagination.pageCount, pageSize: 9, query: q, category },
      })
      return {
        articles: clamped.articles,
        pagination: clamped.pagination,
        q,
        categories,
        category,
      }
    }
    return { articles, pagination, q, categories, category }
  },
  head: () => ({
    ...seo({
      title: pageTitle('Blog'),
      description,
      path: '/blog',
      image: '/og/blog.png',
      keywords:
        'software engineering blog, custom software insights, cloud engineering, AI ML, Finaccru Infotech',
    }),
    scripts: [
      blogSchema({
        name: 'Finaccru Infotech Blog',
        description,
        path: '/blog',
      }),
      breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Blog', path: '/blog' },
      ]),
    ],
  }),
  component: BlogRouteComponent,
})

function BlogRouteComponent() {
  const { articles, pagination, categories, category, q } = Route.useLoaderData()
  const navigate = useNavigate({ from: '/blog' })

  // If the user lands on a page beyond the last page, redirect to page 1.
  useEffect(() => {
    if (articles.length === 0 && pagination.page > 1) {
      navigate({ search: { page: 1 } })
    }
  }, [articles.length, pagination.page, navigate])

  return (
    <div className="min-h-screen bg-canvas">
      <BlogList
        articles={articles}
        pagination={pagination}
        categories={categories}
        activeCategory={category}
        query={q}
      />
    </div>
  )
}
