import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import StepByStep from '../StepByStep';

describe('step navigation accessibility', () => {
  it('exposes native keyboard buttons and the current step', () => {
    const html = renderToStaticMarkup(<StepByStep steps={[
      { title: 'Quan sát', content: 'Nội dung đầu' },
      { title: 'Áp dụng', content: 'Nội dung sau' },
    ]} />);
    expect(html.match(/<button\b/g)).toHaveLength(4);
    expect(html).toContain('aria-label="Bước 1: Quan sát"');
    expect(html).toContain('aria-label="Bước 2: Áp dụng"');
    expect(html).toContain('aria-current="step"');
    expect(html).toContain('role="status"');
    expect(html).toContain('Nội dung đầu');
    expect(html).not.toContain('Nội dung sau');
  });

  it('renders nothing for an empty explanation', () => {
    expect(renderToStaticMarkup(<StepByStep steps={[]} />)).toBe('');
  });
});
