// ===========================================================================
// WRAPPER CHƯƠNG cho registry cũ (route deep-dive `#/ch/<moduleId>/<lessonId>`).
// ---------------------------------------------------------------------------
// `registry.ts` (thuần .ts, không JSX) gọi `makeChapterLoader(module)` để lấy
// hàm `load` đúng shape ChapterMeta.load: () => Promise<{ default: Component }>.
// Wrapper chọn đúng `ModuleLesson.component` theo `lessonId`; nếu bài không có
// component tương tác thì hiển thị placeholder gọn (vẫn có nút Luyện tập ở
// LessonPage bao ngoài).
// ===========================================================================

import { Suspense, lazy, type ComponentType, type LazyExoticComponent } from 'react';
import type { ContentModule } from './types';

type LessonComponent = ComponentType<{ lessonId: string }>;

// Cache các lazy component theo "<moduleId>:<lessonId>" để tránh tạo lại (remount)
// mỗi lần render.
const lazyCache = new Map<string, LazyExoticComponent<LessonComponent>>();

function getLazy(
  moduleId: string,
  lessonId: string,
  loader: () => Promise<{ default: LessonComponent }>,
): LazyExoticComponent<LessonComponent> {
  const key = `${moduleId}:${lessonId}`;
  let cmp = lazyCache.get(key);
  if (!cmp) {
    cmp = lazy(loader);
    lazyCache.set(key, cmp);
  }
  return cmp;
}

function ModuleChapterView({
  module,
  lessonId,
}: {
  module: ContentModule;
  lessonId: string;
}) {
  const lesson = module.lessons.find((l) => l.id === lessonId);

  if (lesson?.component) {
    const Lazy = getLazy(module.id, lesson.id, lesson.component);
    return (
      <Suspense fallback={<div className="panel">Đang tải bài…</div>}>
        <Lazy lessonId={lessonId} />
      </Suspense>
    );
  }

  // Placeholder gọn khi bài không có component tương tác.
  return (
    <div className="panel" style={{ padding: '32px 24px' }}>
      <h2 style={{ marginTop: 0 }}>{lesson?.title ?? module.title}</h2>
      <p className="muted">{module.subtitle}</p>
      {!lesson && (
        <p className="muted">
          Không tìm thấy bài <code>{lessonId}</code> trong giáo án{' '}
          <code>{module.id}</code>.
        </p>
      )}
      <p className="dim" style={{ fontSize: 13 }}>
        Bài này chưa có nội dung trực quan tương tác. Dùng nút “Luyện tập chương
        này” bên dưới để làm bài tập theo kỹ năng.
      </p>
    </div>
  );
}

/**
 * Trả về `load` cho ChapterMeta: một Promise resolving component nhận
 * `{ lessonId }` và render bài tương ứng của module.
 */
export function makeChapterLoader(
  module: ContentModule,
): () => Promise<{ default: LessonComponent }> {
  return async () => ({
    default: (props: { lessonId: string }) => (
      <ModuleChapterView module={module} lessonId={props.lessonId} />
    ),
  });
}
