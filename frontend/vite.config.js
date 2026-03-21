import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Output built files directly into the Flask backend folder
    outDir: path.resolve(__dirname, '../backend/frontend'),
    emptyOutDir: true,
  },
  server: {
    // In dev mode, proxy /api calls to Django (avoids CORS)
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
