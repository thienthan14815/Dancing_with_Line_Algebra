import type { Section } from '../../core/content/types';

/** Access is independent of completion: preview never fabricates progress. */
export function sectionIsAccessible(
  section: Section,
  sections: Section[],
  progressOf: (section: Section) => number,
  developerMode: boolean,
): boolean {
  return developerMode || (section.prerequisiteSectionIds ?? []).every((id) => {
    const prerequisite = sections.find((candidate) => candidate.id === id);
    return !prerequisite || progressOf(prerequisite) >= 0.6;
  });
}
