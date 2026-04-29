import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // In dev mode, proxy /api calls to a local Cloudflare Worker (via wrangler)
    proxy: {
      '/api': {
        target: 'http://localhost:8788',
        changeOrigin: true,
      }
    }
  }
})