import { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Link, Navigate } from 'react-router-dom';
import { findChapter, flatLessons } from '../chapters/registry';
import { LessonViewProvider, type LessonView } from '../components/Lesson';
import { MODULES } from '../content/registry';
import LessonBrief from '../app/teaching/LessonBrief';
import './lesson-page.css';

// Bố cục mới: trang bài học = "Lý thuyết" (Khám phá + Lý thuyết + Từng bước);
// phần Kiểm tra hiểu tách sang trang riêng `/ch/:chapterId/:lessonId/kiem-tra`,
// vào bằng nút GHIM THEO SCROLL ở góc phải dưới.
export default function LessonPage({ view = 'theory' }: { view?: LessonView }) {
  const { chapterId = '', lessonId = '' } = useParams();
  const navigate = useNavigate();
  const chapter = findChapter(chapterId);
  const [expanded, setExpanded] = useState(false);

  const LazyChapter = useMemo(() => {
    if (!chapter) return null;
    return lazy(chapter.load);
  }, [chapterId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Đổi bài hoặc đổi chế độ xem → về đầu trang.
  useEffect(() => {
    window.scrollTo(0, 0);
    setExpanded(false);
  }, [chapterId, lessonId, view]);

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

  const isQuizView = view === 'quiz';
  const lessonUrl = `/ch/${chapterId}/${lessonId}`;
  const isModule = MODULES.some((module) => module.id === chapterId);

  // Module exercises belong to the shared exercise engine, not classic Quiz.
  if (isModule && isQuizView) return <Navigate replace to={`/learn/${chapterId}:${lessonId}:practice`} />;

  return (
    <div className="page">
      {!isQuizView && <LessonBrief key={`${chapterId}/${lessonId}`} chapterId={chapterId} lessonId={lessonId} />}
      {isQuizView ? (
        <Suspense fallback={<div className="panel">Đang tải bài kiểm tra…</div>}>
          <LessonViewProvider view={view}><LazyChapter lessonId={lessonId} key={`${chapterId}/${lessonId}/${view}`} /></LessonViewProvider>
        </Suspense>
      ) : (
        <details className="lesson-deep-dive" open={expanded} onToggle={(event) => setExpanded(event.currentTarget.open)}>
          <summary>Khám phá tương tác & giải thích chi tiết</summary>
          {expanded && <Suspense fallback={<div className="panel">Đang tải phần tương tác…</div>}>
            <LessonViewProvider view={view}><LazyChapter lessonId={lessonId} key={`${chapterId}/${lessonId}/${view}`} /></LessonViewProvider>
          </Suspense>}
        </details>
      )}

      {/* Dock hành động — GHIM góc phải dưới, đi theo khi cuộn */}
      <div className="lesson-fab-dock">
        {(prev || next) && (
          <div className="lfd-nav">
            {prev ? (
              <button
                type="button"
                className="lfd-btn lfd-icon"
                title={`Bài trước: ${prev.lessonTitle}`}
                aria-label={`Bài trước: ${prev.lessonTitle}`}
                onClick={() => navigate(`/ch/${prev.chapterId}/${prev.lessonId}`)}
              >
                ←
              </button>
            ) : (
              <span className="lfd-icon-placeholder" />
            )}
            {next && (
              <button
                type="button"
                className="lfd-btn lfd-next"
                title={`Bài sau: ${next.lessonTitle}`}
                onClick={() => navigate(`/ch/${next.chapterId}/${next.lessonId}`)}
              >
                {next.lessonTitle} →
              </button>
            )}
          </div>
        )}

        <Link className="lfd-btn lfd-ghost" to={isModule ? `/learn/${chapterId}:${lessonId}:practice` : `/luyen-tap/${chapterId}`}>
          ✍️ {isModule ? 'Luyện tập bài' : 'Luyện tập chương'}
        </Link>

        <button
          type="button"
          className={`lfd-btn lfd-primary ${isQuizView ? 'is-back' : ''}`}
          onClick={() => navigate(isQuizView ? lessonUrl : `${lessonUrl}/kiem-tra`)}
        >
          {isQuizView ? '📖 Lý thuyết' : '✅ Kiểm tra hiểu →'}
        </button>
      </div>
    </div>
  );
}
