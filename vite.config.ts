import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          motion: ['framer-motion'],
          supabase: ['@supabase/supabase-js'],
          admin: [
            './src/admin/pages/AdminDashboard',
            './src/admin/pages/EventsManagement',
            './src/admin/pages/MenuManagement',
            './src/admin/pages/InstagramManagement',
            './src/admin/pages/GalleryManagement',
            './src/admin/pages/OffersManagement',
            './src/admin/pages/BookingsManagement',
            './src/admin/pages/ReviewsManagement',
            './src/admin/pages/TeamManagement'
          ]
        }
      }
    }
  },
  preview: {
    port: 3000,
    host: true
  }
})
