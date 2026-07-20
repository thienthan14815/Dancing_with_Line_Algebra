// Bài tập chương 9 (ch9-quadratic) — Dạng toàn phương.
// File .ts nên không dùng JSX; dựng ReactNode bằng React.createElement.
import { createElement as h, type ReactNode } from 'react';
import MathText from '../../components/MathText';
import type { Problem } from '../types';

// Helpers ngắn gọn
const m = (tex: string): ReactNode => h(MathText, { tex });
const mb = (tex: string): ReactNode => h(MathText, { tex, block: true });
const box = (...kids: ReactNode[]): ReactNode => h('div', null, ...kids);
const par = (...kids: ReactNode[]): ReactNode => h('p', { className: 'muted' }, ...kids);

export const problems: Problem[] = [
  // ---------------------------------------------------------------------------
  {
    id: 'quad-1',
    chapterId: 'ch9-quadratic',
    difficulty: 'basic',
    topic: 'Quadratic form',
    statement: box(
      'Viết dạng toàn phương ',
      m('q(x,y) = 4x^2 - 12xy + 9y^2'),
      ' dưới dạng ',
      m('x^{\\top} A x'),
      ' với ',
      m('A'),
      ' đối xứng.'
    ),
    steps: [
      {
        title: 'Bước 1 — Hệ số đường chéo',
        content: par(
          'Hệ số của ',
          m('x^2'),
          ' và ',
          m('y^2'),
          ' vào đường chéo: ',
          m('a_{11}=4,\\ a_{22}=9.')
        ),
      },
      {
        title: 'Bước 2 — Chia đôi hệ số xy',
        content: par(
          'Hệ số của ',
          m('xy'),
          ' là ',
          m('-12'),
          '; hai ô lệch bằng một nửa: ',
          m('a_{12}=a_{21}=-6.')
        ),
      },
      {
        title: 'Bước 3 — Lắp ma trận và nhận xét',
        content: box(
          mb('A = \\begin{bmatrix} 4 & -6 \\\\ -6 & 9 \\end{bmatrix}'),
          par(
            'Kiểm chứng: ',
            m('4x^2 + 2(-6)xy + 9y^2 = 4x^2 - 12xy + 9y^2.'),
            ' Thêm nữa ',
            m('q = (2x-3y)^2 \\ge 0'),
            ', bằng 0 trên đường ',
            m('2x=3y'),
            ' nên đây là positive-semidefinite (eigenvalue 0 và 13).'
          )
        ),
      },
    ],
    answer: box(
      m('A = \\begin{bmatrix} 4 & -6 \\\\ -6 & 9 \\end{bmatrix}'),
      '; positive-semidefinite (',
      m('\\lambda = 0,\\ 13'),
      ').'
    ),
  },

  // ---------------------------------------------------------------------------
  {
    id: 'quad-2',
    chapterId: 'ch9-quadratic',
    difficulty: 'basic',
    topic: 'Quadratic form',
    statement: box(
      'Cho ',
      m('A = \\begin{bmatrix} 3 & 2 \\\\ 2 & 5 \\end{bmatrix}'),
      '. Khai triển ',
      m('q(x,y) = x^{\\top} A x'),
      ' thành đa thức bậc hai.'
    ),
    steps: [
      {
        title: 'Bước 1 — Công thức khai triển 2×2',
        content: par(
          'Với ',
          m('A=\\begin{bmatrix} a & b \\\\ b & c \\end{bmatrix}'),
          ' thì ',
          m('q = a x^2 + 2b\\,xy + c y^2'),
          ', ở đây ',
          m('a=3,\\ b=2,\\ c=5.')
        ),
      },
      {
        title: 'Bước 2 — Thay số',
        content: mb('q = 3x^2 + 2\\cdot 2\\,xy + 5y^2 = 3x^2 + 4xy + 5y^2.'),
      },
    ],
    answer: m('q(x,y) = 3x^2 + 4xy + 5y^2.'),
  },

  // ---------------------------------------------------------------------------
  {
    id: 'quad-3',
    chapterId: 'ch9-quadratic',
    difficulty: 'medium',
    topic: 'Definiteness',
    statement: box(
      'Xét định dấu (definiteness) của ',
      m('A = \\begin{bmatrix} 2 & -1 \\\\ -1 & 2 \\end{bmatrix}'),
      ' bằng cả tiêu chí Sylvester lẫn eigenvalue.'
    ),
    steps: [
      {
        title: 'Bước 1 — Tiêu chí Sylvester',
        content: par(
          'Các định thức con chính dẫn đầu: ',
          m('D_1 = 2 > 0'),
          ' và ',
          m('D_2 = \\det A = 2\\cdot2 - (-1)(-1) = 3 > 0.'),
          ' Cả hai dương ⇒ positive-definite.'
        ),
      },
      {
        title: 'Bước 2 — Kiểm chứng bằng eigenvalue',
        content: box(
          mb('\\lambda^2 - (\\operatorname{tr}A)\\lambda + \\det A = \\lambda^2 - 4\\lambda + 3 = 0'),
          par('⇒ ', m('\\lambda = 1'), ' và ', m('\\lambda = 3'), ' — đều dương, cùng kết luận.')
        ),
      },
      {
        title: 'Bước 3 — Kết luận',
        content: par(
          m('q(x) > 0'),
          ' với mọi ',
          m('x \\neq 0'),
          '; mặt ',
          m('z = q(x,y)'),
          ' là một cái bát mở lên với đáy duy nhất tại gốc.'
        ),
      },
    ],
    answer: box('positive-definite (', m('\\lambda = 1,\\ 3'), ').'),
  },

  // ---------------------------------------------------------------------------
  {
    id: 'quad-4',
    chapterId: 'ch9-quadratic',
    difficulty: 'medium',
    topic: 'Orthogonal diagonalization',
    statement: box(
      'Chéo hoá trực giao ',
      m('A = \\begin{bmatrix} 1 & 2 \\\\ 2 & 1 \\end{bmatrix}'),
      ': tìm ',
      m('Q'),
      ' trực giao và ',
      m('\\Lambda'),
      ' sao cho ',
      m('A = Q\\Lambda Q^{\\top}'),
      ', rồi nêu định dấu.'
    ),
    steps: [
      {
        title: 'Bước 1 — Eigenvalue',
        content: mb('\\lambda^2 - 2\\lambda - 3 = 0 \\Rightarrow \\lambda_1 = 3,\\ \\lambda_2 = -1.'),
      },
      {
        title: 'Bước 2 — Eigenvector trực giao',
        content: box(
          par(
            m('\\lambda_1 = 3'),
            ': ',
            m('(A-3I) = \\begin{bmatrix} -2 & 2 \\\\ 2 & -2 \\end{bmatrix}'),
            ' ⇒ ',
            m('v_1 = (1,1)'),
            '.  ',
            m('\\lambda_2 = -1'),
            ': ',
            m('v_2 = (-1,1)'),
            '.'
          ),
          par('Chúng vuông góc (', m('v_1\\cdot v_2 = -1+1 = 0'), '); chuẩn hoá chia cho ', m('\\sqrt2'), '.')
        ),
      },
      {
        title: 'Bước 3 — Lắp Q, Λ và định dấu',
        content: box(
          mb('Q = \\frac{1}{\\sqrt2}\\begin{bmatrix} 1 & -1 \\\\ 1 & 1 \\end{bmatrix},\\quad \\Lambda = \\begin{bmatrix} 3 & 0 \\\\ 0 & -1 \\end{bmatrix}'),
          par(
            'Hai eigenvalue trái dấu ⇒ ',
            m('q = 3y_1^2 - y_2^2'),
            ' nhận cả giá trị dương và âm ⇒ indefinite (mặt yên ngựa).'
          )
        ),
      },
    ],
    answer: box(
      m('Q = \\tfrac{1}{\\sqrt2}\\begin{bmatrix} 1 & -1 \\\\ 1 & 1 \\end{bmatrix}'),
      ', ',
      m('\\Lambda = \\operatorname{diag}(3,-1)'),
      '; indefinite.'
    ),
  },

  // ---------------------------------------------------------------------------
  {
    id: 'quad-5',
    chapterId: 'ch9-quadratic',
    difficulty: 'hard',
    topic: 'Conic / principal axes',
    statement: box(
      'Đưa conic ',
      m('5x^2 + 6xy + 5y^2 = 8'),
      ' về dạng chính tắc; xác định loại, bán trục và các trục chính.'
    ),
    steps: [
      {
        title: 'Bước 1 — Ma trận đối xứng',
        content: par(
          'Hệ số ',
          m('xy'),
          ' là 6 nên ',
          m('b/2 = 3'),
          ': ',
          m('A = \\begin{bmatrix} 5 & 3 \\\\ 3 & 5 \\end{bmatrix}.')
        ),
      },
      {
        title: 'Bước 2 — Eigenvalue & eigenvector',
        content: box(
          mb('(5-\\lambda)^2 - 9 = 0 \\Rightarrow 5-\\lambda = \\pm3 \\Rightarrow \\lambda_1 = 8,\\ \\lambda_2 = 2.'),
          par(m('q_1 = \\tfrac{1}{\\sqrt2}(1,1)'), ' (cho ', m('\\lambda=8'), '), ', m('q_2 = \\tfrac{1}{\\sqrt2}(-1,1)'), ' (cho ', m('\\lambda=2'), ').')
        ),
      },
      {
        title: 'Bước 3 — Dạng chính tắc & bán trục',
        content: box(
          mb('8u^2 + 2v^2 = 8 \\;\\Longleftrightarrow\\; u^2 + \\frac{v^2}{4} = 1.'),
          par(
            'Cả hai eigenvalue dương ⇒ ellipse. Bán trục 1 dọc trục ',
            m('q_1=(1,1)'),
            ' (hướng u) và bán trục 2 dọc ',
            m('q_2=(-1,1)'),
            ' (hướng v) — trục dài ứng với eigenvalue nhỏ hơn.'
          )
        ),
      },
    ],
    answer: box(
      m('u^2 + v^2/4 = 1'),
      ' — ellipse; bán trục 1 dọc ',
      m('(1,1)'),
      ' và 2 dọc ',
      m('(-1,1)'),
      '.'
    ),
  },

  // ---------------------------------------------------------------------------
  {
    id: 'quad-6',
    chapterId: 'ch9-quadratic',
    difficulty: 'exam',
    topic: 'Definiteness 3×3 / Hessian',
    statement: box(
      'Ma trận ',
      m('A = \\begin{bmatrix} 2 & 1 & 0 \\\\ 1 & 2 & 1 \\\\ 0 & 1 & 2 \\end{bmatrix}'),
      ' là Hessian tại một điểm dừng của hàm ',
      m('f'),
      '. Điểm dừng đó là cực tiểu, cực đại hay yên ngựa? Dùng cả Sylvester và eigenvalue.'
    ),
    steps: [
      {
        title: 'Bước 1 — Các định thức con chính dẫn đầu',
        content: box(
          mb('D_1 = 2,\\qquad D_2 = \\det\\begin{bmatrix} 2 & 1 \\\\ 1 & 2 \\end{bmatrix} = 3.'),
          par(
            'Khai triển theo hàng đầu: ',
            m('D_3 = \\det A = 2(2\\cdot2 - 1\\cdot1) - 1(1\\cdot2 - 1\\cdot0) + 0 = 6 - 2 = 4.')
          )
        ),
      },
      {
        title: 'Bước 2 — Kết luận Sylvester',
        content: par(
          m('D_1 = 2 > 0,\\ D_2 = 3 > 0,\\ D_3 = 4 > 0'),
          ' — mọi minor dẫn đầu dương ⇒ ',
          m('A'),
          ' positive-definite.'
        ),
      },
      {
        title: 'Bước 3 — Kiểm chứng bằng eigenvalue',
        content: box(
          par(
            'Ma trận tam giác ba đường (Toeplitz) có eigenvalue ',
            m('\\lambda_k = 2 + 2\\cos\\frac{k\\pi}{4},\\ k=1,2,3'),
            ':'
          ),
          mb('\\lambda = 2+\\sqrt2,\\quad 2,\\quad 2-\\sqrt2 \\approx 3.41,\\ 2,\\ 0.59 \\; (>0).')
        ),
      },
      {
        title: 'Bước 4 — Ý nghĩa tối ưu',
        content: par(
          'Hessian positive-definite ⇒ ',
          m('q(x) = x^{\\top} H x > 0'),
          ' theo mọi hướng ⇒ điểm dừng là ',
          h('b', null, 'cực tiểu địa phương chặt'),
          '.'
        ),
      },
    ],
    answer: box(
      'positive-definite (',
      m('\\lambda = 2-\\sqrt2,\\ 2,\\ 2+\\sqrt2 > 0'),
      ') ⇒ cực tiểu địa phương chặt.'
    ),
  },
];
