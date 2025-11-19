import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  source: {
    entry: {
      index: './src/main.tsx',
    },
  },
  resolve: {
    alias: {
      '@': './src',
      '@/components': './src/components',
      '@/pages': './src/pages',
      '@/hooks': './src/hooks',
      '@/store': './src/store',
      '@/types': './src/types',
      '@/utils': './src/utils',
      '@/services': './src/services',
      '@/config': './src/config',
      '@/schemas': './src/schemas',
    },
  },
  html: {
    template: './index.html',
  },
  output: {
    distPath: {
      root: 'dist',
    },
    assetPrefix: '/',
  },
  server: {
    port: 3000,
    open: true,
    host: 'localhost',
  },
  dev: {
    hmr: true,
    liveReload: true,
  },
  performance: {
    chunkSplit: {
      strategy: 'split-by-experience',
    },
  },
});