import { useEffect, useRef } from 'react'
import {
  HeadContent,
  Scripts,
  createRootRoute,
  useRouterState,
} from '@tanstack/react-router'
import Lenis from 'lenis'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import NotFound from '@/components/pages/NotFound'
import { siteConfig, absoluteUrl } from '@/lib/site-config'
import { organizationSchema, webSiteSchema } from '@/lib/seo'
import appCss from '../index.css?url'

const ogImage = absoluteUrl(siteConfig.ogImage)

export const Route = createRootRoute({
  head: () => ({
    // Site-wide default title; per-route `head()` overrides it with a `{ title }`
    // meta entry. Every default below is a fallback for routes that omit one.
    title: siteConfig.defaultTitle,
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'description', content: siteConfig.description },
      {
        name: 'keywords',
        content:
          'custom software development, cloud engineering, DevOps, AI and ML development, mobile app development, cybersecurity, managed IT, Dubai software company',
      },
      { name: 'theme-color', content: siteConfig.themeColor },
      { name: 'robots', content: 'index, follow' },
      // Open Graph defaults
      { property: 'og:site_name', content: siteConfig.name },
      { property: 'og:type', content: 'website' },
      { property: 'og:locale', content: siteConfig.locale },
      { property: 'og:title', content: siteConfig.defaultTitle },
      { property: 'og:description', content: siteConfig.description },
      { property: 'og:url', content: siteConfig.url },
      { property: 'og:image', content: ogImage },
      { property: 'og:image:width', content: siteConfig.ogImageWidth },
      { property: 'og:image:height', content: siteConfig.ogImageHeight },
      { property: 'og:image:alt', content: siteConfig.name },
      // Twitter Card defaults
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: siteConfig.defaultTitle },
      { name: 'twitter:description', content: siteConfig.description },
      { name: 'twitter:image', content: ogImage },
    ],
    links: [
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      // First hero pixel: the AriaHero poster shown through the F window.
      { rel: 'preload', as: 'image', href: '/finn/frame-018.webp' },
      // design2.md runs one type system: Inter (body + Plain Black display substitute).
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap',
      },
      { rel: 'stylesheet', href: appCss },
    ],
    // Organization + WebSite knowledge-graph entries, emitted on every page.
    scripts: [organizationSchema(), webSiteSchema()],
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFound,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  useEffect(() => {
    // Podium-style buttery smooth scroll; drives every scroll-scrubbed effect.
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
    lenisRef.current = lenis
    // Exposed for programmatic scroll (e.g. anchor jumps). The `lenis` package
    // declares a loose `Window.lenis` shape, so assert our instance type here.
    const w = window as unknown as { lenis: Lenis | null }
    w.lenis = lenis
    let raf: number
    const loop = (t: number) => {
      lenis.raf(t)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      lenisRef.current = null
      w.lenis = null
    }
  }, [])

  // Jump to top on route change, through Lenis if it's running.
  useEffect(() => {
    if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true })
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {/* No solid bg on this wrapper: the body keeps bg-canvas, and dropping it
            here lets AutomationHero's fixed z-index:-1 video show through. */}
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Scripts />
      </body>
    </html>
  )
}
