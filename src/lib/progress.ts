import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
        set((state) => ({
          completedLessons: { ...state.completedLessons, [lessonKey]: true },
        })),
      setQuizScore: (lessonKey, score) =>
        set((state) => ({
          quizScores: { ...state.quizScores, [lessonKey]: score },
        })),
    }),
    { name: 'linalglab-progress' }
  )
);
