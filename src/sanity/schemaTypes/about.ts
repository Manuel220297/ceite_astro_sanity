import { defineField, defineType } from 'sanity';

export const aboutType = defineType({
  name: 'about',
  title: 'About',
  type: 'document',
  options: {
    singleton: true,
  },

  fields: [
    defineField({
      name: 'youtubeUrl',
      title: 'YouTube URL',
      type: 'url',
      validation: (Rule) =>
        Rule.uri({
          scheme: ['http', 'https'],
        }).custom((url) => {
          if (!url) return true;

          const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;

          return youtubeRegex.test(url) ? true : 'Only YouTube URLs are allowed';
        }),
    }),

    // Stat Cards
    defineField({
      name: 'stats',
      title: 'Stat Cards',
      type: 'array',
      of: [
        defineField({
          name: 'statCard',
          title: 'Stat Card',
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
            }),

            defineField({
              name: 'value',
              title: 'Value',
              type: 'string',
            }),

            defineField({
              name: 'description',
              title: 'Description',
              type: 'string',
            }),
          ],

          preview: {
            select: {
              title: 'title',
              subtitle: 'value',
            },
            prepare({ title, subtitle }) {
              return {
                title,
                subtitle,
              };
            },
          },
        }),
      ],
    }),

    defineField({
      name: 'body',
      title: 'Body',
      type: 'blockContent',
    }),
  ],

  preview: {
    prepare() {
      return {
        title: 'About CEITE',
      };
    },
  },
});
