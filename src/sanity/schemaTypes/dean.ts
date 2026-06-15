import { defineField, defineType } from 'sanity';

export const deanType = defineType({
  name: 'dean',
  title: 'Dean',
  type: 'document',
  options: {
    singleton: true,
  },

  fieldsets: [
    {
      name: 'socials',
      title: 'Social Media',
      description: '(Optional)',
      options: {
        collapsible: true,
        collapsed: false,
      },
    },
  ],

  fields: [
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
          { title: 'Dr.', value: 'Dr.' },
          { title: 'Engr.', value: 'Engr.' },
          { title: 'Custom', value: 'custom' },
        ],
      },
    }),

    defineField({
      name: 'customHonorific',
      title: 'Custom Honorific',
      type: 'string',
      hidden: ({ document }) => document?.honorifics !== 'custom',
      validation: (rule) =>
        rule.custom((value, context) => {
          if (context.document?.honorifics === 'custom' && !value) {
            return 'Please enter a custom honorific';
          }
          return true;
        }),
    }),

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
      name: 'email',
      title: 'Email',
      type: 'string',
      description: '(Optional)',
      validation: (rule) => rule.email(),
    }),

    // Social Media Fieldset
    defineField({
      name: 'facebook',
      title: 'Facebook',
      type: 'url',
      description: 'Facebook profile or page URL (Optional)',
      fieldset: 'socials',
    }),

    defineField({
      name: 'twitter',
      title: 'Twitter (X)',
      type: 'url',
      description: 'X/Twitter profile URL (Optional)',
      fieldset: 'socials',
    }),

    defineField({
      name: 'instagram',
      title: 'Instagram',
      type: 'url',
      description: 'Instagram profile URL (Optional)',
      fieldset: 'socials',
    }),

    defineField({
      name: 'tiktok',
      title: 'TikTok',
      type: 'url',
      description: 'TikTok profile URL (Optional)',
      fieldset: 'socials',
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
  ],

  preview: {
    select: {
      firstName: 'firstName',
      middleName: 'middleName',
      lastName: 'lastName',
      honorifics: 'honorifics',
      media: 'image',
    },

    prepare({ honorifics, firstName, middleName, lastName, media }) {
      const fullname = [honorifics, firstName, middleName, lastName].filter(Boolean).join(' ');

      return {
        title: fullname || 'Unnamed',
        media,
      };
    },
  },
});
