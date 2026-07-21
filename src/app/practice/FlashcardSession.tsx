import { useCallback, useEffect, useState } from 'react';
import { Layers, PartyPopper, RotateCw } from 'lucide-react';
import { useLearnStore } from '../../core/progress/store';
import type { FlashcardGrade } from '../../core/progress/store';
import { RichText } from '../ui';
import type { FlashCard } from './flashcards';

export interface FlashcardSessionProps {
  /** Thẻ đến hạn (được CHỤP LẠI lúc mở phiên — không đổi khi store cập nhật). */
  cards: FlashCard[];
  /** Quay về Trung tâm luyện tập. */
  onExit: () => void;
}

/** 4 mức chấm Anki, phím tắt 1–4, màu theo ngữ nghĩa. */
const GRADES: { grade: FlashcardGrade; label: string; key: string; tone: string }[] = [
  { grade: 'again', label: 'Lại', key: '1', tone: 'again' },
  { grade: 'hard', label: 'Khó', key: '2', tone: 'hard' },
  { grade: 'good', label: 'Ổn', key: '3', tone: 'good' },
  { grade: 'easy', label: 'Dễ', key: '4', tone: 'easy' },
];

/**
 * FLASHCARD — ôn theo thẻ lật (Anki). Mặt trước là câu hỏi của skill đến hạn,
 * mặt sau là đáp án + giải thích ngắn. Mỗi lần chấm gọi `gradeFlashcard` để cập
 * nhật lịch Leitner, rồi sang thẻ kế. Hết thẻ → màn chúc mừng.
 */
export default function FlashcardSession({ cards, onExit }: FlashcardSessionProps) {
  const gradeFlashcard = useLearnStore((s) => s.gradeFlashcard);

  // Chụp hàng đợi lúc mở phiên: store đổi (thẻ đã chấm rời "đến hạn") KHÔNG làm
  // hàng đợi co lại giữa chừng.
  const [queue] = useState<FlashCard[]>(cards);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(false);
  const [reviewed, setReviewed] = useState(0);

  const total = queue.length;
  const card = queue[idx];

  const grade = useCallback(
    (g: FlashcardGrade) => {
      if (!card) return;
      gradeFlashcard(card.skillId, g);
      setReviewed((n) => n + 1);
      if (idx + 1 >= total) {
        setDone(true);
      } else {
        setIdx((i) => i + 1);
        setFlipped(false);
      }
    },
    [card, gradeFlashcard, idx, total],
  );

  // Phím tắt: Space/Enter lật thẻ; 1–4 chấm (chỉ khi đã lật).
  useEffect(() => {
    if (done) return;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      if (!flipped && (e.key === ' ' || e.key === 'Enter')) {
        e.preventDefault();
        setFlipped(true);
        return;
      }
      if (flipped) {
        const hit = GRADES.find((g) => g.key === e.key);
        if (hit) {
          e.preventDefault();
          grade(hit.grade);
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [flipped, done, grade]);

  // ---- Rỗng (an toàn — UI ngoài đã chặn khi = 0) ----
  if (total === 0) {
    return (
      <div className="pc-session">
        <div className="la-card pc-summary">
          <div className="fc-summary-icon" aria-hidden>
            <Layers size={30} />
          </div>
          <h1 className="pc-summary-title">Không có thẻ đến hạn</h1>
          <p className="dl-muted">Chưa có kỹ năng nào tới lịch ôn — quay lại sau nhé!</p>
          <div className="pc-summary-actions">
            <button type="button" className="la-btn la-btn-primary" onClick={onExit}>
              ← Về Trung tâm luyện tập
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---- Chúc mừng ----
  if (done) {
    return (
      <div className="pc-session">
        <div className="la-card pc-summary">
          <div className="fc-summary-icon is-done" aria-hidden>
            <PartyPopper size={30} />
          </div>
          <h1 className="pc-summary-title">Xong thẻ hôm nay!</h1>
          <p className="dl-muted">
            Bạn đã ôn <b>{reviewed}</b> thẻ. Lịch ôn tiếp theo đã được cập nhật.
          </p>
          <div className="pc-summary-actions">
            <button type="button" className="la-btn la-btn-primary" onClick={onExit}>
              ← Về Trung tâm
            </button>
          </div>
        </div>
      </div>
    );
  }

  const remaining = total - idx; // gồm cả thẻ đang xem
  const progress = idx / total;

  return (
    <div className="pc-session fc-session">
      <div className="pc-session-top">
        <button type="button" className="pc-close" onClick={onExit} aria-label="Thoát">
          ✕
        </button>
        <div className="pc-progress">
          <span className="pc-progress-fill fc-progress-fill" style={{ width: `${progress * 100}%` }} />
        </div>
        <span className="pc-progress-count">còn {remaining} thẻ</span>
      </div>

      <div className={`fc-card${flipped ? ' is-flipped' : ''}`}>
        <button
          type="button"
          className="fc-flipper"
          onClick={() => setFlipped((f) => !f)}
          aria-label={flipped ? 'Lật lại câu hỏi' : 'Lật xem đáp án'}
        >
          <div className="fc-face fc-front">
            <span className="fc-kicker">
              <Layers size={14} /> {card.skillName} · {card.typeLabel}
            </span>
            <div className="fc-question">
              <RichText text={card.front} />
            </div>
            <span className="fc-flip-hint">
              <RotateCw size={13} /> Nhấn để lật
            </span>
          </div>
          <div className="fc-face fc-back">
            <span className="fc-back-label">Đáp án</span>
            <div className="fc-answer">
              <RichText text={card.answer} />
            </div>
            {card.explain && (
              <div className="fc-explain">
                <RichText text={card.explain} />
              </div>
            )}
          </div>
        </button>
      </div>

      {!flipped ? (
        <div className="pc-actions">
          <div className="pc-actions-spacer" />
          <button type="button" className="la-btn la-btn-primary" onClick={() => setFlipped(true)}>
            Xem đáp án
          </button>
        </div>
      ) : (
        <div className="fc-grades" role="group" aria-label="Chấm độ nhớ">
          {GRADES.map((g) => (
            <button
              key={g.grade}
              type="button"
              className={`fc-grade fc-grade-${g.tone}`}
              onClick={() => grade(g.grade)}
            >
              <span className="fc-grade-kbd">{g.key}</span>
              <span className="fc-grade-label">{g.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
