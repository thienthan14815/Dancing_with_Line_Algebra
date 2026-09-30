import type { Exercise } from '../../core/exercises/types';

/** Only these three fields cross the illustration boundary. In particular, a
 * target, option, statement to evaluate, or worked solution is never a given. */
export type IllustrationInput = Pick<Exercise, 'prompt' | 'skillId' | 'type'>;
export type Family = 'coordinates' | 'vectors' | 'trig' | 'function' | 'system' | 'matrix'
  | 'space' | 'eigen' | 'decomposition' | 'quadratic' | 'tensor' | 'network'
  | 'training' | 'data' | 'sequence' | 'base' | 'logic' | 'calculus';

export const FAMILY_SKILLS: Record<Family, readonly string[]> = {
  calculus: Array.from({ length: 30 }, (_, index) => `calculus_d${String(index + 1).padStart(2, '0')}`),
  coordinates: ['coordinate_systems', 'math_notation'],
  vectors: ['vector_basics', 'vector_addition', 'scalar_multiplication', 'linear_combination', 'dot_product', 'cross_product'],
  trig: ['trigonometry'],
  function: ['functions_graphs', 'ai_as_function', 'digital_function'],
  system: ['linear_system', 'gaussian_elimination', 'solution_types'],
  matrix: ['matrix_transformation', 'matrix_multiplication', 'determinant', 'matrix_inverse', 'special_matrices', 'change_of_basis'],
  space: ['span', 'subspace', 'column_null_space', 'linear_independence', 'basis_dimension', 'rank'],
  eigen: ['eigenvalue', 'eigenvector', 'characteristic_polynomial', 'eigenspace', 'diagonalization', 'matrix_powers'],
  decomposition: ['svd', 'singular_values', 'rank_k_approximation', 'pca', 'orthogonality', 'projection', 'gram_schmidt', 'qr_decomposition'],
  quadratic: ['quadratic_form', 'definiteness', 'spectral_theorem', 'conic_sections'],
  tensor: ['tensor_basics', 'tensor_memory', 'tensor_ops'],
  network: ['perceptron', 'neuron', 'mlp', 'xor_mlp', 'forward_prop', 'activation_functions', 'cnn', 'attention', 'transformer', 'word_embedding', 'softmax_regression'],
  training: ['gradient_descent', 'training_gd', 'backprop', 'sgd_optimizers', 'batch_norm'],
  data: ['least_squares', 'linear_regression_ml', 'generalization', 'dl_generalization', 'computer_vision', 'nlp_lm'],
  sequence: ['markov_pagerank', 'rnn', 'digital_circuit_types'],
  base: ['digital_binary_decimal', 'digital_base_conversion'],
  logic: ['digital_gates', 'digital_truth_table', 'digital_boolean', 'digital_sop', 'digital_adder'],
};

export const SKILL_FAMILY = Object.fromEntries(
  Object.entries(FAMILY_SKILLS).flatMap(([family, skills]) => skills.map((skill) => [skill, family])),
) as Record<string, Family>;

export interface Concept {
  title: string;
  stages: [string, string, string];
  caption: string;
}

