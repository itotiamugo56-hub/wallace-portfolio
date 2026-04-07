import { defineConfig } from 'vite';
import { resolve } from 'path';
import { copyFileSync, existsSync } from 'fs';  // Add this

export default defineConfig({
  root: '.',
  server: {
    host: '0.0.0.0',
    port: 3000,
    open: true,
    middlewareMode: false,
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        cv: resolve(__dirname, 'cv.html'),  // Add cv.html
      },
    },
    assetsInlineLimit: 4096,
    minify: 'esbuild',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  preview: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [
    {
      name: 'copy-redirects',
      closeBundle() {
        // Copy _redirects from public to dist
        const src = resolve(__dirname, 'public/_redirects');
        const dest = resolve(__dirname, 'dist/_redirects');
        
        if (existsSync(src)) {
          copyFileSync(src, dest);
          console.log('✓ Copied _redirects to dist');
        }
        
        // Also verify cv.html was built
        const cvDest = resolve(__dirname, 'dist/cv.html');
        if (existsSync(cvDest)) {
          console.log('✓ cv.html built successfully');
        } else {
          console.warn('⚠ cv.html not found in build output');
        }
      }
    }
  ],
});