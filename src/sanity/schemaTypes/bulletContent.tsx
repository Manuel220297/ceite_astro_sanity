// bulletContent.ts
import { defineType, defineArrayMember } from 'sanity';

export default defineType({
  title: 'Bullet Content',
  name: 'bulletContent',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [],
      lists: [{ title: 'Bullet', value: 'bullet' }],
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
        annotations: [],
      },
    }),
  ],
  validation: (Rule) =>
    Rule.custom((blocks: any[] | undefined) => {
      if (!blocks) return true;
      const hasNonBullet = blocks.some((block) => block._type === 'block' && block.listItem !== 'bullet');
      return hasNonBullet ? 'Only bulleted list items are allowed.' : true;
    }),
});
