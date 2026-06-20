import { Link } from '@tanstack/react-router'
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react'
import type {
  SanityArticle,
  SanityArticleSummary,
  SanityCategoryWithCount,
  SanityRecentPost,
} from '@/lib/sanity.types'
import type { PortableTextBody } from '@/lib/sanity.types'
import { Container } from '@/components/ui/primitives'
import { formatDate, readingLabel } from './format'
import BlogCard from './BlogCard'
import PortableTextRenderer from './portable-text-renderer'

type BlogPostProps = {
  article: SanityArticle
  categories: SanityCategoryWithCount[]
  recentPosts: SanityRecentPost[]
  popularTags: string[]
  relatedPosts: SanityArticleSummary[]
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

// Pull H2/H3 headings from the portable-text body for the table of contents.
// Anchors use the same slugify as the renderer so in-page links line up.
function extractHeadings(body: PortableTextBody) {
  if (!Array.isArray(body)) return []
  return body
    .filter(
      (block) =>
        block?._type === 'block' && (block.style === 'h2' || block.style === 'h3'),
    )
    .map((block) => {
      const text = Array.isArray(block.children)
        ? block.children.map((c: { text?: string }) => c.text ?? '').join('')
        : ''
      return { text, id: slugify(text), level: block.style as 'h2' | 'h3' }
    })
    .filter((h) => h.text.length > 0)
}

export default function BlogPost({
  article,
  recentPosts,
  popularTags,
  relatedPosts,
}: BlogPostProps) {
  const headings = extractHeadings(article.body)

  return (
    <article className="bg-canvas">
      {/* Header */}
      <Container width="content" className="pb-10 pt-12 sm:pt-16">
        <Link
          to="/blog"
          search={{ page: 1 }}
          className="press inline-flex items-center gap-1.5 text-caption font-medium text-ink-muted48 transition-colors hover:text-primary"
        >
          <ArrowLeft size={15} aria-hidden />
          Back to blog
        </Link>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          {article.category?.name && (
            <Link
              to="/blog"
              search={{ page: 1, category: article.category.slug }}
              className="press rounded-pill bg-parchment px-3 py-1 text-fine font-medium text-primary"
            >
              {article.category.name}
            </Link>
          )}
        </div>

        <h1 className="mt-4 text-display-md font-semibold leading-tight tracking-[-0.01em] text-ink sm:text-display-lg">
          {article.title}
        </h1>
        <p className="mt-5 text-lead-airy font-light text-ink-muted80">
          {article.description}
        </p>

        {/* Byline */}
        <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 border-y border-hairline py-5">
          {article.author && (
            <div className="flex items-center gap-3">
              {article.author.avatarUrl ? (
                <img
                  src={article.author.avatarUrl}
                  alt={article.author.name}
                  className="h-10 w-10 rounded-pill object-cover"
                />
              ) : (
                <span className="grid h-10 w-10 place-items-center rounded-pill bg-primary text-caption font-semibold text-white">
                  {article.author.name.charAt(0)}
                </span>
              )}
              <span className="text-caption font-medium text-ink">
                {article.author.name}
              </span>
            </div>
          )}
          <span className="flex items-center gap-1.5 text-caption text-ink-muted48">
            <Calendar size={14} aria-hidden />
            {formatDate(article.publishedAt)}
          </span>
          {article.readingTime ? (
            <span className="flex items-center gap-1.5 text-caption text-ink-muted48">
              <Clock size={14} aria-hidden />
              {readingLabel(article.readingTime)}
            </span>
          ) : null}
        </div>
      </Container>

      {/* Cover */}
      {article.cover?.url && (
        <Container width="content" className="pb-10">
          <img
            src={article.cover.url}
            alt={article.cover.alternativeText || article.title}
            className="w-full rounded-lg"
            width={article.cover.width}
            height={article.cover.height}
          />
        </Container>
      )}

      {/* Body + sidebar */}
      <Container width="wide" className="pb-20">
        <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[minmax(0,1fr)_260px]">
          <div className="min-w-0">
            <PortableTextRenderer body={article.body} />

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-hairline pt-6">
                <Tag size={15} className="text-ink-muted48" aria-hidden />
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-pill bg-parchment px-3 py-1 text-fine text-ink-muted80"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Author bio */}
            {article.author?.bio && (
              <div className="mt-10 flex gap-4 rounded-lg bg-parchment p-6">
                {article.author.avatarUrl ? (
                  <img
                    src={article.author.avatarUrl}
                    alt={article.author.name}
                    className="h-14 w-14 shrink-0 rounded-pill object-cover"
                  />
                ) : (
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-pill bg-primary text-tagline font-semibold text-white">
                    {article.author.name.charAt(0)}
                  </span>
                )}
                <div>
                  <p className="text-caption font-semibold text-ink">
                    {article.author.name}
                  </p>
                  <p className="mt-1 text-caption leading-relaxed text-ink-muted80">
                    {article.author.bio}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-10">
              {headings.length > 0 && (
                <div>
                  <p className="label-caps text-fine tracking-[0.14em] text-ink">
                    On this page
                  </p>
                  <ul className="mt-3 space-y-2 border-l border-hairline">
                    {headings.map((h) => (
                      <li key={h.id} className={h.level === 'h3' ? 'pl-7' : 'pl-4'}>
                        <a
                          href={`#${h.id}`}
                          className="block text-caption leading-snug text-ink-muted48 transition-colors hover:text-primary"
                        >
                          {h.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {recentPosts.length > 0 && (
                <div>
                  <p className="label-caps text-fine tracking-[0.14em] text-ink">
                    More from {article.author?.name ?? 'the team'}
                  </p>
                  <ul className="mt-3 space-y-3">
                    {recentPosts.map((post) => (
                      <li key={post.id}>
                        <Link
                          to="/article/$slug"
                          params={{ slug: post.slug }}
                          className="press group flex gap-3"
                        >
                          {post.cover?.url && (
                            <img
                              src={post.cover.url}
                              alt={post.cover.alternativeText || post.title}
                              className="h-12 w-16 shrink-0 rounded-sm object-cover"
                            />
                          )}
                          <span className="text-caption font-medium leading-snug text-ink transition-colors group-hover:text-primary">
                            {post.title}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {popularTags.length > 0 && (
                <div>
                  <p className="label-caps text-fine tracking-[0.14em] text-ink">
                    Popular tags
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {popularTags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-pill bg-parchment px-3 py-1 text-fine text-ink-muted80"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <div className="mx-auto mt-20 max-w-5xl border-t border-hairline pt-12">
            <h2 className="text-display-md font-semibold tracking-[-0.01em] text-ink">
              Related reading
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((post) => (
                <BlogCard key={post.id} article={post} />
              ))}
            </div>
          </div>
        )}
      </Container>
    </article>
  )
}
