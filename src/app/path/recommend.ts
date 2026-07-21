// =====================================================================
// RECOMMENDATION ENGINE (W2) — đề xuất bài kế tiếp dựa trên ĐỒ THỊ TRI THỨC.
// Thuần hàm, không phụ thuộc React/store. Chỉ ĐỌC knowledgeGraph + course.
//
// Ý tưởng: khi người học vừa "vững" một skill (mastery ≥ ngưỡng), skill kế
// tiếp đáng học nhất là skill PHỤ THUỘC vào nó mà đã đủ nền (mọi prereq đạt)
// và bản thân chưa học. Chọn skill "sẵn sàng" nhất rồi map về micro-lesson.
// =====================================================================

import type { FlatMicroLesson, MicroLesson } from '../../core/content/types';
import type { SkillMastery } from '../../core/db/schema';
import {
  getDependents,
  getPrereqs,
  getUnmetPrereqs,
  topoLayers,
} from '../../core/content/knowledgeGraph';

/** Ngưỡng coi một skill là "đã vững / đủ nền" (khớp default của getUnmetPrereqs). */
export const MASTERED_THRESHOLD = 0.4;

export interface RecommendInput {
  /** Mastery hiện tại theo skillId (chỉ đọc). */
  mastery: Record<string, SkillMastery>;
  /** Danh sách phẳng micro-lesson theo trình tự học. */
  flat: FlatMicroLesson[];
  /** Bài đã hoàn thành? */
  isDone: (lesson: MicroLesson) => boolean;
  /** Bỏ qua bài này khi map/fallback (thường là bài "hiện tại" đang hiển thị). */
  excludeId?: string;
}

export interface Recommendation {
  lesson: FlatMicroLesson;
  /** Skill "vừa vững" tạo nên đề xuất; undefined nếu chỉ là fallback tuần tự. */
  reasonSkillId?: string;
}

// Độ sâu topo (số lớp) — dùng làm tie-break "nông trước". Build một lần.
let depthCache: Map<string, number> | null = null;
function depthOf(id: string): number {
  if (!depthCache) {
    depthCache = new Map();
    topoLayers().forEach((layer, d) => layer.forEach((s) => depthCache!.set(s, d)));
  }
  return depthCache.get(id) ?? 0;
}

/**
 * Đề xuất bài kế tiếp. Trả về undefined khi không còn bài nào để học.
 *
 * Thuật toán chấm điểm cuối cùng (candidate = skill phụ thuộc, đủ nền, chưa học):
 *   1) Ưu tiên số prereq ĐÃ ĐẠT nhiều hơn (skill càng "trung tâm"/sẵn sàng).
 *   2) Tie-break: độ sâu topo NÔNG trước (học nền vững trước khi lên cao).
 *   3) Tie-break cuối: id theo alphabet (ổn định, dễ test).
 * Map skill được chọn → micro-lesson ĐẦU TIÊN chưa xong có mang skill đó.
 * Không map được bất kỳ candidate nào → fallback bài chưa xong kế tiếp.
 */
export function recommendNext(input: RecommendInput): Recommendation | undefined {
  const { mastery, flat, isDone, excludeId } = input;
  const masteryOf = (id: string) => mastery[id]?.score ?? 0;

  // 1) Skill vừa đạt ngưỡng — ưu tiên vững hơn + gần đây hơn.
  const mastered = Object.values(mastery)
    .filter((m) => m.score >= MASTERED_THRESHOLD)
    .sort((a, b) => {
      const t = (b.lastReviewedAt ?? '').localeCompare(a.lastReviewedAt ?? '');
      return t !== 0 ? t : b.score - a.score;
    });

  // 2) Ứng viên = dependents của skill đã vững; lọc "đủ nền" + "chưa học".
  const seen = new Set<string>();
  const candidates: string[] = [];
  for (const m of mastered) {
    for (const dep of getDependents(m.skillId)) {
      if (seen.has(dep)) continue;
      seen.add(dep);
      if (masteryOf(dep) >= MASTERED_THRESHOLD) continue; // đã học
      if (getUnmetPrereqs(dep, masteryOf).length > 0) continue; // chưa đủ nền
      candidates.push(dep);
    }
  }

  // 3) Chấm điểm & xếp hạng.
  candidates.sort((a, b) => {
    const pa = getPrereqs(a).length;
    const pb = getPrereqs(b).length;
    if (pa !== pb) return pb - pa; // nhiều prereq đạt hơn trước
    const da = depthOf(a);
    const db = depthOf(b);
    if (da !== db) return da - db; // nông trước
    return a.localeCompare(b);
  });

  // 4) Map skill → bài đầu tiên chưa xong mang skill đó (bỏ qua excludeId).
  for (const skill of candidates) {
    const target = flat.find(
      (f) =>
        f.lesson.id !== excludeId &&
        f.lesson.skillIds.includes(skill) &&
        !isDone(f.lesson),
    );
    if (target) {
      // Lý do = prereq đã vững & gần đây nhất của skill được chọn.
      const prereqSet = new Set(getPrereqs(skill));
      const reason = mastered.find((m) => prereqSet.has(m.skillId))?.skillId;
      return { lesson: target, reasonSkillId: reason };
    }
  }

  // 5) Fallback: bài chưa xong kế tiếp (heuristic cũ, không có "vì...").
  const fallback = flat.find((f) => f.lesson.id !== excludeId && !isDone(f.lesson));
  return fallback ? { lesson: fallback } : undefined;
}
