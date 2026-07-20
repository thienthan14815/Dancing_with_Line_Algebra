import OrthonormalLesson from './OrthonormalLesson';
import ProjectionLesson from './ProjectionLesson';
import GramSchmidtLesson from './GramSchmidtLesson';
import QRLesson from './QRLesson';
import LeastSquaresLesson from './LeastSquaresLesson';

export default function Chapter({ lessonId }: { lessonId: string }) {
  switch (lessonId) {
    case 'orthonormal':
      return <OrthonormalLesson />;
    case 'projection':
      return <ProjectionLesson />;
    case 'gram-schmidt':
      return <GramSchmidtLesson />;
    case 'qr':
      return <QRLesson />;
    case 'least-squares':
      return <LeastSquaresLesson />;
    default:
      return (
        <div className="panel" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <h2 style={{ marginTop: 0 }}>Bài học chưa tồn tại</h2>
          <p className="muted">
            Không tìm thấy bài <code>{lessonId}</code> trong chương Trực giao.
          </p>
        </div>
      );
  }
}
