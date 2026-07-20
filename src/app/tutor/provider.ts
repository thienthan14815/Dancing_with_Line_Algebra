// ===========================================================================
// AI TUTOR — Trợ giảng gợi ý theo 4 cấp Socratic (tài liệu §6).
//
// RÀNG BUỘC TRUNG THỰC: file này KHÔNG gọi LLM/AI thật và KHÔNG gọi mạng.
// Provider mặc định là `HeuristicTutor` — chạy hoàn toàn cục bộ, dựa trên:
//   1) gợi ý (Hint) do tác giả viết sẵn trong mỗi Exercise, và
//   2) phản hồi + errorType do engine chấm (CheckResult) sinh ra.
//
// Một "hook" `LLMTutor` được để sẵn (có tài liệu) để cắm LLM sau này. Nó nhận
// cấu hình endpoint/api-key và DỰNG prompt, nhưng KHÔNG hiện thực lời gọi mạng
// — hiện tại nó ủy quyền về HeuristicTutor để app vẫn chạy offline.
// ===========================================================================

import type { Exercise, CheckResult } from '../../core/exercises/types';
import { pickHint } from '../../core/exercises/engine';

/** Bậc gợi ý Socratic: 1 (nhẹ nhất) → 4 (gần như lời giải). */
export type HintLevel = 1 | 2 | 3 | 4;

/** Ngữ cảnh truyền cho trợ giảng ở mỗi lượt yêu cầu. */
export interface TutorContext {
  exercise: Exercise;
  /** Kết quả chấm gần nhất (nếu người học đã bấm "Kiểm tra"). */
  lastResult?: CheckResult;
  level: HintLevel;
}

/**
 * Giao diện chung cho MỌI nguồn trợ giảng (heuristic cục bộ HOẶC LLM sau này).
 * `hint` cho phép trả về Promise để tương thích với provider gọi mạng bất đồng bộ.
 */
export interface TutorProvider {
  /** Sinh gợi ý ở đúng cấp `ctx.level`. */
  hint(ctx: TutorContext): Promise<string> | string;
  /** Diễn giải errorType (từ `ctx.lastResult`) thành lời khuyên tiếng Việt cụ thể. */
  analyzeError(ctx: TutorContext): string;
}

// ---------------------------------------------------------------------------
// HEURISTIC TUTOR (mặc định — cục bộ, không mạng)
// ---------------------------------------------------------------------------

export class HeuristicTutor implements TutorProvider {
  hint(ctx: TutorContext): string {
    const { exercise, level, lastResult } = ctx;
    switch (level) {
      case 1:
        return authoredAt(exercise, 1) ?? conceptReminder(exercise);
      case 2:
        return authoredAt(exercise, 2) ?? stepHint(exercise);
      case 3:
        return authoredAt(exercise, 3) ?? partialReveal(exercise);
      case 4:
        return fullExplanation(exercise, lastResult);
      default: {
        const _exhaustive: never = level;
        return String(_exhaustive);
      }
    }
  }

  analyzeError(ctx: TutorContext): string {
    const err = ctx.lastResult?.errorType;
    if (!err) return GENERIC_ADVICE;
    return ERROR_ADVICE[err] ?? GENERIC_ADVICE;
  }
}

// ---------------------------------------------------------------------------
// NGUỒN GỢI Ý AUTHORED (ưu tiên) + suy diễn heuristic (dự phòng)
// ---------------------------------------------------------------------------

/**
 * Lấy gợi ý tác giả viết ĐÚNG ở bậc `level`.
 *
 * Dùng `pickHint` của engine (như hợp đồng yêu cầu), nhưng chỉ chấp nhận khi
 * gợi ý trả về đúng ở bậc `level`. `pickHint` sẽ trả gợi ý ở bậc CAO NHẤT ≤ level,
 * nên nếu bài chỉ có gợi ý bậc thấp thì ta bỏ qua (để tránh lặp lại y hệt cấp
 * dưới) và chuyển sang suy diễn heuristic phù hợp với từng cấp.
 */
function authoredAt(ex: Exercise, level: HintLevel): string | undefined {
  const h = pickHint(ex, level);
  return h && h.level === level ? h.text : undefined;
}

