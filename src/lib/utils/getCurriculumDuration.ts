import type { CollectionEntry } from 'astro:content';

type CurriculumEntry = CollectionEntry<'curriculum'>;

export function getCurriculumDuration(curriculum: CurriculumEntry | undefined | null): number {
  if (!curriculum) return 0;

  const curriculumYears = curriculum.data.years?.map((y) => y?.year ?? 0) ?? [];
  const duration = curriculumYears.length > 0 ? Math.max(...curriculumYears) : 0;
  return duration;
}
