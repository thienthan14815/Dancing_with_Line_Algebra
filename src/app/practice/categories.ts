// =============================================================================
// PRACTICE CENTER — logic thuần suy ra 6 danh mục luyện tập từ trạng thái học.
// Không UI, không side-effect. Nhận một "snapshot" của store rồi trả về danh
// sách PracticeCategory (mỗi cái đã kèm sẵn tập bài để mở PracticeSession).
//
// Cách suy ra skillIds cho từng danh mục:
//  1. mistakes — skill của các attempt gần đây có isCorrect === false.
//  2. weak     — skill có masteryBySkill[sid].score thấp nhất (và CÓ bài để luyện).
//  3. due      — skill có ReviewItem đang isDue (spaced repetition / Leitner).
//  4. matrix   — lọc TRỰC TIẾP các bài type === 'matrix-input' từ toàn ngân hàng.
//  5. visual   — lọc TRỰC TIẾP các bài dimension === 'visual' từ toàn ngân hàng.
//  6. mixed    — trộn ỔN ĐỊNH (seeded, không đổi mỗi render) các skill có bài.
//
// Các danh mục matrix/visual/mixed luôn có bài (từ toàn bộ EXERCISES) nên người
// mới vẫn dùng được ngay; mistakes/weak/due có thể rỗng và sẽ hiện trạng thái
// rỗng thân thiện ở tầng UI.
// =============================================================================

import type { Exercise } from '../../core/exercises/types';
import type { ReviewItem, SkillMastery, UserAttempt } from '../../core/db/schema';
import {
  EXERCISES,
  EXERCISES_BY_SKILL,
  getExercisesForSkills,
} from '../../core/content/exerciseBank';
import { getSkill } from '../../core/content/skills';
import { isDue } from '../../core/progress/srs';

/** Định danh 6 danh mục luyện tập. */
export type CategoryId = 'mistakes' | 'weak' | 'due' | 'matrix' | 'visual' | 'mixed';

/** Một danh mục luyện tập đã sẵn sàng để hiển thị + mở phiên. */
export interface PracticeCategory {
  id: CategoryId;
  /** Nhãn danh mục (tiếng Việt). */
  title: string;
  /** Mô tả ngắn. */
  subtitle: string;
  /** Emoji minh hoạ. */
  icon: string;
  /** Skill mà danh mục nhắm tới (để hiển thị "chip" minh bạch). */
  skillIds: string[];
  /** Tập bài đã giải quyết sẵn để chạy phiên. */
  exercises: Exercise[];
  /** Thông điệp khi danh mục rỗng (chưa có gì để ôn). */
  emptyHint: string;
}

/** Dữ liệu tối thiểu cần lấy từ useLearnStore. */
export interface StoreSnapshot {
  attempts: UserAttempt[];
  masteryBySkill: Record<string, SkillMastery>;
  reviewItems: Record<string, ReviewItem>;
}

/** Số bài tối đa gom cho mỗi phiên (đủ dài để có ý nghĩa, không quá tải). */
const MAX_PER_SESSION = 12;
/** Số skill yếu nhất lấy ra cho danh mục "Kỹ năng yếu". */
const MAX_WEAK_SKILLS = 6;
/** Số skill lấy ra cho danh mục "Trộn nhiều chủ đề". */
const MAX_MIX_SKILLS = 8;

/** Giữ thứ tự, bỏ trùng. */
function dedupe(ids: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const id of ids) {
    if (seen.has(id)) continue;
    seen.add(id);
    out.push(id);
  }
  return out;
}

/** Skill có ít nhất một bài trong ngân hàng? */
function hasExercises(skillId: string): boolean {
  const b = EXERCISES_BY_SKILL[skillId];
  return Array.isArray(b) && b.length > 0;
}

/** Hash chuỗi ổn định (FNV-1a) → dùng cho thứ tự "ngẫu nhiên nhưng cố định". */
function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// --- 1. Ôn lỗi sai ----------------------------------------------------------
/** Skill của các lần làm SAI gần đây (mới nhất trước). */
export function mistakeSkillIds(attempts: UserAttempt[]): string[] {
  const wrong: string[] = [];
  for (let i = attempts.length - 1; i >= 0; i--) {
    const a = attempts[i];
    if (!a.isCorrect) wrong.push(a.skillId);
  }
  return dedupe(wrong);
}

// --- 2. Kỹ năng yếu ---------------------------------------------------------
/** Skill (có bài luyện) sắp theo mastery score TĂNG dần — yếu nhất trước. */
export function weakSkillIds(
  masteryBySkill: Record<string, SkillMastery>,
  limit = MAX_WEAK_SKILLS,
): string[] {
  return Object.values(masteryBySkill)
    .filter((m) => hasExercises(m.skillId))
    .sort((a, b) => a.score - b.score)
    .slice(0, limit)
    .map((m) => m.skillId);
}

