// Bài tập chương 6 (ch6-svd). Nội dung gốc do agent soạn.
import { createElement as h, Fragment } from 'react';
import type { Problem } from '../types';
import MathText from '../../components/MathText';

const m = (tex: string) => h(MathText, { tex });
const mb = (tex: string) => h(MathText, { tex, block: true });

export const problems: Problem[] = [
  // 1 — basic: singular values từ eigenvalue của A^T A
  {
    id: 'ch6-sv-1',
    chapterId: 'ch6-svd',
    difficulty: 'basic',
    topic: 'Singular values',
    statement: h(
      Fragment,
      null,
      'Tìm các singular value của ',
      m('A=\\begin{bmatrix}0&2\\\\3&0\\end{bmatrix}'),
      ' bằng eigenvalue của ',
      m('A^{T}A'),
      '.',
    ),
    steps: [
      {
        title: 'Tính A^T A',
        content: h(
          Fragment,
          null,
          m(
            'A^{T}A=\\begin{bmatrix}0&3\\\\2&0\\end{bmatrix}\\begin{bmatrix}0&2\\\\3&0\\end{bmatrix}=\\begin{bmatrix}9&0\\\\0&4\\end{bmatrix}',
          ),
        ),
      },
      {
        title: 'Eigenvalue và singular value',
        content: h(
          Fragment,
          null,
          'Eigenvalue của ',
          m('A^{T}A'),
          ' là ',
          m('9'),
          ' và ',
          m('4'),
          '. Singular value là căn bậc hai: ',
          m('\\sigma_1=\\sqrt9=3,\\;\\sigma_2=\\sqrt4=2'),
          '.',
        ),
      },
      {
        title: 'Nhận xét',
        content: h(
          Fragment,
          null,
          'Eigenvalue của chính ',
          m('A'),
          ' là ',
          m('\\pm\\sqrt6'),
          ' (vì ',
          m('\\lambda^2-6=0'),
          '), khác với singular value — với ma trận KHÔNG đối xứng, ',
          m('\\sigma_i\\ne|\\lambda_i|'),
          ' nói chung.',
        ),
      },
    ],
    answer: h(Fragment, null, m('\\sigma_1=3,\\;\\sigma_2=2')),
  },

  // 2 — medium: dựng SVD 2x2 đầy đủ
  {
    id: 'ch6-build-1',
    chapterId: 'ch6-svd',
    difficulty: 'medium',
    topic: 'Building SVD',
    statement: h(
      Fragment,
      null,
      'Dựng phân tích SVD ',
      m('A=U\\Sigma V^{T}'),
      ' cho ',
      m('A=\\begin{bmatrix}1&2\\\\2&1\\end{bmatrix}'),
      '.',
    ),
    steps: [
      {
        title: 'A^T A và eigenvalue',
        content: h(
          Fragment,
          null,
          m('A^{T}A=\\begin{bmatrix}5&4\\\\4&5\\end{bmatrix}'),
          ', eigenvalue ',
          m('9'),
          ' và ',
          m('1'),
          ' ⇒ ',
          m('\\sigma_1=3,\\;\\sigma_2=1'),
          '.',
        ),
      },
      {
        title: 'Vector V (right singular)',
        content: h(
          Fragment,
          null,
          'Cho ',
          m('\\lambda=9'),
          ': ',
          m('v_1=\\tfrac1{\\sqrt2}(1,1)'),
          '; cho ',
          m('\\lambda=1'),
          ': ',
          m('v_2=\\tfrac1{\\sqrt2}(1,-1)'),
          '.',
        ),
      },
      {
        title: 'Vector U (left singular)',
        content: h(
          Fragment,
          null,
          'Dùng ',
          m('u_i=\\tfrac1{\\sigma_i}Av_i'),
          ':',
          mb(
            'u_1=\\tfrac13 A\\,\\tfrac1{\\sqrt2}\\!\\begin{bmatrix}1\\\\1\\end{bmatrix}=\\tfrac1{\\sqrt2}\\begin{bmatrix}1\\\\1\\end{bmatrix},\\qquad u_2=\\tfrac11 A\\,\\tfrac1{\\sqrt2}\\!\\begin{bmatrix}1\\\\-1\\end{bmatrix}=\\tfrac1{\\sqrt2}\\begin{bmatrix}-1\\\\1\\end{bmatrix}',
          ),
        ),
      },
      {
        title: 'Ráp lại và kiểm tra',
        content: h(
          Fragment,
          null,
          mb(
            'U=\\tfrac1{\\sqrt2}\\begin{bmatrix}1&-1\\\\1&1\\end{bmatrix},\\;\\Sigma=\\begin{bmatrix}3&0\\\\0&1\\end{bmatrix},\\;V=\\tfrac1{\\sqrt2}\\begin{bmatrix}1&1\\\\1&-1\\end{bmatrix}',
          ),
          m('U\\Sigma V^{T}=\\tfrac12\\begin{bmatrix}2&4\\\\4&2\\end{bmatrix}=A'),
          ' ✓',
        ),
      },
    ],
    answer: h(
      Fragment,
      null,
      m(
        'A=\\tfrac1{\\sqrt2}\\begin{bmatrix}1&-1\\\\1&1\\end{bmatrix}\\begin{bmatrix}3&0\\\\0&1\\end{bmatrix}\\tfrac1{\\sqrt2}\\begin{bmatrix}1&1\\\\1&-1\\end{bmatrix}',
      ),
    ),
  },

  // 3 — medium: liên hệ sigma với chuẩn ma trận
  {
    id: 'ch6-norm-1',
    chapterId: 'ch6-svd',
    difficulty: 'medium',
    topic: 'Singular values & matrix norms',
    statement: h(
      Fragment,
      null,
      'Với ',
      m('A=\\begin{bmatrix}1&2\\\\2&1\\end{bmatrix}'),
      ' (singular value ',
      m('\\sigma_1=3,\\sigma_2=1'),
      '), tính chuẩn phổ ',
      m('\\lVert A\\rVert_2'),
      ', chuẩn Frobenius ',
      m('\\lVert A\\rVert_F'),
      ', và số điều kiện (condition number) ',
      m('\\kappa_2(A)'),
      '.',
    ),
    steps: [
      {
        title: 'Chuẩn phổ',
        content: h(
          Fragment,
          null,
          m('\\lVert A\\rVert_2=\\sigma_{\\max}=3'),
          '.',
        ),
      },
      {
        title: 'Chuẩn Frobenius',
        content: h(
          Fragment,
          null,
          m('\\lVert A\\rVert_F=\\sqrt{\\sigma_1^2+\\sigma_2^2}=\\sqrt{9+1}=\\sqrt{10}'),
          '. Kiểm tra bằng tổng bình phương phần tử: ',
          m('\\sqrt{1^2+2^2+2^2+1^2}=\\sqrt{10}'),
          ' ✓',
        ),
      },
      {
        title: 'Số điều kiện',
        content: h(
          Fragment,
          null,
          m('\\kappa_2(A)=\\dfrac{\\sigma_{\\max}}{\\sigma_{\\min}}=\\dfrac31=3'),
          '.',
        ),
      },
    ],
    answer: h(
      Fragment,
      null,
      m('\\lVert A\\rVert_2=3,\\;\\lVert A\\rVert_F=\\sqrt{10},\\;\\kappa_2=3'),
    ),
  },

  // 4 — hard: xấp xỉ rank-1 và sai số Frobenius (Eckart–Young)
  {
    id: 'ch6-rank1-1',
    chapterId: 'ch6-svd',
    difficulty: 'hard',
    topic: 'Best rank-1 approximation',
    statement: h(
      Fragment,
      null,
      'Cho ',
      m('A=\\begin{bmatrix}1&2\\\\2&1\\end{bmatrix}'),
      ' với SVD đã biết (',
      m('\\sigma_1=3,\\sigma_2=1'),
      '). Tìm ma trận xấp xỉ rank-1 tốt nhất ',
      m('A_1'),
      ' và tính sai số Frobenius ',
      m('\\lVert A-A_1\\rVert_F'),
      '.',
    ),
    steps: [
      {
        title: 'Công thức',
        content: h(
          Fragment,
          null,
          'Xấp xỉ rank-1 tốt nhất là ',
          m('A_1=\\sigma_1 u_1 v_1^{T}'),
          ' với ',
          m('u_1=v_1=\\tfrac1{\\sqrt2}(1,1)'),
          '.',
        ),
      },
      {
        title: 'Tính A_1',
        content: h(
          Fragment,
          null,
          mb(
            'A_1=3\\cdot\\tfrac1{\\sqrt2}\\begin{bmatrix}1\\\\1\\end{bmatrix}\\cdot\\tfrac1{\\sqrt2}\\begin{bmatrix}1&1\\end{bmatrix}=\\tfrac32\\begin{bmatrix}1&1\\\\1&1\\end{bmatrix}=\\begin{bmatrix}1.5&1.5\\\\1.5&1.5\\end{bmatrix}',
          ),
        ),
      },
      {
        title: 'Sai số (định lý Eckart–Young)',
        content: h(
          Fragment,
          null,
          'Sai số đúng bằng singular value bị bỏ: ',
          m('\\lVert A-A_1\\rVert_F=\\sigma_2=1'),
          '. Kiểm tra trực tiếp: ',
          m(
            'A-A_1=\\begin{bmatrix}-0.5&0.5\\\\0.5&-0.5\\end{bmatrix}',
          ),
          ', ',
          m('\\lVert\\cdot\\rVert_F=\\sqrt{4\\cdot0.25}=1'),
          ' ✓',
        ),
      },
    ],
    answer: h(
      Fragment,
      null,
      m('A_1=\\begin{bmatrix}1.5&1.5\\\\1.5&1.5\\end{bmatrix}'),
      ', sai số ',
      m('=\\sigma_2=1'),
      '.',
    ),
  },

  // 5 — hard: rank-k approximation — số tham số & sai số
  {
    id: 'ch6-rankk-1',
    chapterId: 'ch6-svd',
    difficulty: 'hard',
    topic: 'Rank-k: storage & error',
    statement: h(
      Fragment,
      null,
      'Ma trận ',
      m('A'),
      ' cỡ ',
      m('100\\times50'),
      ' có đúng 4 singular value khác 0: ',
      m('\\sigma=(20,15,6,3)'),
      '. (a) So sánh số tham số khi lưu đầy đủ so với lưu dạng phân tích rank-4; (b) tính sai số Frobenius tương đối của xấp xỉ rank-2.',
    ),
    steps: [
      {
        title: '(a) Số tham số',
        content: h(
          Fragment,
          null,
          'Lưu đầy đủ: ',
          m('100\\times50=5000'),
          ' số. Dạng rank-',
          m('k'),
          ' lưu ',
          m('U_k\\,(100\\times k)'),
          ', ',
          m('V_k\\,(50\\times k)'),
          ' và ',
          m('k'),
          ' singular value, tức ',
          m('k(100+50+1)=151k'),
          '. Với ',
          m('k=4'),
          ': ',
          m('604'),
          ' số — tiết kiệm khoảng ',
          m('5000/604\\approx8.3'),
          ' lần.',
        ),
      },
      {
        title: '(b) Chuẩn Frobenius tổng',
        content: h(
          Fragment,
          null,
          m(
            '\\lVert A\\rVert_F=\\sqrt{20^2+15^2+6^2+3^2}=\\sqrt{400+225+36+9}=\\sqrt{670}',
          ),
          '.',
        ),
      },
      {
        title: '(b) Sai số rank-2',
        content: h(
          Fragment,
          null,
          'Bỏ ',
          m('\\sigma_3,\\sigma_4'),
          ': ',
          m('\\lVert A-A_2\\rVert_F=\\sqrt{6^2+3^2}=\\sqrt{45}'),
          '. Sai số tương đối',
          mb(
            '\\frac{\\lVert A-A_2\\rVert_F}{\\lVert A\\rVert_F}=\\frac{\\sqrt{45}}{\\sqrt{670}}\\approx0.259\\;(25.9\\%).',
          ),
          'Năng lượng giữ được ',
          m('=\\dfrac{400+225}{670}\\approx93.3\\%'),
          '.',
        ),
      },
    ],
    answer: h(
      Fragment,
      null,
      m('604'),
      ' số (so với ',
      m('5000'),
      '); sai số rank-2 tương đối ',
      m('\\sqrt{45}/\\sqrt{670}\\approx25.9\\%'),
      '.',
    ),
  },

  // 6 — exam: SVD tổng hợp
  {
    id: 'ch6-exam-1',
    chapterId: 'ch6-svd',
    difficulty: 'exam',
    topic: 'SVD tổng hợp',
    statement: h(
      Fragment,
      null,
      'Cho ',
      m('A=\\begin{bmatrix}3&2\\\\2&3\\end{bmatrix}'),
      '. (a) Tìm các singular value; (b) dựng SVD ',
      m('A=U\\Sigma V^{T}'),
      '; (c) tìm xấp xỉ rank-1 tốt nhất và sai số Frobenius; (d) tính ',
      m('\\lVert A\\rVert_2,\\lVert A\\rVert_F,\\kappa_2'),
      '.',
    ),
    steps: [
      {
        title: '(a) Singular value',
        content: h(
          Fragment,
          null,
          m('A^{T}A=\\begin{bmatrix}13&12\\\\12&13\\end{bmatrix}'),
          ', eigenvalue ',
          m('25'),
          ' và ',
          m('1'),
          ' ⇒ ',
          m('\\sigma_1=5,\\;\\sigma_2=1'),
          '.',
        ),
      },
      {
        title: '(b) Dựng SVD',
        content: h(
          Fragment,
          null,
          m('v_1=\\tfrac1{\\sqrt2}(1,1),\\;v_2=\\tfrac1{\\sqrt2}(1,-1)'),
          '; ',
          m('u_1=\\tfrac15 Av_1=\\tfrac1{\\sqrt2}(1,1)'),
          ', ',
          m('u_2=Av_2=\\tfrac1{\\sqrt2}(1,-1)'),
          '. Vậy',
          mb(
            'A=\\tfrac1{\\sqrt2}\\begin{bmatrix}1&1\\\\1&-1\\end{bmatrix}\\begin{bmatrix}5&0\\\\0&1\\end{bmatrix}\\tfrac1{\\sqrt2}\\begin{bmatrix}1&1\\\\1&-1\\end{bmatrix}',
          ),
        ),
      },
      {
        title: '(c) Xấp xỉ rank-1',
        content: h(
          Fragment,
          null,
          m(
            'A_1=\\sigma_1 u_1 v_1^{T}=\\tfrac52\\begin{bmatrix}1&1\\\\1&1\\end{bmatrix}=\\begin{bmatrix}2.5&2.5\\\\2.5&2.5\\end{bmatrix}',
          ),
          '; sai số ',
          m('\\lVert A-A_1\\rVert_F=\\sigma_2=1'),
          '.',
        ),
      },
      {
        title: '(d) Chuẩn & điều kiện',
        content: h(
          Fragment,
          null,
          m('\\lVert A\\rVert_2=5'),
          ', ',
          m('\\lVert A\\rVert_F=\\sqrt{25+1}=\\sqrt{26}'),
          ', ',
          m('\\kappa_2=5/1=5'),
          '.',
        ),
      },
    ],
    answer: h(
      Fragment,
      null,
      m('\\sigma=(5,1)'),
      '; ',
      m('A_1=\\begin{bmatrix}2.5&2.5\\\\2.5&2.5\\end{bmatrix}'),
      ' sai số ',
      m('1'),
      '; ',
      m('\\lVert A\\rVert_2=5,\\lVert A\\rVert_F=\\sqrt{26},\\kappa_2=5'),
      '.',
    ),
  },
];
