import type { PersistenceAdapter } from './adapter';
import { RemoteAdapter, type PingResult } from './remote';
import { storage } from './localStorage';

/**
 * ============================================================================
 *  SyncService — the layer between local (localStorage) and remote (REST).
 * ============================================================================
 *
 * The app is local-first: nothing here runs until the user configures a
 * backend on the Settings screen. Once configured, this service can copy the
 * learning data between the local {@link PersistenceAdapter} and a
 * {@link RemoteAdapter}.
 *
 *  MERGE STRATEGY — deliberately simple:
 *   • {@link SyncService.pushAll} / {@link SyncService.pullAll} are EXPLICIT,
 *     one-directional overwrites — the user picks the winning side. These back
 *     the "Đẩy lên" / "Kéo về" buttons.
 *   • {@link SyncService.sync} is a Last-Write-Wins merge used by auto-sync:
 *     for each document it compares an ISO timestamp (see {@link extractTs} —
 *     `updatedAt` / `createdAt` / … ) and keeps the newer copy on BOTH sides;
 *     ties and timestamp-less docs prefer the LOCAL copy (push). Collections
 *     are merged as a union-by-`id` (newer `createdAt` wins per row) — this is
 *     exactly right for the append-only `xpTransactions` ledger and never
 *     deletes rows.
 *
 *  The credential ("sync-config") lives ONLY in localStorage and is NEVER
 *  pushed to the backend (it is not part of the sync manifest).
 */

/** Persisted (device-local) backend configuration. */
export interface SyncConfig {
  baseUrl: string;
  token?: string;
  autoSync?: boolean;
  /** ISO timestamp of the last successful push/pull/sync. */
  lastSyncedAt?: string;
}

/** Which document keys / collection names participate in sync. */
export interface SyncManifest {
  /** Document keys (as used with `getDoc`/`setDoc`). */
  docs: string[];
  /** Collection names (as used with `list`/`put`/`remove`). */
  collections: string[];
}

/** Outcome of a completed transfer. */
export interface SyncReport {
  direction: 'push' | 'pull' | 'merge';
  /** Number of documents transferred. */
  docs: number;
  /** Number of collection rows transferred. */
  rows: number;
  /** Elapsed milliseconds. */
  ms: number;
}

/** A snapshot for the Settings UI. */
export interface SyncStatus {
  configured: boolean;
  baseUrl: string | null;
  autoSync: boolean;
  lastSyncedAt: string | null;
  lastResult: 'idle' | 'ok' | 'error';
  lastError?: string;
}

/** localStorage document key holding {@link SyncConfig}. Device-local only. */
export const CONFIG_KEY = 'sync-config';

/**
 * The app's known data shape. `learn-state` is the store snapshot
 * ({@link ../progress/store}) and `xpTransactions` is the append-only ledger.
 */
export const DEFAULT_MANIFEST: SyncManifest = {
  docs: ['learn-state'],
  collections: ['xpTransactions'],
};

/**
 * Extract a comparable timestamp (ms since epoch) from an arbitrary stored
 * value for Last-Write-Wins. Looks at the common ISO fields and falls back to
 * `profile.createdAt` (the shape of `learn-state`). Returns 0 when unknown, so
 * a timestamp-less value is treated as the oldest possible.
 */
export function extractTs(value: unknown): number {
  if (!value || typeof value !== 'object') return 0;
  const o = value as Record<string, unknown>;
  for (const field of ['updatedAt', 'createdAt', 'lastReviewedAt']) {
    const v = o[field];
    if (typeof v === 'string') {
      const t = Date.parse(v);
      if (!Number.isNaN(t)) return t;
    }
  }
  const profile = o['profile'];
  if (profile && typeof profile === 'object') {
    const c = (profile as Record<string, unknown>)['createdAt'];
    if (typeof c === 'string') {
      const t = Date.parse(c);
      if (!Number.isNaN(t)) return t;
    }
  }
  return 0;
}

export class SyncService {
  private remote: RemoteAdapter | null;
  private lastResult: 'idle' | 'ok' | 'error' = 'idle';
  private lastError?: string;

