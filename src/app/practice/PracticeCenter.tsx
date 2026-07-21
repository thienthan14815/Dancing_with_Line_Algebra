import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layers, NotebookPen, TrendingDown, Clock } from 'lucide-react';
import { useLearnStore } from '../../core/progress/store';
import type { Exercise } from '../../core/exercises/types';
import { buildCategories, type PracticeCategory } from './categories';
import { buildDueFlashcards, buildMistakeEntries } from './flashcards';
import PracticeSession from './PracticeSession';
import FlashcardSession from './FlashcardSession';
import MistakeNotebook from './MistakeNotebook';
import './practice.css';

/** Tab nội dung — mỗi lúc chỉ hiện MỘT khối. */
type PracticeTab = 'smart' | 'cards' | 'topic';
const PRACTICE_TABS: { id: PracticeTab; label: string; icon?: ReactNode }[] = [
  { id: 'smart', label: 'Ôn thông minh' },
  { id: 'cards', label: 'Thẻ ghi nhớ', icon: <Layers size={16} /> },
  { id: 'topic', label: 'Theo chủ đề' },
];

/** Deep-link: ánh xạ query `?tab=` → tab. Không khớp / thiếu → tab đầu. */
const TAB_BY_PARAM: Record<string, PracticeTab> = {
  on: 'smart',
  the: 'cards',
  'chu-de': 'topic',
};

/** Màn hình con đang mở tại chỗ (thay cho trang danh mục). */
type ActiveView =
  | { kind: 'session'; category: PracticeCategory }
  | { kind: 'flashcards' }
  | { kind: 'notebook' };

/** Category tạm chỉ gồm một tập bài — dùng khi "Làm lại" từ Sổ lỗi. */
function redoCategory(exercises: Exercise[]): PracticeCategory {
  return {
    id: 'mistakes',
    title: 'Làm lại lỗi sai',
    subtitle: 'Luyện lại đúng những bài bạn từng trả lời sai.',
    icon: '🩹',
    skillIds: [...new Set(exercises.map((e) => e.skillId))],
    exercises,
    emptyHint: 'Không còn bài để làm lại.',
  };
}

/**
 * TRUNG TÂM LUYỆN TẬP — trang chính (route `#/luyen`).
 *
 * 3 tab: "Ôn thông minh" (3 thẻ hành động: Sổ lỗi sai → Sổ lỗi, Kỹ năng yếu →
 * phiên luyện, Bài sắp quên → Thẻ ghi nhớ); "Thẻ ghi nhớ" (ôn Anki các skill đến
 * hạn); "Theo chủ đề" (thẻ gọn). Mọi màn con mở tại chỗ; thoát quay lại.
 *
 * Deep-link: đọc `?tab=on|the|chu-de` MỘT LẦN lúc mount (đổi tab sau không đụng URL).
 */
