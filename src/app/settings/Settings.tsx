import { useState } from 'react';
import { Button, Card, Badge } from '../ui';
import { syncService } from '../../core/persistence/sync';
import { Link } from 'react-router-dom';
import { useDeveloperMode } from '../../core/developerMode';
import './settings.css';

type Tone = 'good' | 'bad' | 'muted';
interface Msg {
  tone: Tone;
  text: string;
}

/** Chế độ giao diện. 'system' = theo thiết bị (không set data-theme). */
type ThemeMode = 'system' | 'light' | 'dark';

const THEME_KEY = 'linalglab-v2:theme';
const THEME_OPTIONS: { value: ThemeMode; label: string; icon: string }[] = [
  { value: 'system', label: 'Hệ thống', icon: '🖥️' },
  { value: 'light', label: 'Sáng', icon: '☀️' },
  { value: 'dark', label: 'Tối', icon: '🌙' },
];

/** Đọc chế độ đang lưu (khớp boot script trong main.tsx). */
function readTheme(): ThemeMode {
  const v = localStorage.getItem(THEME_KEY);
  return v === 'dark' || v === 'light' ? v : 'system';
}

/** The REST contract the RemoteAdapter speaks — shown so users can build one. */
const ENDPOINTS: { method: string; path: string; note: string }[] = [
  { method: 'GET', path: '/ping', note: 'Kiểm tra sống (liveness)' },
  { method: 'GET', path: '/doc/{key}', note: '→ { value } | 404' },
  { method: 'PUT', path: '/doc/{key}', note: 'body: { value }' },
  { method: 'GET', path: '/col/{collection}', note: '→ T[]' },
  { method: 'PUT', path: '/col/{collection}/{id}', note: 'body: T (upsert theo id)' },
  { method: 'DELETE', path: '/col/{collection}/{id}', note: 'xóa 1 dòng' },
  { method: 'DELETE', path: '/all', note: 'xóa toàn bộ dữ liệu của người dùng' },
];

