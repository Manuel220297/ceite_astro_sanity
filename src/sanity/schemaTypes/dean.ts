import { defineField, defineType } from 'sanity';

export const deanType = defineType({
  name: 'dean',
  title: 'Dean',
  type: 'document',
  options: {
    singleton: true,
  },
  fields: [
    defineField({
      name: 'firstName',
      title: 'First name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'middleName',
      title: 'Middle name',
      type: 'string',
      description: 'Optional',
    }),

    defineField({
      name: 'lastName',
      title: 'Last Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'honorifics',
      title: 'Honorifics',
      type: 'string',
      validation: (rule) => rule.required(),
      options: {
        layout: 'radio',
        list: [
          { title: "Ma'am", value: "Ma'am" },
          { title: 'Sir', value: 'Sir' },
        ],
      },
    }),

    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      description: '(Optional)',
      validation: (rule) => rule.email(),
    }),

    defineField({
      name: 'facebook',
      title: 'Facebook',
      type: 'url',
      description: 'Facebook profile or page URL (Optional)',
    }),

    defineField({
      name: 'twitter',
      title: 'Twitter (X)',
      type: 'url',
      description: 'X/Twitter profile URL (Optional)',
    }),

    defineField({
      name: 'tiktok',
      title: 'TikTok',
      type: 'url',
      description: 'TikTok profile URL (Optional)',
    }),

    defineField({
      name: 'instagram',
      title: 'Instagram',
      type: 'url',
      description: 'Instagram profile URL (Optional)',
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
          description: 'Optional',
        },
      ],
    }),
  ],

  preview: {
    select: {
      firstName: 'firstName',
      middleName: 'middleName',
      lastName: 'lastName',
      media: 'image',
    },

    prepare({ firstName, middleName, lastName, media }) {
      const fullname = [firstName, middleName, lastName].filter(Boolean).join(' ');

      return {
        title: fullname || 'Unnamed',
        media,
      };
    },
  },
});
