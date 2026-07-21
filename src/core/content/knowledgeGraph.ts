import { SKILL_IDS } from './skills';

// ===========================================================================
// KNOWLEDGE GRAPH — đồ thị phụ thuộc giữa các skill (DAG).
// Cạnh [a, b] nghĩa là: nên nắm `a` TRƯỚC khi học `b`.
// Đây là nguồn sự thật duy nhất cho: Bản đồ tri thức (skill tree),
// Dependency highlight khi mở bài, và Recommendation engine.
// Chỉ chứa skill gốc (BASE_SKILLS); skill từ content module không bắt buộc có cạnh.
// ===========================================================================

export type Edge = [prereq: string, dependent: string];

export const PREREQ_EDGES: Edge[] = [
  // Ch0 — nền tảng
  ['coordinate_systems', 'vector_basics'],
  ['math_notation', 'vector_basics'],
  ['math_notation', 'linear_system'],

  // Ch1 — vector
  ['vector_basics', 'vector_addition'],
  ['vector_basics', 'scalar_multiplication'],
  ['vector_addition', 'linear_combination'],
  ['scalar_multiplication', 'linear_combination'],
  ['linear_combination', 'span'],
  ['vector_basics', 'dot_product'],
  ['trigonometry', 'dot_product'],
  ['vector_basics', 'cross_product'],
  ['trigonometry', 'cross_product'],

  // Ch2 — hệ phương trình
  ['linear_combination', 'linear_system'],
  ['linear_system', 'gaussian_elimination'],
  ['gaussian_elimination', 'solution_types'],

  // Ch3 — ma trận
  ['vector_basics', 'matrix_transformation'],
  ['linear_system', 'matrix_transformation'],
  ['matrix_transformation', 'matrix_multiplication'],
  ['matrix_transformation', 'determinant'],
  ['matrix_multiplication', 'matrix_inverse'],
  ['determinant', 'matrix_inverse'],
  ['matrix_multiplication', 'special_matrices'],

  // Ch4 — không gian vector
  ['span', 'subspace'],
  ['subspace', 'column_null_space'],
  ['gaussian_elimination', 'column_null_space'],
  ['linear_combination', 'linear_independence'],
  ['linear_independence', 'basis_dimension'],
  ['span', 'basis_dimension'],
  ['basis_dimension', 'change_of_basis'],
  ['matrix_inverse', 'change_of_basis'],
  ['column_null_space', 'rank'],
  ['basis_dimension', 'rank'],

  // Ch5 — eigen
  ['matrix_transformation', 'eigenvector'],
  ['determinant', 'characteristic_polynomial'],
  ['characteristic_polynomial', 'eigenvalue'],
  ['eigenvector', 'eigenvalue'],
  ['eigenvalue', 'eigenspace'],
  ['subspace', 'eigenspace'],
  ['eigenvalue', 'diagonalization'],
  ['basis_dimension', 'diagonalization'],
  ['change_of_basis', 'diagonalization'],
  ['diagonalization', 'matrix_powers'],

  // Ch8 — trực giao (đặt trước SVD vì SVD cần trực giao)
  ['dot_product', 'orthogonality'],
  ['orthogonality', 'projection'],
  ['projection', 'gram_schmidt'],
  ['gram_schmidt', 'qr_decomposition'],

  // Ch6 — SVD
  ['eigenvalue', 'singular_values'],
  ['singular_values', 'svd'],
  ['orthogonality', 'svd'],
  ['svd', 'rank_k_approximation'],
  ['rank', 'rank_k_approximation'],
  ['svd', 'pca'],
  ['projection', 'pca'],

  // Ch7 — ứng dụng code
  ['projection', 'least_squares'],
  ['matrix_inverse', 'least_squares'],
  ['matrix_powers', 'markov_pagerank'],
  ['eigenvalue', 'markov_pagerank'],

  // Ch9 — dạng toàn phương
  ['matrix_multiplication', 'quadratic_form'],
  ['dot_product', 'quadratic_form'],
  ['quadratic_form', 'definiteness'],
  ['eigenvalue', 'definiteness'],
  ['diagonalization', 'spectral_theorem'],
  ['orthogonality', 'spectral_theorem'],
  ['quadratic_form', 'conic_sections'],
  ['eigenvalue', 'conic_sections'],

  // Ch10 — học máy
  ['vector_basics', 'tensor_basics'],
  ['matrix_multiplication', 'tensor_basics'],
  ['tensor_basics', 'tensor_memory'],
  ['tensor_memory', 'tensor_ops'],
  ['least_squares', 'linear_regression_ml'],
  ['functions_graphs', 'linear_regression_ml'],
  ['linear_regression_ml', 'gradient_descent'],
  ['gradient_descent', 'softmax_regression'],
  ['linear_regression_ml', 'generalization'],

  // Ch11 — mạng nơ-ron
  ['dot_product', 'neuron'],
  ['gradient_descent', 'neuron'],
  ['neuron', 'activation_functions'],
  ['neuron', 'mlp'],
  ['matrix_multiplication', 'mlp'],
  ['mlp', 'forward_prop'],
  ['forward_prop', 'backprop'],
  ['gradient_descent', 'backprop'],

  // Ch12 — học sâu hiện đại
  ['mlp', 'cnn'],
  ['dot_product', 'cnn'],
  ['mlp', 'rnn'],
  ['dot_product', 'attention'],
  ['softmax_regression', 'attention'],
  ['vector_basics', 'word_embedding'],
  ['dot_product', 'word_embedding'],
  ['attention', 'transformer'],
  ['word_embedding', 'transformer'],

  // Ch13 — tối ưu & ứng dụng
  ['gradient_descent', 'sgd_optimizers'],
  ['backprop', 'sgd_optimizers'],
  ['mlp', 'batch_norm'],
  ['cnn', 'computer_vision'],
  ['transformer', 'nlp_lm'],
  ['word_embedding', 'nlp_lm'],
];

