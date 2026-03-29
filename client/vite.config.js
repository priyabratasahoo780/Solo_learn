import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          animations: ['framer-motion', 'lenis'],
          data: ['recharts', 'date-fns', 'axios'],
          icons: ['lucide-react']
        }
      }
    },
    chunkSizeWarningLimit: 1000, 
  }
})
