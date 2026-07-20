import SubspaceLesson from './SubspaceLesson';
import ColNullLesson from './ColNullLesson';
import IndependenceLesson from './IndependenceLesson';
import BasisLesson from './BasisLesson';
import RankLesson from './RankLesson';
import ChangeBasisLesson from './ChangeBasisLesson';

export default function Chapter({ lessonId }: { lessonId: string }) {
  switch (lessonId) {
    case 'subspace':
      return <SubspaceLesson />;
    case 'colnull':
      return <ColNullLesson />;
    case 'independence':
      return <IndependenceLesson />;
    case 'basis':
      return <BasisLesson />;
    case 'rank':
      return <RankLesson />;
    case 'change-basis':
      return <ChangeBasisLesson />;
    default:
      return (
        <div className="panel" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <h2 style={{ marginTop: 0 }}>Bài học chưa tồn tại</h2>
          <p className="muted">
            Không tìm thấy bài <code>{lessonId}</code> trong chương Không gian vector.
          </p>
        </div>
      );
  }
}
