import { createContext, useContext, type ReactNode } from 'react';

// ---------------------------------------------------------------------------
// Chế độ xem bài học (bố cục mới):
//  - 'theory': trang BÀI HỌC = "Lý thuyết" — chỉ hiển thị học liệu
//    (Khám phá / Lý thuyết / Từng bước), KHÔNG render các section quiz.
//  - 'quiz':   trang KIỂM TRA HIỂU riêng — chỉ render các section quiz.
// LessonPage bao ngoài cung cấp giá trị qua <LessonViewProvider>; mặc định
// 'theory' để mọi nơi render bài học đều theo bố cục mới.
// ---------------------------------------------------------------------------

export type LessonView = 'theory' | 'quiz' | 'all';

const LessonViewContext = createContext<LessonView>('theory');

export function LessonViewProvider({
  view,
  children,
}: {
  view: LessonView;
  children: ReactNode;
}) {
  return <LessonViewContext.Provider value={view}>{children}</LessonViewContext.Provider>;
}

export function useLessonView(): LessonView {
  return useContext(LessonViewContext);
}

export interface LessonProps {
  id: string;
  title: string;
  children: ReactNode;
}

export function Lesson({ title, children }: LessonProps) {
  const view = useLessonView();
  return (
    <div>
      <h1 className="lesson-title">{title}</h1>
      {view !== 'all' && (
        <span className={`lesson-view-chip ${view === 'quiz' ? 'is-quiz' : ''}`}>
          {view === 'quiz' ? '✅ Kiểm tra hiểu' : '📖 Lý thuyết'}
        </span>
      )}
      {children}
    </div>
  );
}

export type SectionKind = 'explore' | 'theory' | 'steps' | 'quiz';

export interface SectionProps {
  kind: SectionKind;
  title: string;
  children: ReactNode;
}

const KIND_META: Record<SectionKind, { badge: string; cls: string }> = {
  explore: { badge: '🔍 Khám phá', cls: 'badge-explore' },
  theory: { badge: '📖 Lý thuyết', cls: 'badge-theory' },
  steps: { badge: '👣 Từng bước', cls: 'badge-steps' },
  quiz: { badge: '✅ Kiểm tra hiểu', cls: 'badge-quiz' },
};

export function Section({ kind, title, children }: SectionProps) {
  const view = useLessonView();
  // Lọc theo chế độ xem: quiz chỉ ở trang Kiểm tra hiểu, học liệu chỉ ở trang
  // Lý thuyết; 'all' (vd trang dev-check) hiển thị tất cả.
  const isQuiz = kind === 'quiz';
  if (view === 'theory' && isQuiz) return null;
  if (view === 'quiz' && !isQuiz) return null;

  const meta = KIND_META[kind];
  return (
    <section className="section">
      <div className="section-head">
        <span className={`section-badge ${meta.cls}`}>{meta.badge}</span>
        <h2 className="section-title">{title}</h2>
      </div>
      <div>{children}</div>
    </section>
  );
}

export default Lesson;
