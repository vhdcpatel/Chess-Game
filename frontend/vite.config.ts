/// <reference types="vitest" />
import { defineConfig, type ViteDevServer, Plugin } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * A tiny Vite plugin to force `.wasm` to be served with
 * the correct `application/wasm` header during development.
 */
function wasmMimePlugin(): Plugin {
  return {
    name: 'vite-plugin-wasm-mime',
    configureServer(server: ViteDevServer) {
      server.middlewares.use((req, res, next) => {
        if (req.originalUrl?.endsWith('.wasm')) {
          res.setHeader('Content-Type', 'application/wasm')
        }
        next()
      })
    },
  }
}

export default defineConfig({
  plugins: [
    react(),
    wasmMimePlugin(),           // ← our custom plugin
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
    // Note: no `configureServer` here — it lives in our plugin
  },

  // Treat .wasm as a static asset so import.meta.url and ?url imports work
  assetsInclude: ['**/*.wasm'],

  publicDir: 'public',

  define: {
    // Some wasm wrappers expect a global `global`
    global: 'globalThis',
  },

  optimizeDeps: {
    exclude: ['stockfish'],
  },
})
