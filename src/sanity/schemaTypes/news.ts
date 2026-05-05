import { defineField, defineType } from 'sanity';

export const newsType = defineType({
  name: 'news',
  title: 'News and Events',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
        },
      ],
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      validation: (rule) => rule.required(),
      options: {
        layout: 'radio',
        list: [
          { title: 'News', value: 'News' },
          { title: 'Event', value: 'Event' },
          { title: 'Notice', value: 'Notice' },
        ],
      },
    }),
    defineField({
      name: 'eventDateStart',
      title: 'Event Date Start',
      type: 'datetime',
      description: 'Optional',
    }),

    defineField({
      name: 'eventDateEnd',
      title: 'Event Date End',
      type: 'datetime',
      description: 'Optional',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'blockContent',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image',
    },
  },
});
