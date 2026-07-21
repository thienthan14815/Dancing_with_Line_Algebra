import './roadmap.css';
import { Fragment, useMemo, useState } from 'react';
import { GraduationCap, Brain, Box, BarChart3, Check } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { COURSE, flatMicroLessons, getMicroLesson } from '../core/content/course';
import type { Section, MicroLesson } from '../core/content/types';
import type { SkillMastery } from '../core/db/schema';
import { useLearnStore } from '../core/progress/store';
import { useCompletion } from '../app/state/completion';
import { lessonDone, sectionProgress } from '../app/lib/progress';
import { getSkill } from '../core/content/skills';
import { ProgressRing } from '../app/ui';
import { GOAL_PATHS, stepMicroLessonId } from './goals';
import type { GoalId, GoalPath, GoalStep } from './goals';

/* ============================================================
   LỘ TRÌNH SỐNG — Roadmap page (viết lại)
   - Nguồn DUY NHẤT: COURSE.sections + flatMicroLessons() (KHỚP với
     Dashboard/LearningPath). ĐÃ BỎ hoàn toàn chapters/flatLessons
     registry cũ và mọi mảng STEPS/WEEKS/PROJECTS/FLOW hardcode.
   - Tiến độ suy từ mastery (core store) + tập done (app-local).
   - Mọi liên kết đi tới route MỚI: #/learn/<lessonId> và #/luyen.
   ============================================================ */

/** Ước lượng thời gian mỗi micro-lesson theo loại (phút). */
const MINUTES_BY_KIND: Record<string, number> = {
  concept: 5,
  practice: 8,
  review: 12,
  challenge: 10,
};
const DEFAULT_MINUTES = 6;

function lessonMinutes(l: MicroLesson): number {
  return (l.kind && MINUTES_BY_KIND[l.kind]) || DEFAULT_MINUTES;
}

const KIND_LABEL: Record<string, string> = {
  concept: 'Khái niệm',
  practice: 'Luyện tập',
  review: 'Ôn tập',
  challenge: 'Thử thách',
};

/** Cụm track: Đại số tuyến tính = num 0–9, Deep Learning = num 10–13. */
const LA_SECTIONS = COURSE.sections.filter((s) => s.num <= 9);
const DL_SECTIONS = COURSE.sections.filter((s) => s.num >= 10);

type StepStatus = 'done' | 'inprogress' | 'open' | 'locked';

const STATUS_META: Record<StepStatus, { icon: string; label: string; cls: string }> = {
  done: { icon: '✓', label: 'Đã xong', cls: 'is-done' },
  inprogress: { icon: '●', label: 'Đang học', cls: 'is-progress' },
  open: { icon: '○', label: 'Mở', cls: 'is-open' },
  locked: { icon: '🔒', label: 'Khóa', cls: 'is-locked' },
};

/** "~X phút" / "~Y giờ" cho một lượng phút còn lại. */
function fmtRemaining(min: number): string {
  if (min <= 0) return 'Đã hoàn thành';
  if (min < 60) return `~${min} phút còn lại`;
  const h = min / 60;
  return `~${h.toFixed(1)} giờ còn lại`;
}

function fmtTrackTime(min: number): string {
  if (min <= 0) return 'Đã xong cả track';
  if (min < 60) return `Còn ~${min} phút`;
  const h = min / 60;
  return `Còn ~${h.toFixed(1)} giờ`;
}

/** Vòng lặp thực hành & nhịp học — nội dung tĩnh hữu ích, không phụ thuộc route. */
const LOOP = [
  'Hiểu hình học',
  'Tính tay bài nhỏ',
  'Code không NumPy',
  'Kiểm bằng NumPy',
  'Visualize (Matplotlib)',
  'Áp dụng vào project',
];

const DAILY = [
  { min: '20′', title: 'Học khái niệm', desc: 'Đọc lý thuyết, xem hình động, nắm ý nghĩa hình học.', w: 66 },
  { min: '20′', title: 'Tính tay', desc: 'Giải vài bài nhỏ bằng bút giấy cho chắc tay.', w: 66 },
  { min: '20′', title: 'Code Python', desc: 'Tự viết trước, rồi kiểm lại bằng NumPy.', w: 66 },
  { min: '10–30′', title: 'Visualize / Project', desc: 'Vẽ bằng Matplotlib hoặc làm một mẩu project.', w: 100 },
];

