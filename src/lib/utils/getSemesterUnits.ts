export const getSemesterUnits = (subjects: { units: number }[] | null | undefined) =>
  (subjects ?? []).reduce((sum, s) => sum + (s.units ?? 0), 0);
