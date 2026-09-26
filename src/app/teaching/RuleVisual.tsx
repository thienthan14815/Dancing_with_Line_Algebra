import { useId, type ReactNode } from 'react';
import type { TeachingRule } from './rules';

const blue = 'var(--vec-1)';
const orange = 'var(--vec-2)';
const green = 'var(--vec-3)';

function label(x: number, y: number, text: string, color = 'currentColor') {
  return <text x={x} y={y} textAnchor="middle" fill={color} fontSize="14">{text}</text>;
}

function arrow(x1: number, y1: number, x2: number, y2: number, color: string) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const wing = (sign: number) => `${x2 - 9 * Math.cos(angle + sign * 0.45)},${y2 - 9 * Math.sin(angle + sign * 0.45)}`;
  return <g><line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="3" />
    <polygon points={`${x2},${y2} ${wing(1)} ${wing(-1)}`} fill={color} /></g>;
}

function wrapped(text: string): string[] {
  const lines: string[] = [];
  for (const word of text.split(' ')) {
    const last = lines.length - 1;
    if (last < 0 || lines[last].length + word.length > 18) lines.push(word);
    else lines[last] += ` ${word}`;
  }
  return lines;
}

/** Authored example diagrams, never inferred from a student's exercise answer. */
export default function RuleVisual({ skillId, rule }: { skillId: string; rule: TeachingRule }) {
  const id = useId();
  let picture: ReactNode;
  let description: string;
  let caption = 'Hình minh họa quy luật';
  const vectorExamples: Record<string, { vectors: [number, number, string, string][]; text: string }> = {
    vector_basics: { vectors: [[3, 4, 'B − A = (3, 4)', blue]], text: 'Dịch chuyển 3 theo ngang, 4 theo dọc.' },
    vector_addition: { vectors: [[1, 2, 'u = (1, 2)', blue], [4, 1, 'u + v = (4, 1)', green]], text: 'Nối thêm v = (3, −1) vào đầu u.' },
    scalar_multiplication: { vectors: [[2, -1, 'v = (2, −1)', blue], [-4, 2, '−2v = (−4, 2)', orange]], text: 'Nhân −2: gấp đôi độ dài và đảo chiều.' },
    dot_product: { vectors: [[1, 2, 'u = (1, 2)', blue], [3, -1, 'v = (3, −1)', orange]], text: 'u·v = 1 > 0 → góc giữa u, v là góc nhọn.' },
    projection: { vectors: [[3, 2, 'v = (3, 2)', blue], [3, 0, 'chiếu = (3, 0)', green]], text: 'Phần dư (0, 2) vuông góc với trục chiếu.' },
    span: { vectors: [[1, 2, 'v = (1, 2)', blue], [-1, -2, '−v = (−1, −2)', orange]], text: 'Mọi cv đều nằm trên đường qua gốc này.' },
    eigenvector: { vectors: [[0, 1, 'v = (0, 1)', blue], [0, 3, 'Av = 3v', green]], text: 'A = diag(2, 3): hướng dọc là một hướng riêng.' },
    eigenvalue: { vectors: [[1, 0, 'v = (1, 0)', blue], [2, 0, 'Av = 2v', green]], text: 'A = diag(2, 3): hệ số theo hướng ngang là 2.' },
  };

  if (vectorExamples[skillId]) {
    const ex = vectorExamples[skillId];
    description = `${ex.vectors.map(v => v[2]).join('; ')}. ${ex.text}`;
    const ox = 145, oy = 110, scale = 22;
    picture = <>
      <path d="M35 110H255 M145 12V170" stroke="currentColor" opacity=".3" />
      {label(253, 130, 'x')}{label(160, 18, 'y')}{label(134, 128, 'O')}
      {[...ex.vectors].reverse().map(([x, y, , color], i) => <g key={i}>{arrow(ox, oy, ox + x * scale, oy - y * scale, color)}</g>)}
      {skillId === 'projection' && <path d="M211 66V110" stroke={orange} strokeDasharray="5 4" />}
      {skillId === 'vector_addition' && arrow(167, 66, 233, 88, orange)}
      {skillId === 'span' && <path d="M117 166L194 12" stroke={blue} strokeDasharray="4 4" opacity=".5" />}
      {ex.vectors.map(([, , name, color], i) => <g key={name}>{label(380, 58 + i * 34, name, color)}</g>)}
      {wrapped(ex.text).map((line, i) => <g key={i}>{label(380, 132 + i * 18, line)}</g>)}
    </>;
  } else if (skillId === 'coordinate_systems') {
    description = 'Đi từ O sang phải 3 đơn vị rồi lên 4 đơn vị đến P(3,4); OP dài 5.';
    picture = <><path d="M65 145H255 M85 160V15" stroke="currentColor" opacity=".4" />
      <path d="M85 145H175V25" stroke={orange} fill="none" strokeWidth="3" strokeDasharray="5 4" />
      {arrow(85,145,175,25,blue)}{label(130, 168, 'x = 3')}{label(205,90,'y = 4')}
      {label(305,36,'P = (3, 4)')}{label(375,95,'OP = √(3² + 4²) = 5')}
      <circle cx="175" cy="25" r="5" fill={green} />{label(72,158,'O')}</>;
  } else if (skillId === 'trigonometry') {
    description = 'Đường tròn đơn vị: góc 90 độ đến điểm (0,1), cos bằng 0 và sin bằng 1.';
    picture = <><circle cx="145" cy="95" r="65" fill="none" stroke={blue} strokeWidth="2" />
      <path d="M65 95H225 M145 15V175" stroke="currentColor" opacity=".35" />
      {arrow(145,95,145,30,green)}{label(145,22,'(0, 1)')}{label(224,115,'(1, 0)')}
      <path d="M165 95 A20 20 0 0 0 145 75" fill="none" stroke={orange} strokeWidth="3" />
      {label(369,69,'θ = 90°')}{label(369,103,'cos θ = 0')}{label(369,137,'sin θ = 1')}</>;
  } else if (skillId === 'functions_graphs' || skillId === 'activation_functions' || skillId === 'gradient_descent') {
    const isRelu = skillId === 'activation_functions';
    const isGD = skillId === 'gradient_descent';
    const graphX = (x: number) => (isGD ? 145 : 120) + (isGD ? 27 : 30) * x;
    const graphY = (y: number) => (isGD ? 150 : 155) - (isGD ? 11.25 : isRelu ? 30 : 18) * y;
    const fn = (x: number) => isGD ? x*x : isRelu ? Math.max(0,x) : 2*x+1;
    const from = isGD ? -3.2 : isRelu ? -2.5 : -0.8;
    const to = isGD ? 3.2 : isRelu ? 4 : 3.5;
    const curve = Array.from({ length: 65 }, (_, i) => {
      const x = from + (to-from)*i/64;
      return `${i ? 'L' : 'M'}${graphX(x)} ${graphY(fn(x))}`;
    }).join(' ');
    description = isRelu ? 'Đồ thị ReLU nằm ngang ở 0 khi z âm, có độ dốc 1 khi z dương.' : isGD ? 'Trên parabol L(w)=w², bước từ w=3 xuống w=2.4 làm mất mát giảm từ 9 xuống 5.76.' : 'Đường y=2x+1 đi qua điểm (3,7).';
    caption = isGD ? 'Đồ thị L(w) = w²: bước cập nhật' : isRelu ? 'Đồ thị ReLU' : 'Đồ thị f(x) = 2x + 1';
    picture = <><path d={isGD ? 'M45 150H295 M145 175V15' : 'M45 155H295 M120 175V15'} stroke="currentColor" opacity=".35" />
      <path d={curve} fill="none" stroke={blue} strokeWidth="3" />
      {isGD ? <>{arrow(graphX(3),graphY(9),graphX(2.4),graphY(5.76),orange)}
        <circle cx={graphX(3)} cy={graphY(9)} r="4" fill={orange} /><circle cx={graphX(2.4)} cy={graphY(5.76)} r="4" fill={green} />
        {label(388,66,'w: 3 → 2.4')}{label(388,109,'L: 9 → 5.76')}
      </> : isRelu ? <>{label(385,65,'z ≤ 0 → 0')}{label(385,109,'z > 0 → z')}</> : <>
        <path d={`M${graphX(3)} ${graphY(0)}V${graphY(7)}H${graphX(0)}`} stroke={orange} strokeDasharray="4 4" fill="none" />
        <circle cx={graphX(3)} cy={graphY(7)} r="5" fill={orange} />{label(graphX(3),174,'3')}{label(105,graphY(7)+5,'7')}
        {label(385,65,'x = 3 → y = 7')}{label(385,109,'f(x) = 2x + 1')}</>}
      {label(291,174,isGD ? 'w' : isRelu ? 'z' : 'x')}{label(isGD ? 131 : 106,19,isGD ? 'L' : 'y')}
    </>;
  } else if (skillId === 'determinant' || skillId === 'matrix_transformation' || skillId === 'singular_values' || skillId === 'svd') {
    const det = skillId === 'determinant';
      description = det ? 'Hình vuông đơn vị có diện tích 1 biến thành hình bình hành diện tích 6 bởi A=[[2,1],[0,3]].' : 'Minh họa khái niệm: ma trận chéo co giãn hình vuông độc lập theo hai trục; SVD còn có bước đổi hướng.';
    caption = det ? 'Diện tích có dấu: det A = 6' : 'Sơ đồ khái niệm: co giãn theo các trục';
    picture = <><path d="M60 140H105V95H60Z" fill={blue} fillOpacity=".12" stroke={blue} strokeWidth="2" />
      {label(85,168,'Hình ban đầu')}{arrow(145,110,230,110,orange)}
      <path d={det ? 'M280 145L370 145L415 10L325 10Z' : 'M280 145H445V55H280Z'} fill={green} fillOpacity=".12" stroke={green} strokeWidth="2" />
      {label(360,172,det ? 'Diện tích × 6' : 'Hình sau co giãn')}</>;
  } else if (skillId === 'matrix_multiplication' || skillId === 'cnn') {
    description = skillId === 'cnn' ? 'Kernel [1,0;0,−1] nhân theo ô với vùng ảnh [1,2;3,4], cộng cho kết quả −3.' : 'Hàng (1,2) nhân cột (3,4): 1×3+2×4=11.';
    picture = skillId === 'cnn' ? <>
      {[1,2,3,4].map((n,i) => <g key={i}><rect x={45+i%2*38} y={38+Math.floor(i/2)*38} width="38" height="38" fill="none" stroke={blue} />{label(64+i%2*38,63+Math.floor(i/2)*38,String(n))}</g>)}
      {label(154,83,'⊙')}{[1,0,0,-1].map((n,i) => <g key={i}><rect x={188+i%2*38} y={38+Math.floor(i/2)*38} width="38" height="38" fill="none" stroke={orange} />{label(207+i%2*38,63+Math.floor(i/2)*38,String(n))}</g>)}
      {arrow(287,76,340,76,green)}{label(412,80,'1 − 4 = −3')}{label(85,148,'Vùng ảnh')}{label(226,148,'Kernel')}{label(412,148,'Một ô đầu ra')}
    </> : <><rect x="45" y="60" width="105" height="45" rx="8" fill="none" stroke={blue} />
      {label(98,88,'1     2')}{label(185,88,'×')}<rect x="224" y="36" width="55" height="96" rx="8" fill="none" stroke={orange} />
      {label(251,69,'3')}{label(251,109,'4')}{arrow(300,83,346,83,green)}{label(423,69,'1×3 + 2×4')}{label(423,107,'= 11')}
      {label(98,160,'Hàng của A')}{label(251,160,'Cột của B')}{label(423,160,'Một ô của AB')}</>;
  } else if (skillId === 'digital_binary_decimal') {
    description = 'Các bit 1,0,1,1 nhân các trọng số 8,4,2,1 tương ứng; tổng 8+0+2+1=11.';
    picture = <>{[1,0,1,1].map((bit,i) => <g key={i}><rect x={64+i*96} y="30" width="72" height="50" rx="9" fill="none" stroke={bit ? blue : 'currentColor'} />{label(100+i*96,63,String(bit),bit ? blue : 'currentColor')}{label(100+i*96,109,`× ${[8,4,2,1][i]}`)}</g>)}{label(245,161,'8 + 0 + 2 + 1 = 11₁₀')}</>;
  } else if (skillId === 'digital_truth_table' || skillId === 'digital_sop' || skillId === 'digital_boolean' || skillId === 'digital_gates') {
    const xor = skillId === 'digital_sop';
    description = xor ? 'XOR: bốn hàng 00→0, 01→1, 10→1, 11→0. Chọn hai hàng đầu ra 1 để lập A̅B + AB̅.' : 'AND: 00→0, 01→0, 10→0, 11→1. Chỉ đầu vào 11 làm đầu ra bằng 1.';
    caption = xor ? 'Từ hàng Y = 1 đến SOP của XOR' : 'Bảng chân trị minh họa cổng AND';
    picture = <>{label(107,25,'A   B')}{label(213,25,xor ? 'XOR' : 'AND')}
      {[0,1,2,3].map((row) => { const bit = xor ? Number(row === 1 || row === 2) : Number(row === 3); return <g key={row}><rect x="55" y={34+row*33} width="194" height="31" rx="4" fill={bit ? 'var(--primary-soft)' : 'none'} />{label(107,56+row*33,`${row>>1}   ${row&1}`)}{label(213,56+row*33,String(bit))}</g>; })}
      {arrow(272,95,320,95,blue)}{label(411,81,xor ? '01 → A̅B' : 'Cả hai bằng 1')}{label(411,116,xor ? '10 → AB̅' : 'thì Y = 1')}
    </>;
  } else if (skillId === 'digital_adder') {
    description = 'Bốn module full adder nối carry từ FA0 tới FA3. Ví dụ 1011 + 0110 cho bốn bit tổng 0001 và carry ra 1.';
    picture = <>{[0,1,2,3].map(i => <g key={i}>
      <rect x={37+i*116} y="65" width="80" height="54" rx="10" fill="none" stroke={blue} />{label(77+i*116,98,`FA${i}`)}
      {label(77+i*116,33,`A=${[1,1,0,1][i]} B=${[0,1,1,0][i]}`)}<path d={`M${77+i*116} 39V65`} stroke={blue} />
      {label(77+i*116,153,`S${i} = ${[1,0,0,0][i]}`)}
      {i<3 && <>{arrow(119+i*116,91,151+i*116,91,orange)}{label(135+i*116,60,`C=${[0,1,1][i]}`)}</>}
    </g>)}{label(259,184,'Bit thấp → bit cao · nhớ ra C₄ = 1')}</>;
  } else if (skillId === 'linear_system') {
    description = 'Hai đường x + y = 3 và x − y = 1 cắt nhau tại (2, 1), nghiệm chung của hệ.';
    picture = <><path d="M35 160H260 M60 180V15" stroke="currentColor" opacity=".3" />
      <path d="M60 40L200 180" stroke={blue} strokeWidth="3" /><path d="M80 180L220 40" stroke={orange} strokeWidth="3" />
      <circle cx="140" cy="120" r="6" fill={green} />{label(153,106,'(2, 1)',green)}
      {label(390,60,'x + y = 3',blue)}{label(390,99,'x − y = 1',orange)}{label(390,143,'Một giao điểm')}
    </>;
  } else if (skillId === 'xor_mlp') {
    description = 'XOR: (0,0), (1,1) có nhãn 0; (0,1), (1,0) có nhãn 1. Hai nhóm nằm ở các cặp góc đối diện.';
    picture = <><path d="M55 145H250 M85 165V15" stroke="currentColor" opacity=".3" />
      {[[85,145,'0',blue],[195,35,'0',blue],[85,35,'1',orange],[195,145,'1',orange]].map(([x,y,n,color],i) => <g key={i}><circle cx={x} cy={y} r="14" fill="var(--surface)" stroke={color as string} strokeWidth="3" />{label(Number(x),Number(y)+5,n as string)}</g>)}
      {label(56,147,'0')}{label(56,40,'1')}{label(195,179,'1')}{label(250,164,'A')}{label(76,14,'B')}
      {label(379,69,'Nhãn 0: cùng bit',blue)}{label(379,105,'Nhãn 1: khác bit',orange)}{label(379,146,'Không tách bằng 1 đường')}
    </>;
  } else if (skillId === 'neuron' || skillId === 'perceptron') {
    const threshold = skillId === 'perceptron';
    description = threshold ? 'Hai đầu vào 1 và 1 nhân trọng số 2 và −1; tổng bằng 1, đạt ngưỡng 0.5 nên neuron bật.' : 'Hai đầu vào 2 và 1 nhân trọng số 1 và −1; tổng bằng 1, qua ReLU vẫn là 1.';
    picture = <>{[0,1].map(i => <g key={i}><circle cx="67" cy={48+i*88} r="22" fill="none" stroke={blue} />{label(67,53+i*88,threshold || i===1 ? '1' : '2')}{arrow(91,48+i*88,217,90,blue)}{label(155,43+i*107,i===1 ? 'w₂ = −1' : threshold ? 'w₁ = 2' : 'w₁ = 1')}</g>)}
      <circle cx="243" cy="90" r="26" fill="none" stroke={orange} />{label(243,96,'Σ = 1')}{arrow(272,90,322,90,green)}
      <rect x="327" y="62" width="103" height="56" rx="10" fill="none" stroke={green} />{label(378,96,threshold ? '≥ 0.5 ?' : 'ReLU')}
      {arrow(434,90,475,90,green)}{label(493,96,'1')}{label(262,179,threshold ? 'Ngưỡng b = 0.5' : 'Bias b = 0')}
    </>;
  } else if (skillId === 'tensor_basics' || skillId === 'tensor_memory' || skillId === 'tensor_ops' || skillId === 'word_embedding') {
    description = 'Sơ đồ khái niệm tensor hai trục: các ô sắp thành hàng và cột; mỗi ô có vị trí riêng.';
    caption = 'Sơ đồ khái niệm: hàng, cột và phần tử';
    picture = <>{Array.from({ length: 6 }, (_, i) => <g key={i}><rect x={75+i%3*55} y={40+Math.floor(i/3)*55} width="51" height="51" rx="6" fill="none" stroke={i===5 ? orange : blue} />{label(100+i%3*55,72+Math.floor(i/3)*55,`[${Math.floor(i/3)},${i%3}]`)}</g>)}
      {label(376,75,'shape = (2, 3)')}{label(376,114,'2 × 3 = 6 phần tử')}{label(248,173,'Chỉ số bắt đầu từ 0')}</>;
  } else if (skillId === 'softmax_regression' || skillId === 'computer_vision' || skillId === 'attention') {
    const values = skillId === 'softmax_regression' ? [0.25,0.75] : skillId === 'computer_vision' ? [0.7,0.3] : [0.5,0.5];
    description = `Hai trọng số ${values[0]} và ${values[1]} đều không âm và có tổng bằng 1.`;
    picture = <>{values.map((value,i) => <g key={i}>{label(72,64+i*65,skillId === 'computer_vision' ? ['Mèo','Chó'][i] : `p${i+1}`)}<rect x="120" y={39+i*65} width={300*value} height="35" rx="8" fill={i===0 ? blue : orange} />{label(155+300*value,64+i*65,String(value))}</g>)}{label(258,177,'Tổng trọng số = 1')}</>;
  } else {
    description = rule.visual.join(' → ');
    caption = 'Sơ đồ khái niệm — đọc từ trái sang phải';
    picture = <>{rule.visual.map((text, i) => <g key={text}>
      <circle cx={87+i*173} cy="46" r="23" fill="var(--primary-soft)" stroke="var(--accent)" />{label(87+i*173,51,String(i+1),'var(--accent)')}
      {i<2 && arrow(121+i*173,46,225+i*173,46,'var(--accent)')}
      {wrapped(text).map((line,j) => <g key={j}>{label(87+i*173,95+j*22,line)}</g>)}
    </g>)}</>;
  }

  return <figure className="teach-visual">
    <svg viewBox="0 0 520 195" role="img" aria-labelledby={`${id}-title ${id}-desc`}>
      <title id={`${id}-title`}>{caption}</title><desc id={`${id}-desc`}>{description}</desc>{picture}
    </svg>
    <figcaption>{caption}</figcaption>
    <p className="teach-visual-description">{description}</p>
  </figure>;
}