function Head({ kicker, title, lead }: { kicker: string; title: string; lead?: string }) {
  return (
    <div className="rm-head">
      <span className="rm-kicker">{kicker}</span>
      <h2 className="rm-title">{title}</h2>
      {lead && <p className="rm-lead">{lead}</p>}
    </div>
  );
}

/* ============================================================
   LỘ TRÌNH THEO MỤC TIÊU (chip đầu trang)
   "Chuẩn" giữ nguyên UI cũ; 3 mục tiêu còn lại render GoalPathView.
   Tiến độ mỗi bước bám ĐÚNG cơ chế bước Chuẩn: getMicroLesson +
   lessonDone(mastery, done) — không tĩnh.
   ============================================================ */
const GOAL_ICON: Record<GoalId, LucideIcon> = {
  standard: GraduationCap,
  aiml: Brain,
  graphics: Box,
  data: BarChart3,
};

const GOAL_CHIPS: { id: GoalId; label: string }[] = [
  { id: 'standard', label: 'Chuẩn' },
  ...GOAL_PATHS.map((g) => ({ id: g.id, label: g.label })),
];

/** Một bước của lộ trình mục tiêu + trạng thái tiến độ đã suy ra. */
interface GoalStepView {
  step: GoalStep;
  chapterNum?: number;
  chapterTitle?: string;
  lessonTitle: string;
  route: string;
  done: boolean;
}

