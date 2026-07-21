// ===========================================================================
// REGISTRY + VALIDATOR cho các CONTENT MODULE (giáo án dạng plugin).
// ---------------------------------------------------------------------------
// • Nạp mọi `modules/<id>/module.ts` bằng import.meta.glob (EAGER).
// • Kiểm tra manifest (validateModules) — báo lỗi RÕ RÀNG, KHÔNG ném vỡ app:
//   module lỗi bị BỎ QUA, các module còn lại vẫn chạy.
// • Xuất các bộ dẫn xuất để 5 điểm tổng hợp MERGE vào (append, giữ nguyên cũ):
//     MODULES, moduleSections, moduleSkills, moduleExercises,
//     moduleGuideEntries, moduleChapters.
//
// QUY TẮC CHỐNG VÒNG LẶP IMPORT (rất quan trọng):
//   File này CHỈ phụ thuộc `./types`, `./ModuleChapter` và các import TYPE-ONLY
//   (bị xóa khi biên dịch). Nó KHÔNG import runtime từ course.ts / skills.ts /
//   exerciseBank.ts / guidebook/content.ts / chapters/registry.ts — vì CHÍNH
//   các file đó import ngược TỪ đây. Nhờ vậy đồ thị import là một chiều:
//       (5 file lõi)  ──▶  content/registry.ts  ──▶  (chỉ type + glob)
//   Hệ quả: validator kiểm skillId theo skills KHAI BÁO TRONG MODULE (không đọc
//   SKILLS toàn cục để khỏi tạo vòng lặp). Mỗi giáo án tự khai báo đủ skill.
// ===========================================================================

import type { ContentModule, ModuleLesson, ModuleLessonKind } from './types';
import type {
  Section,
  Unit,
  MicroLesson,
  Skill,
  MicroLessonKind,
} from '../core/content/types';
import type { Exercise } from '../core/exercises/types';
import type { ExerciseGenerator } from '../core/exercises/generators';
import { registerGenerators } from '../core/exercises/generators';
import type { GuideEntry } from '../app/guidebook/content';
import type { ChapterMeta } from '../chapters/registry';
import { makeChapterLoader } from './ModuleChapter';

// ---------------------------------------------------------------------------
// HẰNG SỐ RÀNG BUỘC
// ---------------------------------------------------------------------------
const VALID_KINDS: ReadonlySet<ModuleLessonKind> = new Set<ModuleLessonKind>([
  'concept',
  'practice',
  'review',
  'challenge',
]);

// Id 14 chương gốc — module KHÔNG được trùng (giữ backward-compatible).
const RESERVED_CHAPTER_IDS: ReadonlySet<string> = new Set([
  'ch0-foundations',
  'ch1-vectors',
  'ch2-systems',
  'ch3-matrices',
  'ch4-spaces',
  'ch5-eigen',
  'ch6-svd',
  'ch7-code',
  'ch8-orthogonality',
  'ch9-quadratic',
  'ch10-ml',
  'ch11-neural-nets',
  'ch12-modern-dl',
  'ch13-optimization-apps',
]);

const isDev = Boolean(import.meta.env?.DEV);

// ---------------------------------------------------------------------------
// VALIDATOR
// ---------------------------------------------------------------------------
export interface ModuleIssues {
  /** Lỗi nặng — module sẽ BỊ BỎ QUA (không nạp). */
  errors: string[];
  /** Cảnh báo — module vẫn nạp. */
  warnings: string[];
}

/**
 * Soi 1 module trong ngữ cảnh danh sách `all` (để phát hiện trùng id/num).
 * Trả về errors + warnings (chuỗi tiếng Việt, KÈM tiền tố id).
 */