/** CẤP 1 — nhắc khái niệm cốt lõi, suy từ skill của bài. */
function conceptReminder(ex: Exercise): string {
  const concept = CONCEPT_BY_SKILL[ex.skillId];
  const head = concept ?? `khái niệm "${humanizeSkill(ex.skillId)}"`;
  return `Hãy nhớ lại ${head} Bắt đầu từ định nghĩa và tự hỏi: dữ kiện của đề liên quan tới định nghĩa đó như thế nào?`;
}

/** CẤP 2 — chỉ ra bước cần làm, tùy theo dạng bài. */
function stepHint(ex: Exercise): string {
  switch (ex.type) {
    case 'multiple-choice':
      return 'Loại trừ dần: đối chiếu từng phương án với định nghĩa, gạch bỏ các phương án mâu thuẫn rồi giữ lại phương án còn hợp lý nhất.';
    case 'numeric-input':
      return 'Viết ra công thức liên quan, thay số vào từng đại lượng rồi tính TUẦN TỰ từng bước — đừng nhảy bước để tránh sai sót.';
    case 'matrix-input':
      return 'Tính riêng từng phần tử (i, j) một. Với phép nhân ma trận, phần tử (i, j) = hàng i của ma trận trái nhân vô hướng với cột j của ma trận phải.';
    case 'matching':
      return 'Bắt đầu từ mục bạn chắc chắn nhất: ghép nó trước để loại bớt lựa chọn, rồi thu hẹp dần cho các mục còn lại.';
    case 'step-ordering':
      return 'Xác định bước nào PHẢI làm đầu tiên (điều kiện tiên quyết), rồi lần lượt hỏi: bước tiếp theo phụ thuộc vào kết quả của bước nào?';
    case 'vector-drawing':
      return 'Tách theo thành phần: đi ngang theo x trước, rồi đi dọc theo y. Điểm ngọn của vector chính là tọa độ (x, y).';
    case 'error-detection':
      return 'Rà từng dòng theo thứ tự từ trên xuống. Dòng ĐẦU TIÊN mà kết quả không suy ra hợp lệ từ dòng ngay trên chính là chỗ sai.';
    case 'true-false':
      return 'Thử tìm một phản ví dụ: nếu tồn tại một trường hợp làm mệnh đề sai thì đáp án là "Sai"; nếu chứng minh được luôn đúng thì là "Đúng".';
    default: {
      const _exhaustive: never = ex;
      return String(_exhaustive);
    }
  }
}

/** CẤP 3 — gợi ý mạnh: hé lộ MỘT PHẦN đáp án (không phải toàn bộ). */
function partialReveal(ex: Exercise): string {
  switch (ex.type) {
    case 'multiple-choice': {
      const correct = ex.options[ex.answerIndex] ?? '';
      const clue = correct.slice(0, Math.max(1, Math.ceil(correct.length / 3)));
      return `Gợi ý mạnh: đáp án đúng bắt đầu bằng "${clue}…". Đối chiếu manh mối này với các phương án để chốt.`;
    }
    case 'numeric-input': {
      const a = ex.answer;
      const sign = a > 0 ? 'dương' : a < 0 ? 'âm' : 'bằng 0';
      const mag = Math.abs(a);
      const digits = Math.abs(Math.trunc(mag)).toString().length;
      return `Gợi ý mạnh: đáp án là số ${sign}, phần nguyên có khoảng ${digits} chữ số. Hãy ước lượng độ lớn rồi tính chính xác lại.`;
    }
    case 'matrix-input': {
      const first = ex.answer[0]?.[0];
      return `Gợi ý mạnh: phần tử (1, 1) của đáp án là ${first}. Dùng đúng cách tính đó cho các ô còn lại.`;
    }
    case 'matching': {
      const p = ex.pairs[0];
      if (!p) return 'Gợi ý mạnh: hãy ghép trước cặp mà bạn chắc chắn nhất rồi suy ra phần còn lại.';
      return `Gợi ý mạnh: "${ex.left[p[0]] ?? p[0]}" ghép với "${ex.right[p[1]] ?? p[1]}". Từ đó suy ra các cặp còn lại.`;
    }
    case 'step-ordering':
      return `Gợi ý mạnh: bước ĐẦU TIÊN đúng là "${ex.steps[0] ?? '?'}". Tiếp tục xếp các bước sau theo quan hệ phụ thuộc.`;
    case 'vector-drawing':
      return `Gợi ý mạnh: thành phần x của vector là ${ex.target[0]}. Bạn tự xác định thành phần y để tới đúng đích.`;
    case 'error-detection': {
      const mid = Math.floor(ex.lines.length / 2);
      const half = ex.wrongLineIndex < mid ? 'NỬA TRÊN' : 'NỬA DƯỚI';
      return `Gợi ý mạnh: chỗ sai nằm ở ${half} của lời giải. Soi kỹ từng dòng trong vùng đó.`;
    }
    case 'true-false':
      return `Gợi ý mạnh: hãy nghiêng về đáp án "${ex.answer ? 'Đúng' : 'Sai'}" và tự kiểm chứng lý do trước khi chốt.`;
    default: {
      const _exhaustive: never = ex;
      return String(_exhaustive);
    }
  }
}

