import { createStore } from 'zustand/vanilla';
import { useStore } from 'zustand';
import { storage } from '../../core/persistence/localStorage';

/**
 * Pomodoro — bộ đếm phiên học (calm, không âm thanh, không Notification API).
 *
 * Kiến trúc: một store zustand **vanilla** (độc lập React) sở hữu luôn `interval`
 * và cả việc gắn/tháo tiền tố `document.title`. Nhờ vậy đồng hồ tiếp tục chạy kể
 * cả khi TopBar bị ẩn (focus-mode mobile) — component chỉ là lớp hiển thị.
 *
 * Chống lệch khi tab ngủ: khi chạy ta lưu **mốc thời gian đích** `endsAt`
 * (`Date.now() + remaining`); mỗi nhịp tick tính lại `endsAt - Date.now()` thay
 * vì trừ dần, nên ngủ/thức không tích luỹ sai số.
 *
 * Persist: CHỈ lưu số phút đang chọn vào localStorage key
 * `linalglab-v2:pomodoro-minutes` (qua `storage.setDoc('pomodoro-minutes')`).
 * Không persist trạng thái đếm ngược — mở lại app luôn bắt đầu từ `idle`.
 */

export type PomodoroStatus = 'idle' | 'running' | 'paused' | 'done';

/** Các mốc phút bấm nhanh. */
export const PRESETS = [25, 50] as const;
export type Preset = (typeof PRESETS)[number];

/** Còn ≤ 2 phút → vào vùng cảnh báo (đổi màu chip sang --warn). */
export const WARN_MS = 2 * 60_000;
/** Thông điệp nghỉ khi hết giờ. */
export const DONE_MESSAGE = 'Xong! Nghỉ 5 phút ☕';

const MINUTES_KEY = 'pomodoro-minutes';
const DEFAULT_MINUTES: Preset = 25;
/** Tiền tố gắn vào document.title khi hết giờ, cho tới khi người dùng bấm. */
const TITLE_PREFIX = '(Hết giờ) ';
/** Nhịp cập nhật hiển thị (ms). Đủ mượt cho mm:ss, rẻ về render. */
const TICK_MS = 250;

interface PomodoroData {
  /** Số phút đang chọn (đã persist). */
  minutes: number;
  status: PomodoroStatus;
  /** Số mili-giây còn lại (nguồn hiển thị; khi `running` được tick làm mới). */
  remainingMs: number;
  /** Mốc kết thúc tuyệt đối khi đang chạy; `null` nếu không chạy. */
  endsAt: number | null;
}

export interface PomodoroState extends PomodoroData {
  /** Chọn mốc phút mới → lưu localStorage và đưa đồng hồ về `idle` với thời lượng đó. */
  setMinutes: (m: number) => void;
  /** Bắt đầu / tiếp tục. Từ `done` sẽ chạy lại một phiên đầy đủ. */
  start: () => void;
  /** Tạm dừng, giữ nguyên thời gian còn lại. */
  pause: () => void;
  /** Về `idle` với thời lượng đầy đủ; gỡ tiền tố title. */
  reset: () => void;
  /** Ghi nhận người dùng đã thấy trạng thái "Xong": chỉ gỡ tiền tố title, giữ `done`. */
  acknowledge: () => void;
  /** Nhịp nội bộ (interval gọi). */
  tick: () => void;
}

/** Đọc số phút đã lưu; chỉ chấp nhận preset hợp lệ, còn lại → mặc định. */
function loadMinutes(): number {
  const saved = storage.getDoc<number>(MINUTES_KEY);
  if (typeof saved === 'number' && (PRESETS as readonly number[]).includes(saved)) {
    return saved;
  }
  return DEFAULT_MINUTES;
}

/** Gắn tiền tố "(Hết giờ) " một lần (idempotent). */
function addDoneTitle(): void {
  if (typeof document === 'undefined') return;
  if (!document.title.startsWith(TITLE_PREFIX)) {
    document.title = TITLE_PREFIX + document.title;
  }
}

/** Gỡ mọi tiền tố "(Hết giờ) " còn sót (idempotent). */
function clearDoneTitle(): void {
  if (typeof document === 'undefined') return;
  while (document.title.startsWith(TITLE_PREFIX)) {
    document.title = document.title.slice(TITLE_PREFIX.length);
  }
}

// Interval do store sở hữu (module-level) — độc lập vòng đời component.
let intervalId: ReturnType<typeof setInterval> | null = null;
function stopInterval(): void {
  if (intervalId != null) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

export const pomodoroStore = createStore<PomodoroState>()((set, get) => {
  function startInterval(): void {
    if (intervalId == null) {
      intervalId = setInterval(() => get().tick(), TICK_MS);
    }
  }

  const initialMinutes = loadMinutes();

  return {
    minutes: initialMinutes,
    status: 'idle',
    remainingMs: initialMinutes * 60_000,
    endsAt: null,

    setMinutes: (m) => {
      const minutes =
        (PRESETS as readonly number[]).includes(m) && m > 0 ? m : DEFAULT_MINUTES;
      storage.setDoc(MINUTES_KEY, minutes);
      stopInterval();
      clearDoneTitle();
      set({ minutes, status: 'idle', remainingMs: minutes * 60_000, endsAt: null });
    },

    start: () => {
      const st = get();
      if (st.status === 'running') return;
      // Từ `done` (hoặc đã cạn) → chạy lại một phiên đầy đủ.
      const remaining =
        st.status === 'done' || st.remainingMs <= 0 ? st.minutes * 60_000 : st.remainingMs;
      clearDoneTitle();
      set({ status: 'running', endsAt: Date.now() + remaining, remainingMs: remaining });
      startInterval();
    },

    pause: () => {
      const st = get();
      if (st.status !== 'running' || st.endsAt == null) return;
      const remainingMs = Math.max(0, st.endsAt - Date.now());
      stopInterval();
      set({ status: 'paused', endsAt: null, remainingMs });
    },

    reset: () => {
      const st = get();
      stopInterval();
      clearDoneTitle();
      set({ status: 'idle', endsAt: null, remainingMs: st.minutes * 60_000 });
    },

    acknowledge: () => {
      clearDoneTitle();
    },

    tick: () => {
      const st = get();
      if (st.status !== 'running' || st.endsAt == null) return;
      const remainingMs = st.endsAt - Date.now();
      if (remainingMs <= 0) {
        stopInterval();
        addDoneTitle();
        set({ status: 'done', remainingMs: 0, endsAt: null });
      } else {
        set({ remainingMs });
      }
    },
  };
});

/** Hook React tiện dụng chọn lát cắt của store vanilla. */
export function usePomodoro<T>(selector: (s: PomodoroState) => T): T {
  return useStore(pomodoroStore, selector);
}

/** Định dạng mm:ss (làm tròn lên để hiện đủ ở giây đầu, chạm 0 đúng lúc hết). */
export function formatMs(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  return `${pad(m)}:${pad(s)}`;
}

/** Tỉ lệ đã trôi qua (0..1) để vẽ vòng progress. */
export function elapsedFraction(s: PomodoroData): number {
  const totalMs = s.minutes * 60_000;
  if (totalMs <= 0) return 0;
  if (s.status === 'done') return 1;
  const frac = 1 - s.remainingMs / totalMs;
  return Math.max(0, Math.min(1, frac));
}
