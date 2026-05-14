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
      name: 'curriculum',
      title: 'Curriculum',
      type: 'array',
      initialValue: [
        {
          year: '1st Year',
          firstSemester: { subjects: [] },
          secondSemester: { subjects: [] },
        },
        {
          year: '2nd Year',
          firstSemester: { subjects: [] },
          secondSemester: { subjects: [] },
        },
        {
          year: '3rd Year',
          firstSemester: { subjects: [] },
          secondSemester: { subjects: [] },
        },
        {
          year: '4th Year',
          firstSemester: { subjects: [] },
          secondSemester: { subjects: [] },
        },
      ],
      options: {
        sortable: false,
        disableActions: ['add', 'remove', 'copy', 'duplicate'],
      },
      of: [
        {
          type: 'object',
          fields: [
            { name: 'year', type: 'string', title: 'Year level', readOnly: true },
            {
              name: 'firstSemester',
              title: '1st Semester',
              type: 'object',
              fields: [
                {
                  name: 'units',
                  title: 'Units',
                  description: 'Total units for this semester',
                  type: 'number',
                },
                {
                  name: 'subjects',
                  type: 'array',
                  title: 'Subjects',
                  of: [{ type: 'curriculumSubject' }],
                },
              ],
            },
            {
              name: 'secondSemester',
              title: '2nd Semester',
              type: 'object',
              fields: [
                {
                  name: 'units',
                  title: 'Units',
                  description: 'Total units for this semester',
                  type: 'number',
                },
                {
                  name: 'subjects',
                  type: 'array',
                  title: 'Subjects',
                  of: [{ type: 'curriculumSubject' }],
                },
              ],
            },
          ],
          preview: {
            select: {
              title: 'year',
              s0: 'firstSemester.subjects[0].subject',
              s1: 'firstSemester.subjects[1].subject',
              s2: 'secondSemester.subjects[0].subject',
              s3: 'secondSemester.subjects[1].subject',
            },
            prepare({ title, s0, s1, s2, s3 }) {
              const sem1 = [s0, s1].filter(Boolean).join(' · ');
              const sem2 = [s2, s3].filter(Boolean).join(' · ');
              const parts = [sem1 && `Sem 1: ${sem1}`, sem2 && `Sem 2: ${sem2}`].filter(Boolean);
              return {
                title,
                subtitle: parts.length ? parts.join('  |  ') : 'No subjects yet',
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
