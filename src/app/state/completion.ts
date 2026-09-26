import { create } from 'zustand';
import { isDeveloperMode } from '../../core/developerMode';

// ---------------------------------------------------------------------------
// COMPLETED-LESSONS (app-local).
// Core store (src/core/progress/store.ts) CHỈ giữ đếm số `lessonsCompleted`,
// không có tập id bài đã xong — và ta KHÔNG được sửa core. Nên shell tự giữ một
// tập nhỏ id micro-lesson đã hoàn thành, persist riêng vào localStorage.
// Đây chỉ là dữ liệu phụ trợ cho UI (đánh dấu ✓ trên path); nguồn XP/mastery
// vẫn là core store.
// ---------------------------------------------------------------------------
const KEY = 'dl-completed-lessons';

function load(): Record<string, string> {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

function save(done: Record<string, string>): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(done));
  } catch {
    /* ignore quota / private-mode errors */
  }
}

export interface CompletionState {
  /** lessonId -> ISO timestamp khi hoàn thành. */
  done: Record<string, string>;
  markDone: (lessonId: string) => void;
  reset: () => void;
}

export const useCompletion = create<CompletionState>((set) => ({
  done: load(),
  markDone: (lessonId) =>
    set((s) => {
      if (isDeveloperMode()) return s;
      const done = { ...s.done, [lessonId]: new Date().toISOString() };
      save(done);
      return { done };
    }),
  reset: () =>
    set(() => {
      save({});
      return { done: {} };
    }),
}));
