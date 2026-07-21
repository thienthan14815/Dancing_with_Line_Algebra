/**
 * Small, pure date/day helpers shared by the learning-logic modules.
 *
 * "Day keys" are always `YYYY-MM-DD` strings. A `Date` is converted using the
 * host's *local* calendar day (so a learner's streak flips at their local
 * midnight), while an ISO string is read literally from its leading date part.
 */

/** Normalize a `Date` or ISO/date string to a `YYYY-MM-DD` day key. */
export function toDayKey(input: string | Date): string {
  if (typeof input === 'string') {
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(input);
    if (m) return `${m[1]}-${m[2]}-${m[3]}`;
    input = new Date(input);
  }
  const d = input;
  const y = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, '0');
  const da = String(d.getDate()).padStart(2, '0');
  return `${y}-${mo}-${da}`;
}

/**
 * Whole-day difference between two `YYYY-MM-DD` day keys (`b - a`).
 * Positive when `b` is later than `a`. Computed in UTC to avoid DST drift.
 */
export function daysBetween(a: string, b: string): number {
  const pa = a.split('-').map(Number);
  const pb = b.split('-').map(Number);
  const ua = Date.UTC(pa[0], pa[1] - 1, pa[2]);
  const ub = Date.UTC(pb[0], pb[1] - 1, pb[2]);
  return Math.round((ub - ua) / 86_400_000);
}

/** Add `days` whole days to an ISO timestamp and return a new ISO timestamp. */
export function addDaysISO(nowISO: string, days: number): string {
  const t = new Date(nowISO).getTime() + days * 86_400_000;
  return new Date(t).toISOString();
}

/**
 * Epoch-ms of the local Monday 00:00 that starts the week containing `input`
 * (weeks run Mon–Sun in the host's local calendar, matching the analytics view).
 * Compare an attempt's `Date.parse(createdAt)` against this to test "this week".
 */
export function startOfWeekMs(input: string | Date): number {
  const d = typeof input === 'string' ? new Date(input) : new Date(input.getTime());
  const dow = (d.getDay() + 6) % 7; // 0 = Monday … 6 = Sunday
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - dow);
  return d.getTime();
}
