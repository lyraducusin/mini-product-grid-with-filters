import { defineConfig } from 'vite';

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "./src/styles/variables.scss" as *;`
      }
    }
  },
  base: '/mini-product-grid-with-filters/',
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
});
