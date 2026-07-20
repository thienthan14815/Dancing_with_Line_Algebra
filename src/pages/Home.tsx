import { useNavigate } from 'react-router-dom';
import { chapters } from '../chapters/registry';
import { useProgress } from '../lib/progress';

export default function Home() {
  const navigate = useNavigate();
  const completed = useProgress((s) => s.completedLessons);

  return (
    <div className="page">
      <div className="hero">
        <h1>LinAlgLab</h1>
        <p>
          Học <strong>Đại số tuyến tính</strong> một cách trực quan với hình ảnh động 2D/3D.
          Kéo vector, biến đổi lưới, chạy code — hiểu bản chất thay vì học thuộc. Lộ trình 8 chương từ
          kiến thức nền đến SVD và ứng dụng.
        </p>
        <div className="hero-actions">
          <button className="btn btn-primary" onClick={() => navigate('/lo-trinh')}>
            🗺️ Xem lộ trình học
          </button>
          <button className="btn" onClick={() => navigate('/wiki')}>
            📖 Math Wiki — tra cứu ký hiệu
          </button>
          <button className="btn" onClick={() => navigate('/luyen-tap')}>
            ✍️ Luyện tập
          </button>
        </div>
      </div>

      <div className="ch-grid">
        {chapters.map((ch) => {
          const total = ch.lessons.length;
          const done = ch.lessons.filter(
            (l) => completed[`${ch.id}/${l.id}`]
          ).length;
          const pct = total > 0 ? Math.round((done / total) * 100) : 0;
          return (
            <div
              key={ch.id}
              className="ch-card"
              onClick={() => navigate(`/ch/${ch.id}/${ch.lessons[0].id}`)}
            >
              <span className="ch-card-num">CHƯƠNG {ch.num}</span>
              <h3>{ch.title}</h3>
              <p>{ch.subtitle}</p>
              <div className="progress-bar">
                <span style={{ width: `${pct}%` }} />
              </div>
              <span className="progress-label">
                {done}/{total} bài · {pct}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
