import { defineCollection } from 'astro:content';

import { z } from 'astro/zod';
import { client } from './lib/sanity/sanity';
import { parse } from 'csv-parse/sync';

type CurriculumSheetsLoaderContext = {
  store: {
    clear: () => void;
    set: (entry: { id: string; data: any }) => void;
  };
  logger: {
    info: (message: string) => void;
    warn: (message: string) => void;
    error: (message: string) => void;
  };
};

function curriculumSheetsLoader(options: { spreadsheetId: string; sheetName: string }) {
  return {
    name: 'google-sheets-curriculum-loader',
    load: async ({ store, logger }: CurriculumSheetsLoaderContext) => {
      logger.info('Fetching curriculum from Google Sheets...');

      try {
        const url = `https://docs.google.com/spreadsheets/d/${options.spreadsheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(options.sheetName)}`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch sheet: ${response.statusText}`);
        }

        const csvText = await response.text();
        const rows = parse(csvText);

        if (!rows || rows.length <= 1) {
          logger.warn('No data rows found in the sheet.');
          return;
        }

        const transformedData = transformRowsToCurriculum(rows);

        store.clear();
        for (const item of transformedData) {
          store.set({
            // The unique entry ID is now just the program (e.g., "bsit")
            id: item.program,
            data: item,
          });
        }

        logger.info(`Successfully loaded ${transformedData.length} program curriculums.`);
      } catch (error) {
        logger.error(`Failed to load Google Sheets data: ${error}`);
        throw error;
      }
    },
  };
}

/**
 * Maps your CSV columns:
 * row[0]=program, row[1]=year, row[2]=semester, row[3]=code,
 * row[4]=subject, row[5]=units, row[6]=prerequisite, row[7]=isSpecialized
 */
function transformRowsToCurriculum(rows: string[][]) {
  const dataRows = rows.slice(1); // Skip header row

  // A deeply nested map structure to group data:
  // program -> Map(year -> Map(semester -> subjects[]))
  const programMap = new Map<string, Map<number, Map<number, any[]>>>();

  for (const row of dataRows) {
    const program = row[0]?.toLowerCase().trim();
    const yearNum = parseInt(row[1], 10);
    const semesterNum = parseInt(row[2], 10);
    const code = row[3]?.trim();
    const subject = row[4]?.trim();
    const units = parseInt(row[5], 10);
    const prerequisite = row[6]?.trim() || null;
    const isSpecialization = row[7]?.toLowerCase().trim() === 'true';

    if (!program || isNaN(yearNum) || isNaN(semesterNum) || !subject) continue;

    // 1. Ensure program map exists
    if (!programMap.has(program)) {
      programMap.set(program, new Map());
    }
    const yearMap = programMap.get(program)!;

    // 2. Ensure year map exists inside program
    if (!yearMap.has(yearNum)) {
      yearMap.set(yearNum, new Map());
    }
    const semesterMap = yearMap.get(yearNum)!;

    // 3. Ensure semester array exists inside year
    if (!semesterMap.has(semesterNum)) {
      semesterMap.set(semesterNum, []);
    }

    // 4. Push the subject object
    semesterMap.get(semesterNum)!.push({
      code,
      subject,
      units,
      prerequisite,
      isSpecialization,
    });
  }

  // Flatten the deep map structures down to the nested arrays Zod expects
  return Array.from(programMap.entries()).map(([programName, yearMap]) => {
    // Sort and construct the years array
    const sortedYears = Array.from(yearMap.entries())
      .sort(([yearA], [yearB]) => yearA - yearB)
      .map(([yearNum, semesterMap]) => {
        // Sort and construct the semesters array inside this specific year
        const sortedSemesters = Array.from(semesterMap.entries())
          .sort(([semA], [semB]) => semA - semB)
          .map(([semesterNum, subjects]) => ({
            semester: semesterNum,
            subjects,
          }));

        return {
          year: yearNum,
          semesters: sortedSemesters,
        };
      });

    return {
      program: programName,
      years: sortedYears,
    };
  });
}

const curriculum = defineCollection({
  loader: curriculumSheetsLoader({
    spreadsheetId: '11Oj8BJpkWZ1OFAOq8o6AaWXlNccraKZzhN21HyF8P3w',
    sheetName: 'Curriculum',
  }),
  schema: z.object({
    program: z.string(),

    // year[]
    years: z.array(
      z
        .object({
          year: z.number(),

          // semester[]
          semesters: z.array(
            z
              .object({
                semester: z.number(),

                // subjects{} inside semester[]
                subjects: z.array(
                  z.object({
                    code: z.string(),
                    subject: z.string(),
                    units: z.number(),
                    prerequisite: z.string().nullish(),
                    isSpecialization: z.boolean(),
                  }),
                ),
              })
              .nullish(),
          ),
        })
        .nullish(),
    ),
  }),
});

const specializationSchema = z.object({
  specialization: z.string(),
  color: z.string(),
  body: z.any(),
  image: z.any(),
});

const subjectSchema = z.object({
  subject: z.string(),
  units: z.number().nullish(),
  isSpecialization: z.boolean().nullish(),
});

export type Subject = z.infer<typeof subjectSchema>;

const semesterSchema = z.object({
  subjects: z.array(subjectSchema).nullish(),
});

const dimensionsSchema = z.object({
  height: z.number(),
  width: z.number(),
});

const assetSchema = z.object({
  _id: z.string(),
  url: z.string().url(),
  size: z.number().optional(),
  metadata: z
    .object({
      dimensions: dimensionsSchema,
    })
    .optional(),
});

const imageSchema = z.object({
  _type: z.string().optional(),
  alt: z.string().nullable().optional(),
  asset: assetSchema,

  crop: z
    .object({
      _type: z.string().optional(),
      top: z.number().optional(),
      bottom: z.number().optional(),
      left: z.number().optional(),
      right: z.number().optional(),
    })
    .optional(),

  hotspot: z
    .object({
      _type: z.string().optional(),
      x: z.number(),
      y: z.number(),
      height: z.number(),
      width: z.number(),
    })
    .optional(),
});

const news = defineCollection({
  loader: async () => {
    const posts = await client.fetch(`
      *[_type == 'news']{
          _createdAt,
          title,
          "slug": slug.current,
          image{
            ...,
            asset->{
              _id,
              url,
              size,
              metadata{
                dimensions{
                  height,
                  width,
                }
              }
            }
          },
          category,
          pin,
          body,
      }`);

    return posts.map((post: any) => ({
      id: post.slug,
      title: post.title,
      slug: post.slug,
      _createdAt: new Date(post._createdAt),
      category: post.category,
      pin: post.pin,
      image: post.image,
      body: post.body,
    }));
  },

  schema: z.object({
    title: z.string(),
    slug: z.string(),
    _createdAt: z.coerce.date(),
    category: z.string(),
    pin: z.boolean().nullish(),
    image: imageSchema.nullish(),
    body: z.any(),
  }),
});

const about = defineCollection({
  loader: async () => {
    const posts = await client.fetch(`
      *[_type == 'about']{
      _id,
      body,
      youtubeUrl,
      stats,
    }`);

    return posts.map((post: any) => ({
      id: post._id,
      body: post.body,
      youtubeUrl: post.youtubeUrl,
      stats: post.stats,
    }));
  },

  schema: z.object({
    youtubeUrl: z.string().nullish(),
    body: z.any(),
    stats: z
      .array(
        z.object({
          title: z.string(),
          value: z.string(),
          description: z.string(),
        }),
      )
      .nullish(),
  }),
});

const dean = defineCollection({
  loader: async () => {
    const posts = await client.fetch(`
        *[_type == 'dean'] {
          _id,
          firstName,
          middleName,
          lastName,
          honorifics,
          customHonorific,
                    email,
                  facebook,
                  tiktok,
                  twitter,
                  instagram,
          image{
              ...,
              asset->{
                _id,
                url,
                size
              }
            },
    }`);

    return posts.map((post: any) => ({
      id: post._id,
      firstName: post.firstName,
      middleName: post.middleName,
      lastName: post.lastName,
      honorifics: post.honorifics,
      customHonorific: post.customHonorific,
      email: post.email,
      facebook: post.facebook,
      tiktok: post.tiktok,
      twitter: post.twitter,
      instagram: post.instagram,
      image: post.image,
    }));
  },

  schema: z.object({
    firstName: z.string(),
    middleName: z.string().nullish(),
    lastName: z.string(),
    honorifics: z.string(),
    customHonorific: z.string().nullish(),
    email: z.string().nullish(),
    facebook: z.string().nullish(),
    tiktok: z.string().nullish(),
    twitter: z.string().nullish(),
    instagram: z.string().nullish(),
    image: z.any(),
  }),
});

const faculty = defineCollection({
  loader: async () => {
    const posts = await client.fetch(`
      *[_type == 'faculty'] {
          _id,
          firstName,
          middleName,
          lastName,
          title,
          honorifics,
          customHonorific,
          email,
          facebook,
          tiktok,
          twitter,
          instagram,
          image{
            ...,
            asset->{
              _id,
              url,
              size,
              metadata{
                dimensions{
                  height,
                  width,
                }
              }
            }
          },
      }`);

    return posts.map((post: any) => ({
      id: post._id,
      firstName: post.firstName,
      middleName: post.middleName,
      lastName: post.lastName,
      title: post.title,
      honorifics: post.honorifics,
      customHonorific: post.customHonorific,
      email: post.email,
      facebook: post.facebook,
      tiktok: post.tiktok,
      twitter: post.twitter,
      instagram: post.instagram,
      image: post.image,
    }));
  },

  schema: z.object({
    firstName: z.string(),
    middleName: z.string().nullish(),
    lastName: z.string(),
    title: z.string(),
    honorifics: z.string(),
    customHonorific: z.string().nullish(),
    email: z.string().nullish(),
    facebook: z.string().nullish(),
    tiktok: z.string().nullish(),
    twitter: z.string().nullish(),
    instagram: z.string().nullish(),
    image: imageSchema.nullish(),
  }),
});

const projects = defineCollection({
  loader: async () => {
    const posts = await client.fetch(`
      *[_type == 'projects']{
          title,
          "slug": slug.current,
          image{
              ...,
              asset->{
                _id,
                url,
                size
              }
            },
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
      body: post.body,
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

const programs = defineCollection({
  loader: async () => {
    const posts = await client.fetch(`
      *[_type == 'programs']{
        title,
        titleLong,
        "slug": slug.current,

        specializations[]->{
          specialization,
          "color": color.hex,
            image{
              ...,
              asset->{
                _id,
                url,
                size
              }
            },
          body,
        },

        logo{
          ...,
          asset->{
            _id,
            url,
            size
          }
        },
        image{
          ...,
          asset->{
            _id,
            url,
            size,
            metadata{
              dimensions{
                height,
                width,
              }
            }
          }
        },

        gallery[]{
         ..., 
         asset->{
            _id, 
            url, 
            size, 
            metadata{ 
              dimensions{ 
                height, 
                width 
              } 
            } 
          }, 
          alt 
        },

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
      specializations: post.specializations,
      logo: post.logo,
      image: post.image,
      gallery: post.gallery,
      body: post.body,
      careers: post.careers,
      objectives: post.objectives,
    }));
  },

  schema: z.object({
    title: z.string(),
    titleLong: z.string(),
    slug: z.string(),
    specializations: z.array(specializationSchema).nullish(),
    logo: imageSchema.nullish(),
    image: imageSchema.nullish(),
    gallery: z.array(imageSchema).nullish(),
    body: z.any(),
    careers: z.any(),
    objectives: z.any(),
  }),
});
// 5. Export a single `collections` object to register your collection(s)
export const collections = {
  news,
  programs,
  about,
  dean,
  faculty,
  projects,
  curriculum,
};