/**
 * CẤP 4 — giải thích đầy đủ.
 * Ưu tiên gộp: gợi ý bậc 4 của tác giả (nếu có) + phản hồi & detailSteps của
 * engine (khi đã chấm) + lời giải chuẩn suy từ dữ liệu bài.
 */
function fullExplanation(ex: Exercise, lastResult?: CheckResult): string {
  const parts: string[] = [];

  const authored4 = pickHint(ex, 4);
  if (authored4 && authored4.level === 4) parts.push(authored4.text);

  if (lastResult) {
    parts.push(lastResult.feedback);
    if (lastResult.detailSteps && lastResult.detailSteps.length > 0) {
      parts.push(lastResult.detailSteps.join('\n'));
    }
  }

  parts.push(canonicalSolution(ex));

  // Khử trùng lặp (feedback engine đôi khi đã chứa explain).
  const seen = new Set<string>();
  const unique = parts
    .map((p) => p.trim())
    .filter((p) => p.length > 0 && !seen.has(p) && (seen.add(p), true));
  return unique.join('\n\n');
}

/** Lời giải chuẩn suy trực tiếp từ dữ liệu của Exercise. */
function canonicalSolution(ex: Exercise): string {
  switch (ex.type) {
    case 'multiple-choice':
      return `Đáp án đúng: "${ex.options[ex.answerIndex]}". ${ex.explain}`.trim();
    case 'numeric-input': {
      const unit = ex.unit ? ` ${ex.unit}` : '';
      return `Đáp án đúng: ${ex.answer}${unit}.${ex.explain ? ` ${ex.explain}` : ''}`;
    }
    case 'matrix-input':
      return `Đáp án đúng:\n${formatMatrix(ex.answer)}${ex.explain ? `\n${ex.explain}` : ''}`;
    case 'matching': {
      const lines = ex.pairs.map(
        ([l, r]) => `• "${ex.left[l] ?? l}" ↔ "${ex.right[r] ?? r}"`,
      );
      return `Các cặp đúng:\n${lines.join('\n')}${ex.explain ? `\n${ex.explain}` : ''}`;
    }
    case 'step-ordering': {
      const lines = ex.steps.map((s, i) => `${i + 1}. ${s}`);
      return `Trình tự đúng:\n${lines.join('\n')}${ex.explain ? `\n${ex.explain}` : ''}`;
    }
    case 'vector-drawing':
      return `Vector đúng: (${ex.target[0]}, ${ex.target[1]}).${ex.explain ? ` ${ex.explain}` : ''}`;
    case 'error-detection':
      return `Chỗ sai là dòng ${ex.wrongLineIndex + 1}: "${ex.lines[ex.wrongLineIndex]}". ${ex.explain}`.trim();
    case 'true-false':
      return `Mệnh đề này ${ex.answer ? 'ĐÚNG' : 'SAI'}. ${ex.explain}`.trim();
    default: {
      const _exhaustive: never = ex;
      return String(_exhaustive);
    }
  }
}

