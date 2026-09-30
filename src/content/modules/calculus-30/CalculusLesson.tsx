import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import renderMathInElement from 'katex/contrib/auto-render';
import 'katex/dist/katex.min.css';
import lessons from './lessons.json';
import content from './content.json';
import { useCompletion } from '../../../app/state/completion';
import { useDeveloperMode } from '../../../core/developerMode';
import RichText from '../../../app/ui/RichText';
import { editorial } from './editorial';
import { EditorialOpening, EditorialPractice } from './EditorialContent';
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
  function setSolutions(open: boolean) {
    ref.current?.querySelectorAll<HTMLDetailsElement>('details.ans').forEach(answer => { answer.open = open; });
  }
  return <>
    {lessonId !== 'cards' && <div className="calculus-actions calc-solution-controls" aria-label="Lời giải giáo trình">
      <button type="button" className="dl-btn dl-btn-ghost" onClick={() => setSolutions(true)}>Mở toàn bộ lời giải gốc</button>
      <button type="button" className="dl-btn dl-btn-ghost" onClick={() => setSolutions(false)}>Ẩn toàn bộ lời giải gốc</button>
    </div>}
    <div ref={ref} className="calculus-content" />
  </>;
}

export default function CalculusLesson({ lessonId }: { lessonId: string }) {
  const index = lessons.findIndex(lesson => lesson.id === lessonId);
  const lesson = lessons[index];
  const completion = useCompletion();
  const developerMode = useDeveloperMode(state => state.enabled);
  const conceptId = `calculus-30:${lessonId}:concept`;
  const extra = editorial[lessonId];
  useEffect(() => { window.scrollTo(0, 0); }, [lessonId]);
  if (!lesson) return <p>Không tìm thấy ngày học. <Link to="/giai-tich">Về giáo án</Link></p>;
  return <article className="calculus-lesson">
    <Link to="/giai-tich">← Giải tích trong 30 ngày</Link>
    <header className="calc-book-header">
      <p className="calc-kicker">{lesson.stage} · Ngày {lesson.day} / 30</p>
      <h1>{lesson.title}</h1>
      <p><strong>Sau bài này, bạn có thể: </strong><RichText text={lesson.objective} /></p>
      <p className="calc-reading-note">Đọc từ trực giác đến phương pháp, làm mẫu rồi tự giải. Các phần giảng được mở đầy đủ; lời giải tự luyện mở khi bạn cần đối chiếu.</p>
    </header>
    <nav className="calc-reading-nav" aria-label="Mục lục bài học">
      {[['calc-start', '01 · Chuẩn bị'], ['calc-observe', '02 · Trực giác'], ['calc-method', '03 · Phương pháp'], ['calc-worked', '04 · Làm mẫu'], ['calc-source', '05 · Giáo trình'], ['calc-transfer', '06 · Tự luyện']].map(([id, label]) => <button key={id} type="button" onClick={() => {
        const section = document.getElementById(id);
        section?.scrollIntoView({ block: 'start' });
        section?.setAttribute('tabindex', '-1'); section?.focus({ preventScroll: true });
      }}>{label}</button>)}
    </nav>
    {extra && <EditorialOpening key={`${lessonId}-opening`} lesson={extra} day={lesson.day} />}
    <section className="calc-reading-section calc-original" id="calc-source">
      <h2><span>05</span> Giáo trình đầy đủ & bài luyện gốc</h2>
      <SourceContent lessonId={lessonId} />
    </section>
    {extra && <EditorialPractice key={`${lessonId}-practice`} lesson={extra} />}
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
