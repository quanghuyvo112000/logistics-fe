import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:8080', // Proxy requests starting with "/api" to your Spring Boot server
    }
  },
  base: '/', // Use the base URL from environment variables or default to '/'
})
