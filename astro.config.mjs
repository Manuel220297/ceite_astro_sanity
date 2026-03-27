//@ts-check
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import sanity from '@sanity/astro';
import 'dotenv/config';

// https://astro.build/config
export default defineConfig({
  fonts: [
    {
      name: 'Geist',
      cssVariable: '--font-geist',
      provider: fontProviders.fontsource(),
    },
  ],

  vite: {
    // @ts-ignore
    plugins: [tailwindcss()],
  },

  integrations: [
    sanity({
      projectId: process.env.PUBLIC_SANITY_PROJECT_ID,
      dataset: 'production',
      useCdn: false, // See note on using the CDN
      apiVersion: '2026-03-10', // insert the current date to access the latest version of the API
      studioBasePath: '/admin',
    }),
    react(),
  ],
});
