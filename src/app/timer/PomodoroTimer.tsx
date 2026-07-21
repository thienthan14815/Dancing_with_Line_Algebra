import { useEffect, useId, useRef, useState } from 'react';
import { Timer } from 'lucide-react';
import {
  usePomodoro,
  pomodoroStore,
  WARN_MS,
  DONE_MESSAGE,
  formatMs,
} from './timerStore';
import PomodoroPopover from './PomodoroPopover';
import './timer.css';

/**
 * Điều khiển Pomodoro nhúng trong TopBar.
 *
 * - `idle`: nút biểu tượng đồng hồ.
 * - `running`/`paused`: chip đếm ngược `mm:ss` (nền --primary-soft; 2 phút cuối
 *   đổi sang --warn-soft).
 * - `done`: chip fade sang --good-soft kèm "Xong! Nghỉ 5 phút ☕".
 *
 * Mở popover: click → mở; Esc / click-ngoài → đóng. Mở khi đang `done` sẽ gỡ
 * tiền tố "(Hết giờ)" khỏi document.title (đây chính là "bấm" mà contract nói).
 */
export default function PomodoroTimer() {
  const status = usePomodoro((s) => s.status);
  const remainingMs = usePomodoro((s) => s.remainingMs);

  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const popId = useId();

  const running = status === 'running';
  const paused = status === 'paused';
  const done = status === 'done';
  const showChip = running || paused || done;
  const warn = (running || paused) && remainingMs <= WARN_MS;

  // Đóng bằng Esc + click ra ngoài.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        setOpen(false);
      }
    }
    function onDown(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    window.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDown);
    };
  }, [open]);

  // Tab thức dậy → tick ngay cho hiển thị khớp mốc đích (không đợi nhịp interval).
  useEffect(() => {
    function onVis() {
      if (document.visibilityState === 'visible') pomodoroStore.getState().tick();
    }
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  // An toàn: nếu control bị tháo (vd app teardown) mà đang treo tiền tố title → dọn.
  useEffect(() => {
    return () => {
      if (pomodoroStore.getState().status === 'done') pomodoroStore.getState().acknowledge();
    };
  }, []);

  function toggle() {
    setOpen((o) => {
      const next = !o;
      // Lần "bấm" đầu tiên khi đang done → gỡ tiền tố title.
      if (next && pomodoroStore.getState().status === 'done') {
        pomodoroStore.getState().acknowledge();
      }
      return next;
    });
  }

  const chipClass = `pm-chip${warn ? ' warn' : ''}${done ? ' done' : ''}`;
  const label = done ? DONE_MESSAGE : formatMs(remainingMs);

  return (
    <div className="pm-wrap" ref={wrapRef}>
      {showChip ? (
        <button
          type="button"
          className={chipClass}
          onClick={toggle}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={open ? popId : undefined}
          title={done ? DONE_MESSAGE : `Còn ${formatMs(remainingMs)}`}
        >
          {!done && <Timer size={15} strokeWidth={2} aria-hidden="true" />}
          <span className="pm-chip-text">{label}</span>
        </button>
      ) : (
        <button
          type="button"
          className="pm-trigger"
          onClick={toggle}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={open ? popId : undefined}
          aria-label="Hẹn giờ học"
          title="Hẹn giờ học (Pomodoro)"
        >
          <Timer size={16} strokeWidth={2} aria-hidden="true" />
        </button>
      )}

      {open && <PomodoroPopover id={popId} onClose={() => setOpen(false)} />}
    </div>
  );
}
