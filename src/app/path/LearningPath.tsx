import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Check,
  Lock,
  ChevronDown,
  Compass,
  ArrowUpRight,
  Rows3,
  Grid3x3,
  Box,
  Aperture,
  Layers,
  Code,
  Ruler,
  Orbit,
  Brain,
  Network,
  Sparkles,
  Gauge,
  BookMarked,
} from 'lucide-react';
import { COURSE, flatMicroLessons } from '../../core/content/course';
import type { MicroLesson, Section } from '../../core/content/types';
import { useLearnStore } from '../../core/progress/store';
import { useCompletion } from '../state/completion';
import { lessonDone, sectionProgress } from '../lib/progress';
import './path.css';

// ---------------------------------------------------------------------------
// PHÂN MỨC SECTION (Interfaces #8) — suy từ id chương gốc `ch{n}-…`.
//   ch0–ch3 = CƠ BẢN · ch4–ch6 = TRUNG CẤP · ch7–ch9 = NÂNG CAO ·
//   ch10–ch13 = AI & DEEP LEARNING · mọi section khác (module registry) = MỞ RỘNG.
// Dùng chính pattern id mà registry dành riêng cho 14 chương gốc → mọi module
// (id không phải `ch0..ch13`) tự rơi vào "MỞ RỘNG".
// ---------------------------------------------------------------------------
type LevelKey = 'basic' | 'intermediate' | 'advanced' | 'ai' | 'ext';

// Mọi icon lucide chung một kiểu component — mượn `typeof` cho gọn & an toàn kiểu.
type IconCmp = typeof BookMarked;

// Icon minh hoạ theo chương gốc (gợi ý trong contract). Module → BookMarked.
const VISUAL: Record<number, IconCmp> = {
  0: Compass,
  1: ArrowUpRight,
  2: Rows3,
  3: Grid3x3,
  4: Box,
  5: Aperture,
  6: Layers,
  7: Code,
  8: Ruler,
  9: Orbit,
  10: Brain,
  11: Network,
  12: Sparkles,
  13: Gauge,
};

interface LevelInfo {
  key: LevelKey;
  label: string;
  icon: IconCmp;
}

function levelInfo(section: Section): LevelInfo {
  const m = /^ch(\d+)-/.exec(section.id);
  const n = m ? Number(m[1]) : NaN;
  if (m && n <= 3) return { key: 'basic', label: 'CƠ BẢN', icon: VISUAL[n] ?? BookMarked };
  if (m && n <= 6) return { key: 'intermediate', label: 'TRUNG CẤP', icon: VISUAL[n] ?? BookMarked };
  if (m && n <= 9) return { key: 'advanced', label: 'NÂNG CAO', icon: VISUAL[n] ?? BookMarked };
  if (m && n <= 13) return { key: 'ai', label: 'AI & DEEP LEARNING', icon: VISUAL[n] ?? BookMarked };
  return { key: 'ext', label: 'MỞ RỘNG', icon: BookMarked };
}

// Bộ lọc theo mức (khớp phân mức trên).
const FILTERS: { key: 'all' | LevelKey; label: string }[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'basic', label: 'Cơ bản' },
  { key: 'intermediate', label: 'Trung cấp' },
  { key: 'advanced', label: 'Nâng cao' },
  { key: 'ai', label: 'AI & DL' },
  { key: 'ext', label: 'Mở rộng' },
];

type NodeStatus = 'completed' | 'current' | 'available' | 'locked';

