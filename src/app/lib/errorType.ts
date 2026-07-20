import type { ErrorType } from '../../core/db/schema';

// Engine (src/core/exercises/engine.ts) phát ra errorType kiểu `string` lỏng —
// gồm cả các giá trị KHÔNG có trong union chặt của schema (CONCEPTUAL_ERROR,
// MATCHING_ERROR, ORDERING_ERROR, DIRECTION_ERROR, DETECTION_MISS, INVALID_INPUT).
// `recordAttempt` lại yêu cầu đúng union `ErrorType` của schema, nên cần ánh xạ.
const KNOWN = new Set<ErrorType>([
  'SIGN_ERROR',
  'ARITHMETIC_ERROR',
  'ROW_COLUMN_MISMATCH',
  'INVALID_MATRIX_DIMENSION',
  'WRONG_ELIMINATION_OPERATION',
  'CONFUSED_EIGENVALUE_WITH_EIGENVECTOR',
  'DEPENDENCE_REASONING_ERROR',
  'CONCEPT_ERROR',
  'OTHER',
]);

/** Chuẩn hóa errorType lỏng của engine về đúng union `ErrorType` của schema. */
export function toSchemaErrorType(raw?: string): ErrorType | undefined {
  if (!raw) return undefined;
  if (raw === 'CONCEPTUAL_ERROR') return 'CONCEPT_ERROR';
  if (KNOWN.has(raw as ErrorType)) return raw as ErrorType;
  return 'OTHER';
}
