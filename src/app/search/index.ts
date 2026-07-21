import {
  BookOpen,
  GraduationCap,
  Sigma,
  PencilLine,
  Sparkles,
  ChartLine,
  CircleUser,
  Settings,
  Notebook,
  Map as MapIcon,
} from 'lucide-react';
import { COURSE } from '../../core/content/course';
import { flatLessons } from '../../chapters/registry';
import { SYMBOLS, CATEGORIES } from '../../wiki/symbols';

// ---------------------------------------------------------------------------
// SEARCH INDEX — client-side, dựng LAZY lần đầu mở palette (getSearchIndex()).
// Nguồn: micro-lessons (course.ts) · bài chương cổ điển (registry.ts) ·
// ký hiệu wiki (symbols.ts, CHỈ đọc) · trang & hành động.
// Không thêm route: chỉ ánh xạ sang các route đã có.
// ---------------------------------------------------------------------------

/** Kiểu component icon của lucide-react (mọi icon dùng chung một type). */
export type IconCmp = typeof BookOpen;

export type SearchGroup = 'lesson' | 'chapter' | 'symbol' | 'page';

export interface SearchItem {
  /** Key React + định danh option (duy nhất). */
  key: string;
  group: SearchGroup;
  title: string;
  subtitle?: string;
  /** Đường dẫn react-router (không kèm '#'). */
  route: string;
  icon: IconCmp;
  /** Chuỗi tra cứu đã chuẩn hoá (bỏ dấu, thường hoá). */
  haystack: string;
}

export const GROUP_ORDER: SearchGroup[] = ['lesson', 'chapter', 'symbol', 'page'];

export const GROUP_LABEL: Record<SearchGroup, string> = {
  lesson: 'Bài học',
  chapter: 'Bài chương',
  symbol: 'Ký hiệu',
  page: 'Trang',
};

// --- Chuẩn hoá tiếng Việt: bỏ dấu, thường hoá, gộp khoảng trắng ------------

const COMBINING = /[̀-ͯ]/g; // dấu tổ hợp sau khi NFD

/** Chuẩn hoá 1 ký tự: thường hoá + tách dấu (NFD) + bỏ dấu tổ hợp + đ→d. */
function normChar(c: string): string {
  return c.toLowerCase().normalize('NFD').replace(COMBINING, '').replace(/đ/g, 'd');
}

/** Bỏ dấu tiếng Việt + thường hoá + gộp khoảng trắng. */
export function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(COMBINING, '')
    .replace(/đ/g, 'd') // đ
    .replace(/\s+/g, ' ')
    .trim();
}

// --- Trang & hành động ------------------------------------------------------

interface PageSeed {
  key: string;
  title: string;
  subtitle: string;
  route: string;
  icon: IconCmp;
  /** Từ khoá phụ (đã bỏ dấu) để bắt truy vấn tiếng Anh/không dấu. */
  keywords: string;
}

const PAGES: PageSeed[] = [
  { key: 'page:luyen', title: 'Luyện tập', subtitle: 'Bài tập & thẻ ghi nhớ', route: '/luyen', icon: PencilLine, keywords: 'practice luyen tap flashcard the ghi nho on tap loi sai' },
  { key: 'page:tutor', title: 'Gia sư AI', subtitle: 'Hỏi đáp & giảng giải', route: '/tutor', icon: Sparkles, keywords: 'tutor ai gia su tro giang hoi dap' },
  { key: 'page:tien-do', title: 'Tiến độ', subtitle: 'Thống kê học tập', route: '/tien-do', icon: ChartLine, keywords: 'progress tien do dashboard thong ke xp streak' },
  { key: 'page:ho-so', title: 'Hồ sơ', subtitle: 'Thành tích & huy hiệu', route: '/ho-so', icon: CircleUser, keywords: 'profile ho so thanh tich huy hieu badge' },
  { key: 'page:cai-dat', title: 'Cài đặt', subtitle: 'Tùy chọn ứng dụng', route: '/cai-dat', icon: Settings, keywords: 'settings cai dat tuy chon giao dien' },
  { key: 'page:so-tay', title: 'Sổ tay', subtitle: 'Cẩm nang tra cứu', route: '/so-tay', icon: Notebook, keywords: 'guidebook so tay cam nang tra cuu handbook' },
  { key: 'page:lo-trinh', title: 'Lộ trình', subtitle: 'Bản đồ học tập', route: '/lo-trinh', icon: MapIcon, keywords: 'roadmap lo trinh ban do learning path' },
];

// --- Builder ----------------------------------------------------------------

