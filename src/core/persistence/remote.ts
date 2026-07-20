import type { PersistenceAdapter } from './adapter';

/**
 * ============================================================================
 *  RemoteAdapter — REAL REST client for a pluggable backend.
 * ============================================================================
 *
 * This adapter makes NO network calls until it is pointed at a running,
 * *compatible* REST API via `baseUrl` (+ optional bearer `token`). The
 * repository ships without a backend on purpose: if you stand up an API that
 * honours the contract below, this file works as-is; if you don't, the app
 * keeps running fully locally (see {@link ./localStorage}).
 *
 * ---------------------------------------------------------------------------
 *  ENDPOINT CONTRACT (you implement the server; a Supabase Edge Function,
 *  Cloudflare Worker, Express app, … all map 1:1). All paths are relative to
 *  `baseUrl`; every request carries `Authorization: Bearer {token}` when a
 *  token is configured, and JSON bodies use `Content-Type: application/json`.
 *
 *   Health
 *     GET    /ping                          -> 200 (any body)      // liveness
 *
 *   Documents  (key/value — getDoc / setDoc)
 *     GET    /doc/{key}                      -> 200 { "value": T }  // found
 *                                            -> 404                 // absent -> null
 *     PUT    /doc/{key}      body: { "value": T }   -> 2xx
 *
 *   Collections  (rows keyed by `id` — list / put / remove)
 *     GET    /col/{collection}               -> 200 T[]             // [] when absent
 *     PUT    /col/{collection}/{id}   body: T       -> 2xx          // upsert by id
 *     DELETE /col/{collection}/{id}          -> 2xx | 404
 *
 *   Maintenance
 *     DELETE /all                            -> 2xx                 // wipe this user's data
 *
 *  The server is expected to scope every operation to the authenticated user
 *  (derived from the bearer token) — `{key}`/`{collection}` are namespaced per
 *  user server-side, so no user id travels in the path.
 *
 * ---------------------------------------------------------------------------
 *  SYNC-vs-ASYNC LIMITATION (important):
 *
 *  {@link PersistenceAdapter} is a *synchronous* interface (`getDoc` returns
 *  `T | null`, not a Promise) because the localStorage adapter is synchronous.
 *  REST is inherently asynchronous, so this class does NOT try to fake sync
 *  network I/O. Instead:
 *
 *    • The interface methods (`getDoc`, `list`, …) read/write an in-memory
 *      CACHE. Reads are only meaningful AFTER {@link RemoteAdapter.hydrate}
 *      (or an explicit `*Async` fetch) has populated that cache. Writes update
 *      the cache immediately and fire the network request in the background
 *      (fire-and-forget, errors swallowed so the app never crashes).
 *    • The real work is exposed as async siblings — {@link getDocAsync},
 *      {@link setDocAsync}, {@link listAsync}, {@link putAsync},
 *      {@link removeAsync}, {@link clearAllAsync}, plus {@link ping} and
 *      {@link hydrate}. Callers that need confirmation / errors (e.g. the
 *      SyncService) MUST use these and `await` them.
 *
 *  Every network call is guarded by a timeout (AbortController) and try/catch.
 *  The async methods throw a typed {@link RemoteError} on failure so callers
 *  can report it; the synchronous interface methods never throw.
 */

/** Constructor options for {@link RemoteAdapter}. */
export interface RemoteConfig {
  /** Base URL of the REST API, e.g. `https://linalglab.example.dev`. */
  baseUrl: string;
  /** Bearer token / anon key sent as `Authorization: Bearer {token}`. */
  token?: string;
  /** Injectable `fetch` (tests / non-browser). Defaults to `globalThis.fetch`. */
  fetchImpl?: typeof fetch;
  /** Per-request timeout in milliseconds (default 10000). */
  timeoutMs?: number;
}

/** Result of a {@link RemoteAdapter.ping} health probe (never throws). */
export interface PingResult {
  ok: boolean;
  status: number;
  /** Round-trip time in milliseconds. */
  ms: number;
  error?: string;
}

/** Error thrown by the async methods on network / timeout / non-2xx failure. */
export class RemoteError extends Error {
  /** HTTP status when available, else 0 (network/timeout). */
  readonly status: number;
  constructor(message: string, status = 0) {
    super(message);
    this.name = 'RemoteError';
    this.status = status;
  }
}