// ---------------------------------------------------------------------------
// PHÂN TÍCH LỖI: errorType → lời khuyên tiếng Việt cụ thể
// (bao phủ toàn bộ taxonomy engine phát ra — xem types.ts §2.4)
// ---------------------------------------------------------------------------

const GENERIC_ADVICE =
  'Hãy xem lại phản hồi chi tiết ở trên, đối chiếu từng bước với quy tắc của dạng bài rồi thử lại một cách chậm rãi.';

const ERROR_ADVICE: Record<string, string> = {
  SIGN_ERROR:
    'Chú ý dấu: kiểm tra lại dấu (+/−) của từng số hạng. Lỗi dấu thường đến từ việc phân phối dấu trừ trong ngoặc hoặc quên đổi dấu khi chuyển vế.',
  ARITHMETIC_ERROR:
    'Sai số học: tính lại thật chậm, tách phép lớn thành các bước nhỏ và soát lại từng phép nhân/cộng — sai sót thường ở một bước trung gian.',
  ROW_COLUMN_MISMATCH:
    'Nhầm hàng–cột: phần tử (i, j) = hàng i của A nhân vô hướng với cột j của B. Kiểm tra số CỘT của A đúng bằng số HÀNG của B thì phép nhân mới hợp lệ.',
  INVALID_MATRIX_DIMENSION:
    'Sai kích thước ma trận: xác định lại kết quả phải là ma trận bao nhiêu hàng × bao nhiêu cột TRƯỚC khi điền, rồi đối chiếu.',
  WRONG_ELIMINATION_OPERATION:
    'Phép biến đổi hàng chưa hợp lệ: chỉ được (1) đổi chỗ hai hàng, (2) nhân một hàng với số khác 0, (3) cộng bội của hàng này vào hàng khác. Làm lần lượt từ trên xuống để tạo số 0 dưới mỗi trụ (pivot).',
  CONFUSED_EIGENVALUE_WITH_EIGENVECTOR:
    'Đừng lẫn giá trị riêng với vector riêng: eigenvalue $\\lambda$ là một SỐ thỏa $Av=\\lambda v$; eigenvector $v$ là VECTOR khác 0 tương ứng. Giải $\\det(A-\\lambda I)=0$ tìm $\\lambda$ trước, rồi thế vào tìm $v$.',
  DEPENDENCE_REASONING_ERROR:
    'Lập luận phụ thuộc tuyến tính chưa chặt: một tập độc lập tuyến tính khi tổ hợp $c_1v_1+\\dots+c_kv_k=0$ CHỈ có nghiệm tầm thường (mọi $c_i=0$). Hãy kiểm bằng hạng ma trận hoặc định thức.',
  CONCEPTUAL_ERROR:
    'Lỗi khái niệm: quay lại đúng định nghĩa cốt lõi của chủ đề và đối chiếu từng lựa chọn với định nghĩa đó, đừng chọn theo cảm tính.',
  MATCHING_ERROR:
    'Ghép cặp sai: đối chiếu từng mục bên trái với đúng định nghĩa của nó ở bên phải. Ghép các cặp bạn chắc chắn trước để thu hẹp dần lựa chọn.',
  ORDERING_ERROR:
    'Sai thứ tự: phân biệt bước tiên quyết (phải có trước) và bước phụ thuộc (làm sau). Sắp xếp theo quan hệ nhân–quả giữa các bước.',
  DIRECTION_ERROR:
    'Sai hướng vector: tách riêng thành phần x (đi ngang) và y (đi dọc), rồi kiểm tra dấu và độ lớn của TỪNG thành phần so với mục tiêu.',
  DETECTION_MISS:
    'Chưa tìm đúng dòng sai: rà lại từng dòng theo thứ tự; dòng đầu tiên không suy ra được hợp lệ từ dòng ngay trên nó chính là lỗi.',
  INVALID_INPUT:
    'Chưa nhập/chọn đáp án hợp lệ: hãy điền đầy đủ và đúng định dạng (một con số, đủ các ô ma trận, hoặc một lựa chọn) rồi mới kiểm tra.',
};

// ---------------------------------------------------------------------------
// Bản đồ khái niệm theo skill (dùng cho gợi ý CẤP 1 khi bài không có Hint bậc 1)
// ---------------------------------------------------------------------------

