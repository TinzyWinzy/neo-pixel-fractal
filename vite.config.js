import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

export default defineConfig({
  plugins: [preact()],
  resolve: {
    alias: {
      react: 'preact/compat',
      'react-dom': 'preact/compat',
    },
  },
  server: {
    fs: {
      allow: ['.'],
    },
  },
  build: {
    outDir: 'dist',
  },
  // Enable SPA fallback for Wouter
  preview: {
    open: true,
    historyApiFallback: true,
  },
}); 