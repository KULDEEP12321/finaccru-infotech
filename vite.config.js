import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Split heavy vendor libs out of the single app bundle so they download
        // in parallel and cache independently across deploys. (hls.js is NOT
        // listed here — FreedomSection imports it dynamically, so Rollup already
        // emits it as an on-demand async chunk that stays off the initial load.)
        // Output is byte-equivalent at runtime — this only changes how the JS is
        // chunked, not what it does.
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          motion: ['motion'],
          lenis: ['lenis'],
        },
      },
    },
  },
})
