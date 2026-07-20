import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLearnStore } from '../../core/progress/store';
import { Card, Button } from '../ui';

const GOALS = [
  { id: 'exam', label: '🎓 Ôn thi đại số tuyến tính' },
  { id: 'ml', label: '🤖 Nền tảng cho Machine Learning' },
  { id: 'curious', label: '✨ Học vì tò mò, cho vui' },
  { id: 'work', label: '💼 Phục vụ công việc / kỹ thuật' },
];

const LEVELS = [
  { id: 'new', label: 'Mới bắt đầu' },
  { id: 'some', label: 'Đã biết chút ít' },
  { id: 'review', label: 'Ôn lại kiến thức cũ' },
];

const DAILY = [
  { xp: 20, label: 'Thong thả · 20 XP' },
  { xp: 30, label: 'Bình thường · 30 XP' },
  { xp: 50, label: 'Nghiêm túc · 50 XP' },
  { xp: 70, label: 'Chuyên sâu · 70 XP' },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const setProfile = useLearnStore((s) => s.setProfile);
  const [goal, setGoal] = useState<string>('exam');
  const [level, setLevel] = useState<string>('new');
  const [dailyGoalXp, setDailyGoalXp] = useState<number>(30);

  const start = () => {
    setProfile({ goal, level, dailyGoalXp, onboarded: true });
    navigate('/');
  };

  const skip = () => {
    setProfile({ onboarded: true });
    navigate('/');
  };

  return (
    <div className="dl-page dl-onb">
      <Card className="dl-onb-card">
        <span className="dl-continue-kicker">CHÀO MỪNG</span>
        <h1 className="dl-onb-title">Cùng thiết lập lộ trình của bạn</h1>
        <p className="dl-muted">Ba câu hỏi nhanh — có thể bỏ qua bất cứ lúc nào.</p>

        <div className="dl-onb-group">
          <h3>Mục tiêu của bạn là gì?</h3>
          <div className="dl-onb-opts">
            {GOALS.map((g) => (
              <button
                key={g.id}
                type="button"
                className={`dl-onb-opt ${goal === g.id ? 'selected' : ''}`}
                onClick={() => setGoal(g.id)}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        <div className="dl-onb-group">
          <h3>Trình độ hiện tại?</h3>
          <div className="dl-onb-opts">
            {LEVELS.map((l) => (
              <button
                key={l.id}
                type="button"
                className={`dl-onb-opt ${level === l.id ? 'selected' : ''}`}
                onClick={() => setLevel(l.id)}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        <div className="dl-onb-group">
          <h3>Mục tiêu mỗi ngày?</h3>
          <div className="dl-onb-opts">
            {DAILY.map((d) => (
              <button
                key={d.xp}
                type="button"
                className={`dl-onb-opt ${dailyGoalXp === d.xp ? 'selected' : ''}`}
                onClick={() => setDailyGoalXp(d.xp)}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        <div className="dl-onb-actions">
          <Button variant="ghost" onClick={skip}>
            Bỏ qua
          </Button>
          <Button size="lg" onClick={start}>
            Bắt đầu học →
          </Button>
        </div>
      </Card>
    </div>
  );
}
