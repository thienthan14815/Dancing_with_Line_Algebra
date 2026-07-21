import { useMemo, useState, useRef, useEffect } from 'react';
import type { CheckResult, Exercise } from '../../core/exercises/types';
import { checkExercise, pickHint } from '../../core/exercises/engine';
import { SKILL_GENERATORS } from '../../core/exercises/generators';
import { EXERCISES_BY_SKILL } from '../../core/content/exerciseBank';
import { mulberry32, hashStr, shuffle } from '../../core/rng';
import { useLearnStore } from '../../core/progress/store';
import { XP } from '../../core/progress/xp';
// Tái dùng (read-only) hạ tầng của Lesson Player để render + nhập đáp án đồng bộ.
import { toSchemaErrorType } from '../lib/errorType';
import { initialAnswer, hasAnswer } from '../player/answers';
import ExerciseView from '../player/variants';
import { Badge, RichText } from '../ui';
import type { PracticeCategory } from './categories';

export interface PracticeSessionProps {
  /** Danh mục đang luyện (đã kèm sẵn tập bài). */
  category: PracticeCategory;
  /** Quay về trang danh mục. */
  onExit: () => void;
}

/** Nhãn tiếng Việt cho từng dạng bài. */
function typeLabel(t: Exercise['type']): string {
  const map: Record<Exercise['type'], string> = {
    'multiple-choice': 'Trắc nghiệm',
    'numeric-input': 'Nhập số',
    'matrix-input': 'Nhập ma trận',
    matching: 'Ghép cặp',
    'step-ordering': 'Sắp xếp bước',
    'vector-drawing': 'Vẽ vector',
    'error-detection': 'Tìm lỗi sai',
    'true-false': 'Đúng / Sai',
  };
  return map[t];
}

/**
 * Phiên luyện tập: chạy lần lượt từng bài của một danh mục bằng cùng bộ
 * ExerciseView + engine của Lesson Player. Mỗi câu gọi recordAttempt với
 * { dimension, isWeakReview: true } để cộng XP ôn tập + cập nhật mastery/SRS.
 */
