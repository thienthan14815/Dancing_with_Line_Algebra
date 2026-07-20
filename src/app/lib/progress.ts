import type { MicroLesson, Section } from '../../core/content/types';
import type { SkillMastery } from '../../core/db/schema';

/**
 * Một micro-lesson được coi là "đã xong" khi:
 *   (a) nằm trong tập completed app-local (đánh dấu lúc kết thúc bài), HOẶC
 *   (b) MỌI skill của bài đều có mastery.score > 0 (suy luận mềm — người học đã
 *       chạm tới các kỹ năng đó). Đây là fallback theo đúng contract vì core
 *       store không lưu tập id bài đã xong.
 */
export function lessonDone(
  lesson: MicroLesson,
  mastery: Record<string, SkillMastery>,
  done: Record<string, string>,
): boolean {
  if (done[lesson.id]) return true;
  if (!lesson.skillIds.length) return false;
  return lesson.skillIds.every((sid) => (mastery[sid]?.score ?? 0) > 0);
}

export interface SectionProgress {
  done: number;
  total: number;
  pct: number; // 0..1
}

/** Tiến độ hoàn thành của một section theo micro-lesson. */
export function sectionProgress(
  section: Section,
  mastery: Record<string, SkillMastery>,
  done: Record<string, string>,
): SectionProgress {
  let total = 0;
  let doneCount = 0;
  for (const unit of section.units) {
    for (const lesson of unit.lessons) {
      total += 1;
      if (lessonDone(lesson, mastery, done)) doneCount += 1;
    }
  }
  return { done: doneCount, total, pct: total ? doneCount / total : 0 };
}
