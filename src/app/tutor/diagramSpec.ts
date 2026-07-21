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
  // Số ngay trước biến (vd 3v, -2v). Lookahead (?!\p{L}) chặn khớp nhầm 'v' nằm
  // trong từ tiếng Việt như "với", "vector", "viết" (dấu \b không đủ vì chữ có
  // dấu bị coi là ranh giới từ). Cần cờ 'u' để dùng \p{L}.
  const re = new RegExp(`(-?\\d+(?:\\.\\d+)?)\\s*${varName}(?!\\p{L})`, 'u');
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

// ===========================================================================
// WHITEBOARD (Bảng vẽ AI) — spec THUẦN cho tính năng "hỏi khái niệm → AI vẽ".
// Không React, không mạng. Mỗi figure = một khái niệm VẼ ĐƯỢC gồm: bộ alias
// (VN + EN, đã bỏ dấu) để dò từ khóa; skillId chọn KIỂU đồ thị (phải nằm trong
// SKILL_KIND); một `prompt` CHỨA SẴN số liệu tự tính tay để TutorDiagram parse
// và vẽ đúng; 2–3 câu trực giác giọng gia sư; và skill để dẫn tới bài học liên
// quan. Whiteboard.tsx render bằng <TutorDiagram exercise={whiteboardExercise(fig)} />
// nên KHÔNG cần sửa TutorDiagram/Canvas2D — số đo trục Canvas2D tự lo.
// ===========================================================================

/** Một khái niệm vẽ được trên Bảng vẽ AI. */
export interface WhiteboardFigure {
  /** Khóa duy nhất (dùng cho React key + id exercise tổng hợp). */
  key: string;
  /** Tên hiển thị (CÓ dấu) cho chip & tiêu đề kết quả. */
  label: string;
  /** Từ khóa ĐÃ bỏ dấu (VN + EN) để so khớp truy vấn người dùng. */
  aliases: string[];
  /** skill chọn kiểu đồ thị — BẮT BUỘC có trong SKILL_KIND. */
  skillId: string;
  /** Đề tổng hợp: chứa số liệu tự tính tay để parser rút ra và vẽ. */
  prompt: string;
  /** 2–3 câu giải thích trực giác, giọng gia sư. */
  intuition: string;
  /** skill để map sang micro-lesson "Học bài liên quan". */
  relatedSkill: string;
}

/**
 * Bỏ dấu tiếng Việt + thường hoá + gộp khoảng trắng — BẢN RIÊNG cho tutor/
 * (không import chéo search/index.ts). Ký tự lạ (·, +, °, dấu ngoặc…) → space
 * để "u·v", "x+y=5", "45°" vẫn dò được như văn bản thường.
 */
export function wbNormalize(s: string): string {
  return (s ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // dấu tổ hợp
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s]/g, ' ') // ký tự lạ → space
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Danh mục khái niệm vẽ được. Số liệu trong `prompt` đã tính tay để mỗi hình
 * hợp lệ về toán và vừa khung (xem chú thích từng dòng).
 */