export default function Settings() {
  const developerMode = useDeveloperMode((state) => state.enabled);
  const setDeveloperMode = useDeveloperMode((state) => state.setEnabled);
  const cfg = syncService.getConfig();
  const [baseUrl, setBaseUrl] = useState(cfg?.baseUrl ?? '');
  const [token, setToken] = useState(cfg?.token ?? '');
  const [autoSync, setAutoSync] = useState(!!cfg?.autoSync);
  const [busy, setBusy] = useState<null | 'test' | 'push' | 'pull'>(null);
  const [msg, setMsg] = useState<Msg | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(cfg?.lastSyncedAt ?? null);
  const [theme, setTheme] = useState<ThemeMode>(readTheme);
  /** Drill-in: 'home' = chỉ Giao diện + nút; 'backend' = phần đồng bộ. */
  const [view, setView] = useState<'home' | 'backend'>('home');
  /** Ẩn/hiện hợp đồng endpoint trong phần backend. */
  const [showContract, setShowContract] = useState(false);

  /** Áp chế độ giao diện: light/dark set data-theme + localStorage; system xoá cả hai. */
  const onTheme = (next: ThemeMode): void => {
    setTheme(next);
    if (next === 'system') {
      delete document.documentElement.dataset.theme;
      localStorage.removeItem(THEME_KEY);
    } else {
      document.documentElement.dataset.theme = next;
      localStorage.setItem(THEME_KEY, next);
    }
  };

  /** Persist URL + token to localStorage (device-local). */
  const persist = (): void => {
    syncService.configure({ baseUrl, token });
  };

  const refreshStatus = (): void => {
    setLastSyncedAt(syncService.status().lastSyncedAt);
  };

  const guardConfigured = (): boolean => {
    if (!baseUrl.trim()) {
      setMsg({ tone: 'bad', text: 'Hãy nhập Backend URL trước.' });
      return false;
    }
    return true;
  };

  const onSave = (): void => {
    persist();
    setMsg({ tone: baseUrl.trim() ? 'good' : 'muted', text: 'Đã lưu cấu hình vào máy này.' });
  };

  const onTest = async (): Promise<void> => {
    if (!guardConfigured()) return;
    persist();
    setBusy('test');
    setMsg({ tone: 'muted', text: 'Đang kiểm tra kết nối…' });
    try {
      const r = await syncService.ping();
      setMsg(
        r.ok
          ? { tone: 'good', text: `Kết nối OK · ${r.ms}ms (HTTP ${r.status}).` }
          : { tone: 'bad', text: `Không kết nối được: ${r.error ?? `HTTP ${r.status}`}.` },
      );
    } catch (e) {
      setMsg({ tone: 'bad', text: `Lỗi: ${errText(e)}` });
    } finally {
      setBusy(null);
    }
  };

  const onPush = async (): Promise<void> => {
    if (!guardConfigured()) return;
    persist();
    setBusy('push');
    setMsg({ tone: 'muted', text: 'Đang đẩy dữ liệu lên…' });
    try {
      const rep = await syncService.pushAll();
      setMsg({
        tone: 'good',
        text: `Đã đẩy ${rep.docs} tài liệu + ${rep.rows} dòng · ${rep.ms}ms.`,
      });
      refreshStatus();
    } catch (e) {
      setMsg({ tone: 'bad', text: `Đẩy thất bại: ${errText(e)}` });
    } finally {
      setBusy(null);
    }
  };

  const onPull = async (): Promise<void> => {
    if (!guardConfigured()) return;
    persist();
    if (!window.confirm('Kéo về sẽ GHI ĐÈ dữ liệu cục bộ bằng dữ liệu trên backend. Tiếp tục?')) {
      return;
    }
    setBusy('pull');
    setMsg({ tone: 'muted', text: 'Đang kéo dữ liệu về…' });
    try {
      const rep = await syncService.pullAll();
      setMsg({
        tone: 'good',
        text: `Đã kéo ${rep.docs} tài liệu + ${rep.rows} dòng · ${rep.ms}ms. Tải lại trang để áp dụng.`,
      });
      refreshStatus();
    } catch (e) {
      setMsg({ tone: 'bad', text: `Kéo về thất bại: ${errText(e)}` });
    } finally {
      setBusy(null);
    }
  };

  const onToggleAuto = (): void => {
    const next = !autoSync;
    setAutoSync(next);
    syncService.configure({ baseUrl, token, autoSync: next });
  };

  const anyBusy = busy != null;

  return (
    <div className="dl-page st-page">
      <header className="st-hero">
        <h1 className="st-title">Cài đặt</h1>
      </header>

      {view === 'home' ? (
        <div className="st-tab" key="home">
          {/* Chọn giao diện */}
          <Card className="st-theme">
            <div className="st-note-head">
              <span className="st-note-icon">🎨</span>
              <b>Giao diện</b>
            </div>
            <p className="st-hint">
              Chọn tông màu hiển thị. “Hệ thống” sẽ tự đổi theo cài đặt sáng/tối của thiết bị.
            </p>
            <div className="st-seg" role="radiogroup" aria-label="Giao diện">
              {THEME_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  role="radio"
                  aria-checked={theme === opt.value}
                  className={`st-seg-btn${theme === opt.value ? ' is-active' : ''}`}
                  onClick={() => onTheme(opt.value)}
                >
                  <span className="st-seg-icon" aria-hidden>
                    {opt.icon}
                  </span>
                  {opt.label}
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="st-h2">Developer mode</h2>
            <p className="st-hint">Mở mọi bài học để kiểm tra. Các lần thử không cộng XP hoặc ghi tiến độ. Cài đặt được lưu trên thiết bị này.</p>
            <label className="st-toggle">
              <input type="checkbox" role="switch" checked={developerMode} onChange={(event) => setDeveloperMode(event.target.checked)} />
              <span>Bật Developer mode</span>
            </label>
            {developerMode && <Link to="/developer">Mở danh sách toàn bộ bài học →</Link>}
          </Card>

          <Button variant="ghost" block onClick={() => setView('backend')}>
            🔌 Đồng bộ backend →
          </Button>
        </div>
      ) : (
        <div className="st-tab" key="backend">
          <button type="button" className="st-back" onClick={() => setView('home')}>
            ← Cài đặt
          </button>

          {/* Config form */}
          <Card className="st-form">
            <p className="st-hint">
              App chạy hoàn toàn cục bộ (localStorage) — không máy chủ, không tài khoản. Cắm một REST
              API tương thích của riêng bạn để đồng bộ tiến độ giữa nhiều thiết bị.
            </p>

            <label className="st-field">
          <span className="st-label">Backend URL</span>
          <input
            className="st-input"
            type="url"
            inputMode="url"
            placeholder="https://linalglab.example.dev"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            autoComplete="off"
            spellCheck={false}
          />
        </label>

        <label className="st-field">
          <span className="st-label">Token (Bearer)</span>
          <input
            className="st-input"
            type="password"
            placeholder="••••••••  (không hiển thị, chỉ lưu trên máy này)"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            autoComplete="off"
            spellCheck={false}
          />
          <span className="st-hint">
            Token chỉ được lưu trong localStorage của trình duyệt này và không bao giờ được đẩy lên
            backend.
          </span>
        </label>

        <label className="st-toggle">
          <input type="checkbox" checked={autoSync} onChange={onToggleAuto} />
          <span>
            Tự đồng bộ <span className="dl-muted">(hợp nhất last-write-wins sau mỗi thay đổi)</span>
          </span>
        </label>

        <div className="st-actions">
          <Button variant="primary" size="sm" onClick={onSave} disabled={anyBusy}>
            Lưu
          </Button>
          <Button variant="ghost" size="sm" onClick={onTest} disabled={anyBusy}>
            {busy === 'test' ? 'Đang kiểm tra…' : 'Kiểm tra kết nối'}
          </Button>
          <Button variant="good" size="sm" onClick={onPush} disabled={anyBusy}>
            {busy === 'push' ? 'Đang đẩy…' : 'Đẩy lên'}
          </Button>
          <Button variant="ghost" size="sm" onClick={onPull} disabled={anyBusy}>
            {busy === 'pull' ? 'Đang kéo…' : 'Kéo về'}
          </Button>
        </div>

        {msg && (
          <p className={`st-msg st-msg-${msg.tone}`} role="status">
            {msg.text}
          </p>
        )}

        <div className="st-status">
          <Badge tone={baseUrl.trim() ? 'good' : 'muted'}>
            {baseUrl.trim() ? 'Đã cấu hình' : 'Chưa cấu hình — chế độ cục bộ'}
          </Badge>
          {lastSyncedAt && (
            <span className="dl-muted">
              Đồng bộ gần nhất: {new Date(lastSyncedAt).toLocaleString()}
            </span>
          )}
        </div>
      </Card>

          {/* Endpoint contract — ẩn sau nút */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowContract((s) => !s)}
            aria-expanded={showContract}
          >
            {showContract ? 'Ẩn hợp đồng endpoint' : 'Xem hợp đồng endpoint'}
          </Button>

          {showContract && (
            <Card className="st-contract">
              <h2 className="st-h2">Hợp đồng endpoint (tự dựng backend)</h2>
              <p className="dl-muted">
                RemoteAdapter gọi các đường dẫn sau (tương đối với Backend URL). Mọi request kèm
                header <code>Authorization: Bearer &lt;token&gt;</code>; body JSON dùng{' '}
                <code>Content-Type: application/json</code>. Server tự phân vùng dữ liệu theo người
                dùng suy ra từ token.
              </p>
              <div className="st-endpoints">
                {ENDPOINTS.map((ep) => (
                  <div className="st-ep" key={`${ep.method} ${ep.path}`}>
                    <span className={`st-verb st-verb-${ep.method.toLowerCase()}`}>
                      {ep.method}
                    </span>
                    <code className="st-path">{ep.path}</code>
                    <span className="st-ep-note dl-muted">{ep.note}</span>
                  </div>
                ))}
              </div>
              <p className="st-fine dl-muted">
                Dữ liệu được đồng bộ: tài liệu <code>learn-state</code> và bộ sưu tập{' '}
                <code>xpTransactions</code>. Chiến lược hợp nhất mặc định là ghi đè theo hướng bạn
                chọn (Đẩy lên / Kéo về); khi bật Tự đồng bộ sẽ dùng last-write-wins theo mốc thời
                gian ISO nếu có, ưu tiên bản cục bộ khi hòa.
              </p>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

function errText(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}
