import { defineField, defineType } from 'sanity';

export const announcementType = defineType({
  name: 'announcement',
  title: 'Announcement',
  type: 'document',
  options: {
    singleton: true,
  },
  fields: [
    defineField({
      name: 'announcements',
      title: 'Announcements',
      description: 'Maximum of 5 announcements',
      type: 'array',
      validation: (Rule) => Rule.max(5),
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'body',
              title: 'Body',
              type: 'array',
              of: [
                {
                  type: 'block',
                  styles: [{ title: 'Normal', value: 'normal' }],
                  lists: [],
                  marks: {
                    decorators: [],
                    annotations: [
                      {
                        name: 'link',
                        type: 'object',
                        title: 'Link',
                        validation: (Rule) => Rule.required(),
                        fields: [
                          {
                            name: 'href',
                            type: 'url',
                            title: 'URL',
                          },
                        ],
                      },
                    ],
                  },
                },
              ],
            },
          ],
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Announcement',
      };
    },
  },
});
