import { defineField, defineType } from 'sanity';

export const specializationType = defineType({
  name: 'specialization',
  title: 'Specialization',
  type: 'document',
  fields: [
    defineField({
      name: 'specialization',
      type: 'string',
      title: 'Specialization name',
      validation: (Rule) =>
        Rule.custom(async (value, context) => {
          if (!value) return true;

          const { document, getClient } = context;
          const client = getClient({ apiVersion: '2026-04-08' });

          const rawId = document?._id ?? '';
          const publishedId = rawId.replace(/^drafts\./, '');

          // console.log('rawId:', rawId);
          // console.log('publishedId:', publishedId);
          // console.log('draftId:', `drafts.${publishedId}`);

          const query = `*[
            _type == "specialization" &&
            specialization == $value &&
            _id != $publishedId &&
            _id != $draftId
          ]{ _id, specialization }`;

          const results = await client.fetch(query, {
            value,
            publishedId,
            draftId: `drafts.${publishedId}`,
          });

          return results.length === 0 ? true : 'A specialization with this name already exists.';
        }),
    }),
    defineField({
      name: 'color',
      type: 'color',
      title: 'Color',
      options: { disableAlpha: true },
    }),
    defineField({
      name: 'body',
      title: 'Body',
      description:
        'Write a brief summary of the specialization, including what learners will study and the core skills covered. Tip: Use bullet points to highlight core skills, topics, etc.',
      type: 'array',
      of: [
        {
          type: 'block',
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
              {
                title: 'Highlight',
                value: 'highlight',
                component: (props) => <span style={{ color: '#ff9c45' }}>{props.children}</span>,
              },
            ],
          },
          lists: [{ title: 'Bullet', value: 'bullet' }],
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H3', value: 'h3' },
            { title: 'H4', value: 'h4' },
            { title: 'H5', value: 'h5' },
          ],
        },
      ],
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
      title: 'specialization',
      media: 'image',
    },
  },
});
