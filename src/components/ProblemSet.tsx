import { useState } from 'react';
import type { Difficulty, Problem } from '../practice/types';
import LegacyIllustration from '../app/learning-support/LegacyIllustration';
import { problemSkill } from '../app/learning-support/problemSkill';

const DIFF_META: Record<Difficulty, { label: string; cls: string }> = {
  basic: { label: 'Cơ bản', cls: 'ps-badge-basic' },
  medium: { label: 'Trung bình', cls: 'ps-badge-medium' },
  hard: { label: 'Khó', cls: 'ps-badge-hard' },
  exam: { label: 'Đề thi', cls: 'ps-badge-exam' },
};

function ProblemCard({ problem, index }: { problem: Problem; index: number }) {
  const [open, setOpen] = useState(false);
  const meta = DIFF_META[problem.difficulty];

  return (
    <div className="ps-item">
      <div className="ps-item-head">
        <span className="ps-index">Bài {index}</span>
        <span className={`ps-badge ${meta.cls}`}>{meta.label}</span>
        <span className="ps-topic">{problem.topic}</span>
      </div>

      <div className="ps-statement">{problem.statement}</div>
      <LegacyIllustration question={problem.statement} id={problem.id} skillId={problemSkill(problem.topic)} />

      <button
        className="btn ps-toggle"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        {open ? 'Ẩn lời giải' : 'Xem lời giải'}
      </button>

      {open && (
        <div className="ps-solution">
          <ol className="ps-steps">
            {problem.steps.map((step, i) => (
              <li key={i} className="ps-step">
                {step.title && <div className="ps-step-title">{step.title}</div>}
                <div className="ps-step-body">{step.content}</div>
              </li>
            ))}
          </ol>
          <div className="ps-answer">
            <span className="ps-answer-label">Đáp số</span>
            <div className="ps-answer-body">{problem.answer}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProblemSet({ problems }: { problems: Problem[] }) {
  if (problems.length === 0) {
    return <div className="panel ps-empty">Chương này chưa có bài tập.</div>;
  }

  return (
    <div className="ps-list">
      {problems.map((p, i) => (
        <ProblemCard key={p.id} problem={p} index={i + 1} />
      ))}
    </div>
  );
}