function GoalPathView({
  path,
  mastery,
  done,
}: {
  path: GoalPath;
  mastery: Record<string, SkillMastery>;
  done: Record<string, string>;
}) {
  const Icon = GOAL_ICON[path.id];

  const views: GoalStepView[] = useMemo(
    () =>
      path.steps.map((step) => {
        const microId = stepMicroLessonId(step);
        const micro = getMicroLesson(microId);
        const section = COURSE.sections.find((s) => s.id === step.chapterId);
        return {
          step,
          chapterNum: section?.num,
          chapterTitle: section?.title,
          lessonTitle: micro?.title ?? step.title,
          route: `#/learn/${microId}`,
          done: micro ? lessonDone(micro, mastery, done) : false,
        };
      }),
    [path, mastery, done],
  );

  const total = views.length;
  const doneCount = views.filter((v) => v.done).length;
  const pct = total ? Math.round((doneCount / total) * 100) : 0;

  // Gom bước theo phase, GIỮ thứ tự xuất hiện.
  const groups: { phase: string; items: GoalStepView[] }[] = [];
  for (const v of views) {
    const last = groups[groups.length - 1];
    if (last && last.phase === v.step.phase) last.items.push(v);
    else groups.push({ phase: v.step.phase, items: [v] });
  }

  // Số thứ tự chạy liên tục xuyên suốt các phase.
  let running = 0;

  return (
    <div className="gl-path">
      <div className="gl-path-head">
        <span className="gl-path-icon" aria-hidden="true">
          <Icon size={22} />
        </span>
        <div className="gl-path-headmeta">
          <span className="gl-path-kicker">Lộ trình theo mục tiêu</span>
          <h2 className="gl-path-title">{path.label}</h2>
          <p className="gl-path-lead">{path.lead}</p>
        </div>
      </div>

      <div className="gl-progress">
        <div className="gl-progress-top">
          <span className="gl-progress-label">Tiến độ lộ trình này</span>
          <span className="gl-progress-num">
            {doneCount}/{total} bước · {pct}%
          </span>
        </div>
        <div className="gl-bar">
          <span style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="gl-groups">
        {groups.map((g) => (
          <section className="gl-group" key={g.phase}>
            <h3 className="gl-group-title">{g.phase}</h3>
            <ol className="gl-steps">
              {g.items.map((v) => {
                running += 1;
                return (
                  <li
                    className={`gl-step ${v.done ? 'is-done' : ''}`}
                    key={stepMicroLessonId(v.step)}
                  >
                    <span className="gl-step-marker" aria-hidden="true">
                      {v.done ? <Check size={14} /> : running}
                    </span>
                    <div className="gl-step-body">
                      <div className="gl-step-titlerow">
                        <span className="gl-step-title">{v.step.title}</span>
                        {v.chapterNum != null && (
                          <span className="gl-step-chip">Ch{v.chapterNum}</span>
                        )}
                        {v.done && <span className="gl-step-chip is-done">✓ Đã học</span>}
                      </div>
                      <p className="gl-step-desc">{v.step.desc}</p>
                    </div>
                    <a className="gl-step-cta" href={v.route}>
                      {v.done ? 'Ôn lại' : 'Học'} →
                    </a>
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </div>

      {path.note && <p className="gl-note">📌 {path.note}</p>}
    </div>
  );
}

export default function Roadmap() {
  const mastery = useLearnStore((s) => s.masteryBySkill);
  const profile = useLearnStore((s) => s.profile);
  const done = useCompletion((s) => s.done);

  // Lộ trình theo mục tiêu (chip đầu trang) — state cục bộ, mặc định "Chuẩn".
  const [goalId, setGoalId] = useState<GoalId>('standard');
  const activePath = GOAL_PATHS.find((g) => g.id === goalId);

  const goal = profile.goal;
  const level = profile.level;

  const flat = useMemo(() => flatMicroLessons(), []);

  // Bài dở đầu tiên theo trình tự học phẳng = "bước tiếp theo nên học".
  const currentIdx = useMemo(
    () => flat.findIndex((f) => !lessonDone(f.lesson, mastery, done)),
    [flat, mastery, done],
  );
  const current = currentIdx >= 0 ? flat[currentIdx] : undefined;

  const doneCount = useMemo(
    () => flat.filter((f) => lessonDone(f.lesson, mastery, done)).length,
    [flat, mastery, done],
  );
  const totalCount = flat.length;
  const totalPct = totalCount ? Math.round((doneCount / totalCount) * 100) : 0;

  // Section mở khóa khi mọi prerequisite đạt >= 60% (soft-lock, khớp LearningPath).
  const unlocked = useMemo(() => {
    const map = new Map<string, boolean>();
    for (const s of COURSE.sections) {
      const prereqs = s.prerequisiteSectionIds ?? [];
      const ok = prereqs.every((pid) => {
        const sec = COURSE.sections.find((x) => x.id === pid);
        return sec ? sectionProgress(sec, mastery, done).pct >= 0.6 : true;
      });
      map.set(s.id, ok);
    }
    return map;
  }, [mastery, done]);

  // Gợi ý ôn tập: kỹ năng đã luyện (có trong map) nhưng mastery còn yếu (<0.5).
  const weak = useMemo(
    () =>
      (Object.values(mastery) as SkillMastery[])
        .filter((m) => m.score < 0.5)
        .sort((a, b) => a.score - b.score)
        .slice(0, 5)
        .map((m) => ({
          id: m.skillId,
          name: getSkill(m.skillId)?.name ?? m.skillId,
          pct: Math.round(m.score * 100),
        })),
    [mastery],
  );

  const currentSection = current
    ? COURSE.sections.find((s) => s.id === current.sectionId)
    : undefined;

  interface StepInfo {
    prog: ReturnType<typeof sectionProgress>;
    status: StepStatus;
    isCurrent: boolean;
    remMin: number;
    todo: MicroLesson;
    prereqNums: number[];
  }

  const stepInfo = (section: Section): StepInfo => {
    const prog = sectionProgress(section, mastery, done);
    const isUnlocked = unlocked.get(section.id) ?? true;
    const isCurrent = current?.sectionId === section.id;
    const lessons = section.units.flatMap((u) => u.lessons);

    let status: StepStatus;
    if (prog.pct >= 1) status = 'done';
    else if (!isUnlocked) status = 'locked';
    else if (prog.pct > 0 || isCurrent) status = 'inprogress';
    else status = 'open';

    let remMin = 0;
    for (const l of lessons) if (!lessonDone(l, mastery, done)) remMin += lessonMinutes(l);

    const todo = lessons.find((l) => !lessonDone(l, mastery, done)) ?? lessons[0];

    const prereqNums = (section.prerequisiteSectionIds ?? [])
      .map((pid) => COURSE.sections.find((s) => s.id === pid)?.num)
      .filter((n): n is number => n != null);

    return { prog, status, isCurrent, remMin, todo, prereqNums };
  };

  const trackStats = (sections: Section[]) => {
    let dn = 0;
    let tl = 0;
    let remMin = 0;
    for (const s of sections) {
      const p = sectionProgress(s, mastery, done);
      dn += p.done;
      tl += p.total;
      for (const l of s.units.flatMap((u) => u.lessons)) {
        if (!lessonDone(l, mastery, done)) remMin += lessonMinutes(l);
      }
    }
    return { done: dn, total: tl, pct: tl ? Math.round((dn / tl) * 100) : 0, remMin };
  };

  const renderStep = (section: Section) => {
    const info = stepInfo(section);
    const meta = STATUS_META[info.status];
    const pct = Math.round(info.prog.pct * 100);
    const ringColor = info.status === 'done' ? 'var(--good)' : 'var(--primary)';

    return (
      <div
        key={section.id}
        className={`rm-step ${meta.cls} ${info.isCurrent ? 'is-current' : ''}`}
      >
        {info.isCurrent && <span className="rm-step-flag">Bước tiếp theo</span>}
        <div className="rm-step-top">
          <ProgressRing
            progress={info.prog.pct}
            size={46}
            color={ringColor}
            label={<span className="rm-step-ringpct">{pct}%</span>}
          />
          <div className="rm-step-meta">
            <div className="rm-step-titlerow">
              <span className="rm-step-num">Ch{section.num}</span>
              <span className={`rm-step-badge ${meta.cls}`}>
                {meta.icon} {meta.label}
              </span>
            </div>
            <h3 className="rm-step-title">{section.title}</h3>
          </div>
        </div>

        <p className="rm-step-sub">{section.subtitle}</p>

        <div className="rm-step-foot">
          <span className="rm-step-count">
            {info.prog.done}/{info.prog.total} bài
          </span>
          {info.status !== 'done' && info.status !== 'locked' && (
            <span className="rm-step-time">· {fmtRemaining(info.remMin)}</span>
          )}
        </div>

        {info.status === 'locked' ? (
          <div className="rm-step-lock">
            🔒 Mở khi hoàn thành ≥60%{' '}
            {info.prereqNums.length
              ? `Chương ${info.prereqNums.map((n) => n).join(', ')}`
              : 'chương trước'}
          </div>
        ) : (
          <a className="rm-step-cta" href={`#/learn/${info.todo.id}`}>
            {info.status === 'done' ? 'Ôn lại' : info.status === 'inprogress' ? 'Học tiếp' : 'Vào học'} →
          </a>
        )}
      </div>
    );
  };

  const la = trackStats(LA_SECTIONS);
  const dl = trackStats(DL_SECTIONS);

  const dlDimmed = goal === 'exam';
  const dlFeatured = goal === 'ml';

  return (
    <div className="page rm-page">
      {/* ---------- HÀNG CHIP MỤC TIÊU LỘ TRÌNH ---------- */}
      <div className="gl-goalbar" role="tablist" aria-label="Chọn mục tiêu lộ trình">
        {GOAL_CHIPS.map((c) => {
          const Icon = GOAL_ICON[c.id];
          const active = goalId === c.id;
          return (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={active}
              className={`gl-goalchip ${active ? 'is-active' : ''}`}
              onClick={() => setGoalId(c.id)}
            >
              <Icon size={16} />
              <span>{c.label}</span>
            </button>
          );
        })}
      </div>

      <div className="gl-swap" key={goalId}>
        {goalId === 'standard' || !activePath ? (
          <>
      {/* ---------- 1. HERO — BƯỚC TIẾP THEO NÊN HỌC ---------- */}
      <div className="rm-hero">
        {current ? (
          <>
            <span className="rm-hero-kicker">Bước tiếp theo nên học</span>
            <h1 className="rm-hero-title">{current.lesson.title}</h1>
            <p className="rm-hero-sub">
              Chương {currentSection?.num}: {currentSection?.title}
              {current.lesson.kind && (
                <span className="rm-hero-chip">{KIND_LABEL[current.lesson.kind] ?? current.lesson.kind}</span>
              )}
              <span className="rm-hero-chip">{fmtRemaining(lessonMinutes(current.lesson))}</span>
            </p>
            <a className="rm-hero-cta" href={`#/learn/${current.lesson.id}`}>
              → Học ngay
            </a>
          </>
        ) : (
          <>
            <span className="rm-hero-kicker">Hoàn thành lộ trình</span>
            <h1 className="rm-hero-title">Bạn đã đi hết mọi bài! 🎉</h1>
            <p className="rm-hero-sub">
              Tuyệt vời. Giờ là lúc giữ phong độ — ôn lại các kỹ năng để mastery luôn vững.
            </p>
            <a className="rm-hero-cta" href="#/luyen">
              → Ôn tập ngay
            </a>
          </>
        )}

        <div className="rm-total">
          <div className="rm-total-top">
            <span className="rm-total-label">Tiến độ tổng của bạn</span>
            <span className="rm-total-num">
              {doneCount}/{totalCount} bài · {totalPct}%
            </span>
          </div>
          <div className="rm-bar">
            <span style={{ width: `${totalPct}%` }} />
          </div>
        </div>

        {/* Cá nhân hóa theo onboarding */}
        {(goal || level === 'review') && (
          <div className="rm-pnotes">
            {goal === 'exam' && (
              <p className="rm-pnote">
                🎯 Mục tiêu <strong>ôn thi Đại số tuyến tính</strong>: tập trung track Đại số tuyến tính
                (Ch0–9). Deep Learning là tùy chọn mở rộng — vẫn xem được nếu bạn tò mò.
              </p>
            )}
            {goal === 'ml' && (
              <p className="rm-pnote">
                🤖 Mục tiêu <strong>Machine Learning</strong>: nền Đại số tuyến tính (Ch0–9) là bệ phóng,
                nhưng đích của bạn là track <strong>Deep Learning</strong> bên dưới.
              </p>
            )}
            {level === 'review' && (
              <p className="rm-pnote">
                🔄 Bạn chọn <strong>ôn lại</strong> — không cần bắt đầu từ Ch0. Cứ nhảy tới bất kỳ chương
                nào đã mở và ôn phần mình thấy chưa chắc.
              </p>
            )}
          </div>
        )}
      </div>

      {/* ---------- 2. GỢI Ý ÔN TẬP THEO MASTERY ---------- */}
      {weak.length > 0 && (
        <section className="rm-section">
          <div className="rm-review panel">
            <Head
              kicker="Thích ứng theo bạn"
              title="🔁 Nên ôn lại"
              lead="Những kỹ năng bạn đã luyện nhưng mastery còn thấp. Ôn sớm để không hụt nền cho các chương sau."
            />
            <div className="rm-review-list">
              {weak.map((w) => (
                <a className="rm-review-item" key={w.id} href="#/luyen">
                  <span className="rm-review-name">{w.name}</span>
                  <span className="rm-review-meta">
                    <span className="rm-review-bar">
                      <span style={{ width: `${w.pct}%` }} />
                    </span>
                    <span className="rm-review-pct">{w.pct}%</span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------- 3. TRACK ĐẠI SỐ TUYẾN TÍNH ---------- */}
      <section className="rm-section rm-track">
        <div className="rm-track-head">
          <div className="rm-track-headmeta">
            <span className="rm-track-tag">Track 1</span>
            <h2 className="rm-track-name">Đại số tuyến tính</h2>
            <p className="rm-track-desc">Chương 0–9 · nền tảng cốt lõi từ số đến SVD & dạng toàn phương.</p>
          </div>
          <div className="rm-track-stat">
            <span className="rm-track-count">
              {la.done}/{la.total} bài
            </span>
            <span className="rm-track-time">{fmtTrackTime(la.remMin)}</span>
          </div>
        </div>
        <div className="rm-bar rm-track-bar">
          <span style={{ width: `${la.pct}%` }} />
        </div>
        <div className="rm-steps">{LA_SECTIONS.map(renderStep)}</div>
      </section>

      {/* ---------- 4. TRACK DEEP LEARNING ---------- */}
      <section
        className={`rm-section rm-track ${dlDimmed ? 'is-dim' : ''} ${dlFeatured ? 'is-featured' : ''}`}
      >
        <div className="rm-track-head">
          <div className="rm-track-headmeta">
            <span className="rm-track-tag">Track 2</span>
            <h2 className="rm-track-name">Deep Learning</h2>
            <p className="rm-track-desc">
              Chương 10–13 · đại số tuyến tính được áp dụng: hồi quy, mạng nơ-ron, Transformer.
            </p>
          </div>
          <div className="rm-track-stat">
            <span className="rm-track-count">
              {dl.done}/{dl.total} bài
            </span>
            <span className="rm-track-time">{fmtTrackTime(dl.remMin)}</span>
          </div>
        </div>
        {dlDimmed && (
          <p className="rm-track-note">Tùy chọn mở rộng cho mục tiêu ôn thi — bạn vẫn học được bất cứ lúc nào.</p>
        )}
        {dlFeatured && (
          <p className="rm-track-note">Đây là đích của bạn — hoàn tất track 1 trước để đi mượt nhất.</p>
        )}
        <div className="rm-bar rm-track-bar">
          <span style={{ width: `${dl.pct}%` }} />
        </div>
        <div className="rm-steps">{DL_SECTIONS.map(renderStep)}</div>
      </section>
          </>
        ) : (
          <GoalPathView path={activePath} mastery={mastery} done={done} />
        )}
      </div>

      {/* ---------- 5. VÒNG LẶP THỰC HÀNH ---------- */}
      <section className="rm-section">
        <div className="panel">
          <Head
            kicker="Cách chinh phục mỗi chủ đề"
            title="Vòng lặp thực hành 6 bước"
            lead="Áp dụng đúng vòng lặp này cho từng chủ đề — đó là khác biệt giữa 'biết tính' và 'thật sự hiểu'."
          />
          <div className="rm-loop">
            {LOOP.map((s, i) => (
              <Fragment key={s}>
                <div className="rm-loop-step">
                  <span className="rm-loop-idx">{i + 1}</span>
                  <span className="rm-loop-label">{s}</span>
                </div>
                {i < LOOP.length - 1 && (
                  <div className="rm-loop-arrow" aria-hidden="true">
                    →
                  </div>
                )}
              </Fragment>
            ))}
          </div>
          <p className="rm-loop-note">
            Tự code trước khi gọi NumPy giúp bạn hiểu thuật toán; kiểm bằng NumPy giúp bạn tin kết quả.
          </p>
        </div>
      </section>

      {/* ---------- 6. NHỊP HỌC MỖI NGÀY ---------- */}
      <section className="rm-section">
        <div className="panel">
          <Head
            kicker="Nhịp học bền vững"
            title="Mỗi ngày 60–90 phút"
            lead="Chia nhỏ theo tỉ lệ 20 / 20 / 20 / 10–30 phút. Đều đặn mỗi ngày hơn là dồn một buổi dài."
          />
          <div className="rm-daily-cards">
            {DAILY.map((d) => (
              <div className="rm-daily-card" key={d.title}>
                <div className="rm-daily-min">{d.min}</div>
                <div className="rm-daily-title">{d.title}</div>
                <p className="rm-daily-desc">{d.desc}</p>
                <div className="rm-daily-bar">
                  <span style={{ width: `${d.w}%` }} />
                </div>
              </div>
            ))}
          </div>
          <p className="rm-quote">
            Không chỉ xem video — phải: <b>nhìn hình</b>, <b>tính tay</b>, <b>viết code</b>, và{' '}
            <b>giải thích lại bằng lời của mình</b>.
          </p>
        </div>
      </section>
    </div>
  );
}
