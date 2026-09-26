import { describe, expect, it } from 'vitest';
import MathText from '../../components/MathText';
import { ALL_PROBLEMS } from '../../practice/problems';
import { SKILL_IDS } from '../../core/content/skills';
import { questionText } from './LegacyIllustration';
import { problemSkill } from './problemSkill';

describe('legacy exercise teaching metadata', () => {
  it('maps every current standalone problem to an actual subject skill', () => {
    for (const problem of ALL_PROBLEMS) {
      expect(SKILL_IDS, problem.topic).toContain(problemSkill(problem.topic));
    }
    expect(problemSkill('Determinant 2×2 & 3×3')).toBe('determinant');
    expect(problemSkill('Eigenvectors')).toBe('eigenvector');
  });
  it('extracts visible question math without evaluating custom components', () => {
    function HiddenAnswer(): never { throw Error('Should never execute'); }
    expect(questionText(<p>Cho <MathText tex={'v=(2,3)'} /><HiddenAnswer /></p>)).toContain('v=(2,3)');
  });
});
