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

          // console.log('matched duplicates:', results);

          return results.length === 0 ? true : 'A specialization with this name already exists.';
        }),
    }),
    defineField({
      name: 'color',
      type: 'color',
      title: 'Color',
      options: { disableAlpha: true },
    }),
  ],
  preview: {
    select: {
      title: 'specialization',
      color: 'color.hex',
    },
    prepare({ title, color }) {
      return {
        title: title ?? 'Untitled',
        media: (
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: color ?? '#ccc',
              borderRadius: 2,
            }}
          />
        ),
      };
    },
  },
});
