import { useMemo, useState } from 'react';
import { Lesson, Section } from '../../components/Lesson';
import MathText from '../../components/MathText';
import Slider from '../../components/Slider';
import StepByStep from '../../components/StepByStep';
import Quiz from '../../components/Quiz';
import { f2, Stat, StatRow, Hint, TwoCol, Bridge } from './_shared';

// Một tập giá trị "gốc" cố định, hình chuông (mean≈0, std≈1). Người học chỉ chỉnh
// mean/scale để tạo ra "activation thô", rồi xem batch norm kéo nó về chuẩn.
const BASE = [
  -2.1, -1.6, -1.3, -1.0, -0.85, -0.65, -0.5, -0.35, -0.2, -0.1, 0.0, 0.05,
  0.15, 0.25, 0.35, 0.5, 0.6, 0.75, 0.9, 1.05, 1.25, 1.5, 1.8, 2.2,
];

function meanOf(v: number[]): number {
  return v.reduce((a, b) => a + b, 0) / v.length;
}
function stdOf(v: number[], mu: number): number {
  const varc = v.reduce((a, b) => a + (b - mu) * (b - mu), 0) / v.length;
  return Math.sqrt(varc);
}

const DOMAIN: [number, number] = [-6, 6];
const BINS = 24;

function Histogram({
  values,
  color,
  title,
}: {
  values: number[];
  color: string;
  title: string;
}) {
  const [lo, hi] = DOMAIN;
  const w = 300;
  const h = 150;
  const pad = 24;
  const counts = new Array(BINS).fill(0);
  values.forEach((v) => {
    let idx = Math.floor(((v - lo) / (hi - lo)) * BINS);
    idx = Math.max(0, Math.min(BINS - 1, idx));
    counts[idx]++;
  });
  const maxC = Math.max(1, ...counts);
  const bw = (w - 2 * pad) / BINS;
  const zeroX = pad + ((0 - lo) / (hi - lo)) * (w - 2 * pad);
  return (
    <div>
      <div className="dim" style={{ fontSize: 12, marginBottom: 4 }}>
        {title}
      </div>
      <svg width={w} height={h} style={{ maxWidth: '100%', display: 'block' }}>
        {/* trục 0 */}
        <line x1={zeroX} y1={pad - 6} x2={zeroX} y2={h - pad} stroke="var(--text-dim)" strokeWidth={1} strokeDasharray="4 4" />
        <text x={zeroX + 3} y={pad + 2} fontSize={10} fill="var(--text-dim)">
          0
        </text>
        {/* baseline */}
        <line x1={pad} y1={h - pad} x2={w - pad} y2={h - pad} stroke="var(--border)" strokeWidth={1} />
        {counts.map((c, i) => {
          const bh = (c / maxC) * (h - 2 * pad);
          const x = pad + i * bw;
          const y = h - pad - bh;
          return <rect key={i} x={x + 1} y={y} width={Math.max(1, bw - 2)} height={bh} fill={color} rx={2} />;
        })}
      </svg>
    </div>
  );
}

