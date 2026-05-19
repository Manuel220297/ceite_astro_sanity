import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'curriculumSubject',
  title: 'Subject',
  type: 'object',
  fields: [
    defineField({
      name: 'subject',
      type: 'string',
      title: 'Subject',
      validation: (rule) => rule.required().error('Subject name is required'),
    }),
    defineField({
      name: 'units',
      type: 'number',
      title: 'Units',
      description: 'Number of units for this subject',
      validation: (rule) => rule.required().min(0).max(10).error('Units must be between 0 and 10'),
    }),
    defineField({
      name: 'specialization',
      description: 'Optional. Select nothing if this subject is not a specialization',
      type: 'reference',
      title: 'Specialization',
      to: [{ type: 'specialization' }],
      options: {
        disableNew: true,
        filter: ({ document }) => {
          const program = document as { specializations?: { _ref: string }[] };
          const refs = program.specializations?.map((s) => s._ref).filter(Boolean) ?? [];
          if (refs.length === 0) return { filter: 'false' };
          return { filter: '_id in $refs', params: { refs } };
        },
      },
    }),
  ],
});
