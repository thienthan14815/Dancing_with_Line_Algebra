import { Link } from 'react-router-dom';
import { useDeveloperMode } from '../../core/developerMode';
import './developer.css';

export default function DeveloperBanner() {
  const enabled = useDeveloperMode((state) => state.enabled);
  const setEnabled = useDeveloperMode((state) => state.setEnabled);
  if (!enabled) return null;
  return <aside className="developer-banner" aria-label="Developer mode đang bật">
    <span><strong>Developer mode</strong> · Xem tự do, không ghi tiến độ</span>
    <Link to="/developer">Tất cả bài học</Link>
    <button type="button" onClick={() => setEnabled(false)}>Tắt chế độ</button>
  </aside>;
}
