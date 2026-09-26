import type { Exercise } from '../../../core/exercises/types';

export const exercises: Exercise[] = [
  {
    id: 'digital-binary-1', skillId: 'digital_binary_decimal', type: 'numeric-input', dimension: 'compute', difficulty: 1,
    prompt: 'Đổi 101101₂ sang thập phân.', answer: 45, tolerance: 0,
    hints: [{ level: 1, text: 'Các trọng số từ trái sang phải: 32, 16, 8, 4, 2, 1.' }],
    explain: '101101₂ = 32 + 8 + 4 + 1 = 45₁₀.',
  },
  {
    id: 'digital-binary-2', skillId: 'digital_binary_decimal', type: 'numeric-input', dimension: 'compute', difficulty: 1,
    prompt: 'Số không dấu lớn nhất biểu diễn bằng 4 bit có giá trị thập phân bao nhiêu?', answer: 15, tolerance: 0,
    hints: [{ level: 1, text: 'Cho cả bốn bit bằng 1.' }], explain: '1111₂ = 8 + 4 + 2 + 1 = 15 = 2⁴−1.',
  },
  {
    id: 'digital-binary-3', skillId: 'digital_binary_decimal', type: 'true-false', dimension: 'concept', difficulty: 1,
    prompt: 'Đúng hay sai?', statement: '00101₂ và 101₂ có cùng giá trị không dấu.', answer: true,
    hints: [{ level: 1, text: 'Các số 0 thêm ở bên trái đóng góp bao nhiêu?' }], explain: 'Đúng. Cả hai đều bằng 4 + 1 = 5; số 0 ở đầu không đổi giá trị.',
  },
  {
    id: 'digital-base-1', skillId: 'digital_base_conversion', type: 'multiple-choice', dimension: 'compute', difficulty: 2,
    prompt: '132₄ viết trong hệ cơ số 3 là gì?', options: ['1001₃', '1100₃', '1010₃', '1020₃'], answerIndex: 2,
    hints: [{ level: 1, text: 'Đổi qua thập phân: 16 + 12 + 2.' }], explain: '132₄ = 30₁₀ = 27 + 3 = 1010₃.',
  },
  {
    id: 'digital-base-2', skillId: 'digital_base_conversion', type: 'multiple-choice', dimension: 'compute', difficulty: 2,
    prompt: '2D₁₆ tương ứng với chuỗi nhị phân nào?', options: ['0010 1101₂', '0010 1011₂', '1101 0010₂', '0011 1101₂'], answerIndex: 0,
    hints: [{ level: 1, text: 'Đổi từng chữ số thành 4 bit; D có giá trị 13.' }], explain: '2 → 0010, D = 13 → 1101, nên 2D₁₆ = 0010 1101₂ = 45₁₀.',
  },
  {
    id: 'digital-base-3', skillId: 'digital_base_conversion', type: 'multiple-choice', dimension: 'concept', difficulty: 1,
    prompt: 'Cách viết nào không hợp lệ trong cơ số đã ghi?', options: ['102₃', '102₂', '17₈', 'AF₁₆'], answerIndex: 1,
    hints: [{ level: 1, text: 'Mọi chữ số phải nhỏ hơn cơ số.' }], explain: 'Hệ 2 chỉ có 0 và 1, nên chữ số 2 trong 102₂ không hợp lệ.',
  },
  {
    id: 'digital-function-1', skillId: 'digital_function', type: 'numeric-input', dimension: 'compute', difficulty: 1,
    prompt: 'Y = E AND D. Khi E = 1 và D = 0, Y bằng bao nhiêu?', answer: 0, tolerance: 0,
    hints: [{ level: 1, text: 'AND chỉ cho 1 nếu cả hai đầu vào đều là 1.' }], explain: '1 AND 0 = 0: điều kiện D chưa thỏa mãn.',
  },
  {
    id: 'digital-function-2', skillId: 'digital_function', type: 'multiple-choice', dimension: 'concept', difficulty: 1,
    prompt: 'Trong Y = f(x), nếu x = (A,B,C) là ba bit thì x là gì?', options: ['Chỉ một số thực liên tục', 'Bit nhớ ra', 'Tên một loại transistor', 'Bộ ba bit đầu vào'], answerIndex: 3,
    hints: [{ level: 1, text: 'Một đối số hàm có thể là một bộ giá trị.' }], explain: 'x là bộ đầu vào (A,B,C); f ánh xạ từng bộ bit sang đầu ra Y.',
  },
  {
    id: 'digital-function-3', skillId: 'digital_function', type: 'true-false', dimension: 'concept', difficulty: 1,
    prompt: 'Xét mô hình mạch tổ hợp khi đầu ra đã ổn định.', statement: 'Cùng một bộ đầu vào có thể cho đầu ra khác nhau chỉ vì lịch sử trước đó.', answer: false,
    hints: [{ level: 1, text: 'Y = f(X) có thêm biến trạng thái không?' }], explain: 'Sai. Mạch tổ hợp không có trạng thái lưu; đầu ra ổn định được xác định bởi đầu vào hiện tại.',
  },
  {
    id: 'digital-gates-1', skillId: 'digital_gates', type: 'multiple-choice', dimension: 'compute', difficulty: 1,
    prompt: 'Với A = B = 1, cặp kết quả (OR, XOR) là gì?', options: ['(1, 1)', '(1, 0)', '(0, 1)', '(0, 0)'], answerIndex: 1,
    hints: [{ level: 1, text: 'XOR chỉ bằng 1 khi hai bit khác nhau.' }], explain: 'OR nhận 1 vì có ít nhất một bit 1; XOR nhận 0 vì hai bit bằng nhau.',
  },
  {
    id: 'digital-gates-2', skillId: 'digital_gates', type: 'numeric-input', dimension: 'compute', difficulty: 1,
    prompt: 'Cổng NAND nhận A = 1, B = 0. Đầu ra bằng bao nhiêu?', answer: 1, tolerance: 0,
    hints: [{ level: 1, text: 'Tính AND rồi đảo kết quả.' }], explain: 'AND(1,0) = 0, nên NAND(1,0) = NOT 0 = 1.',
  },
  {
    id: 'digital-gates-3', skillId: 'digital_gates', type: 'multiple-choice', dimension: 'concept', difficulty: 2,
    prompt: 'Trong bộ đảo CMOS lý tưởng ở trạng thái ổn định, đầu vào thấp khiến điều gì xảy ra?',
    options: ['pMOS dẫn, nMOS tắt, đầu ra cao', 'nMOS dẫn, pMOS tắt, đầu ra thấp', 'Cả hai luôn tắt, đầu ra không xác định', 'Đầu ra luôn bằng đầu vào'], answerIndex: 0,
    hints: [{ level: 1, text: 'Cổng NOT biến đầu vào 0 thành đầu ra 1.' }], explain: 'pMOS kéo đầu ra lên nguồn khi đầu vào thấp, trong khi nMOS tắt. Đầu ra biểu diễn logic 1.',
  },
  {
    id: 'digital-table-1', skillId: 'digital_truth_table', type: 'numeric-input', dimension: 'compute', difficulty: 1,
    prompt: 'Bảng chân trị đầy đủ của 4 bit đầu vào độc lập có bao nhiêu hàng?', answer: 16, tolerance: 0,
    hints: [{ level: 1, text: 'Mỗi đầu vào có hai khả năng.' }], explain: 'Có 2⁴ = 16 tổ hợp đầu vào, do đó cần 16 hàng.',
  },
  {
    id: 'digital-table-2', skillId: 'digital_truth_table', type: 'numeric-input', dimension: 'compute', difficulty: 2,
    prompt: 'Spec báo động: Y = E AND (D OR W). Với (E,D,W) = (1,0,1), Y bằng bao nhiêu?', answer: 1, tolerance: 0,
    hints: [{ level: 1, text: 'Tính D OR W trước.' }], explain: 'D OR W = 0 OR 1 = 1; E AND 1 = 1. Bật bảo vệ và cửa sổ mở nên có báo động.',
  },
  {
    id: 'digital-table-3', skillId: 'digital_truth_table', type: 'multiple-choice', dimension: 'concept', difficulty: 1,
    prompt: 'Bảng chân trị đóng vai trò gì trong thiết kế mạch tổ hợp?',
    options: ['Quy định vị trí vật lý của mọi transistor', 'Chỉ liệt kê các hàng đầu ra bằng 0', 'Quy định đầu ra cho từng tổ hợp đầu vào', 'Thay thế hoàn toàn việc mô tả trạng thái của bộ đếm'], answerIndex: 2,
    hints: [{ level: 1, text: 'Spec mô tả hành vi cần đạt.' }], explain: 'Bảng là đặc tả hành vi đầu vào → đầu ra, dùng kiểm tra biểu thức và mạch thực hiện.',
  },
  {
    id: 'digital-boolean-1', skillId: 'digital_boolean', type: 'multiple-choice', dimension: 'compute', difficulty: 2,
    prompt: 'Trong đại số Boolean, AB + A·NOT B rút gọn thành gì?', options: ['B', '0', '1', 'A'], answerIndex: 3,
    hints: [{ level: 1, text: 'Đặt A làm nhân tử chung.' }], explain: 'AB + A·NOT B = A(B + NOT B) = A·1 = A.',
  },
  {
    id: 'digital-boolean-2', skillId: 'digital_boolean', type: 'multiple-choice', dimension: 'concept', difficulty: 2,
    prompt: 'Theo De Morgan, NOT(A OR B) tương đương biểu thức nào?',
    options: ['(NOT A) AND (NOT B)', '(NOT A) OR (NOT B)', 'A AND B', 'A XOR B'], answerIndex: 0,
    hints: [{ level: 1, text: 'Đảo các biến đồng thời đổi OR thành AND.' }], explain: 'NOT(A+B) = (NOT A)·(NOT B). Phải đổi phép toán khi đưa phủ định vào trong.',
  },
  {
    id: 'digital-boolean-3', skillId: 'digital_boolean', type: 'true-false', dimension: 'concept', difficulty: 1,
    prompt: 'Đúng hay sai?', statement: 'Trong đại số Boolean, 1 + 1 = 1 vì dấu + biểu diễn OR.', answer: true,
    hints: [{ level: 1, text: 'Phân biệt OR với cộng số học.' }], explain: 'Đúng: 1 OR 1 = 1. Trong phép cộng số học nhị phân, 1 + 1 = 10₂.',
  },
  {
    id: 'digital-sop-1', skillId: 'digital_sop', type: 'multiple-choice', dimension: 'compute', difficulty: 2,
    prompt: 'Hàng (A,B,C) = (1,0,1) tương ứng minterm nào?',
    options: ['(NOT A)·B·C', 'A·(NOT B)·C', 'A·B·C', 'A + (NOT B) + C'], answerIndex: 1,
    hints: [{ level: 1, text: 'Bit 0 dùng biến phủ định; bit 1 dùng biến thường; nối bằng AND.' }], explain: 'A=1 → A; B=0 → NOT B; C=1 → C. AND chúng được A·NOT B·C.',
  },
  {
    id: 'digital-sop-2', skillId: 'digital_sop', type: 'multiple-choice', dimension: 'compute', difficulty: 2,
    prompt: 'Y chỉ bằng 1 ở hai hàng AB = 01 và 10. SOP chính tắc là gì?',
    options: ['(NOT A)·B + A·(NOT B)', 'AB', 'A+B', '(NOT A)·(NOT B) + AB'], answerIndex: 0,
    hints: [{ level: 1, text: 'Viết một minterm cho mỗi hàng 1 rồi OR chúng.' }], explain: '01 tạo NOT A·B; 10 tạo A·NOT B. Đây là hàm XOR.',
  },
  {
    id: 'digital-sop-3', skillId: 'digital_sop', type: 'true-false', dimension: 'concept', difficulty: 2,
    prompt: 'Đúng hay sai?', statement: 'Mọi tích trong mọi dạng SOP đều bắt buộc chứa đủ tất cả biến đầu vào.', answer: false,
    hints: [{ level: 1, text: 'Phân biệt SOP tổng quát và SOP chính tắc.' }], explain: 'Sai. Chỉ minterm trong SOP chính tắc bắt buộc đủ biến. SOP rút gọn như A+BC vẫn hợp lệ.',
  },
  {
    id: 'digital-adder-1', skillId: 'digital_adder', type: 'multiple-choice', dimension: 'compute', difficulty: 2,
    prompt: 'Full adder nhận A = 1, B = 1, Cᵢₙ = 1. Cặp (S, Cₒᵤₜ) là gì?',
    options: ['(0, 1)', '(1, 0)', '(1, 1)', '(0, 0)'], answerIndex: 2,
    hints: [{ level: 1, text: 'Tổng số học là 3 = 11₂.' }], explain: '1+1+1=3=1+2×1. Vì vậy bit tổng S=1, nhớ ra Cₒᵤₜ=1.',
  },
  {
    id: 'digital-adder-2', skillId: 'digital_adder', type: 'multiple-choice', dimension: 'compute', difficulty: 2,
    prompt: 'Bộ cộng 4 bit tính 1011₂ + 0110₂, C₀ = 0. Cặp (C₄, S₃S₂S₁S₀) là gì?',
    options: ['(1, 0001)', '(0, 0001)', '(1, 1001)', '(0, 1111)'], answerIndex: 0,
    hints: [{ level: 1, text: 'Đổi sang thập phân: 11 + 6 = 17.' }], explain: '17 = 10001₂. Bốn bit tổng là 0001, bit nhớ ra là 1.',
  },
  {
    id: 'digital-adder-3', skillId: 'digital_adder', type: 'multiple-choice', dimension: 'concept', difficulty: 2,
    prompt: 'Để ghép các full adder 1 bit thành ripple-carry adder, nối như thế nào?',
    options: ['Tổng bit i vào A của bit i+1', 'Mọi nhớ vào luôn bằng 0', 'Nhớ từ bit cao về bit thấp', 'Nhớ ra bit i vào nhớ vào bit i+1'], answerIndex: 3,
    hints: [{ level: 1, text: 'Cộng tay từ hàng đơn vị rồi chuyển nhớ lên hàng kế tiếp.' }], explain: 'Cᵢ₊₁ từ FAᵢ trở thành carry-in của FAᵢ₊₁. Chỉ C₀ được đặt độc lập.',
  },
  {
    id: 'digital-circuit-1', skillId: 'digital_circuit_types', type: 'multiple-choice', dimension: 'concept', difficulty: 1,
    prompt: 'Mạch nào là mạch tổ hợp?', options: ['Thanh ghi 4 bit', 'Bộ cộng 4 bit không có thanh ghi', 'Bộ đếm có clock', 'Flip-flop D'], answerIndex: 1,
    hints: [{ level: 1, text: 'Tìm mạch không lưu trạng thái.' }], explain: 'Bộ cộng chỉ phụ thuộc A,B,C₀ hiện tại. Thanh ghi, bộ đếm và flip-flop lưu trạng thái.',
  },
  {
    id: 'digital-circuit-2', skillId: 'digital_circuit_types', type: 'numeric-input', dimension: 'compute', difficulty: 2,
    prompt: 'Flip-flop D kích cạnh lên đang có Q = 0, không reset/enable. D đổi thành 1 nhưng chưa có cạnh lên clock. Q bằng bao nhiêu?', answer: 0, tolerance: 0,
    hints: [{ level: 1, text: 'Giữa các cạnh lên, flip-flop giữ giá trị cũ.' }], explain: 'Q vẫn là 0. Tại cạnh lên tiếp theo, nếu D vẫn là 1 và thỏa yêu cầu thời gian, Q mới nhận 1.',
  },
  {
    id: 'digital-circuit-3', skillId: 'digital_circuit_types', type: 'true-false', dimension: 'concept', difficulty: 2,
    prompt: 'Đúng hay sai?', statement: 'Chỉ cần biết đầu vào hiện tại là luôn xác định được đầu ra của mọi mạch tuần tự.', answer: false,
    hints: [{ level: 1, text: 'Mạch tuần tự còn lưu thông tin gì?' }], explain: 'Sai. Còn phải biết trạng thái đang lưu; mô hình tổng quát là Q kế tiếp = g(Q,X), Y = h(Q,X).',
  },
];
