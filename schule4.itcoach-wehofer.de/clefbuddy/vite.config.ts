import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1200, // VexFlow is ~1.1 MB
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-vexflow': ['vexflow'],
          'vendor-audio': ['tone', 'tonal'],
          'vendor-state': ['zustand'],
        },
      },
    },
  },
})
