import { createFileRoute, notFound } from '@tanstack/react-router'
import BlogPost from '@/components/blog/blog-post'
import {
  getArticle,
  getCategories,
  getRecentPostsByAuthor,
  getAllTags,
  getRelatedPosts,
} from '@/lib/sanity.data'
import { pageTitle } from '@/lib/site-config'
import { seo, articleSchema, breadcrumbSchema } from '@/lib/seo'

export const Route = createFileRoute('/article/$slug')({
  loader: async ({ params }) => {
    const article = await getArticle({ data: params.slug })
    if (!article) {
      throw notFound()
    }

    const [categories, recentPosts, popularTags, relatedPosts] = await Promise.all([
      getCategories(),
      article.author?.slug
        ? getRecentPostsByAuthor({
            data: { authorSlug: article.author.slug, currentId: article.id },
          })
        : Promise.resolve([]),
      getAllTags(),
      article.category?.slug
        ? getRelatedPosts({
            data: { currentId: article.id, categoryId: article.category.slug },
          })
        : Promise.resolve([]),
    ])

    return { article, categories, recentPosts, popularTags, relatedPosts }
  },
  head: ({ loaderData }) => {
    const article = loaderData?.article
    if (!article) return {}

    const path = `/article/${article.slug}`
    const description = article.description || 'Insights from the Finaccru Infotech team.'
    const authorName = article.author?.name || 'Finaccru Infotech'

    return {
      ...seo({
        title: pageTitle(article.title),
        description,
        path,
        image: article.cover?.url,
        type: 'article',
        author: authorName,
        publishedTime: article.publishedAt,
        modifiedTime: article.updatedAt,
      }),
      scripts: [
        articleSchema({
          headline: article.title,
          description,
          path,
          image: article.cover?.url,
          datePublished: article.publishedAt,
          dateModified: article.updatedAt,
          authorName,
        }),
        breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Blog', path: '/blog' },
          { name: article.title, path },
        ]),
      ],
    }
  },
  component: ArticlePage,
  notFoundComponent: () => (
    <div className="flex min-h-[60vh] items-center justify-center bg-canvas">
      <div className="text-center">
        <h1 className="text-display-md font-semibold text-ink">Article not found</h1>
        <p className="mt-3 text-body-lg text-ink-muted48">
          The article you are looking for does not exist.
        </p>
      </div>
    </div>
  ),
})

function ArticlePage() {
  const { article, categories, recentPosts, popularTags, relatedPosts } =
    Route.useLoaderData()
  return (
    <BlogPost
      article={article}
      categories={categories}
      recentPosts={recentPosts}
      popularTags={popularTags}
      relatedPosts={relatedPosts}
    />
  )
}
