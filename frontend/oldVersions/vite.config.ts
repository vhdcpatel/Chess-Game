/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
  },

  worker: {
    format: 'es'
  },

  server: {
    host: true,
    fs: {
      allow: ['..', './public', './src']
    },
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp'
    },
  },

  // Ensure proper handling of WASM files
  assetsInclude: ['**/*.wasm'],

  // Configure how static assets are served
  publicDir: 'public',

  // Add proper MIME type for WASM files
  define: {
    global: 'globalThis'
  },

  // Optimize dependencies
  optimizeDeps: {
    exclude: ['stockfish']
  }
})