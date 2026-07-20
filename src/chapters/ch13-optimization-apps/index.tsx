import OptimizersLesson from './OptimizersLesson';
import BatchNormLesson from './BatchNormLesson';
import CVLesson from './CVLesson';
import NLPLesson from './NLPLesson';

export default function Chapter({ lessonId }: { lessonId: string }) {
  switch (lessonId) {
    case 'optimizers':
      return <OptimizersLesson />;
    case 'batchnorm':
      return <BatchNormLesson />;
    case 'cv':
      return <CVLesson />;
    case 'nlp':
      return <NLPLesson />;
    default:
      return (
        <div className="panel" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <h2 style={{ marginTop: 0 }}>Bài học chưa tồn tại</h2>
          <p className="muted">
            Không tìm thấy bài <code>{lessonId}</code> trong chương Tối ưu &amp; Ứng dụng.
          </p>
        </div>
      );
  }
}
