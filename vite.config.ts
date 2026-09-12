import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// GitHub Pages: relative base ("./") keeps the build portable for any repo name / sub-path.
// Hash-based routing (see src/main.tsx) makes deep links work on GitHub Pages without server config.
export default defineConfig({
  base: process.env.GH_PAGES_BASE ?? './',
  plugins: [react()],
  server: {
    // the Arena preview proxy (and any custom host) should be accepted
    allowedHosts: true,
    host: '0.0.0.0',
  },
  preview: {
    allowedHosts: true,
    host: '0.0.0.0',
    port: 4173,
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    css: false,
  },
});
