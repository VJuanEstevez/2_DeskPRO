import { defineConfig } from 'vite'

export default defineConfig({
  root: 'src',
  base: '/2_DeskPRO/',
  server: {
    port: 5174,
    strictPort: false
  },
    build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
})
