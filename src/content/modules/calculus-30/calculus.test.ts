import { describe, expect, it } from 'vitest';
import katex from 'katex';
import module from './module';
import lessons from './lessons.json';
import content from './content.json';
import { MODULES, inspectModule } from '../../registry';
import { getMicroLesson } from '../../../core/content/course';
import { getExercisesForLesson } from '../../../core/content/exerciseBank';
import { checkExercise } from '../../../core/exercises/engine';
import { editorial } from './editorial';
import { exercises as originalExercises } from './practice';
import { finalAssessment } from './editorial/finalAssessment';

describe('Giải tích 30 ngày import and integration', () => {
  it('registers all 30 days with their own exercises and working deep dives', () => {
    expect(inspectModule(module, MODULES).errors).toEqual([]);
    expect(MODULES.some(entry => entry.id === module.id)).toBe(true);
    expect(lessons).toHaveLength(30);
    expect(module.exercises).toHaveLength(102);
    for (const lesson of lessons) {
      const id = `calculus-30:${lesson.id}`;
      expect(getMicroLesson(`${id}:concept`)?.deepDiveRoute).toBe(`#/ch/calculus-30/${lesson.id}`);
      const exercises = getExercisesForLesson(`${id}:practice`);
      expect(exercises).toHaveLength(lesson.id === 'd30' ? 12 : 3);
      for (const exercise of exercises) {
        expect(exercise.skillId).toBe(lesson.skillId);
        if (exercise.type === 'numeric-input') {
          expect(checkExercise(exercise, exercise.answer).correct).toBe(true);
          expect(checkExercise(exercise, exercise.answer + 1).correct).toBe(false);
        } else if (exercise.type === 'multiple-choice') {
          expect(checkExercise(exercise, exercise.answerIndex).correct).toBe(true);
          expect(checkExercise(exercise, (exercise.answerIndex + 1) % exercise.options.length).correct).toBe(false);
        }
      }
    }
    expect(originalExercises).toHaveLength(60);
  });

  it('delivers the complete authored final assessment even when the player asks for six sampled questions', () => {
    for (const seed of [1, 17, 999]) {
      expect(getExercisesForLesson('calculus-30:d30:practice', 6, seed).map(exercise => exercise.id))
        .toEqual(finalAssessment.map(exercise => exercise.id));
    }
    expect(finalAssessment).toHaveLength(12);
    expect(new Set(module.exercises.map(exercise => exercise.id)).size).toBe(102);
  });

  it('rejects a fixed assessment that references missing, duplicated or unrelated exercises', () => {
    const invalid = { ...module, lessons: [{ ...module.lessons[0], practiceExerciseIds: ['missing', finalAssessment[0].id, finalAssessment[0].id] }] };
    const errors = inspectModule(invalid, [invalid]).errors.join('\n');
    expect(errors).toContain('không tồn tại');
    expect(errors).toContain('khác kỹ năng');
    expect(errors).toContain('lặp bài tập');
  });

  it('provides substantive explanatory sections and valid math for every day', () => {
    expect(Object.keys(editorial).sort()).toEqual(lessons.map(lesson => lesson.id).sort());
    for (const lesson of Object.values(editorial)) {
      expect(lesson.prerequisites.length).toBeGreaterThan(0);
      expect(lesson.intuition.length).toBeGreaterThanOrEqual(2);
      expect(lesson.method.length).toBeGreaterThanOrEqual(3);
      expect(lesson.worked.steps.length).toBeGreaterThanOrEqual(3);
      expect(lesson.worked.check.length).toBeGreaterThan(30);
      expect(lesson.transfer.explanation.length).toBeGreaterThan(30);
      expect(lesson.checkpoint.options).toHaveLength(4);
      expect(lesson.checkpoint.answerIndex).toBeGreaterThanOrEqual(0);
      expect(lesson.checkpoint.answerIndex).toBeLessThan(4);
      const visit = (value: unknown): string[] => typeof value === 'string' ? [value] : value && typeof value === 'object' ? Object.values(value).flatMap(visit) : [];
      const formulas = visit(lesson).flatMap(text => [...text.matchAll(/\$\$([\s\S]*?)\$\$|\$([^$]+?)\$/g)].map(match => match[1] ?? match[2]));
      formulas.push(...lesson.worked.steps.map(step => step.tex));
      for (const formula of formulas) expect(() => katex.renderToString(formula, { throwOnError: true, strict: false }), formula).not.toThrow();
    }
  });

  it('retains the original 134 answer disclosures and renders every imported formula', () => {
    const html = Object.values(content).join('\n');
    expect((html.match(/class="ans"/g) ?? [])).toHaveLength(134);
    expect(html).not.toMatch(/<script|<iframe|<link|\son\w+=|data-done=/i);
    expect(Object.keys(content)).toHaveLength(31);
    const text = html.replace(/<[^>]*>/g, '').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&');
    const formulas = [...text.matchAll(/\$\$([\s\S]*?)\$\$|\$([^$]+?)\$/g)];
    expect(formulas.length).toBeGreaterThan(500);
    for (const match of formulas) {
      const formula = match[1] ?? match[2];
      expect(() => katex.renderToString(formula, { throwOnError: true, strict: false }), formula).not.toThrow();
    }
  });
});