export default function BatchNormLesson() {
  const [mean, setMean] = useState(1.5);
  const [scale, setScale] = useState(1.8);

  const raw = useMemo(() => BASE.map((z) => mean + scale * z), [mean, scale]);
  const muRaw = meanOf(raw);
  const sdRaw = stdOf(raw, muRaw);
  const norm = useMemo(() => raw.map((x) => (x - muRaw) / (sdRaw + 1e-8)), [raw, muRaw, sdRaw]);
  const muNorm = meanOf(norm);
  const sdNorm = stdOf(norm, muNorm);

  const bnSteps = [
    {
      title: 'Batch đầu vào',
      content: (
        <p>
          Một feature nhận 4 giá trị trong minibatch: <MathText tex="x=[2,\ 4,\ 9,\ 5]" />. Batch norm
          chuẩn hóa feature này DỌC theo batch.
        </p>
      ),
    },
    {
      title: 'Bước 1 — trung bình (mean)',
      content: (
        <>
          <MathText block tex="\mu_B = \tfrac{1}{4}(2+4+9+5) = \tfrac{20}{4} = 5" />
          <p className="dim" style={{ fontSize: 13 }}>Đây là tâm của batch — ta sẽ tịnh tiến về 0.</p>
        </>
      ),
    },
    {
      title: 'Bước 2 — phương sai (variance)',
      content: (
        <>
          <MathText block tex="\sigma_B^2 = \tfrac{1}{4}\big[(2\!-\!5)^2+(4\!-\!5)^2+(9\!-\!5)^2+(5\!-\!5)^2\big] = \tfrac{9+1+16+0}{4} = 6.5" />
          <p className="dim" style={{ fontSize: 13 }}>
            Độ lệch chuẩn <MathText tex="\sigma_B=\sqrt{6.5}\approx 2.55" /> — thước đo độ "rộng".
          </p>
        </>
      ),
    },
    {
      title: 'Bước 3 — chuẩn hóa (z-score)',
      content: (
        <>
          <MathText block tex="\hat x_i = \frac{x_i-\mu_B}{\sqrt{\sigma_B^2+\epsilon}},\qquad \hat x_1=\frac{2-5}{2.55}\approx -1.18" />
          <p className="dim" style={{ fontSize: 13 }}>
            Sau bước này batch có mean 0, std 1. <MathText tex="\epsilon" /> nhỏ chỉ để tránh chia cho 0.
          </p>
        </>
      ),
    },
    {
      title: 'Bước 4 — scale & shift học được',
      content: (
        <>
          <MathText block tex="y_i = \gamma\,\hat x_i + \beta" />
          <p className="dim" style={{ fontSize: 13 }}>
            <MathText tex="\gamma,\beta" /> là tham số HỌC ĐƯỢC: mạng tự chọn lại độ rộng và tâm nếu cần —
            nên batch norm không hề "trói" phân phối, chỉ đưa nó về thế ổn định để bắt đầu.
          </p>
        </>
      ),
    },
  ];

  return (
    <Lesson id="batchnorm" title="Batch Norm & khởi tạo">
      <Section kind="explore" title="Chuẩn hóa kéo phân phối về thế ổn định">
        <TwoCol>
          <div>
            <Histogram values={raw} color="var(--vec-2)" title="TRƯỚC — activation thô (mean, scale do bạn chỉnh)" />
            <StatRow>
              <Stat label="mean μ" value={f2(muRaw)} color="var(--vec-2)" />
              <Stat label="std σ" value={f2(sdRaw)} color="var(--vec-2)" />
            </StatRow>
          </div>
          <div>
            <Histogram values={norm} color="var(--vec-3)" title="SAU — sau chuẩn hóa (x − μ)/σ" />
            <StatRow>
              <Stat label="mean μ" value={f2(muNorm)} color="var(--vec-3)" />
              <Stat label="std σ" value={f2(sdNorm)} color="var(--vec-3)" />
            </StatRow>
          </div>
        </TwoCol>
        <div style={{ marginTop: 10 }}>
          <Slider label="mean (tịnh tiến)" min={-3} max={3} step={0.1} value={mean} onChange={setMean} format={(n) => f2(n)} />
          <Slider label="scale (co giãn độ rộng)" min={0.3} max={3} step={0.1} value={scale} onChange={setScale} format={(n) => f2(n)} />
        </div>
        <Hint>
          Kéo hai thanh trượt: histogram TRƯỚC dịch chuyển và phình/co theo bạn, còn histogram SAU{' '}
          <b>luôn dính tại tâm 0 với độ rộng 1</b>. Đó chính là việc batch norm làm ở mỗi lớp — nhờ vậy
          các lớp phía sau luôn nhận đầu vào ở cùng một "thang đo", giúp huấn luyện ổn định và nhanh hơn.
        </Hint>
      </Section>

      <Section kind="theory" title="Batch Norm và khởi tạo trọng số">
        <p>
          Khi mạng học, phân phối đầu ra của mỗi lớp cứ <i>xê dịch</i> theo từng bước cập nhật — hiện tượng
          hay được gọi là <b>internal covariate shift</b>. Lớp sau phải liên tục "đuổi theo" đầu vào đổi thang
          đo, làm việc học chậm và bấp bênh.
        </p>
        <p>
          <b>Batch Normalization</b> chèn giữa các lớp một bước chuẩn hóa: với mỗi feature, trừ trung bình
          của minibatch rồi chia độ lệch chuẩn của minibatch (z-score), sau đó nhân lại{' '}
          <MathText tex="\gamma" /> và cộng <MathText tex="\beta" /> (hai tham số học được). Đầu vào của lớp
          sau nhờ đó luôn ở thang đo quen thuộc ⇒ cho phép learning rate lớn hơn, bớt nhạy với khởi tạo, và
          có chút tác dụng điều chuẩn (regularization).
        </p>
        <p>
          <b>Khởi tạo trọng số:</b> nếu trọng số ban đầu quá lớn, tín hiệu <i>bùng nổ</i>; quá nhỏ, tín hiệu{' '}
          <i>tắt dần</i> qua nhiều lớp. Các sơ đồ khởi tạo giữ cho <b>phương sai của tín hiệu ổn định</b> khi
          truyền qua lớp: <b>Xavier/Glorot</b> (hợp với tanh/sigmoid) lấy phương sai{' '}
          <MathText tex="\propto \tfrac{1}{n_\text{in}}" />, còn <b>He</b> (hợp với ReLU) lấy{' '}
          <MathText tex="\propto \tfrac{2}{n_\text{in}}" />.
        </p>
        <Bridge>
          <p style={{ marginTop: 0 }}>
            Chuẩn hóa z-score chính là một <b>biến đổi affine</b> trên trục số (ch3):{' '}
            <MathText tex="\hat x = \tfrac{1}{\sigma}\,x - \tfrac{\mu}{\sigma}" /> — một phép{' '}
            <b>co giãn</b> (chia <MathText tex="\sigma" />) ghép với một phép <b>tịnh tiến</b> (trừ{' '}
            <MathText tex="\mu/\sigma" />). Bước <MathText tex="\gamma\hat x+\beta" /> lại là một affine nữa.
          </p>
          <p style={{ marginBottom: 0 }}>
            Hai đại lượng cốt lõi — <b>mean</b> và <b>variance/covariance</b> — chính là thứ mà{' '}
            <b>PCA</b> (ch6) dựng lên: tâm hóa dữ liệu rồi phân tích ma trận hiệp phương sai. Batch norm
            có thể xem như "tâm hóa và cân lại phương sai" nhẹ nhàng theo từng feature ở mỗi lớp.
          </p>
        </Bridge>
      </Section>

      <Section kind="steps" title="Batch Norm từng bước trên một batch nhỏ">
        <StepByStep steps={bnSteps} />
      </Section>

      <Section kind="quiz" title="Kiểm tra hiểu">
        <Quiz
          lessonKey="ch13/batchnorm"
          questions={[
            {
              q: (
                <>
                  Một giá trị <MathText tex="x=8" /> trong batch có <MathText tex="\mu=5,\ \sigma=2" />. Sau
                  chuẩn hóa z-score, giá trị <MathText tex="\hat x" /> bằng?
                </>
              ),
              options: ['1.5', '3', '0.5', '6.5'],
              answer: 0,
              explain: (
                <>
                  <MathText tex="\hat x = (8-5)/2 = 3/2 = 1.5" />. Trừ mean rồi chia std.
                </>
              ),
            },
            {
              q: <>Ngay sau bước chuẩn hóa (trước γ, β), mỗi feature trong batch có mean và std bằng?</>,
              options: ['mean 1, std 0', 'mean 0, std 1', 'mean 0, std 0', 'không xác định'],
              answer: 1,
              explain: <>Định nghĩa z-score: trừ mean ⇒ tâm về 0; chia std ⇒ độ rộng về 1.</>,
            },
            {
              q: <>Khởi tạo Xavier/He nhằm mục đích chính nào?</>,
              options: [
                'Làm mọi trọng số bằng 0',
                'Giữ phương sai của tín hiệu (và gradient) ổn định khi truyền qua nhiều lớp, tránh bùng nổ/tắt dần',
                'Tăng số lớp của mạng',
                'Thay thế hoàn toàn cho gradient descent',
              ],
              answer: 1,
              explain: (
                <>
                  Chọn phương sai khởi tạo theo số đầu vào <MathText tex="n_\text{in}" /> giúp tín hiệu không
                  phình to hay lịm dần qua các lớp — nền tảng để mạng sâu học được.
                </>
              ),
            },
            {
              q: <>Vì sao nói chuẩn hóa z-score là một biến đổi affine (ch3)?</>,
              options: [
                'Vì nó là phép quay quanh gốc',
                'Vì nó gồm một phép co giãn (chia σ) ghép với một phép tịnh tiến (trừ μ/σ)',
                'Vì nó xóa toàn bộ thông tin dữ liệu',
                'Vì nó là phép nhân ma trận vuông khả nghịch bất kỳ',
              ],
              answer: 1,
              explain: (
                <>
                  <MathText tex="\hat x = \tfrac{1}{\sigma}x - \tfrac{\mu}{\sigma}" /> có dạng{' '}
                  <MathText tex="ax+b" /> — co giãn rồi tịnh tiến, đúng định nghĩa affine 1 chiều.
                </>
              ),
            },
          ]}
        />
      </Section>
    </Lesson>
  );
}
