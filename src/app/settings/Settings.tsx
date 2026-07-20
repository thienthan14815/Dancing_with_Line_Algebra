import { useState } from 'react';
import { Button, Card, Badge } from '../ui';
import { syncService } from '../../core/persistence/sync';
import './settings.css';

type Tone = 'good' | 'bad' | 'muted';
interface Msg {
  tone: Tone;
  text: string;
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
  const cfg = syncService.getConfig();
  const [baseUrl, setBaseUrl] = useState(cfg?.baseUrl ?? '');
  const [token, setToken] = useState(cfg?.token ?? '');
  const [autoSync, setAutoSync] = useState(!!cfg?.autoSync);
  const [busy, setBusy] = useState<null | 'test' | 'push' | 'pull'>(null);
  const [msg, setMsg] = useState<Msg | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(cfg?.lastSyncedAt ?? null);

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
        <h1 className="st-title">Cài đặt · Đồng bộ backend</h1>
        <p className="dl-muted">
          Cắm một REST API tương thích để đồng bộ tiến độ giữa nhiều thiết bị.
        </p>
      </header>

      {/* Honest explainer */}
      <Card className="st-note">
        <div className="st-note-head">
          <span className="st-note-icon">ℹ️</span>
          <b>App chạy hoàn toàn cục bộ (localStorage)</b>
        </div>
        <p>
          Mặc định, mọi tiến độ được lưu ngay trên trình duyệt của bạn — không có máy chủ, không
          tài khoản, không gửi dữ liệu đi đâu cả. Ứng dụng này <b>không đi kèm backend</b>.
        </p>
        <p>
          Để đồng bộ nhiều thiết bị hoặc có tài khoản, bạn cần tự dựng <b>một backend REST tương
          thích</b> (theo hợp đồng endpoint bên dưới) + nơi lưu trữ (hosting) + token của riêng bạn.
          Có thể dùng Supabase Edge Functions, Cloudflare Workers, một app Express nhỏ… bất kỳ dịch
          vụ nào đáp ứng đúng các endpoint.
        </p>
        <p className="st-note-warn">
          Lưu ý: tính năng AI Tutor / Anthropic (nếu có) cần <b>API key riêng</b> của bạn và một
          proxy phía server — token đồng bộ ở đây <b>không</b> dùng cho việc đó.
        </p>
      </Card>

      {/* Config form */}
      <Card className="st-form">
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

      {/* Endpoint contract */}
      <Card className="st-contract">
        <h2 className="st-h2">Hợp đồng endpoint (tự dựng backend)</h2>
        <p className="dl-muted">
          RemoteAdapter gọi các đường dẫn sau (tương đối với Backend URL). Mọi request kèm header{' '}
          <code>Authorization: Bearer &lt;token&gt;</code>; body JSON dùng{' '}
          <code>Content-Type: application/json</code>. Server tự phân vùng dữ liệu theo người dùng
          suy ra từ token.
        </p>
        <div className="st-endpoints">
          {ENDPOINTS.map((ep) => (
            <div className="st-ep" key={`${ep.method} ${ep.path}`}>
              <span className={`st-verb st-verb-${ep.method.toLowerCase()}`}>{ep.method}</span>
              <code className="st-path">{ep.path}</code>
              <span className="st-ep-note dl-muted">{ep.note}</span>
            </div>
          ))}
        </div>
        <p className="st-fine dl-muted">
          Dữ liệu được đồng bộ: tài liệu <code>learn-state</code> và bộ sưu tập{' '}
          <code>xpTransactions</code>. Chiến lược hợp nhất mặc định là ghi đè theo hướng bạn chọn
          (Đẩy lên / Kéo về); khi bật Tự đồng bộ sẽ dùng last-write-wins theo mốc thời gian ISO nếu
          có, ưu tiên bản cục bộ khi hòa.
        </p>
      </Card>
    </div>
  );
}

function errText(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}
