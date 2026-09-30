// ===========================================================================
// ĐỊNH DẠNG CHUẨN CHO "CONTENT MODULE" (plugin giáo án)
// ---------------------------------------------------------------------------
// Một giáo án = MỘT thư mục `src/content/modules/<id>/` chứa `module.ts` mà
// default export là một `ContentModule`. Thả thư mục vào ⇒ giáo án tự xuất hiện
// trên Learning Path, Roadmap, Sổ tay, Practice và ngân hàng bài tập. Xóa thư
// mục ⇒ gỡ giáo án. KHÔNG cần sửa file trung tâm nào.
//
// LƯU Ý: file này CHỈ khai báo type (import type … được xóa khi biên dịch) nên
// KHÔNG tạo phụ thuộc runtime — tránh vòng lặp import với các file lõi.
// ===========================================================================

import type { ComponentType } from 'react';
import type { Exercise } from '../core/exercises/types';
import type { ExerciseGenerator } from '../core/exercises/generators';
import type { GuideEntry } from '../app/guidebook/content';

/** Loại micro-lesson — quyết định icon & cách chấm tiến độ (khớp core/content/types). */
export type ModuleLessonKind = 'concept' | 'practice' | 'review' | 'challenge';

/**
 * Một bài học của module. Mỗi ModuleLesson được bung thành 1 Unit gồm 2
 * micro-lesson: (1) khái niệm (kèm deep-dive nếu có `component`) và (2) luyện
 * tập (tự rút bài từ ngân hàng theo `skillIds`).
 */
export interface ModuleLesson {
  /** id ngắn, duy nhất trong module. vd 'intro'. */
  id: string;
  /** Tiêu đề hiển thị. */
  title: string;
  /** Loại bài — dùng cho icon & nhãn. */
  kind: ModuleLessonKind;
  /** Các skill bài này rèn — PHẢI nằm trong `ContentModule.skills`. */
  skillIds: string[];
  /** Optional fixed assessment: deliver every listed exercise, in this order. */
  practiceExerciseIds?: string[];
  /**
   * (Tùy chọn) Bài trực quan tương tác cho route deep-dive
   * `#/ch/<moduleId>/<lessonId>`. Trả về một React component nhận `{ lessonId }`.
   * Dùng dynamic import để tách bundle: `() => import('./lessons/demo')`.
   */
  component?: () => Promise<{ default: ComponentType<{ lessonId: string }> }>;
}

/** Một skill do module tự khai báo (id snake_case ổn định, dùng làm khóa mastery). */
export interface ModuleSkill {
  id: string;
  name: string;
}

/**
 * Nội dung Sổ tay của module. Dùng ĐÚNG shape `GuideEntry` hiện có nhưng cho
 * phép BỎ QUA `id`/`nameVi`/`nameEn` — loader sẽ tự điền từ manifest
 * (`id = module.id`, `nameVi = title`, `nameEn = en ?? title`).
 */
export type ModuleGuide = Omit<GuideEntry, 'id' | 'nameVi' | 'nameEn'> &
  Partial<Pick<GuideEntry, 'id' | 'nameVi' | 'nameEn'>>;

/**
 * MANIFEST của một giáo án. `default export` của `modules/<id>/module.ts`.
 */
export interface ContentModule {
  /** id duy nhất, KHÔNG trùng chương cũ (ch0..ch13). vd 'ext-probability'. */
  id: string;
  /** Số thứ tự hiển thị & sắp xếp. PHẢI ≥ 14 (0..13 dành cho 14 chương gốc). */
  num: number;
  /** Nhóm/track máy đọc (vd 'linear-algebra', 'deep-learning', 'extra'). */
  track: string;
  /** (Tùy chọn) Tên track hiển thị. */
  trackTitle?: string;
  /** Tiêu đề tiếng Việt. */
  title: string;
  /** (Tùy chọn) Tên tiếng Anh của chương. */
  en?: string;
  /** Mô tả ngắn 1 dòng. */
  subtitle: string;
  /** Mặc định true. Đặt false để ẩn giáo án mà không xóa thư mục. */
  enabled?: boolean;
  /** (Tùy chọn) id các module/section cần học trước (soft-lock). */
  prerequisites?: string[];
  /** Các skill do module tự khai báo — mọi skillId dùng ở lesson/exercise phải có ở đây. */
  skills: ModuleSkill[];
  /** Các bài học của module. */
  lessons: ModuleLesson[];
  /** Ngân hàng bài tập (nạp EAGER — đồng bộ, không dynamic import). */
  exercises: Exercise[];
  /**
   * (Tùy chọn) Hệ sinh bài tập thủ tục do module tự khai báo — mỗi generator
   * sinh bài mới có số liệu ngẫu nhiên cho một skill. Content registry sẽ gom
   * và đăng ký (registerGenerators) để luyện tập không lặp. Additive: bỏ trống
   * thì module chỉ dùng pool bài tĩnh `exercises` như trước.
   */
  generators?: ExerciseGenerator[];
  /** (Tùy chọn) Nội dung Sổ tay của module. */
  guide?: ModuleGuide;
}
