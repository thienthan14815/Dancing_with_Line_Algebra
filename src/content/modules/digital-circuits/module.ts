import type { ContentModule } from '../../types';
import { lessons } from './lessons';
import { exercises } from './exercises';

const module: ContentModule = {
  id: 'digital-circuits',
  num: 15,
  track: 'digital-circuits',
  trackTitle: 'Mạch số',
  title: 'Hệ đếm & Mạch số (數位電路)',
  en: 'Number Systems & Digital Circuits',
  subtitle: 'Từ hệ đếm và transistor đến hàm Boolean, bảng chân trị và bộ cộng 4 bit',
  enabled: true,
  prerequisites: [],
  skills: lessons.map((lesson) => ({ id: lesson.skillId, name: lesson.title })),
  lessons: lessons.map((lesson) => ({
    id: lesson.id,
    title: lesson.title,
    kind: 'concept',
    skillIds: [lesson.skillId],
    component: () => import('./DigitalLesson'),
  })),
  exercises,
  guide: {
    concepts: [
      'Hệ đếm: nhị phân → thập phân (二進位 → 十進位), rồi đổi cơ số n → m qua giá trị trung gian.',
      'Y = f(x): đầu vào xác định đầu ra; hàm Boolean nhận và trả về các bit.',
      'Đi từ phần cứng đến mô hình: transistor (電晶體) → cổng logic → đại số Boolean (布林代數). Hệ đếm cho biết cách diễn giải nhóm bit thành số.',
      'Bảng chân trị (真值表) là đặc tả đầu ra cho mọi tổ hợp đầu vào của mạch tổ hợp.',
      'SOP (sum of products) là phép OR các tích AND. SOP chính tắc lấy minterm của từng hàng có Y = 1.',
      'Ghép 4 full adder 1 bit bằng dây nhớ để tạo bộ cộng 4 bit.',
      'Mạch tổ hợp (組合電路) phụ thuộc đầu vào hiện tại; mạch tuần tự (循序電路, còn gọi 序向電路) có trạng thái.',
    ],
    symbols: [
      { tex: '(d_k\\ldots d_0)_b', desc: 'Số có cơ số b; chữ số dᵢ có trọng số bⁱ.' },
      { tex: '\\overline{A},\\ A\\cdot B,\\ A+B,\\ A\\oplus B', desc: 'NOT, AND, OR, XOR trong đại số Boolean; dấu + ở đây là OR.' },
      { tex: 'C_{in},\\ C_{out},\\ S', desc: 'Bit nhớ vào, bit nhớ ra và bit tổng của bộ cộng.' },
      { tex: 'Q_t', desc: 'Trạng thái đang lưu tại thời điểm t.' },
    ],
    formulas: [
      { tex: 'N=\\sum_{i=0}^{k}d_i b^i', desc: 'Đổi số nguyên cơ số b sang thập phân.' },
      { tex: 'Y=\\overline{A}B+A\\overline{B}=A\\oplus B', desc: 'SOP chính tắc của XOR hai đầu vào.' },
      { tex: 'S=A\\oplus B\\oplus C_{in}', desc: 'Bit tổng của full adder 1 bit.' },
      { tex: 'C_{out}=AB+AC_{in}+BC_{in}', desc: 'Có nhớ ra khi ít nhất hai trong ba đầu vào bằng 1.' },
      { tex: 'A+B+C_0=S+16C_4', desc: 'Đẳng thức số học của bộ cộng 4 bit không dấu; S là giá trị bốn bit tổng.' },
      { tex: 'Q_{t+1}=g(Q_t,X_t),\\quad Y_t=h(Q_t,X_t)', desc: 'Mô hình mạch tuần tự kiểu Mealy; kiểu Moore có Yₜ = h(Qₜ).' },
    ],
    intuition: 'Bit là ký hiệu 0/1. Cổng logic xử lý bit, đại số Boolean mô tả quy tắc xử lý, còn hệ đếm gán giá trị số cho một chuỗi bit.',
    example: { text: '1011₂ + 0110₂ = 10001₂: ghép bốn full adder cho tổng S = 0001 và nhớ ra C₄ = 1, tức 11 + 6 = 17.' },
    pitfalls: [
      'Không dùng chữ số lớn hơn hoặc bằng cơ số; số 102₂ không hợp lệ.',
      'Chia liên tiếp khi đổi số nguyên: đọc số dư từ dưới lên.',
      'Boolean: 1 + 1 = 1 vì + là OR. Số học nhị phân: 1 + 1 = 10₂.',
      'SOP tổng quát không bắt buộc mỗi tích chứa đủ biến; SOP chính tắc thì có.',
      'Nhớ ra không đồng nghĩa với tràn số có dấu; chương này dùng bộ cộng không dấu.',
      'Bảng chân trị chỉ theo đầu vào hiện tại chưa đủ mô tả mạch có nhớ; cần bảng chuyển trạng thái.',
    ],
    applications: ['Mạch báo động và điều khiển.', 'Bộ cộng trong ALU.', 'Thanh ghi, bộ đếm và máy trạng thái hữu hạn.'],
  },
};

export default module;
