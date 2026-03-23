import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/hylion-3d-guide/',
  build: {
    // Increase chunk warning limit (Three.js is large)
    chunkSizeWarningLimit: 1500,
  },
})