export const CONCEPTS: Record<Family, Concept> = {
  calculus: { title: 'Nhận dạng bài giải tích', stages: ['Hàm và miền', 'Giới hạn / vi tích phân', 'Kết quả và đơn vị'], caption: 'Sơ đồ khái niệm: chọn phép toán theo yêu cầu đề, kiểm tra điều kiện và cận trước khi tính.' },
  coordinates: { title: 'Đọc tọa độ', stages: ['Gốc O', 'Trục x, y', 'Vị trí ?'], caption: 'Xác định trục, chiều dương và đơn vị trước khi đọc hình.' },
  vectors: { title: 'Theo dõi từng vector', stages: ['Vector đã cho', 'Phép toán', 'Vector / số ?'], caption: 'Đọc hướng và thành phần; giữ riêng dữ kiện và đại lượng cần tìm.' },
  trig: { title: 'Góc và hai trục', stages: ['Góc θ', 'Đường tròn', 'Tọa độ ?'], caption: 'Đánh dấu góc từ trục ngang; xác định đại lượng đề yêu cầu.' },
  function: { title: 'Hàm số như hộp xử lý', stages: ['Đầu vào x', 'Quy tắc f', 'Đầu ra y ?'], caption: 'Phân biệt đầu vào, quy tắc xử lý và đầu ra cần tìm.' },
  system: { title: 'Các điều kiện cùng lúc', stages: ['Phương trình', 'Biến đổi', 'Nghiệm ?'], caption: 'Theo dõi mỗi phương trình; kiểm tra kết quả trong tất cả điều kiện.' },
  matrix: { title: 'Đọc hàng và cột', stages: ['Ma trận đã cho', 'Phép toán', 'Kết quả ?'], caption: 'Kiểm tra kích thước; chỉ thực hiện phép toán khi các chiều phù hợp.' },
  space: { title: 'Từ vector đến không gian', stages: ['Các vector', 'Quan hệ', 'Không gian ?'], caption: 'Xác định các vector đang xét rồi kiểm tra quan hệ giữa chúng.' },
  eigen: { title: 'Theo dõi phép biến đổi', stages: ['Vector v', 'Ma trận A', 'Vector Av ?'], caption: 'So sánh phương trước và sau biến đổi; chưa kết luận vector nào là vector riêng.' },
  decomposition: { title: 'Tách một phép biến đổi', stages: ['Dữ liệu gốc', 'Các thành phần', 'Ghép / xấp xỉ'], caption: 'Theo dõi vai trò và kích thước của từng thành phần.' },
  quadratic: { title: 'Từ điểm đến giá trị', stages: ['Điểm x', 'Biểu thức', 'Giá trị ?'], caption: 'Đọc hệ số và điều kiện; xét giá trị tại điểm đề yêu cầu.' },
  tensor: { title: 'Theo dõi chiều dữ liệu', stages: ['Shape vào', 'Thao tác', 'Shape ra ?'], caption: 'Ghi tên từng trục trước khi đổi shape hoặc hoán vị trục.' },
  network: { title: 'Dữ liệu qua các lớp', stages: ['Đầu vào', 'Các lớp xử lý', 'Dự đoán ?'], caption: 'Theo chiều mũi tên; xác định dữ liệu nào đi vào mỗi lớp.' },
  training: { title: 'Một vòng học', stages: ['Tham số', 'Đánh giá sai số', 'Cập nhật ?'], caption: 'Tách bước tính sai số và bước cập nhật; đọc đúng dấu và tốc độ học.' },
  data: { title: 'Từ dữ liệu đến mô hình', stages: ['Dữ liệu', 'Mô hình', 'Đánh giá ?'], caption: 'Phân biệt dữ liệu đã có và kết quả cần dự đoán hoặc đánh giá.' },
  sequence: { title: 'Theo dõi từng thời điểm', stages: ['Trạng thái t', 'Quy tắc chuyển', 'Trạng thái t+1 ?'], caption: 'Ghi trạng thái ban đầu rồi theo dõi từng lần chuyển.' },
  base: { title: 'Đọc chữ số theo vị trí', stages: ['Chữ số', 'Cơ số / vị trí', 'Giá trị ?'], caption: 'Ghi cơ số và đánh số vị trí từ phải sang trái, bắt đầu ở 0.' },
  logic: { title: 'Theo dõi tín hiệu', stages: ['Bit đầu vào', 'Khối logic', 'Đầu ra ?'], caption: 'Xác định đầu vào và phép logic; đi theo dây nối để tìm đầu ra.' },
};