export const WHITEBOARD_FIGURES: WhiteboardFigure[] = [
  {
    key: 'vector-co-ban',
    label: 'Vector cơ bản',
    aliases: ['vector', 'vecto', 'vec to', 'vector co ban', 'khai niem vector', 'vector la gi', 'mui ten', 'vector basics'],
    skillId: 'vector_basics',
    prompt: 'Vẽ vector v = (2, 3).', // v=(2,3), ‖v‖≈3.61
    intuition:
      'Một vector là mũi tên có hướng và độ dài, xuất phát từ gốc tọa độ. Tọa độ (2, 3) nghĩa là đi ngang 2 rồi lên 3 để tới ngọn mũi tên. Hãy xem nó như một "chỉ dẫn di chuyển", chứ không phải một điểm cố định.',
    relatedSkill: 'vector_basics',
  },
  {
    key: 'cong-vector',
    label: 'Cộng vector',
    aliases: ['cong vector', 'cong hai vector', 'cong vecto', 'phep cong vector', 'tong vector', 'tong hai vector', 'vector addition', 'add vector', 'quy tac hinh binh hanh'],
    skillId: 'vector_addition',
    prompt: 'Cộng hai vector a = (2, 1) và b = (1, 3).', // a+b=(3,4)
    intuition:
      'Cộng hai vector là nối chúng đuôi–đầu: đặt gốc của b vào ngọn của a, đi hết a rồi đi tiếp b. Vector tổng là mũi tên nối thẳng từ gốc ban đầu tới điểm cuối cùng. Nó chính là đường chéo của hình bình hành dựng bởi a và b.',
    relatedSkill: 'vector_addition',
  },
  {
    key: 'tru-vector',
    label: 'Trừ vector',
    aliases: ['tru vector', 'tru hai vector', 'hieu vector', 'hieu hai vector', 'phep tru vector', 'vector subtraction', 'subtract vector', 'a tru b'],
    skillId: 'linear_combination', // a − b = 1·a + (−1)·b, vẽ bằng lincombFig
    prompt: 'Cho a = (3, 1) và b = (1, 2). Vẽ hiệu a - b.', // a−b=(2,-1)
    intuition:
      'Trừ a − b nghĩa là cộng a với vector ngược của b (tức −b). Kết quả là mũi tên đi từ ngọn của b tới ngọn của a — nó trả lời "phải đi thế nào để từ b tới a". Vì vậy hiệu hai vector đo được cả khoảng cách lẫn hướng giữa hai điểm.',
    relatedSkill: 'vector_addition',
  },
  {
    key: 'nhan-vo-huong',
    label: 'Nhân vô hướng',
    aliases: ['nhan vo huong', 'nhan vector voi so', 'nhan vector voi mot so', 'scalar multiplication', 'scalar', 'scaling vector', 'co gian vector', 'phong to vector'],
    skillId: 'scalar_multiplication',
    prompt: 'Nhân vô hướng: tính 2v với v = (2, 1).', // 2v=(4,2)
    intuition:
      'Nhân một vector với số k chỉ kéo dài hoặc rút ngắn nó mà vẫn giữ nguyên phương. Nếu k > 1 vector dài ra, 0 < k < 1 nó co lại, còn k âm thì nó quay ngược 180°. Độ dài mới đúng bằng |k| lần độ dài cũ.',
    relatedSkill: 'scalar_multiplication',
  },
  {
    key: 'to-hop-tuyen-tinh',
    label: 'Tổ hợp tuyến tính',
    aliases: ['to hop tuyen tinh', 'linear combination', 'to hop vector', 'ket hop tuyen tinh', 'to hop'],
    skillId: 'linear_combination',
    prompt: 'Tổ hợp tuyến tính 2a + b với a = (2, 1) và b = (-1, 1).', // =(3,3)
    intuition:
      'Tổ hợp tuyến tính là "pha trộn" hai vector theo công thức 2a + b: đi 2 bước theo a rồi 1 bước theo b. Chỉ cần đổi hai hệ số là bạn chạm tới rất nhiều điểm khác nhau trên mặt phẳng. Đây là phép toán trung tâm của cả đại số tuyến tính.',
    relatedSkill: 'linear_combination',
  },
  {
    key: 'span',
    label: 'Span (không gian sinh)',
    aliases: ['span', 'khong gian sinh', 'sinh boi', 'khong gian sinh boi', 'linear span', 'bao tuyen tinh'],
    skillId: 'linear_combination', // span minh hoạ bằng một tổ hợp tiêu biểu
    prompt: 'Span của a = (2, 1) và b = (1, -1): điểm 1a + 1b nằm trong span.', // =(3,0)
    intuition:
      'Span của hai vector là TẤT CẢ những điểm bạn có thể tới bằng mọi tổ hợp tuyến tính của chúng. Nếu hai vector không cùng phương, span của chúng lấp đầy toàn bộ mặt phẳng. Điểm hồng chỉ là một trong vô số điểm nằm trong span đó.',
    relatedSkill: 'span',
  },
  {
    key: 'tich-vo-huong',
    label: 'Tích vô hướng',
    aliases: ['tich vo huong', 'dot product', 'dot', 'tich cham', 'tich vo huong hai vector', 'goc giua hai vector', 'goc giua vector'],
    skillId: 'dot_product',
    prompt: 'Tích vô hướng của u = (4, 1) và v = (1, 3).', // u·v=7>0, góc nhọn
    intuition:
      'Tích vô hướng u·v đo mức độ "cùng hướng" của hai vector, bằng ‖u‖‖v‖cos θ. Đoạn xanh lá là hình chiếu của v lên u — càng dài thì u·v càng lớn. Dấu của u·v cho biết góc giữa chúng là nhọn, vuông hay tù.',
    relatedSkill: 'dot_product',
  },
  {
    key: 'vuong-goc',
    label: 'Vuông góc / Trực giao',
    aliases: ['vuong goc', 'truc giao', 'hai vector vuong goc', 'vector vuong goc', 'vuong goc nhau', 'orthogonal', 'orthogonality', 'perpendicular'],
    skillId: 'dot_product', // trường hợp u·v = 0
    prompt: 'Hai vector vuông góc: u = (3, 1) và v = (-1, 3), tích vô hướng bằng 0.', // u·v=0
    intuition:
      'Hai vector vuông góc khi tích vô hướng của chúng bằng 0 — không phần nào "chồng lên" phần kia. Ở đây u·v = 3·(−1) + 1·3 = 0, nên hình chiếu của v lên u co về đúng gốc tọa độ. Trực giao là ý tưởng nền của phép chiếu, cơ sở trực chuẩn và bình phương tối thiểu.',
    relatedSkill: 'orthogonality',
  },
  {
    key: 'hinh-chieu',
    label: 'Hình chiếu (projection)',
    aliases: ['hinh chieu', 'chieu vector', 'chieu', 'phep chieu', 'projection', 'hinh chieu vuong goc', 'project vector', 'bong cua vector'],
    skillId: 'projection',
    prompt: 'Chiếu vector b = (4, 1) lên đường thẳng theo a = (1, 1).', // p=(2.5,2.5)
    intuition:
      'Hình chiếu của b lên một đường thẳng là điểm trên đường đó GẦN b nhất — chính là "cái bóng" của b khi hạ vuông góc xuống. Phần dư b − p luôn vuông góc với đường. Ý tưởng này giúp ta xấp xỉ, nén dữ liệu và giải bài toán bình phương tối thiểu.',
    relatedSkill: 'projection',
  },
  {
    key: 'dinh-thuc',
    label: 'Định thức (determinant)',
    aliases: ['dinh thuc', 'determinant', 'det', 'dien tich bien doi', 'he so dien tich'],
    skillId: 'determinant',
    prompt: 'Định thức của ma trận [[2, 1], [1, 2]].', // det=3
    intuition:
      'Định thức đo hệ số phóng đại DIỆN TÍCH khi ma trận biến đổi mặt phẳng: ô vuông đơn vị (diện tích 1) biến thành hình bình hành có diện tích |det|. Nếu det = 0, mọi thứ bị bóp về một đường thẳng — ma trận suy biến, không đảo ngược được. Dấu âm nghĩa là phép biến đổi lật ngược hướng.',
    relatedSkill: 'determinant',
  },
  {
    key: 'phep-bien-doi',
    label: 'Phép biến đổi tuyến tính',
    aliases: ['phep bien doi', 'bien doi tuyen tinh', 'ma tran bien doi', 'ma tran nhu phep bien doi', 'linear transformation', 'linear map', 'phep truot', 'shear', 'ma tran la gi'],
    skillId: 'matrix_transformation',
    prompt: 'Ma trận biến đổi [[1, 1], [0, 1]] (phép trượt).', // shear, det=1
    intuition:
      'Một ma trận là một phép biến đổi: nó dời mọi điểm của mặt phẳng đi nơi khác một cách "thẳng và đều". Chỉ cần biết î=(1,0) và ĵ=(0,1) hạ cánh ở đâu — chính là hai cột của ma trận — là bạn biết mọi điểm sẽ đi đâu. Ma trận trượt này giữ nguyên trục ngang nhưng đẩy nghiêng phương dọc.',
    relatedSkill: 'matrix_transformation',
  },
  {
    key: 'phep-xoay',
    label: 'Phép xoay (rotation)',
    aliases: ['phep xoay', 'ma tran xoay', 'xoay', 'phep quay', 'quay', 'rotation', 'rotation matrix', 'rotate'],
    skillId: 'matrix_transformation',
    prompt: 'Ma trận xoay 90 độ [[0, -1], [1, 0]].', // xoay 90°, det=1
    intuition:
      'Ma trận xoay quay toàn bộ mặt phẳng quanh gốc một góc cố định, giữ nguyên độ dài mọi vector. Với 90°, î=(1,0) hạ cánh ở (0,1) và ĵ=(0,1) hạ cánh ở (−1,0). Vì không hướng nào được giữ nguyên phương nên phép xoay thực không có vector riêng thực.',
    relatedSkill: 'matrix_transformation',
  },
  {
    key: 'vector-rieng',
    label: 'Vector riêng & giá trị riêng',
    aliases: ['vector rieng', 'eigenvector', 'eigen vector', 'gia tri rieng', 'eigenvalue', 'eigen', 'eigen value', 'huong bat bien'],
    skillId: 'eigenvalue',
    prompt: 'Vector riêng của ma trận [[2, 1], [1, 2]].', // λ=3, v=(1,1)
    intuition:
      'Vector riêng là hướng ĐẶC BIỆT mà phép biến đổi A chỉ kéo giãn chứ không bẻ lệch: Av nằm đúng trên đường thẳng của v. Hệ số kéo giãn đó chính là giá trị riêng λ. Tìm được các hướng bất biến này giúp ta hiểu "bộ xương" của một phép biến đổi.',
    relatedSkill: 'eigenvector',
  },
  {
    key: 'he-phuong-trinh',
    label: 'Hệ phương trình (row picture)',
    aliases: ['he phuong trinh', 'he phuong trinh tuyen tinh', 'he pt', 'linear system', 'system of equations', 'row picture', 'giao diem hai duong thang', 'nghiem he phuong trinh'],
    skillId: 'linear_system',
    prompt: 'Hệ phương trình x + y = 5 và x - y = 1.', // nghiệm (3,2)
    intuition:
      'Mỗi phương trình hai ẩn là một đường thẳng trên mặt phẳng. Nghiệm của hệ chính là GIAO ĐIỂM của các đường — điểm thỏa mãn đồng thời mọi phương trình. Hai đường cắt nhau cho một nghiệm, song song thì vô nghiệm, còn trùng nhau thì vô số nghiệm.',
    relatedSkill: 'linear_system',
  },
  {
    key: 'duong-tron-luong-giac',
    label: 'Đường tròn đơn vị (sin/cos)',
    aliases: ['duong tron luong giac', 'duong tron don vi', 'unit circle', 'sin cos', 'sin va cos', 'luong giac', 'trigonometry', 'goc va toa do'],
    skillId: 'trigonometry',
    prompt: 'Đường tròn đơn vị tại các góc 30°, 45°, 60°.',
    intuition:
      'Trên đường tròn đơn vị, mỗi góc θ ứng với một điểm có tọa độ (cos θ, sin θ). Đoạn nằm ngang chính là cos θ, đoạn thẳng đứng là sin θ. Đây là cầu nối giữa góc và tọa độ — nền tảng cho phép xoay và số phức.',
    relatedSkill: 'trigonometry',
  },
];

