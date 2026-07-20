import Coordinates from './coordinates';
import Functions from './functions';
import Trig from './trig';
import Notation from './notation';

export default function Chapter({ lessonId }: { lessonId: string }) {
  switch (lessonId) {
    case 'coordinates':
      return <Coordinates />;
    case 'functions':
      return <Functions />;
    case 'trig':
      return <Trig />;
    case 'notation':
      return <Notation />;
    default:
      return (
        <div className="panel" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🚧</div>
          <h2 style={{ marginTop: 0 }}>Chưa có bài học này</h2>
          <p className="muted">
            Bài học <code>{lessonId}</code> không thuộc chương Kiến thức nền.
          </p>
        </div>
      );
  }
}
