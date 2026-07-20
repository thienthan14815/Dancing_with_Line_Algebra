// MÔ HÌNH NỘI DUNG — Course → Section → Unit → MicroLesson → Exercise
// Thuần logic, không phụ thuộc UI. Đây là CONTRACT cho các agent UI + tác giả nội dung.

/** Một kỹ năng cốt lõi (mastery được đo theo từng skill). */
export interface Skill {
  /** id snake_case, ổn định, dùng làm khóa mastery. vd 'dot_product'. */
  id: string;
  /** Tên hiển thị (song ngữ Việt/Anh). */
  name: string;
}

/** Loại micro-lesson — quyết định cách UI render & cách chấm tiến độ. */
export type MicroLessonKind = 'concept' | 'practice' | 'review' | 'challenge';

/** Đơn vị học nhỏ nhất mà người dùng "hoàn thành" (giống 1 bài Duolingo). */
export interface MicroLesson {
  /** id toàn cục, duy nhất. vd 'ch1-vectors:dot:concept'. */
  id: string;
  title: string;
  /** Các skill mà bài này rèn luyện (dùng để cập nhật mastery). */
  skillIds: string[];
  /** Trỏ tới các exercise (do tác giả nội dung điền sau). */
  exerciseIds?: string[];
  /** Nhúng bài trực quan của chương cũ. vd '#/ch/ch1-vectors/dot'. */
  deepDiveRoute?: string;
  kind?: MicroLessonKind;
}

/** Nhóm các micro-lesson xoay quanh một chủ đề (map từ 1 bài của chương cũ). */
export interface Unit {
  id: string;
  title: string;
  lessons: MicroLesson[];
}

/** Một chặng lớn của khóa học (map từ 1 chương). */
export interface Section {
  id: string;
  /** Số thứ tự hiển thị (0..N). */
  num: number;
  title: string;
  /** Tên tiếng Anh của chặng. */
  en: string;
  subtitle: string;
  /** Các Section cần hoàn thành trước (khóa tuyến tính: n cần n-1). */
  prerequisiteSectionIds?: string[];
  units: Unit[];
}

/** Toàn bộ khóa học. */
export interface Course {
  id: string;
  title: string;
  sections: Section[];
}

/** Mô tả phẳng của 1 micro-lesson kèm ngữ cảnh (section + unit). */
export interface FlatMicroLesson {
  sectionId: string;
  unitId: string;
  lesson: MicroLesson;
}