/** The subset of `globalThis` we read `fetch` off of, typed safely. */
interface FetchGlobal {
  fetch?: typeof fetch;
}

export class RemoteAdapter implements PersistenceAdapter {
  private readonly baseUrl: string;
  private readonly token?: string;
  private readonly fetchImpl?: typeof fetch;
  private readonly timeoutMs: number;

  /** Hydrated snapshot backing the synchronous {@link getDoc}/{@link list}. */
  private readonly docCache = new Map<string, unknown>();
  private readonly colCache = new Map<string, unknown[]>();

  constructor(config: RemoteConfig) {
    // Normalise: strip trailing slashes so `${baseUrl}/doc/x` never doubles up.
    this.baseUrl = config.baseUrl.replace(/\/+$/, '');
    this.token = config.token;
    const g = globalThis as unknown as FetchGlobal;
    this.fetchImpl = config.fetchImpl ?? (g.fetch ? g.fetch.bind(globalThis) : undefined);
    this.timeoutMs = config.timeoutMs ?? 10000;
  }

  // ---------------------------------------------------------------------------
  //  Low-level request plumbing
  // ---------------------------------------------------------------------------

  private url(path: string): string {
    return `${this.baseUrl}${path}`;
  }

  private headers(hasBody: boolean): Record<string, string> {
    const h: Record<string, string> = { Accept: 'application/json' };
    if (hasBody) h['Content-Type'] = 'application/json';
    if (this.token) h['Authorization'] = `Bearer ${this.token}`;
    return h;
  }

