import { useMemo, useState } from 'react';
import { flatMicroLessons } from '../../core/content/course';
import { SKILL_BY_ID } from '../../core/content/skills';
import { useLearnStore } from '../../core/progress/store';
import { useCompletion } from '../state/completion';
import { lessonDone } from '../lib/progress';
import { Card, Badge, Button } from '../ui';

type Tab = 'skills' | 'stats';

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

  const [tab, setTab] = useState<Tab>('skills');

  const flat = useMemo(() => flatMicroLessons(), []);
  const doneLessons = useMemo(
    () => flat.filter((f) => lessonDone(f.lesson, mastery, done)).length,
    [flat, mastery, done],
  );
  const coursePct = flat.length ? Math.round((doneLessons / flat.length) * 100) : 0;

  const accuracy = attempts.length
    ? Math.round((attempts.filter((a) => a.isCorrect).length / attempts.length) * 100)
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
      <h1 className="dl-dash-title">Tiến độ</h1>

      {/* 3 bubble số liệu quan trọng nhất */}
      <div className="dl-bubbles">
        <div className="dl-bubble">
          <div className="dl-bubble-circle">
            <span className="dl-bubble-num">{coursePct}%</span>
          </div>
          <span className="dl-bubble-lbl">Hoàn thành</span>
        </div>
        <div className="dl-bubble">
          <div className="dl-bubble-circle">
            <span className="dl-bubble-num">{streak}</span>
          </div>
          <span className="dl-bubble-lbl">Chuỗi ngày</span>
        </div>
        <div className="dl-bubble">
          <div className="dl-bubble-circle">
            <span className="dl-bubble-num">{xpTotal}</span>
          </div>
          <span className="dl-bubble-lbl">Tổng XP</span>
        </div>
      </div>

      {/* Navi trong trang: 1 khối nội dung một lúc */}
      <div className="dl-tabs" role="tablist" aria-label="Xem chi tiết tiến độ">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'skills'}
          className={`dl-tab ${tab === 'skills' ? 'active' : ''}`}
          onClick={() => setTab('skills')}
        >
          Kỹ năng
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'stats'}
          className={`dl-tab ${tab === 'stats' ? 'active' : ''}`}
          onClick={() => setTab('stats')}
        >
          Thống kê
        </button>
      </div>

      <div className="dl-tab-panel" key={tab}>
        {tab === 'skills' ? (
          <Card className="dl-skills">
            <div className="dl-skills-head">
              <h2>Độ thành thạo theo kỹ năng</h2>
              <Badge tone="muted">{skills.length} kỹ năng</Badge>
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
        ) : (
          <div className="dl-stat-grid">
            <Card className="dl-stat-card">
              <span className="dl-stat-icon">🎯</span>
              <span className="dl-stat-num">{accuracy}%</span>
              <span className="dl-stat-lbl">Độ chính xác ({attempts.length} lượt)</span>
            </Card>
            <Card className="dl-stat-card">
              <span className="dl-stat-icon">✅</span>
              <span className="dl-stat-num">{lessonsCompleted}</span>
              <span className="dl-stat-lbl">Bài đã hoàn thành</span>
            </Card>
            <Card className="dl-stat-card">
              <span className="dl-stat-icon">⚡</span>
              <span className="dl-stat-num">+{xpToday}</span>
              <span className="dl-stat-lbl">XP hôm nay</span>
            </Card>
            <Card className="dl-stat-card">
              <span className="dl-stat-icon">🏅</span>
              <span className="dl-stat-num">{longest}</span>
              <span className="dl-stat-lbl">Kỷ lục chuỗi ngày</span>
            </Card>
          </div>
        )}
      </div>

      <div className="dl-dash-foot">
        <Button variant="danger" size="sm" onClick={onReset}>
          Đặt lại tiến độ
        </Button>
      </div>
    </div>
  );
}
