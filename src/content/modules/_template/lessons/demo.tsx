// ===========================================================================
// COMPONENT DEEP-DIVE MẪU — render tại route `#/ch/_template/<lessonId>`.
// Nhận `{ lessonId }`. Giữ tối giản & TỰ CHỨA (chỉ dùng MathText dùng chung),
// để giáo án có thể copy đi nơi khác mà không kéo theo phụ thuộc chương cũ.
// ===========================================================================

import MathText from '../../../../components/MathText';

export default function DemoLesson({ lessonId }: { lessonId: string }) {
  return (
    <div className="panel" style={{ padding: '28px 24px', lineHeight: 1.6 }}>
      <h2 style={{ marginTop: 0 }}>Bài học mẫu (deep-dive)</h2>
      <p className="muted">
        Đây là component tương tác mẫu cho bài <code>{lessonId}</code> của giáo án{' '}
        <code>_template</code>.
      </p>

      <p>
        Bạn có thể dựng mọi trực quan (canvas, SVG, three.js…) ở đây. Ví dụ công
        thức tích vô hướng render bằng KaTeX:
      </p>

      <div style={{ margin: '16px 0' }}>
        <MathText
          block
          tex={'\\vec{u}\\cdot\\vec{v} = \\sum_i u_i v_i = \\lVert\\vec{u}\\rVert\\,\\lVert\\vec{v}\\rVert\\cos\\theta'}
        />
      </div>

      <p className="dim" style={{ fontSize: 13 }}>
        💡 Mẹo: khai báo <code>component</code> cho một <code>ModuleLesson</code> để
        micro-lesson “Khái niệm” có nút deep-dive. Bỏ trống nếu bài chỉ cần luyện tập.
      </p>
    </div>
  );
}
