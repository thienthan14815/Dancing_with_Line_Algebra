import { useId, useState, type ReactNode } from 'react';

type Curve = { fn: (x: number) => number; label: string; color?: string };
type Plot = { x: [number, number]; y: [number, number]; curves: Curve[]; caption: string; area?: [number, number]; hole?: [number, number] };
const blue = '#2563eb', orange = '#c2410c';
const plots: Record<number, Plot> = {
  1: { x: [-1, 3], y: [-1, 5], curves: [{ fn: x => x + 1, label: 'y = x + 1, x ≠ 1' }], hole: [1, 2], caption: 'Đồ thị (x² − 1)/(x − 1) trùng đường thẳng y = x + 1 nhưng thiếu điểm (1, 2). Rút gọn không lấp lại điều kiện x ≠ 1.' },
  2: { x: [-Math.PI, Math.PI], y: [-1.5, 1.5], curves: [{ fn: Math.sin, label: 'y = sin x (radian)' }], caption: 'Một chu kỳ từ −π đến π. sin(0) = 0, sin(π/2) = 1. Đơn vị radian là điều kiện của các công thức đạo hàm lượng giác.' },
  3: { x: [0, 4], y: [0, 7], curves: [{ fn: x => x + 2, label: '(x² − 4)/(x − 2), x ≠ 2' }], hole: [2, 4], caption: 'Hai phía cùng tiến về độ cao 4 dù biểu thức không xác định tại x = 2. Vòng tròn rỗng biểu thị điểm bị loại.' },
  4: { x: [0, 4], y: [0, 1], curves: [{ fn: x => 1 / (Math.sqrt(x + 1) + 1), label: '1/(√(x + 1) + 1)' }], hole: [0, 0.5], caption: 'Với x ≠ 0, (√(x + 1) − 1)/x bằng đường cong trong hình. Nhân liên hợp làm lộ giới hạn 1/2 khi x → 0.' },
  5: { x: [-4, 4], y: [-0.5, 1.5], curves: [{ fn: x => x === 0 ? 1 : Math.sin(x) / x, label: 'sin x / x, x ≠ 0' }], hole: [0, 1], caption: 'Đồ thị tiến về 1 từ cả hai phía. Vòng tròn rỗng tại (0, 1) nhắc rằng thương sin x / x chưa được định nghĩa tại 0.' },
  6: { x: [-3, 3], y: [-1, 4], curves: [{ fn: Math.abs, label: 'y = |x|' }], caption: 'Hàm |x| liên tục tại 0 vì hai phía và giá trị tại điểm đều bằng 0; góc nhọn cho thấy liên tục chưa đủ để có đạo hàm.' },
  8: { x: [-2, 2], y: [-9, 9], curves: [{ fn: x => x ** 3, label: 'y = x³' }], caption: 'x³ tăng ở cả hai phía của 0. Đạo hàm 3x² bằng 0 tại gốc nhưng không đổi dấu: tiếp tuyến ngang chưa chắc là cực trị.' },
  9: { x: [-2, 2], y: [-2, 16], curves: [{ fn: x => x * Math.exp(x), label: 'y = x·eˣ' }], caption: 'Cả x và eˣ cùng thay đổi. Tại x = 0, đạo hàm tích là e⁰ + 0·e⁰ = 1; nhân hai đạo hàm tình cờ cho cùng số ở đây nhưng không đúng nói chung.' },
  10: { x: [-1.5, 1.5], y: [0, 12], curves: [{ fn: x => (x * x + 1) ** 2, label: 'y = (x² + 1)²' }], caption: 'Hai lớp: u = x² + 1, rồi y = u². Đồ thị chạm mức nhỏ nhất 1 tại x = 0, phù hợp y′ = 4x(x² + 1).' },
  11: { x: [0.05, 4], y: [-3, 2], curves: [{ fn: Math.log, label: 'y = ln x, x > 0' }], caption: 'Chỉ có nhánh x > 0; hình vẽ lấy mẫu từ x = 0,05. ln(1) = 0 và độ dốc 1/x giảm dần khi x tăng.' },
  12: { x: [0, 9], y: [0, 4], curves: [{ fn: Math.sqrt, label: 'y = √x' }, { fn: x => 2 + (x - 4) / 4, label: 'tiếp tuyến tại x = 4', color: orange }], caption: 'Tiếp tuyến y = 2 + (x − 4)/4 gần đường cong quanh x = 4. Càng đi xa điểm tiếp xúc, xấp xỉ tuyến tính càng có thể lệch.' },
  13: { x: [-2.2, 2.2], y: [-5, 5], curves: [{ fn: x => x ** 3 - 3 * x, label: 'y = x³ − 3x' }], caption: 'Hai điểm dừng x = −1 và x = 1 có giá trị lần lượt 2 và −2. Quan sát chiều tăng → giảm và giảm → tăng để phân loại cực trị.' },
  14: { x: [0, 12], y: [0, 40], curves: [{ fn: x => x * (12 - x), label: 'A(x) = x(12 − x)' }], caption: 'Hình chữ nhật chu vi 24 có diện tích A = x(12 − x), 0 < x < 12. Đỉnh parabol tại x = 6 cho hình vuông diện tích 36.' },
  15: { x: [-2, 2], y: [-2, 7], curves: [{ fn: x => x * x, label: 'F = x²' }, { fn: x => x * x + 2, label: 'G = x² + 2', color: orange }], caption: 'Hai đường chỉ khác một phép tịnh tiến đứng nên có cùng độ dốc 2x tại mọi x. Đó là ý nghĩa hình học của hằng số C.' },
  16: { x: [0, 2], y: [-4, 3], curves: [{ fn: x => 2 * x * Math.cos(x * x), label: 'y = 2x cos(x²)' }], caption: 'Dao động phụ thuộc x² và hệ số 2x chính là vi phân của x². Đặt u = x² đưa nguyên hàm về ∫cos u du.' },
  17: { x: [0, 2], y: [0, 16], curves: [{ fn: x => x * Math.exp(x), label: 'y = x eˣ' }], area: [0, 1], caption: 'Miền tô trên [0, 1] có diện tích 1: ∫x eˣ dx = (x − 1)eˣ + C. Từng phần chuyển đạo hàm sang x để giảm bậc.' },
  18: { x: [0, 3], y: [0, 4], curves: [{ fn: x => x + 1, label: 'y = x + 1' }], area: [0, 2], caption: 'Miền tô là hình thang, hai chiều cao 1 và 3, đáy 2: diện tích (1 + 3)·2/2 = 4, kiểm chứng F(2) − F(0).' },
  19: { x: [-1.5, 1.5], y: [-2, 2], curves: [{ fn: x => x, label: 'y = x' }], area: [-1, 1], caption: 'Trên [−1, 1], hai miền có cùng diện tích 1/2. Tích phân có dấu bằng 0, còn tổng diện tích bằng 1.' },
  20: { x: [0, 2], y: [0, 4.5], curves: [{ fn: x => x * x, label: 'y = x²' }, { fn: () => 4 / 3, label: 'giá trị trung bình 4/3', color: orange }], area: [0, 2], caption: 'Diện tích dưới x² trên [0, 2] bằng 8/3. Chia cho chiều dài đoạn 2 được độ cao trung bình 4/3.' },
  21: { x: [0, 3], y: [-3, 5], curves: [{ fn: x => 2 * x - 2, label: 'v(t) = 2t − 2' }], area: [0, 3], caption: 'Trục ngang là thời gian t. Vật đổi chiều tại t = 1. Độ dời bằng −1 + 4 = 3, quãng đường bằng 1 + 4 = 5.' },
  22: { x: [0, 1], y: [0, 1.2], curves: [{ fn: x => x, label: 'y = x' }, { fn: x => x * x, label: 'y = x²', color: orange }], caption: 'Trên [0, 1], đường thẳng nằm trên parabol. Diện tích kẹp giữa hai đường là ∫(x − x²) dx = 1/6.' },
  23: { x: [-2, 2], y: [0, 6], curves: [{ fn: x => x * x + 1, label: 'f(x, 1) = x² + 1' }], caption: 'Lát cắt của mặt z = x² + y² khi giữ y = 1. Dọc lát cắt, độ dốc theo x là 2x; tại x = 1 bằng 2.' },
  25: { x: [-2, 2], y: [-5, 5], curves: [{ fn: x => x * x, label: 'lát y = 0: z = x²' }, { fn: x => -x * x, label: 'lát x = 0: z = −y²', color: orange }], caption: 'Hai lát cắt của z = x² − y², trục ngang là biến của từng lát. Một hướng tăng, một hướng giảm từ gốc: (0, 0) là điểm yên ngựa.' },
  30: { x: [0, 3], y: [0, 10], curves: [{ fn: x => x * x, label: 's(t) = t²' }, { fn: x => 2 * x, label: 'v(t) = 2t', color: orange }], caption: 'Tổng kết qua một chuyển động: đạo hàm s cho v, tích phân v từ 0 đến 3 khôi phục độ dời s(3) − s(0) = 9. Hai đường biểu diễn các đại lượng có đơn vị khác nhau.' },
};

