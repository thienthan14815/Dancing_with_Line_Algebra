// Bài tập chương 7 (ch7-code). Nội dung gốc do agent soạn.
import { createElement as h, Fragment } from 'react';
import type { Problem } from '../types';
import MathText from '../../components/MathText';

const m = (tex: string) => h(MathText, { tex });
const mb = (tex: string) => h(MathText, { tex, block: true });

export const problems: Problem[] = [
  // 1 — basic: đồ họa — xoay & scale một điểm
  {
    id: 'ch7-graphics-1',
    chapterId: 'ch7-code',
    difficulty: 'basic',
    topic: 'Graphics transform',
    statement: h(
      Fragment,
      null,
      'Trong đồ họa 2D, xoay điểm ',
      m('P=(3,4)'),
      ' quanh gốc một góc ',
      m('90^\\circ'),
      ' ngược chiều kim đồng hồ, rồi phóng to (scale) hệ số ',
      m('2'),
      '. Tìm tọa độ ảnh.',
    ),
    steps: [
      {
        title: 'Ma trận xoay',
        content: h(
          Fragment,
          null,
          m(
            'R(90^\\circ)=\\begin{bmatrix}\\cos90^\\circ&-\\sin90^\\circ\\\\\\sin90^\\circ&\\cos90^\\circ\\end{bmatrix}=\\begin{bmatrix}0&-1\\\\1&0\\end{bmatrix}',
          ),
          '.',
        ),
      },
      {
        title: 'Áp dụng xoay',
        content: h(
          Fragment,
          null,
          m(
            'R\\begin{bmatrix}3\\\\4\\end{bmatrix}=\\begin{bmatrix}0\\cdot3-1\\cdot4\\\\1\\cdot3+0\\cdot4\\end{bmatrix}=\\begin{bmatrix}-4\\\\3\\end{bmatrix}',
          ),
          '.',
        ),
      },
      {
        title: 'Áp dụng scale ×2',
        content: h(
          Fragment,
          null,
          m('2\\cdot(-4,3)=(-8,6)'),
          '.',
        ),
      },
      {
        title: 'Hướng code',
        content: h(
          Fragment,
          null,
          'Biểu diễn điểm bằng vector cột và nhân ma trận: cả hai phép hợp thành ',
          m('M=S\\,R=\\begin{bmatrix}0&-2\\\\2&0\\end{bmatrix}'),
          ', rồi ',
          m("P'=M\\,P"),
          ' (trong NumPy: ',
          m('M\\,@\\,P'),
          ').',
        ),
      },
    ],
    answer: h(Fragment, null, m("P'=(-8,6)")),
  },

  // 2 — medium: least squares khớp đường thẳng (normal equation)
  {
    id: 'ch7-lsq-1',
    chapterId: 'ch7-code',
    difficulty: 'medium',
    topic: 'Least squares line fit',
    statement: h(
      Fragment,
      null,
      'Khớp đường thẳng ',
      m('y=a+bx'),
      ' theo phương pháp bình phương tối thiểu (least squares) cho dữ liệu ',
      m('(0,2),(1,2),(2,4),(3,8)'),
      '.',
    ),
    steps: [
      {
        title: 'Lập ma trận thiết kế',
        content: h(
          Fragment,
          null,
          m(
            'X=\\begin{bmatrix}1&0\\\\1&1\\\\1&2\\\\1&3\\end{bmatrix},\\quad y=\\begin{bmatrix}2\\\\2\\\\4\\\\8\\end{bmatrix},\\quad \\beta=\\begin{bmatrix}a\\\\b\\end{bmatrix}',
          ),
          '.',
        ),
      },
      {
        title: 'Normal equation',
        content: h(
          Fragment,
          null,
          'Giải ',
          m('X^{T}X\\beta=X^{T}y'),
          ':',
          mb(
            'X^{T}X=\\begin{bmatrix}4&6\\\\6&14\\end{bmatrix},\\qquad X^{T}y=\\begin{bmatrix}16\\\\34\\end{bmatrix}.',
          ),
        ),
      },
      {
        title: 'Giải hệ',
        content: h(
          Fragment,
          null,
          mb('\\begin{cases}4a+6b=16\\\\ 6a+14b=34\\end{cases}\\Rightarrow 10b=20\\Rightarrow b=2,\\;a=1.'),
        ),
      },
      {
        title: 'Kết quả & sai số',
        content: h(
          Fragment,
          null,
          'Đường khớp ',
          m('y=1+2x'),
          '. Giá trị dự đoán ',
          m('(2,3,5,7)'),
          ', residual ',
          m('(1,-1,-1,1)'),
          ', tổng bình phương sai số ',
          m('\\text{SSE}=4'),
          '.',
        ),
      },
      {
        title: 'Hướng code',
        content: h(
          Fragment,
          null,
          'Dựng ',
          m('X'),
          ' (cột 1 toàn số 1, cột 2 là ',
          m('x'),
          '), rồi ',
          m('\\beta=\\text{np.linalg.lstsq}(X,y)'),
          ' hoặc giải ',
          m('\\text{np.linalg.solve}(X^{T}X,\\,X^{T}y)'),
          '.',
        ),
      },
    ],
    answer: h(Fragment, null, m('y=1+2x')),
  },

  // 3 — medium: đồ họa — biến đổi tam giác (hợp thành ma trận)
  {
    id: 'ch7-graphics-2',
    chapterId: 'ch7-code',
    difficulty: 'medium',
    topic: 'Graphics: transform a shape',
    statement: h(
      Fragment,
      null,
      'Tam giác có các đỉnh ',
      m('A=(1,0),\\,B=(0,1),\\,C=(1,1)'),
      '. Xoay ',
      m('90^\\circ'),
      ' ngược chiều kim đồng hồ rồi scale hệ số ',
      m('2'),
      '. Tìm tọa độ các đỉnh mới.',
    ),
    steps: [
      {
        title: 'Ma trận hợp thành',
        content: h(
          Fragment,
          null,
          'Xoay rồi scale nên nhân theo thứ tự ',
          m('M=S\\,R'),
          ':',
          mb(
            'M=\\begin{bmatrix}2&0\\\\0&2\\end{bmatrix}\\begin{bmatrix}0&-1\\\\1&0\\end{bmatrix}=\\begin{bmatrix}0&-2\\\\2&0\\end{bmatrix}.',
          ),
        ),
      },
      {
        title: 'Xếp các đỉnh thành cột và nhân một lần',
        content: h(
          Fragment,
          null,
          m(
            'M\\begin{bmatrix}1&0&1\\\\0&1&1\\end{bmatrix}=\\begin{bmatrix}0&-2&-2\\\\2&0&2\\end{bmatrix}',
          ),
          '.',
        ),
      },
      {
        title: 'Đọc kết quả',
        content: h(
          Fragment,
          null,
          m("A'=(0,2),\\;B'=(-2,0),\\;C'=(-2,2)"),
          '.',
        ),
      },
      {
        title: 'Hướng code',
        content: h(
          Fragment,
          null,
          'Lưu các đỉnh thành ma trận ',
          m('2\\times n'),
          ' (mỗi cột một điểm), tính ',
          m('M'),
          ' một lần rồi ',
          m('M\\,@\\,\\text{pts}'),
          ' để biến đổi cả hình chỉ với một phép nhân ma trận.',
        ),
      },
    ],
    answer: h(
      Fragment,
      null,
      m("A'=(0,2),\\;B'=(-2,0),\\;C'=(-2,2)"),
    ),
  },

  // 4 — hard: power iteration ước lượng eigenvector trội
  {
    id: 'ch7-power-1',
    chapterId: 'ch7-code',
    difficulty: 'hard',
    topic: 'Power iteration',
    statement: h(
      Fragment,
      null,
      'Dùng power iteration cho ',
      m('A=\\begin{bmatrix}2&1\\\\1&2\\end{bmatrix}'),
      ' với vector đầu ',
      m('x_0=(1,0)'),
      '. Thực hiện 2 bước và ước lượng eigenvalue trội bằng thương Rayleigh.',
    ),
    steps: [
      {
        title: 'Bước 1',
        content: h(
          Fragment,
          null,
          m('x_1=Ax_0=(2,1)'),
          '. Chuẩn hóa theo phần tử lớn nhất: ',
          m('(1,\\,0.5)'),
          '.',
        ),
      },
      {
        title: 'Bước 2',
        content: h(
          Fragment,
          null,
          m('x_2=Ax_1=A(2,1)=(5,4)'),
          '. Chuẩn hóa: ',
          m('(1,\\,0.8)'),
          ' — đang tiến dần về eigenvector trội ',
          m('(1,1)'),
          '.',
        ),
      },
      {
        title: 'Thương Rayleigh (ước lượng eigenvalue)',
        content: h(
          Fragment,
          null,
          mb(
            '\\lambda\\approx\\frac{x_1^{T}Ax_1}{x_1^{T}x_1}=\\frac{(2,1)\\cdot(5,4)}{(2,1)\\cdot(2,1)}=\\frac{14}{5}=2.8',
          ),
          'tiến dần về eigenvalue trội thực sự ',
          m('\\lambda_{\\max}=3'),
          '.',
        ),
      },
      {
        title: 'Hướng code',
        content: h(
          Fragment,
          null,
          'Vòng lặp: ',
          m('x\\leftarrow Ax'),
          ' rồi ',
          m('x\\leftarrow x/\\lVert x\\rVert'),
          '; lặp đến khi ',
          m('x'),
          ' ổn định. Thành phần theo ',
          m('\\lambda=1'),
          ' co lại như ',
          m('(1/3)^k'),
          ' nên hội tụ nhanh.',
        ),
      },
    ],
    answer: h(
      Fragment,
      null,
      'Hội tụ về eigenvector ',
      m('(1,1)'),
      '; ước lượng ',
      m('\\lambda\\approx2.8\\to3'),
      '.',
    ),
  },

  // 5 — hard: PageRank một/hai bước + trạng thái dừng
  {
    id: 'ch7-pagerank-1',
    chapterId: 'ch7-code',
    difficulty: 'hard',
    topic: 'PageRank',
    statement: h(
      Fragment,
      null,
      'Một mạng 3 trang với liên kết: ',
      m('1\\!\\to\\!2,\\;1\\!\\to\\!3,\\;2\\!\\to\\!3,\\;3\\!\\to\\!1'),
      '. Lập ma trận PageRank (cột ngẫu nhiên), chạy vài bước power iteration từ phân phối đều và tìm trạng thái dừng (PageRank).',
    ),
    steps: [
      {
        title: 'Ma trận chuyển',
        content: h(
          Fragment,
          null,
          'Cột ',
          m('j'),
          ' phân đều xác suất cho các trang mà ',
          m('j'),
          ' trỏ tới. Trang 1 trỏ 2 nơi (2,3), trang 2 trỏ 3, trang 3 trỏ 1:',
          mb(
            'M=\\begin{bmatrix}0&0&1\\\\ \\tfrac12&0&0\\\\ \\tfrac12&1&0\\end{bmatrix}.',
          ),
        ),
      },
      {
        title: 'Hai bước power iteration',
        content: h(
          Fragment,
          null,
          'Từ ',
          m('r_0=(\\tfrac13,\\tfrac13,\\tfrac13)'),
          ': ',
          m('r_1=Mr_0=(\\tfrac13,\\tfrac16,\\tfrac12)'),
          ', rồi ',
          m('r_2=Mr_1=(\\tfrac12,\\tfrac16,\\tfrac13)'),
          ' (mỗi bước tổng vẫn bằng 1).',
        ),
      },
      {
        title: 'Trạng thái dừng (eigenvector λ = 1)',
        content: h(
          Fragment,
          null,
          'Giải ',
          m('Mr=r'),
          ': đặt ',
          m('r=(a,b,c)'),
          ' thì ',
          m('a=c,\\;b=\\tfrac a2,\\;c=\\tfrac a2+b=a'),
          '. Chuẩn hóa ',
          m('a+b+c=1\\Rightarrow \\tfrac52 a=1'),
          ':',
          mb('r^*=(0.4,\\,0.2,\\,0.4).'),
        ),
      },
      {
        title: 'Kiểm tra & hướng code',
        content: h(
          Fragment,
          null,
          m('Mr^*=(0.4,\\,0.2,\\,0.4)=r^*'),
          ' ✓. Code: lặp ',
          m('r\\leftarrow Mr'),
          ' đến khi ',
          m('\\lVert r_{k+1}-r_k\\rVert'),
          ' đủ nhỏ; trang 1 và 3 quan trọng nhất.',
        ),
      },
    ],
    answer: h(
      Fragment,
      null,
      'PageRank ',
      m('r^*=(0.4,\\,0.2,\\,0.4)'),
      ' — trang 1 và 3 hạng cao nhất.',
    ),
  },

  // 6 — exam: nén ảnh SVD — dung lượng lý thuyết
  {
    id: 'ch7-exam-1',
    chapterId: 'ch7-code',
    difficulty: 'exam',
    topic: 'SVD image compression',
    statement: h(
      Fragment,
      null,
      'Một ảnh xám kích thước ',
      m('200\\times100'),
      ' pixel được nén bằng SVD giữ ',
      m('k'),
      ' singular value lớn nhất. (a) Tính số tham số phải lưu theo ',
      m('k'),
      '; (b) với ',
      m('k=10'),
      ' tỉ lệ nén là bao nhiêu; (c) tìm ',
      m('k'),
      ' hòa vốn; (d) sai số Frobenius tương đối được tính thế nào và nêu hướng code.',
    ),
    steps: [
      {
        title: '(a) Số tham số',
        content: h(
          Fragment,
          null,
          'Ảnh đầy đủ: ',
          m('200\\times100=20000'),
          ' số. Giữ rank-',
          m('k'),
          ' cần ',
          m('U_k\\,(200\\times k)'),
          ', ',
          m('V_k\\,(100\\times k)'),
          ' và ',
          m('k'),
          ' singular value:',
          mb('k(200+100+1)=301k\\text{ số.}'),
        ),
      },
      {
        title: '(b) Tỉ lệ nén khi k = 10',
        content: h(
          Fragment,
          null,
          m('301\\times10=3010'),
          ' số, tức ',
          m('20000/3010\\approx6.6'),
          ' lần (chỉ ~15% dung lượng gốc).',
        ),
      },
      {
        title: '(c) Điểm hòa vốn',
        content: h(
          Fragment,
          null,
          'Giải ',
          m('301k=20000\\Rightarrow k\\approx66'),
          '. Chỉ có lợi khi ',
          m('k<66'),
          '; lấy ',
          m('k'),
          ' quá lớn thì lưu SVD còn tốn hơn ảnh gốc.',
        ),
      },
      {
        title: '(d) Sai số Frobenius & hướng code',
        content: h(
          Fragment,
          null,
          'Theo Eckart–Young, sai số tương đối là',
          mb(
            '\\frac{\\lVert A-A_k\\rVert_F}{\\lVert A\\rVert_F}=\\sqrt{\\frac{\\sum_{i>k}\\sigma_i^2}{\\sum_{i}\\sigma_i^2}}.',
          ),
          'Ví dụ nếu 10 singular value đầu giữ 98% năng lượng thì sai số ',
          m('\\approx\\sqrt{0.02}\\approx14\\%'),
          '. Code: ',
          m('U,S,V^{T}=\\text{svd}(A)'),
          ', rồi ',
          m('A_k=U[:,:k]\\,\\operatorname{diag}(S[:k])\\,V^{T}[:k,:]'),
          '; chỉ lưu ',
          m('U[:,:k],\\,S[:k],\\,V^{T}[:k,:]'),
          '.',
        ),
      },
    ],
    answer: h(
      Fragment,
      null,
      m('301k'),
      ' số; ',
      m('k=10'),
      ' nén ~',
      m('6.6\\times'),
      '; hòa vốn ',
      m('k\\approx66'),
      '; sai số ',
      m('=\\sqrt{\\sum_{i>k}\\sigma_i^2/\\sum_i\\sigma_i^2}'),
      '.',
    ),
  },
];
