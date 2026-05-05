// ./src/sanity/schemaTypes/news.ts
import { defineField, defineType } from 'sanity';

export const staffType = defineType({
  name: 'staffs',
  title: 'Staffs',
  type: 'document',
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
      name: 'title',
      title: 'Staff Title',
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