function Graph({ plot, children }: { plot: Plot; children?: (X: (x: number) => number, Y: (y: number) => number) => ReactNode }) {
  const clipId = useId();
  const X = (x: number) => 48 + (x - plot.x[0]) / (plot.x[1] - plot.x[0]) * 450;
  const Y = (y: number) => 238 - (y - plot.y[0]) / (plot.y[1] - plot.y[0]) * 208;
  const curve = (fn: Curve['fn'], from = plot.x[0], to = plot.x[1]) => Array.from({ length: 121 }, (_, i) => {
    const x = from + (to - from) * i / 120;
    return `${i ? 'L' : 'M'}${X(x)},${Y(fn(x))}`;
  }).join(' ');
  return <>
    {[0, 1, 2, 3, 4].map(i => {
      const x = plot.x[0] + (plot.x[1] - plot.x[0]) * i / 4;
      const y = plot.y[0] + (plot.y[1] - plot.y[0]) * i / 4;
      return <g key={i} className="calc-grid"><path d={`M${X(x)},30V238 M48,${Y(y)}H498`} /><text x={X(x)} y={258} textAnchor="middle">{Number(x.toFixed(2))}</text><text x={40} y={Y(y) + 4} textAnchor="end">{Number(y.toFixed(2))}</text></g>;
    })}
    <defs><clipPath id={clipId}><rect x="43" y="25" width="460" height="218" /></clipPath></defs>
    <g clipPath={`url(#${clipId})`}>
    <path d={`M48,${Y(0)}H498 M${X(0)},30V238`} stroke="currentColor" opacity=".45" />
    {plot.area && <path d={`${curve(plot.curves[0].fn, ...plot.area)} L${X(plot.area[1])},${Y(0)} L${X(plot.area[0])},${Y(0)} Z`} fill={blue} opacity=".15" />}
    {plot.curves.map(c => <path key={c.label} d={curve(c.fn)} stroke={c.color ?? blue} strokeWidth="3" fill="none" />)}
    {plot.hole && <circle cx={X(plot.hole[0])} cy={Y(plot.hole[1])} r="5" fill="var(--surface)" stroke={blue} strokeWidth="2" />}
    {children?.(X, Y)}
    </g>
  </>;
}

