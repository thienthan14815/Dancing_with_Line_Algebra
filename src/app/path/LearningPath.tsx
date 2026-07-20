import { useMemo } from 'react';
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

// Độ lệch trái/phải xen kẽ để tạo đường đi uốn lượn.
const OFFSETS = [0, 54, 82, 54, 0, -54, -82, -54];

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

  return (
    <div className="dl-page dl-path">
      {/* Thẻ TIẾP TỤC */}
      <Card className="dl-continue">
        {current ? (
          <>
            <div className="dl-continue-info">
              <span className="dl-continue-kicker">TIẾP TỤC HỌC</span>
              <h2 className="dl-continue-title">{current.lesson.title}</h2>
              <p className="dl-muted">
                Chương {COURSE.sections.find((s) => s.id === current.sectionId)?.num}:{' '}
                {COURSE.sections.find((s) => s.id === current.sectionId)?.title}
              </p>
            </div>
            <Button size="lg" onClick={() => navigate(`/learn/${current.lesson.id}`)}>
              Tiếp tục →
            </Button>
          </>
        ) : (
          <div className="dl-continue-info">
            <span className="dl-continue-kicker">HOÀN THÀNH</span>
            <h2 className="dl-continue-title">Bạn đã đi hết lộ trình! 🎉</h2>
            <p className="dl-muted">Ôn lại bất kỳ bài nào để giữ mastery luôn vững.</p>
          </div>
        )}
      </Card>

      {COURSE.sections.map((section: Section) => {
        const prog = sectionProgress(section, mastery, done);
        const isUnlocked = unlocked.get(section.id) ?? true;
        const lessons = section.units.flatMap((u) => u.lessons);
        return (
          <section key={section.id} className="dl-section">
            <div className={`dl-section-head ${isUnlocked ? '' : 'locked'}`}>
              <div className="dl-section-num">{section.num}</div>
              <div className="dl-section-meta">
                <h3 className="dl-section-title">{section.title}</h3>
                <p className="dl-section-sub">{section.subtitle}</p>
              </div>
              <ProgressRing
                progress={prog.pct}
                size={52}
                color={prog.pct >= 1 ? 'var(--good)' : 'var(--accent)'}
                label={
                  <span className="dl-section-pct">{Math.round(prog.pct * 100)}%</span>
                }
              />
            </div>

            <div className="dl-track">
              {lessons.map((lesson, i) => {
                const st = nodeState(lesson, section.id);
                const off = OFFSETS[i % OFFSETS.length];
                return (
                  <PathNode
                    key={lesson.id}
                    state={st}
                    label={lesson.title}
                    sublabel={
                      lesson.kind ? kindLabel(lesson.kind) : undefined
                    }
                    icon={lesson.kind ? KIND_ICON[lesson.kind] : undefined}
                    style={{ transform: `translateX(${off}px)` }}
                    onClick={() => navigate(`/learn/${lesson.id}`)}
                  />
                );
              })}
            </div>
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
