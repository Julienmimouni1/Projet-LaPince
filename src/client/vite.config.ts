import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: true,  // Écoute sur 0.0.0.0 — indispensable pour être accessible depuis l'hôte via Docker
    watch: {
      usePolling: true,  // Nécessaire sur Windows : Docker ne propage pas les événements inotify natifs
    },
  },
})