export default function LearningPath() {
  const navigate = useNavigate();
  const mastery = useLearnStore((s) => s.masteryBySkill);
  const done = useCompletion((s) => s.done);

  const flat = useMemo(() => flatMicroLessons(), []);

  // Bài "hiện tại" = micro-lesson chưa xong đầu tiên theo trình tự học phẳng.
  const currentIdx = useMemo(
    () => flat.findIndex((f) => !lessonDone(f.lesson, mastery, done)),
    [flat, mastery, done],
  );
  const current = currentIdx >= 0 ? flat[currentIdx] : undefined;
  const currentSectionId = current?.sectionId;

  // Map lessonId → chỉ số phẳng (để nhận diện "bài kế tiếp").
  const globalIndex = useMemo(() => {
    const m = new Map<string, number>();
    flat.forEach((f, i) => m.set(f.lesson.id, i));
    return m;
  }, [flat]);

  // Soft-lock: section mở khoá khi MỌI prerequisite đạt ≥ 60%.
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

  // Phân mức + icon: tính 1 lần (không phụ thuộc tiến độ).
  const levels = useMemo(
    () => new Map(COURSE.sections.map((s) => [s.id, levelInfo(s)] as const)),
    [],
  );
  const hasExt = useMemo(
    () => COURSE.sections.some((s) => levels.get(s.id)?.key === 'ext'),
    [levels],
  );

  // Tiến độ tổng (mọi micro-lesson).
  const { doneCount, total } = useMemo(() => {
    let d = 0;
    for (const f of flat) if (lessonDone(f.lesson, mastery, done)) d += 1;
    return { doneCount: d, total: flat.length };
  }, [flat, mastery, done]);
  const overallPct = total ? Math.round((doneCount / total) * 100) : 0;

  const currentSection = currentSectionId
    ? COURSE.sections.find((s) => s.id === currentSectionId)
    : undefined;

  // ----- Bộ lọc -----
  const [filter, setFilter] = useState<'all' | LevelKey>('all');
  const visibleSections = useMemo(
    () =>
      filter === 'all'
        ? COURSE.sections
        : COURSE.sections.filter((s) => levels.get(s.id)?.key === filter),
    [filter, levels],
  );

  // ----- Mở/thu node (nhiều node cùng mở; current mặc định mở) -----
  const [expanded, setExpanded] = useState<Set<string>>(() => {
    const s = new Set<string>();
    if (currentSectionId) s.add(currentSectionId);
    return s;
  });
  const toggle = (section: Section) => {
    if (!(unlocked.get(section.id) ?? true)) return; // locked: không mở
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(section.id)) next.delete(section.id);
      else next.add(section.id);
      return next;
    });
  };

  // ----- Auto-scroll tới node current khi mount -----
  const nodeRefs = useRef<Record<string, HTMLLIElement | null>>({});
  const didMount = useRef(false);
  useEffect(() => {
    if (didMount.current) return;
    didMount.current = true;
    if (!currentSectionId) return;
    // Bỏ qua nếu current là section đầu (không cần cuộn).
    const idx = COURSE.sections.findIndex((s) => s.id === currentSectionId);
    if (idx > 0) {
      requestAnimationFrame(() => {
        nodeRefs.current[currentSectionId]?.scrollIntoView({
          block: 'center',
          behavior: 'smooth',
        });
      });
    }
    // Chỉ chạy 1 lần lúc mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const statusOf = (section: Section): NodeStatus => {
    const pct = sectionProgress(section, mastery, done).pct;
    if (pct >= 1) return 'completed';
    if (section.id === currentSectionId) return 'current';
    return (unlocked.get(section.id) ?? true) ? 'available' : 'locked';
  };

  const prereqNames = (section: Section): string =>
    (section.prerequisiteSectionIds ?? [])
      .map((id) => {
        const s = COURSE.sections.find((x) => x.id === id);
        return s ? `Chương ${s.num}: ${s.title}` : null;
      })
      .filter(Boolean)
      .join(', ');

  return (
    <div className="la-page rn-page">
      {/* (1) TitleBlock */}
      <header className="rn-head">
        <h1 className="rn-head-title">Lộ trình học ✦</h1>
        <p className="rn-head-sub">Học theo lộ trình từ cơ bản đến nâng cao.</p>
      </header>

      {/* (2) Thẻ tổng quan tiến độ */}
      <section className="la-card-xl rn-summary" aria-label="Tiến độ tổng">
        <div className="rn-summary-top">
          <span className="rn-summary-label">Tiến độ tổng</span>
          <span className="rn-summary-pct">{overallPct}%</span>
        </div>
        <div
          className="la-progress"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={overallPct}
        >
          <i style={{ width: `${overallPct}%` }} />
        </div>
        <p className="rn-summary-cap">
          {doneCount}/{total} bài ·{' '}
          {currentSection
            ? `Đang ở: Chương ${currentSection.num} — ${currentSection.title}`
            : 'Đã hoàn thành toàn bộ lộ trình 🎉'}
        </p>
      </section>

      {/* (3) Bộ lọc theo mức */}
      <div className="la-chip-row rn-filters" role="group" aria-label="Lọc theo mức độ">
        {FILTERS.filter((f) => f.key !== 'ext' || hasExt).map((f) => (
          <button
            key={f.key}
            type="button"
            aria-pressed={filter === f.key}
            className={`la-chip${filter === f.key ? ' active' : ''}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* (4) Timeline dọc */}
      {visibleSections.length === 0 ? (
        <p className="la-empty">Không có chương nào trong nhóm này.</p>
      ) : (
        <ol className="rn-timeline">
          {visibleSections.map((section, i) => {
            const info = levels.get(section.id)!;
            const Icon = info.icon;
            const status = statusOf(section);
            const prog = sectionProgress(section, mastery, done);
            const pct = Math.round(prog.pct * 100);
            const interactive = status !== 'locked';
            const isOpen = interactive && expanded.has(section.id);
            const isLast = i === visibleSections.length - 1;

            const btnProps = interactive
              ? {
                  role: 'button' as const,
                  tabIndex: 0,
                  'aria-expanded': isOpen,
                  onClick: () => toggle(section),
                  onKeyDown: (e: ReactKeyboardEvent) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggle(section);
                    }
                  },
                }
              : {};

            return (
              <li
                key={section.id}
                ref={(el) => {
                  nodeRefs.current[section.id] = el;
                }}
                className="rn-item"
                data-status={status}
              >
                {!isLast && <span className="rn-line" aria-hidden="true" />}

                <span className="rn-badge" aria-hidden="true">
                  {status === 'completed' ? (
                    <Check size={20} strokeWidth={2.5} />
                  ) : (
                    <span className="rn-badge-num">{section.num}</span>
                  )}
                  {status === 'locked' && <Lock className="rn-badge-lock" size={11} />}
                </span>

                <article className="la-card rn-card">
                  <div
                    className="rn-card-btn"
                    aria-label={`Chương ${section.num}: ${section.title}`}
                    {...btnProps}
                  >
                    <div className="rn-card-head">
                      <div className="rn-head-mid">
                        <span className="rn-level">{info.label}</span>
                        <h2 className="rn-node-title">{section.title}</h2>
                        <p className="rn-node-sub">{section.subtitle}</p>
                      </div>
                      <span className="rn-visual" aria-hidden="true">
                        <Icon size={22} />
                      </span>
                    </div>

                    <div className="rn-prog-row">
                      <div className="la-progress">
                        <i style={{ width: `${pct}%` }} />
                      </div>
                      <span className="rn-pct">{pct}%</span>
                      {interactive && (
                        <ChevronDown
                          className="rn-chevron"
                          size={18}
                          data-open={isOpen}
                          aria-hidden="true"
                        />
                      )}
                    </div>
                  </div>

                  {isOpen && (
                    <div className="rn-units">
                      {section.units.map((unit) => (
                        <div key={unit.id} className="rn-unit">
                          <p className="rn-unit-name">{unit.title}</p>
                          <div className="rn-lessons">
                            {unit.lessons.map((lesson) => {
                              const isDoneLesson = lessonDone(lesson, mastery, done);
                              const isNext = globalIndex.get(lesson.id) === currentIdx;
                              const state = isDoneLesson
                                ? 'done'
                                : isNext
                                  ? 'next'
                                  : 'normal';
                              return (
                                <button
                                  key={lesson.id}
                                  type="button"
                                  className="rn-lesson"
                                  data-state={state}
                                  title={lesson.title}
                                  aria-label={lesson.title}
                                  onClick={() => navigate(`/learn/${lesson.id}`)}
                                >
                                  {isDoneLesson && (
                                    <Check size={14} strokeWidth={2.5} aria-hidden="true" />
                                  )}
                                  {chipLabel(lesson)}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {status === 'locked' && (
                    <p className="rn-lock-note">
                      <Lock size={13} aria-hidden="true" />
                      Hoàn thành {prereqNames(section) || 'chương trước'} ≥ 60% để mở khóa.
                    </p>
                  )}
                </article>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

/** Nhãn ngắn cho lesson-chip theo loại micro-lesson. */
function chipLabel(lesson: MicroLesson): string {
  switch (lesson.kind) {
    case 'concept':
      return 'Khái niệm';
    case 'practice':
      return 'Luyện tập';
    case 'review':
      return 'Ôn tập chương';
    case 'challenge':
      return 'Thử thách';
    default:
      return lesson.title;
  }
}
