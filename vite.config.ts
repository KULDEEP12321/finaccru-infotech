import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { cloudflare } from '@cloudflare/vite-plugin'

// TanStack Start (SSR) on Cloudflare Workers via the first-party Cloudflare Vite
// plugin. The plugin reads wrangler.jsonc for the Worker entry, bindings, and
// vars, and emits the Worker build that `wrangler deploy` ships. This runtime is
// required by the contact form, which talks raw SMTP over `cloudflare:sockets`
// and rate-limits via the `CONTACT_FORM_RATE_LIMITER` binding — neither exists
// on a plain Node runtime.
//
// `viteEnvironment: { name: 'ssr' }` routes the TanStack Start SSR environment
// into the Workers (workerd) build. This site targets Cloudflare end-to-end —
// hosting, the SMTP socket transport, rate limiting, and the `_headers` rules.
//
// Plugin order mirrors the proven reference setup: cloudflare → tsconfig paths
// (the '@' alias) → tailwind → tanstackStart (route generation + SSR) → react.
export default defineConfig({
  plugins: [
    cloudflare({ viteEnvironment: { name: 'ssr' } }),
    viteTsConfigPaths({ projects: ['./tsconfig.json'] }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
})
