import { useMemo } from 'react';
import { useLearnStore } from '../../core/progress/store';
import { isQuestComplete } from '../../core/progress/quests';
import { Card, Badge, Button, ProgressRing } from '../ui';
import './profile.css';

// Ánh xạ id → nhãn hiển thị (khớp lựa chọn trong onboarding).
const GOAL_LABELS: Record<string, string> = {
  exam: '🎓 Ôn thi đại số tuyến tính',
  ml: '🤖 Nền tảng cho Machine Learning',
  curious: '✨ Học vì tò mò, cho vui',
  work: '💼 Phục vụ công việc / kỹ thuật',
};
const LEVEL_LABELS: Record<string, string> = {
  new: 'Mới bắt đầu',
  some: 'Đã biết chút ít',
  review: 'Ôn lại kiến thức cũ',
};

// Biểu tượng cho từng thành tựu (id khớp core/progress/achievements.ts).
const ACHIEVEMENT_ICONS: Record<string, string> = {
  'first-lesson': '🌱',
  'streak-7': '🔥',
  'streak-30': '🏆',
  'xp-100': '⚡',
  'xp-1000': '💎',
  'perfect-lesson': '🌟',
  'skill-master': '🧠',
};

function formatDate(iso: string | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default function Profile() {
  const profile = useLearnStore((s) => s.profile);
  const xpTotal = useLearnStore((s) => s.xpTotal);
  const xpToday = useLearnStore((s) => s.xpToday);
  const streak = useLearnStore((s) => s.streak.current);
  const longest = useLearnStore((s) => s.streak.longest);
  const lessonsCompleted = useLearnStore((s) => s.lessonsCompleted);
  const attempts = useLearnStore((s) => s.attempts);
  const achievements = useLearnStore((s) => s.achievements);
  const quests = useLearnStore((s) => s.quests);
  const resetProgress = useLearnStore((s) => s.resetProgress);

  const accuracy = attempts.length
    ? attempts.filter((a) => a.isCorrect).length / attempts.length
    : 0;

  const unlockedCount = useMemo(
    () => achievements.filter((a) => a.unlockedAt).length,
    [achievements],
  );

  const displayName = profile.name?.trim() || 'Người học';
  const initial = displayName.charAt(0).toUpperCase();
  const goalLabel = profile.goal ? GOAL_LABELS[profile.goal] ?? profile.goal : undefined;
  const levelLabel = profile.level ? LEVEL_LABELS[profile.level] ?? profile.level : undefined;

  const onReset = () => {
    if (
      window.confirm(
        'Đặt lại toàn bộ tiến độ học (XP, chuỗi ngày, thành tựu, nhiệm vụ)? Hồ sơ của bạn vẫn được giữ. Hành động này không thể hoàn tác.',
      )
    ) {
      resetProgress();
    }
  };

  return (
    <div className="dl-page pf-page">
      {/* ---------- Header hồ sơ ---------- */}
      <Card className="pf-hero">
        <div className="pf-avatar" aria-hidden>
          {initial}
        </div>
        <div className="pf-hero-body">
          <h1 className="pf-name">{displayName}</h1>
          <div className="pf-hero-tags">
            {goalLabel && <Badge tone="accent">{goalLabel}</Badge>}
            {levelLabel && <Badge tone="muted">{levelLabel}</Badge>}
          </div>
          {profile.createdAt && (
            <p className="dl-muted pf-since">
              Thành viên từ {formatDate(profile.createdAt)}
            </p>
          )}
        </div>
      </Card>

      {/* ---------- Thẻ chỉ số lớn ---------- */}
      <div className="pf-stat-grid">
        <Card className="pf-stat">
          <span className="pf-stat-icon">🔥</span>
          <span className="pf-stat-num">{streak}</span>
          <span className="pf-stat-lbl">Chuỗi ngày · kỷ lục {longest}</span>
        </Card>
        <Card className="pf-stat">
          <span className="pf-stat-icon">⚡</span>
          <span className="pf-stat-num">{xpTotal}</span>
          <span className="pf-stat-lbl">Tổng XP · hôm nay +{xpToday}</span>
        </Card>
        <Card className="pf-stat">
          <span className="pf-stat-icon">✅</span>
          <span className="pf-stat-num">{lessonsCompleted}</span>
          <span className="pf-stat-lbl">Bài đã hoàn thành</span>
        </Card>
        <Card className="pf-stat">
          <span className="pf-stat-icon">🎯</span>
          <span className="pf-stat-num">{Math.round(accuracy * 100)}%</span>
          <span className="pf-stat-lbl">Độ chính xác · {attempts.length} lượt</span>
        </Card>
      </div>

      {/* ---------- Thành tựu ---------- */}
      <Card className="pf-sec">
        <div className="pf-sec-head">
          <h2 className="pf-sec-title">Thành tựu</h2>
          <Badge tone="xp">
            {unlockedCount}/{achievements.length} mở khóa
          </Badge>
        </div>
        <div className="pf-ach-grid">
          {achievements.map((a) => {
            const unlocked = !!a.unlockedAt;
            return (
              <div
                key={a.id}
                className={`pf-ach ${unlocked ? 'unlocked' : 'locked'}`}
                title={a.desc}
              >
                <span className="pf-ach-icon">
                  {unlocked ? ACHIEVEMENT_ICONS[a.id] ?? '🏅' : '🔒'}
                </span>
                <span className="pf-ach-title">{a.title}</span>
                <span className="pf-ach-desc">{a.desc}</span>
                {unlocked && (
                  <span className="pf-ach-date">Mở khóa {formatDate(a.unlockedAt)}</span>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* ---------- Nhiệm vụ hôm nay ---------- */}
      <Card className="pf-sec">
        <div className="pf-sec-head">
          <h2 className="pf-sec-title">Nhiệm vụ hôm nay</h2>
          <Badge tone="good">
            {quests.filter(isQuestComplete).length}/{quests.length} xong
          </Badge>
        </div>
        <div className="pf-quests">
          {quests.map((q) => {
            const pct = q.target > 0 ? Math.min(1, q.progress / q.target) : 0;
            const done = isQuestComplete(q);
            return (
              <div key={q.id} className="pf-quest">
                <ProgressRing
                  progress={pct}
                  size={46}
                  stroke={6}
                  color={done ? 'var(--good)' : 'var(--accent)'}
                  label={<span className="pf-quest-ring">{done ? '✓' : `${Math.round(pct * 100)}%`}</span>}
                />
                <div className="pf-quest-body">
                  <span className="pf-quest-title">{q.title}</span>
                  <span className="pf-quest-prog">
                    {q.progress}/{q.target}
                  </span>
                </div>
                {done && <Badge tone="good">Hoàn thành</Badge>}
              </div>
            );
          })}
        </div>
      </Card>

      {/* ---------- Leaderboard / Bạn bè (placeholder) ---------- */}
      <Card className="pf-sec pf-social">
        <h2 className="pf-sec-title">Bảng xếp hạng &amp; Bạn bè</h2>
        <div className="pf-social-body">
          <span className="pf-social-icon" aria-hidden>
            👥
          </span>
          <p className="dl-muted pf-social-text">
            Tính năng xã hội (bảng xếp hạng, kết bạn, thi đua) cần máy chủ backend —
            sắp có. Hiện tại mọi tiến độ được lưu riêng trên thiết bị của bạn.
          </p>
        </div>
      </Card>

      {/* ---------- Đặt lại tiến độ ---------- */}
      <div className="pf-foot">
        <Button variant="danger" size="sm" onClick={onReset}>
          Đặt lại tiến độ
        </Button>
      </div>
    </div>
  );
}
