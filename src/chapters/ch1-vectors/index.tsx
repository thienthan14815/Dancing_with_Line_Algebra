import IntroLesson from './IntroLesson';
import AdditionLesson from './AdditionLesson';
import ScalingLesson from './ScalingLesson';
import CombinationLesson from './CombinationLesson';
import DotLesson from './DotLesson';
import CrossLesson from './CrossLesson';

export default function Chapter({ lessonId }: { lessonId: string }) {
  switch (lessonId) {
    case 'intro':
      return <IntroLesson />;
    case 'addition':
      return <AdditionLesson />;
    case 'scaling':
      return <ScalingLesson />;
    case 'combination':
      return <CombinationLesson />;
    case 'dot':
      return <DotLesson />;
    case 'cross':
      return <CrossLesson />;
    default:
      return (
        <div className="panel" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <h2 style={{ marginTop: 0 }}>Bài học chưa tồn tại</h2>
          <p className="muted">
            Không tìm thấy bài <code>{lessonId}</code> trong chương Vector.
          </p>
        </div>
      );
  }
}
