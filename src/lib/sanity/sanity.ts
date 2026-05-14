import { createClient } from '@sanity/client';

export const client = createClient({
  projectId: 'yiulggd9',
  dataset: 'production',
  apiVersion: '2026-03-10',
  useCdn: false,
});