function buildIndex(): SearchItem[] {
  const items: SearchItem[] = [];

  // (a) micro-lessons → /learn/<id>
  for (const section of COURSE.sections) {
    for (const unit of section.units) {
      for (const lesson of unit.lessons) {
        items.push({
          key: `lesson:${lesson.id}`,
          group: 'lesson',
          title: lesson.title,
          subtitle: section.title,
          route: `/learn/${lesson.id}`,
          icon: BookOpen,
          haystack: normalize(`${lesson.title} ${section.title} ${section.en ?? ''}`),
        });
      }
    }
  }

  // (b) bài chương cổ điển → /ch/<ch>/<lesson>
  for (const fl of flatLessons) {
    items.push({
      key: `chapter:${fl.chapterId}:${fl.lessonId}`,
      group: 'chapter',
      title: fl.lessonTitle,
      subtitle: fl.chapterTitle,
      route: `/ch/${fl.chapterId}/${fl.lessonId}`,
      icon: GraduationCap,
      haystack: normalize(`${fl.lessonTitle} ${fl.chapterTitle}`),
    });
  }

  // (c) ký hiệu wiki → /wiki
  const catLabel = new Map(CATEGORIES.map((c) => [c.id, c.label]));
  for (const s of SYMBOLS) {
    items.push({
      key: `symbol:${s.tex}:${s.en}`,
      group: 'symbol',
      title: s.name,
      subtitle: s.en,
      route: '/wiki',
      icon: Sigma,
      haystack: normalize(
        `${s.name} ${s.en} ${s.tex} ${s.meaning} ${catLabel.get(s.category) ?? ''}`,
      ),
    });
  }

  // (d) trang & hành động
  for (const p of PAGES) {
    items.push({
      key: p.key,
      group: 'page',
      title: p.title,
      subtitle: p.subtitle,
      route: p.route,
      icon: p.icon,
      haystack: normalize(`${p.title} ${p.subtitle} ${p.keywords}`),
    });
  }

  return items;
}

let _index: SearchItem[] | null = null;

/** Lấy index (dựng 1 lần, cache module-level → lần mở sau tức thì). */
export function getSearchIndex(): SearchItem[] {
  if (!_index) _index = buildIndex();
  return _index;
}

/** Toàn bộ trang & hành động — dùng làm gợi ý khi ô tìm kiếm còn trống. */
export function pageItems(): SearchItem[] {
  return getSearchIndex().filter((it) => it.group === 'page');
}

// --- Tìm kiếm ---------------------------------------------------------------

/**
 * Fuzzy đơn giản = includes trên chuỗi đã bỏ dấu, AND theo từng token.
 * Xếp hạng: khớp đầu tiêu đề > chứa trong tiêu đề > vị trí khớp sớm.
 */
export function search(index: SearchItem[], rawQuery: string, limit = 8): SearchItem[] {
  const q = normalize(rawQuery);
  if (!q) return [];
  const tokens = q.split(' ').filter(Boolean);
  const scored: { item: SearchItem; score: number }[] = [];

  for (const item of index) {
    let ok = true;
    let score = 0;
    for (const t of tokens) {
      const at = item.haystack.indexOf(t);
      if (at === -1) {
        ok = false;
        break;
      }
      score += at; // khớp càng sớm càng tốt
    }
    if (!ok) continue;

    const titleN = normalize(item.title);
    if (titleN.startsWith(q)) score -= 1000;
    else if (titleN.includes(q)) score -= 200;

    scored.push({ item, score });
  }

  scored.sort((a, b) => a.score - b.score || a.item.title.length - b.item.title.length);
  return scored.slice(0, limit).map((s) => s.item);
}

/**
 * Cắt tiêu đề thành [trước, khớp, sau] để bôi đậm phần khớp đầu tiên.
 * Ánh xạ chỉ số qua chuỗi đã bỏ dấu về tiêu đề gốc (an toàn với dấu tiếng Việt).
 * Không khớp gọn → match rỗng, không bôi đậm.
 */
export function highlight(title: string, rawQuery: string): [string, string, string] {
  const q = normalize(rawQuery).split(' ').filter(Boolean)[0];
  if (!q) return [title, '', ''];

  let norm = '';
  const map: number[] = [];
  for (let i = 0; i < title.length; i++) {
    const nc = normChar(title[i]);
    for (const ch of nc) {
      norm += ch;
      map.push(i);
    }
  }

  const at = norm.indexOf(q);
  if (at === -1) return [title, '', ''];
  const start = map[at];
  const end = map[at + q.length - 1] + 1;
  return [title.slice(0, start), title.slice(start, end), title.slice(end)];
}
