import { useMemo, useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X, ChevronsRight, Lightbulb, Flag } from 'lucide-react';
import { getMicroLesson } from '../../core/content/course';
import { checkExercise } from '../../core/exercises/engine';
import type { CheckResult, Exercise } from '../../core/exercises/types';
import { SAMPLE_EXERCISES } from '../../core/exercises/sampleBank';
// Contract với agent nội dung: file này do agent kia tạo.
import { getExercisesForLesson } from '../../core/content/exerciseBank';
import { XP } from '../../core/progress/xp';
import { useLearnStore } from '../../core/progress/store';
import { useCompletion } from '../state/completion';
import { toSchemaErrorType } from '../lib/errorType';
import { initialAnswer, hasAnswer } from './answers';
import ExerciseView from './variants';
import { Button, Card, RichText } from '../ui';
// Trợ giảng: dùng provider có sẵn (KHÔNG nhúng TutorPanel trong màn làm bài).
import { HeuristicTutor } from '../tutor/provider';
import type { HintLevel } from '../tutor/provider';
import { hasDiagram } from '../tutor/diagramSpec';
import TutorDiagram from '../tutor/TutorDiagram';
import '../tutor/tutor.css'; // tái dùng style .tt-diagram-* (không sửa file)

type Phase = 'intro' | 'quiz' | 'summary';

const HINT_LEVEL_LABEL: Record<HintLevel, string> = {
  1: 'Cấp 1 · Nhắc khái niệm',
  2: 'Cấp 2 · Bước cần làm',
  3: 'Cấp 3 · Gợi ý mạnh',
  4: 'Cấp 4 · Giải thích đầy đủ',
};

/** Wrapper: remount toàn bộ vòng học khi đổi lessonId. */
export default function LessonPlayer() {
  const { lessonId } = useParams();
  if (!lessonId) return <NotFound />;
  return <LessonRunner key={lessonId} lessonId={lessonId} />;
}

function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="dl-page dl-player">
      <Card>
        <h2>Không tìm thấy bài học</h2>
        <p className="dl-muted">Bài học này không tồn tại hoặc đã bị đổi tên.</p>
        <Button onClick={() => navigate('/')}>← Về trang học</Button>
      </Card>
    </div>
  );
}