  /**
   * @param local    The localStorage-backed adapter (usually the `storage` singleton).
   * @param remote   Optional pre-built remote; if omitted it is built from the
   *                 stored {@link SyncConfig} (null until configured).
   * @param manifest Which docs/collections to sync (defaults to {@link DEFAULT_MANIFEST}).
   * @param fetchImpl Injectable `fetch` for tests.
   */
  constructor(
    private readonly local: PersistenceAdapter,
    remote?: RemoteAdapter | null,
    private readonly manifest: SyncManifest = DEFAULT_MANIFEST,
    private readonly fetchImpl?: typeof fetch,
  ) {
    this.remote = remote ?? this.buildRemote();
  }

  // ---------------------------------------------------------------------------
  //  Configuration
  // ---------------------------------------------------------------------------

  /** Read the stored config (or null). */
  getConfig(): SyncConfig | null {
    return this.local.getDoc<SyncConfig>(CONFIG_KEY);
  }

  /** Merge + persist config to localStorage, then rebuild the remote adapter. */
  configure(patch: Partial<SyncConfig>): SyncConfig {
    const prev = this.getConfig() ?? { baseUrl: '' };
    const next: SyncConfig = { ...prev, ...patch };
    // Normalise the URL (trim; drop trailing slashes) for a stable identity.
    next.baseUrl = (next.baseUrl ?? '').trim().replace(/\/+$/, '');
    this.local.setDoc(CONFIG_KEY, next);
    this.remote = this.buildRemote();
    return next;
  }

  /** True once a non-empty backend URL has been saved. */
  isConfigured(): boolean {
    const c = this.getConfig();
    return !!c && c.baseUrl.trim().length > 0;
  }

  /** Enable/disable the auto-sync flag (persisted). */
  setAutoSync(on: boolean): void {
    this.configure({ autoSync: on });
  }

  isAutoSync(): boolean {
    return !!this.getConfig()?.autoSync;
  }

  private buildRemote(): RemoteAdapter | null {
    const c = this.getConfig();
    if (!c || !c.baseUrl.trim()) return null;
    return new RemoteAdapter({
      baseUrl: c.baseUrl.trim(),
      token: c.token,
      fetchImpl: this.fetchImpl,
    });
  }

  private requireRemote(): RemoteAdapter {
    if (!this.remote) {
      throw new Error('Chưa cấu hình backend — hãy nhập Backend URL ở màn Cài đặt trước.');
    }
    return this.remote;
  }

  // ---------------------------------------------------------------------------
  //  Status
  // ---------------------------------------------------------------------------

  /** Health probe against the configured backend. Never throws. */
  async ping(): Promise<PingResult> {
    if (!this.remote) {
      return { ok: false, status: 0, ms: 0, error: 'Chưa cấu hình backend' };
    }
    return this.remote.ping();
  }

  status(): SyncStatus {
    const c = this.getConfig();
    return {
      configured: this.isConfigured(),
      baseUrl: c?.baseUrl?.trim() || null,
      autoSync: !!c?.autoSync,
      lastSyncedAt: c?.lastSyncedAt ?? null,
      lastResult: this.lastResult,
      lastError: this.lastError,
    };
  }

  // ---------------------------------------------------------------------------
  //  Transfers
  // ---------------------------------------------------------------------------

  /** Push every manifest doc/row from LOCAL up to REMOTE (remote is overwritten). */
  async pushAll(): Promise<SyncReport> {
    const remote = this.requireRemote();
    const start = Date.now();
    let docs = 0;
    let rows = 0;
    try {
      for (const key of this.manifest.docs) {
        const value = this.local.getDoc<unknown>(key);
        if (value == null) continue;
        await remote.setDocAsync(key, value);
        docs++;
      }
      for (const col of this.manifest.collections) {
        for (const row of this.local.list<{ id: string }>(col)) {
          await remote.putAsync(col, row);
          rows++;
        }
      }
      this.markSynced();
      return { direction: 'push', docs, rows, ms: Date.now() - start };
    } catch (e) {
      this.markError(errMsg(e));
      throw e;
    }
  }

