import type {
  Exercise,
  CheckResult,
  Hint,
  MultipleChoiceExercise,
  NumericInputExercise,
  MatrixInputExercise,
  MatchingExercise,
  StepOrderingExercise,
  VectorDrawingExercise,
  ErrorDetectionExercise,
  TrueFalseExercise,
} from './types';

// ===========================================================================
// EXERCISE ENGINE — chấm đáp án + sinh phản hồi SÂU (không chỉ đúng/sai).
// Thuần logic: không UI, không random, không side-effect.
// ===========================================================================

const EPS = 1e-9;

function approxEqual(a: number, b: number, tol: number): boolean {
  return Math.abs(a - b) <= tol + EPS;
}

/** Dispatch theo ex.type. Trả về CheckResult với feedback + errorType (nếu suy ra được). */
export function checkExercise(ex: Exercise, answer: unknown): CheckResult {
  switch (ex.type) {
    case 'multiple-choice':
      return checkMultipleChoice(ex, answer);
    case 'numeric-input':
      return checkNumeric(ex, answer);
    case 'matrix-input':
      return checkMatrix(ex, answer);
    case 'matching':
      return checkMatching(ex, answer);
    case 'step-ordering':
      return checkStepOrdering(ex, answer);
    case 'vector-drawing':
      return checkVectorDrawing(ex, answer);
    case 'error-detection':
      return checkErrorDetection(ex, answer);
    case 'true-false':
      return checkTrueFalse(ex, answer);
    default: {
      // Bảo đảm xử lý đầy đủ union tại compile-time.
      const _exhaustive: never = ex;
      return {
        correct: false,
        errorType: 'INVALID_INPUT',
        feedback: 'Dạng bài không được hỗ trợ.',
        detailSteps: [String(_exhaustive)],
      };
    }
  }
}

// --- multiple-choice -------------------------------------------------------
function checkMultipleChoice(ex: MultipleChoiceExercise, answer: unknown): CheckResult {
  if (typeof answer !== 'number' || !Number.isInteger(answer)) {
    return invalidInput('Hãy chọn một đáp án.');
  }
  if (answer === ex.answerIndex) {
    return {
      correct: true,
      feedback: `Chính xác! ${ex.explain}`,
    };
  }
  const chosen = ex.options[answer];
  return {
    correct: false,
    errorType: 'CONCEPTUAL_ERROR',
    feedback:
      `Chưa đúng. Bạn chọn "${chosen ?? '(không hợp lệ)'}". ` +
      `Đáp án đúng là "${ex.options[ex.answerIndex]}". ${ex.explain}`,
  };
}

// --- numeric-input ---------------------------------------------------------
function checkNumeric(ex: NumericInputExercise, answer: unknown): CheckResult {
  const val = toNumber(answer);
  if (val === undefined) return invalidInput('Hãy nhập một con số.');

  const tol = ex.tolerance ?? 0;
  const unit = ex.unit ? ` ${ex.unit}` : '';
  if (approxEqual(val, ex.answer, tol)) {
    return {
      correct: true,
      feedback: `Chính xác! Kết quả đúng là ${ex.answer}${unit}.` + tail(ex.explain),
    };
  }
  // Suy ra loại lỗi.
  if (Math.abs(ex.answer) > EPS && approxEqual(val, -ex.answer, tol)) {
    return {
      correct: false,
      errorType: 'SIGN_ERROR',
      feedback:
        `Sai dấu. Bạn nhập ${val}${unit} nhưng đáp án đúng là ${ex.answer}${unit}. ` +
        `Hãy kiểm tra lại dấu (+/−) ở từng số hạng.` + tail(ex.explain),
    };
  }
  return {
    correct: false,
    errorType: 'ARITHMETIC_ERROR',
    feedback:
      `Chưa đúng. Bạn nhập ${val}${unit}, đáp án đúng là ${ex.answer}${unit}. ` +
      `Hãy tính lại cẩn thận từng bước.` + tail(ex.explain),
  };
}

