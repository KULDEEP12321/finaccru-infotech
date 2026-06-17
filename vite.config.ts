import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

// TanStack Start (SSR) on Vercel via the first-party Nitro Vite plugin.
// Nitro auto-detects the Vercel build environment (the VERCEL env var) in CI and
// applies its `vercel` preset, emitting Build Output API v3 artifacts to
// .vercel/output — no explicit preset is set, so local builds use the node
// fallback (.output/). To migrate back to Cloudflare later, swap nitro() for
// cloudflare({ viteEnvironment: { name: 'ssr' } }) (see wrangler.jsonc).
// Plugin order is load-bearing: tsconfig paths (the '@' alias) → tailwind →
// tanstackStart (owns route generation + SSR) → nitro (server build/output) →
// react.
export default defineConfig({
  plugins: [
    viteTsConfigPaths({ projects: ['./tsconfig.json'] }),
    tailwindcss(),
    tanstackStart(),
    nitro(),
    viteReact(),
  ],
})
