import { useMemo, useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X, ChevronsRight, Lightbulb, Flag, TriangleAlert, Star, NotebookPen, Flame } from 'lucide-react';
import { getMicroLesson } from '../../core/content/course';
import { getUnmetPrereqsForSkills } from '../../core/content/knowledgeGraph';
import { SKILL_BY_ID } from '../../core/content/skills';
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
import ExerciseIllustration from '../learning-visuals/ExerciseIllustration';
import LessonBrief, { RuleCard } from '../teaching/LessonBrief';
import { useDeveloperMode } from '../../core/developerMode';
import '../tutor/tutor.css'; // tái dùng style .tt-diagram-* (không sửa file)
import './deps.css'; // banner "Nên nắm trước" (dependency highlight), prefix dp-
import './notes.css'; // nút ⭐ + sheet ghi chú trong player, prefix nt-
import './player.css'; // restyle vỏ màn làm bài theo screen `exercise`, prefix pl-

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
  const developerMode = useDeveloperMode((state) => state.enabled);
  const navigate = useNavigate();
  const lesson = getMicroLesson(lessonId);

  const recordAttempt = useLearnStore((s) => s.recordAttempt);
  const completeLesson = useLearnStore((s) => s.completeLesson);
  const streak = useLearnStore((s) => s.streak.current);
  const markDone = useCompletion((s) => s.markDone);

  // ---- Đánh dấu ⭐ + Ghi chú (persist qua store, key `lesson:<id>`) ----
  const bookmarkId = `lesson:${lessonId}`;
  const isBookmarked = useLearnStore((s) => s.bookmarks.includes(bookmarkId));
  const toggleBookmark = useLearnStore((s) => s.toggleBookmark);
  const savedNote = useLearnStore((s) => s.notes[lessonId] ?? '');
  const saveNote = useLearnStore((s) => s.saveNote);
  const [notesOpen, setNotesOpen] = useState(false);
  const [noteDraft, setNoteDraft] = useState(savedNote);
  const [notePreview, setNotePreview] = useState(false);

  // Hạt giống MỚI mỗi phiên học → đề có số liệu mới (đồ thị đọc số từ đề nên tự
  // đổi theo). Date.now/Math.random chỉ dùng ở runtime app, không vào logic thuần.
  const seed = useMemo(() => (Date.now() ^ (Math.random() * 1e9)) >>> 0, [lessonId]);
  const exercises = useMemo<Exercise[]>(() => {
    const list = getExercisesForLesson(lessonId, 6, seed);
    return list && list.length ? list : SAMPLE_EXERCISES.slice(0, 6);
  }, [lessonId, seed]);

  // Dependency highlight: gom skill ids của các exercise trong bài (dedupe), rồi
  // hỏi những prereq TRỰC TIẾP chưa đạt (mastery < threshold mặc định 0.4).
  // Đọc mastery MỘT LẦN lúc mở bài qua getState() — không subscribe, không
  // re-render mỗi lần chấm, và không nhấp nháy khi mastery skill hiện tại tăng.
  const unmetPrereqs = useMemo(() => {
    const masteryBySkill = useLearnStore.getState().masteryBySkill;
    const masteryOf = (id: string) => masteryBySkill[id]?.score ?? 0;
    const skillIds = Array.from(new Set(exercises.map((e) => e.skillId)));
    return getUnmetPrereqsForSkills(skillIds, masteryOf);
  }, [exercises]);

  // Đóng banner: nhớ theo lessonId trong sessionStorage (ẩn suốt phiên).
  const prereqDismissKey = `dp-prereq-dismissed:${lessonId}`;
  const [prereqDismissed, setPrereqDismissed] = useState(() => {
    try {
      return sessionStorage.getItem(prereqDismissKey) === '1';
    } catch {
      return false;
    }
  });
  const dismissPrereq = () => {
    try {
      sessionStorage.setItem(prereqDismissKey, '1');
    } catch {
      /* sessionStorage không khả dụng — vẫn ẩn trong state cho phiên hiện tại */
    }
    setPrereqDismissed(true);
  };
  const showPrereqBanner = !developerMode && unmetPrereqs.length > 0 && !prereqDismissed;
  const prereqShown = unmetPrereqs.slice(0, 3);
  const prereqExtra = unmetPrereqs.length - prereqShown.length;

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
    if (phase !== 'summary' || completedRef.current || !lesson || developerMode) return;
    completedRef.current = true;
    completeLesson(lessonId, lesson.skillIds, { perfect: wrongCount === 0 });
    markDone(lessonId);
    setXpEarned((x) => x + XP.LESSON_COMPLETE);
  }, [phase, lesson, lessonId, wrongCount, completeLesson, markDone, developerMode]);

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
    const gained = !developerMode && result.correct ? XP.NO_MISTAKES : 0;
    setXpEarned((x) => x + gained);
    if (result.correct) setCorrectCount((c) => c + 1);
    else setWrongCount((w) => w + 1);
  };

  const onContinue = () => {
    if (idx < total - 1) goToExercise(idx + 1);
    else setPhase('summary');
  };

  // Bỏ qua: chuyển câu kế / kết bài mà KHÔNG chấm, KHÔNG ghi attempt, KHÔNG XP
  // (điều hướng thuần — không đụng logic chấm/SRS/mastery). Chỉ dùng trước khi chấm.
  const onSkip = () => {
    if (checked) return;
    if (idx < total - 1) goToExercise(idx + 1);
    else setPhase('summary');
  };

  // ---- Ghi chú: mở đồng bộ với bản đã lưu, auto-save khi rời/đóng ----
  const openNotes = () => {
    setNoteDraft(savedNote);
    setNotePreview(false);
    setNotesOpen(true);
  };
  const persistNote = () => saveNote(lessonId, noteDraft);
  const closeNotes = () => {
    persistNote();
    setNotesOpen(false);
  };
  const saveNotesAndClose = () => {
    persistNote();
    setNotesOpen(false);
    setToast(developerMode ? 'Xem thử: ghi chú không được lưu' : 'Đã lưu ghi chú');
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
  const showVisual = ex.type !== 'vector-drawing';

  // ---- INTRO (bài khái niệm) ----
  if (phase === 'intro') {
    return (
      <div className="dl-page dl-player dl-intro-page">
        <Card className="dl-intro">
          <span className="dl-continue-kicker">KHÁI NIỆM</span>
          <h1 className="dl-intro-title">{lesson.title}</h1>
          <LessonBrief chapterId={lessonId.split(':')[0]} lessonId={lessonId.split(':')[1]} />
          <p className="dl-muted dl-intro-lead">
            Nắm quy luật, xem ví dụ rồi thử {total} câu hỏi ngắn.
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
            <Button size="lg" onClick={() => setPhase('quiz')}>
              Bắt đầu luyện tập →
            </Button>
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
            {developerMode ? 'Đã kiểm tra xong bài' : perfect ? 'Hoàn hảo!' : 'Hoàn thành bài học!'}
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
    <div className={`dl-player-quiz pl-quiz ${showVisual ? 'has-visual' : ''}`.trim()}>
      {/* a. Hàng tiến trình siêu gọn */}
      <header className="dl-quiz-bar">
        <button
          type="button"
          className="la-icon-btn pl-close"
          onClick={() => navigate('/')}
          aria-label="Thoát"
        >
          <X size={20} strokeWidth={2} />
        </button>
        <div className="la-progress pl-progressbar">
          <i style={{ width: `${progress * 100}%` }} />
        </div>
        <span className="pl-chip" title={`Chuỗi ${streak} ngày liên tiếp`}>
          <Flame size={15} strokeWidth={2.4} aria-hidden="true" />
          <span>{streak}</span>
        </span>
        <button
          type="button"
          className={`nt-bar-btn${isBookmarked ? ' is-on' : ''}`}
          onClick={() => developerMode ? setToast('Xem thử: đánh dấu không được lưu') : toggleBookmark(bookmarkId)}
          aria-pressed={isBookmarked}
          title={isBookmarked ? 'Bỏ đánh dấu bài học' : 'Đánh dấu bài học'}
          aria-label={isBookmarked ? 'Bỏ đánh dấu bài học' : 'Đánh dấu bài học'}
        >
          <Star size={19} strokeWidth={2} fill={isBookmarked ? 'currentColor' : 'none'} />
        </button>
        <button
          type="button"
          className={`nt-bar-btn${savedNote.trim() ? ' has-note' : ''}`}
          onClick={openNotes}
          title="Ghi chú bài học"
          aria-label="Ghi chú bài học"
        >
          <NotebookPen size={18} strokeWidth={2} />
          {savedNote.trim() && <span className="nt-bar-dot" aria-hidden="true" />}
        </button>
      </header>

      <div className="dl-quiz-main">
        {/* b. Đề bài bằng HÌNH (tự động, nếu có phần trực quan) */}
        {showVisual && (
          <div className="dl-quiz-visual">
            <ExerciseIllustration exercise={ex} revealed={!!checked} />
          </div>
        )}

        <section className="dl-quiz-panel">
          <div className="dl-quiz-content">
            {developerMode && <div className="developer-preview-tools">
              <label>Chuyển nhanh câu hỏi{' '}
                <select aria-label="Chuyển nhanh câu hỏi" value={idx} onChange={(event) => goToExercise(Number(event.target.value))}>
                  {exercises.map((item, i) => <option key={`${item.id}:${i}`} value={i}>Câu {i + 1} · {typeLabel(item.type)}</option>)}
                </select>
              </label>
              <button type="button" className="btn" onClick={() => navigate('/developer')}>Danh sách bài</button>
            </div>}
            {/* Nhắc kiến thức nền chưa đạt — không chặn học, đóng được, nhớ theo phiên */}
            {showPrereqBanner && (
              <div className="dp-prereq" role="note" aria-label="Kiến thức nên nắm trước">
                <TriangleAlert className="dp-prereq-icon" size={16} strokeWidth={2} aria-hidden="true" />
                <span className="dp-prereq-label">Nên nắm trước:</span>
                <div className="dp-prereq-pills">
                  {prereqShown.map((id) => (
                    <button
                      key={id}
                      type="button"
                      className="dp-prereq-pill"
                      onClick={() => navigate('/chapters')}
                      title={SKILL_BY_ID[id]?.name ?? id}
                    >
                      {skillShortName(id)}
                    </button>
                  ))}
                  {prereqExtra > 0 && <span className="dp-prereq-more">+{prereqExtra}</span>}
                </div>
                <button
                  type="button"
                  className="dp-prereq-close"
                  onClick={dismissPrereq}
                  aria-label="Đóng nhắc nhở"
                >
                  <X size={16} strokeWidth={2} />
                </button>
              </div>
            )}

            {/* c. Thẻ câu hỏi (la-card-xl): "Câu i/n" + đề bài */}
            <div className="pl-qcard la-card-xl">
              <div className="pl-qhead">
                <span className="pl-qnum">
                  Câu {idx + 1}/{total}
                </span>
                <span className="pl-qmeta">
                  {typeLabel(ex.type)} · Độ khó {ex.difficulty}
                </span>
              </div>
              <div className="dl-quiz-prompt pl-prompt">
                <RichText text={ex.prompt} />
              </div>
              <details key={ex.id} className="exercise-rule-help">
                <summary>Nhắc quy luật</summary>
                <RuleCard skillId={ex.skillId} />
              </details>
            </div>

            {/* d. Widget trả lời (sau chấm: tô ô đã chọn theo đúng/sai) */}
            <div
              className={`dl-quiz-answer pl-answer${
                checked ? (checked.correct ? ' pl-answer--correct' : ' pl-answer--wrong') : ''
              }`}
            >
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
            <div className={`dl-feedback pl-feedback ${fb.correct ? 'good' : 'bad'}`}>
              <div className="dl-feedback-head">
                <span className="dl-feedback-icon">{fb.correct ? '✓' : '✕'}</span>
                <span className="dl-feedback-title">
                  {fb.correct ? developerMode ? 'Chính xác! · Xem thử' : `Chính xác! +${XP.NO_MISTAKES} XP` : 'Chưa đúng'}
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

          {/* Thanh hành động sticky: [trợ giảng][báo lỗi] · [Bỏ qua][Kiểm tra/Tiếp tục] */}
          <div className="dl-quiz-foot pl-foot">
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
              <>
                <button
                  type="button"
                  className="la-btn la-btn-secondary la-btn-sm"
                  onClick={onSkip}
                >
                  Bỏ qua
                </button>
                <button
                  type="button"
                  className="la-btn la-btn-primary la-btn-sm"
                  onClick={onCheck}
                  disabled={!answered}
                >
                  Kiểm tra
                </button>
              </>
            ) : (
              <button
                type="button"
                className="la-btn la-btn-primary la-btn-sm"
                onClick={onContinue}
              >
                {idx < total - 1 ? 'Tiếp tục' : 'Xem kết quả'}
              </button>
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
                {!showVisual && (
                <div className="dl-tutor-sheet-diagram">
                    <ExerciseIllustration exercise={ex} revealed={!!checked} />
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

      {/* Ghi chú: bottom sheet (mobile) / popover (PC) — fixed overlay, không phá luật 1-màn */}
      {notesOpen && (
        <>
          <div className="nt-scrim" onClick={closeNotes} aria-hidden="true" />
          <div className="nt-sheet" role="dialog" aria-label="Ghi chú bài học">
            <div className="nt-sheet-head">
              <span className="nt-sheet-title">📝 Ghi chú</span>
              <button
                type="button"
                className="nt-preview-toggle"
                onClick={() => setNotePreview((p) => !p)}
              >
                {notePreview ? 'Soạn thảo' : 'Xem trước'}
              </button>
              <button
                type="button"
                className="nt-sheet-close"
                onClick={closeNotes}
                aria-label="Đóng"
              >
                <X size={18} strokeWidth={2} />
              </button>
            </div>

            <div className="nt-sheet-body">
              {notePreview ? (
                <div className="nt-preview">
                  {noteDraft.trim() ? (
                    <MultiLine text={noteDraft} />
                  ) : (
                    <p className="dl-muted">Chưa có nội dung để xem trước.</p>
                  )}
                </div>
              ) : (
                <textarea
                  className="nt-textarea"
                  value={noteDraft}
                  onChange={(e) => setNoteDraft(e.target.value)}
                  onBlur={persistNote}
                  placeholder="Ghi chú của bạn… Hỗ trợ LaTeX $…$ và xuống dòng."
                  autoFocus
                />
              )}
            </div>

            <div className="nt-sheet-foot">
              <span className="nt-count">{noteDraft.length} ký tự</span>
              <div className="nt-spacer" />
              <Button size="sm" onClick={saveNotesAndClose}>
                Lưu
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

/** Tên hiển thị ngắn của skill: lấy phần tiếng Việt trước dấu ngoặc. */
function skillShortName(id: string): string {
  const full = SKILL_BY_ID[id]?.name ?? id;
  const paren = full.indexOf('(');
  return (paren > 0 ? full.slice(0, paren) : full).trim();
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
