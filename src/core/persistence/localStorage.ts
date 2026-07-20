import type { PersistenceAdapter } from './adapter';

/**
 * All keys owned by the v2 learning core live under this namespace so that
 * {@link LocalStorageAdapter.clearAll} never touches unrelated keys (e.g. the
 * legacy `linalglab-progress` store).
 */
const PREFIX = 'linalglab-v2:';
/** Sub-namespace for collection arrays: `linalglab-v2:col:<collection>`. */
const COL = 'col:';

/**
 * The tiny slice of the Web Storage API this adapter actually uses.
 * `Storage` (window.localStorage) is structurally compatible with it.
 */
interface KeyValueBackend {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  key(index: number): string | null;
  readonly length: number;
}

/** In-memory fallback used when `localStorage` is unavailable (SSR/tests). */
class MemoryStorage implements KeyValueBackend {
  private readonly m = new Map<string, string>();
  getItem(key: string): string | null {
    return this.m.has(key) ? (this.m.get(key) as string) : null;
  }
  setItem(key: string, value: string): void {
    this.m.set(key, value);
  }
  removeItem(key: string): void {
    this.m.delete(key);
  }
  key(index: number): string | null {
    return Array.from(this.m.keys())[index] ?? null;
  }
  get length(): number {
    return this.m.size;
  }
}

/** Pick a working backend: real localStorage if usable, else memory. */
function resolveBackend(): KeyValueBackend {
  try {
    const g = globalThis as unknown as { localStorage?: KeyValueBackend };
    if (g.localStorage) {
      // Probe: Safari private mode exposes localStorage but throws on write.
      const probe = `${PREFIX}__probe__`;
      g.localStorage.setItem(probe, '1');
      g.localStorage.removeItem(probe);
      return g.localStorage;
    }
  } catch {
    /* fall through to in-memory */
  }
  return new MemoryStorage();
}

/**
 * `localStorage`-backed {@link PersistenceAdapter}. JSON-safe throughout: every
 * read/write is wrapped in try/catch so malformed data or quota errors degrade
 * to `null`/no-op instead of throwing.
 */
export class LocalStorageAdapter implements PersistenceAdapter {
  private readonly prefix = PREFIX;
  private readonly backend: KeyValueBackend;

  constructor(backend?: KeyValueBackend) {
    this.backend = backend ?? resolveBackend();
  }

  private docKey(key: string): string {
    return this.prefix + key;
  }
  private colKey(collection: string): string {
    return this.prefix + COL + collection;
  }

  private read<T>(fullKey: string): T | null {
    try {
      const raw = this.backend.getItem(fullKey);
      if (raw == null) return null;
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }
  private write(fullKey: string, value: unknown): void {
    try {
      this.backend.setItem(fullKey, JSON.stringify(value));
    } catch {
      /* quota exceeded or non-serializable — ignore */
    }
  }

  getDoc<T>(key: string): T | null {
    return this.read<T>(this.docKey(key));
  }

  setDoc<T>(key: string, value: T): void {
    this.write(this.docKey(key), value);
  }

  list<T>(collection: string): T[] {
    const arr = this.read<T[]>(this.colKey(collection));
    return Array.isArray(arr) ? arr : [];
  }

  put<T extends { id: string }>(collection: string, value: T): void {
    const arr = this.list<T>(collection);
    const idx = arr.findIndex((x) => (x as { id: string }).id === value.id);
    if (idx >= 0) arr[idx] = value;
    else arr.push(value);
    this.write(this.colKey(collection), arr);
  }

  remove(collection: string, id: string): void {
    const arr = this.list<{ id: string }>(collection).filter((x) => x.id !== id);
    this.write(this.colKey(collection), arr);
  }

  clearAll(): void {
    try {
      const keys: string[] = [];
      for (let i = 0; i < this.backend.length; i++) {
        const k = this.backend.key(i);
        if (k && k.startsWith(this.prefix)) keys.push(k);
      }
      for (const k of keys) this.backend.removeItem(k);
    } catch {
      /* ignore */
    }
  }
}

/** Shared singleton used by the learning store. */
export const storage = new LocalStorageAdapter();
