// ===========================================================================
// TUTOR DIAGRAM SPEC — logic THUẦN (không React, không side-effect).
//
// Quyết định "câu hỏi này có thể minh họa hình học không" và cung cấp các parser
// AN TOÀN để rút số liệu THẬT ra khỏi `prompt` / dữ liệu bài. Mọi parser đều
// KHÔNG BAO GIỜ ném lỗi: khi không chắc chắn thì trả về null / [] để component
// vẽ MỘT VÍ DỤ TIÊU BIỂU thay thế.
//
// Dùng bởi: ./TutorDiagram.tsx (render) và ./TutorPanel.tsx (bật/tắt nút).
// ===========================================================================

import type { Exercise } from '../../core/exercises/types';

/** Kiểu ma trận 2×2 dùng chung với prop `matrix` của Canvas2D. */
export type Mat2 = [[number, number], [number, number]];

/** Vector parse được: mảng số dài 2 (2D) hoặc 3 (3D). */
export type Vec = number[];

/** Đường thẳng ax + by = c (khớp prop `lines` của Canvas2D). */
export interface Line {
  a: number;
  b: number;
  c: number;
}

/** Nhóm đồ thị được hỗ trợ. */
export type DiagramKind =
  | 'trig'
  | 'vectors'
  | 'dot'
  | 'projection'
  | 'determinant'
  | 'transform'
  | 'eigen'
  | 'system';

// ---------------------------------------------------------------------------
// PHÂN LOẠI: skillId → loại đồ thị
// ---------------------------------------------------------------------------

const SKILL_KIND: Record<string, DiagramKind> = {
  trigonometry: 'trig',
  vector_basics: 'vectors',
  vector_addition: 'vectors',
  scalar_multiplication: 'vectors',
  linear_combination: 'vectors',
  dot_product: 'dot',
  projection: 'projection',
  determinant: 'determinant',
  matrix_transformation: 'transform',
  eigenvalue: 'eigen',
  eigenvector: 'eigen',
  linear_system: 'system',
  solution_types: 'system',
};

/** Loại đồ thị cho bài (null nếu skill không thuộc nhóm minh họa được). */
export function diagramKind(ex: Exercise): DiagramKind | null {
  return SKILL_KIND[ex.skillId] ?? null;
}

/** true nếu bài này CÓ THỂ minh họa bằng đồ thị. */
export function hasDiagram(ex: Exercise): boolean {
  return diagramKind(ex) !== null;
}

// ---------------------------------------------------------------------------
// CHUẨN HÓA & TIỆN ÍCH SỐ
// ---------------------------------------------------------------------------

/**
 * Chuẩn hóa văn bản toán: đổi mọi loại dấu trừ Unicode (−, ‒, –, —, ―, －) về
 * ASCII '-', và non-breaking space về space thường, để regex bắt được số âm.
 */
export function normalizeMath(text: string): string {
  return (text ?? '')
    .replace(/[−‒–—―－]/g, '-')
    .replace(/ /g, ' ');
}

/** Làm tròn 2 chữ số, khử -0 và snap giá trị cực nhỏ về 0. */
export function r2(x: number): number {
  if (!Number.isFinite(x)) return 0;
  const v = Math.round(x * 100) / 100;
  return Math.abs(v) < 0.005 ? 0 : v;
}

/** Đổi độ sang radian. */
export function deg2rad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/** Định thức 2×2. */
export function det2(m: Mat2): number {
  return m[0][0] * m[1][1] - m[0][1] * m[1][0];
}

/** Nhân ma trận 2×2 với vector 2D. */
export function matVec(m: Mat2, v: number[]): [number, number] {
  return [m[0][0] * v[0] + m[0][1] * v[1], m[1][0] * v[0] + m[1][1] * v[1]];
}

/** Tích vô hướng 2D. */
export function dot2(u: number[], v: number[]): number {
  return u[0] * v[0] + u[1] * v[1];
}

/**
 * Chọn `range` (nửa bề rộng world) hợp lý để mọi điểm có |tọa độ| ≤ maxAbs vừa
 * khung, có chút lề. Kẹp trong [3, 12].
 */
