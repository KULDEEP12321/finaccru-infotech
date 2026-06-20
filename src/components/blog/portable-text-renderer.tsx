import {
  PortableText,
  type PortableTextComponents,
  type PortableTextMarkComponentProps,
} from '@portabletext/react'
import { urlForImage } from '../../../sanity/lib/image'
import type { PortableTextBody } from '@/lib/sanity.types'

type PortableTextRendererProps = {
  body: PortableTextBody
}

/**
 * Derive a stable anchor slug from a heading's text content. Matches the slug
 * format the TOC extractor in `blog-post.tsx` produces so anchor links line up.
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

function blockToPlainText(children: unknown): string {
  if (!Array.isArray(children)) return ''
  return children
    .map((child) => {
      if (typeof child === 'string') return child
      if (child && typeof child === 'object' && 'props' in child) {
        const props = (child as { props?: { children?: unknown } }).props
        return blockToPlainText(props?.children)
      }
      return ''
    })
    .join('')
}

// Styled to the Finaccru design system: light surface, ink/ink-muted copy, the
// single Action-Blue accent, hairline rules, and the project's radius tokens.
const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-5 text-body-lg leading-[1.7] text-ink-muted80">{children}</p>
    ),
    h2: ({ children }) => {
      const id = slugify(blockToPlainText(children))
      return (
        <h2
          id={id}
          className="mb-4 mt-12 scroll-mt-28 text-[28px] font-semibold leading-tight tracking-[-0.01em] text-ink"
        >
          {children}
        </h2>
      )
    },
    h3: ({ children }) => {
      const id = slugify(blockToPlainText(children))
      return (
        <h3
          id={id}
          className="mb-3 mt-9 scroll-mt-28 text-[22px] font-semibold tracking-[-0.005em] text-ink"
        >
          {children}
        </h3>
      )
    },
    h4: ({ children }) => (
      <h4 className="mb-2 mt-7 scroll-mt-28 text-[18px] font-semibold text-ink">{children}</h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-7 border-l-2 border-primary bg-parchment px-6 py-4 text-lead-airy font-light not-italic text-ink-muted80">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-5 list-disc space-y-2 pl-6 text-body-lg text-ink-muted80 marker:text-primary">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mb-5 list-decimal space-y-2 pl-6 text-body-lg text-ink-muted80 marker:text-primary">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-[1.7]">{children}</li>,
    number: ({ children }) => <li className="leading-[1.7]">{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-ink">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="rounded-xs bg-parchment px-1.5 py-0.5 font-mono text-[0.9em] text-ink">
        {children}
      </code>
    ),
    underline: ({ children }) => <span className="underline">{children}</span>,
    link: ({
      value,
      children,
    }: PortableTextMarkComponentProps<{ _type: 'link'; href?: string }>) => {
      const href = value?.href ?? '#'
      const isExternal = href.startsWith('http')
      return (
        <a
          href={href}
          className="text-primary underline decoration-primary/30 underline-offset-2 transition-colors hover:decoration-primary"
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
        >
          {children}
        </a>
      )
    },
  },
  types: {
    image: ({
      value,
    }: {
      value: { alt?: string; caption?: string; asset?: unknown }
    }) => {
      const url = urlForImage(value)?.width(1600).fit('max').auto('format').url()
      if (!url) return null
      return (
        <figure className="my-9">
          <img
            src={url}
            alt={value.alt ?? ''}
            className="w-full rounded-lg"
            loading="lazy"
          />
          {value.caption && (
            <figcaption className="mt-3 text-center text-caption italic text-ink-muted48">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
    codeBlock: ({ value }: { value: { language?: string; code?: string } }) => (
      <pre className="mb-6 overflow-x-auto rounded-lg bg-tile1 p-5 text-[14px] leading-relaxed text-white">
        <code className={`language-${value.language ?? 'text'} block font-mono`}>
          {value.code ?? ''}
        </code>
      </pre>
    ),
  },
}

export default function PortableTextRenderer({ body }: PortableTextRendererProps) {
  if (!body || body.length === 0) return null

  return (
    <div className="max-w-none">
      <PortableText value={body as never} components={components} />
    </div>
  )
}
