import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { visualizer } from 'rollup-plugin-visualizer'

const analyzerPlugin = visualizer({
  filename: 'dist/stats.html',
  gzipSize: true,
  brotliSize: true,
  emitFile: true,
  template: 'treemap',
})

export default defineConfig({
  plugins: [react(), tailwindcss(), analyzerPlugin],
  publicDir: 'public',
  server: {
    fs: {
      allow: ['.'],
    },
  },
  build: {
    sourcemap: true,
    chunkSizeWarningLimit: 700,
  },
  test: {
    include: ['src/**/*.test.{ts,tsx,js,jsx}'],
    exclude: ['e2e/**', 'archive/**', 'docs/**'],
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: false,
  },
})
