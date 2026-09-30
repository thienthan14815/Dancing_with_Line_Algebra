import { describe, expect, it } from 'vitest';
import katex from 'katex';
import module from './module';
import lessons from './lessons.json';
import content from './content.json';
import { MODULES, inspectModule } from '../../registry';
import { getMicroLesson } from '../../../core/content/course';
import { getExercisesForLesson } from '../../../core/content/exerciseBank';
import { checkExercise } from '../../../core/exercises/engine';

describe('Giải tích 30 ngày import and integration', () => {
  it('registers all 30 days with their own exercises and working deep dives', () => {
    expect(inspectModule(module, MODULES).errors).toEqual([]);
    expect(MODULES.some(entry => entry.id === module.id)).toBe(true);
    expect(lessons).toHaveLength(30);
    expect(module.exercises).toHaveLength(60);
    for (const lesson of lessons) {
      const id = `calculus-30:${lesson.id}`;
      expect(getMicroLesson(`${id}:concept`)?.deepDiveRoute).toBe(`#/ch/calculus-30/${lesson.id}`);
      const exercises = getExercisesForLesson(`${id}:practice`);
      expect(exercises).toHaveLength(2);
      for (const exercise of exercises) {
        expect(exercise.skillId).toBe(lesson.skillId);
        if (exercise.type !== 'numeric-input') throw new Error('Expected a numeric check');
        expect(checkExercise(exercise, exercise.answer).correct).toBe(true);
        expect(checkExercise(exercise, exercise.answer + 1).correct).toBe(false);
      }
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
