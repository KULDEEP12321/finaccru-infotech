import { useEffect, useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { ChevronLeft, ChevronRight, Search, X } from 'lucide-react'
import type {
  SanityArticleSummary,
  SanityCategoryWithCount,
} from '@/lib/sanity.types'
import { Container, Eyebrow } from '@/components/ui/primitives'
import { Reveal } from '@/components/ui/Reveal'
import { cn } from '@/lib/cn'
import { siteConfig } from '@/lib/site-config'
import BlogCard from './BlogCard'
import FeaturedArticle from './FeaturedArticle'

type Pagination = {
  page: number
  pageSize: number
  pageCount: number
  total: number
}

type BlogListProps = {
  articles: SanityArticleSummary[]
  pagination: Pagination
  categories: SanityCategoryWithCount[]
  activeCategory?: string
  query?: string
}

export default function BlogList({
  articles,
  pagination,
  categories,
  activeCategory,
  query,
}: BlogListProps) {
  const navigate = useNavigate({ from: '/blog' })
  const [searchValue, setSearchValue] = useState(query ?? '')

  // Keep the input in sync if the URL search param changes (back/forward nav).
  useEffect(() => {
    setSearchValue(query ?? '')
  }, [query])

  const submitSearch = (value: string) => {
    const q = value.trim()
    navigate({
      search: (prev) => ({
        ...prev,
        q: q.length > 0 ? q : undefined,
        page: 1,
      }),
    })
  }

  // Only feature a lead story on the unfiltered first page.
  const isUnfiltered = pagination.page === 1 && !activeCategory && !query
  const featured = isUnfiltered
    ? (articles.find((a) => a.featured) ?? articles[0])
    : undefined
  const gridArticles = featured
    ? articles.filter((a) => a.id !== featured.id)
    : articles

  return (
    <Container className="py-16 sm:py-24">
      {/* Header */}
      <Reveal>
        <div className="max-w-content">
          <Eyebrow>Insights</Eyebrow>
          <h1 className="mt-3 text-display-lg font-semibold tracking-[-0.01em] text-ink sm:text-hero">
            The {siteConfig.shortName} blog
          </h1>
          <p className="mt-4 max-w-2xl text-lead-airy font-light text-ink-muted80">
            Engineering notes, product thinking, and field reports on building
            software that moves business forward.
          </p>
        </div>
      </Reveal>

      {/* Controls: search + category filter */}
      <div className="mt-10 flex flex-col gap-5 border-b border-hairline pb-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          <Link
            to="/blog"
            search={{ page: 1 }}
            className={cn(
              'press rounded-pill px-4 py-2 text-caption font-medium transition-colors',
              !activeCategory
                ? 'bg-ink text-white'
                : 'border border-hairline text-ink-muted80 hover:border-ink hover:text-ink',
            )}
          >
            All
          </Link>
          {categories.map((c) => {
            const active = activeCategory === c.slug
            return (
              <Link
                key={c.id}
                to="/blog"
                search={{ page: 1, category: c.slug }}
                className={cn(
                  'press rounded-pill px-4 py-2 text-caption font-medium transition-colors',
                  active
                    ? 'bg-ink text-white'
                    : 'border border-hairline text-ink-muted80 hover:border-ink hover:text-ink',
                )}
              >
                {c.name}
                <span className={cn('ml-1.5', active ? 'text-white/60' : 'text-ink-muted48')}>
                  {c.count}
                </span>
              </Link>
            )
          })}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            submitSearch(searchValue)
          }}
          className="relative w-full lg:w-72"
        >
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted48"
            aria-hidden
          />
          <input
            type="search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search articles"
            aria-label="Search articles"
            className="w-full rounded-pill border border-hairline bg-canvas py-2.5 pl-10 pr-9 text-caption text-ink outline-none transition-colors placeholder:text-ink-muted48 focus:border-primary"
          />
          {searchValue && (
            <button
              type="button"
              onClick={() => {
                setSearchValue('')
                submitSearch('')
              }}
              aria-label="Clear search"
              className="press absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted48 hover:text-ink"
            >
              <X size={15} />
            </button>
          )}
        </form>
      </div>

      {/* Empty state */}
      {articles.length === 0 ? (
        <div className="py-24 text-center">
          <p className="text-tagline font-semibold text-ink">No articles found</p>
          <p className="mt-2 text-body-lg text-ink-muted48">
            {query
              ? `Nothing matched “${query}”. Try a different search.`
              : 'Check back soon — new writing is on the way.'}
          </p>
        </div>
      ) : (
        <>
          {featured && (
            <Reveal className="mt-10">
              <FeaturedArticle article={featured} />
            </Reveal>
          )}

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {gridArticles.map((article, i) => (
              <Reveal key={article.id} delay={Math.min(i, 5) * 0.05}>
                <BlogCard article={article} />
              </Reveal>
            ))}
          </div>
        </>
      )}

      {/* Pagination */}
      {pagination.pageCount > 1 && (
        <nav
          className="mt-14 flex items-center justify-center gap-1.5"
          aria-label="Blog pagination"
        >
          <PageArrow
            direction="prev"
            disabled={pagination.page <= 1}
            page={pagination.page - 1}
            query={query}
            category={activeCategory}
          />
          {Array.from({ length: pagination.pageCount }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              to="/blog"
              search={{ page: p, q: query, category: activeCategory }}
              className={cn(
                'press grid h-10 min-w-10 place-items-center rounded-md px-3 text-caption font-medium transition-colors',
                p === pagination.page
                  ? 'bg-primary text-white'
                  : 'border border-hairline text-ink-muted80 hover:border-primary hover:text-primary',
              )}
            >
              {p}
            </Link>
          ))}
          <PageArrow
            direction="next"
            disabled={pagination.page >= pagination.pageCount}
            page={pagination.page + 1}
            query={query}
            category={activeCategory}
          />
        </nav>
      )}
    </Container>
  )
}

function PageArrow({
  direction,
  disabled,
  page,
  query,
  category,
}: {
  direction: 'prev' | 'next'
  disabled: boolean
  page: number
  query?: string
  category?: string
}) {
  const Icon = direction === 'prev' ? ChevronLeft : ChevronRight
  const label = direction === 'prev' ? 'Previous page' : 'Next page'

  if (disabled) {
    return (
      <span
        className="grid h-10 w-10 place-items-center rounded-md border border-divider text-hairline"
        aria-hidden
      >
        <Icon size={18} />
      </span>
    )
  }

  return (
    <Link
      to="/blog"
      search={{ page, q: query, category }}
      aria-label={label}
      className="press grid h-10 w-10 place-items-center rounded-md border border-hairline text-ink-muted80 transition-colors hover:border-primary hover:text-primary"
    >
      <Icon size={18} />
    </Link>
  )
}
