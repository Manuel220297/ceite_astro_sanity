import { defineCollection } from 'astro:content';

import { glob, file } from 'astro/loaders';

import { z } from 'astro/zod';
import { client } from './lib/sanity/sanity';
import { toHTML } from '@portabletext/to-html';

const news = defineCollection({
  loader: glob({ base: './news-content', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    _createdAt: z.coerce.date(),
    image: z.any(),
  }),
});

const programs = defineCollection({
  loader: glob({
    base: './programs-content',
    pattern: '**/*.{md,mdx}',
  }),
  schema: z.object({
    title: z.string(),
    titleLong: z.string(),
    slug: z.string(),
    _createdAt: z.coerce.date(),

    image: z.any(),

    specializations: z.any(),

    curriculum: z.any(),
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
    image: z.any(),
  }),
});

const specializationSchema = z.object({
  specialization: z.string(),
  color: z.string(),
});

const subjectSchema = z.object({
  subject: z.string(),
  specialization: specializationSchema.nullish(),
});

const curriculumItemSchema = z.object({
  year: z.string(),
  subjects: z.array(subjectSchema),
});

const sanityAbout = defineCollection({
  loader: async () => {
    const posts = await client.fetch(`
      *[_type == 'about']{
      body,
      image,
      title,
    }`);

    return posts.map((post: any) => ({
      id: post.title.replace(/\s+/g, ''),
      body: toHTML(post.body),
      title: post.title,
      image: post.image,
    }));
  },

  schema: z.object({
    title: z.string(),
    body: z.string().optional(),
    image: z.any(),
  }),
});

const sanityDean = defineCollection({
  loader: async () => {
    const posts = await client.fetch(`
*[_type == 'dean'] {
  _id,
  firstName,
  middleName,
  lastName,
  honorifics,
  image,
}`);

    return posts.map((post: any) => ({
      id: post._id,
      firstName: post.firstName,
      middleName: post.middleName,
      lastName: post.lastName,
      honorifics: post.honorifics,
      image: post.image,
    }));
  },

  schema: z.object({
    firstName: z.string(),
    middleName: z.string().nullish(),
    lastName: z.string(),
    honorifics: z.string(),
    image: z.any(),
  }),
});

// const sanity;

const sanityPrograms = defineCollection({
  loader: async () => {
    const posts = await client.fetch(`
      *[_type == 'programs']{
        _createdAt,
        title,
        titleLong,
        "slug": slug.current,
        curriculum[]{
          year,
          subjects[]{
            subject,
            specialization->{
              specialization,
              "color": color.hex
              }
            }
          },
        specializations[]->{
          specialization,
          "color": color.hex
        },
        image,
        body,
      }
    `);

    return posts.map((post: any) => ({
      id: post.slug,
      title: post.title,
      titleLong: post.titleLong,
      slug: post.slug,
      curriculum: post.curriculum,
      specializations: post.specializations,
      _createdAt: new Date(post._createdAt),
      image: post.image,
      body: toHTML(post.body),
    }));
  },

  schema: z.object({
    title: z.string(),
    titleLong: z.string(),
    slug: z.string(),
    _createdAt: z.coerce.date(),

    curriculum: z.array(curriculumItemSchema),

    specializations: z.array(specializationSchema),

    image: z.any(),

    body: z.string().optional(),
  }),
});

// 5. Export a single `collections` object to register your collection(s)
export const collections = { news, sanityNews, programs, sanityPrograms, sanityAbout, sanityDean };
