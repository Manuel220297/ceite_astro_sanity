import { defineField, defineType } from 'sanity';

export const newsType = defineType({
  name: 'news',
  title: 'Happenings',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'slug',
      type: 'slug',
      validation: (rule) => rule.required(),
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
          { title: 'Story', value: 'Story' },
        ],
      },
    }),
    defineField({
      name: 'pin',
      title: 'Pin post',
      type: 'boolean',
      description: 'Pinned post will appear at the hero section. Only 5 items can be pinned at a time.',
      validation: (Rule) =>
        Rule.custom(async (value, context) => {
          if (!value) return true;

          const client = context.getClient({ apiVersion: '2023-01-01' });

          const count = await client.fetch(`count(*[_type == "news" && pin == true && !(_id in [$currentId])])`, {
            currentId: context.document?._id,
          });

          if (count >= 5) {
            return 'You can only pin up to 5 news items.';
          }

          return true;
        }),
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