export function niceRange(maxAbs: number): number {
  const r = Math.ceil((Number.isFinite(maxAbs) ? Math.abs(maxAbs) : 3) * 1.15 + 0.6);
  return Math.min(12, Math.max(3, r));
}

/** Đọc hệ số từ token như '', '+', '-', '2', '-3' → số (mặc định 1). */
function toCoeff(tok: string): number {
  const t = (tok ?? '').replace(/\s+/g, '');
  if (t === '' || t === '+') return 1;
  if (t === '-') return -1;
  const n = Number(t);
  return Number.isFinite(n) ? n : 1;
}

// ---------------------------------------------------------------------------
// PARSERS AN TOÀN (không ném lỗi)
// ---------------------------------------------------------------------------

/**
 * Tìm mọi cặp `(a, b)` hoặc bộ ba `(a, b, c)` số trong văn bản.
 * KHÔNG bắt ma trận `[[..],[..]]` (dùng ngoặc vuông) hay `(cos θ, sin θ)`
 * (không phải số). Trả [] khi không có.
 */
export function parseVectors(text: string): Vec[] {
  const s = normalizeMath(text);
  const re =
    /\(\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)(?:\s*,\s*(-?\d+(?:\.\d+)?))?\s*\)/g;
  const out: Vec[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(s)) !== null) {
    const v = [parseFloat(m[1]), parseFloat(m[2])];
    if (m[3] !== undefined) v.push(parseFloat(m[3]));
    if (v.every((n) => Number.isFinite(n))) out.push(v);
  }
  return out;
}

/** Chỉ giữ các vector 2D (dài đúng 2). */
export function only2D(vs: Vec[]): Vec[] {
  return vs.filter((v) => v.length === 2);
}

/**
 * Tìm ma trận 2×2 dạng `[[a, b], [c, d]]` trong văn bản (hoặc answer). Trả null
 * nếu không tìm thấy / không đủ 4 số hợp lệ.
 */
export function parseMatrix2(text: string): Mat2 | null {
  const s = normalizeMath(text);
  const re =
    /\[\s*\[\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*\]\s*,\s*\[\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*\]/;
  const m = re.exec(s);
  if (!m) return null;
  const n = [1, 2, 3, 4].map((i) => parseFloat(m[i]));
  if (!n.every((x) => Number.isFinite(x))) return null;
  return [
    [n[0], n[1]],
    [n[2], n[3]],
  ];
}

/** Coi một `number[][]` (vd answer của matrix-input) là Mat2 nếu đúng 2×2. */
export function matrix2FromRows(rows: unknown): Mat2 | null {
  if (!Array.isArray(rows) || rows.length !== 2) return null;
  const r0 = rows[0];
  const r1 = rows[1];
  if (!Array.isArray(r0) || !Array.isArray(r1)) return null;
  if (r0.length !== 2 || r1.length !== 2) return null;
  const n = [r0[0], r0[1], r1[0], r1[1]];
  if (!n.every((x) => typeof x === 'number' && Number.isFinite(x))) return null;
  return [
    [r0[0], r0[1]],
    [r1[0], r1[1]],
  ];
}

/**
 * Tìm các góc kèm ký hiệu độ, vd `0°, 30°, 45°, 90°, 180°`. Trả về mảng độ đã
 * khử trùng và sắp tăng. [] nếu không có.
 */
export function parseAngles(text: string): number[] {
  const s = normalizeMath(text);
  const re = /(-?\d+(?:\.\d+)?)\s*°/g;
  const out: number[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(s)) !== null) {
    const d = parseFloat(m[1]);
    if (Number.isFinite(d)) out.push(d);
  }
  return [...new Set(out)].sort((a, b) => a - b);
}

/**
 * Tìm hệ số nhân đứng ngay trước một biến, vd `3v` → 3, `-2v` → -2.
 * Trả null nếu không thấy.
 */
export function parseScalarTimes(text: string, varName: string): number | null {
  const s = normalizeMath(text);
  const re = new RegExp(`(-?\\d+(?:\\.\\d+)?)\\s*${varName}\\b`);
  const m = re.exec(s);
  return m ? parseFloat(m[1]) : null;
}

/**
 * Tìm tổ hợp tuyến tính dạng `2a + b`, `2a - 3b`, `a + 3b`… của hai vector a, b.
 * Trả hệ số {ca, cb} hoặc null.
 */
