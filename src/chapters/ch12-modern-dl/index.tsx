// CHƯƠNG 12 — Học sâu hiện đại (Modern Deep Learning).
// Triết lý: Deep Learning = Đại số tuyến tính được ÁP DỤNG. Mỗi bài đều bắc cầu
// tường minh về các chương LA (dot product, matVec, matmul, SVD…).
import CnnLesson from './CnnLesson';
import RnnLesson from './RnnLesson';
import AttentionLesson from './AttentionLesson';
import EmbeddingsLesson from './EmbeddingsLesson';

export default function Chapter({ lessonId }: { lessonId: string }) {
  switch (lessonId) {
    case 'cnn':
      return <CnnLesson />;
    case 'rnn':
      return <RnnLesson />;
    case 'attention':
      return <AttentionLesson />;
    case 'embeddings':
      return <EmbeddingsLesson />;
    default:
      return (
        <div className="panel" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <h2 style={{ marginTop: 0 }}>Bài học chưa tồn tại</h2>
          <p className="muted">
            Không tìm thấy bài <code>{lessonId}</code> trong chương Học sâu hiện đại.
          </p>
        </div>
      );
  }
}
