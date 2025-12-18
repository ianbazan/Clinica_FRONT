import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://msif-app-284932020200.us-central1.run.app',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