export function parseCombo(text: string): { ca: number; cb: number } | null {
  const s = normalizeMath(text);
  const m = /(-?\d*)\s*a\s*([+-])\s*(\d*)\s*b/.exec(s);
  if (!m) return null;
  const ca = toCoeff(m[1]);
  const sign = m[2] === '-' ? -1 : 1;
  const cbMag = m[3] === '' ? 1 : Number(m[3]);
  const cb = sign * (Number.isFinite(cbMag) ? cbMag : 1);
  return { ca, cb };
}

/**
 * Tìm các phương trình tuyến tính 2 ẩn dạng `a x ± b y = c` (hệ số có thể ẩn).
 * Ví dụ: "x + y = 5", "x - y = 1", "2x + 3y = 6". Trả mảng {a,b,c}.
 */
export function parseEquations(text: string): Line[] {
  const s = normalizeMath(text);
  const re = /([+-]?\s*\d*\.?\d*)\s*x\s*([+-]\s*\d*\.?\d*)\s*y\s*=\s*([+-]?\d+\.?\d*)/g;
  const out: Line[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(s)) !== null) {
    const a = toCoeff(m[1]);
    const b = toCoeff(m[2]);
    const c = parseFloat(m[3]);
    if ([a, b, c].every((x) => Number.isFinite(x))) out.push({ a, b, c });
  }
  return out;
}

/** Giao điểm hai đường thẳng (null nếu song song / trùng). */
export function intersect(l1: Line, l2: Line): [number, number] | null {
  const d = l1.a * l2.b - l2.a * l1.b;
  if (Math.abs(d) < 1e-9) return null;
  const x = (l1.c * l2.b - l2.c * l1.b) / d;
  const y = (l1.a * l2.c - l2.a * l1.c) / d;
  if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
  return [x, y];
}

// ---------------------------------------------------------------------------
// GIÁ TRỊ RIÊNG / VECTOR RIÊNG 2×2 (giải tích, chính xác)
// ---------------------------------------------------------------------------

function normVec(v: number[]): number[] {
  const L = Math.hypot(v[0], v[1]);
  if (L < 1e-12) return [1, 0];
  return [v[0] / L, v[1] / L];
}

/** Hướng vector về phía "đẹp": thành phần x dương (hoặc x≈0 thì y dương). */
function orient(v: number[]): number[] {
  if (v[0] < -1e-9 || (Math.abs(v[0]) < 1e-9 && v[1] < 0)) return [-v[0], -v[1]];
  return v;
}

/**
 * Giá trị riêng & vector riêng của ma trận 2×2 (giải tích).
 * - real=false khi hai nghiệm phức (vd phép xoay) → không có vector riêng thực.
 * - vectors: vector riêng ĐƠN VỊ, đã định hướng, tương ứng từng values[i].
 */
export function eig2(m: Mat2): { real: boolean; values: number[]; vectors: number[][] } {
  const a = m[0][0];
  const b = m[0][1];
  const c = m[1][0];
  const d = m[1][1];
  const tr = a + d;
  const dt = a * d - b * c;
  const disc = tr * tr - 4 * dt;
  if (disc < -1e-9) return { real: false, values: [], vectors: [] };
  const sq = Math.sqrt(Math.max(0, disc));
  const values = [(tr + sq) / 2, (tr - sq) / 2];
  const vecFor = (lam: number): number[] => {
    const a1 = a - lam;
    const b1 = b;
    const c1 = c;
    const d1 = d - lam;
    let v: number[];
    // (A - λI)v = 0. Hàng 1: a1·x + b1·y = 0 ⇒ v = (-b1, a1).
    if (Math.abs(a1) > 1e-9 || Math.abs(b1) > 1e-9) v = [-b1, a1];
    // Nếu hàng 1 suy biến, dùng hàng 2: c1·x + d1·y = 0 ⇒ v = (-d1, c1).
    else if (Math.abs(c1) > 1e-9 || Math.abs(d1) > 1e-9) v = [-d1, c1];
    // A = λI: mọi vector đều là vector riêng.
    else v = [1, 0];
    return orient(normVec(v));
  };
  return { real: true, values, vectors: values.map(vecFor) };
}
