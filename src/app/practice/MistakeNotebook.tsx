import { useMemo, useState } from 'react';
import { ChevronDown, RotateCcw } from 'lucide-react';
import type { Exercise } from '../../core/exercises/types';
import { HeuristicTutor } from '../tutor/provider';
import { Badge, RichText } from '../ui';
import { answerText, explainText, TYPE_LABEL, type MistakeEntry } from './flashcards';

export interface MistakeNotebookProps {
  /** Các lần trả lời sai (mới nhất trước) — đã suy sẵn ở PracticeCenter. */
  entries: MistakeEntry[];
  /** Làm lại MỘT bài (mở phiên luyện chỉ gồm bài đó). */
  onRedo: (exercise: Exercise) => void;
  /** Làm lại TẤT CẢ bài trong sổ. */
  onRedoAll: (exercises: Exercise[]) => void;
  /** Quay về Trung tâm luyện tập. */
  onExit: () => void;
}

/** Một provider heuristic dùng chung cho cả sổ (không mạng, cục bộ). */
const tutor = new HeuristicTutor();

/**
 * SỔ LỖI SAI — mỗi lỗi là một card gập lại. Mở ra: nhận xét lỗi (từ
 * `analyzeError` theo errorType) · đáp án đúng · vì sao (explain của bài) · nút
 * "Làm lại" để mở phiên luyện đúng bài đó.
 */
export default function MistakeNotebook({
  entries,
  onRedo,
  onRedoAll,
  onExit,
}: MistakeNotebookProps) {
  if (entries.length === 0) {
    return (
      <div className="pc-session">
        <div className="la-card pc-summary">
          <div className="pc-summary-emoji">📓</div>
          <h1 className="pc-summary-title">Sổ lỗi còn trống</h1>
          <p className="dl-muted">
            Chưa có lỗi nào được ghi lại — cứ mạnh dạn luyện, sai ở đâu ta ghi ở đó!
          </p>
          <div className="pc-summary-actions">
            <button type="button" className="la-btn la-btn-primary" onClick={onExit}>
              ← Về Trung tâm luyện tập
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pc-session nb-notebook">
      <div className="pc-session-top">
        <button type="button" className="pc-close" onClick={onExit} aria-label="Thoát">
          ✕
        </button>
        <div className="nb-head">
          <h1 className="nb-title">Sổ lỗi sai</h1>
          <span className="nb-sub">
            {entries.length} bài từng trả lời sai · bấm để xem lại
          </span>
        </div>
        <button
          type="button"
          className="la-btn la-btn-sm la-btn-secondary"
          onClick={() => onRedoAll(entries.map((e) => e.exercise))}
        >
          <RotateCcw size={16} /> Làm lại tất cả
        </button>
      </div>

      <ul className="nb-list">
        {entries.map((entry) => (
          <MistakeCard key={entry.attemptId} entry={entry} onRedo={onRedo} />
        ))}
      </ul>
    </div>
  );
}

function MistakeCard({
  entry,
  onRedo,
}: {
  entry: MistakeEntry;
  onRedo: (exercise: Exercise) => void;
}) {
  const [open, setOpen] = useState(false);
  const { exercise } = entry;

  const advice = useMemo(
    () =>
      tutor.analyzeError({
        exercise,
        lastResult: { correct: false, errorType: entry.errorType, feedback: '' },
        level: 4,
      }),
    [exercise, entry.errorType],
  );
  const answer = useMemo(() => answerText(exercise), [exercise]);
  const explain = useMemo(() => explainText(exercise), [exercise]);

  return (
    <li className={`nb-card${open ? ' is-open' : ''}`}>
      <button
        type="button"
        className="nb-card-head"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="nb-card-prompt">
          <RichText text={exercise.prompt} />
        </span>
        <span className="nb-card-meta">
          <Badge tone="muted">{TYPE_LABEL[exercise.type]}</Badge>
          <ChevronDown size={18} className="nb-chevron" aria-hidden />
        </span>
      </button>

      {open && (
        <div className="nb-card-body">
          <div className="nb-row nb-row-note">
            <span className="nb-row-label">Nhận xét lỗi</span>
            <div className="nb-row-val">
              <RichText text={advice} />
            </div>
          </div>
          <div className="nb-row nb-row-answer">
            <span className="nb-row-label">Đáp án đúng</span>
            <div className="nb-row-val nb-answer">
              <RichText text={answer} />
            </div>
          </div>
          {explain && (
            <div className="nb-row nb-row-why">
              <span className="nb-row-label">Vì sao</span>
              <div className="nb-row-val">
                <RichText text={explain} />
              </div>
            </div>
          )}
          <div className="nb-card-actions">
            <button
              type="button"
              className="la-btn la-btn-sm la-btn-primary"
              onClick={() => onRedo(exercise)}
            >
              <RotateCcw size={16} /> Làm lại
            </button>
          </div>
        </div>
      )}
    </li>
  );
}
