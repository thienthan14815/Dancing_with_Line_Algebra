import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { COURSE, flatMicroLessons } from '../../core/content/course';
import type { MicroLesson, Section } from '../../core/content/types';
import { useLearnStore } from '../../core/progress/store';
import { useCompletion } from '../state/completion';
import { lessonDone, sectionProgress } from '../lib/progress';
import { Card, Button, ProgressRing, PathNode } from '../ui';
import type { PathNodeState } from '../ui';

const KIND_ICON: Record<string, string> = {
  concept: '📘',
  practice: '✏️',
  review: '🏆',
  challenge: '⚡',
};

// Độ lệch trái/phải xen kẽ để tạo đường đi uốn lượn (biên độ gọn hơn bản cũ).
const OFFSETS = [0, 44, 66, 44, 0, -44, -66, -44];

// Trạng thái 1 chip mini-map (theo tiến độ section).
type ChipState = 'done' | 'current' | 'available' | 'locked';

export default function LearningPath() {
  const navigate = useNavigate();
  const mastery = useLearnStore((s) => s.masteryBySkill);
  const done = useCompletion((s) => s.done);

  const flat = useMemo(() => flatMicroLessons(), []);

  // Bài "hiện tại" = bài chưa xong đầu tiên theo trình tự học phẳng.
  const currentIdx = useMemo(
    () => flat.findIndex((f) => !lessonDone(f.lesson, mastery, done)),
    [flat, mastery, done],
  );
  const current = currentIdx >= 0 ? flat[currentIdx] : undefined;
  const globalIndex = useMemo(() => {
    const m = new Map<string, number>();
    flat.forEach((f, i) => m.set(f.lesson.id, i));
    return m;
  }, [flat]);

  // Section mở khóa khi mọi prerequisite đạt >= 60% (soft-lock).
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

  const nodeState = (lesson: MicroLesson, sectionId: string): PathNodeState => {
    if (lessonDone(lesson, mastery, done)) return 'done';
    if (globalIndex.get(lesson.id) === currentIdx) return 'current';
    return unlocked.get(sectionId) ? 'available' : 'locked';
  };

  // ------ ACCORDION (chỉ 1 section mở) + MINI-MAP ------
  // Section mặc định mở = section chứa bài hiện tại; hết bài → section cuối.
  const lastSectionId = COURSE.sections[COURSE.sections.length - 1].id;
  const defaultExpandedId = current?.sectionId ?? lastSectionId;
  // null = chưa tương tác (bám theo mặc định); '' = người dùng đã thu hết.
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const effectiveExpanded = expandedId === null ? defaultExpandedId : expandedId;

  // Ref tới từng <section> để cuộn tới khi chọn.
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const scrollToSection = (id: string) => {
    sectionRefs.current[id]?.scrollIntoView({ block: 'start', behavior: 'smooth' });
  };

  // Auto: khi mount, cuộn tới section đang mở (bỏ qua nếu là section đầu để
  // vẫn thấy thẻ "TIẾP TỤC").
  const didMount = useRef(false);
  useEffect(() => {
    if (didMount.current) return;
    didMount.current = true;
    const idx = COURSE.sections.findIndex((s) => s.id === effectiveExpanded);
    if (idx > 0) {
      requestAnimationFrame(() => scrollToSection(effectiveExpanded));
    }
    // Chỉ chạy 1 lần lúc mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Click header: mở section (single-open) hoặc thu nếu đang mở.
  const toggleSection = (id: string) => {
    const willOpen = effectiveExpanded !== id;
    setExpandedId(willOpen ? id : '');
    if (willOpen) requestAnimationFrame(() => scrollToSection(id));
  };

  // Click chip mini-map: luôn mở section đó + cuộn tới.
  const selectSection = (id: string) => {
    setExpandedId(id);
    requestAnimationFrame(() => scrollToSection(id));
  };

  const chipState = (section: Section): ChipState => {
    const prog = sectionProgress(section, mastery, done);
    if (prog.pct >= 1) return 'done';
    if (section.id === current?.sectionId) return 'current';
    return (unlocked.get(section.id) ?? true) ? 'available' : 'locked';
  };

  const laSections = COURSE.sections.filter((s) => s.num < 10);
  const dlSections = COURSE.sections.filter((s) => s.num >= 10);

  const renderChip = (section: Section) => {
    const cs = chipState(section);
    const active = section.id === effectiveExpanded;
    return (
      <button
        key={section.id}
        type="button"
        className={`dl-mini-chip dl-mini-${cs}${active ? ' active' : ''}`}
        onClick={() => selectSection(section.id)}
        title={`Chương ${section.num}: ${section.title}`}
        aria-label={`Chương ${section.num}: ${section.title}`}
        aria-current={active ? 'true' : undefined}
      >
        {section.num}
      </button>
    );
  };

  return (
    <div className="dl-page dl-path">
      {/* Thẻ TIẾP TỤC */}
      <Card className="dl-continue">
        {current ? (
          <>
            <div className="dl-continue-info">
              <h2 className="dl-continue-title">{current.lesson.title}</h2>
            </div>
            <Button size="lg" onClick={() => navigate(`/learn/${current.lesson.id}`)}>
              Tiếp tục →
            </Button>
          </>
        ) : (
          <div className="dl-continue-info">
            <h2 className="dl-continue-title">Đã đi hết lộ trình 🎉</h2>
          </div>
        )}
      </Card>

      {/* Mini-map: dải chip 14 chương, chia 2 nhóm — sticky dưới TopBar */}
      <nav className="dl-minimap" aria-label="Bản đồ chương">
        <div className="dl-minimap-group">
          <span className="dl-minimap-group-label">Đại số tuyến tính</span>
          <div className="dl-minimap-chips">{laSections.map(renderChip)}</div>
        </div>
        <div className="dl-minimap-group">
          <span className="dl-minimap-group-label">Deep Learning</span>
          <div className="dl-minimap-chips">{dlSections.map(renderChip)}</div>
        </div>
      </nav>

      {COURSE.sections.map((section: Section) => {
        const prog = sectionProgress(section, mastery, done);
        const isUnlocked = unlocked.get(section.id) ?? true;
        const isOpen = section.id === effectiveExpanded;
        const lessons = section.units.flatMap((u) => u.lessons);
        return (
          <section
            key={section.id}
            ref={(el) => {
              sectionRefs.current[section.id] = el;
            }}
            className="dl-section"
          >
            <div
              className={`dl-section-head ${isUnlocked ? '' : 'locked'} ${isOpen ? 'open' : ''}`}
              role="button"
              tabIndex={0}
              aria-expanded={isOpen}
              onClick={() => toggleSection(section.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleSection(section.id);
                }
              }}
            >
              <div className="dl-section-num">{section.num}</div>
              <div className="dl-section-meta">
                <h3 className="dl-section-title">{section.title}</h3>
              </div>
              <div className="dl-section-aside">
                <ProgressRing
                  progress={prog.pct}
                  size={44}
                  color={prog.pct >= 1 ? 'var(--good)' : 'var(--primary)'}
                  label={
                    <span className="dl-section-pct">{Math.round(prog.pct * 100)}%</span>
                  }
                />
                <span className="dl-section-count">
                  {prog.done}/{prog.total} bài
                </span>
              </div>
              {!isUnlocked && (
                <span className="dl-section-lock" aria-hidden="true">
                  🔒
                </span>
              )}
              <span className="dl-section-chevron" aria-hidden="true">
                {isOpen ? '▾' : '▸'}
              </span>
            </div>

            {isOpen && (
              <div className="dl-track">
                {lessons.map((lesson, i) => {
                  const st = nodeState(lesson, section.id);
                  const off = OFFSETS[i % OFFSETS.length];
                  const isLocked = st === 'locked';
                  const isCurrent = st === 'current';
                  return (
                    <div
                      key={lesson.id}
                      className={`dl-node-slot${isCurrent ? ' current' : ''}${
                        isLocked ? ' locked' : ''
                      }`}
                      title={
                        isLocked ? 'Hoàn thành ≥60% Chương trước để mở' : undefined
                      }
                    >
                      <PathNode
                        state={st}
                        label={lesson.title.replace(/ — (Khái niệm|Luyện tập)$/, '')}
                        sublabel={
                          isCurrent
                            ? 'Đang học'
                            : lesson.kind
                              ? kindLabel(lesson.kind)
                              : undefined
                        }
                        icon={lesson.kind ? KIND_ICON[lesson.kind] : undefined}
                        style={{ transform: `translateX(${off}px)` }}
                        onClick={
                          isLocked ? undefined : () => navigate(`/learn/${lesson.id}`)
                        }
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}

function kindLabel(kind: string): string {
  switch (kind) {
    case 'concept':
      return 'Khái niệm';
    case 'practice':
      return 'Luyện tập';
    case 'review':
      return 'Ôn tập';
    case 'challenge':
      return 'Thử thách';
    default:
      return kind;
  }
}
