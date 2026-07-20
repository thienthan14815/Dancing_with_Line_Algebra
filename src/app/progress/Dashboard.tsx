import { useMemo } from 'react';
import { flatMicroLessons } from '../../core/content/course';
import { SKILL_BY_ID } from '../../core/content/skills';
import { useLearnStore } from '../../core/progress/store';
import { useCompletion } from '../state/completion';
import { lessonDone } from '../lib/progress';
import { Card, ProgressRing, Badge, Button } from '../ui';

export default function Dashboard() {
  const mastery = useLearnStore((s) => s.masteryBySkill);
  const attempts = useLearnStore((s) => s.attempts);
  const streak = useLearnStore((s) => s.streak.current);
  const longest = useLearnStore((s) => s.streak.longest);
  const xpTotal = useLearnStore((s) => s.xpTotal);
  const xpToday = useLearnStore((s) => s.xpToday);
  const lessonsCompleted = useLearnStore((s) => s.lessonsCompleted);
  const resetProgress = useLearnStore((s) => s.resetProgress);
  const done = useCompletion((s) => s.done);
  const resetCompletion = useCompletion((s) => s.reset);

  const flat = useMemo(() => flatMicroLessons(), []);
  const doneLessons = useMemo(
    () => flat.filter((f) => lessonDone(f.lesson, mastery, done)).length,
    [flat, mastery, done],
  );
  const coursePct = flat.length ? doneLessons / flat.length : 0;

  const accuracy = attempts.length
    ? attempts.filter((a) => a.isCorrect).length / attempts.length
    : 0;

  const skills = useMemo(
    () =>
      Object.values(mastery)
        .filter((m) => m.score > 0)
        .sort((a, b) => b.score - a.score),
    [mastery],
  );

  const onReset = () => {
    if (window.confirm('Xóa toàn bộ tiến độ học? Hồ sơ vẫn được giữ.')) {
      resetProgress();
      resetCompletion();
    }
  };

  return (
    <div className="dl-page dl-dash">
      <div className="dl-dash-hero">
        <div>
          <h1 className="dl-dash-title">Tiến độ của bạn</h1>
          <p className="dl-muted">Theo dõi XP, chuỗi ngày và độ thành thạo từng kỹ năng.</p>
        </div>
        <ProgressRing
          progress={coursePct}
          size={92}
          stroke={9}
          color="var(--accent)"
          label={
            <span className="dl-dash-ringlabel">
              <b>{Math.round(coursePct * 100)}%</b>
              <span>khóa học</span>
            </span>
          }
        />
      </div>

      <div className="dl-stat-grid">
        <Card className="dl-stat-card">
          <span className="dl-stat-icon">🔥</span>
          <span className="dl-stat-num">{streak}</span>
          <span className="dl-stat-lbl">Chuỗi ngày (kỷ lục {longest})</span>
        </Card>
        <Card className="dl-stat-card">
          <span className="dl-stat-icon">⚡</span>
          <span className="dl-stat-num">{xpTotal}</span>
          <span className="dl-stat-lbl">Tổng XP · hôm nay +{xpToday}</span>
        </Card>
        <Card className="dl-stat-card">
          <span className="dl-stat-icon">🎯</span>
          <span className="dl-stat-num">{Math.round(accuracy * 100)}%</span>
          <span className="dl-stat-lbl">Độ chính xác ({attempts.length} lượt)</span>
        </Card>
        <Card className="dl-stat-card">
          <span className="dl-stat-icon">✅</span>
          <span className="dl-stat-num">{lessonsCompleted}</span>
          <span className="dl-stat-lbl">Bài đã hoàn thành</span>
        </Card>
      </div>

      <Card className="dl-skills">
        <div className="dl-skills-head">
          <h2>Độ thành thạo theo kỹ năng</h2>
          <Badge tone="muted">{skills.length} kỹ năng đã luyện</Badge>
        </div>
        {skills.length === 0 ? (
          <p className="dl-muted">
            Chưa có dữ liệu. Hãy hoàn thành vài bài để bắt đầu đo mastery.
          </p>
        ) : (
          <div className="dl-skill-list">
            {skills.map((m) => {
              const name = SKILL_BY_ID[m.skillId]?.name ?? m.skillId;
              const pct = Math.round(m.score * 100);
              return (
                <div key={m.skillId} className="dl-skill-row">
                  <span className="dl-skill-name">{name}</span>
                  <span className="dl-skill-bar">
                    <span
                      className="dl-skill-fill"
                      style={{
                        width: `${pct}%`,
                        background:
                          pct >= 80
                            ? 'var(--good)'
                            : pct >= 40
                              ? 'var(--accent)'
                              : 'var(--warn)',
                      }}
                    />
                  </span>
                  <span className="dl-skill-pct">{pct}%</span>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <div className="dl-dash-foot">
        <Button variant="danger" size="sm" onClick={onReset}>
          Đặt lại tiến độ
        </Button>
      </div>
    </div>
  );
}
