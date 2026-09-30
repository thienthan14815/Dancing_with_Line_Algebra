import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { editorial } from './editorial';
import { EditorialOpening, EditorialPractice } from './EditorialContent';

describe('Expanded calculus reading', () => {
  it('renders every new lesson with an accessible mathematical figure and working formula markup', () => {
    for (const [id, lesson] of Object.entries(editorial)) {
      const html = renderToStaticMarkup(<><EditorialOpening lesson={lesson} day={Number(id.slice(1))} /><EditorialPractice lesson={lesson} /></>);
      expect(html, id).toContain('role="img"');
      expect(html, id).toContain('<figcaption>');
      expect(html, id).toContain('Kiểm chứng độc lập');
      expect(html, id).not.toMatch(/katex-error|NaN|Infinity/);
      expect(html, id).toContain('class="calc-solution"');
      expect(html, id).not.toContain('class="calc-solution" open');
    }
  });
});
