import { defineCollection } from 'astro:content';

import { glob, file } from 'astro/loaders';

import { z } from 'astro/zod';
import { client } from './lib/sanity/sanity';
import { toHTML } from '@portabletext/to-html';
import { object } from 'astro:schema';

const specializationSchema = z.object({
  specialization: z.string(),
  color: z.string(),
  body: z.any(),
  image: z.any(),
});

const subjectSchema = z.object({
  subject: z.string(),
  specialization: specializationSchema.nullish(),
});

const semesterSchema = z.object({
  units: z.number().nullish(),
  subjects: z.array(subjectSchema).nullish(),
});

const curriculumItemSchema = z.object({
  year: z.string(),
  firstSemester: semesterSchema.nullish(),
  secondSemester: semesterSchema.nullish(),
});

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
          category,
          eventDateStart,
          eventDateEnd,
          body,
      }`);

    return posts.map((post: any) => ({
      id: post.slug,
      title: post.title,
      slug: post.slug,
      _createdAt: new Date(post._createdAt),
      category: post.category,
      eventDateStart: post.eventDateStart,
      eventDateEnd: post.eventDateEnd,
      image: post.image,
      body: post.body,
    }));
  },

  schema: z.object({
    title: z.string(),
    slug: z.string(),
    _createdAt: z.coerce.date(),
    category: z.string(),
    eventDateStart: z.coerce.date().nullish(),
    eventDateEnd: z.coerce.date().nullish(),
    image: z.any(),
    body: z.any(),
  }),
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

const sanityAnnouncement = defineCollection({
  loader: async () => {
    const posts = await client.fetch(`
      *[_type == 'announcement']{
        _id,
        announcements[]{
          body
        }
    }`);

    return posts.map((post: any) => ({
      id: post._id,
      announcements: post.announcements,
    }));
  },

  schema: z.object({
    announcements: z.array(z.object({ body: z.any() })).nullish(),
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

const sanityStaffs = defineCollection({
  loader: async () => {
    const posts = await client.fetch(`
      *[_type == 'staffs'] {
        _id,
        firstName,
        middleName,
        lastName,
        title,
        honorifics,
        image,
      }`);

    return posts.map((post: any) => ({
      id: post._id,
      firstName: post.firstName,
      middleName: post.middleName,
      lastName: post.lastName,
      title: post.title,
      honorifics: post.honorifics,
      image: post.image,
    }));
  },

  schema: z.object({
    firstName: z.string(),
    middleName: z.string().nullish(),
    lastName: z.string(),
    title: z.string(),
    honorifics: z.string(),
    image: z.any(),
  }),
});

const sanityProjects = defineCollection({
  loader: async () => {
    const posts = await client.fetch(`
      *[_type == 'projects']{
          title,
          "slug": slug.current,
          image,
          "program": program.program->{
            title,
            "slug": slug.current
          },
          body
        }
      `);

    return posts.map((post: any) => ({
      id: post.slug,
      title: post.title,
      slug: post.slug,
      image: post.image,
      program: post.program,
      body: toHTML(post.body),
    }));
  },

  schema: z.object({
    title: z.string(),
    slug: z.string(),
    program: z.object({ title: z.string(), slug: z.string() }).nullish(),
    image: z.any(),
    body: z.any(),
  }),
});

const sanityPrograms = defineCollection({
  loader: async () => {
    const posts = await client.fetch(`
      *[_type == 'programs']{
        title,
        titleLong,
        "slug": slug.current,

        curriculum[]{
          year,
          firstSemester{
            units,
            subjects[]{
              subject,
              specialization->{
                specialization,
                "color": color.hex
              }
            }
          },
          secondSemester{
            units,
            subjects[]{
              subject,
              specialization->{
                specialization,
                "color": color.hex
              }
            }
          }
        },

        specializations[]->{
          specialization,
          "color": color.hex,
          image,
          body,
        },

        logo,
        image,

        careers,
        objectives,

        body[]{
          ...,
          _type == "image" => {
            ...,
            asset->,
            alt,
            caption
          }
        }  
      }
    `);

    return posts.map((post: any) => ({
      id: post.slug,
      title: post.title,
      titleLong: post.titleLong,
      slug: post.slug,
      curriculum: post.curriculum,
      specializations: post.specializations,
      logo: post.logo,
      image: post.image,
      body: post.body,
      careers: post.careers,
      objectives: post.objectives,
    }));
  },

  schema: z.object({
    title: z.string(),
    titleLong: z.string(),
    slug: z.string(),

    curriculum: z.array(curriculumItemSchema),

    specializations: z.array(specializationSchema).nullish(),
    logo: z.any(),
    image: z.any(),

    body: z.any(),
    careers: z.any(),
    objectives: z.any(),
  }),
});
// 5. Export a single `collections` object to register your collection(s)
export const collections = {
  news,
  sanityNews,
  programs,
  sanityPrograms,
  sanityAbout,
  sanityDean,
  sanityStaffs,
  sanityAnnouncement,
  sanityProjects,
};
