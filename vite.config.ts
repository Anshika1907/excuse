import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Requests starting with /excuses are forwarded to Spring Boot,
      // so the browser never hits a CORS error.
      '/excuses': 'http://localhost:8080',
    },
  },
})
