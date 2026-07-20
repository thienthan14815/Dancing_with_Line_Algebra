import { useParams, useNavigate } from 'react-router-dom';
import { chapters } from '../chapters/registry';
import ProblemSet from '../components/ProblemSet';
import { ALL_PROBLEMS, problemsByChapter } from './problems';

export default function Practice() {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  const activeId = chapterId ?? null;

  const list = activeId ? problemsByChapter[activeId] ?? [] : ALL_PROBLEMS;
  const activeChapter = activeId ? chapters.find((c) => c.id === activeId) : undefined;

  return (
    <div className="page">
      <h1 className="lesson-title">✍️ Luyện tập</h1>
      <p className="muted ps-intro">
        Bài tập có lời giải từng bước, từ cơ bản đến trình độ đề thi cao học.
      </p>

      <div className="ps-chips">
        <button
          className={`ps-chip${activeId === null ? ' active' : ''}`}
          onClick={() => navigate('/luyen-tap')}
        >
          Tất cả
        </button>
        {chapters.map((c) => (
          <button
            key={c.id}
            className={`ps-chip${activeId === c.id ? ' active' : ''}`}
            onClick={() => navigate(`/luyen-tap/${c.id}`)}
          >
            {c.num}. {c.title}
          </button>
        ))}
      </div>

      <p className="ps-count">
        {activeChapter ? (
          <>
            Chương {activeChapter.num} · <b>{list.length}</b> bài tập
          </>
        ) : (
          <>
            Tất cả chương · <b>{list.length}</b> bài tập
          </>
        )}
      </p>

      <ProblemSet problems={list} />
    </div>
  );
}
