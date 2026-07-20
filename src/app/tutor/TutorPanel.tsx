import { useEffect, useMemo, useState } from 'react';
import { Button, Card, Badge, RichText } from '../ui';
import type { BadgeTone } from '../ui';
import type { Exercise, CheckResult } from '../../core/exercises/types';
import { HeuristicTutor } from './provider';
import type { TutorProvider, HintLevel } from './provider';
import './tutor.css';

// ===========================================================================
// TUTOR PANEL — trợ giảng gợi ý 4 cấp Socratic (component ĐỘC LẬP).
// Lesson Player nhúng component này bên cạnh khối câu hỏi và truyền vào
// `exercise` hiện tại + `lastResult` (kết quả chấm gần nhất, nếu có).
// Provider mặc định là HeuristicTutor — cục bộ, KHÔNG gọi mạng.
// ===========================================================================

export interface TutorPanelProps {
  exercise: Exercise;
  /** Kết quả chấm gần nhất; khi sai sẽ hiện khối "Phân tích lỗi". */
  lastResult?: CheckResult;
  /** Cho phép tiêm provider khác (vd LLMTutor) — mặc định HeuristicTutor. */
  provider?: TutorProvider;
}

interface RevealedHint {
  level: HintLevel;
  text: string;
}

const LEVEL_LABEL: Record<HintLevel, string> = {
  1: 'Cấp 1 · Nhắc khái niệm',
  2: 'Cấp 2 · Bước cần làm',
  3: 'Cấp 3 · Gợi ý mạnh',
  4: 'Cấp 4 · Giải thích đầy đủ',
};

const LEVEL_TONE: Record<HintLevel, BadgeTone> = {
  1: 'muted',
  2: 'accent',
  3: 'warn',
  4: 'good',
};

export default function TutorPanel({ exercise, lastResult, provider }: TutorPanelProps) {
  const tutor = useMemo<TutorProvider>(() => provider ?? new HeuristicTutor(), [provider]);

  const [revealed, setRevealed] = useState<RevealedHint[]>([]);
  const [loading, setLoading] = useState(false);

  // Đổi bài → xóa hết gợi ý đã mở.
  useEffect(() => {
    setRevealed([]);
    setLoading(false);
  }, [exercise.id]);

  const maxShown = revealed.reduce<HintLevel | 0>((m, r) => (r.level > m ? r.level : m), 0);
  const nextLevel = Math.min(4, maxShown + 1) as HintLevel;
  const hasLevel4 = revealed.some((r) => r.level === 4);
  const wrong = !!lastResult && !lastResult.correct;

  const revealLevel = async (level: HintLevel) => {
    if (loading || revealed.some((r) => r.level === level)) return;
    setLoading(true);
    try {
      const text = await Promise.resolve(tutor.hint({ exercise, lastResult, level }));
      setRevealed((prev) =>
        prev.some((r) => r.level === level)
          ? prev
          : [...prev, { level, text }].sort((a, b) => a.level - b.level),
      );
    } finally {
      setLoading(false);
    }
  };

  const analysis = wrong
    ? tutor.analyzeError({ exercise, lastResult, level: 1 })
    : null;

  return (
    <Card className="tt-tutor">
      <div className="tt-head">
        <span className="tt-title">🧑‍🏫 Trợ giảng</span>
        <span className="tt-sub">Gợi ý theo 4 cấp (Socratic)</span>
        <span className="tt-count">{maxShown}/4</span>
      </div>

      {/* Khối phân tích lỗi — chỉ hiện khi lần chấm gần nhất SAI. */}
      {analysis && (
        <div className="tt-analysis">
          <div className="tt-analysis-head">
            <span className="tt-analysis-title">🔍 Phân tích lỗi</span>
            {lastResult?.errorType && (
              <Badge tone="bad">{lastResult.errorType}</Badge>
            )}
          </div>
          <div className="tt-analysis-body">
            <MultiLine text={analysis} />
          </div>
        </div>
      )}

      {/* Danh sách gợi ý đã mở, xếp theo cấp. */}
      {revealed.length > 0 ? (
        <ul className="tt-hints">
          {revealed.map((h) => (
            <li key={h.level} className={`tt-hint tt-hint-l${h.level}`}>
              <Badge tone={LEVEL_TONE[h.level]}>{LEVEL_LABEL[h.level]}</Badge>
              <div className="tt-hint-text">
                <MultiLine text={h.text} />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        !analysis && (
          <p className="tt-empty">
            Bí chỗ nào? Bấm <b>💡 Gợi ý</b> để bắt đầu với gợi ý nhẹ nhất, rồi tăng dần khi cần.
          </p>
        )
      )}

      <div className="tt-actions">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => revealLevel(nextLevel)}
          disabled={loading || maxShown >= 4}
        >
          💡 Gợi ý{maxShown < 4 ? ` (cấp ${nextLevel})` : ''}
        </Button>
        <div className="tt-actions-spacer" />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => revealLevel(4)}
          disabled={loading || hasLevel4}
          title="Hé lộ lời giải đầy đủ (cấp 4)"
        >
          📖 Giải thích đầy đủ
        </Button>
      </div>
    </Card>
  );
}

/** Render văn bản nhiều dòng: mỗi dòng qua RichText (hỗ trợ LaTeX $…$). */
function MultiLine({ text }: { text: string }) {
  const lines = text.split('\n');
  return (
    <>
      {lines.map((line, i) =>
        line.trim() === '' ? (
          <br key={i} />
        ) : (
          <div key={i} className="tt-line">
            <RichText text={line} />
          </div>
        ),
      )}
    </>
  );
}
