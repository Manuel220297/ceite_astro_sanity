import type { CollectionEntry } from 'astro:content';

type CurriculumEntry = CollectionEntry<'curriculum'>;

export function getTotalUnits(curriculum: CurriculumEntry | undefined | null): number {
  if (!curriculum) return 0;

  return (curriculum.data.years ?? []).reduce((sum, year) => {
    if (!year) return sum;

    return (
      sum +
      (year.semesters ?? []).reduce((semSum, sem) => {
        if (!sem) return semSum;

        return semSum + (sem.subjects ?? []).reduce((subSum, s) => subSum + (s.units ?? 0), 0);
      }, 0)
    );
  }, 0);
}
