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
      validation: (rule) => rule.required().error('Required to generate a page on the website'),
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
      name: 'curriculum',
      title: 'Curriculum',
      type: 'array',
      initialValue: [
        { year: '1st Year', subjects: [] },
        { year: '2nd Year', subjects: [] },
        { year: '3rd Year', subjects: [] },
        { year: '4th Year', subjects: [] },
      ],
      options: {
        sortable: false,
        disableActions: ['add', 'remove', 'duplicate', 'copy'],
      },
      of: [
        {
          type: 'object',
          fields: [
            { name: 'year', type: 'string', title: 'Year level', readOnly: true },
            {
              name: 'subjects',
              type: 'array',
              title: 'Subjects',
              readOnly: false,
              of: [
                {
                  type: 'object',
                  fields: [
                    {
                      name: 'subject',
                      type: 'string',
                      title: 'Subject',
                      validation: (rule) => rule.required().error('Subject name is required'),
                    },
                    {
                      name: 'specialization',
                      description: 'Optional. Select nothing this subject is not a specialization',
                      type: 'reference',
                      title: 'Specialization',
                      to: [{ type: 'specialization' }],
                      options: {
                        filter: ({ document }) => {
                          const program = document as { specializations?: { _ref: string }[] };
                          const refs = program.specializations?.map((s) => s._ref).filter(Boolean) ?? [];
                          if (refs.length === 0) return { filter: 'false' };
                          return { filter: '_id in $refs', params: { refs } };
                        },
                      },
                    },
                  ],
                },
              ],
            },
          ],
          preview: {
            select: {
              title: 'year',
              s0: 'subjects[0].subject',
              s1: 'subjects[1].subject',
              s2: 'subjects[2].subject',
              s3: 'subjects[3].subject',
            },
            prepare({ title, s0, s1, s2, s3 }) {
              const subjects = [s0, s1, s2, s3].filter(Boolean);
              const preview = subjects.length ? subjects.join(' · ') : 'No subjects yet';
              return {
                title,
                subtitle: preview,
              };
            },
          },
        },
      ],
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
