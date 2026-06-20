import { useEffect, useState } from 'react'

type SanityConfig = typeof import('../../sanity.config').default
type StudioComponent = typeof import('sanity').Studio

type LoadedStudio = {
  Studio: StudioComponent
  config: SanityConfig
}

// The Studio is a large, browser-only bundle (no SSR). We lazy-import both the
// `sanity` package and our config on the client, after mount, so it never ships
// in the SSR worker or the initial page bundle.
const loadSanityStudio = import.meta.env.SSR
  ? async (): Promise<LoadedStudio | null> => null
  : async (): Promise<LoadedStudio> => {
      const [sanity, config] = await Promise.all([
        import('sanity'),
        import('../../sanity.config'),
      ])

      return {
        Studio: sanity.Studio,
        config: config.default,
      }
    }

export function SanityStudio() {
  const [loadedStudio, setLoadedStudio] = useState<LoadedStudio | null>(null)
  const Studio = loadedStudio?.Studio

  useEffect(() => {
    let isMounted = true

    void loadSanityStudio().then((studio) => {
      if (isMounted) {
        setLoadedStudio(studio)
      }
    })

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <main className="h-dvh min-h-dvh w-full bg-white">
      {Studio && loadedStudio ? <Studio config={loadedStudio.config} /> : null}
    </main>
  )
}