export default function PracticeCenter() {
  const attempts = useLearnStore((s) => s.attempts);
  const masteryBySkill = useLearnStore((s) => s.masteryBySkill);
  const reviewItems = useLearnStore((s) => s.reviewItems);

  const categories = useMemo(
    () => buildCategories({ attempts, masteryBySkill, reviewItems }),
    [attempts, masteryBySkill, reviewItems],
  );
  const dueCards = useMemo(() => buildDueFlashcards(reviewItems), [reviewItems]);
  const mistakeEntries = useMemo(() => buildMistakeEntries(attempts), [attempts]);

  // Chỉ đọc query lúc mount: initializer của useState chạy đúng một lần.
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState<PracticeTab>(
    () => TAB_BY_PARAM[searchParams.get('tab') ?? ''] ?? 'smart',
  );

  const [active, setActive] = useState<ActiveView | null>(null);

  if (active) {
    let view: ReactNode;
    if (active.kind === 'flashcards') {
      view = <FlashcardSession cards={dueCards} onExit={() => setActive(null)} />;
    } else if (active.kind === 'notebook') {
      view = (
        <MistakeNotebook
          entries={mistakeEntries}
          onRedo={(ex) => setActive({ kind: 'session', category: redoCategory([ex]) })}
          onRedoAll={(exs) => setActive({ kind: 'session', category: redoCategory(exs) })}
          onExit={() => setActive(null)}
        />
      );
    } else {
      view = (
        <PracticeSession
          key={active.category.id}
          category={active.category}
          onExit={() => setActive(null)}
        />
      );
    }
    return <div className="la-page">{view}</div>;
  }

  // buildCategories luôn trả đúng thứ tự: [mistakes, weak, due, matrix, visual, mixed].
  const weakCat = categories[1];
  const dueCat = categories[2];
  const topic = categories.slice(3, 6);

  return (
    <div className="la-page">
      <header className="pc-head">
        <h1 className="pc-title">Luyện tập</h1>
        <p className="pc-caption">Ôn tập thông minh, ghi nhớ lâu và luyện theo từng chủ đề.</p>
      </header>

      <div className="la-chip-row pc-tabs" role="tablist" aria-label="Chế độ luyện">
        {PRACTICE_TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            className={`la-chip pc-tab-chip${tab === t.id ? ' active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'smart' && (
        <div className="pc-tab pc-smart" key="smart">
          <ActionCard
            icon={<NotebookPen size={20} />}
            tone="bad"
            title="Sổ lỗi sai"
            desc="Xem lại và làm lại những bài bạn từng trả lời sai."
            count={mistakeEntries.length}
            onStart={() => setActive({ kind: 'notebook' })}
          />
          <ActionCard
            icon={<TrendingDown size={20} />}
            tone="warn"
            title={weakCat.title}
            desc={weakCat.subtitle}
            count={weakCat.exercises.length}
            onStart={() => setActive({ kind: 'session', category: weakCat })}
          />
          <ActionCard
            icon={<Clock size={20} />}
            tone="review"
            title="Bài sắp quên"
            desc="Ôn đúng lúc theo lịch lặp lại ngắt quãng (spaced repetition)."
            count={dueCards.length}
            onStart={() => setActive({ kind: 'flashcards' })}
          />
        </div>
      )}

      {tab === 'cards' && (
        <div className="pc-tab" key="cards">
          <FlashcardEntry
            count={dueCards.length}
            onStart={() => setActive({ kind: 'flashcards' })}
            onQuiz={() => setActive({ kind: 'session', category: dueCat })}
          />
        </div>
      )}

      {tab === 'topic' && (
        <div className="pc-tab" key="topic">
          <div className="pc-grid">
            {topic.map((cat) => (
              <CompactCategoryCard
                key={cat.id}
                category={cat}
                onStart={() => setActive({ kind: 'session', category: cat })}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface ActionCardProps {
  icon: ReactNode;
  /** Màu nhấn semantic của icon tròn. */
  tone: 'bad' | 'warn' | 'review';
  title: string;
  desc: string;
  count: number;
  onStart: () => void;
}

/** Thẻ hành động "Ôn thông minh": icon semantic + số lượng + mô tả + nút Ôn ngay. */
function ActionCard({ icon, tone, title, desc, count, onStart }: ActionCardProps) {
  const empty = count === 0;
  return (
    <div className="la-card pc-act">
      <span className="pc-act-ico" data-tone={tone} aria-hidden>
        {icon}
      </span>
      <div className="pc-act-main">
        <div className="pc-act-head">
          <h2 className="pc-act-title">{title}</h2>
          <span className="la-badge">{count}</span>
        </div>
        <p className="pc-act-desc">{desc}</p>
      </div>
      <button
        type="button"
        className="la-btn la-btn-sm la-btn-primary pc-act-btn"
        disabled={empty}
        onClick={onStart}
      >
        Ôn ngay
      </button>
    </div>
  );
}

interface FlashcardEntryProps {
  count: number;
  onStart: () => void;
  onQuiz: () => void;
}

/** Thẻ mở đầu tab "Thẻ ghi nhớ": số thẻ đến hạn + bắt đầu ôn (kèm lối vào quiz cũ). */
function FlashcardEntry({ count, onStart, onQuiz }: FlashcardEntryProps) {
  const empty = count === 0;
  return (
    <div className="la-card-xl la-hero-grad fc-entry">
      <div className="fc-entry-icon" aria-hidden>
        <Layers size={26} />
      </div>
      <div className="fc-entry-body">
        <h2 className="fc-entry-title">Thẻ ghi nhớ</h2>
        <p className="fc-entry-sub">
          {empty ? (
            'Không có thẻ nào tới hạn ôn hôm nay — quay lại sau nhé!'
          ) : (
            <>
              <b>{count}</b> thẻ đến hạn hôm nay. Lật thẻ, tự nhớ đáp án rồi tự chấm.
            </>
          )}
        </p>
        <div className="fc-entry-actions">
          <button
            type="button"
            className="la-btn la-btn-primary"
            onClick={onStart}
            disabled={empty}
          >
            Bắt đầu ôn thẻ →
          </button>
          {!empty && (
            <button type="button" className="la-btn la-btn-secondary" onClick={onQuiz}>
              Làm dạng quiz
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

interface CompactProps {
  category: PracticeCategory;
  onStart: () => void;
}

/** Thẻ chủ đề gọn: icon + tên + số bài + nút Luyện. */
function CompactCategoryCard({ category, onStart }: CompactProps) {
  const n = category.exercises.length;
  const empty = n === 0;
  return (
    <div className="la-card pc-cat pc-cat-compact">
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
        {empty ? (
          <span className="pc-cat-tag">Trống</span>
        ) : (
          <button type="button" className="la-btn la-btn-sm la-btn-primary" onClick={onStart}>
            Luyện →
          </button>
        )}
      </div>
    </div>
  );
}
