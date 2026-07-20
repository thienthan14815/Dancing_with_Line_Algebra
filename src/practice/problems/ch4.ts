// Bài tập chương 4 (ch4-spaces). Nội dung gốc do agent soạn.
import { createElement as h, Fragment } from 'react';
import type { Problem } from '../types';
import MathText from '../../components/MathText';

// Helper render công thức: m = inline, mb = block (displayMode).
const m = (tex: string) => h(MathText, { tex });
const mb = (tex: string) => h(MathText, { tex, block: true });

export const problems: Problem[] = [
  // 1 — basic: kiểm tra độc lập tuyến tính
  {
    id: 'ch4-indep-1',
    chapterId: 'ch4-spaces',
    difficulty: 'basic',
    topic: 'Linear independence',
    statement: h(
      Fragment,
      null,
      'Xét ba vector ',
      m('v_1=(1,0,1),\\; v_2=(0,1,1),\\; v_3=(1,1,2)'),
      ' trong ',
      m('\\mathbb{R}^3'),
      '. Chúng có độc lập tuyến tính (linearly independent) không? Nếu phụ thuộc, hãy chỉ ra một quan hệ tuyến tính.',
    ),
    steps: [
      {
        title: 'Xếp thành ma trận rồi rút gọn hàng',
        content: h(
          Fragment,
          null,
          'Đặt mỗi vector làm một hàng và khử Gauss:',
          mb(
            '\\begin{bmatrix}1&0&1\\\\0&1&1\\\\1&1&2\\end{bmatrix}' +
              '\\;\\xrightarrow{R_3-R_1}\\;' +
              '\\begin{bmatrix}1&0&1\\\\0&1&1\\\\0&1&1\\end{bmatrix}' +
              '\\;\\xrightarrow{R_3-R_2}\\;' +
              '\\begin{bmatrix}1&0&1\\\\0&1&1\\\\0&0&0\\end{bmatrix}',
          ),
        ),
      },
      {
        title: 'Đọc rank',
        content: h(
          Fragment,
          null,
          'Chỉ có 2 hàng khác 0 nên ',
          m('\\operatorname{rank}=2<3'),
          '. Số vector (3) lớn hơn rank, do đó chúng ',
          m('\\textbf{phụ thuộc tuyến tính}'),
          '.',
        ),
      },
      {
        title: 'Tìm quan hệ tuyến tính',
        content: h(
          Fragment,
          null,
          'Thử ',
          m('v_1+v_2=(1,0,1)+(0,1,1)=(1,1,2)=v_3'),
          '. Vậy ',
          m('v_3=v_1+v_2'),
          ', tức ',
          m('v_1+v_2-v_3=0'),
          '.',
        ),
      },
    ],
    answer: h(
      Fragment,
      null,
      'Phụ thuộc tuyến tính; quan hệ ',
      m('v_3=v_1+v_2'),
      ', và ',
      m('\\operatorname{rank}=2'),
      '.',
    ),
  },

  // 2 — basic: rank & basis của column space
  {
    id: 'ch4-col-1',
    chapterId: 'ch4-spaces',
    difficulty: 'basic',
    topic: 'Column space & rank',
    statement: h(
      Fragment,
      null,
      'Cho ',
      m('A=\\begin{bmatrix}1&2&1\\\\2&4&0\\\\3&6&1\\end{bmatrix}'),
      '. Tính ',
      m('\\operatorname{rank}(A)'),
      ' và tìm một basis cho column space ',
      m('\\operatorname{Col}(A)'),
      '.',
    ),
    steps: [
      {
        title: 'Khử Gauss để tìm các cột pivot',
        content: h(
          Fragment,
          null,
          mb(
            '\\begin{bmatrix}1&2&1\\\\2&4&0\\\\3&6&1\\end{bmatrix}' +
              '\\xrightarrow[R_3-3R_1]{R_2-2R_1}' +
              '\\begin{bmatrix}1&2&1\\\\0&0&-2\\\\0&0&-2\\end{bmatrix}' +
              '\\xrightarrow{R_3-R_2}' +
              '\\begin{bmatrix}1&2&1\\\\0&0&-2\\\\0&0&0\\end{bmatrix}',
          ),
          'Các pivot nằm ở cột 1 và cột 3.',
        ),
      },
      {
        title: 'Kết luận rank',
        content: h(Fragment, null, 'Có 2 pivot nên ', m('\\operatorname{rank}(A)=2'), '.'),
      },
      {
        title: 'Chọn basis cho Col(A)',
        content: h(
          Fragment,
          null,
          'Basis của ',
          m('\\operatorname{Col}(A)'),
          ' là các cột GỐC ứng với vị trí pivot, tức cột 1 và cột 3: ',
          m('(1,2,3)'),
          ' và ',
          m('(1,0,1)'),
          '. (Lưu ý cột 2 = 2·cột 1 nên bị loại.)',
        ),
      },
    ],
    answer: h(
      Fragment,
      null,
      m('\\operatorname{rank}(A)=2'),
      '; basis ',
      m('\\{(1,2,3),\\,(1,0,1)\\}'),
      ', ',
      m('\\dim\\operatorname{Col}(A)=2'),
      '.',
    ),
  },

  // 3 — medium: col space + null space + rank–nullity
  {
    id: 'ch4-null-1',
    chapterId: 'ch4-spaces',
    difficulty: 'medium',
    topic: 'Null space & rank–nullity',
    statement: h(
      Fragment,
      null,
      'Cho ',
      m('A=\\begin{bmatrix}1&2&1&1\\\\1&2&2&3\\\\2&4&3&4\\end{bmatrix}'),
      '. Tìm basis cho ',
      m('\\operatorname{Col}(A)'),
      ' và ',
      m('\\operatorname{Nul}(A)'),
      ', rồi kiểm tra định lý rank–nullity.',
    ),
    steps: [
      {
        title: 'Đưa về RREF',
        content: h(
          Fragment,
          null,
          mb(
            '\\begin{bmatrix}1&2&1&1\\\\1&2&2&3\\\\2&4&3&4\\end{bmatrix}' +
              '\\xrightarrow[R_3-2R_1]{R_2-R_1}' +
              '\\begin{bmatrix}1&2&1&1\\\\0&0&1&2\\\\0&0&1&2\\end{bmatrix}' +
              '\\xrightarrow[R_1-R_2]{R_3-R_2}' +
              '\\begin{bmatrix}1&2&0&-1\\\\0&0&1&2\\\\0&0&0&0\\end{bmatrix}',
          ),
          'Pivot ở cột 1 và cột 3; cột 2 và cột 4 là cột tự do.',
        ),
      },
      {
        title: 'Basis cho Col(A)',
        content: h(
          Fragment,
          null,
          'Lấy các cột gốc tại vị trí pivot (cột 1, cột 3): ',
          m('(1,1,2)'),
          ' và ',
          m('(1,2,3)'),
          '. Vậy ',
          m('\\operatorname{rank}(A)=2'),
          '.',
        ),
      },
      {
        title: 'Basis cho Nul(A)',
        content: h(
          Fragment,
          null,
          'Từ RREF: ',
          m('x_1=-2x_2+x_4'),
          ', ',
          m('x_3=-2x_4'),
          ', với ',
          m('x_2,x_4'),
          ' tự do. Cho ',
          m('(x_2,x_4)=(1,0)'),
          ' và ',
          m('(0,1)'),
          ':',
          mb('n_1=(-2,1,0,0),\\qquad n_2=(1,0,-2,1)'),
          'Đây là basis của Nul(A), nên nullity ',
          m('=2'),
          '.',
        ),
      },
      {
        title: 'Kiểm tra rank–nullity',
        content: h(
          Fragment,
          null,
          m('\\operatorname{rank}+\\text{nullity}=2+2=4=n'),
          ' (số cột). Đúng định lý.',
        ),
      },
    ],
    answer: h(
      Fragment,
      null,
      'Col: ',
      m('\\{(1,1,2),(1,2,3)\\}'),
      '; Nul: ',
      m('\\{(-2,1,0,0),(1,0,-2,1)\\}'),
      '; ',
      m('2+2=4'),
      '.',
    ),
  },

  // 4 — medium: đổi tọa độ sang cơ sở B (2D)
  {
    id: 'ch4-coord-1',
    chapterId: 'ch4-spaces',
    difficulty: 'medium',
    topic: 'Coordinate vector',
    statement: h(
      Fragment,
      null,
      'Trong ',
      m('\\mathbb{R}^2'),
      ' cho basis ',
      m('B=\\{b_1=(1,1),\\,b_2=(1,-1)\\}'),
      '. Tìm vector tọa độ ',
      m('[x]_B'),
      ' của ',
      m('x=(4,2)'),
      '.',
    ),
    steps: [
      {
        title: 'Lập hệ',
        content: h(
          Fragment,
          null,
          'Tìm ',
          m('c_1,c_2'),
          ' sao cho ',
          m('c_1 b_1+c_2 b_2=x'),
          ':',
          mb('\\begin{cases}c_1+c_2=4\\\\ c_1-c_2=2\\end{cases}'),
        ),
      },
      {
        title: 'Giải',
        content: h(
          Fragment,
          null,
          'Cộng hai phương trình: ',
          m('2c_1=6\\Rightarrow c_1=3'),
          '; suy ra ',
          m('c_2=1'),
          '.',
        ),
      },
      {
        title: 'Kiểm tra',
        content: h(Fragment, null, m('3(1,1)+1(1,-1)=(4,2)=x'), ' ✓'),
      },
    ],
    answer: h(Fragment, null, m('[x]_B=(3,1)')),
  },

  // 5 — hard: đổi cơ sở giữa hai basis
  {
    id: 'ch4-change-basis-1',
    chapterId: 'ch4-spaces',
    difficulty: 'hard',
    topic: 'Change of basis',
    statement: h(
      Fragment,
      null,
      'Trong ',
      m('\\mathbb{R}^2'),
      ' cho hai basis ',
      m('B=\\{(1,1),(1,-1)\\}'),
      ' và ',
      m('C=\\{(2,1),(1,1)\\}'),
      '. Biết ',
      m('[x]_B=(2,3)'),
      ', hãy tìm ',
      m('[x]_C'),
      '.',
    ),
    steps: [
      {
        title: 'Khôi phục x trong tọa độ chuẩn',
        content: h(
          Fragment,
          null,
          m('x=2(1,1)+3(1,-1)=(2+3,\\,2-3)=(5,-1)'),
          '.',
        ),
      },
      {
        title: 'Giải tọa độ theo C',
        content: h(
          Fragment,
          null,
          'Tìm ',
          m('d_1,d_2'),
          ' với ',
          m('d_1(2,1)+d_2(1,1)=(5,-1)'),
          ':',
          mb('\\begin{cases}2d_1+d_2=5\\\\ d_1+d_2=-1\\end{cases}'),
          'Trừ hai phương trình: ',
          m('d_1=6'),
          ', rồi ',
          m('d_2=-1-6=-7'),
          '.',
        ),
      },
      {
        title: 'Cách ma trận đổi cơ sở (kiểm chứng)',
        content: h(
          Fragment,
          null,
          'Với ',
          m('C=\\begin{bmatrix}2&1\\\\1&1\\end{bmatrix}'),
          ', ',
          m('B=\\begin{bmatrix}1&1\\\\1&-1\\end{bmatrix}'),
          ', ma trận đổi cơ sở ',
          m('P_{C\\leftarrow B}=C^{-1}B'),
          '. Vì ',
          m('\\det C=1'),
          ' nên ',
          m('C^{-1}=\\begin{bmatrix}1&-1\\\\-1&2\\end{bmatrix}'),
          ', do đó',
          mb(
            'P_{C\\leftarrow B}=\\begin{bmatrix}1&-1\\\\-1&2\\end{bmatrix}\\begin{bmatrix}1&1\\\\1&-1\\end{bmatrix}=\\begin{bmatrix}0&2\\\\1&-3\\end{bmatrix}',
          ),
          m(
            '[x]_C=P_{C\\leftarrow B}[x]_B=\\begin{bmatrix}0&2\\\\1&-3\\end{bmatrix}\\begin{bmatrix}2\\\\3\\end{bmatrix}=\\begin{bmatrix}6\\\\-7\\end{bmatrix}',
          ),
          ' ✓',
        ),
      },
    ],
    answer: h(Fragment, null, m('[x]_C=(6,-7)')),
  },

  // 6 — exam: tổng hợp col/null/rank–nullity + tính nhất quán
  {
    id: 'ch4-exam-1',
    chapterId: 'ch4-spaces',
    difficulty: 'exam',
    topic: 'Four subspaces (tổng hợp)',
    statement: h(
      Fragment,
      null,
      'Cho ',
      m('A=\\begin{bmatrix}1&2&1&3\\\\2&4&1&3\\\\1&2&0&0\\end{bmatrix}'),
      '. (a) Tính rank; (b) basis của ',
      m('\\operatorname{Col}(A)'),
      '; (c) basis của ',
      m('\\operatorname{Nul}(A)'),
      '; (d) kiểm tra rank–nullity; (e) với ',
      m('b=(b_1,b_2,b_3)'),
      ' nào thì hệ ',
      m('Ax=b'),
      ' có nghiệm?',
    ),
    steps: [
      {
        title: '(a) Đưa về RREF',
        content: h(
          Fragment,
          null,
          mb(
            '\\begin{bmatrix}1&2&1&3\\\\2&4&1&3\\\\1&2&0&0\\end{bmatrix}' +
              '\\xrightarrow[R_3-R_1]{R_2-2R_1}' +
              '\\begin{bmatrix}1&2&1&3\\\\0&0&-1&-3\\\\0&0&-1&-3\\end{bmatrix}' +
              '\\longrightarrow' +
              '\\begin{bmatrix}1&2&0&0\\\\0&0&1&3\\\\0&0&0&0\\end{bmatrix}',
          ),
          'Pivot ở cột 1 và cột 3 nên ',
          m('\\operatorname{rank}(A)=2'),
          '.',
        ),
      },
      {
        title: '(b) Basis Col(A)',
        content: h(
          Fragment,
          null,
          'Các cột gốc tại pivot: ',
          m('(1,2,1)'),
          ' và ',
          m('(1,1,0)'),
          '. Đây là một mặt phẳng (plane) trong ',
          m('\\mathbb{R}^3'),
          '.',
        ),
      },
      {
        title: '(c) Basis Nul(A)',
        content: h(
          Fragment,
          null,
          'Từ RREF: ',
          m('x_1=-2x_2'),
          ', ',
          m('x_3=-3x_4'),
          '; ',
          m('x_2,x_4'),
          ' tự do:',
          mb('n_1=(-2,1,0,0),\\qquad n_2=(0,0,-3,1)'),
        ),
      },
      {
        title: '(d) Rank–nullity',
        content: h(Fragment, null, m('2+2=4=n'), ' (số cột) ✓'),
      },
      {
        title: '(e) Điều kiện có nghiệm',
        content: h(
          Fragment,
          null,
          m('Ax=b'),
          ' có nghiệm ⇔ ',
          m('b\\in\\operatorname{Col}(A)'),
          '. Vector pháp tuyến của mặt phẳng là ',
          m('(1,2,1)\\times(1,1,0)=(-1,1,-1)'),
          ', nên điều kiện là',
          mb('-b_1+b_2-b_3=0\\quad\\Longleftrightarrow\\quad b_2=b_1+b_3.'),
          'Ví dụ ',
          m('b=(2,3,1)'),
          ' thỏa (',
          m('-2+3-1=0'),
          ') nên có nghiệm; còn ',
          m('b=(1,1,1)'),
          ' thì không.',
        ),
      },
    ],
    answer: h(
      Fragment,
      null,
      m('\\operatorname{rank}=2'),
      '; Col basis ',
      m('\\{(1,2,1),(1,1,0)\\}'),
      '; Nul basis ',
      m('\\{(-2,1,0,0),(0,0,-3,1)\\}'),
      '; ',
      m('2+2=4'),
      '; có nghiệm ⇔ ',
      m('b_2=b_1+b_3'),
      '.',
    ),
  },
];
