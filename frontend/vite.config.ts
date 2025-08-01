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
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json-summary'],
      reportsDirectory: './coverage',
      reportOnFailure: true,
      //  All test and config files will not be consider for coverage calculations.
      exclude: [
        '**/test-utils/**',                  // testing helpers
        '**/*.test.{ts,tsx}',               // test files
        '**/__tests__/**',                  // test folders (optional)
        'public/**',                        // static assets
        'src/**/*.d.ts',                    // all type declarations (like vite-env.d.ts)
        'vite.config.ts',            // vite config
        'src/main.tsx',                     // app entry point
        'src/App.tsx',                      // purely a wrapper in your case
        'theme.ts',                     // MUI theme file
        'src/.eslintrc.cjs',               // ESLint config (move to root ideally)
        'src/utils/constants/**',           // hardcoded or static constants
        'src/utils/miniMax(deprecated-removeLatter)/**', // deprecated logic
      ],
    },
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
  // assetsInclude: ['**/*.wasm'],

  publicDir: 'public',

  define: {
    // Some wasm wrappers expect a global `global`
    global: 'globalThis',
  },

  optimizeDeps: {
    exclude: ['stockfish-17-lite-single.js'],
  },
})
