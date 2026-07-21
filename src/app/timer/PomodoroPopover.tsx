import { Play, Pause, RotateCcw } from 'lucide-react';
import { ProgressRing } from '../ui';
import {
  usePomodoro,
  pomodoroStore,
  PRESETS,
  WARN_MS,
  DONE_MESSAGE,
  formatMs,
  elapsedFraction,
} from './timerStore';

export interface PomodoroPopoverProps {
  /** Id để nút mở trỏ tới (aria). */
  id: string;
  onClose: () => void;
}

/**
 * Popover nhỏ dưới nút Timer: chọn preset 25'/50', các nút Bắt đầu / Tạm dừng /
 * Đặt lại, và vòng progress SVG khi đang chạy. Không tự quản đóng/mở — cha
 * ({@link PomodoroTimer}) lo Esc + click-ngoài.
 */
export default function PomodoroPopover({ id, onClose }: PomodoroPopoverProps) {
  const minutes = usePomodoro((s) => s.minutes);
  const status = usePomodoro((s) => s.status);
  const remainingMs = usePomodoro((s) => s.remainingMs);
  const frac = usePomodoro(elapsedFraction);

  const running = status === 'running';
  const done = status === 'done';
  const warn = (running || status === 'paused') && remainingMs <= WARN_MS;
  const ringColor = done ? 'var(--good)' : warn ? 'var(--warn)' : 'var(--primary)';

  const act = pomodoroStore.getState();

  return (
    <div className="pm-popover" role="dialog" aria-label="Hẹn giờ học" id={id}>
      <div className="pm-pop-head">
        <span className="pm-pop-title">Hẹn giờ học</span>
        <span className="pm-pop-status">
          {done
            ? DONE_MESSAGE
            : running
              ? 'Đang chạy'
              : status === 'paused'
                ? 'Tạm dừng'
                : 'Sẵn sàng'}
        </span>
      </div>

      <div className="pm-pop-ring">
        <ProgressRing
          progress={frac}
          size={132}
          stroke={8}
          color={ringColor}
          track="var(--panel-2)"
          label={
            <span className={`pm-pop-time${warn ? ' warn' : ''}${done ? ' done' : ''}`}>
              {formatMs(remainingMs)}
            </span>
          }
        />
      </div>

      <div className="pm-presets" role="group" aria-label="Chọn thời lượng">
        {PRESETS.map((p) => (
          <button
            key={p}
            type="button"
            className={`pm-preset${minutes === p ? ' active' : ''}`}
            aria-pressed={minutes === p}
            onClick={() => act.setMinutes(p)}
          >
            {p}&#39;
          </button>
        ))}
      </div>

      <div className="pm-controls">
        {running ? (
          <button type="button" className="pm-btn pm-btn-primary" onClick={() => act.pause()}>
            <Pause size={16} strokeWidth={2} aria-hidden="true" />
            Tạm dừng
          </button>
        ) : (
          <button type="button" className="pm-btn pm-btn-primary" onClick={() => act.start()}>
            <Play size={16} strokeWidth={2} aria-hidden="true" />
            {done ? 'Bắt đầu lại' : status === 'paused' ? 'Tiếp tục' : 'Bắt đầu'}
          </button>
        )}
        <button
          type="button"
          className="pm-btn pm-btn-ghost"
          onClick={() => act.reset()}
          disabled={status === 'idle'}
        >
          <RotateCcw size={16} strokeWidth={2} aria-hidden="true" />
          Đặt lại
        </button>
      </div>

      <p className="pm-pop-note">Không âm thanh — chỉ nhắc nhẹ khi hết giờ.</p>
      <button type="button" className="pm-pop-close" onClick={onClose} aria-label="Đóng">
        Đóng
      </button>
    </div>
  );
}
