import { lazy, Suspense, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { chapters } from '../chapters/registry';
import { useProgress } from '../lib/progress';
import '../app/graph/graph.css';

// Bản đồ tri thức nặng hơn (SVG DAG) → lazy để không phình chunk trang Chương.
const KnowledgeMap = lazy(() => import('../app/graph/KnowledgeMap'));

type HomeView = 'chapters' | 'map';

export default function Home() {
  const navigate = useNavigate();
  const completed = useProgress((s) => s.completedLessons);
  const [view, setView] = useState<HomeView>('chapters');

  return (
    <div className="page">
      <div className="hero">
        <h1>Bài học</h1>
      </div>

      <div className="kg-viewtoggle" role="tablist" aria-label="Chế độ xem">
        <button
          type="button"
          role="tab"
          aria-selected={view === 'chapters'}
          className={`kg-viewchip${view === 'chapters' ? ' is-active' : ''}`}
          onClick={() => setView('chapters')}
        >
          Chương
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={view === 'map'}
          className={`kg-viewchip${view === 'map' ? ' is-active' : ''}`}
          onClick={() => setView('map')}
        >
          Bản đồ tri thức
        </button>
      </div>

      {view === 'chapters' ? (
        <>
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
                  <div className="progress-bar">
                    <span style={{ width: `${pct}%` }} />
                  </div>
                  <span className="progress-label">
                    {done}/{total} bài
                  </span>
                </div>
              );
            })}
          </div>

          {/* Lối vào theo ngữ cảnh (Roadmap / Wiki / Luyện tập) — không nằm ở sidebar */}
          <div className="ch-links">
            <button className="btn" onClick={() => navigate('/lo-trinh')}>
              🗺️ Lộ trình
            </button>
            <button className="btn" onClick={() => navigate('/wiki')}>
              📖 Wiki
            </button>
            <button className="btn" onClick={() => navigate('/luyen-tap')}>
              ✍️ Luyện tập
            </button>
          </div>
        </>
      ) : (
        <Suspense fallback={<div className="kg-loading">Đang tải bản đồ…</div>}>
          <KnowledgeMap />
        </Suspense>
      )}
    </div>
  );
}
