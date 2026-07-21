import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, CornerDownLeft } from 'lucide-react';
import {
  getSearchIndex,
  pageItems,
  search,
  highlight,
  GROUP_ORDER,
  GROUP_LABEL,
  type SearchGroup,
  type SearchItem,
} from './index';
import './search.css';

export interface SearchPaletteProps {
  onClose: () => void;
}

interface RenderGroup {
  group: SearchGroup;
  items: SearchItem[];
}

/**
 * SearchPalette — overlay ⌘/Ctrl+K toàn cục.
 * Mount trong TopBar (đã ở trong HashRouter) để dùng useNavigate.
 */
export default function SearchPalette({ onClose }: SearchPaletteProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Dựng index lazy lần đầu mở.
  const index = useMemo(() => getSearchIndex(), []);

  const results = useMemo<SearchItem[]>(() => {
    if (!query.trim()) return pageItems();
    return search(index, query, 8);
  }, [index, query]);

  // Nhóm theo loại, giữ thứ tự GROUP_ORDER; flat = thứ tự hiển thị để ↑↓.
  const { groups, flat } = useMemo(() => {
    const map = new Map<SearchGroup, SearchItem[]>();
    for (const it of results) {
      const arr = map.get(it.group);
      if (arr) arr.push(it);
      else map.set(it.group, [it]);
    }
    const gs: RenderGroup[] = GROUP_ORDER.filter((g) => map.has(g)).map((g) => ({
      group: g,
      items: map.get(g)!,
    }));
    return { groups: gs, flat: gs.flatMap((s) => s.items) };
  }, [results]);

  const flatIndex = useMemo(() => {
    const m = new Map<SearchItem, number>();
    flat.forEach((it, i) => m.set(it, i));
    return m;
  }, [flat]);

  // Reset lựa chọn khi truy vấn đổi.
  useEffect(() => {
    setActive(0);
  }, [query]);

  // Autofocus + khoá cuộn nền khi mở.
  useEffect(() => {
    inputRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Cuộn item đang chọn vào tầm nhìn.
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>('[data-active="true"]');
    el?.scrollIntoView({ block: 'nearest' });
  }, [active, results]);

  function go(item: SearchItem | undefined) {
    if (!item) return;
    onClose();
    navigate(item.route);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    const n = flat.length;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (n) setActive((i) => (i + 1) % n);
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (n) setActive((i) => (i - 1 + n) % n);
        break;
      case 'Enter':
        e.preventDefault();
        go(flat[active]);
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
      case 'Tab':
        // Focus trap đơn giản: giữ tiêu điểm trong ô nhập.
        e.preventDefault();
        inputRef.current?.focus();
        break;
      default:
        break;
    }
  }

  const activeClamped = flat.length ? Math.min(active, flat.length - 1) : 0;
  const activeId = flat.length ? `sp-opt-${activeClamped}` : undefined;

  return (
    <div
      className="sp-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="sp-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Tìm kiếm"
        onKeyDown={onKeyDown}
      >
        <div className="sp-search">
          <Search className="sp-search-icon" size={18} strokeWidth={2} aria-hidden="true" />
          <input
            ref={inputRef}
            className="sp-input"
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls="sp-listbox"
            aria-activedescendant={activeId}
            aria-autocomplete="list"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            placeholder="Tìm bài học, ký hiệu, trang…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="sp-results" id="sp-listbox" role="listbox" ref={listRef}>
          {flat.length === 0 ? (
            <div className="sp-empty">Không tìm thấy kết quả cho “{query}”.</div>
          ) : (
            groups.map((g) => (
              <div className="sp-group" key={g.group} role="presentation">
                <div className="sp-group-label">{GROUP_LABEL[g.group]}</div>
                {g.items.map((it) => {
                  const idx = flatIndex.get(it)!;
                  const isActive = idx === activeClamped;
                  const Icon = it.icon;
                  const [before, match, after] = highlight(it.title, query);
                  return (
                    <button
                      type="button"
                      key={it.key}
                      id={`sp-opt-${idx}`}
                      role="option"
                      aria-selected={isActive}
                      data-active={isActive}
                      className={`sp-option${isActive ? ' active' : ''}`}
                      onMouseMove={() => setActive(idx)}
                      onClick={() => go(it)}
                    >
                      <span className="sp-option-icon" aria-hidden="true">
                        <Icon size={17} strokeWidth={1.75} />
                      </span>
                      <span className="sp-option-body">
                        <span className="sp-option-title">
                          {match ? (
                            <>
                              {before}
                              <mark>{match}</mark>
                              {after}
                            </>
                          ) : (
                            it.title
                          )}
                        </span>
                        {it.subtitle && <span className="sp-option-sub">{it.subtitle}</span>}
                      </span>
                      {isActive && (
                        <CornerDownLeft
                          className="sp-option-enter"
                          size={15}
                          strokeWidth={2}
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        <div className="sp-foot">
          <span className="sp-foot-hint">
            <kbd className="sp-kbd">↑</kbd>
            <kbd className="sp-kbd">↓</kbd>
            <span>để chọn</span>
          </span>
          <span className="sp-foot-hint">
            <kbd className="sp-kbd">↵</kbd>
            <span>để mở</span>
          </span>
          <span className="sp-foot-hint">
            <kbd className="sp-kbd">esc</kbd>
            <span>để đóng</span>
          </span>
        </div>
      </div>
    </div>
  );
}