// --- 3. Bài sắp quên (SRS) --------------------------------------------------
/** Skill có ReviewItem đang tới hạn ôn (isDue), sớm-hạn trước. */
export function dueSkillIds(
  reviewItems: Record<string, ReviewItem>,
  nowISO: string,
): string[] {
  return Object.values(reviewItems)
    .filter((it) => isDue(it, nowISO))
    .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime())
    .map((it) => it.skillId);
}

// --- 6. Trộn nhiều chủ đề (stable shuffle) ----------------------------------
/** Danh sách skill có bài, xáo trộn ỔN ĐỊNH theo hash (không đổi giữa các render). */
export function mixedSkillIds(limit = MAX_MIX_SKILLS): string[] {
  const SEED = 'linalglab-mix-v1';
  return Object.keys(EXERCISES_BY_SKILL)
    .filter(hasExercises)
    .sort((a, b) => hashStr(a + SEED) - hashStr(b + SEED))
    .slice(0, limit);
}

/** Skill (duy nhất, theo thứ tự xuất hiện) của một tập bài. */
function skillIdsOf(exercises: Exercise[]): string[] {
  return dedupe(exercises.map((e) => e.skillId));
}

/**
 * Dựng đủ 6 danh mục từ snapshot store. `nowISO` cho phép gọi thuần (test được).
 */
export function buildCategories(
  snap: StoreSnapshot,
  nowISO: string = new Date().toISOString(),
): PracticeCategory[] {
  // 1 — Ôn lỗi sai
  const mistakes = mistakeSkillIds(snap.attempts);
  const mistakeEx = getExercisesForSkills(mistakes, MAX_PER_SESSION);

  // 2 — Kỹ năng yếu
  const weak = weakSkillIds(snap.masteryBySkill);
  const weakEx = getExercisesForSkills(weak, MAX_PER_SESSION);

  // 3 — Bài sắp quên
  const due = dueSkillIds(snap.reviewItems, nowISO);
  const dueEx = getExercisesForSkills(due, MAX_PER_SESSION);

  // 4 — Luyện ma trận (lọc theo dạng bài, luôn có bài)
  const matrixEx = EXERCISES.filter((e) => e.type === 'matrix-input').slice(
    0,
    MAX_PER_SESSION,
  );

  // 5 — Luyện trực quan (lọc theo dimension, luôn có bài)
  const visualEx = EXERCISES.filter((e) => e.dimension === 'visual').slice(
    0,
    MAX_PER_SESSION,
  );

  // 6 — Trộn nhiều chủ đề (ổn định, luôn có bài)
  const mixed = mixedSkillIds();
  const mixedEx = getExercisesForSkills(mixed, MAX_PER_SESSION);

  return [
    {
      id: 'mistakes',
      title: 'Ôn lỗi sai',
      subtitle: 'Làm lại các dạng bài bạn từng trả lời sai gần đây.',
      icon: '🩹',
      skillIds: skillIdsOf(mistakeEx),
      exercises: mistakeEx,
      emptyHint: 'Chưa có lỗi nào để ôn — hãy học vài bài trước!',
    },
    {
      id: 'weak',
      title: 'Kỹ năng yếu',
      subtitle: 'Tập trung vào những kỹ năng có độ thành thạo thấp nhất.',
      icon: '💪',
      skillIds: skillIdsOf(weakEx),
      exercises: weakEx,
      emptyHint: 'Chưa đủ dữ liệu về kỹ năng — hãy học vài bài trước!',
    },
    {
      id: 'due',
      title: 'Bài sắp quên',
      subtitle: 'Ôn đúng lúc theo lịch lặp lại ngắt quãng (spaced repetition).',
      icon: '⏰',
      skillIds: skillIdsOf(dueEx),
      exercises: dueEx,
      emptyHint: 'Chưa có bài nào tới hạn ôn — quay lại sau nhé!',
    },
    {
      id: 'matrix',
      title: 'Luyện ma trận',
      subtitle: 'Các bài nhập ma trận: cộng vector, tổ hợp, khử Gauss…',
      icon: '🔢',
      skillIds: skillIdsOf(matrixEx),
      exercises: matrixEx,
      emptyHint: 'Chưa có bài ma trận nào.',
    },
    {
      id: 'visual',
      title: 'Luyện trực quan',
      subtitle: 'Các bài vẽ vector và tư duy hình học trên mặt phẳng.',
      icon: '🎯',
      skillIds: skillIdsOf(visualEx),
      exercises: visualEx,
      emptyHint: 'Chưa có bài trực quan nào.',
    },
    {
      id: 'mixed',
      title: 'Trộn nhiều chủ đề',
      subtitle: 'Một phiên ngẫu nhiên trải đều nhiều kỹ năng khác nhau.',
      icon: '🎲',
      skillIds: skillIdsOf(mixedEx),
      exercises: mixedEx,
      emptyHint: 'Chưa có bài nào.',
    },
  ];
}

/** Tên hiển thị của skill (fallback = id nếu không tra được). */
export function skillLabel(skillId: string): string {
  return getSkill(skillId)?.name ?? skillId;
}
