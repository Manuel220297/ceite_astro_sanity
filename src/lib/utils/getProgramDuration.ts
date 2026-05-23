import type { CollectionEntry } from 'astro:content';

export function getProgramDuration(program: CollectionEntry<'programs'>) {
  return (
    program.data.curriculum.findLastIndex(
      (year) => (year.firstSemester?.subjects?.length ?? 0) > 0 || (year.secondSemester?.subjects?.length ?? 0) > 0,
    ) + 1
  );
}
