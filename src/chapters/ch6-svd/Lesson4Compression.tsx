import { useMemo, useRef, useState, type ChangeEvent } from 'react';
import { Lesson, Section } from '../../components/Lesson';
import MathText from '../../components/MathText';
import Slider from '../../components/Slider';
import Quiz from '../../components/Quiz';
import ImageCanvas from './ImageCanvas';
import { svd, type Mat } from '../../lib/linalg';
import { f2 } from './util';

const N = 64;

/** Ảnh mặt cười grayscale 64×64 sinh bằng công thức (không fetch ngoài). */
function genSmiley(n = N): number[][] {
  const img: number[][] = [];
  const c = (n - 1) / 2;
  for (let y = 0; y < n; y++) {
    const row: number[] = [];
    for (let x = 0; x < n; x++) {
      const dx = x - c;
      const dy = y - c;
      const r = Math.hypot(dx, dy);
      let v = 0.1; // nền tối
      if (r < n * 0.44) v = 0.9; // khuôn mặt sáng
      // hai mắt
      const eyeR = n * 0.055;
      if (Math.hypot(x - (c - n * 0.16), y - (c - n * 0.11)) < eyeR) v = 0.06;
      if (Math.hypot(x - (c + n * 0.16), y - (c - n * 0.11)) < eyeR) v = 0.06;
      // miệng cười: dải cung tròn ở nửa dưới
      const md = Math.hypot(dx, y - (c - n * 0.05));
      if (y > c + n * 0.02 && md > n * 0.2 && md < n * 0.29) v = 0.06;
      row.push(v);
    }
    img.push(row);
  }
  return img;
}

