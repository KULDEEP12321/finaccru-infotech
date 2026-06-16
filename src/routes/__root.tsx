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
import appCss from '../index.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Finaccru Infotech — Software & IT Services' },
      {
        name: 'description',
        content:
          'Finaccru Infotech designs, builds, and runs custom software, cloud platforms, and intelligent systems for ambitious businesses.',
      },
    ],
    links: [
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      // The Helvetica Now / Mazzard webfonts are @imported in index.css; opening
      // the connection early shaves a round-trip off the late-discovered fetch.
      { rel: 'preconnect', href: 'https://db.onlinewebfonts.com', crossOrigin: 'anonymous' },
      // First hero pixel: the AriaHero poster shown through the F window.
      { rel: 'preload', as: 'image', href: '/finn/frame-018.webp' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Jost:wght@400;500;600;700&display=swap',
      },
      { rel: 'stylesheet', href: appCss },
    ],
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
