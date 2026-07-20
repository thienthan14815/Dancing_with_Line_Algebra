import { useMemo, useState } from 'react';
import { useLearnStore } from '../../core/progress/store';
import { Button, Card, Badge } from '../ui';
import { buildCategories, type PracticeCategory } from './categories';
import PracticeSession from './PracticeSession';
import './practice.css';

/** Tab nội dung — mỗi lúc chỉ hiện MỘT khối. */
type PracticeTab = 'smart' | 'topic';
const PRACTICE_TABS: { id: PracticeTab; label: string }[] = [
  { id: 'smart', label: 'Ôn thông minh' },
  { id: 'topic', label: 'Theo chủ đề' },
];

/**
 * TRUNG TÂM LUYỆN TẬP — trang chính (route `#/luyen`), kiến trúc "bubble".
 *
 * Mặc định (tab "Ôn thông minh"): 3 bubble hành động to — Ôn lỗi sai / Kỹ năng
 * yếu / Sắp quên — hiện số đếm, bấm là vào phiên luôn (bubble mờ nếu đếm = 0).
 * Tab "Theo chủ đề": 3 thẻ gọn (ma trận / trực quan / trộn) chỉ tên + số + nút.
 * Bấm bắt đầu → mở PracticeSession tại chỗ; thoát/kết phiên quay lại.
 */
export default function PracticeCenter() {
  const attempts = useLearnStore((s) => s.attempts);
  const masteryBySkill = useLearnStore((s) => s.masteryBySkill);
  const reviewItems = useLearnStore((s) => s.reviewItems);

  const categories = useMemo(
    () => buildCategories({ attempts, masteryBySkill, reviewItems }),
    [attempts, masteryBySkill, reviewItems],
  );

  const [active, setActive] = useState<PracticeCategory | null>(null);
  const [tab, setTab] = useState<PracticeTab>('smart');

  if (active) {
    return (
      <div className="pc-page">
        <PracticeSession key={active.id} category={active} onExit={() => setActive(null)} />
      </div>
    );
  }

  // buildCategories luôn trả đúng thứ tự: [mistakes, weak, due, matrix, visual, mixed].
  const smart = categories.slice(0, 3);
  const topic = categories.slice(3, 6);

  return (
    <div className="pc-page">
      <h1 className="pc-hero-title pc-page-title">Luyện tập</h1>

      <div className="pc-nav" role="tablist" aria-label="Chế độ luyện">
        {PRACTICE_TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            className={`pc-nav-chip${tab === t.id ? ' is-active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'smart' && (
        <div className="pc-tab" key="smart">
          <div className="pc-bubbles">
            {smart.map((cat) => (
              <ActionBubble key={cat.id} category={cat} onStart={() => setActive(cat)} />
            ))}
          </div>
        </div>
      )}

      {tab === 'topic' && (
        <div className="pc-tab" key="topic">
          <div className="pc-grid">
            {topic.map((cat) => (
              <CompactCategoryCard key={cat.id} category={cat} onStart={() => setActive(cat)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface BubbleProps {
  category: PracticeCategory;
  onStart: () => void;
}

/** Bubble hành động to: icon + số đếm + tên; đếm 0 → disabled. */
function ActionBubble({ category, onStart }: BubbleProps) {
  const n = category.exercises.length;
  const empty = n === 0;
  return (
    <button type="button" className="pc-bubble" disabled={empty} onClick={onStart}>
      <span className="pc-bubble-icon" aria-hidden>
        {category.icon}
      </span>
      <span className="pc-bubble-count">{n}</span>
      <span className="pc-bubble-title">{category.title}</span>
      <span className="pc-bubble-sub">{empty ? 'Chưa có bài' : 'bài · bấm để luyện'}</span>
    </button>
  );
}

/** Thẻ chủ đề gọn: icon + tên + số bài + nút Luyện. */
function CompactCategoryCard({ category, onStart }: BubbleProps) {
  const n = category.exercises.length;
  const empty = n === 0;
  return (
    <Card className="pc-cat pc-cat-compact" interactive={!empty}>
      <div className="pc-cat-top">
        <span className="pc-cat-icon" aria-hidden>
          {category.icon}
        </span>
        <div className="pc-cat-heads">
          <h2 className="pc-cat-title">{category.title}</h2>
        </div>
      </div>
      <div className="pc-cat-foot">
        {empty ? (
          <span className="pc-empty">{category.emptyHint}</span>
        ) : (
          <span className="pc-count">
            <b>{n}</b> bài khả dụng
          </span>
        )}
        {empty ? <Badge tone="muted">Trống</Badge> : <Button onClick={onStart}>Luyện →</Button>}
      </div>
    </Card>
  );
}
