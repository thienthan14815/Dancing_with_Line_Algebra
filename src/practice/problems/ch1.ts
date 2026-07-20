// Bài tập chương 1 (ch1-vectors). Nội dung gốc, tự soạn.
import { createElement as h, Fragment, type ReactNode } from 'react';
import type { Problem } from '../types';
import MathText from '../../components/MathText';

const m = (tex: string): ReactNode => h(MathText, { tex });
const mb = (tex: string): ReactNode => h(MathText, { tex, block: true });
const f = (...kids: ReactNode[]): ReactNode => h(Fragment, null, ...kids);

export const problems: Problem[] = [
  {
    id: 'length-unit-1',
    chapterId: 'ch1-vectors',
    difficulty: 'basic',
    topic: 'Độ dài & vector đơn vị',
    statement: f(
      'Cho vector ',
      m('\\mathbf{v}=(2,\\,-1,\\,2)'),
      '. (a) Tính độ dài ',
      m('\\|\\mathbf{v}\\|'),
      '. (b) Tìm vector đơn vị cùng hướng với ',
      m('\\mathbf{v}'),
      '.',
    ),
    steps: [
      {
        title: 'Độ dài',
        content: mb('\\|\\mathbf{v}\\|=\\sqrt{2^2+(-1)^2+2^2}=\\sqrt{4+1+4}=\\sqrt{9}=3'),
      },
      {
        title: 'Vector đơn vị',
        content: f(
          'Chia mỗi thành phần cho độ dài:',
          mb(
            '\\hat{\\mathbf{v}}=\\frac{\\mathbf{v}}{\\|\\mathbf{v}\\|}=\\frac13(2,-1,2)=\\left(\\tfrac23,\\,-\\tfrac13,\\,\\tfrac23\\right)',
          ),
        ),
      },
      {
        title: 'Kiểm tra',
        content: f(
          'Độ dài của ',
          m('\\hat{\\mathbf{v}}'),
          ' bằng ',
          m('\\sqrt{\\tfrac49+\\tfrac19+\\tfrac49}=\\sqrt{\\tfrac{9}{9}}=1'),
          ' ✓.',
        ),
      },
    ],
    answer: f(
      m('\\|\\mathbf{v}\\|=3'),
      ', ',
      m('\\hat{\\mathbf{v}}=\\left(\\tfrac23,-\\tfrac13,\\tfrac23\\right)'),
      '.',
    ),
  },
  {
    id: 'combination-1',
    chapterId: 'ch1-vectors',
    difficulty: 'basic',
    topic: 'Cộng/trừ & tổ hợp tuyến tính',
    statement: f(
      'Cho ',
      m('\\mathbf{u}=(2,-1,3)'),
      ' và ',
      m('\\mathbf{v}=(1,4,-2)'),
      '. Tính ',
      m('\\mathbf{u}+\\mathbf{v}'),
      ', ',
      m('\\mathbf{u}-\\mathbf{v}'),
      ' và tổ hợp tuyến tính ',
      m('2\\mathbf{u}+3\\mathbf{v}'),
      '.',
    ),
    steps: [
      {
        title: 'Cộng theo từng thành phần',
        content: mb('\\mathbf{u}+\\mathbf{v}=(2+1,\\,-1+4,\\,3-2)=(3,3,1)'),
      },
      {
        title: 'Trừ theo từng thành phần',
        content: mb('\\mathbf{u}-\\mathbf{v}=(2-1,\\,-1-4,\\,3+2)=(1,-5,5)'),
      },
      {
        title: 'Tổ hợp tuyến tính',
        content: f(
          'Nhân vô hướng rồi cộng: ',
          m('2\\mathbf{u}=(4,-2,6)'),
          ' và ',
          m('3\\mathbf{v}=(3,12,-6)'),
          '.',
          mb('2\\mathbf{u}+3\\mathbf{v}=(4+3,\\,-2+12,\\,6-6)=(7,10,0)'),
        ),
      },
    ],
    answer: f(
      m('\\mathbf{u}+\\mathbf{v}=(3,3,1)'),
      ', ',
      m('\\mathbf{u}-\\mathbf{v}=(1,-5,5)'),
      ', ',
      m('2\\mathbf{u}+3\\mathbf{v}=(7,10,0)'),
      '.',
    ),
  },
  {
    id: 'span-1',
    chapterId: 'ch1-vectors',
    difficulty: 'medium',
    topic: 'Kiểm tra thuộc span',
    statement: f(
      'Cho ',
      m('\\mathbf{u}=(1,0,2)'),
      ' và ',
      m('\\mathbf{v}=(0,1,-1)'),
      '. Xét mỗi vector sau có thuộc ',
      m('\\operatorname{span}\\{\\mathbf{u},\\mathbf{v}\\}'),
      ' không: (a) ',
      m('\\mathbf{w}=(3,1,5)'),
      '; (b) ',
      m('\\mathbf{z}=(1,2,3)'),
      '.',
    ),
    steps: [
      {
        title: 'Thiết lập tổ hợp',
        content: f(
          'Ta cần tìm ',
          m('a,b'),
          ' sao cho ',
          m('a\\mathbf{u}+b\\mathbf{v}=(a,\\ b,\\ 2a-b)'),
          ' bằng vector đã cho.',
        ),
      },
      {
        title: '(a) Với w = (3,1,5)',
        content: f(
          'So khớp thành phần đầu: ',
          m('a=3'),
          '; thành phần hai: ',
          m('b=1'),
          '. Thành phần ba cần ',
          m('2a-b=2(3)-1=5'),
          ', đúng bằng ',
          m('5'),
          '. Vậy ',
          m('\\mathbf{w}=3\\mathbf{u}+\\mathbf{v}\\in\\operatorname{span}\\{\\mathbf{u},\\mathbf{v}\\}'),
          '.',
        ),
      },
      {
        title: '(b) Với z = (1,2,3)',
        content: f(
          'So khớp: ',
          m('a=1'),
          ', ',
          m('b=2'),
          '. Thành phần ba cần ',
          m('2a-b=2(1)-2=0'),
          ', nhưng z có thành phần ba là ',
          m('3\\neq0'),
          '. Mâu thuẫn, nên ',
          m('\\mathbf{z}\\notin\\operatorname{span}\\{\\mathbf{u},\\mathbf{v}\\}'),
          '.',
        ),
      },
    ],
    answer: f('(a) Có, ', m('\\mathbf{w}=3\\mathbf{u}+\\mathbf{v}'), '. (b) Không.'),
  },
  {
    id: 'dot-angle-1',
    chapterId: 'ch1-vectors',
    difficulty: 'medium',
    topic: 'Dot product & góc',
    statement: f(
      'Cho ',
      m('\\mathbf{u}=(1,1,0)'),
      ' và ',
      m('\\mathbf{v}=(1,0,1)'),
      '. Tính tích vô hướng ',
      m('\\mathbf{u}\\cdot\\mathbf{v}'),
      ' và góc ',
      m('\\theta'),
      ' giữa hai vector.',
    ),
    steps: [
      {
        title: 'Tích vô hướng',
        content: mb('\\mathbf{u}\\cdot\\mathbf{v}=(1)(1)+(1)(0)+(0)(1)=1'),
      },
      {
        title: 'Độ dài hai vector',
        content: mb(
          '\\|\\mathbf{u}\\|=\\sqrt{1^2+1^2+0^2}=\\sqrt2,\\qquad \\|\\mathbf{v}\\|=\\sqrt{1^2+0^2+1^2}=\\sqrt2',
        ),
      },
      {
        title: 'Công thức góc',
        content: mb(
          '\\cos\\theta=\\frac{\\mathbf{u}\\cdot\\mathbf{v}}{\\|\\mathbf{u}\\|\\,\\|\\mathbf{v}\\|}=\\frac{1}{\\sqrt2\\cdot\\sqrt2}=\\frac12',
        ),
      },
      {
        title: 'Suy ra góc',
        content: f(m('\\theta=\\arccos\\tfrac12=60^\\circ'), ' (tức ', m('\\tfrac{\\pi}{3}'), ').'),
      },
    ],
    answer: f(m('\\mathbf{u}\\cdot\\mathbf{v}=1'), ', ', m('\\theta=60^\\circ'), '.'),
  },
  {
    id: 'projection-1',
    chapterId: 'ch1-vectors',
    difficulty: 'hard',
    topic: 'Hình chiếu (projection)',
    statement: f(
      'Cho ',
      m('\\mathbf{u}=(3,4)'),
      ' và ',
      m('\\mathbf{v}=(2,1)'),
      '. Tính hình chiếu vô hướng (scalar projection) của ',
      m('\\mathbf{u}'),
      ' lên ',
      m('\\mathbf{v}'),
      ', và vector hình chiếu ',
      m('\\operatorname{proj}_{\\mathbf{v}}\\mathbf{u}'),
      '.',
    ),
    steps: [
      {
        title: 'Tích vô hướng và độ dài',
        content: mb(
          '\\mathbf{u}\\cdot\\mathbf{v}=(3)(2)+(4)(1)=10,\\qquad \\|\\mathbf{v}\\|=\\sqrt{2^2+1^2}=\\sqrt5',
        ),
      },
      {
        title: 'Hình chiếu vô hướng',
        content: mb(
          '\\operatorname{comp}_{\\mathbf{v}}\\mathbf{u}=\\frac{\\mathbf{u}\\cdot\\mathbf{v}}{\\|\\mathbf{v}\\|}=\\frac{10}{\\sqrt5}=2\\sqrt5',
        ),
      },
      {
        title: 'Vector hình chiếu',
        content: mb(
          '\\operatorname{proj}_{\\mathbf{v}}\\mathbf{u}=\\frac{\\mathbf{u}\\cdot\\mathbf{v}}{\\|\\mathbf{v}\\|^2}\\,\\mathbf{v}=\\frac{10}{5}(2,1)=2(2,1)=(4,2)',
        ),
      },
    ],
    answer: f(
      'Scalar projection ',
      m('=2\\sqrt5'),
      '; ',
      m('\\operatorname{proj}_{\\mathbf{v}}\\mathbf{u}=(4,2)'),
      '.',
    ),
  },
  {
    id: 'cross-area-exam-1',
    chapterId: 'ch1-vectors',
    difficulty: 'exam',
    topic: 'Cross product, diện tích & pháp tuyến',
    statement: f(
      'Trong không gian, cho tam giác với các đỉnh ',
      m('A(1,0,2)'),
      ', ',
      m('B(3,1,4)'),
      ', ',
      m('C(2,3,1)'),
      '. (a) Tính ',
      m('\\overrightarrow{AB}\\times\\overrightarrow{AC}'),
      '. (b) Tính diện tích tam giác ',
      m('ABC'),
      '. (c) Tìm một vector pháp tuyến đơn vị của mặt phẳng ',
      m('(ABC)'),
      '.',
    ),
    steps: [
      {
        title: 'Hai vector cạnh',
        content: mb(
          '\\overrightarrow{AB}=B-A=(2,1,2),\\qquad \\overrightarrow{AC}=C-A=(1,3,-1)',
        ),
      },
      {
        title: 'Tích có hướng',
        content: f(
          'Dùng định thức',
          mb(
            '\\overrightarrow{AB}\\times\\overrightarrow{AC}=\\begin{vmatrix}\\mathbf{i}&\\mathbf{j}&\\mathbf{k}\\\\2&1&2\\\\1&3&-1\\end{vmatrix}',
          ),
          'Các thành phần: ',
          m('\\mathbf{i}:(1)(-1)-(2)(3)=-7'),
          '; ',
          m('\\mathbf{j}:-\\big[(2)(-1)-(2)(1)\\big]=4'),
          '; ',
          m('\\mathbf{k}:(2)(3)-(1)(1)=5'),
          '. Vậy ',
          m('\\overrightarrow{AB}\\times\\overrightarrow{AC}=(-7,4,5)'),
          '.',
        ),
      },
      {
        title: 'Độ dài tích có hướng',
        content: mb(
          '\\|\\overrightarrow{AB}\\times\\overrightarrow{AC}\\|=\\sqrt{(-7)^2+4^2+5^2}=\\sqrt{49+16+25}=\\sqrt{90}=3\\sqrt{10}',
        ),
      },
      {
        title: 'Diện tích tam giác',
        content: f(
          'Diện tích tam giác bằng nửa độ dài tích có hướng:',
          mb(
            'S=\\tfrac12\\,\\|\\overrightarrow{AB}\\times\\overrightarrow{AC}\\|=\\tfrac12\\cdot3\\sqrt{10}=\\frac{3\\sqrt{10}}{2}',
          ),
        ),
      },
      {
        title: 'Vector pháp tuyến đơn vị',
        content: mb(
          '\\mathbf{n}=\\frac{(-7,4,5)}{3\\sqrt{10}}=\\left(\\frac{-7}{3\\sqrt{10}},\\ \\frac{4}{3\\sqrt{10}},\\ \\frac{5}{3\\sqrt{10}}\\right)',
        ),
      },
    ],
    answer: f(
      m('\\overrightarrow{AB}\\times\\overrightarrow{AC}=(-7,4,5)'),
      ', ',
      m('S=\\tfrac{3\\sqrt{10}}{2}'),
      ', ',
      m('\\mathbf{n}=\\tfrac{1}{3\\sqrt{10}}(-7,4,5)'),
      '.',
    ),
  },
];
