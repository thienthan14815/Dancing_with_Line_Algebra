/**
 * Storage abstraction for the learning core.
 *
 * The app runs fully client-side today (see {@link ./localStorage}), but every
 * read/write goes through this interface so a real backend can be dropped in
 * later (see {@link ./remote}) without touching the domain logic.
 *
 * Two access shapes are supported:
 *  - key/value *documents* via {@link PersistenceAdapter.getDoc} / `setDoc`
 *  - *collections* of `{ id }` rows via `list` / `put` / `remove`
 */
export interface PersistenceAdapter {
  /** Read a single document by key, or `null` when absent/unreadable. */
  getDoc<T>(key: string): T | null;
  /** Write (overwrite) a single document by key. */
  setDoc<T>(key: string, value: T): void;
  /** Read every row of a collection (empty array when absent). */
  list<T>(collection: string): T[];
  /** Upsert a row into a collection, keyed by `value.id`. */
  put<T extends { id: string }>(collection: string, value: T): void;
  /** Remove a row from a collection by id. */
  remove(collection: string, id: string): void;
  /** Delete everything owned by this adapter (namespaced). */
  clearAll(): void;
}