const CONCEPT_BY_SKILL: Record<string, string> = {
  vector_basics: 'vector là đại lượng có ĐỘ LỚN và HƯỚNG, biểu diễn bằng bộ tọa độ.',
  vector_addition: 'cộng vector = cộng từng thành phần tương ứng (quy tắc hình bình hành).',
  scalar_multiplication: 'nhân vô hướng $k\\,v$ chỉ co giãn độ lớn (và đảo hướng nếu $k<0$), không đổi phương.',
  linear_combination: 'tổ hợp tuyến tính là tổng các vector đã nhân hệ số: $c_1v_1+c_2v_2+\\dots$',
  span: 'span của một tập vector là TẤT CẢ tổ hợp tuyến tính của chúng.',
  dot_product: 'tích vô hướng $a\\cdot b=\\sum a_i b_i$ đo mức "cùng hướng"; bằng 0 nghĩa là vuông góc.',
  cross_product: 'tích có hướng cho vector VUÔNG GÓC với cả hai vector ban đầu, độ lớn = diện tích hình bình hành.',
  linear_system: 'hệ phương trình tuyến tính có thể viết gọn dạng $Ax=b$.',
  gaussian_elimination: 'khử Gauss dùng các phép biến đổi hàng để đưa ma trận về dạng bậc thang.',
  solution_types: 'một hệ có thể vô nghiệm, nghiệm duy nhất, hoặc vô số nghiệm — tùy hạng và số ẩn.',
  matrix_transformation: 'ma trận là một PHÉP BIẾN ĐỔI tuyến tính: cột thứ i cho biết ảnh của vector cơ sở $e_i$.',
  matrix_multiplication: 'phần tử (i, j) của tích = hàng i (trái) nhân vô hướng cột j (phải).',
  determinant: 'định thức đo hệ số co giãn DIỆN TÍCH/THỂ TÍCH; bằng 0 nghĩa là ma trận suy biến (không khả nghịch).',
  matrix_inverse: 'ma trận nghịch đảo $A^{-1}$ hoàn tác phép biến đổi: $AA^{-1}=I$; chỉ tồn tại khi $\\det A\\ne 0$.',
  eigenvalue: 'giá trị riêng $\\lambda$ là số sao cho $Av=\\lambda v$ với vector $v\\ne 0$ nào đó.',
  eigenvector: 'vector riêng là hướng KHÔNG bị đổi phương qua phép biến đổi, chỉ bị co giãn theo $\\lambda$.',
  characteristic_polynomial: 'đa thức đặc trưng $\\det(A-\\lambda I)=0$ cho ra các giá trị riêng.',
  linear_independence: 'một tập độc lập tuyến tính nếu không vector nào là tổ hợp của các vector còn lại.',
  basis_dimension: 'cơ sở là tập độc lập tuyến tính và sinh ra toàn bộ không gian; số phần tử = số chiều.',
  rank: 'hạng = số hàng (hay cột) độc lập tuyến tính = số trụ sau khi khử.',
  orthogonality: 'hai vector trực giao khi tích vô hướng của chúng bằng 0.',
  projection: 'phép chiếu $v$ lên $u$ là thành phần của $v$ theo phương $u$.',
  quadratic_form: 'dạng toàn phương $x^{T}Ax$ với $A$ đối xứng; dấu của nó do các giá trị riêng quyết định.',
};

// ---------------------------------------------------------------------------
// Tiện ích
// ---------------------------------------------------------------------------

/** 'dot_product' → 'dot product' (dự phòng khi không có concept map & không có Hint). */
function humanizeSkill(skillId: string): string {
  return skillId.replace(/_/g, ' ');
}

function formatMatrix(m: number[][]): string {
  return m.map((row) => `[ ${row.join('  ')} ]`).join('\n');
}

// ===========================================================================
// HOOK LLM TƯƠNG LAI (để sẵn — KHÔNG hiện thực lời gọi mạng)
// ===========================================================================

/**
 * Cấu hình để cắm một LLM thật sau này.
 *
 * LƯU Ý TRUNG THỰC: `apiKey` PHẢI do người dùng cung cấp lúc chạy (nhập trong
 * phần cài đặt của app), TUYỆT ĐỐI không hard-code trong mã nguồn.
 */
