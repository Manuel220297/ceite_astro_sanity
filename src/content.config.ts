// 1. Import utilities from `astro:content`
import { defineCollection } from 'astro:content';

// 2. Import loader(s)
import { glob, file } from 'astro/loaders';

// 3. Import Zod
import { z } from 'astro/zod';
import { client } from './lib/sanity/sanity';
import { toHTML } from '@portabletext/to-html';

// 4. Define a `loader` and `schema` for each collection
const news = defineCollection({
  loader: glob({ base: './news-content', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    _createdAt: z.coerce.date(),
    image: z.any().nullish(),
  }),
});

const programs = defineCollection({
  loader: glob({ base: './programs-content', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    titleLong: z.string(),
    slug: z.string(),
    _createdAt: z.coerce.date(),
    image: z.any().nullish(),
    specializations: z.array(z.string()).nullish(),
  }),
});

const sanityNews = defineCollection({
  loader: async () => {
    const posts = await client.fetch(`
      *[_type == 'news']{
        _createdAt,
          title,
          "slug": slug.current,
          image,
          body,
      }`);

    return posts.map((post: any) => ({
      id: post.slug,
      title: post.title,
      slug: post.slug,
      _createdAt: new Date(post._createdAt),
      image: post.image,
      body: toHTML(post.body),
    }));
  },

  schema: z.object({
    title: z.string(),
    slug: z.string(),
    _createdAt: z.coerce.date(),
    image: z.any().nullish(),
  }),
});

// 5. Export a single `collections` object to register your collection(s)
export const collections = { news, sanityNews, programs };
