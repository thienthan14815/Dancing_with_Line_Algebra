import { Link, useParams } from 'react-router-dom';
import lessons from './lessons.json';
import CalculusLesson, { SourceContent } from './CalculusLesson';
import { useCompletion } from '../../../app/state/completion';
import { RichText } from '../../../app/ui';

const stages = [
  { title: 'Nền tảng và giới hạn', from: 1, to: 6 },
  { title: 'Đạo hàm và ứng dụng', from: 7, to: 14 },
  { title: 'Tích phân và ứng dụng', from: 15, to: 22 },
  { title: 'Giải tích nhiều biến', from: 23, to: 25 },
  { title: 'Vectơ và trường vectơ', from: 26, to: 27 },
  { title: 'Tích phân nhiều lớp và tổng kết', from: 28, to: 30 },
];

export default function CalculusPage() {
  const { dayId } = useParams();
  const done = useCompletion(state => state.done);
  const read = lessons.filter(lesson => done[`calculus-30:${lesson.id}:concept`]).length;
  const practiced = lessons.filter(lesson => done[`calculus-30:${lesson.id}:practice`]).length;
  const next = lessons.find(lesson => !done[`calculus-30:${lesson.id}:concept`]) ?? lessons[0];
  if (dayId === 'cards') return <div className="la-page calculus-page"><Link to="/giai-tich">← Giải tích 30 ngày</Link><SourceContent lessonId="cards" /></div>;
  if (dayId) return <div className="la-page calculus-page"><CalculusLesson lessonId={dayId} /></div>;
  return <div className="la-page calculus-page">
    <header className="la-card-xl la-hero-grad calculus-intro">
      <p className="la-badge">GIÁO ÁN · 30 NGÀY</p>
      <h1>Giải tích trong 30 ngày</h1>
      <p>Từ hàm số và giới hạn đến đạo hàm, tích phân và giải tích nhiều biến. Mỗi ngày có mục tiêu, ví dụ, bài tự làm và lời giải để đối chiếu.</p>
      <p aria-live="polite">Đã đọc {read}/30 ngày · Đã luyện tập {practiced}/30 ngày</p>
      <div className="calculus-actions">
        <Link className="dl-btn dl-btn-primary" to={`/giai-tich/${next.id}`}>{read ? 'Học tiếp' : 'Bắt đầu'} · Ngày {next.day} →</Link>
        <Link className="dl-btn dl-btn-ghost" to="/giai-tich/cards">Thẻ công thức</Link>
      </div>
    </header>
    {stages.map((stage, index) => <section className="la-card calculus-stage" key={stage.from}>
      <h2>Chặng {index + 1} · {stage.title}</h2>
      <p>Ngày {stage.from}–{stage.to}</p>
      <ol start={stage.from}>
        {lessons.filter(lesson => lesson.day >= stage.from && lesson.day <= stage.to).map(lesson => <li key={lesson.id}>
          <Link to={`/giai-tich/${lesson.id}`}>
            <strong>Ngày {lesson.day} · {lesson.title}</strong>
            <span><RichText text={lesson.objective} /></span>
            {done[`calculus-30:${lesson.id}:concept`] && <small>✓ Đã đọc</small>}
            {done[`calculus-30:${lesson.id}:practice`] && <small>✓ Đã luyện tập</small>}
          </Link>
        </li>)}
      </ol>
    </section>)}
  </div>;
}
