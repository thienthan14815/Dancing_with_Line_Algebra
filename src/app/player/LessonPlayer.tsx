import { useMemo, useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMicroLesson } from '../../core/content/course';
import { checkExercise, pickHint } from '../../core/exercises/engine';
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
import { Button, Card, Badge, RichText } from '../ui';
import { TutorPanel } from '../tutor';

type Phase = 'intro' | 'quiz' | 'summary';

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
  const [hintLevel, setHintLevel] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  const startedAt = useRef<number>(Date.now());
  const completedRef = useRef(false);

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

  const onHint = () => {
    setHintLevel((l) => Math.min(4, l + 1));
    setHintsUsed((h) => h + 1);
  };

  const currentHint = hintLevel > 0 ? pickHint(ex, hintLevel) : undefined;

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
    <div className="dl-page dl-player">
      <div className="dl-player-top">
        <button
          type="button"
          className="dl-close"
          onClick={() => navigate('/')}
          aria-label="Thoát"
        >
          ✕
        </button>
        <div className="dl-progress">
          <span className="dl-progress-fill" style={{ width: `${progress * 100}%` }} />
        </div>
        <span className="dl-progress-count">
          {idx + 1}/{total}
        </span>
      </div>

      <Card className="dl-question">
        <div className="dl-question-head">
          <Badge tone="accent">{typeLabel(ex.type)}</Badge>
          <Badge tone="muted">Độ khó {ex.difficulty}</Badge>
        </div>
        <div className="dl-prompt">
          <RichText text={ex.prompt} />
        </div>

        <ExerciseView
          exercise={ex}
          value={answer}
          onChange={setAnswer}
          disabled={!!checked}
        />

        {currentHint && (
          <div className="dl-hintbox">
            <b>Gợi ý {hintLevel}/4:</b> <RichText text={currentHint.text} />
          </div>
        )}
      </Card>

      {/* Panel phản hồi */}
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

      {/* Trợ giảng: gợi ý Socratic 4 cấp + phân tích lỗi */}
      <TutorPanel exercise={ex} lastResult={checked ?? undefined} />

      {/* Thanh hành động */}
      <div className="dl-actions">
        {!checked ? (
          <>
            <Button variant="ghost" onClick={onHint} disabled={hintLevel >= 4}>
              💡 Gợi ý
            </Button>
            <button
              type="button"
              className="dl-report"
              onClick={() => setToast('Đã ghi nhận báo lỗi. Cảm ơn bạn!')}
            >
              ⚑ Báo lỗi câu hỏi
            </button>
            <div className="dl-actions-spacer" />
            <Button onClick={onCheck} disabled={!answered}>
              Kiểm tra
            </Button>
          </>
        ) : (
          <>
            <button
              type="button"
              className="dl-report"
              onClick={() => setToast('Đã ghi nhận báo lỗi. Cảm ơn bạn!')}
            >
              ⚑ Báo lỗi câu hỏi
            </button>
            <div className="dl-actions-spacer" />
            <Button
              variant={fb?.correct ? 'good' : 'primary'}
              onClick={onContinue}
            >
              {idx < total - 1 ? 'Tiếp tục →' : 'Xem kết quả'}
            </Button>
          </>
        )}
      </div>

      {toast && <div className="dl-toast">{toast}</div>}
    </div>
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
