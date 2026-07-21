// =============================================================================
// FLASHCARD + SỔ LỖI — logic thuần suy dữ liệu từ trạng thái học.
// Không UI, không side-effect. Dùng chung cho FlashcardSession & MistakeNotebook.
//
//  • buildDueFlashcards(reviewItems) → thẻ ghi nhớ cho các skill ĐẾN HẠN (SRS).
//  • buildMistakeEntries(attempts)   → sổ các lần trả lời SAI (mới nhất trước).
//  • answerText / explainText        → suy đáp án & giải thích ngắn từ Exercise.
// =============================================================================

import type { Exercise } from '../../core/exercises/types';
import type { ReviewItem, UserAttempt, ErrorType } from '../../core/db/schema';
import { EXERCISES, EXERCISES_BY_SKILL } from '../../core/content/exerciseBank';
import { getSkill } from '../../core/content/skills';
import { getDueSkills } from '../../core/progress/srs';

/** Tra cứu nhanh bài theo id (dựng một lần lúc import). */
const EX_BY_ID: Map<string, Exercise> = new Map(EXERCISES.map((e) => [e.id, e]));

/** Nhãn tiếng Việt cho từng dạng bài (dùng ở mặt trước thẻ / header sổ lỗi). */
export const TYPE_LABEL: Record<Exercise['type'], string> = {
  'multiple-choice': 'Trắc nghiệm',
  'numeric-input': 'Nhập số',
  'matrix-input': 'Nhập ma trận',
  matching: 'Ghép cặp',
  'step-ordering': 'Sắp xếp bước',
  'vector-drawing': 'Vẽ vector',
  'error-detection': 'Tìm lỗi sai',
  'true-false': 'Đúng / Sai',
};

/** Một thẻ ghi nhớ đã sẵn sàng lật (mặt trước = câu hỏi, mặt sau = đáp án). */
export interface FlashCard {
  skillId: string;
  skillName: string;
  /** Câu hỏi / đề (mặt trước) — có thể chứa LaTeX. */
  front: string;
  /** Đáp án ngắn (mặt sau, dòng đầu). */
  answer: string;
  /** Giải thích ngắn (mặt sau) — có thể rỗng. */
  explain: string;
  /** Nhãn dạng bài để hiển thị nhỏ. */
  typeLabel: string;
}

/** Một mục trong Sổ lỗi sai. */
export interface MistakeEntry {
  attemptId: string;
  exercise: Exercise;
  errorType?: ErrorType;
  /** ISO thời điểm trả lời sai gần nhất cho bài này. */
  createdAt: string;
}

/** Đáp án chuẩn (ngắn) suy trực tiếp từ dữ liệu bài — không kèm giải thích. */
export function answerText(ex: Exercise): string {
  switch (ex.type) {
    case 'multiple-choice':
      return ex.options[ex.answerIndex] ?? '';
    case 'numeric-input':
      return `${ex.answer}${ex.unit ? ` ${ex.unit}` : ''}`;
    case 'matrix-input':
      return ex.answer.map((row) => `[ ${row.join('  ')} ]`).join('\n');
    case 'matching':
      return ex.pairs
        .map(([l, r]) => `${ex.left[l] ?? l} ↔ ${ex.right[r] ?? r}`)
        .join('\n');
    case 'step-ordering':
      return ex.steps.map((s, i) => `${i + 1}. ${s}`).join('\n');
    case 'vector-drawing':
      return `(${ex.target[0]}, ${ex.target[1]})`;
    case 'error-detection':
      return `Dòng sai là dòng ${ex.wrongLineIndex + 1}: "${ex.lines[ex.wrongLineIndex]}"`;
    case 'true-false':
      return ex.answer ? 'Đúng' : 'Sai';
    default: {
      const _exhaustive: never = ex;
      return String(_exhaustive);
    }
  }
}

/** Giải thích ngắn của bài (rỗng nếu bài không có `explain`). */
export function explainText(ex: Exercise): string {
  const e = (ex as { explain?: string }).explain;
  return typeof e === 'string' ? e : '';
}

/** Câu hỏi mặt trước: ưu tiên đề bài; True/False dùng mệnh đề nếu rõ hơn. */
function frontText(ex: Exercise): string {
  if (ex.type === 'true-false' && ex.statement) {
    return `Đúng hay Sai? ${ex.statement}`;
  }
  return ex.prompt;
}

/**
 * Dựng danh sách thẻ đến hạn từ `reviewItems`. Mỗi skill đến hạn CÓ bài trong
 * ngân hàng → một thẻ (lấy bài đại diện ĐẦU tiên, ổn định giữa các render).
 * Skill đến hạn nhưng không có bài sẽ bị bỏ (không thể tạo mặt sau).
 */
export function buildDueFlashcards(
  reviewItems: Record<string, ReviewItem>,
  nowISO: string = new Date().toISOString(),
): FlashCard[] {
  const cards: FlashCard[] = [];
  for (const skillId of getDueSkills(reviewItems, nowISO)) {
    const bucket = EXERCISES_BY_SKILL[skillId];
    if (!Array.isArray(bucket) || bucket.length === 0) continue;
    const ex = bucket[0];
    cards.push({
      skillId,
      skillName: getSkill(skillId)?.name ?? skillId,
      front: frontText(ex),
      answer: answerText(ex),
      explain: explainText(ex),
      typeLabel: TYPE_LABEL[ex.type],
    });
  }
  return cards;
}

/**
 * Sổ lỗi sai: mỗi bài từng trả lời SAI xuất hiện MỘT lần (lần sai gần nhất),
 * mới nhất trước. Bỏ qua attempt trỏ tới bài không còn trong ngân hàng.
 */
export function buildMistakeEntries(attempts: UserAttempt[], max = 30): MistakeEntry[] {
  const out: MistakeEntry[] = [];
  const seen = new Set<string>();
  for (let i = attempts.length - 1; i >= 0; i--) {
    const a = attempts[i];
    if (a.isCorrect || seen.has(a.exerciseId)) continue;
    const ex = EX_BY_ID.get(a.exerciseId);
    if (!ex) continue;
    seen.add(a.exerciseId);
    out.push({ attemptId: a.id, exercise: ex, errorType: a.errorType, createdAt: a.createdAt });
    if (out.length >= max) break;
  }
  return out;
}
