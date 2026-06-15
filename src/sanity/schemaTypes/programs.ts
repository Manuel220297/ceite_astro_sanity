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
          description: 'Optional. Provides a description for the image.',
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
          description: 'Optional. Provides a description for the image.',
        },
      ],
    }),

    defineField({
      name: 'body',
      title: 'Body',
      description: 'Write a comprehensive description of the program for display on the website.',
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
      name: 'gallery',
      title: 'Gallery',
      description:
        "Upload images that represent the program's facilities, activities, and student learning experiences. (Maximum of 10 images)",
      type: 'array',
      of: [
        {
          type: 'image',
          validation: (rule) => rule.required().error('An image is required'),
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative Text',
              description: 'Optional. Provides a description for the image.',
            },
          ],
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
