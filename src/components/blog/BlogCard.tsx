import { Link } from '@tanstack/react-router'
import { ArrowUpRight, Clock } from 'lucide-react'
import type { SanityArticleSummary } from '@/lib/sanity.types'
import { formatDate, readingLabel } from './format'

// One article card for the blog grid. Hairline-bordered, soft hover lift, the
// single Action-Blue accent on the category + hover affordance.
export default function BlogCard({ article }: { article: SanityArticleSummary }) {
  return (
    <Link
      to="/article/$slug"
      params={{ slug: article.slug }}
      className="press group flex flex-col overflow-hidden rounded-lg border border-hairline bg-canvas transition-shadow duration-300 hover:shadow-product"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-parchment">
        {article.cover?.url ? (
          <img
            src={article.cover.url}
            alt={article.cover.alternativeText || article.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-apple group-hover:scale-[1.03]"
          />
        ) : (
          <div className="h-full w-full bg-parchment" />
        )}
        {article.category?.name && (
          <span className="absolute left-3 top-3 rounded-pill bg-canvas/90 px-3 py-1 text-fine font-medium text-primary backdrop-blur">
            {article.category.name}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="text-tagline font-semibold leading-snug text-ink transition-colors group-hover:text-primary">
          {article.title}
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-caption leading-relaxed text-ink-muted48">
          {article.description}
        </p>

        <div className="mt-5 flex items-center justify-between border-t border-divider pt-4 text-fine text-ink-muted48">
          <span className="flex items-center gap-3">
            <span>{formatDate(article.publishedAt)}</span>
            {article.readingTime ? (
              <span className="flex items-center gap-1">
                <Clock size={12} aria-hidden />
                {readingLabel(article.readingTime)}
              </span>
            ) : null}
          </span>
          <ArrowUpRight
            size={16}
            className="text-ink-muted48 transition-colors group-hover:text-primary"
            aria-hidden
          />
        </div>
      </div>
    </Link>
  )
}
