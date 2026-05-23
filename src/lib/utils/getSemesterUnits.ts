import type { Subject } from '../../content.config';

export function getSemesterUnits(subjects: Subject[] | null | undefined = []) {
  return (subjects ?? []).reduce((sum, s) => {
    return sum + (s.units ?? 0);
  }, 0);
}
