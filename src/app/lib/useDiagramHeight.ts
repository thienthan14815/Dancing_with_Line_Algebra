import { useEffect, useState } from 'react';

const MOBILE_QUERY = '(max-width: 768px)';

interface FitOpts {
  /** Phần chiều cao viewport dành cho hình trên mobile (0–1). */
  ratio?: number;
  min?: number;
  max?: number;
}

/**
 * Chiều cao hình vẽ trong màn làm bài: PC dùng giá trị cố định; mobile co theo
 * viewport để đề bài + hình + widget trả lời gói vừa ĐÚNG 1 màn hình.
 */
export function useDiagramHeight(desktop: number, opts?: FitOpts): number {
  const { ratio = 0.18, min = 110, max = 200 } = opts ?? {};
  const calc = () =>
    window.matchMedia(MOBILE_QUERY).matches
      ? Math.round(Math.min(max, Math.max(min, window.innerHeight * ratio)))
      : desktop;
  const [height, setHeight] = useState(calc);
  useEffect(() => {
    const onResize = () => setHeight(calc());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [desktop, ratio, min, max]);
  return height;
}
