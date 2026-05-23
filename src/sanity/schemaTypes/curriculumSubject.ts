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
      name: 'isSpecialization',
      description: 'Only select it if the subject is a specialization. (Example: IT elective)',
      type: 'boolean',
      initialValue: false,
      title: 'Is Specialization',
    }),
  ],
});