export default function CalculusFigure({ day }: { day: number }) {
  const id = useId();
  const [h, setH] = useState(1);
  let plot = plots[day];
  if (day === 7) plot = { x: [0, 3], y: [0, 9], curves: [{ fn: x => x * x, label: 'y = x²' }, { fn: x => 1 + (2 + h) * (x - 1), label: `cát tuyến: độ dốc ${(2 + h).toFixed(2)}`, color: orange }], caption: 'Cát tuyến đi qua A(1, 1) và B(1 + h, (1 + h)²). Khi h tiến về 0, độ dốc 2 + h tiến về đạo hàm 2.' };
  let graphic: ReactNode;
  let caption = plot?.caption ?? '';
  if (plot) graphic = <Graph plot={plot}>{day === 7 ? (X, Y) => <>
    <circle cx={X(1)} cy={Y(1)} r="5" fill={orange} /><circle cx={X(1 + h)} cy={Y((1 + h) ** 2)} r="5" fill={orange} />
    <text x={X(1) - 16} y={Y(1) - 10}>A</text><text x={X(1 + h) + 8} y={Y((1 + h) ** 2) - 8}>B</text>
  </> : undefined}</Graph>;
  else if (day === 24 || day === 26 || day === 27) {
    caption = day === 24 ? 'Các đường mức x² + y² = hằng số là đường tròn. Tại (1, 1), gradient (2, 2) vuông góc đường mức và chỉ ra ngoài, về phía giá trị lớn hơn. Mũi tên được thu ngắn để dễ đọc.' : day === 26 ? 'r(t) = (cos t, sin t) chạy ngược chiều kim đồng hồ. Tại t = 0, vị trí là (1, 0) và vận tốc (0, 1) nằm trên tiếp tuyến, có tốc độ 1.' : 'Trường F = (x, y) hướng ra xa gốc: các mũi tên cùng một tỉ lệ, dài hơn khi xa gốc. div F = 2; curl trong mặt phẳng bằng 0.';
    graphic = <g transform="translate(270 140)">
      <path d="M-180,0H180 M0,-110V110" stroke="currentColor" opacity=".4" /><text x="185" y="5">x</text><text x="8" y="-105">y</text>
      {day !== 27 && [day === 24 ? 45 : 80, ...(day === 24 ? [80, 108] : [])].map(r => <circle key={r} r={r} fill="none" stroke={blue} strokeWidth="2" />)}
      {day === 24 && <><path d="M56.57,-56.57L90,-90" stroke={orange} strokeWidth="3" markerEnd={`url(#${id})`} /><circle cx="56.57" cy="-56.57" r="4" fill={orange} /><text x="65" y="-40">(1, 1)</text></>}
      {day === 26 && <><path d="M80,0V-80" stroke={orange} strokeWidth="3" markerEnd={`url(#${id})`} /><circle cx="80" cy="0" r="4" fill={orange} /><text x="90" y="18">(1, 0)</text><text x="90" y="-45">v = (0, 1)</text></>}
      {day === 27 && [-2, -1, 0, 1, 2].flatMap(x => [-1, 0, 1].map(y => x || y ? <path key={`${x},${y}`} d={`M${x * 60},${-y * 60}l${x * 15},${-y * 15}`} stroke={blue} strokeWidth="2" markerEnd={`url(#${id})`} /> : null))}
    </g>;
  } else if (day === 28) {
    caption = 'Miền tam giác 0 ≤ x ≤ 2, 0 ≤ y ≤ x. Lát đứng tại x = 1,2 đi từ y = 0 đến y = 1,2: cận trong là 0 → x, cận ngoài là 0 → 2. Diện tích miền bằng 2.';
    graphic = <><path d="M90,225L410,225L410,35Z" fill={blue} fillOpacity=".15" stroke={blue} strokeWidth="2" /><path d="M60,225H465 M90,245V20" stroke="currentColor" /><path d="M282,225V111" stroke={orange} strokeWidth="6" /><text x="280" y="250">1,2</text><text x="406" y="250">2</text><text x="72" y="243">0</text><text x="470" y="230">x</text><text x="70" y="25">y</text><text x="235" y="112">y = x</text><text x="298" y="183">lát đứng</text></>;
  } else {
    caption = 'Một ô tọa độ cực nằm giữa r và r + Δr, góc mở Δθ. Cung ở bán kính lớn dài hơn: diện tích ô xấp xỉ r·Δr·Δθ khi hai khoảng nhỏ. Vì thế dA = r dr dθ.';
    graphic = <g transform="translate(120 235)"><path d="M0,0H350 M0,0V-215" stroke="currentColor" opacity=".5" /><path d="M150,0A150,150 0 0 0 114.9,-96.4 L168.5,-141.4 A220,220 0 0 1 220,0Z" fill={blue} fillOpacity=".2" stroke={blue} strokeWidth="2" /><path d="M0,0L168.5,-141.4 M40,0A40,40 0 0 0 30.64,-25.71" fill="none" stroke={orange} strokeWidth="2" /><text x="75" y="-10">r</text><text x="165" y="20">Δr</text><text x="45" y="-28">Δθ</text></g>;
  }
  return <figure className="calc-figure">
    <svg viewBox="0 0 550 280" role="img" aria-labelledby={`${id}-title ${id}-desc`}>
      <title id={`${id}-title`}>{`Minh họa ngày ${day}`}</title><desc id={`${id}-desc`}>{caption}</desc>
      <defs><marker id={id} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="context-stroke" /></marker></defs>
      {graphic}
    </svg>
    {plot && <div className="calc-legend">{plot.curves.map(c => <span key={c.label}><i style={{ background: c.color ?? blue }} />{c.label}</span>)}</div>}
    {day === 7 && <label className="calc-slider">Thay đổi h: <strong>{h.toFixed(2)}</strong><input aria-label="Khoảng cách h của cát tuyến" type="range" min="0.02" max="1" step="0.02" value={h} onChange={event => setH(Number(event.target.value))} /></label>}
    <figcaption>{caption}</figcaption>
  </figure>;
}
