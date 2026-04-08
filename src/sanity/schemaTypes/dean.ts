// ./src/sanity/schemaTypes/news.ts
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