/** Dựng một Exercise tổng hợp (thuần dữ liệu) để TutorDiagram vẽ figure. */
export function whiteboardExercise(fig: WhiteboardFigure): Exercise {
  return {
    id: `wb-${fig.key}`,
    skillId: fig.skillId,
    prompt: fig.prompt,
    dimension: 'visual',
    hints: [],
    difficulty: 1,
    type: 'numeric-input',
    answer: 0,
  };
}

/**
 * Dò khái niệm từ truy vấn tự do (VN/EN, có/không dấu). Cho điểm theo mức khớp
 * alias: trùng khít > alias là chuỗi con của truy vấn > mọi token của alias có
 * mặt > truy vấn là chuỗi con của alias. Trả về figure điểm cao nhất, hoặc null
 * nếu không đủ tin cậy (để UI hiện danh sách chip — KHÔNG dead-end).
 */
export function matchWhiteboard(raw: string): WhiteboardFigure | null {
  const q = wbNormalize(raw);
  if (!q) return null;
  let best: WhiteboardFigure | null = null;
  let bestScore = 0;
  for (const fig of WHITEBOARD_FIGURES) {
    for (const alias of fig.aliases) {
      let s = 0;
      if (q === alias) s = 100 + alias.length;
      else if (q.includes(alias)) s = 60 + alias.length;
      else {
        const toks = alias.split(' ');
        if (toks.length > 1 && toks.every((t) => t.length >= 2 && q.includes(t))) {
          s = 40 + alias.length;
        } else if (alias.includes(q) && q.length >= 4) {
          s = 25 + q.length;
        }
      }
      if (s > bestScore) {
        bestScore = s;
        best = fig;
      }
    }
  }
  return bestScore > 0 ? best : null;
}