// ---- Chỉ mục cạnh (lazy, build một lần) ----
let prereqOf: Map<string, string[]> | null = null;
let dependentOf: Map<string, string[]> | null = null;

function buildIndex(): void {
  if (prereqOf) return;
  prereqOf = new Map();
  dependentOf = new Map();
  for (const [a, b] of PREREQ_EDGES) {
    if (!prereqOf.has(b)) prereqOf.set(b, []);
    prereqOf.get(b)!.push(a);
    if (!dependentOf.has(a)) dependentOf.set(a, []);
    dependentOf.get(a)!.push(b);
  }
}

/** Prereq TRỰC TIẾP của một skill. */
export function getPrereqs(skillId: string): string[] {
  buildIndex();
  return prereqOf!.get(skillId) ?? [];
}

/** Skill phụ thuộc TRỰC TIẾP vào skillId. */
export function getDependents(skillId: string): string[] {
  buildIndex();
  return dependentOf!.get(skillId) ?? [];
}

/** Toàn bộ prereq (bắc cầu), gần trước xa sau, không trùng lặp. */
export function getAllPrereqs(skillId: string): string[] {
  buildIndex();
  const out: string[] = [];
  const seen = new Set<string>([skillId]);
  const queue = [...getPrereqs(skillId)];
  while (queue.length) {
    const id = queue.shift()!;
    if (seen.has(id)) continue;
    seen.add(id);
    out.push(id);
    queue.push(...getPrereqs(id));
  }
  return out;
}

/**
 * Prereq TRỰC TIẾP chưa đạt của một skill.
 * masteryOf trả về mastery 0..1 của skill (0 nếu chưa học).
 */
export function getUnmetPrereqs(
  skillId: string,
  masteryOf: (id: string) => number,
  threshold = 0.4,
): string[] {
  return getPrereqs(skillId).filter((id) => masteryOf(id) < threshold);
}

/** Gom prereq chưa đạt cho MỘT NHÓM skill (vd mọi skill trong một bài học). */
export function getUnmetPrereqsForSkills(
  skillIds: string[],
  masteryOf: (id: string) => number,
  threshold = 0.4,
): string[] {
  const own = new Set(skillIds);
  const out: string[] = [];
  for (const s of skillIds) {
    for (const p of getUnmetPrereqs(s, masteryOf, threshold)) {
      if (!own.has(p) && !out.includes(p)) out.push(p);
    }
  }
  return out;
}

/** Phân lớp topo (longest-path) để vẽ skill tree: trả về mảng các lớp. */
export function topoLayers(): string[][] {
  buildIndex();
  const ids = SKILL_IDS.filter(
    (id) => prereqOf!.has(id) || dependentOf!.has(id),
  );
  const depth = new Map<string, number>();
  const visit = (id: string, stack: Set<string>): number => {
    if (depth.has(id)) return depth.get(id)!;
    if (stack.has(id)) return 0; // chu trình (không nên xảy ra) — cắt để an toàn
    stack.add(id);
    const ps = prereqOf!.get(id) ?? [];
    const d = ps.length === 0 ? 0 : Math.max(...ps.map((p) => visit(p, stack))) + 1;
    stack.delete(id);
    depth.set(id, d);
    return d;
  };
  ids.forEach((id) => visit(id, new Set()));
  const layers: string[][] = [];
  for (const id of ids) {
    const d = depth.get(id) ?? 0;
    (layers[d] ??= []).push(id);
  }
  return layers.filter(Boolean);
}

/** Kiểm tra dữ liệu (dev): id lạ hoặc chu trình. Trả về danh sách lỗi. */
export function validateGraph(): string[] {
  const errors: string[] = [];
  const valid = new Set(SKILL_IDS);
  for (const [a, b] of PREREQ_EDGES) {
    if (!valid.has(a)) errors.push(`Cạnh [${a} → ${b}]: '${a}' không tồn tại trong SKILLS`);
    if (!valid.has(b)) errors.push(`Cạnh [${a} → ${b}]: '${b}' không tồn tại trong SKILLS`);
  }
  // Phát hiện chu trình bằng DFS màu.
  buildIndex();
  const color = new Map<string, 1 | 2>();
  const dfs = (id: string, path: string[]): void => {
    color.set(id, 1);
    for (const next of dependentOf!.get(id) ?? []) {
      if (color.get(next) === 1) {
        errors.push(`Chu trình: ${[...path, id, next].join(' → ')}`);
      } else if (!color.get(next)) {
        dfs(next, [...path, id]);
      }
    }
    color.set(id, 2);
  };
  for (const id of SKILL_IDS) if (!color.get(id)) dfs(id, []);
  return errors;
}