// --- matrix-input ----------------------------------------------------------
function checkMatrix(ex: MatrixInputExercise, answer: unknown): CheckResult {
  const M = toMatrix(answer);
  if (!M) return invalidInput('Hãy điền đầy đủ các ô của ma trận bằng số.');

  if (M.length !== ex.rows || M.some((r) => r.length !== ex.cols)) {
    return {
      correct: false,
      errorType: 'INVALID_MATRIX_DIMENSION',
      feedback:
        `Sai kích thước. Kết quả phải là ma trận ${ex.rows}×${ex.cols}, ` +
        `nhưng bạn nhập ${M.length}×${M[0]?.length ?? 0}.` + tail(ex.explain),
    };
  }

  const tol = ex.tolerance ?? 0;
  const wrongCells: string[] = [];
  let allSignFlipped = true;
  for (let i = 0; i < ex.rows; i++) {
    for (let j = 0; j < ex.cols; j++) {
      const expected = ex.answer[i][j];
      const got = M[i][j];
      if (!approxEqual(got, expected, tol)) {
        wrongCells.push(`(${i + 1},${j + 1}): bạn ghi ${got}, đúng là ${expected}`);
        if (!(Math.abs(expected) > EPS && approxEqual(got, -expected, tol))) {
          allSignFlipped = false;
        }
      }
    }
  }

  if (wrongCells.length === 0) {
    return {
      correct: true,
      feedback: 'Chính xác! Mọi phần tử của ma trận đều đúng.' + tail(ex.explain),
    };
  }
  if (allSignFlipped) {
    return {
      correct: false,
      errorType: 'SIGN_ERROR',
      feedback:
        'Các phần tử sai đều bị ngược dấu — hãy soát lại dấu (+/−).' + tail(ex.explain),
      detailSteps: wrongCells,
    };
  }
  return {
    correct: false,
    errorType: 'ARITHMETIC_ERROR',
    feedback:
      `Có ${wrongCells.length} ô chưa đúng. Nhớ: phần tử (i, j) tính từ hàng i và cột j.` +
      tail(ex.explain),
    detailSteps: wrongCells,
  };
}

// --- matching --------------------------------------------------------------
function checkMatching(ex: MatchingExercise, answer: unknown): CheckResult {
  const given = toPairs(answer);
  if (!given) return invalidInput('Hãy ghép các cặp trước khi kiểm tra.');

  const correctSet = new Set(ex.pairs.map(([l, r]) => `${l}-${r}`));
  const givenSet = new Set(given.map(([l, r]) => `${l}-${r}`));

  const wrong: string[] = [];
  for (const [l, r] of given) {
    if (!correctSet.has(`${l}-${r}`)) {
      wrong.push(`"${ex.left[l] ?? l}" không ghép với "${ex.right[r] ?? r}"`);
    }
  }
  const missing = ex.pairs.length - given.filter(([l, r]) => correctSet.has(`${l}-${r}`)).length;

  if (wrong.length === 0 && givenSet.size === correctSet.size && missing === 0) {
    return {
      correct: true,
      feedback: 'Chính xác! Mọi cặp đều được ghép đúng.' + tail(ex.explain),
    };
  }
  return {
    correct: false,
    errorType: 'MATCHING_ERROR',
    feedback:
      `Còn ${wrong.length} cặp ghép sai. Hãy đối chiếu lại định nghĩa của từng mục.` +
      tail(ex.explain),
    detailSteps: wrong,
  };
}

// --- step-ordering ---------------------------------------------------------
function checkStepOrdering(ex: StepOrderingExercise, answer: unknown): CheckResult {
  const order = toStepOrder(answer, ex.steps);
  if (!order) return invalidInput('Hãy sắp xếp các bước trước khi kiểm tra.');

  const correct = order.every((s, i) => s === ex.steps[i]) && order.length === ex.steps.length;
  if (correct) {
    return {
      correct: true,
      feedback: 'Chính xác! Trình tự các bước đã đúng.' + tail(ex.explain),
    };
  }
  const firstWrong = order.findIndex((s, i) => s !== ex.steps[i]);
  const errorType = /gauss|elimination|khử/i.test(ex.skillId + ' ' + ex.prompt)
    ? 'WRONG_ELIMINATION_OPERATION'
    : 'ORDERING_ERROR';
  return {
    correct: false,
    errorType,
    feedback:
      `Thứ tự chưa đúng. Bước đầu tiên bị đặt sai là ở vị trí ${firstWrong + 1}. ` +
      `Bước đúng ở vị trí đó phải là: "${ex.steps[firstWrong] ?? '?'}".` + tail(ex.explain),
    detailSteps: ex.steps.map((s, i) => `${i + 1}. ${s}`),
  };
}

// --- vector-drawing --------------------------------------------------------
function checkVectorDrawing(ex: VectorDrawingExercise, answer: unknown): CheckResult {
  const v = toVec2(answer);
  if (!v) return invalidInput('Hãy vẽ một vector.');

  const tol = ex.tolerance ?? 0.25;
  const [tx, ty] = ex.target;
  const dist = Math.hypot(v[0] - tx, v[1] - ty);
  if (dist <= tol + EPS) {
    return {
      correct: true,
      feedback: `Chính xác! Vector (${tx}, ${ty}) đã được vẽ đúng.` + tail(ex.explain),
    };
  }
  // Ngược hướng (đối vector)?
  if (Math.hypot(v[0] + tx, v[1] + ty) <= tol + EPS) {
    return {
      correct: false,
      errorType: 'SIGN_ERROR',
      feedback:
        `Vector đúng độ lớn nhưng NGƯỢC hướng. Bạn vẽ (${v[0]}, ${v[1]}), ` +
        `mục tiêu là (${tx}, ${ty}). Hãy đảo chiều.` + tail(ex.explain),
    };
  }
  return {
    correct: false,
    errorType: 'DIRECTION_ERROR',
    feedback:
      `Chưa tới đích. Bạn vẽ (${v[0]}, ${v[1]}), mục tiêu là (${tx}, ${ty}). ` +
      `Nhớ: thành phần x đi ngang, thành phần y đi dọc.` + tail(ex.explain),
  };
}