function LessonRunner({ lessonId }: { lessonId: string }) {
  const navigate = useNavigate();
  const lesson = getMicroLesson(lessonId);

  const recordAttempt = useLearnStore((s) => s.recordAttempt);
  const completeLesson = useLearnStore((s) => s.completeLesson);
  const streak = useLearnStore((s) => s.streak.current);
  const markDone = useCompletion((s) => s.markDone);

  const exercises = useMemo<Exercise[]>(() => {
    const list = getExercisesForLesson(lessonId, 6);
    return list && list.length ? list : SAMPLE_EXERCISES.slice(0, 6);
  }, [lessonId]);

  const startsWithIntro = lesson?.kind === 'concept' && !!lesson.deepDiveRoute;
  const [phase, setPhase] = useState<Phase>(startsWithIntro ? 'intro' : 'quiz');
  const [idx, setIdx] = useState(0);
  const ex = exercises[idx];

  const [answer, setAnswer] = useState<unknown>(() => initialAnswer(exercises[0]));
  const [checked, setChecked] = useState<CheckResult | null>(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  // Trợ giảng (gợi ý 4 cấp) — provider cục bộ, hiển thị trong sheet/popover.
  const tutor = useMemo(() => new HeuristicTutor(), []);
  const [revealed, setRevealed] = useState<{ level: HintLevel; text: string }[]>([]);
  const [tutorOpen, setTutorOpen] = useState(false);

  const startedAt = useRef<number>(Date.now());
  const completedRef = useRef(false);

  // Focus mode: ẩn TopBar + bottom-nav, khoá scroll trang khi đang làm bài.
  useEffect(() => {
    document.body.classList.add('dl-focus');
    return () => document.body.classList.remove('dl-focus');
  }, []);

  // Kết bài: chốt completeLesson đúng 1 lần.
  useEffect(() => {
    if (phase !== 'summary' || completedRef.current || !lesson) return;
    completedRef.current = true;
    completeLesson(lessonId, lesson.skillIds, { perfect: wrongCount === 0 });
    markDone(lessonId);
    setXpEarned((x) => x + XP.LESSON_COMPLETE);
  }, [phase, lesson, lessonId, wrongCount, completeLesson, markDone]);

  // Tự ẩn toast.
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  if (!lesson) return <NotFound />;

  const total = exercises.length;
  const progress = (idx + (checked ? 1 : 0)) / total;
  const answered = hasAnswer(ex, answer);

  const goToExercise = (nextIdx: number) => {
    setIdx(nextIdx);
    setAnswer(initialAnswer(exercises[nextIdx]));
    setChecked(null);
    setHintsUsed(0);
    setRevealed([]);
    setTutorOpen(false);
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
        lessonId,
        isCorrect: result.correct,
        errorType: toSchemaErrorType(result.errorType),
        responseTimeMs: Date.now() - startedAt.current,
        hintsUsed,
        attemptNumber: 1,
      },
      { dimension: ex.dimension },
    );
    const gained = result.correct ? XP.NO_MISTAKES : 0;
    setXpEarned((x) => x + gained);
    if (result.correct) setCorrectCount((c) => c + 1);
    else setWrongCount((w) => w + 1);
  };

  const onContinue = () => {
    if (idx < total - 1) goToExercise(idx + 1);
    else setPhase('summary');
  };

  // ---- Trợ giảng: mở gợi ý cấp kế tiếp / cấp 4 ----
  const maxShown = revealed.reduce<HintLevel | 0>((m, r) => (r.level > m ? r.level : m), 0);

  const revealLevel = (level: HintLevel) => {
    // Đã mở cấp này rồi → không tính lại hintsUsed, chỉ mở sheet (ở caller).
    if (revealed.some((r) => r.level === level)) return;
    const text = tutor.hint({ exercise: ex, lastResult: checked ?? undefined, level });
    setRevealed((prev) =>
      prev.some((r) => r.level === level)
        ? prev
        : [...prev, { level, text }].sort((a, b) => a.level - b.level),
    );
    setHintsUsed((h) => h + 1);
  };

  const openNextHint = () => {
    const next = Math.min(4, maxShown + 1) as HintLevel;
    revealLevel(next);
    setTutorOpen(true);
  };
  const openFull = () => {
    revealLevel(4);
    setTutorOpen(true);
  };

  const wrong = !!checked && !checked.correct;
  const analysis = wrong
    ? tutor.analyzeError({ exercise: ex, lastResult: checked ?? undefined, level: 1 })
    : null;
  const canDraw = hasDiagram(ex);
  const showVisual = canDraw && ex.type !== 'vector-drawing';

  // ---- INTRO (bài khái niệm) ----
  if (phase === 'intro') {
    return (
      <div className="dl-page dl-player">
        <Card className="dl-intro">
          <span className="dl-continue-kicker">KHÁI NIỆM</span>
          <h1 className="dl-intro-title">{lesson.title}</h1>
          <p className="dl-muted">
            Xem phần trực quan tương tác để nắm ý tưởng, rồi quay lại làm bài tập
            củng cố. Bạn có thể bỏ qua và luyện tập ngay.
          </p>
          <div className="dl-intro-actions">
            {lesson.deepDiveRoute && (
              <a
                className="dl-btn dl-btn-ghost dl-btn-md"
                href={lesson.deepDiveRoute}
                target="_blank"
                rel="noreferrer"
              >
                🔎 Xem trực quan
              </a>
            )}
            <Button onClick={() => setPhase('quiz')}>Bắt đầu luyện tập →</Button>
          </div>
        </Card>
      </div>
    );
  }

  // ---- SUMMARY ----
  if (phase === 'summary') {
    const perfect = wrongCount === 0;
    return (
      <div className="dl-page dl-player">
        <Card className="dl-summary">
          <div className="dl-summary-emoji">{perfect ? '🏆' : '🎉'}</div>
          <h1 className="dl-summary-title">
            {perfect ? 'Hoàn hảo!' : 'Hoàn thành bài học!'}
          </h1>
          <p className="dl-muted">{lesson.title}</p>
          <div className="dl-summary-stats">
            <div className="dl-summary-stat">
              <span className="dl-summary-val">
                {correctCount}/{total}
              </span>
              <span className="dl-summary-lbl">Câu đúng</span>
            </div>
            <div className="dl-summary-stat">
              <span className="dl-summary-val dl-xp">+{xpEarned}</span>
              <span className="dl-summary-lbl">XP</span>
            </div>
            <div className="dl-summary-stat">
              <span className="dl-summary-val dl-fire">🔥 {streak}</span>
              <span className="dl-summary-lbl">Chuỗi ngày</span>
            </div>
          </div>
          <Button size="lg" block onClick={() => navigate('/')}>
            Tiếp tục
          </Button>
        </Card>
      </div>
    );
  }

  // ---- QUIZ ----
  const fb = checked;
  return (
    <div className={`dl-player-quiz ${showVisual ? 'has-visual' : ''}`.trim()}>
      {/* a. Hàng tiến trình siêu gọn */}
      <header className="dl-quiz-bar">
        <button
          type="button"
          className="dl-close"
          onClick={() => navigate('/')}
          aria-label="Thoát"
        >
          <X size={20} strokeWidth={2} />
        </button>
        <div className="dl-progress">
          <span className="dl-progress-fill" style={{ width: `${progress * 100}%` }} />
        </div>
        <span className="dl-progress-count">
          {idx + 1}/{total}
        </span>
      </header>

      <div className="dl-quiz-main">
        {/* b. Đề bài bằng HÌNH (tự động, nếu có phần trực quan) */}
        {showVisual && (
          <div className="dl-quiz-visual">
            <TutorDiagram exercise={ex} />
          </div>
        )}

        <section className="dl-quiz-panel">
          <div className="dl-quiz-content">
            {/* Caption dạng bài — chỉ hiện trên PC */}
            <p className="dl-quiz-meta">
              {typeLabel(ex.type)} · Độ khó {ex.difficulty}
            </p>

            {/* c. Đề bài TEXT — in đậm, rõ nét */}
            <div className="dl-quiz-prompt">
              <RichText text={ex.prompt} />
            </div>

            {/* d. Widget trả lời */}
            <div className="dl-quiz-answer">
              <ExerciseView
                exercise={ex}
                value={answer}
                onChange={setAnswer}
                disabled={!!checked}
              />
            </div>
          </div>

          {/* Phản hồi đúng/sai — flex-none, không đẩy cả trang scroll */}
          {fb && (
            <div className={`dl-feedback ${fb.correct ? 'good' : 'bad'}`}>
              <div className="dl-feedback-head">
                <span className="dl-feedback-icon">{fb.correct ? '✓' : '✕'}</span>
                <span className="dl-feedback-title">
                  {fb.correct ? `Chính xác! +${XP.NO_MISTAKES} XP` : 'Chưa đúng'}
                </span>
              </div>
              <div className="dl-feedback-body">
                <RichText text={fb.feedback} />
              </div>
              {fb.detailSteps && fb.detailSteps.length > 0 && (
                <ul className="dl-feedback-steps">
                  {fb.detailSteps.map((s, i) => (
                    <li key={i}>
                      <RichText text={s} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Thanh hành động: 2 nút tròn trợ giảng + báo lỗi + CTA duy nhất */}
          <div className="dl-quiz-foot">
            <div className="dl-tutor-btns">
              <button
                type="button"
                className="dl-tutor-btn"
                onClick={openNextHint}
                title={maxShown < 4 ? `Gợi ý (mở cấp ${Math.min(4, maxShown + 1)})` : 'Gợi ý'}
                aria-label="Gợi ý"
              >
                <ChevronsRight size={22} strokeWidth={2} />
                {maxShown > 0 && <span className="dl-tutor-badge">{maxShown}</span>}
              </button>
              <button
                type="button"
                className="dl-tutor-btn"
                onClick={openFull}
                title="Giải thích đầy đủ (cấp 4)"
                aria-label="Giải thích đầy đủ"
              >
                <Lightbulb size={22} strokeWidth={2} />
              </button>
            </div>

            <button
              type="button"
              className="dl-report"
              onClick={() => setToast('Đã ghi nhận báo lỗi. Cảm ơn bạn!')}
              title="Báo lỗi câu hỏi"
              aria-label="Báo lỗi câu hỏi"
            >
              <Flag size={18} strokeWidth={2} />
            </button>

            <div className="dl-actions-spacer" />

            {!checked ? (
              <Button onClick={onCheck} disabled={!answered}>
                Kiểm tra
              </Button>
            ) : (
              <Button variant={fb?.correct ? 'good' : 'primary'} onClick={onContinue}>
                {idx < total - 1 ? 'Tiếp tục →' : 'Xem kết quả'}
              </Button>
            )}
          </div>
        </section>
      </div>

      {/* Trợ giảng: bottom sheet (mobile) / popover (PC) */}
      {tutorOpen && (
        <>
          <div
            className="dl-tutor-scrim"
            onClick={() => setTutorOpen(false)}
            aria-hidden="true"
          />
          <div className="dl-tutor-sheet" role="dialog" aria-label="Trợ giảng">
            <div className="dl-tutor-sheet-head">
              <span className="dl-tutor-sheet-title">🧑‍🏫 Trợ giảng</span>
              <span className="dl-tutor-sheet-count">{maxShown}/4</span>
              <button
                type="button"
                className="dl-tutor-sheet-close"
                onClick={() => setTutorOpen(false)}
                aria-label="Đóng"
              >
                <X size={18} strokeWidth={2} />
              </button>
            </div>

            <div className="dl-tutor-sheet-body">
              {analysis && (
                <div className="dl-tutor-analysis">
                  <div className="dl-tutor-analysis-title">🔍 Phân tích lỗi</div>
                  <MultiLine text={analysis} />
                </div>
              )}

              {revealed.length > 0 ? (
                <ul className="dl-tutor-hints">
                  {revealed.map((h) => (
                    <li key={h.level} className="dl-tutor-hint">
                      <span className="dl-tutor-hint-badge">{HINT_LEVEL_LABEL[h.level]}</span>
                      <div className="dl-tutor-hint-text">
                        <MultiLine text={h.text} />
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                !analysis && (
                  <p className="dl-muted">
                    Bấm <b>Gợi ý</b> để mở gợi ý nhẹ nhất, rồi tăng dần khi cần.
                  </p>
                )
              )}

              {/* Bài có hình mà chưa hiện ở Block 1 (vd vẽ vector) → xem tại đây */}
              {canDraw && !showVisual && (
                <div className="dl-tutor-sheet-diagram">
                  <TutorDiagram exercise={ex} />
                </div>
              )}
            </div>

            <div className="dl-tutor-sheet-foot">
              <Button
                variant="ghost"
                size="sm"
                onClick={openNextHint}
                disabled={maxShown >= 4}
              >
                {maxShown < 4 ? `Gợi ý tiếp (cấp ${Math.min(4, maxShown + 1)})` : 'Đã mở hết gợi ý'}
              </Button>
              <div className="dl-actions-spacer" />
              <Button variant="ghost" size="sm" onClick={openFull} disabled={maxShown >= 4}>
                Giải thích đầy đủ
              </Button>
            </div>
          </div>
        </>
      )}

      {toast && <div className="dl-toast">{toast}</div>}
    </div>
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
          <div key={i} className="dl-tutor-line">
            <RichText text={line} />
          </div>
        ),
      )}
    </>
  );
}

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
