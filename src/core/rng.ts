// ===========================================================================
// RNG TẤT ĐỊNH CÓ HẠT GIỐNG (seeded deterministic RNG).
// ---------------------------------------------------------------------------
// Thuần, KHÔNG side-effect, KHÔNG phụ thuộc thứ gì khác. Dùng cho hệ sinh bài
// tập thủ tục: cùng một `seed` → cùng một chuỗi số → cùng một bài tập; đổi seed
// → số liệu mới. Nhờ vậy mỗi lượt luyện gieo một hạt giống mới sẽ cho đề khác
// nhau mà vẫn kiểm thử lại được (reproducible).
// ===========================================================================

/**
 * Bộ sinh số giả ngẫu nhiên Mulberry32: nhận một `seed` (số nguyên 32-bit) và
 * trả về một hàm sinh số thực trong nửa khoảng [0, 1). Nhanh, đủ tốt cho mục
 * đích sinh bài tập, và HOÀN TOÀN tất định theo seed.
 */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function next(): number {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Số nguyên ngẫu nhiên trong [lo, hi] (BAO GỒM cả hai đầu). */
export function randInt(rng: () => number, lo: number, hi: number): number {
  if (hi < lo) [lo, hi] = [hi, lo];
  return lo + Math.floor(rng() * (hi - lo + 1));
}

/** Chọn ngẫu nhiên một phần tử của mảng (mảng không rỗng). */
export function pick<T>(rng: () => number, arr: readonly T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

/** Lấy ngẫu nhiên `k` phần tử KHÁC nhau (không lặp) từ `arr`, giữ thứ tự xáo. */
export function sample<T>(rng: () => number, arr: readonly T[], k: number): T[] {
  const n = Math.max(0, Math.min(k, arr.length));
  return shuffle(rng, arr).slice(0, n);
}

/**
 * Số nguyên ngẫu nhiên trong [lo, hi] nhưng KHÁC 0 (tiện cho hệ số/thành phần
 * vector để đề bài không tầm thường). Nếu khoảng chỉ chứa 0 thì trả về 1.
 */
export function randNonZeroInt(rng: () => number, lo: number, hi: number): number {
  if (hi < lo) [lo, hi] = [hi, lo];
  if (lo === 0 && hi === 0) return 1;
  let v = randInt(rng, lo, hi);
  let guard = 0;
  while (v === 0 && guard++ < 64) v = randInt(rng, lo, hi);
  if (v === 0) v = hi !== 0 ? hi : lo;
  return v;
}

/** Trộn (Fisher–Yates) một BẢN SAO của mảng — không đụng mảng gốc. */
export function shuffle<T>(rng: () => number, arr: readonly T[]): T[] {
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = out[i];
    out[i] = out[j];
    out[j] = tmp;
  }
  return out;
}

/**
 * Băm chuỗi ổn định (FNV-1a) → số nguyên không dấu 32-bit. Dùng để TRỘN seed
 * theo skillId, giúp mỗi skill có "nhánh" ngẫu nhiên riêng từ cùng một seed gốc.
 */
export function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