type Provenance = { source: 'prompt'; caption: string };
export type IllustrationSpec =
  | { kind: 'concept'; source: 'concept'; family: Family; concept: Concept }
  | (Provenance & { kind: 'vectors'; vectors: { name: string; values: number[] }[] })
  | (Provenance & { kind: 'matrices'; matrices: { name: string; rows: number[][] }[] })
  | (Provenance & { kind: 'numerals'; numerals: { digits: string; base: number }[] })
  | (Provenance & { kind: 'gate'; gate: string; inputs: { name: string; value: number }[] })
  | (Provenance & { kind: 'neuron'; inputs: number[]; weights: number[] });

function cleanPrompt(prompt: string): string {
  return prompt.replace(/[−–—﹣－]/g, '-')
    .replace(/\\+(?:cdot|times)\b/g, '·')
    .replace(/\\+[,;! ]/g, ' ').replace(/\u00a0/g, ' ');
}

function hasCompoundPrefix(prompt: string, assignmentStart: number): boolean {
  const prefix = prompt.slice(0, assignmentStart).trimEnd();
  return /(?:[ᵀ⁻¹²³^+*/·×}\d-]|\^[A-Za-z]+|(?:^|\s)[A-Za-z])$/.test(prefix);
}

function namedVectors(prompt: string): { name: string; values: number[] }[] {
  const out: { name: string; values: number[] }[] = [];
  // Require an explicit assignment. A tuple in a choice or a requested unknown
  // is not enough to infer that it is an input vector.
  const re = /\b([a-zA-Z](?:_[0-9])?)\s*=\s*\(\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)(?:\s*,\s*(-?\d+(?:\.\d+)?))?\s*\)/g;
  for (const m of prompt.matchAll(re)) {
    // u + v = (...) specifies a sum; it does not give v itself. A mixed
    // prompt with such an expression gets a conceptual fallback as a whole.
    if (hasCompoundPrefix(prompt, m.index!)) return [];
    const values = m.slice(2).filter((v) => v !== undefined).map(Number);
    if (values.every(Number.isFinite)) out.push({ name: m[1], values });
  }
  return out.slice(0, 3);
}

