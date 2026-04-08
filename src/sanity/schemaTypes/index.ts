import { aboutType } from './about.ts';
import blockContent from './blockContent';
import { deanType } from './dean.ts';
import { newsType } from './news';
import { professorType } from './professors.ts';
import { programType } from './programs';
import { projectType } from './projects.ts';
import { specializationType } from './specialization.tsx';

export const schemaTypes = [
  newsType,
  blockContent,
  programType,
  specializationType,
  professorType,
  deanType,
  projectType,
  aboutType,
];
