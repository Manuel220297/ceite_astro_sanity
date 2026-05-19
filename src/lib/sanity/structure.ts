import type { StructureResolver } from 'sanity/structure';
import { singletonDocumentListItem } from 'sanity-plugin-singleton-management';

export const structure: StructureResolver = (S, context) =>
  S.list()
    .title('Content')
    .items([
      // Group 1: Programs and Specialization
      S.listItem()
        .title('Academics')
        .child(
          S.list()
            .title('Academics')
            .items([
              S.documentTypeListItem('programs').title('Programs'),
              S.documentTypeListItem('specialization').title('Specializations'),
              S.documentTypeListItem('projects').title('Student Projects'),
            ]),
        ),

      S.divider(),

      // Group 2: Dean and Staffs
      S.listItem()
        .title('Faculty')
        .child(
          S.list()
            .title('Faculty')
            .items([
              // ← Replaced with singleton version
              singletonDocumentListItem({ S, context, type: 'dean', title: 'Dean' }),
              S.documentTypeListItem('staffs').title('Staffs'),
            ]),
        ),

      S.divider(),

      S.listItem()
        .title('School Details')
        .child(
          S.list()
            .title('School Details')
            .items([
              S.documentTypeListItem('news').title('Happenings'),
              singletonDocumentListItem({ S, context, type: 'about', title: 'About' }),
              singletonDocumentListItem({ S, context, type: 'announcement', title: 'Announcement' }),
            ]),
        ),

      S.divider(),

      // Keep any remaining types listed automatically (optional)
      ...S.documentTypeListItems().filter(
        (item) =>
          !['programs', 'specialization', 'projects', 'dean', 'staffs', 'news', 'about', 'announcement'].includes(
            item.getId() ?? '',
          ),
      ),
    ]);
