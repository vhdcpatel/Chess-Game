/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
  plugins: [
    react(),
  ],

  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
  },

  worker: {
    format: 'es',
  },

  server: {
    host: true,
    fs: {
      allow: ['..', './public', './src'],
    },
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },

  publicDir: 'public',

  define: {
    global: 'globalThis',
  },

  // To reduce the bundle size in compile.
  optimizeDeps: {
    exclude: ['stockfish-17-lite-single.js'],
  },
})