  /** Pull every manifest doc/row from REMOTE down to LOCAL (local is overwritten). */
  async pullAll(): Promise<SyncReport> {
    const remote = this.requireRemote();
    const start = Date.now();
    let docs = 0;
    let rows = 0;
    try {
      for (const key of this.manifest.docs) {
        const value = await remote.getDocAsync<unknown>(key);
        if (value != null) {
          this.local.setDoc(key, value);
          docs++;
        }
      }
      for (const col of this.manifest.collections) {
        const remoteRows = await remote.listAsync<{ id: string }>(col);
        // The interface has no "replace collection" op — clear then re-put.
        for (const existing of this.local.list<{ id: string }>(col)) {
          this.local.remove(col, existing.id);
        }
        for (const row of remoteRows) {
          this.local.put(col, row);
          rows++;
        }
      }
      this.markSynced();
      return { direction: 'pull', docs, rows, ms: Date.now() - start };
    } catch (e) {
      this.markError(errMsg(e));
      throw e;
    }
  }

  /**
   * Last-Write-Wins two-way merge (used by auto-sync). See the class-level note
   * for the exact rules. Writes the winning copy to whichever side is stale.
   */
  async sync(): Promise<SyncReport> {
    const remote = this.requireRemote();
    const start = Date.now();
    let docs = 0;
    let rows = 0;
    try {
      // Documents: keep the newer of local/remote on both sides.
      for (const key of this.manifest.docs) {
        const localVal = this.local.getDoc<unknown>(key);
        const remoteVal = await remote.getDocAsync<unknown>(key);
        if (localVal == null && remoteVal == null) continue;
        if (remoteVal == null) {
          await remote.setDocAsync(key, localVal);
          docs++;
        } else if (localVal == null) {
          this.local.setDoc(key, remoteVal);
          docs++;
        } else if (extractTs(remoteVal) > extractTs(localVal)) {
          this.local.setDoc(key, remoteVal); // remote newer
          docs++;
        } else {
          await remote.setDocAsync(key, localVal); // local newer or tie -> local wins
          docs++;
        }
      }

      // Collections: union by id, newer createdAt wins; fill gaps on both sides.
      for (const col of this.manifest.collections) {
        const localRows = this.local.list<{ id: string }>(col);
        const remoteRows = await remote.listAsync<{ id: string }>(col);
        const byId = new Map<string, { id: string }>();
        for (const r of remoteRows) byId.set(r.id, r);
        for (const l of localRows) {
          const r = byId.get(l.id);
          if (!r || extractTs(l) >= extractTs(r)) byId.set(l.id, l);
        }
        const localIds = new Set(localRows.map((r) => r.id));
        const remoteIds = new Set(remoteRows.map((r) => r.id));
        for (const row of byId.values()) {
          if (!localIds.has(row.id) || byId.get(row.id) !== findById(localRows, row.id)) {
            this.local.put(col, row);
          }
          if (!remoteIds.has(row.id)) {
            await remote.putAsync(col, row);
          }
          rows++;
        }
      }

      this.markSynced();
      return { direction: 'merge', docs, rows, ms: Date.now() - start };
    } catch (e) {
      this.markError(errMsg(e));
      throw e;
    }
  }

  /**
   * Called by the host after a local write when auto-sync is on. No-op unless
   * configured AND auto-sync is enabled. Errors are swallowed (best-effort).
   *
   * NOTE: wiring this to fire on every store change would require touching the
   * store (out of scope / not owned here), so the host should call it.
   */
  async maybeAutoSync(): Promise<void> {
    if (!this.isConfigured() || !this.isAutoSync()) return;
    try {
      await this.sync();
    } catch {
      /* best-effort background sync; status() records the error */
    }
  }

  private markSynced(): void {
    this.lastResult = 'ok';
    this.lastError = undefined;
    const c = this.getConfig();
    if (c) this.local.setDoc(CONFIG_KEY, { ...c, lastSyncedAt: new Date().toISOString() });
  }

  private markError(msg: string): void {
    this.lastResult = 'error';
    this.lastError = msg;
  }
}

function findById<T extends { id: string }>(rows: T[], id: string): T | undefined {
  return rows.find((r) => r.id === id);
}

function errMsg(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}

/**
 * Convenience singleton wired to the app's localStorage `storage`. The Settings
 * screen uses this. It reads its backend config from localStorage, so it stays
 * a no-op until the user configures one.
 */
export const syncService = new SyncService(storage);
