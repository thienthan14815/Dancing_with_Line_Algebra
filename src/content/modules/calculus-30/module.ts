import type { ContentModule } from '../../types';
import lessons from './lessons.json';
import { exercises } from './practice';
import { conceptualExercises } from './editorial';
import { finalAssessment } from './editorial/finalAssessment';

const module: ContentModule = {
  id: 'calculus-30', num: 16, track: 'calculus', trackTitle: 'Giải tích',
  title: 'Giải tích trong 30 ngày', en: 'Calculus in 30 Days',
  subtitle: '30 ngày · 6 chặng · Giới hạn, đạo hàm, tích phân và giải tích nhiều biến',
  enabled: true, prerequisites: [],
  skills: lessons.map(lesson => ({ id: lesson.skillId, name: lesson.title })),
  lessons: lessons.map(lesson => ({
    id: lesson.id, title: `Ngày ${lesson.day}: ${lesson.title}`, kind: 'concept',
    skillIds: [lesson.skillId], component: () => import('./CalculusLesson'),
    ...(lesson.id === 'd30' ? { practiceExerciseIds: finalAssessment.map(exercise => exercise.id) } : {}),
  })),
  exercises: [...exercises, ...conceptualExercises, ...finalAssessment],
  guide: {
    concepts: [
      'Ngày 1–6: hàm số, điều kiện xác định, giới hạn và liên tục.',
      'Ngày 7–14: đạo hàm, tiếp tuyến, vi phân và tối ưu.',
      'Ngày 15–22: nguyên hàm, đổi biến, từng phần và ứng dụng tích phân.',
      'Ngày 23–25: đạo hàm riêng, gradient và cực trị hai biến.',
      'Ngày 26–27: đường cong tham số, trường vectơ, div và curl.',
      'Ngày 28–30: tích phân nhiều lớp, tọa độ cực và kiểm tra tổng kết.',
    ],
    symbols: [
      { tex: '\\lim_{x\\to a}', desc: 'Giới hạn khi x tiến đến a.' },
      { tex: "f'(x)", desc: 'Đạo hàm: tốc độ thay đổi tức thời.' },
      { tex: '\\nabla f', desc: 'Gradient: vectơ các đạo hàm riêng.' },
    ],
    formulas: [
      { tex: "(f\\circ g)'(x)=f'(g(x))g'(x)", desc: 'Quy tắc dây chuyền cho các hàm khả vi.' },
      { tex: '\\int_a^bf(x)\\,dx=F(b)-F(a)', desc: 'f liên tục trên đoạn và F′ = f.' },
      { tex: '\\int u\\,dv=uv-\\int v\\,du', desc: 'Tích phân từng phần.' },
      { tex: 'df=f_xdx+f_ydy', desc: 'Vi phân toàn phần của hàm khả vi hai biến.' },
      { tex: 'dA=r\\,dr\\,d\\theta', desc: 'Phần tử diện tích trong tọa độ cực.' },
    ],
    intuition: 'Đạo hàm đo thay đổi tại một điểm; tích phân cộng các đóng góp nhỏ trên một miền.',
    example: { text: 'Vị trí s(t) = t² cho vận tốc v(t) = 2t; tích phân vận tốc từ 0 đến 3 cho độ dời 9.' },
    pitfalls: ['Giữ điều kiện sau khi rút gọn.', 'Phân biệt diện tích và tích phân có dấu.', 'Đổi biến phải đổi vi phân và cận.', 'Chuẩn hóa vectơ trước khi lấy đạo hàm theo hướng.'],
    applications: ['Tối ưu kích thước và chi phí.', 'Chuyển động và điện lượng.', 'Gradient trong học máy.', 'Diện tích và thể tích.'],
  },
};
export default module;