// --- error-detection -------------------------------------------------------
function checkErrorDetection(ex: ErrorDetectionExercise, answer: unknown): CheckResult {
  if (typeof answer !== 'number' || !Number.isInteger(answer)) {
    return invalidInput('Hãy chọn dòng mà bạn cho là sai.');
  }
  if (answer === ex.wrongLineIndex) {
    return {
      correct: true,
      feedback: `Chính xác! Dòng ${answer + 1} chính là chỗ sai. ${ex.explain}`,
      detailSteps: ex.lines.map((l, i) => `${i + 1}. ${l}`),
    };
  }
  return {
    correct: false,
    errorType: 'DETECTION_MISS',
    feedback:
      `Chưa đúng. Dòng bạn chọn (${answer + 1}) không phải chỗ sai. ` +
      `Lỗi thật sự nằm ở dòng ${ex.wrongLineIndex + 1}. ${ex.explain}`,
    detailSteps: ex.lines.map((l, i) => `${i + 1}. ${l}`),
  };
}

// --- true-false ------------------------------------------------------------
function checkTrueFalse(ex: TrueFalseExercise, answer: unknown): CheckResult {
  if (typeof answer !== 'boolean') return invalidInput('Hãy chọn Đúng hoặc Sai.');
  if (answer === ex.answer) {
    return {
      correct: true,
      feedback: `Chính xác! Mệnh đề này ${ex.answer ? 'ĐÚNG' : 'SAI'}. ${ex.explain}`,
    };
  }
  return {
    correct: false,
    errorType: 'CONCEPTUAL_ERROR',
    feedback:
      `Chưa đúng. Mệnh đề này thực ra ${ex.answer ? 'ĐÚNG' : 'SAI'}. ${ex.explain}`,
  };
}

// ===========================================================================
// HINTS
// ===========================================================================

/**
 * Lấy gợi ý ở bậc `level`. Nếu không có đúng bậc, trả về gợi ý bậc CAO NHẤT ≤ level.
 * undefined nếu không còn gợi ý phù hợp.
 */
export function pickHint(ex: Exercise, level: number): Hint | undefined {
  const exact = ex.hints.find((h) => h.level === level);
  if (exact) return exact;
  const lower = ex.hints
    .filter((h) => h.level <= level)
    .sort((a, b) => b.level - a.level);
  return lower[0];
}

// ===========================================================================
// HELPERS nội bộ (parse an toàn + phản hồi)
// ===========================================================================

function invalidInput(msg: string): CheckResult {
  return { correct: false, errorType: 'INVALID_INPUT', feedback: msg };
}

function tail(explain?: string): string {
  return explain ? ` ${explain}` : '';
}

function toNumber(x: unknown): number | undefined {
  if (typeof x === 'number' && Number.isFinite(x)) return x;
  if (typeof x === 'string' && x.trim() !== '') {
    const n = Number(x.replace(',', '.'));
    if (Number.isFinite(n)) return n;
  }
  return undefined;
}

function toMatrix(x: unknown): number[][] | undefined {
  if (!Array.isArray(x) || x.length === 0) return undefined;
  const out: number[][] = [];
  for (const row of x) {
    if (!Array.isArray(row)) return undefined;
    const r: number[] = [];
    for (const cell of row) {
      const n = toNumber(cell);
      if (n === undefined) return undefined;
      r.push(n);
    }
    out.push(r);
  }
  return out;
}

function toPairs(x: unknown): [number, number][] | undefined {
  if (!Array.isArray(x)) return undefined;
  const out: [number, number][] = [];
  for (const p of x) {
    if (!Array.isArray(p) || p.length !== 2) return undefined;
    const a = toNumber(p[0]);
    const b = toNumber(p[1]);
    if (a === undefined || b === undefined) return undefined;
    out.push([a, b]);
  }
  return out;
}

function toVec2(x: unknown): [number, number] | undefined {
  if (!Array.isArray(x) || x.length !== 2) return undefined;
  const a = toNumber(x[0]);
  const b = toNumber(x[1]);
  if (a === undefined || b === undefined) return undefined;
  return [a, b];
}

/**
 * Chuẩn hóa đáp án step-ordering về mảng chuỗi theo thứ tự người học sắp.
 *  - string[]  → dùng trực tiếp.
 *  - number[]  → hoán vị chỉ số gốc: order[k] = index của bước gốc đặt ở vị trí k.
 */
function toStepOrder(x: unknown, steps: string[]): string[] | undefined {
  if (!Array.isArray(x) || x.length === 0) return undefined;
  if (x.every((s) => typeof s === 'string')) return x as string[];
  if (x.every((n) => typeof n === 'number' && Number.isInteger(n))) {
    const idxs = x as number[];
    if (idxs.some((i) => i < 0 || i >= steps.length)) return undefined;
    return idxs.map((i) => steps[i]);
  }
  return undefined;
}
