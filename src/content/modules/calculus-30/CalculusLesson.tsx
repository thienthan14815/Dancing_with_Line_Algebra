import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import renderMathInElement from 'katex/contrib/auto-render';
import 'katex/dist/katex.min.css';
import lessons from './lessons.json';
import content from './content.json';
import { useCompletion } from '../../../app/state/completion';
import { useDeveloperMode } from '../../../core/developerMode';
import './calculus.css';

export function SourceContent({ lessonId }: { lessonId: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const html = (content as Record<string, string>)[lessonId];
  useEffect(() => {
    if (!ref.current || !html) return;
    // HTML comes only from our checked-in importer, never from user input.
    ref.current.innerHTML = html;
    renderMathInElement(ref.current, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$', right: '$', display: false },
        { left: '\\[', right: '\\]', display: true },
        { left: '\\(', right: '\\)', display: false },
      ],
      throwOnError: false, trust: false,
    });
  }, [html]);
  return <div ref={ref} className="calculus-content" />;
}

export default function CalculusLesson({ lessonId }: { lessonId: string }) {
  const index = lessons.findIndex(lesson => lesson.id === lessonId);
  const lesson = lessons[index];
  const completion = useCompletion();
  const developerMode = useDeveloperMode(state => state.enabled);
  const conceptId = `calculus-30:${lessonId}:concept`;
  useEffect(() => { window.scrollTo(0, 0); }, [lessonId]);
  if (!lesson) return <p>Không tìm thấy ngày học. <Link to="/giai-tich">Về giáo án</Link></p>;
  return <article className="calculus-lesson">
    <Link to="/giai-tich">← Giải tích trong 30 ngày</Link>
    <SourceContent lessonId={lessonId} />
    <div className="calculus-actions">
      <button type="button" className="dl-btn dl-btn-primary" disabled={!!completion.done[conceptId] || developerMode}
        onClick={() => completion.markDone(conceptId)}>
        {completion.done[conceptId] ? '✓ Đã đọc bài này' : developerMode ? 'Đang xem thử' : 'Đánh dấu đã đọc bài'}
      </button>
      <Link className="dl-btn dl-btn-ghost" to={`/learn/calculus-30:${lessonId}:practice`}>Luyện tập chấm điểm →</Link>
    </div>
    <nav className="calculus-actions" aria-label="Chuyển ngày học">
      {index > 0 && <Link to={`/giai-tich/${lessons[index - 1].id}`}>← Ngày {lesson.day - 1}</Link>}
      <Link to="/giai-tich/cards">Thẻ công thức</Link>
      {index < lessons.length - 1 && <Link to={`/giai-tich/${lessons[index + 1].id}`}>Ngày {lesson.day + 1} →</Link>}
    </nav>
  </article>;
}