export function inspectModule(
  m: ContentModule,
  all: ContentModule[],
): ModuleIssues {
  const errors: string[] = [];
  const warnings: string[] = [];
  const id = typeof m?.id === 'string' && m.id ? m.id : '?';
  const push = (arr: string[], msg: string) => arr.push(`${id}: ${msg}`);

  if (!m || typeof m !== 'object') {
    errors.push(`${id}: manifest không phải object`);
    return { errors, warnings };
  }

  // --- Trường bắt buộc ------------------------------------------------------
  if (typeof m.id !== 'string' || !m.id) push(errors, 'thiếu trường "id" (chuỗi khác rỗng)');
  if (typeof m.num !== 'number' || !Number.isFinite(m.num))
    push(errors, 'thiếu trường "num" (số hữu hạn)');
  if (typeof m.track !== 'string' || !m.track) push(errors, 'thiếu trường "track"');
  if (typeof m.title !== 'string' || !m.title) push(errors, 'thiếu trường "title"');
  if (typeof m.subtitle !== 'string' || !m.subtitle) push(errors, 'thiếu trường "subtitle"');
  if (!Array.isArray(m.skills)) push(errors, '"skills" phải là mảng');
  if (!Array.isArray(m.lessons)) push(errors, '"lessons" phải là mảng');
  if (!Array.isArray(m.exercises)) push(errors, '"exercises" phải là mảng');

  // --- Skill khai báo trong module -----------------------------------------
  const skills = Array.isArray(m.skills) ? m.skills : [];
  const ownSkillIds = new Set<string>();
  for (const s of skills) {
    if (!s || typeof s.id !== 'string' || !s.id) {
      push(errors, 'một skill thiếu "id"');
      continue;
    }
    if (typeof s.name !== 'string' || !s.name) push(errors, `skill "${s.id}" thiếu "name"`);
    if (ownSkillIds.has(s.id)) push(errors, `skill "${s.id}" bị khai báo trùng trong module`);
    ownSkillIds.add(s.id);
  }

  // --- Trùng id / num với module khác & với chương gốc ----------------------
  if (typeof m.id === 'string' && m.id) {
    if (RESERVED_CHAPTER_IDS.has(m.id)) push(errors, `id "${m.id}" trùng id chương gốc (ch0..ch13)`);
    const chMatch = /^ch(\d+)-/.exec(m.id);
    if (chMatch && Number(chMatch[1]) <= 13)
      push(errors, `id "${m.id}" rơi vào dải id chương gốc "ch0..ch13"`);
    if (all.filter((x) => x?.id === m.id).length > 1)
      push(errors, `id "${m.id}" trùng với một module khác`);
  }
  if (typeof m.num === 'number' && Number.isFinite(m.num)) {
    if (all.filter((x) => x?.num === m.num).length > 1)
      push(errors, `num ${m.num} trùng với một module khác`);
    if (m.num < 14)
      push(warnings, `num ${m.num} < 14 (dải 0..13 dành cho 14 chương gốc; nên dùng ≥ 14)`);
  }

  // --- Lessons --------------------------------------------------------------
  const lessons = Array.isArray(m.lessons) ? m.lessons : [];
  const seenLessonIds = new Set<string>();
  for (const l of lessons) {
    if (!l || typeof l.id !== 'string' || !l.id) {
      push(errors, 'một lesson thiếu "id"');
      continue;
    }
    if (seenLessonIds.has(l.id)) push(errors, `lesson "${l.id}" bị trùng id trong module`);
    seenLessonIds.add(l.id);
    if (typeof l.title !== 'string' || !l.title) push(errors, `lesson "${l.id}" thiếu "title"`);
    if (!VALID_KINDS.has(l.kind))
      push(errors, `lesson "${l.id}" có kind không hợp lệ: ${JSON.stringify(l.kind)} (chỉ concept|practice|review|challenge)`);
    if (!Array.isArray(l.skillIds) || l.skillIds.length === 0)
      push(errors, `lesson "${l.id}" thiếu "skillIds" (mảng khác rỗng)`);
    else
      for (const sid of l.skillIds)
        if (!ownSkillIds.has(sid))
          push(errors, `lesson "${l.id}" tham chiếu skill lạ "${sid}" (chưa khai báo trong module.skills)`);
    if (l.component !== undefined && typeof l.component !== 'function')
      push(errors, `lesson "${l.id}" có "component" không phải function`);
  }

  // --- Exercises ------------------------------------------------------------
  const exercises = Array.isArray(m.exercises) ? m.exercises : [];
  const seenExIds = new Set<string>();
  for (const ex of exercises) {
    if (!ex || typeof ex.id !== 'string' || !ex.id) {
      push(errors, 'một exercise thiếu "id"');
      continue;
    }
    if (seenExIds.has(ex.id)) push(errors, `exercise "${ex.id}" bị trùng id trong module`);
    seenExIds.add(ex.id);
    if (typeof ex.skillId !== 'string' || !ex.skillId)
      push(errors, `exercise "${ex.id}" thiếu "skillId"`);
    else if (!ownSkillIds.has(ex.skillId))
      push(errors, `exercise "${ex.id}" có skillId lạ "${ex.skillId}" (chưa khai báo trong module.skills)`);
  }

  return { errors, warnings };
}

/**
 * Kiểm tra CẢ danh sách module — trả về danh sách CHUỖI vấn đề (errors +
 * warnings), tiện log/kiểm thử. KHÔNG ném lỗi.
 */
export function validateModules(mods: ContentModule[]): string[] {
  const out: string[] = [];
  for (const m of mods) {
    const { errors, warnings } = inspectModule(m, mods);
    out.push(...errors, ...warnings.map((w) => `${w} [cảnh báo]`));
  }
  return out;
}

// ---------------------------------------------------------------------------
// NẠP MODULE (EAGER) + LỌC HỢP LỆ
// ---------------------------------------------------------------------------
const globbed = import.meta.glob<{ default: ContentModule }>(
  './modules/*/module.ts',
  { eager: true },
);

const rawModules: ContentModule[] = Object.values(globbed)
  .map((mod) => mod?.default)
  .filter((m): m is ContentModule => Boolean(m));

/** Chỉ xét các module bật (enabled !== false). */
const enabledModules: ContentModule[] = rawModules.filter((m) => m?.enabled !== false);

