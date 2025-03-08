import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    // tailwindcss(),
    react(),
  ],
  base: '/GitHub-repositories-explorer/', // Sesuai dengan nama repo GitHub Pages
  // assetsInclude: ['**/*'],
  build: {
    outDir: 'dist',
  },
})