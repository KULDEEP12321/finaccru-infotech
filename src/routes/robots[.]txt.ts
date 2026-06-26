import { createFileRoute } from '@tanstack/react-router'
import { siteConfig } from '@/lib/site-config'

// `/robots.txt` — generated from the same `siteConfig` source of truth as the
// sitemap and `/llms.txt`, so the brand name and the canonical Sitemap URL never
// drift from the site (and a future rename / domain flip is a one-file change).
//
// Classic crawlers index everything except the embedded Sanity Studio. AI answer
// engines are explicitly welcomed so the site can be cited in ChatGPT, Claude,
// Perplexity, Gemini, Copilot and Apple Intelligence answers; the machine-readable
// brief they read lives at /llms.txt.
const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-User',
  'Claude-SearchBot',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'Amazonbot',
  'cohere-ai',
  'CCBot',
  'DuckAssistBot',
]

function buildRobots(): string {
  const lines: string[] = []
  const push = (s = '') => lines.push(s)

  push(`# robots.txt for ${siteConfig.name}`)
  push('# All public pages are indexable by classic search crawlers.')
  push('User-agent: *')
  push('Allow: /')
  push('# The embedded Sanity Studio is an internal CMS admin — keep it out of indexes.')
  push('Disallow: /studio')
  push()
  push('# ── Answer-Engine Optimization (AEO) ──────────────────────────────────────')
  push('# Explicitly welcome AI answer-engine / assistant crawlers so the site can be')
  push('# cited in ChatGPT, Claude, Perplexity, Gemini, Copilot and Apple Intelligence')
  push('# answers. A machine-readable site brief lives at /llms.txt.')
  for (const bot of AI_CRAWLERS) {
    push()
    push(`User-agent: ${bot}`)
    push('Allow: /')
  }
  push()
  push('# Sitemap location')
  push(`Sitemap: ${siteConfig.url}/sitemap.xml`)

  return `${lines.join('\n')}\n`
}

export const Route = createFileRoute('/robots.txt')({
  server: {
    handlers: {
      GET: () =>
        new Response(buildRobots(), {
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'public, max-age=3600',
          },
        }),
    },
  },
})
