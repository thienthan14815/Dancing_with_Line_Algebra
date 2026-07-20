import { useMemo, useState } from 'react';
import { useLearnStore } from '../../core/progress/store';
import { Button, Card, Badge } from '../ui';
import {
  buildCategories,
  skillLabel,
  type PracticeCategory,
} from './categories';
import PracticeSession from './PracticeSession';
import './practice.css';

/** Số chip skill tối đa hiển thị trên mỗi thẻ danh mục. */
const MAX_CHIPS = 3;

/**
 * TRUNG TÂM LUYỆN TẬP — trang chính (route `#/luyen`).
 *
 * Hiển thị 6 thẻ danh mục ôn tập cá nhân hoá (lỗi sai, kỹ năng yếu, spaced
 * repetition, ma trận, trực quan, trộn chủ đề). Bấm "Luyện" ở một thẻ sẽ mở
 * PracticeSession ngay tại chỗ; thoát/kết phiên quay lại lưới danh mục.
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

  if (active) {
    return (
      <div className="pc-page">
        <PracticeSession
          key={active.id}
          category={active}
          onExit={() => setActive(null)}
        />
      </div>
    );
  }

  const count = (id: PracticeCategory['id']) =>
    categories.find((c) => c.id === id)?.exercises.length ?? 0;

  return (
    <div className="pc-page">
      <header className="pc-hero">
        <div className="pc-hero-main">
          <span className="pc-hero-kicker">Ôn tập cá nhân hoá</span>
          <h1 className="pc-hero-title">Trung tâm luyện tập</h1>
          <p className="pc-hero-sub">
            Ôn đúng thứ bạn cần: sửa lỗi sai, gia cố kỹ năng yếu và nhắc lại
            đúng lúc trước khi quên.
          </p>
        </div>
        <div className="pc-hero-stats">
          <div className="pc-stat">
            <span className="pc-stat-val">{count('mistakes')}</span>
            <span className="pc-stat-lbl">Lỗi cần ôn</span>
          </div>
          <div className="pc-stat">
            <span className="pc-stat-val">{count('weak')}</span>
            <span className="pc-stat-lbl">Kỹ năng yếu</span>
          </div>
          <div className="pc-stat">
            <span className="pc-stat-val">{count('due')}</span>
            <span className="pc-stat-lbl">Sắp quên</span>
          </div>
        </div>
      </header>

      <div className="pc-grid">
        {categories.map((cat) => (
          <CategoryCard key={cat.id} category={cat} onStart={() => setActive(cat)} />
        ))}
      </div>
    </div>
  );
}

interface CategoryCardProps {
  category: PracticeCategory;
  onStart: () => void;
}

function CategoryCard({ category, onStart }: CategoryCardProps) {
  const n = category.exercises.length;
  const empty = n === 0;
  const chips = category.skillIds.slice(0, MAX_CHIPS);
  const moreChips = category.skillIds.length - chips.length;

  return (
    <Card className="pc-cat" interactive={!empty}>
      <div className="pc-cat-top">
        <span className="pc-cat-icon" aria-hidden>
          {category.icon}
        </span>
        <div className="pc-cat-heads">
          <h2 className="pc-cat-title">{category.title}</h2>
          <p className="pc-cat-sub">{category.subtitle}</p>
        </div>
      </div>

      {!empty && chips.length > 0 && (
        <div className="pc-cat-chips">
          {chips.map((sid) => (
            <span key={sid} className="pc-chip" title={skillLabel(sid)}>
              {skillLabel(sid)}
            </span>
          ))}
          {moreChips > 0 && <span className="pc-chip">+{moreChips}</span>}
        </div>
      )}

      <div className="pc-cat-foot">
        {empty ? (
          <span className="pc-empty">{category.emptyHint}</span>
        ) : (
          <span className="pc-count">
            <b>{n}</b> bài khả dụng
          </span>
        )}
        {empty ? (
          <Badge tone="muted">Trống</Badge>
        ) : (
          <Button onClick={onStart}>Luyện →</Button>
        )}
      </div>
    </Card>
  );
}
