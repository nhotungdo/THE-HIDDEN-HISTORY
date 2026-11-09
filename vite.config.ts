import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: 'auto',
      manifest: {
        name: 'Mật Mã Thời Gian – VNR202', short_name: 'Mật Mã Thời Gian',
        lang: 'vi', start_url: '/', display: 'standalone',
        theme_color: '#101827', background_color: '#101827',
        icons: [{ src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }],
      },
      workbox: { globPatterns: ['**/*.{js,css,html,svg,png,woff2}'], navigateFallbackDenylist: [/^\/api\//], cleanupOutdatedCaches: true },
    }),
  ],
})