function namedMatrices(prompt: string): { name: string; rows: number[][] }[] {
  const out: { name: string; rows: number[][] }[] = [];
  const re = /(?:^|[\s($:;,])([A-Za-z])\s*=\s*(\[\s*\[[\d.,\s-]+\](?:\s*,\s*\[[\d.,\s-]+\]){0,3}\s*\])/g;
  for (const m of prompt.matchAll(re)) {
    // AᵀA, Aᵀ A, A · B, etc. name an expression, not the final
    // single-letter factor. Never relabel their value as A or B.
    if (hasCompoundPrefix(prompt, m.index!)) return [];
    try {
      const rows: unknown = JSON.parse(m[2]);
      if (!Array.isArray(rows) || rows.length === 0) continue;
      const width = Array.isArray(rows[0]) ? rows[0].length : 0;
      if (width < 1 || width > 4) continue;
      if (rows.every((row) => Array.isArray(row) && row.length === width && row.every((v) => typeof v === 'number' && Number.isFinite(v)))) {
        out.push({ name: m[1], rows });
      }
    } catch { /* Ambiguous text gets a conceptual illustration. */ }
  }
  return out.slice(0, 2);
}

function numeralsIn(prompt: string): { digits: string; base: number }[] {
  const subscript = '₀₁₂₃₄₅₆₇₈₉';
  const out: { digits: string; base: number }[] = [];
  const re = /(?:^|[^\p{L}\p{N}_-])([0-9A-F]+)([₀₁₂₃₄₅₆₇₈₉]+)/gu;
  for (const m of prompt.matchAll(re)) {
    const base = Number([...m[2]].map((digit) => subscript.indexOf(digit)).join(''));
    if (base < 2 || base > 16 || m[1].length > 12) continue;
    if ([...m[1]].every((digit) => parseInt(digit, 16) < base)) out.push({ digits: m[1], base });
  }
  return out.slice(0, 2);
}

function givenGate(prompt: string): { gate: string; inputs: { name: string; value: number }[] } | null {
  const gates = [...new Set(prompt.match(/\b(?:AND|OR|NAND|NOR|XOR|XNOR|NOT)\b/g) ?? [])];
  // Complex expressions need their own explicit circuit, never a guessed gate.
  if (gates.length !== 1 || /\b(?:AND|OR|NAND|NOR|XOR|XNOR|NOT)\b.*\b(?:AND|OR|NAND|NOR|XOR|XNOR|NOT)\b/.test(prompt)) return null;
  const inputs = [...prompt.matchAll(/\b([A-Z])\s*=\s*([01])(?![\d.])/g)]
    .filter((m) => !['Y', 'S', 'Q'].includes(m[1]))
    .map((m) => ({ name: m[1], value: Number(m[2]) }));
  const count = gates[0] === 'NOT' ? 1 : 2;
  if (inputs.length !== count || new Set(inputs.map((v) => v.name)).size !== count) return null;
  return { gate: gates[0], inputs };
}

/** Deterministic diagram of GIVEN data; never evaluates the exercise. The
 * component's revealed flag is intentionally unnecessary for this model. */
export function buildIllustration(input: IllustrationInput): IllustrationSpec {
  const family = SKILL_FAMILY[input.skillId] ?? 'function';
  const fallback = (): IllustrationSpec => ({ kind: 'concept', source: 'concept', family, concept: CONCEPTS[family] });
  // Drawing the requested vector would complete the student's drawing task.
  // Statements, ordered solution steps and alternatives are not prompt givens.
  if (['vector-drawing', 'true-false', 'step-ordering', 'matching', 'error-detection'].includes(input.type)) return fallback();
  const prompt = cleanPrompt(input.prompt);
  if (family === 'base' || input.skillId === 'digital_adder') {
    const numerals = numeralsIn(prompt);
    if (numerals.length) return { kind: 'numerals', source: 'prompt', numerals, caption: 'Chuỗi chữ số trong đề. Số bên dưới là vị trí, đếm từ phải sang trái và bắt đầu ở 0.' };
  }
  if (family === 'logic' || input.skillId === 'digital_function') {
    const gate = givenGate(prompt);
    if (gate) return { kind: 'gate', source: 'prompt', ...gate, caption: 'Đầu vào lấy từ đề. Theo dây qua khối logic để tìm đầu ra còn trống.' };
  }
  if (!['base', 'logic', 'sequence'].includes(family)) {
    const matrices = namedMatrices(prompt);
    if (matrices.length) return { kind: 'matrices', source: 'prompt', matrices, caption: 'Các ô giữ nguyên số liệu của đề. Đọc hàng ngang và cột dọc trước khi tính.' };
    const vectors = namedVectors(prompt);
    if (vectors.length && ['perceptron', 'neuron'].includes(input.skillId)) {
      // A threshold/bias changes the computation. Until the full expression
      // is modeled, use the conceptual network instead of dropping that input.
      if (/\bb\b|\bbias\b|ngưỡng|độ lệch/i.test(prompt)) return fallback();
      const x = vectors.find((v) => v.name === 'x');
      const w = vectors.find((v) => v.name === 'w');
      if (x && w && x.values.length === w.values.length) return { kind: 'neuron', source: 'prompt', inputs: x.values, weights: w.values, caption: 'Ghép từng đầu vào với trọng số. Hình chỉ biểu diễn phần tổng có trọng số, chưa gồm bias hay hàm kích hoạt.' };
    }
    if (vectors.length && (!SKILL_FAMILY[input.skillId] || ['vectors', 'space', 'eigen', 'decomposition', 'coordinates'].includes(family))) {
      return { kind: 'vectors', source: 'prompt', vectors, caption: 'Chỉ vẽ các vector đã cho; không vẽ vector kết quả. Các màu phân biệt từng vector.' };
    }
  }
  return fallback();
}
