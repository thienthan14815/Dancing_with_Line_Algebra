import { Suspense, lazy, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { findChapter, flatLessons } from '../chapters/registry';

export default function LessonPage() {
  const { chapterId = '', lessonId = '' } = useParams();
  const navigate = useNavigate();
  const chapter = findChapter(chapterId);

  const LazyChapter = useMemo(() => {
    if (!chapter) return null;
    return lazy(chapter.load);
  }, [chapterId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!chapter || !LazyChapter) {
    return (
      <div className="page">
        <div className="panel">
          Không tìm thấy chương. <Link to="/">Về trang chủ</Link>
        </div>
      </div>
    );
  }

  // prev/next toàn cục
  const idx = flatLessons.findIndex(
    (l) => l.chapterId === chapterId && l.lessonId === lessonId
  );
  const prev = idx > 0 ? flatLessons[idx - 1] : null;
  const next = idx >= 0 && idx < flatLessons.length - 1 ? flatLessons[idx + 1] : null;

  return (
    <div className="page">
      <Suspense fallback={<div className="panel">Đang tải chương…</div>}>
        <LazyChapter lessonId={lessonId} key={`${chapterId}/${lessonId}`} />
      </Suspense>

      <div className="lesson-practice-cta">
        <Link className="btn" to={`/luyen-tap/${chapterId}`}>
          ✍️ Luyện tập chương này →
        </Link>
      </div>

      <div className="lesson-nav">
        {prev ? (
          <button
            className="btn"
            onClick={() => navigate(`/ch/${prev.chapterId}/${prev.lessonId}`)}
          >
            ← {prev.lessonTitle}
          </button>
        ) : (
          <span />
        )}
        {next ? (
          <button
            className="btn btn-primary"
            onClick={() => navigate(`/ch/${next.chapterId}/${next.lessonId}`)}
          >
            {next.lessonTitle} →
          </button>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
