// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

import sanity from '@sanity/astro';

// https://astro.build/config
export default defineConfig({
  vite: {
    // @ts-ignore
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: [],
    },
  },

  integrations: [
    sanity({
      projectId: 'yiulggd9',
      dataset: 'production',
      useCdn: false, // See note on using the CDN
      apiVersion: '2026-03-10', // insert the current date to access the latest version of the API
    }),
    react(),
  ],
});
