import { aboutType } from './about.ts';
import blockContent from './blockContent';
import { deanType } from './dean.ts';
import { newsType } from './news';
import { staffType } from './staffs.ts';
import { programType } from './programs';
import { projectType } from './projects.ts';
import { specializationType } from './specialization.tsx';
import { announcementType } from './announcement.ts';
import curriculumSubject from './curriculumSubject.ts';

export const schemaTypes = [
  blockContent,
  curriculumSubject,
  newsType,
  programType,
  specializationType,
  staffType,
  deanType,
  projectType,
  aboutType,
  announcementType,
];
