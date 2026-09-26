import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { isDeveloperMode } from '../core/developerMode';

export interface ProgressState {
  completedLessons: Record<string, boolean>;
  quizScores: Record<string, number>;
  markComplete: (lessonKey: string) => void;
  setQuizScore: (lessonKey: string, score: number) => void;
}

// lessonKey dạng "ch1/dot"
export const useProgress = create<ProgressState>()(
  persist(
    (set) => ({
      completedLessons: {},
      quizScores: {},
      markComplete: (lessonKey) =>
        set((state) => isDeveloperMode() ? state : ({
          completedLessons: { ...state.completedLessons, [lessonKey]: true },
        })),
      setQuizScore: (lessonKey, score) =>
        set((state) => isDeveloperMode() ? state : ({
          quizScores: { ...state.quizScores, [lessonKey]: score },
        })),
    }),
    { name: 'linalglab-progress' }
  )
);
