// Bài tập chương 0 (ch0-foundations). Nội dung gốc, tự soạn.
import { createElement as h, Fragment, type ReactNode } from 'react';
import type { Problem } from '../types';
import MathText from '../../components/MathText';

// Helper render: m = math inline, mb = math block, f = ghép nhiều node.
const m = (tex: string): ReactNode => h(MathText, { tex });
const mb = (tex: string): ReactNode => h(MathText, { tex, block: true });
const f = (...kids: ReactNode[]): ReactNode => h(Fragment, null, ...kids);

export const problems: Problem[] = [
  {
    id: 'distance-1',
    chapterId: 'ch0-foundations',
    difficulty: 'basic',
    topic: 'Khoảng cách hai điểm',
    statement: f(
      'Trong mặt phẳng tọa độ, cho hai điểm ',
      m('A(-2,\\,3)'),
      ' và ',
      m('B(4,\\,-5)'),
      '. Tính khoảng cách ',
      m('AB'),
      '.',
    ),
    steps: [
      {
        title: 'Công thức khoảng cách',
        content: f(
          'Với ',
          m('A(x_1,y_1)'),
          ' và ',
          m('B(x_2,y_2)'),
          ', khoảng cách là',
          mb('AB=\\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}'),
        ),
      },
      {
        title: 'Thay số',
        content: f(
          'Ta có ',
          m('x_2-x_1=4-(-2)=6'),
          ' và ',
          m('y_2-y_1=-5-3=-8'),
          '.',
        ),
      },
      {
        title: 'Tính kết quả',
        content: mb('AB=\\sqrt{6^2+(-8)^2}=\\sqrt{36+64}=\\sqrt{100}=10'),
      },
    ],
    answer: f(m('AB=10'), '.'),
  },
  {
    id: 'notation-1',
    chapterId: 'ch0-foundations',
    difficulty: 'basic',
    topic: 'Ký hiệu Σ, ∈, ℝⁿ',
    statement: f(
      'Cho vector ',
      m('x=(3,\\,-2,\\,4,\\,1)\\in\\mathbb{R}^4'),
      '. (a) Giải thích ý nghĩa ký hiệu ',
      m('\\mathbb{R}^4'),
      ' và ',
      m('\\in'),
      '. (b) Tính ',
      m('\\sum_{i=1}^{4} x_i'),
      '. (c) Tính ',
      m('\\sum_{i=1}^{4} x_i^2'),
      '.',
    ),
    steps: [
      {
        title: '(a) Đọc ký hiệu',
        content: f(
          m('\\mathbb{R}^4'),
          ' là tập các bộ 4 số thực có thứ tự; mỗi phần tử là một vector 4 chiều. Ký hiệu ',
          m('x\\in\\mathbb{R}^4'),
          ' đọc là "x thuộc ',
          m('\\mathbb{R}^4'),
          '", tức x có 4 thành phần thực. Ở đây ',
          m('x_1=3,\\ x_2=-2,\\ x_3=4,\\ x_4=1'),
          '.',
        ),
      },
      {
        title: '(b) Tổng các thành phần',
        content: mb('\\sum_{i=1}^{4} x_i = 3+(-2)+4+1 = 6'),
      },
      {
        title: '(c) Tổng bình phương',
        content: mb('\\sum_{i=1}^{4} x_i^2 = 3^2+(-2)^2+4^2+1^2 = 9+4+16+1 = 30'),
      },
    ],
    answer: f(m('\\sum x_i = 6'), ' và ', m('\\sum x_i^2 = 30'), '.'),
  },
  {
    id: 'system-sub-1',
    chapterId: 'ch0-foundations',
    difficulty: 'medium',
    topic: 'Hệ 2 ẩn – phép thế',
    statement: f(
      'Giải hệ phương trình sau bằng phương pháp thế:',
      mb('\\begin{cases} 2x+3y=12 \\\\ x-y=1 \\end{cases}'),
    ),
    steps: [
      {
        title: 'Rút một ẩn',
        content: f(
          'Từ phương trình thứ hai ',
          m('x-y=1'),
          ', ta rút ',
          m('x=y+1'),
          '.',
        ),
      },
      {
        title: 'Thế vào phương trình còn lại',
        content: f(
          'Thay ',
          m('x=y+1'),
          ' vào ',
          m('2x+3y=12'),
          ':',
          mb('2(y+1)+3y=12 \\;\\Rightarrow\\; 5y+2=12 \\;\\Rightarrow\\; 5y=10 \\;\\Rightarrow\\; y=2'),
        ),
      },
      {
        title: 'Tìm x',
        content: f('Thay ', m('y=2'), ' vào ', m('x=y+1'), ' được ', m('x=3'), '.'),
      },
      {
        title: 'Kiểm tra',
        content: f(m('2(3)+3(2)=12'), ' ✓ và ', m('3-2=1'), ' ✓.'),
      },
    ],
    answer: f(m('(x,y)=(3,2)'), '.'),
  },
  {
    id: 'system-elim-1',
    chapterId: 'ch0-foundations',
    difficulty: 'medium',
    topic: 'Hệ 2 ẩn – cộng đại số',
    statement: f(
      'Giải hệ sau bằng phương pháp cộng đại số (khử ẩn):',
      mb('\\begin{cases} 3x+4y=8 \\\\ 5x-2y=22 \\end{cases}'),
    ),
    steps: [
      {
        title: 'Làm hệ số của y đối nhau',
        content: f(
          'Nhân phương trình thứ hai với 2 để hệ số của ',
          m('y'),
          ' thành ',
          m('-4'),
          ':',
          mb('10x-4y=44'),
        ),
      },
      {
        title: 'Cộng hai phương trình',
        content: f(
          'Cộng ',
          m('3x+4y=8'),
          ' với ',
          m('10x-4y=44'),
          ' (khử ',
          m('y'),
          '):',
          mb('13x=52 \\;\\Rightarrow\\; x=4'),
        ),
      },
      {
        title: 'Tìm y',
        content: f(
          'Thay ',
          m('x=4'),
          ' vào ',
          m('3x+4y=8'),
          ':',
          mb('12+4y=8 \\;\\Rightarrow\\; 4y=-4 \\;\\Rightarrow\\; y=-1'),
        ),
      },
      {
        title: 'Kiểm tra',
        content: f(m('5(4)-2(-1)=20+2=22'), ' ✓.'),
      },
    ],
    answer: f(m('(x,y)=(4,-1)'), '.'),
  },
  {
    id: 'trig-unit-circle-1',
    chapterId: 'ch0-foundations',
    difficulty: 'hard',
    topic: 'sin/cos & đường tròn đơn vị',
    statement: f(
      'Xét đường tròn đơn vị. Một điểm ',
      m('P'),
      ' ứng với góc ',
      m('\\theta=\\dfrac{5\\pi}{6}'),
      ' (tức ',
      m('150^\\circ'),
      '). (a) Tìm tọa độ của ',
      m('P'),
      '. (b) Tính ',
      m('\\sin\\theta,\\ \\cos\\theta,\\ \\tan\\theta'),
      '. (c) Tìm mọi ',
      m('\\theta\\in[0,2\\pi)'),
      ' sao cho ',
      m('\\sin\\theta=\\tfrac12'),
      '.',
    ),
    steps: [
      {
        title: 'Tọa độ trên đường tròn đơn vị',
        content: f(
          'Điểm ứng với góc ',
          m('\\theta'),
          ' có tọa độ ',
          m('P=(\\cos\\theta,\\ \\sin\\theta)'),
          '. Góc ',
          m('150^\\circ'),
          ' nằm ở góc phần tư thứ hai, có góc tham chiếu ',
          m('180^\\circ-150^\\circ=30^\\circ'),
          '.',
        ),
      },
      {
        title: 'Dùng giá trị đặc biệt',
        content: f(
          'Vì ',
          m('\\cos30^\\circ=\\tfrac{\\sqrt3}{2}'),
          ' và ',
          m('\\sin30^\\circ=\\tfrac12'),
          '; ở góc phần tư thứ hai cos âm, sin dương nên',
          mb('\\cos150^\\circ=-\\frac{\\sqrt3}{2},\\qquad \\sin150^\\circ=\\frac12'),
          'Do đó ',
          m('P=\\left(-\\tfrac{\\sqrt3}{2},\\ \\tfrac12\\right)'),
          '.',
        ),
      },
      {
        title: 'Tính tan',
        content: mb(
          '\\tan150^\\circ=\\frac{\\sin150^\\circ}{\\cos150^\\circ}=\\frac{1/2}{-\\sqrt3/2}=-\\frac{1}{\\sqrt3}=-\\frac{\\sqrt3}{3}',
        ),
      },
      {
        title: '(c) Giải sin θ = 1/2',
        content: f(
          'Trên ',
          m('[0,2\\pi)'),
          ', ',
          m('\\sin\\theta=\\tfrac12'),
          ' tại ',
          m('\\theta=\\tfrac{\\pi}{6}'),
          ' (30°) và ',
          m('\\theta=\\tfrac{5\\pi}{6}'),
          ' (150°), vì sin dương ở hai góc phần tư thứ nhất và thứ hai.',
        ),
      },
    ],
    answer: f(
      m('P=\\left(-\\tfrac{\\sqrt3}{2},\\tfrac12\\right)'),
      '; ',
      m('\\sin\\theta=\\tfrac12,\\ \\cos\\theta=-\\tfrac{\\sqrt3}{2},\\ \\tan\\theta=-\\tfrac{\\sqrt3}{3}'),
      '; ',
      m('\\theta\\in\\{\\tfrac{\\pi}{6},\\tfrac{5\\pi}{6}\\}'),
      '.',
    ),
  },
  {
    id: 'system-model-exam-1',
    chapterId: 'ch0-foundations',
    difficulty: 'exam',
    topic: 'Mô hình → hệ 2 ẩn',
    statement: f(
      'Một quán trà bán hai loại đồ uống: trà (giá ',
      m('x'),
      ' nghìn/ly) và cà phê (giá ',
      m('y'),
      ' nghìn/ly). Buổi sáng bán 3 ly trà và 5 ly cà phê, thu 250 nghìn đồng. Buổi chiều bán 4 ly trà và 2 ly cà phê, thu 170 nghìn đồng. (a) Lập hệ phương trình. (b) Tìm giá mỗi loại.',
    ),
    steps: [
      {
        title: 'Lập hệ',
        content: mb('\\begin{cases} 3x+5y=250 \\\\ 4x+2y=170 \\end{cases}'),
      },
      {
        title: 'Rút gọn phương trình thứ hai',
        content: f(
          'Chia phương trình thứ hai cho 2: ',
          m('2x+y=85'),
          ', suy ra ',
          m('y=85-2x'),
          '.',
        ),
      },
      {
        title: 'Thế vào phương trình thứ nhất',
        content: mb(
          '3x+5(85-2x)=250 \\;\\Rightarrow\\; 3x+425-10x=250 \\;\\Rightarrow\\; -7x=-175 \\;\\Rightarrow\\; x=25',
        ),
      },
      {
        title: 'Tìm y',
        content: f(m('y=85-2(25)=35'), '.'),
      },
      {
        title: 'Kiểm tra',
        content: f(
          'Sáng: ',
          m('3(25)+5(35)=75+175=250'),
          ' ✓. Chiều: ',
          m('4(25)+2(35)=100+70=170'),
          ' ✓.',
        ),
      },
    ],
    answer: f('Trà ', m('25'), ' nghìn/ly, cà phê ', m('35'), ' nghìn/ly.'),
  },
];
