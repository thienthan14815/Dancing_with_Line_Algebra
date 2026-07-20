// Gom bài tập từ 10 file chương. QUAN TRỌNG: agent nội dung chỉ sửa file chNN.ts
// của họ, KHÔNG sửa file này — mọi chương đã được import sẵn ở đây.
import type { Problem } from '../types';
import { problems as ch0 } from './ch0';
import { problems as ch1 } from './ch1';
import { problems as ch2 } from './ch2';
import { problems as ch3 } from './ch3';
import { problems as ch4 } from './ch4';
import { problems as ch5 } from './ch5';
import { problems as ch6 } from './ch6';
import { problems as ch7 } from './ch7';
import { problems as ch8 } from './ch8';
import { problems as ch9 } from './ch9';

export const ALL_PROBLEMS: Problem[] = [
  ...ch0,
  ...ch1,
  ...ch2,
  ...ch3,
  ...ch4,
  ...ch5,
  ...ch6,
  ...ch7,
  ...ch8,
  ...ch9,
];

// Nhóm theo chapterId (khớp registry id). Chỉ có key cho chương đã có bài tập.
export const problemsByChapter: Record<string, Problem[]> = {};
for (const p of ALL_PROBLEMS) {
  if (!problemsByChapter[p.chapterId]) problemsByChapter[p.chapterId] = [];
  problemsByChapter[p.chapterId].push(p);
}