export interface LLMTutorConfig {
  /** vd 'https://api.anthropic.com/v1/messages'. */
  endpoint: string;
  /** Khóa API do NGƯỜI DÙNG nhập — không lưu trong repo. */
  apiKey: string;
  /** vd 'claude-...'. */
  model?: string;
  /** System prompt định hình phong cách Socratic (không đưa thẳng đáp án ở cấp thấp). */
  systemPrompt?: string;
}

/**
 * Dựng prompt Socratic từ ngữ cảnh — dùng chung cho LLM tương lai.
 * Tách riêng để phần "xây prompt" có thể kiểm thử mà không cần mạng.
 */
export function buildSocraticPrompt(ctx: TutorContext, config: LLMTutorConfig): string {
  const { exercise, level, lastResult } = ctx;
  const goalByLevel: Record<HintLevel, string> = {
    1: 'chỉ NHẮC LẠI khái niệm liên quan, tuyệt đối chưa nêu bước làm.',
    2: 'chỉ ra BƯỚC KẾ TIẾP cần làm, chưa đưa con số/đáp án.',
    3: 'đưa gợi ý MẠNH, hé lộ một phần đáp án nhưng vẫn để người học tự hoàn thành.',
    4: 'giải thích ĐẦY ĐỦ kèm lời giải chuẩn và lý do.',
  };
  return [
    config.systemPrompt ??
      'Bạn là trợ giảng Đại số tuyến tính theo phương pháp Socratic. Không đưa đáp án sớm hơn cấp được yêu cầu.',
    `Mô hình: ${config.model ?? '(mặc định)'}`,
    `Cấp gợi ý: ${level} — mục tiêu: ${goalByLevel[level]}`,
    `Kỹ năng (skill): ${exercise.skillId}`,
    `Đề bài: ${exercise.prompt}`,
    lastResult
      ? `Kết quả gần nhất: ${lastResult.correct ? 'đúng' : 'sai'}${
          lastResult.errorType ? ` (loại lỗi: ${lastResult.errorType})` : ''
        }. Phản hồi engine: ${lastResult.feedback}`
      : 'Người học chưa nộp đáp án.',
    'Hãy trả lời ngắn gọn bằng tiếng Việt, đúng phạm vi của cấp gợi ý.',
  ].join('\n');
}

/**
 * Provider LLM (STUB có tài liệu — CHƯA gọi mạng).
 *
 * Cách hoàn thiện sau này: tại "ĐIỂM CẮM LLM" bên dưới, thay phần ủy quyền về
 * heuristic bằng lời gọi `fetch(config.endpoint, …)` với khóa của người dùng, ví dụ:
 *
 *   const res = await fetch(this.config.endpoint, {
 *     method: 'POST',
 *     headers: { 'content-type': 'application/json', 'x-api-key': this.config.apiKey },
 *     body: JSON.stringify({ model: this.config.model, messages: [{ role: 'user', content: prompt }] }),
 *   });
 *   const data = await res.json();
 *   return extractText(data);
 *
 * Hiện tại KHÔNG gọi mạng: mọi lượt hint/analyzeError đều rơi về `fallback`
 * (HeuristicTutor) để app hoạt động hoàn toàn offline và trung thực.
 */
export class LLMTutor implements TutorProvider {
  constructor(
    private readonly config: LLMTutorConfig,
    private readonly fallback: TutorProvider = new HeuristicTutor(),
  ) {}

  async hint(ctx: TutorContext): Promise<string> {
    // Dựng sẵn prompt (dùng khi cắm mạng); hiện tại chỉ để minh họa hook.
    const prompt = buildSocraticPrompt(ctx, this.config);
    void prompt; // ĐIỂM CẮM LLM: gọi mạng ở đây trong tương lai.
    return this.fallback.hint(ctx);
  }

  analyzeError(ctx: TutorContext): string {
    // Có thể thay bằng lời gọi LLM riêng cho phân tích lỗi; hiện dùng heuristic.
    return this.fallback.analyzeError(ctx);
  }
}
