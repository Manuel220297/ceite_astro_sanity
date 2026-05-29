import { aboutType } from './about.ts';
import blockContent from './blockContent';
import { deanType } from './dean.ts';
import { newsType } from './news';
import { facultyType } from './faculty.ts';
import { programType } from './programs';
import { projectType } from './projects.ts';
import { specializationType } from './specialization.tsx';
import bulletContent from './bulletContent.tsx';

export const schemaTypes = [
  blockContent,
  bulletContent,
  newsType,
  programType,
  specializationType,
  facultyType,
  deanType,
  projectType,
  aboutType,
];
