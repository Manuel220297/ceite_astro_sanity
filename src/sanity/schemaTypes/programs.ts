import { defineField, defineType } from 'sanity';

export const programType = defineType({
  name: 'programs',
  title: 'Programs',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'titleLong',
      title: 'Title Long',
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
      validation: (rule) =>
        rule
          .required()
          .error(
            'Required to generate a page on the website, Slug can only contain letters, numbers, dashes (-), and underscores (_)',
          )
          .custom((slug) => {
            if (!slug?.current) return true;
            return /^[a-zA-Z0-9_-]+$/.test(slug.current)
              ? true
              : 'Slug can only contain letters, numbers, dashes (-), and underscores (_)';
          }),
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
      name: 'logo',
      title: 'Logo',
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
      name: 'specializations',
      title: 'Specializations',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'specialization' }] }],
      validation: (rule) =>
        rule.custom((items) => {
          if (!items) return true;

          const refs = (items as { _ref: string }[]).map((item) => item._ref).filter(Boolean);

          const duplicates = refs.filter((id, index) => refs.indexOf(id) !== index);

          if (duplicates.length > 0) {
            return 'Each specialization can only be used once';
          }

          return true;
        }),
    }),

    defineField({
      name: 'body',
      title: 'Body',
      type: 'blockContent',
    }),
    defineField({
      name: 'objectives',
      title: 'Objectives',
      type: 'bulletContent',
      initialValue: [
        {
          _type: 'block',
          _key: 'initial',
          style: 'normal',
          listItem: 'bullet',
          level: 1,
          children: [
            {
              _type: 'span',
              _key: 'initialSpan',
              text: '',
              marks: [],
            },
          ],
          markDefs: [],
        },
      ],
    }),
    defineField({
      name: 'careers',
      title: 'Careers',
      type: 'bulletContent',
      initialValue: [
        {
          _type: 'block',
          _key: 'initial',
          style: 'normal',
          listItem: 'bullet', // ← this makes it a bullet
          level: 1,
          children: [
            {
              _type: 'span',
              _key: 'initialSpan',
              text: '',
              marks: [],
            },
          ],
          markDefs: [],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'logo',
    },
  },
});
