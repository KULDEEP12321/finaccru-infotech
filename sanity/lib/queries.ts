/**
 * GROQ queries for the Finaccru Infotech blog.
 *
 * Notes on projection shape — these queries project directly into the shape
 * expected by `src/lib/sanity.types.ts` / blog components. Keys are renamed
 * on the server side so the UI code doesn't need to understand Sanity's
 * internal `_id` / `_type` / asset-reference structure.
 *
 *  - `id`            ← `_id`
 *  - `slug`          ← `slug.current`
 *  - `createdAt`     ← `_createdAt`
 *  - `updatedAt`     ← `_updatedAt`
 *  - `cover.url`     ← resolved via `coverImage.asset->url`
 *  - `cover.alternativeText` ← `coverImage.alt`
 */

// Common article projection used by both list and detail queries.
const ARTICLE_LIST_PROJECTION = /* groq */ `
  "id": _id,
  title,
  "slug": slug.current,
  description,
  "cover": {
    "url": coverImage.asset->url,
    "alternativeText": coalesce(coverImage.alt, title),
    "width": coverImage.asset->metadata.dimensions.width,
    "height": coverImage.asset->metadata.dimensions.height
  },
  publishedAt,
  "createdAt": _createdAt,
  "updatedAt": _updatedAt,
  "author": author->{ "name": name, "slug": slug.current, "avatarUrl": avatar.asset->url },
  "category": category->{ "name": name, "slug": slug.current },
  tags,
  featured,
  "readingTime": round(length(pt::text(body)) / 5 / 200)
`

const ARTICLE_DETAIL_PROJECTION = /* groq */ `
  ${ARTICLE_LIST_PROJECTION},
  body,
  "author": author->{
    "name": name,
    "slug": slug.current,
    "bio": bio,
    "avatarUrl": avatar.asset->url
  }
`

export const ARTICLES_COUNT_QUERY = /* groq */ `
  count(*[_type == "article" && !(_id in path("drafts.**"))
    && ($search == "" || title match $search || description match $search)
    && ($category == "" || category->slug.current == $category)
  ])
`

export const ARTICLES_PAGE_QUERY = /* groq */ `
  *[_type == "article" && !(_id in path("drafts.**"))
    && ($search == "" || title match $search || description match $search)
    && ($category == "" || category->slug.current == $category)
  ] | order(publishedAt desc) [$start...$end] {
    ${ARTICLE_LIST_PROJECTION}
  }
`

export const ARTICLE_BY_SLUG_QUERY = /* groq */ `
  *[_type == "article" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
    ${ARTICLE_DETAIL_PROJECTION}
  }
`

export const CATEGORIES_WITH_COUNTS_QUERY = /* groq */ `
  *[_type == "category"] | order(name asc) {
    "id": _id,
    "documentId": _id,
    name,
    "slug": slug.current,
    description,
    "count": count(*[_type == "article" && references(^._id) && !(_id in path("drafts.**"))])
  }
`

export const ALL_ARTICLE_SLUGS_QUERY = /* groq */ `
  *[_type == "article" && !(_id in path("drafts.**"))] | order(publishedAt desc) {
    "slug": slug.current,
    "updatedAt": _updatedAt
  }
`

export const RECENT_POSTS_BY_AUTHOR_QUERY = /* groq */ `
  *[_type == "article" && author->slug.current == $authorSlug && _id != $currentId && !(_id in path("drafts.**"))]
    | order(publishedAt desc) [0...3] {
    "id": _id,
    title,
    "slug": slug.current,
    publishedAt,
    "cover": {
      "url": coverImage.asset->url,
      "alternativeText": coalesce(coverImage.alt, title)
    }
  }
`

export const ALL_TAGS_QUERY = /* groq */ `
  array::unique(*[_type == "article" && defined(tags) && !(_id in path("drafts.**"))].tags[])
`

export const RELATED_POSTS_QUERY = /* groq */ `
  *[_type == "article" && _id != $currentId && references($categoryId) && !(_id in path("drafts.**"))]
    | order(publishedAt desc) [0...3] {
    ${ARTICLE_LIST_PROJECTION}
  }
`
