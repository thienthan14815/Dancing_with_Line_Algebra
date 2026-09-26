import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import type { Exercise } from '../../core/exercises/types';
import { SKILLS } from '../../core/content/skills';
import { EXERCISES } from '../../core/content/exerciseBank';
import { buildIllustration, SKILL_FAMILY, type IllustrationInput } from './illustrationSpec';
import ExerciseIllustration from './ExerciseIllustration';

const input = (prompt: string, skillId = 'vector_addition', type: Exercise['type'] = 'numeric-input'): IllustrationInput => ({ prompt, skillId, type });
const exercise = (prompt: string, skillId = 'vector_addition'): Exercise => ({
  id: 'test', prompt, skillId, type: 'numeric-input', answer: 9999,
  dimension: 'compute', difficulty: 1, hints: [],
});

describe('prompt-only exercise illustrations', () => {
  it('covers every current curriculum skill with a curated family', () => {
    expect(SKILLS.filter((s) => !SKILL_FAMILY[s.id]).map((s) => s.id)).toEqual([]);
  });

  it('renders every current bank exercise without invalid SVG numbers or hidden answer reads', () => {
    for (const ex of EXERCISES) {
      const givenOnly = new Proxy(ex, {
        get(target, property, receiver) {
          if (!['prompt', 'skillId', 'type'].includes(String(property))) throw Error(`Forbidden read in ${ex.id}: ${String(property)}`);
          return Reflect.get(target, property, receiver);
        },
      });
      expect(() => buildIllustration(givenOnly), ex.id).not.toThrow();
      const html = renderToStaticMarkup(createElement(ExerciseIllustration, { exercise: givenOnly }));
      expect(html, ex.id).not.toMatch(/(?:NaN|Infinity)/);
      expect(html, ex.id).toContain('<figcaption>');
    }
  });

  it('preserves signed input vectors without calculating their sum', () => {
    const result = buildIllustration(input('Cho a = (−2, 3) và b = (4, −5). Tính a+b.'));
    expect(result.kind).toBe('vectors');
    if (result.kind !== 'vectors') throw Error('Expected vectors');
    expect(result.vectors).toEqual([{ name: 'a', values: [-2, 3] }, { name: 'b', values: [4, -5] }]);
    expect(JSON.stringify(result)).not.toContain('answer');
    expect(result.vectors.some((v) => v.values.join(',') === '2,-2')).toBe(false);
  });

  it('never mistakes the trailing factor of a vector expression for a given', () => {
    for (const lhs of ['u + v', 'u+v', '2 * v', '2 v', 'Aᵀv', 'A^{T}v', 'u - v', 'A v', 'A^T v', 'A \\cdot v']) {
      expect(buildIllustration(input(`Cho ${lhs} = (3,4), u = (1,2). Tìm v.`)).source).toBe('concept');
    }
  });

  it('parses LaTeX-spaced 3D neuron inputs and preserves weights', () => {
    const result = buildIllustration(input('Cho $x=(1,\\,0,\\,1)$ và $w=(2,\\,−3,\\,4)$. Tính z.', 'perceptron'));
    expect(result).toMatchObject({ kind: 'neuron', inputs: [1, 0, 1], weights: [2, -3, 4] });
    expect(result).not.toHaveProperty('sum');
  });

  it('keeps three-dimensional vector data instead of projecting away z', () => {
    const result = buildIllustration(input('Cho u = (1, 2, 3), v = (4, 5, 6). Tính u·v.', 'dot_product'));
    expect(result).toMatchObject({ kind: 'vectors', vectors: [{ name: 'u', values: [1, 2, 3] }, { name: 'v', values: [4, 5, 6] }] });
  });

  it('uses only given matrices and does not multiply them', () => {
    const result = buildIllustration(input('Tính AB: A = [[1, 2], [3, 4]] và B = [[5, 6], [7, 8]].', 'matrix_multiplication'));
    expect(result).toMatchObject({ kind: 'matrices', matrices: [{ name: 'A', rows: [[1, 2], [3, 4]] }, { name: 'B', rows: [[5, 6], [7, 8]] }] });
  });

  it('never relabels matrix expressions as their final single-letter factor', () => {
    const actual = EXERCISES.find((ex) => ex.id === 'ch7-ls-read-code');
    expect(actual).toBeDefined();
    expect(buildIllustration(actual!).source).toBe('concept');
    for (const lhs of ['AᵀA', 'Aᵀ A', 'A · B', 'A+B']) {
      expect(buildIllustration(input(`${lhs} = [[4, 0], [0, 10]]`, 'least_squares')).source).toBe('concept');
    }
  });

  it('does not omit bias or threshold from a supposedly exact neuron diagram', () => {
    const actual = EXERCISES.find((ex) => ex.id === 'eb-ch11-neuron-z');
    expect(actual).toBeDefined();
    expect(buildIllustration(actual!).source).toBe('concept');
    expect(buildIllustration(input('w=(2,3), b=−1, x=(1,2). Tính z=w·x+b.', 'neuron')).source).toBe('concept');
    expect(buildIllustration(input('w=(2,3), x=(1,2), ngưỡng 2.', 'perceptron')).source).toBe('concept');
  });

  it('rejects malformed matrices and partial 4D tuples', () => {
    expect(buildIllustration(input('A = [[1, 2], [3]]', 'matrix_multiplication')).source).toBe('concept');
    expect(buildIllustration(input('v = (1, 2, 3, 4)', 'vector_basics')).source).toBe('concept');
  });

  it('retains zero prefixes and base without calculating decimal output', () => {
    expect(buildIllustration(input('Đổi 001101₂ sang thập phân.', 'digital_binary_decimal'))).toMatchObject({ kind: 'numerals', numerals: [{ digits: '001101', base: 2 }] });
    expect(buildIllustration(input('Đổi 2D₁₆ sang nhị phân.', 'digital_base_conversion'))).toMatchObject({ kind: 'numerals', numerals: [{ digits: '2D', base: 16 }] });
    expect(buildIllustration(input('Đổi 102₂.', 'digital_base_conversion')).source).toBe('concept');
    expect(buildIllustration(input('Đổi -101₂.', 'digital_base_conversion')).source).toBe('concept');
  });

  it('renders exact single gate inputs, never the evaluated output', () => {
    const result = buildIllustration(input('Y = E AND D. Khi E = 1 và D = 0, Y bằng bao nhiêu?', 'digital_function'));
    expect(result).toMatchObject({ kind: 'gate', gate: 'AND', inputs: [{ name: 'E', value: 1 }, { name: 'D', value: 0 }] });
    expect(result).not.toHaveProperty('output');
    expect(buildIllustration(input('Y = E AND (D OR W). E = 1, D = 0, W = 1.', 'digital_truth_table')).source).toBe('concept');
  });

  it('does not misread decimal gate inputs as bits', () => {
    expect(buildIllustration(input('AND: A = 10, B = 0.', 'digital_gates')).source).toBe('concept');
  });

  it('does not treat false statements, drawing targets, or solution steps as data', () => {
    for (const type of ['vector-drawing', 'true-false', 'step-ordering', 'matching', 'error-detection'] as const) {
      expect(buildIllustration(input('v = (3,4)', 'vector_basics', type)).source).toBe('concept');
    }
  });

  it('is invariant to all answer-bearing exercise fields', () => {
    const original = exercise('Tính a+b khi a=(2,3), b=(4,1).');
    const poisoned = { ...original, answer: -700, target: [700, 900], options: ['u=(999,888)'], statement: 'v=(777,666)', left: ['A=[[7,7],[7,7]]'], right: ['v=(555,444)'], explain: 'answer=900', hints: [{ level: 4, text: 'v=(999,999)' }] };
    expect(buildIllustration(original)).toEqual(buildIllustration(poisoned));
    const bare = exercise('Chọn đáp án đúng.');
    expect(buildIllustration({ ...poisoned, prompt: bare.prompt })).toEqual(buildIllustration(bare));
  });

  it('does not even read sensitive exercise properties', () => {
    const guarded = new Proxy(exercise('Cho v=(2,3).'), {
      get(target, property, receiver) {
        if (!['prompt', 'skillId', 'type'].includes(String(property))) throw Error(`Forbidden read: ${String(property)}`);
        return Reflect.get(target, property, receiver);
      },
    });
    expect(() => buildIllustration(guarded)).not.toThrow();
  });

  it('uses givens for unknown legacy skill and a labeled concept otherwise', () => {
    expect(buildIllustration(input('Cho v=(2,3).', 'legacy_prompt')).kind).toBe('vectors');
    expect(buildIllustration(input('Hãy giải thích.', 'legacy_prompt'))).toMatchObject({ kind: 'concept', source: 'concept' });
  });

  it('renders responsive accessible diagrams and never changes data when revealed', () => {
    const ex = exercise('Tính a+b khi a=(2,3), b=(4,1).');
    for (const revealed of [false, true]) {
      const html = renderToStaticMarkup(createElement(ExerciseIllustration, { exercise: ex, revealed }));
      expect(html).toContain('viewBox="0 0 640 260"');
      expect(html).toContain('role="img"');
      expect(html).toContain('aria-labelledby=');
      expect(html).toContain('a = (2, 3)');
      expect(html).not.toContain('9999');
      expect(html).not.toContain('6, 4');
    }
    const conceptual = renderToStaticMarkup(createElement(ExerciseIllustration, { exercise: exercise('Giải thích.', 'tensor_ops') }));
    expect(conceptual).toContain('không phải hình dựng từ dữ kiện');
  });
});
