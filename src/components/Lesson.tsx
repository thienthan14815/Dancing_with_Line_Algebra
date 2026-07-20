import type { ReactNode } from 'react';

export interface LessonProps {
  id: string;
  title: string;
  children: ReactNode;
}

export function Lesson({ title, children }: LessonProps) {
  return (
    <div>
      <h1 className="lesson-title">{title}</h1>
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
