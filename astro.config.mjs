//@ts-check
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import sanity from '@sanity/astro';
import cloudflare from '@astrojs/cloudflare';
import 'dotenv/config';

// https://astro.build/config
export default defineConfig({
  fonts: [
    {
      name: 'Inter',
      cssVariable: '--font-inter',
      provider: fontProviders.fontsource(),
      weights: ['100 900'],
      fallbacks: ['sans-serif'],
    },
    {
      name: 'JetBrains Mono',
      cssVariable: '--font-jetbrains-mono',
      provider: fontProviders.fontsource(),
      weights: ['100 900'],
      styles: ['normal', 'italic'],
      fallbacks: ['monospace'],
    },
    {
      provider: fontProviders.local(),
      name: 'TikTok Sans',
      cssVariable: '--font-tiktok',
      fallbacks: ['sans-serif'],
      options: {
        variants: [
          {
            src: ['./src/assets/fonts/TikTokSans_Expanded-ExtraBold.woff2'],
            weight: 'normal',
            style: 'normal',
          },
        ],
      },
    },
  ],

  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: [
        // 'react/compiler-runtime',
        // 'lodash/isObject.js',
        // 'lodash/groupBy.js',
        // 'lodash/keyBy.js',
        // 'lodash/partition.js',
        // 'lodash/sortedIndex.js',
      ],
      exclude: ['audit', 'xray', 'toolbar'],
    },
  },

  integrations: [
    sanity({
      projectId: 'yiulggd9',
      dataset: 'production',
      useCdn: false,
      apiVersion: '2026-03-10',
      studioBasePath: '/admin',
    }),
    react(),
  ],

  adapter: cloudflare(),
});
