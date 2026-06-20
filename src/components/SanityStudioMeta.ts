import { siteConfig } from '@/lib/site-config'

export const sanityStudioRobotsContent = 'noindex, nofollow, noarchive, nosnippet'

// Head config for the embedded Studio routes — kept out of search indexes.
export function sanityStudioHead() {
  return {
    title: `${siteConfig.shortName} CMS`,
    meta: [
      { name: 'robots', content: sanityStudioRobotsContent },
      { name: 'googlebot', content: sanityStudioRobotsContent },
    ],
  }
}