export default function PracticeSession({ category, onExit }: PracticeSessionProps) {
  // Hạt giống MỚI mỗi phiên: làm mới SỐ LIỆU của các bài có generator (cùng
  // DẠNG bài để giữ nguyên bố cục danh mục — vd danh mục ma trận vẫn toàn bài
  // ma trận). Skill không có generator → giữ nguyên bản tĩnh (backward-compat).
  // `nonce` tăng mỗi lần "Ôn lại" → seed MỚI → đề mới. Đây là mấu chốt khiến
  // luyện lại KHÔNG trùng (trước đây seed cố định theo category.id nên ra y hệt).
  const [nonce, setNonce] = useState(0);
  const seed = useMemo(
    () => (Date.now() ^ (Math.random() * 1e9) ^ Math.imul(nonce + 1, 0x9e3779b1)) >>> 0,
    [category.id, nonce],
  );
  const exercises = useMemo<Exercise[]>(() => {
    const list = category.exercises.map((e, i) => {
      const rng = mulberry32((seed ^ (hashStr(e.skillId) + i)) >>> 0);
      // 1) Có generator cùng DẠNG bài → số liệu MỚI theo seed.
      const gens = SKILL_GENERATORS[e.skillId];
      if (gens && gens.length > 0) {
        for (const g of gens) {
          const cand = g(rng);
          if (cand.type === e.type) return cand;
        }
      }
      // 2) Không generator → XOAY sang đề TĨNH khác cùng skill+dạng (nếu pool >1).
      const pool = (EXERCISES_BY_SKILL[e.skillId] ?? []).filter((x) => x.type === e.type);
      if (pool.length > 1) return pool[Math.floor(rng() * pool.length)];
      // 3) Chỉ có đúng 1 đề tĩnh cho skill+dạng này → giữ nguyên.
      return e;
    });
    // 4) Xáo thứ tự để các phiên không "đồng bộ" giống nhau.
    return shuffle(mulberry32((seed ^ 0x85ebca6b) >>> 0), list);
  }, [category, seed]);
  const recordAttempt = useLearnStore((s) => s.recordAttempt);

  const [idx, setIdx] = useState(0);
  const [done, setDone] = useState(false);
  const ex = exercises[idx];

  const [answer, setAnswer] = useState<unknown>(() =>
    exercises.length ? initialAnswer(exercises[0]) : null,
  );
  const [checked, setChecked] = useState<CheckResult | null>(null);
  const [hintLevel, setHintLevel] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);

  const startedAt = useRef<number>(Date.now());

  // Khi bộ đề đổi (đổi danh mục hoặc bấm Ôn lại → nonce mới) → về câu đầu &
  // reset đáp án cho khớp bài mới.
  useEffect(() => {
    setIdx(0);
    setAnswer(exercises.length ? initialAnswer(exercises[0]) : null);
    setChecked(null);
    setHintLevel(0);
    setHintsUsed(0);
    startedAt.current = Date.now();
  }, [exercises]);

  // Danh mục rỗng (không nên xảy ra vì UI chặn sẵn) — thoát an toàn.
  if (exercises.length === 0) {
    return (
      <div className="pc-session">
        <div className="la-card pc-summary">
          <div className="pc-summary-emoji">🗂️</div>
          <h1 className="pc-summary-title">Chưa có bài để luyện</h1>
          <p className="dl-muted">{category.emptyHint}</p>
          <div className="pc-summary-actions">
            <button type="button" className="la-btn la-btn-primary" onClick={onExit}>
              ← Về Trung tâm luyện tập
            </button>
          </div>
        </div>
      </div>
    );
  }

  const total = exercises.length;
  const progress = (idx + (checked ? 1 : 0)) / total;
  const answered = hasAnswer(ex, answer);
  const currentHint = hintLevel > 0 ? pickHint(ex, hintLevel) : undefined;

  const goTo = (nextIdx: number) => {
    setIdx(nextIdx);
    setAnswer(initialAnswer(exercises[nextIdx]));
    setChecked(null);
    setHintLevel(0);
    setHintsUsed(0);
    startedAt.current = Date.now();
  };

  const onCheck = () => {
    if (checked) return;
    const result = checkExercise(ex, answer);
    setChecked(result);
    recordAttempt(
      {
        exerciseId: ex.id,
        skillId: ex.skillId,
        lessonId: `practice:${category.id}`,
        isCorrect: result.correct,
        errorType: toSchemaErrorType(result.errorType),
        responseTimeMs: Date.now() - startedAt.current,
        hintsUsed,
        attemptNumber: 1,
      },
      { dimension: ex.dimension, isWeakReview: true },
    );
    if (result.correct) {
      setCorrectCount((c) => c + 1);
      setXpEarned((x) => x + XP.WEAK_REVIEW);
    } else {
      setWrongCount((w) => w + 1);
    }
  };

  const onContinue = () => {
    if (idx < total - 1) goTo(idx + 1);
    else setDone(true);
  };

  const onHint = () => {
    setHintLevel((l) => Math.min(4, l + 1));
    setHintsUsed((h) => h + 1);
  };

  const onRestart = () => {
    setCorrectCount(0);
    setWrongCount(0);
    setXpEarned(0);
    setDone(false);
    setIdx(0);
    setNonce((n) => n + 1); // seed mới → đề mới; effect [exercises] đồng bộ đáp án
  };

  // ---- TỔNG KẾT ----
  if (done) {
    const perfect = wrongCount === 0;
    return (
      <div className="pc-session">
        <div className="la-card pc-summary">
          <div className="pc-summary-emoji">{perfect ? '🏆' : '🎉'}</div>
          <h1 className="pc-summary-title">
            {perfect ? 'Ôn tập hoàn hảo!' : 'Hoàn thành buổi ôn!'}
          </h1>
          <p className="dl-muted">{category.title}</p>
          <div className="pc-summary-stats">
            <div className="pc-summary-stat">
              <span className="pc-summary-val">
                {correctCount}/{total}
              </span>
              <span className="pc-summary-lbl">Câu đúng</span>
            </div>
            <div className="pc-summary-stat">
              <span className="pc-summary-val xp">+{xpEarned}</span>
              <span className="pc-summary-lbl">XP ôn</span>
            </div>
          </div>
          <div className="pc-summary-actions">
            <button type="button" className="la-btn la-btn-secondary" onClick={onRestart}>
              🔁 Ôn lại
            </button>
            <button type="button" className="la-btn la-btn-primary" onClick={onExit}>
              ← Về Trung tâm
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---- CÂU HỎI ----
  const fb = checked;
  return (
    <div className="pc-session">
      <div className="pc-session-top">
        <button
          type="button"
          className="pc-close"
          onClick={onExit}
          aria-label="Thoát"
        >
          ✕
        </button>
        <div className="pc-progress">
          <span className="pc-progress-fill" style={{ width: `${progress * 100}%` }} />
        </div>
        <span className="pc-progress-count">
          {idx + 1}/{total}
        </span>
      </div>

      <div className="la-card-xl pc-q-card">
        <span className="pc-session-kicker">
          {category.icon} {category.title}
        </span>
        <div className="pc-q-head">
          <Badge tone="accent">{typeLabel(ex.type)}</Badge>
          <Badge tone="muted">Độ khó {ex.difficulty}</Badge>
        </div>
        <div className="pc-prompt">
          <RichText text={ex.prompt} />
        </div>

        <ExerciseView
          exercise={ex}
          value={answer}
          onChange={setAnswer}
          disabled={!!checked}
        />

        {currentHint && (
          <div className="pc-hintbox">
            <b>Gợi ý {hintLevel}/4:</b> <RichText text={currentHint.text} />
          </div>
        )}

        {fb && (
          <div className={`pc-feedback ${fb.correct ? 'good' : 'bad'}`}>
            <div className="pc-feedback-head">
              <span className="pc-feedback-icon">{fb.correct ? '✓' : '✕'}</span>
              <span>{fb.correct ? `Chính xác! +${XP.WEAK_REVIEW} XP` : 'Chưa đúng'}</span>
            </div>
            <div className="pc-feedback-body">
              <RichText text={fb.feedback} />
            </div>
            {fb.detailSteps && fb.detailSteps.length > 0 && (
              <ul className="pc-feedback-steps">
                {fb.detailSteps.map((s, i) => (
                  <li key={i}>
                    <RichText text={s} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <div className="pc-actions">
        {!checked ? (
          <>
            <button
              type="button"
              className="la-btn la-btn-secondary"
              onClick={onHint}
              disabled={hintLevel >= 4}
            >
              💡 Gợi ý
            </button>
            <div className="pc-actions-spacer" />
            <button
              type="button"
              className="la-btn la-btn-primary"
              onClick={onCheck}
              disabled={!answered}
            >
              Kiểm tra
            </button>
          </>
        ) : (
          <>
            <div className="pc-actions-spacer" />
            <button type="button" className="la-btn la-btn-primary" onClick={onContinue}>
              {idx < total - 1 ? 'Tiếp tục →' : 'Xem kết quả'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