  /** fetch + timeout. Throws {@link RemoteError} on network error / timeout. */
  private async request(path: string, init: RequestInit): Promise<Response> {
    const fetchImpl = this.fetchImpl;
    if (!fetchImpl) {
      throw new RemoteError('fetch không khả dụng trong môi trường này');
    }
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      return await fetchImpl(this.url(path), { ...init, signal: controller.signal });
    } catch (e) {
      const aborted = (e as { name?: string }).name === 'AbortError';
      const msg = aborted
        ? `Hết thời gian chờ (${this.timeoutMs}ms) khi gọi ${path}`
        : `Lỗi mạng khi gọi ${path}: ${(e as Error).message ?? String(e)}`;
      throw new RemoteError(msg);
    } finally {
      clearTimeout(timer);
    }
  }

  private static seg(s: string): string {
    return encodeURIComponent(s);
  }

  // ---------------------------------------------------------------------------
  //  Async API — the REAL network methods (await these for confirmation/errors)
  // ---------------------------------------------------------------------------

  /** GET /doc/{key}. Returns `null` on 404. Updates the cache on success. */
  async getDocAsync<T>(key: string): Promise<T | null> {
    const res = await this.request(`/doc/${RemoteAdapter.seg(key)}`, {
      method: 'GET',
      headers: this.headers(false),
    });
    if (res.status === 404) {
      this.docCache.delete(key);
      return null;
    }
    if (!res.ok) throw new RemoteError(`GET /doc/${key} → HTTP ${res.status}`, res.status);
    const body = (await res.json()) as { value: T };
    this.docCache.set(key, body.value);
    return body.value;
  }

  /** PUT /doc/{key}. Updates the cache on success. */
  async setDocAsync<T>(key: string, value: T): Promise<void> {
    const res = await this.request(`/doc/${RemoteAdapter.seg(key)}`, {
      method: 'PUT',
      headers: this.headers(true),
      body: JSON.stringify({ value }),
    });
    if (!res.ok) throw new RemoteError(`PUT /doc/${key} → HTTP ${res.status}`, res.status);
    this.docCache.set(key, value);
  }

  /** GET /col/{collection}. Returns `[]` on 404. Updates the cache. */
  async listAsync<T>(collection: string): Promise<T[]> {
    const res = await this.request(`/col/${RemoteAdapter.seg(collection)}`, {
      method: 'GET',
      headers: this.headers(false),
    });
    if (res.status === 404) {
      this.colCache.set(collection, []);
      return [];
    }
    if (!res.ok) throw new RemoteError(`GET /col/${collection} → HTTP ${res.status}`, res.status);
    const arr = (await res.json()) as unknown;
    const safe = Array.isArray(arr) ? (arr as T[]) : [];
    this.colCache.set(collection, safe);
    return safe;
  }

  /** PUT /col/{collection}/{id} (upsert by id). Updates the cache. */
  async putAsync<T extends { id: string }>(collection: string, value: T): Promise<void> {
    const res = await this.request(
      `/col/${RemoteAdapter.seg(collection)}/${RemoteAdapter.seg(value.id)}`,
      { method: 'PUT', headers: this.headers(true), body: JSON.stringify(value) },
    );
    if (!res.ok) {
      throw new RemoteError(`PUT /col/${collection}/${value.id} → HTTP ${res.status}`, res.status);
    }
    this.upsertCache(collection, value);
  }

  /** DELETE /col/{collection}/{id}. 404 is treated as already-gone. */
  async removeAsync(collection: string, id: string): Promise<void> {
    const res = await this.request(
      `/col/${RemoteAdapter.seg(collection)}/${RemoteAdapter.seg(id)}`,
      { method: 'DELETE', headers: this.headers(false) },
    );
    if (!res.ok && res.status !== 404) {
      throw new RemoteError(`DELETE /col/${collection}/${id} → HTTP ${res.status}`, res.status);
    }
    const arr = (this.colCache.get(collection) as { id: string }[] | undefined) ?? [];
    this.colCache.set(
      collection,
      arr.filter((x) => x.id !== id),
    );
  }

  /** DELETE /all. Wipes the server-side data for this user + clears the cache. */
  async clearAllAsync(): Promise<void> {
    const res = await this.request('/all', { method: 'DELETE', headers: this.headers(false) });
    if (!res.ok) throw new RemoteError(`DELETE /all → HTTP ${res.status}`, res.status);
    this.docCache.clear();
    this.colCache.clear();
  }

  /** GET /ping — liveness + latency probe. Never throws (returns `ok:false`). */
  async ping(): Promise<PingResult> {
    const start = Date.now();
    try {
      const res = await this.request('/ping', { method: 'GET', headers: this.headers(false) });
      return {
        ok: res.ok,
        status: res.status,
        ms: Date.now() - start,
        error: res.ok ? undefined : `HTTP ${res.status}`,
      };
    } catch (e) {
      return { ok: false, status: 0, ms: Date.now() - start, error: (e as Error).message };
    }
  }

  /**
   * Populate the in-memory cache that backs the synchronous interface methods.
   * Best-effort: a failure for one key/collection does not abort the others.
   */
  async hydrate(manifest: { docs: string[]; collections: string[] }): Promise<void> {
    await Promise.all([
      ...manifest.docs.map((k) => this.getDocAsync(k).catch(() => null)),
      ...manifest.collections.map((c) => this.listAsync(c).catch(() => [])),
    ]);
  }

  private upsertCache<T extends { id: string }>(collection: string, value: T): void {
    const arr = (this.colCache.get(collection) as T[] | undefined) ?? [];
    const idx = arr.findIndex((x) => x.id === value.id);
    if (idx >= 0) arr[idx] = value;
    else arr.push(value);
    this.colCache.set(collection, arr);
  }

  // ---------------------------------------------------------------------------
  //  PersistenceAdapter — SYNCHRONOUS interface (cache-backed, never throws).
  //  Reads reflect the last hydrate/fetch; writes update the cache now and push
  //  to the network in the background (errors swallowed).
  // ---------------------------------------------------------------------------

  getDoc<T>(key: string): T | null {
    return (this.docCache.get(key) as T | undefined) ?? null;
  }

  setDoc<T>(key: string, value: T): void {
    this.docCache.set(key, value);
    void this.setDocAsync(key, value).catch(() => {
      /* background write failed — cache keeps the value; SyncService can retry */
    });
  }

  list<T>(collection: string): T[] {
    return (this.colCache.get(collection) as T[] | undefined) ?? [];
  }

  put<T extends { id: string }>(collection: string, value: T): void {
    this.upsertCache(collection, value);
    void this.putAsync(collection, value).catch(() => {});
  }

  remove(collection: string, id: string): void {
    const arr = (this.colCache.get(collection) as { id: string }[] | undefined) ?? [];
    this.colCache.set(
      collection,
      arr.filter((x) => x.id !== id),
    );
    void this.removeAsync(collection, id).catch(() => {});
  }

  clearAll(): void {
    this.docCache.clear();
    this.colCache.clear();
    void this.clearAllAsync().catch(() => {});
  }
}
