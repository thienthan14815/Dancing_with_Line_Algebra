// CHƯƠNG 10 — Học máy & Hồi quy (nhánh Deep Learning).
// Triết lý: Deep Learning = Đại số tuyến tính ÁP DỤNG. Mỗi bài BẮC CẦU rõ ràng
// về các chương LA: least squares (Ch.7–8), dạng toàn phương lồi (Ch.9),
// matVec & dot product (Ch.1, Ch.3), eigenvalue (Ch.5), chuẩn vector (Ch.1).
import LinearRegressionLesson from './LinearRegressionLesson';
import GradientDescentLesson from './GradientDescentLesson';
import SoftmaxLesson from './SoftmaxLesson';
import GeneralizationLesson from './GeneralizationLesson';

export default function Chapter({ lessonId }: { lessonId: string }) {
  switch (lessonId) {
    case 'linear-regression':
      return <LinearRegressionLesson />;
    case 'gradient-descent':
      return <GradientDescentLesson />;
    case 'softmax':
      return <SoftmaxLesson />;
    case 'generalization':
      return <GeneralizationLesson />;
    default:
      return (
        <div className="panel" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <h2 style={{ marginTop: 0 }}>Bài học chưa tồn tại</h2>
          <p className="muted">
            Không tìm thấy bài <code>{lessonId}</code> trong chương Học máy &amp; Hồi quy.
          </p>
        </div>
      );
  }
}
