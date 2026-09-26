import { describe, expect, it } from 'vitest';
import katex from 'katex';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import { SKILLS } from '../../core/content/skills';
import { COURSE } from '../../core/content/course';
import { flatLessons } from '../../chapters/registry';
import { TEACHING_RULES } from './rules';
import LessonBrief, { getLessonSkillIds, RuleCard } from './LessonBrief';
import RuleVisual from './RuleVisual';

describe('authored teaching coverage', () => {
  it('covers every registered skill with a concise rule, domain, example and pitfall', () => {
    for (const { id } of SKILLS) {
      const rule = TEACHING_RULES[id];
      expect(rule, id).toBeDefined();
      expect(rule.rule.length, id).toBeGreaterThan(20);
      expect(rule.rule.length, id).toBeLessThan(210);
      expect(rule.condition.length, id).toBeGreaterThan(15);
      expect(rule.example, id).toHaveLength(3);
      expect(rule.example.every(step => step.length > 5 && step.length < 200), id).toBe(true);
      expect(rule.visual, id).toHaveLength(3);
      expect(rule.pitfall.length, id).toBeGreaterThan(10);
    }
  });

  it('renders every formula with strict KaTeX parsing', () => {
    for (const [id, rule] of Object.entries(TEACHING_RULES)) {
      expect(() => katex.renderToString(rule.formula, { throwOnError: true, strict: 'error' }), id).not.toThrow();
      expect(rule.formula, id).not.toMatch(/[\u0000-\u001f]/);
    }
  });

  it('maps every deep-dive lesson to its own skills without chapter-level review spillover', () => {
    for (const lesson of flatLessons) {
      const ids = getLessonSkillIds(lesson.chapterId, lesson.lessonId);
      expect(ids.length, `${lesson.chapterId}/${lesson.lessonId}`).toBeGreaterThan(0);
      const concept = COURSE.sections.find(s => s.id === lesson.chapterId)?.units
        .find(u => u.id === `${lesson.chapterId}:${lesson.lessonId}`)?.lessons
        .find(l => l.id === `${lesson.chapterId}:${lesson.lessonId}:concept`);
      expect(ids).toEqual(concept?.skillIds);
      expect(ids.every(id => Boolean(TEACHING_RULES[id]))).toBe(true);
      const html = renderToStaticMarkup(createElement(LessonBrief, { chapterId: lesson.chapterId, lessonId: lesson.lessonId }));
      expect(html).toContain('Học ngắn gọn theo quy luật');
      expect(html).toContain('role="img"');
      expect(html).not.toContain('katex-error');
    }
    expect(getLessonSkillIds('ch5-eigen', 'powers')).toEqual(['matrix_powers']);
    expect(getLessonSkillIds('missing', 'missing')).toEqual([]);
  });

  it('provides an accessible labeled visual and reminder for every rule', () => {
    for (const [skillId, rule] of Object.entries(TEACHING_RULES)) {
      const image = renderToStaticMarkup(createElement(RuleVisual, { skillId, rule }));
      expect(image).toContain('<desc');
      expect(image).toContain('aria-labelledby=');
      expect(image).not.toMatch(/NaN|undefined/);
      const card = renderToStaticMarkup(createElement(RuleCard, { skillId }));
      expect(card).toContain('Điều kiện:');
      expect(card).not.toContain('katex-error');
    }
  });
});
