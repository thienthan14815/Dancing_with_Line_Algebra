// EXERCISE ENGINE — mô hình dữ liệu (tài liệu §2.3)
// Union type Exercise gồm nhiều dạng bài. Thuần logic, không UI, không random.

/**
 * Phân loại lỗi (error taxonomy — tài liệu §2.4).
 *
 * CỐ Ý để mềm là `string` nhằm TRÁNH phụ thuộc vào file của agent khác
 * (`../db/schema`). Agent progress sẽ dùng union chặt riêng khi cần.
 * Các giá trị engine hiện phát ra: SIGN_ERROR, ARITHMETIC_ERROR,
 * ROW_COLUMN_MISMATCH, INVALID_MATRIX_DIMENSION, WRONG_ELIMINATION_OPERATION,
 * CONFUSED_EIGENVALUE_WITH_EIGENVECTOR, DEPENDENCE_REASONING_ERROR,
 * CONCEPTUAL_ERROR, MATCHING_ERROR, ORDERING_ERROR, DIRECTION_ERROR,
 * DETECTION_MISS, INVALID_INPUT.
 */
export type ErrorType = string;

/** Chiều đánh giá của một bài tập. */
export type Dimension = 'concept' | 'compute' | 'visual' | 'explain';

/** Độ khó 1 (dễ) → 4 (khó). */
export type Difficulty = 1 | 2 | 3 | 4;

/** Gợi ý theo bậc (level 1 nhẹ nhất → 4 gần như lời giải). */
export interface Hint {
  level: 1 | 2 | 3 | 4;
  text: string;
}

/** Trường dùng chung cho mọi dạng bài. */
export interface BaseExercise {
  id: string;
  /** skill mà bài này thuộc về (phải tồn tại trong skills.ts). */
  skillId: string;
  /** Đề bài (chuỗi; có thể chứa LaTeX cho UI render). */
  prompt: string;
  dimension: Dimension;
  hints: Hint[];
  difficulty: Difficulty;
}

/** Trắc nghiệm: chọn 1 đáp án. answer = index đã chọn. */
export interface MultipleChoiceExercise extends BaseExercise {
  type: 'multiple-choice';
  options: string[];
  answerIndex: number;
  explain: string;
}

/** Nhập số. answer = number. */
export interface NumericInputExercise extends BaseExercise {
  type: 'numeric-input';
  answer: number;
  tolerance?: number;
  unit?: string;
  explain?: string;
}

/** Nhập từng ô ma trận. answer = number[][]. */
export interface MatrixInputExercise extends BaseExercise {
  type: 'matrix-input';
  rows: number;
  cols: number;
  answer: number[][];
  tolerance?: number;
  explain?: string;
}

/** Ghép cặp trái–phải. answer = [leftIndex, rightIndex][]. */
export interface MatchingExercise extends BaseExercise {
  type: 'matching';
  left: string[];
  right: string[];
  /** Các cặp đúng: [indexLeft, indexRight][]. */
  pairs: [number, number][];
  explain?: string;
}

/**
 * Sắp xếp các bước theo đúng thứ tự.
 * `steps` đã ở ĐÚNG thứ tự. answer có thể là:
 *   - string[]  : các bước theo thứ tự người học sắp, so khớp với `steps`; hoặc
 *   - number[]  : hoán vị chỉ số gốc; đúng khi bằng [0,1,2,...].
 */
export interface StepOrderingExercise extends BaseExercise {
  type: 'step-ordering';
  steps: string[];
  explain?: string;
}

/** Vẽ 1 vector trên mặt phẳng. answer = [x, y]. */
export interface VectorDrawingExercise extends BaseExercise {
  type: 'vector-drawing';
  target: [number, number];
  tolerance?: number;
  explain?: string;
}

/** Tìm dòng sai trong một lời giải. answer = index dòng bị đánh dấu sai. */
export interface ErrorDetectionExercise extends BaseExercise {
  type: 'error-detection';
  lines: string[];
  wrongLineIndex: number;
  explain: string;
}

/** Đúng/Sai. answer = boolean. */
export interface TrueFalseExercise extends BaseExercise {
  type: 'true-false';
  statement: string;
  answer: boolean;
  explain: string;
}

/** Union đầy đủ các dạng bài tập được hỗ trợ. */
export type Exercise =
  | MultipleChoiceExercise
  | NumericInputExercise
  | MatrixInputExercise
  | MatchingExercise
  | StepOrderingExercise
  | VectorDrawingExercise
  | ErrorDetectionExercise
  | TrueFalseExercise;

/** Tên các dạng bài (tiện cho UI switch/registry renderer). */
export type ExerciseType = Exercise['type'];

/** Kết quả chấm 1 bài. */
export interface CheckResult {
  correct: boolean;
  /** Phân loại lỗi khi suy ra được (undefined nếu đúng hoặc không rõ). */
  errorType?: ErrorType;
  /** Phản hồi SÂU: nêu quy tắc/bước đúng, không chỉ đúng/sai. */
  feedback: string;
  /** Các bước chi tiết (tuỳ chọn) để UI hiển thị từng dòng. */
  detailSteps?: string[];
}
