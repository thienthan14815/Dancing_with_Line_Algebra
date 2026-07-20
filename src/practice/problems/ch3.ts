// Bài tập chương 3 (ch3-matrices). Nội dung gốc, tự soạn.
import { createElement as h, Fragment, type ReactNode } from 'react';
import type { Problem } from '../types';
import MathText from '../../components/MathText';

const m = (tex: string): ReactNode => h(MathText, { tex });
const mb = (tex: string): ReactNode => h(MathText, { tex, block: true });
const f = (...kids: ReactNode[]): ReactNode => h(Fragment, null, ...kids);

export const problems: Problem[] = [
  {
    id: 'matmul-noncommute',
    chapterId: 'ch3-matrices',
    difficulty: 'basic',
    topic: 'Nhân ma trận & AB≠BA',
    statement: f(
      'Cho ',
      m('A=\\begin{bmatrix}1&2\\\\0&1\\end{bmatrix}'),
      ' và ',
      m('B=\\begin{bmatrix}1&0\\\\3&1\\end{bmatrix}'),
      '. Tính ',
      m('AB'),
      ' và ',
      m('BA'),
      ', rồi cho biết chúng có bằng nhau không.',
    ),
    steps: [
      {
        title: 'Tính AB',
        content: f(
          'Nhân hàng của ',
          m('A'),
          ' với cột của ',
          m('B'),
          ':',
          mb(
            'AB=\\begin{bmatrix}1\\cdot1+2\\cdot3 & 1\\cdot0+2\\cdot1\\\\0\\cdot1+1\\cdot3 & 0\\cdot0+1\\cdot1\\end{bmatrix}=\\begin{bmatrix}7&2\\\\3&1\\end{bmatrix}',
          ),
        ),
      },
      {
        title: 'Tính BA',
        content: mb(
          'BA=\\begin{bmatrix}1\\cdot1+0\\cdot0 & 1\\cdot2+0\\cdot1\\\\3\\cdot1+1\\cdot0 & 3\\cdot2+1\\cdot1\\end{bmatrix}=\\begin{bmatrix}1&2\\\\3&7\\end{bmatrix}',
        ),
      },
      {
        title: 'So sánh',
        content: f(
          m('AB=\\begin{bmatrix}7&2\\\\3&1\\end{bmatrix}\\neq\\begin{bmatrix}1&2\\\\3&7\\end{bmatrix}=BA'),
          '. Phép nhân ma trận không giao hoán.',
        ),
      },
    ],
    answer: f(
      m('AB=\\begin{bmatrix}7&2\\\\3&1\\end{bmatrix}'),
      ', ',
      m('BA=\\begin{bmatrix}1&2\\\\3&7\\end{bmatrix}'),
      '; ',
      m('AB\\neq BA'),
      '.',
    ),
  },
  {
    id: 'transform-from-images',
    chapterId: 'ch3-matrices',
    difficulty: 'medium',
    topic: 'Ma trận biến đổi từ ảnh của î, ĵ',
    statement: f(
      'Một biến đổi tuyến tính ',
      m('T:\\mathbb{R}^2\\to\\mathbb{R}^2'),
      ' biến ',
      m('\\hat{\\imath}=(1,0)'),
      ' thành ',
      m('(0,1)'),
      ' và ',
      m('\\hat{\\jmath}=(0,1)'),
      ' thành ',
      m('(-1,0)'),
      '. (a) Viết ma trận ',
      m('A'),
      ' của ',
      m('T'),
      '. (b) ',
      m('T'),
      ' là phép biến đổi hình học nào? (c) Tính ',
      m('T(4,2)'),
      '.',
    ),
    steps: [
      {
        title: 'Cột của ma trận là ảnh vector cơ sở',
        content: f(
          'Cột 1 là ',
          m('T(\\hat{\\imath})=(0,1)'),
          ', cột 2 là ',
          m('T(\\hat{\\jmath})=(-1,0)'),
          ':',
          mb('A=\\begin{bmatrix}0&-1\\\\1&0\\end{bmatrix}'),
        ),
      },
      {
        title: 'Nhận dạng',
        content: f(
          'Ma trận quay ',
          m('\\begin{bmatrix}\\cos\\theta&-\\sin\\theta\\\\\\sin\\theta&\\cos\\theta\\end{bmatrix}'),
          ' với ',
          m('\\theta=90^\\circ'),
          ' cho đúng ',
          m('A'),
          '. Vậy ',
          m('T'),
          ' là phép quay ',
          m('90^\\circ'),
          ' ngược chiều kim đồng hồ quanh gốc.',
        ),
      },
      {
        title: 'Ảnh của (4,2)',
        content: mb(
          'T(4,2)=A\\begin{bmatrix}4\\\\2\\end{bmatrix}=\\begin{bmatrix}0\\cdot4+(-1)\\cdot2\\\\1\\cdot4+0\\cdot2\\end{bmatrix}=\\begin{bmatrix}-2\\\\4\\end{bmatrix}',
        ),
      },
    ],
    answer: f(
      m('A=\\begin{bmatrix}0&-1\\\\1&0\\end{bmatrix}'),
      ' (quay ',
      m('90^\\circ'),
      ' ngược chiều kim đồng hồ), ',
      m('T(4,2)=(-2,4)'),
      '.',
    ),
  },
  {
    id: 'determinant',
    chapterId: 'ch3-matrices',
    difficulty: 'medium',
    topic: 'Determinant 2×2 & 3×3',
    statement: f(
      'Tính định thức của các ma trận: (a) ',
      m('A=\\begin{bmatrix}4&7\\\\2&6\\end{bmatrix}'),
      '; (b) ',
      m('B=\\begin{bmatrix}1&2&3\\\\0&1&4\\\\5&6&0\\end{bmatrix}'),
      '.',
    ),
    steps: [
      {
        title: '(a) Định thức 2×2',
        content: f(
          'Dùng công thức ',
          m('\\det\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}=ad-bc'),
          ':',
          mb('\\det A=4\\cdot6-7\\cdot2=24-14=10'),
        ),
      },
      {
        title: '(b) Khai triển theo hàng 1',
        content: mb(
          '\\det B=1\\begin{vmatrix}1&4\\\\6&0\\end{vmatrix}-2\\begin{vmatrix}0&4\\\\5&0\\end{vmatrix}+3\\begin{vmatrix}0&1\\\\5&6\\end{vmatrix}',
        ),
      },
      {
        title: 'Tính các định thức con',
        content: f(
          m('\\begin{vmatrix}1&4\\\\6&0\\end{vmatrix}=0-24=-24'),
          ', ',
          m('\\begin{vmatrix}0&4\\\\5&0\\end{vmatrix}=0-20=-20'),
          ', ',
          m('\\begin{vmatrix}0&1\\\\5&6\\end{vmatrix}=0-5=-5'),
          '.',
        ),
      },
      {
        title: 'Tổng hợp',
        content: mb('\\det B=1(-24)-2(-20)+3(-5)=-24+40-15=1'),
      },
    ],
    answer: f(m('\\det A=10'), ', ', m('\\det B=1'), '.'),
  },
  {
    id: 'inverse-solve',
    chapterId: 'ch3-matrices',
    difficulty: 'hard',
    topic: 'Nghịch đảo 2×2 & giải Ax=b',
    statement: f(
      'Cho ',
      m('A=\\begin{bmatrix}2&1\\\\5&3\\end{bmatrix}'),
      '. (a) Tìm ',
      m('A^{-1}'),
      '. (b) Dùng ',
      m('A^{-1}'),
      ' để giải hệ ',
      m('A\\mathbf{x}=\\mathbf{b}'),
      ' với ',
      m('\\mathbf{b}=(4,9)'),
      '.',
    ),
    steps: [
      {
        title: 'Định thức',
        content: mb('\\det A=2\\cdot3-1\\cdot5=6-5=1'),
      },
      {
        title: 'Công thức nghịch đảo 2×2',
        content: f(
          'Vì ',
          m('\\det A=1\\neq0'),
          ' nên ',
          m('A'),
          ' khả nghịch. Với ',
          m('A=\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}'),
          ', ',
          m('A^{-1}=\\dfrac{1}{ad-bc}\\begin{bmatrix}d&-b\\\\-c&a\\end{bmatrix}'),
          ':',
          mb(
            'A^{-1}=\\frac{1}{1}\\begin{bmatrix}3&-1\\\\-5&2\\end{bmatrix}=\\begin{bmatrix}3&-1\\\\-5&2\\end{bmatrix}',
          ),
        ),
      },
      {
        title: 'Giải hệ bằng x = A⁻¹b',
        content: mb(
          '\\mathbf{x}=A^{-1}\\mathbf{b}=\\begin{bmatrix}3&-1\\\\-5&2\\end{bmatrix}\\begin{bmatrix}4\\\\9\\end{bmatrix}=\\begin{bmatrix}3\\cdot4-1\\cdot9\\\\-5\\cdot4+2\\cdot9\\end{bmatrix}=\\begin{bmatrix}3\\\\-2\\end{bmatrix}',
        ),
      },
      {
        title: 'Kiểm tra',
        content: f(
          m(
            'A\\mathbf{x}=\\begin{bmatrix}2\\cdot3+1\\cdot(-2)\\\\5\\cdot3+3\\cdot(-2)\\end{bmatrix}=\\begin{bmatrix}4\\\\9\\end{bmatrix}=\\mathbf{b}',
          ),
          ' ✓.',
        ),
      },
    ],
    answer: f(
      m('A^{-1}=\\begin{bmatrix}3&-1\\\\-5&2\\end{bmatrix}'),
      ', ',
      m('\\mathbf{x}=(3,-2)'),
      '.',
    ),
  },
  {
    id: 'invertible-det',
    chapterId: 'ch3-matrices',
    difficulty: 'medium',
    topic: 'Xét khả nghịch qua det',
    statement: f(
      'Cho ma trận phụ thuộc tham số ',
      m('A=\\begin{bmatrix}k&2\\\\3&k-1\\end{bmatrix}'),
      '. Tìm mọi giá trị của ',
      m('k'),
      ' để ',
      m('A'),
      ' khả nghịch.',
    ),
    steps: [
      {
        title: 'Điều kiện khả nghịch',
        content: f(
          'Ma trận vuông khả nghịch khi và chỉ khi ',
          m('\\det A\\neq0'),
          '.',
        ),
      },
      {
        title: 'Tính định thức',
        content: mb('\\det A=k(k-1)-2\\cdot3=k^2-k-6=(k-3)(k+2)'),
      },
      {
        title: 'Tìm giá trị làm det = 0',
        content: f(
          m('\\det A=0\\Leftrightarrow (k-3)(k+2)=0\\Leftrightarrow k=3'),
          ' hoặc ',
          m('k=-2'),
          '.',
        ),
      },
      {
        title: 'Kết luận',
        content: f(
          m('A'),
          ' khả nghịch với mọi ',
          m('k'),
          ' trừ ',
          m('k=3'),
          ' và ',
          m('k=-2'),
          '.',
        ),
      },
    ],
    answer: f(m('A'), ' khả nghịch ', m('\\Leftrightarrow k\\neq3'), ' và ', m('k\\neq-2'), '.'),
  },
  {
    id: 'composition-area',
    chapterId: 'ch3-matrices',
    difficulty: 'exam',
    topic: 'Hợp thành, det = tỉ lệ diện tích & nghịch đảo',
    statement: f(
      'Cho phép trượt ngang (shear) ',
      m('S=\\begin{bmatrix}1&2\\\\0&1\\end{bmatrix}'),
      ' và phép co giãn ',
      m('D=\\begin{bmatrix}3&0\\\\0&2\\end{bmatrix}'),
      '. Một hình được áp ',
      m('D'),
      ' trước rồi ',
      m('S'),
      ' sau. (a) Tìm ma trận hợp thành ',
      m('M=SD'),
      '. (b) Nếu áp ',
      m('M'),
      ' lên hình vuông đơn vị (diện tích 1), ảnh có diện tích bao nhiêu? (c) Tìm ',
      m('M^{-1}'),
      '.',
    ),
    steps: [
      {
        title: 'Hợp thành M = SD',
        content: f(
          'Áp ',
          m('D'),
          ' trước nên nó đứng bên phải:',
          mb(
            'M=SD=\\begin{bmatrix}1&2\\\\0&1\\end{bmatrix}\\begin{bmatrix}3&0\\\\0&2\\end{bmatrix}=\\begin{bmatrix}1\\cdot3+2\\cdot0 & 1\\cdot0+2\\cdot2\\\\0\\cdot3+1\\cdot0 & 0\\cdot0+1\\cdot2\\end{bmatrix}=\\begin{bmatrix}3&4\\\\0&2\\end{bmatrix}',
          ),
        ),
      },
      {
        title: 'Diện tích ảnh = |det M|',
        content: f(
          'Định thức đo hệ số phóng đại diện tích:',
          mb('\\det M=3\\cdot2-4\\cdot0=6'),
          'Diện tích ảnh của hình vuông đơn vị là ',
          m('|\\det M|=6'),
          '. (Kiểm tra: ',
          m('\\det S=1'),
          ', ',
          m('\\det D=6'),
          ', và ',
          m('\\det M=\\det S\\cdot\\det D=6'),
          '.)',
        ),
      },
      {
        title: 'Nghịch đảo M',
        content: f(
          'Vì ',
          m('\\det M=6\\neq0'),
          ':',
          mb(
            'M^{-1}=\\frac{1}{6}\\begin{bmatrix}2&-4\\\\0&3\\end{bmatrix}=\\begin{bmatrix}\\tfrac13&-\\tfrac23\\\\0&\\tfrac12\\end{bmatrix}',
          ),
        ),
      },
      {
        title: 'Kiểm tra',
        content: mb(
          'MM^{-1}=\\begin{bmatrix}3&4\\\\0&2\\end{bmatrix}\\begin{bmatrix}\\tfrac13&-\\tfrac23\\\\0&\\tfrac12\\end{bmatrix}=\\begin{bmatrix}1&0\\\\0&1\\end{bmatrix}',
        ),
      },
    ],
    answer: f(
      m('M=\\begin{bmatrix}3&4\\\\0&2\\end{bmatrix}'),
      ', diện tích ',
      m('=6'),
      ', ',
      m('M^{-1}=\\begin{bmatrix}\\tfrac13&-\\tfrac23\\\\0&\\tfrac12\\end{bmatrix}'),
      '.',
    ),
  },
];
