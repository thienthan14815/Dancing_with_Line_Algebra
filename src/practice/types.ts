import type { ReactNode } from 'react';

export type Difficulty = 'basic' | 'medium' | 'hard' | 'exam';

export interface SolutionStep {
  title?: string;
  content: ReactNode;
}

export interface Problem {
  id: string; // duy nhất trong chương, vd "det-1"
  chapterId: string; // vd "ch3-matrices" (khớp registry id)
  difficulty: Difficulty;
  topic: string; // nhãn ngắn, vd "Determinant"
  statement: ReactNode; // đề bài (JSX, có thể dùng MathText)
  steps: SolutionStep[]; // lời giải từng bước
  answer: ReactNode; // đáp số/kết luận gọn
}
