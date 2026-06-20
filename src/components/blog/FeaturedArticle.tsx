import { Link } from '@tanstack/react-router'
import { ArrowRight, Clock } from 'lucide-react'
import type { SanityArticleSummary } from '@/lib/sanity.types'
import { Eyebrow } from '@/components/ui/primitives'
import { formatDate, readingLabel } from './format'

// The lead story on the blog index — a wide two-column editorial card.
export default function FeaturedArticle({ article }: { article: SanityArticleSummary }) {
  return (
    <Link
      to="/article/$slug"
      params={{ slug: article.slug }}
      className="press group grid overflow-hidden rounded-lg border border-hairline bg-canvas transition-shadow duration-300 hover:shadow-product lg:grid-cols-2"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-parchment lg:aspect-auto">
        {article.cover?.url ? (
          <img
            src={article.cover.url}
            alt={article.cover.alternativeText || article.title}
            className="h-full w-full object-cover transition-transform duration-500 ease-apple group-hover:scale-[1.03]"
          />
        ) : (
          <div className="h-full w-full bg-parchment" />
        )}
      </div>

      <div className="flex flex-col justify-center p-7 sm:p-10">
        <div className="flex items-center gap-3">
          <Eyebrow>Featured</Eyebrow>
          {article.category?.name && (
            <span className="text-fine font-medium text-ink-muted48">
              {article.category.name}
            </span>
          )}
        </div>

        <h2 className="mt-4 text-display-md font-semibold leading-tight tracking-[-0.01em] text-ink transition-colors group-hover:text-primary">
          {article.title}
        </h2>
        <p className="mt-4 line-clamp-3 text-body-lg leading-relaxed text-ink-muted80">
          {article.description}
        </p>

        <div className="mt-6 flex items-center gap-4 text-caption text-ink-muted48">
          <span>{formatDate(article.publishedAt)}</span>
          {article.readingTime ? (
            <span className="flex items-center gap-1.5">
              <Clock size={14} aria-hidden />
              {readingLabel(article.readingTime)}
            </span>
          ) : null}
        </div>

        <span className="mt-7 inline-flex items-center gap-1.5 text-body-lg font-medium text-primary">
          Read article
          <ArrowRight
            size={17}
            className="transition-transform duration-200 ease-apple group-hover:translate-x-1"
            aria-hidden
          />
        </span>
      </div>
    </Link>
  )
}
