import type { CollectionEntry } from 'astro:content';
import { getSemesterUnits } from './getSemesterUnits';

export function getProgramUnits(prog: CollectionEntry<'programs'>) {
  return prog.data.curriculum.reduce((sum, c) => {
    return sum + getSemesterUnits(c.firstSemester?.subjects) + getSemesterUnits(c.secondSemester?.subjects);
  }, 0);
}
