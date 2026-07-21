import { describe, it, expect } from 'vitest';
import { GOAL_PATHS, stepMicroLessonId } from './goals';
import { getMicroLesson, getSection } from '../core/content/course';

/**
 * Bảo vệ HỢP ĐỒNG "mọi link trỏ tới id THẬT": mỗi bước của lộ trình mục tiêu
 * phải map tới một micro-lesson concept tồn tại trong COURSE, và chương phải có.
 */
describe('goal paths — mọi bước trỏ tới bài học thật', () => {
  it('có đúng 3 lộ trình chuyên biệt', () => {
    expect(GOAL_PATHS.map((g) => g.id)).toEqual(['aiml', 'graphics', 'data']);
  });

  for (const path of GOAL_PATHS) {
    describe(path.id, () => {
      it('có ít nhất 1 bước và không rỗng', () => {
        expect(path.steps.length).toBeGreaterThan(0);
      });

      for (const step of path.steps) {
        const microId = stepMicroLessonId(step);
        it(`bước "${step.title}" → ${microId} tồn tại`, () => {
          expect(getSection(step.chapterId), `chương ${step.chapterId}`).toBeDefined();
          expect(getMicroLesson(microId), `micro-lesson ${microId}`).toBeDefined();
        });
      }

      it('không trùng bài trong cùng lộ trình', () => {
        const ids = path.steps.map(stepMicroLessonId);
        expect(new Set(ids).size).toBe(ids.length);
      });
    });
  }
});
