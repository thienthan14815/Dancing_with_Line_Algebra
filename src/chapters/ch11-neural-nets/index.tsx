// CHƯƠNG 11 — Mạng nơ-ron (nhánh Deep Learning).
// DL = Đại số tuyến tính được áp dụng: mỗi bài bắc cầu rõ tới các chương LA.
import NeuronLesson from './NeuronLesson';
import MlpLesson from './MlpLesson';
import ForwardLesson from './ForwardLesson';
import BackpropLesson from './BackpropLesson';
import ActivationsLesson from './ActivationsLesson';

export default function Chapter({ lessonId }: { lessonId: string }) {
  switch (lessonId) {
    case 'neuron':
      return <NeuronLesson />;
    case 'mlp':
      return <MlpLesson />;
    case 'forward':
      return <ForwardLesson />;
    case 'backprop':
      return <BackpropLesson />;
    case 'activations':
      return <ActivationsLesson />;
    default:
      return (
        <div className="panel" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <h2 style={{ marginTop: 0 }}>Bài học chưa tồn tại</h2>
          <p className="muted">
            Không tìm thấy bài <code>{lessonId}</code> trong chương Mạng nơ-ron.
          </p>
        </div>
      );
  }
}