export default function Lesson4Compression() {
  const [image, setImage] = useState<number[][]>(() => genSmiley());
  const [k, setK] = useState(6);
  const [err, setErr] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const m = image.length;
  const n = image[0]?.length ?? 0;

  // SVD của ảnh (tính một lần cho mỗi ảnh)
  const { U, S, V } = useMemo(() => svd(image as Mat), [image]);
  const maxK = Math.min(S.length, m, n);
  const kk = Math.min(k, maxK);

  // Tái tạo rank-k: Σᵢ₌₁ᵏ σᵢ uᵢ vᵢᵀ
  const recon = useMemo(() => {
    const R: number[][] = Array.from({ length: m }, () => new Array(n).fill(0));
    for (let i = 0; i < kk; i++) {
      const s = S[i];
      if (s < 1e-9) continue;
      for (let y = 0; y < m; y++) {
        const uy = s * U[y][i];
        const Ry = R[y];
        for (let x = 0; x < n; x++) {
          Ry[x] += uy * V[x][i];
        }
      }
    }
    return R;
  }, [U, S, V, kk, m, n]);

  // Thống kê nén
  const full = m * n;
  const stored = kk * (m + n + 1);
  const ratio = stored / full;
  const saved = (1 - ratio) * 100;

  // Đồ thị singular values (chuẩn hóa theo σ₁)
  const barCount = Math.min(40, S.length);
  const s0 = S[0] || 1;

  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErr(null);
    const url = URL.createObjectURL(file);
    const imgEl = new Image();
    imgEl.onload = () => {
      try {
        const cv = document.createElement('canvas');
        cv.width = N;
        cv.height = N;
        const ctx = cv.getContext('2d');
        if (!ctx) throw new Error('no ctx');
        ctx.drawImage(imgEl, 0, 0, N, N);
        const data = ctx.getImageData(0, 0, N, N).data;
        const grid: number[][] = [];
        for (let y = 0; y < N; y++) {
          const row: number[] = [];
          for (let x = 0; x < N; x++) {
            const idx = (y * N + x) * 4;
            const g = (0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2]) / 255;
            row.push(g);
          }
          grid.push(row);
        }
        setImage(grid);
        setK(6);
      } catch {
        setErr('Không đọc được ảnh này. Thử ảnh khác nhé.');
      } finally {
        URL.revokeObjectURL(url);
      }
    };
    imgEl.onerror = () => {
      setErr('Không tải được ảnh.');
      URL.revokeObjectURL(url);
    };
    imgEl.src = url;
  };

  return (
    <Lesson id="ch6-compression" title="Nén ảnh rank-k">
      <p className="muted">
        Đây là màn trình diễn ngoạn mục nhất của SVD. Một tấm ảnh chỉ là một{' '}
        <b>ma trận số</b>. Tách nó thành <MathText tex="A = U\Sigma V^{T}" /> rồi{' '}
        <b>giữ lại vài singular value lớn nhất</b> — ta tái tạo được gần như cả bức ảnh
        chỉ với một phần nhỏ dữ liệu. Đó là ý tưởng cốt lõi của nén ảnh.
      </p>

      <Section kind="explore" title="Kéo k và xem ảnh hiện dần ra">
        <p className="muted" style={{ marginTop: 0 }}>
          <b>Gợi ý thao tác:</b> Kéo Slider <b>k</b> từ 1 lên. Chỉ với <b>k ≈ 5–8</b> ảnh
          đã nhận ra được, dù ta vứt bỏ phần lớn dữ liệu. Nhìn đồ thị singular value: nó{' '}
          <b>tụt rất nhanh</b> — vài giá trị đầu “gánh” gần hết thông tin. Bạn cũng có thể
          thả một ảnh của mình vào.
        </p>

        <div className="row" style={{ alignItems: 'flex-start', gap: 20, justifyContent: 'center' }}>
          <ImageCanvas pixels={image} label={`Ảnh gốc (${m}×${n} = ${full} số)`} />
          <ImageCanvas pixels={recon} label={`Tái tạo rank-${kk}`} />
        </div>

        <div style={{ maxWidth: 520, margin: '18px auto 0' }}>
          <Slider
            label="Số thành phần giữ lại k"
            min={1}
            max={maxK}
            step={1}
            value={kk}
            onChange={(v) => setK(Math.round(v))}
            format={(v) => `${Math.round(v)} / ${maxK}`}
          />

          <div className="panel" style={{ marginTop: 12, fontSize: 13.5 }}>
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <span>Số gốc cần lưu:</span>
              <span className="mono">m·n = {full}</span>
            </div>
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <span>Số lưu khi nén rank-k:</span>
              <span className="mono">k·(m+n+1) = {stored}</span>
            </div>
            <div className="row" style={{ justifyContent: 'space-between', marginTop: 4 }}>
              <span style={{ fontWeight: 600 }}>Tiết kiệm:</span>
              <span
                className="mono"
                style={{ fontWeight: 700, color: saved > 0 ? 'var(--good)' : 'var(--bad)' }}
              >
                {saved > 0 ? `−${f2(saved)}%` : `+${f2(-saved)}% (không lợi)`}
              </span>
            </div>
          </div>

          {/* Đồ thị singular values */}
          <div style={{ marginTop: 16 }}>
            <div className="dim" style={{ fontSize: 12, marginBottom: 6 }}>
              Singular values σ₁…σ₄₀ (tô sáng = đang giữ). σ₁ = {f2(S[0] ?? 0)}
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                gap: 2,
                height: 90,
                padding: 8,
                background: 'var(--panel)',
                borderRadius: 8,
                border: '1px solid var(--border)',
              }}
            >
              {Array.from({ length: barCount }).map((_, i) => {
                const h = Math.max(1, (Math.sqrt(S[i] / s0) || 0) * 74);
                const kept = i < kk;
                return (
                  <div
                    key={i}
                    title={`σ${i + 1} = ${f2(S[i] ?? 0)}`}
                    style={{
                      flex: 1,
                      height: h,
                      background: kept ? 'var(--accent)' : 'var(--border)',
                      borderRadius: 1,
                    }}
                  />
                );
              })}
            </div>
            <div className="dim" style={{ fontSize: 11, marginTop: 4 }}>
              (chiều cao theo thang căn để thấy rõ đuôi nhỏ)
            </div>
          </div>

          <div className="row" style={{ marginTop: 14, gap: 8 }}>
            <button className="btn" onClick={() => { setImage(genSmiley()); setK(6); }}>
              🙂 Ảnh mặt cười
            </button>
            <button className="btn" onClick={() => fileRef.current?.click()}>
              📁 Thả ảnh của bạn
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={onFile}
              style={{ display: 'none' }}
            />
          </div>
          {err && (
            <div className="dim" style={{ color: 'var(--bad)', fontSize: 12, marginTop: 6 }}>
              {err}
            </div>
          )}
        </div>
      </Section>

      <Section kind="theory" title="Rank-k approximation & định lý Eckart–Young">
        <p>
          Viết SVD dưới dạng <b>tổng của các ma trận rank 1</b>:
        </p>
        <MathText block tex="A = \sigma_1 u_1 v_1^{T} + \sigma_2 u_2 v_2^{T} + \dots + \sigma_r u_r v_r^{T}" />
        <p>
          Mỗi số hạng <MathText tex="\sigma_i u_i v_i^{T}" /> là một “lớp” ảnh, và{' '}
          <MathText tex="\sigma_i" /> chính là <b>độ quan trọng</b> của lớp đó. Vì{' '}
          <MathText tex="\sigma_1 \ge \sigma_2 \ge \dots" />, những lớp đầu chứa phần lớn
          nội dung; các lớp cuối chỉ là chi tiết li ti. <b>Rank-k approximation</b> là giữ{' '}
          <MathText tex="k" /> lớp đầu:
        </p>
        <MathText block tex="A_k = \sum_{i=1}^{k} \sigma_i u_i v_i^{T}" />
        <p>
          <b>Định lý Eckart–Young</b> nói rằng đây là lựa chọn <b>tốt nhất có thể</b>:
          trong tất cả các ma trận có rank ≤ k, <MathText tex="A_k" /> là ma trận{' '}
          <i>gần A nhất</i> (sai số nhỏ nhất theo chuẩn). Và sai số bỏ đi đúng bằng các
          singular value ta vứt:
        </p>
        <MathText block tex="\lVert A - A_k\rVert_2 = \sigma_{k+1}" />
        <p className="muted">
          Nói cách khác: <b>bỏ đi σ nhỏ nhất là mất ít thông tin nhất</b>. Vì bảng singular
          value tụt rất nhanh, chỉ cần vài lớp đầu là đủ — đó là lý do nén ảnh (và cả nén
          dữ liệu, khử nhiễu, latent semantic analysis…) bằng SVD hiệu quả đến vậy.
        </p>
      </Section>

      <Section kind="quiz" title="Kiểm tra hiểu">
        <Quiz
          lessonKey="ch6/compression"
          questions={[
            {
              q: <>Rank-k approximation <MathText tex="A_k" /> giữ lại những gì?</>,
              options: [
                <>k số hạng <MathText tex="\sigma_i u_i v_i^{T}" /> ứng với σ LỚN nhất</>,
                <>k số hạng ứng với σ nhỏ nhất</>,
                <>k hàng đầu của A</>,
                <>k cột ngẫu nhiên của A</>,
              ],
              answer: 0,
              explain: (
                <>
                  Ta giữ các lớp quan trọng nhất — những <MathText tex="\sigma_i" /> lớn —
                  vì chúng chứa phần lớn nội dung ảnh.
                </>
              ),
            },
            {
              q: <>Định lý Eckart–Young khẳng định điều gì về <MathText tex="A_k" />?</>,
              options: [
                <>Là xấp xỉ rank-k TỐT NHẤT (sai số nhỏ nhất)</>,
                <>Là xấp xỉ tệ nhất</>,
                <>Luôn bằng đúng A</>,
                <>Chỉ đúng cho ma trận vuông</>,
              ],
              answer: 0,
              explain: (
                <>
                  Không có ma trận rank ≤ k nào gần A hơn <MathText tex="A_k" />; sai số
                  còn lại đúng bằng <MathText tex="\sigma_{k+1}" />.
                </>
              ),
            },
            {
              q: <>Ảnh 64×64 nén rank-8 cần lưu bao nhiêu số (m+n+1 mỗi thành phần)?</>,
              options: [
                <>8·(64+64+1) = 1032 số, so với 4096</>,
                <>64·64 = 4096 số</>,
                <>8 số</>,
                <>512 số</>,
              ],
              answer: 0,
              explain: (
                <>
                  Mỗi thành phần cần <MathText tex="u_i" /> (m số), <MathText tex="v_i" />{' '}
                  (n số) và <MathText tex="\sigma_i" /> (1 số): 129 số. Nhân 8 = 1032, chỉ
                  bằng ~25% của 4096.
                </>
              ),
            },
            {
              q: <>Vì sao SVD nén ảnh hiệu quả trong thực tế?</>,
              options: [
                <>Vì bảng singular value tụt rất nhanh — vài σ đầu gánh gần hết thông tin</>,
                <>Vì mọi σ đều bằng nhau</>,
                <>Vì ảnh luôn là ma trận trực giao</>,
                <>Vì SVD làm ảnh nét hơn bản gốc</>,
              ],
              answer: 0,
              explain: (
                <>
                  Ảnh thật có cấu trúc, nên năng lượng dồn vào ít thành phần đầu. Giữ vài
                  chục lớp là tái tạo gần như hoàn hảo.
                </>
              ),
            },
          ]}
        />
      </Section>
    </Lesson>
  );
}