/**
 * MODULES = các module đã BẬT + HỢP LỆ, sort theo num (rồi id cho ổn định).
 * Module lỗi → log rõ ràng ở DEV rồi BỎ QUA (app vẫn chạy).
 */
export const MODULES: ContentModule[] = (() => {
  const sorted = [...enabledModules].sort(
    (a, b) => a.num - b.num || String(a.id).localeCompare(String(b.id)),
  );
  const valid: ContentModule[] = [];
  for (const m of sorted) {
    const { errors, warnings } = inspectModule(m, enabledModules);
    if (errors.length > 0) {
      if (isDev) for (const e of errors) console.error(`[content-module] ${e}`);
      continue; // BỎ QUA module lỗi
    }
    if (isDev) for (const w of warnings) console.warn(`[content-module] ${w}`);
    valid.push(m);
  }
  return valid;
})();

// ---------------------------------------------------------------------------
// BỘ DẪN XUẤT (mirror logic buildSection/buildUnit của course.ts — CỐ Ý tự
// build để KHÔNG import ngược course.ts, tránh vòng lặp).
// ---------------------------------------------------------------------------

/** Bung 1 ModuleLesson → 1 Unit gồm micro-lesson khái niệm + luyện tập. */
function toUnit(module: ContentModule, lesson: ModuleLesson): Unit {
  const unitId = `${module.id}:${lesson.id}`;
  // Micro "khái niệm": giữ kind gốc của tác giả (trừ 'practice' → dùng 'concept'),
  // gắn deepDiveRoute NẾU bài có component tương tác.
  const conceptKind: MicroLessonKind =
    lesson.kind && lesson.kind !== 'practice' ? lesson.kind : 'concept';
  const concept: MicroLesson = {
    id: `${unitId}:concept`,
    title: `${lesson.title} — Khái niệm`,
    skillIds: lesson.skillIds,
    exerciseIds: [],
    kind: conceptKind,
    ...(lesson.component ? { deepDiveRoute: `#/ch/${module.id}/${lesson.id}` } : {}),
  };
  const practice: MicroLesson = {
    id: `${unitId}:practice`,
    title: `${lesson.title} — Luyện tập`,
    skillIds: lesson.skillIds,
    exerciseIds: [],
    kind: 'practice',
  };
  return { id: unitId, title: lesson.title, lessons: [concept, practice] };
}

/** Chuyển 1 module → 1 Section (giống buildSection). */
export function toSection(module: ContentModule): Section {
  return {
    id: module.id,
    num: module.num,
    title: module.title,
    en: module.en ?? module.title,
    subtitle: module.subtitle,
    prerequisiteSectionIds: module.prerequisites ?? [],
    units: module.lessons.map((l) => toUnit(module, l)),
  };
}

/** Chuyển 1 module → ChapterMeta cho registry cũ (route deep-dive). */
export function toChapterMeta(module: ContentModule): ChapterMeta {
  return {
    id: module.id,
    num: module.num,
    title: module.title,
    subtitle: module.subtitle,
    lessons: module.lessons.map((l) => ({ id: l.id, title: l.title })),
    load: makeChapterLoader(module),
  };
}

/** Chuyển 1 module → GuideEntry (điền id/nameVi/nameEn từ manifest nếu thiếu). */
export function toGuideEntry(module: ContentModule): GuideEntry | undefined {
  if (!module.guide) return undefined;
  return {
    ...module.guide,
    id: module.guide.id ?? module.id,
    nameVi: module.guide.nameVi ?? module.title,
    nameEn: module.guide.nameEn ?? module.en ?? module.title,
  } as GuideEntry;
}

/** Section[] để MERGE vào COURSE.sections. */
export const moduleSections: Section[] = MODULES.map(toSection);

/** Skill[] để MERGE vào SKILLS. */
export const moduleSkills: Skill[] = MODULES.flatMap((m) =>
  m.skills.map((s) => ({ id: s.id, name: s.name })),
);

/** Exercise[] để MERGE vào EXERCISES. */
export const moduleExercises: Exercise[] = MODULES.flatMap((m) => m.exercises);

/**
 * ExerciseGenerator[] do các module tự khai báo — gom lại rồi ĐĂNG KÝ vào
 * registry generators (một chiều: registry → generators, không tạo cycle). Nhờ
 * vậy hệ sinh bài động của module tự xuất hiện khi nạp module, gỡ module thì
 * mất theo. Additive: module không khai báo `generators` thì mảng này rỗng.
 */
export const moduleGenerators: ExerciseGenerator[] = MODULES.flatMap(
  (m) => m.generators ?? [],
);
registerGenerators(moduleGenerators);

/** GuideEntry[] để MERGE vào GUIDEBOOK. */
export const moduleGuideEntries: GuideEntry[] = MODULES.map(toGuideEntry).filter(
  (g): g is GuideEntry => Boolean(g),
);

/** ChapterMeta[] để MERGE vào `chapters` (registry cũ). */
export const moduleChapters: ChapterMeta[] = MODULES.map(toChapterMeta);
