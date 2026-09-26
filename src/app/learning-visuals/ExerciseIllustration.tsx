import { memo, useId, useMemo } from 'react';
import type { Exercise } from '../../core/exercises/types';
import { buildIllustration, type Family, type IllustrationSpec } from './illustrationSpec';
import './illustrations.css';

const COLORS = ['var(--vec-1, #64b5f6)', 'var(--vec-2, #f4b35f)', 'var(--vec-3, #69cfad)'];
const fmt = (n: number) => Math.abs(n) > 999999 ? n.toExponential(2) : String(n);

function StageLabel({ x, y, label }: { x: number; y: number; label: string }) {
  const lines: string[] = [];
  for (const word of label.split(' ')) {
    const last = lines.length - 1;
    if (last >= 0 && `${lines[last]} ${word}`.length <= 13) lines[last] += ` ${word}`;
    else lines.push(word);
  }
  return <text className="ei-stage-label" x={x} y={y}>{lines.map((line, i) => <tspan key={i} x={x} dy={i === 0 ? 0 : 26}>{line}</tspan>)}</text>;
}

function Arrow({ x1, y1, x2, y2, color = 'currentColor' }: { x1: number; y1: number; x2: number; y2: number; color?: string }) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const dx = Math.cos(angle), dy = Math.sin(angle);
  return <g stroke={color} fill={color}>
    <line x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="2" />
    <path d={`M ${x2} ${y2} L ${x2 - 9 * dx + 4 * dy} ${y2 - 9 * dy - 4 * dx} L ${x2 - 9 * dx - 4 * dy} ${y2 - 9 * dy + 4 * dx} Z`} stroke="none" />
  </g>;
}

function MiniGrid({ x, y, layers = false }: { x: number; y: number; layers?: boolean }) {
  return <g className="ei-glyph">
    {layers && <><rect x={x + 9} y={y - 9} width="66" height="54" rx="3" /><rect x={x + 5} y={y - 5} width="66" height="54" rx="3" /></>}
    <rect x={x} y={y} width="66" height="54" rx="3" />
    {[1, 2].map((i) => <line key={`c${i}`} x1={x + 22 * i} y1={y} x2={x + 22 * i} y2={y + 54} />)}
    {[1, 2].map((i) => <line key={`r${i}`} x1={x} y1={y + 18 * i} x2={x + 66} y2={y + 18 * i} />)}
  </g>;
}

function ConceptGlyph({ family, x, stage }: { family: Family; x: number; stage: number }) {
  if (stage === 2) return <g><rect className="ei-empty" x={x - 36} y="83" width="72" height="65" rx="12" /><text x={x} y="125" className="ei-question">?</text></g>;
  if (['matrix', 'tensor', 'decomposition', 'data', 'system'].includes(family)) return <MiniGrid x={x - 33} y={90} layers={family === 'tensor' || family === 'decomposition'} />;
  if (family === 'base') return <g>{['d₂', 'd₁', 'd₀'].map((v, i) => <g key={v}><rect className="ei-empty" x={x - 59 + i * 41} y="92" width="36" height="45" rx="5" /><text x={x - 41 + i * 41} y="121">{v}</text></g>)}</g>;
  if (['coordinates', 'vectors', 'space', 'eigen', 'quadratic', 'trig'].includes(family)) return <g className="ei-glyph">
    <path d={`M ${x - 45} 137 H ${x + 45} M ${x - 25} 152 V 75`} fill="none" />
    {family === 'trig' ? <circle cx={x} cy="112" r="29" fill="none" /> : family === 'quadratic' ? <ellipse cx={x} cy="111" rx="35" ry="21" fill="none" /> : <Arrow x1={x - 25} y1={137} x2={x + 30} y2={90} color={COLORS[stage]} />}
  </g>;
  if (family === 'training') return <g className="ei-glyph"><path d={`M ${x - 45} 80 Q ${x} 187 ${x + 45} 80`} fill="none" /><circle cx={x - 29} cy="111" r="6" /><path d={`M ${x - 23} 118 L ${x - 9} 130`} fill="none" /></g>;
  if (family === 'sequence') return <g className="ei-glyph"><circle cx={x} cy="115" r="31" /><text x={x} y="122">{stage === 0 ? 't' : 'g'}</text></g>;
  return <g><rect className="ei-block" x={x - 45} y="85" width="90" height="62" rx="10" /><text x={x} y="123" className="ei-question">{stage === 0 ? 'x' : family === 'logic' ? 'logic' : 'f'}</text></g>;
}

function ConceptFigure({ spec }: { spec: Extract<IllustrationSpec, { kind: 'concept' }> }) {
  if (spec.family === 'network') {
    const columns = [[67, 115, 163], [49, 93, 137, 181], [89, 141]];
    const xs = [110, 320, 530];
    return <g>
      {columns.slice(0, 2).flatMap((ys, c) => ys.flatMap((y, i) => columns[c + 1].map((nextY, j) => <line key={`${c}-${i}-${j}`} className="ei-wire" x1={xs[c]} y1={y} x2={xs[c + 1]} y2={nextY} />)))}
      {columns.flatMap((ys, c) => ys.map((y, i) => <circle key={`${c}-${i}`} cx={xs[c]} cy={y} r="13" className={c === 2 ? 'ei-empty' : 'ei-block'} />))}
      {spec.concept.stages.map((label, i) => <StageLabel key={label} x={xs[i]} y={214} label={label} />)}
      <text x="530" y="121" className="ei-question">?</text>
    </g>;
  }
  return <g>
    <Arrow x1={182} y1={115} x2={244} y2={115} />
    <Arrow x1={395} y1={115} x2={457} y2={115} />
    {[110, 320, 530].map((x, i) => <g key={x}>
      <ConceptGlyph family={spec.family} x={x} stage={i} />
      <StageLabel x={x} y={185} label={spec.concept.stages[i]} />
    </g>)}
    {spec.family === 'sequence' && <path className="ei-wire" d="M 530 154 V 221 H 110 V 161" fill="none" strokeDasharray="5 5" />}
  </g>;
}

function VectorsFigure({ spec }: { spec: Extract<IllustrationSpec, { kind: 'vectors' }> }) {
  // Three-dimensional givens remain a component diagram, never a misleading
  // two-dimensional projection that discards a coordinate.
  if (spec.vectors.some((v) => v.values.length === 3)) return <g>
    <text x="320" y="37">Các thành phần đã cho</text>
    {spec.vectors.map((vector, i) => <g key={`${vector.name}-${i}`}>
      <text x="75" y={88 + i * 61} fill={COLORS[i]}>{vector.name}</text>
      {vector.values.map((value, j) => <g key={j}><rect className="ei-empty" x={135 + j * 140} y={58 + i * 61} width="112" height="46" rx="7" /><text x={191 + j * 140} y={87 + i * 61}>{fmt(value)}</text></g>)}
    </g>)}
  </g>;
  const bound = Math.max(1, ...spec.vectors.flatMap((v) => v.values.map(Math.abs)));
  const toX = (x: number) => 170 + (x / bound) * 94;
  const toY = (y: number) => 130 - (y / bound) * 94;
  return <g>
    {[-1, -.5, .5, 1].map((v) => <g key={v} className="ei-gridline"><line x1={170 + v * 94} y1="24" x2={170 + v * 94} y2="236" /><line x1="64" y1={130 + v * 94} x2="276" y2={130 + v * 94} /></g>)}
    <Arrow x1={53} y1={130} x2={289} y2={130} /><Arrow x1={170} y1={243} x2={170} y2={15} />
    <text x="292" y="151">x</text><text x="187" y="21">y</text><text x="154" y="150">O</text>
    {spec.vectors.map((v, i) => <g key={`${v.name}-${i}`}>
      {v.values.some((n) => n !== 0) ? <Arrow x1={170} y1={130} x2={toX(v.values[0])} y2={toY(v.values[1])} color={COLORS[i]} /> : <circle cx="170" cy="130" r="5" fill={COLORS[i]} />}
      <text x={toX(v.values[0]) + 11} y={toY(v.values[1]) - 8} fill={COLORS[i]}>{v.name}</text>
      <circle cx="354" cy={72 + i * 57} r="5" fill={COLORS[i]} />
      <text x="378" y={79 + i * 57} textAnchor="start" fill={COLORS[i]}>{v.name} = ({v.values.map(fmt).join(', ')})</text>
    </g>)}
  </g>;
}

function MatricesFigure({ spec }: { spec: Extract<IllustrationSpec, { kind: 'matrices' }> }) {
  const size = 48;
  return <g>{spec.matrices.map((matrix, i) => {
    const center = spec.matrices.length === 1 ? 320 : 165 + i * 310;
    const left = center - matrix.rows[0].length * size / 2;
    const top = 57;
    return <g key={`${matrix.name}-${i}`}>
      <text x={center} y="30" fill={COLORS[i]}>{matrix.name} · {matrix.rows.length} × {matrix.rows[0].length}</text>
      {matrix.rows.map((row, r) => row.map((value, c) => <g key={`${r}-${c}`}>
        <rect x={left + c * size} y={top + r * size} width={size} height={size} className="ei-empty" />
        <text className={String(value).length > 3 ? 'ei-small-number' : ''} x={left + (c + .5) * size} y={top + (r + .5) * size + 6}>{fmt(value)}</text>
      </g>))}
      <path d={`M ${left - 4} ${top} h -9 v ${matrix.rows.length * size} h 9 M ${left + matrix.rows[0].length * size + 4} ${top} h 9 v ${matrix.rows.length * size} h -9`} stroke={COLORS[i]} strokeWidth="2" fill="none" />
    </g>;
  })}</g>;
}

function NumeralsFigure({ spec }: { spec: Extract<IllustrationSpec, { kind: 'numerals' }> }) {
  return <g>{spec.numerals.map((numeral, i) => {
    const cell = Math.min(49, 520 / numeral.digits.length);
    const left = 320 - cell * numeral.digits.length / 2;
    const y = 51 + i * 111;
    return <g key={`${numeral.digits}-${i}`}>
      <text x="320" y={y - 16}>Cơ số {numeral.base}</text>
      {[...numeral.digits].map((digit, j) => <g key={j}>
        <rect className="ei-empty" x={left + j * cell} y={y} width={cell - 5} height="41" rx="5" />
        <text x={left + (j + .5) * cell - 2.5} y={y + 27}>{digit}</text>
        <text className="ei-position" x={left + (j + .5) * cell - 2.5} y={y + 65}>{numeral.digits.length - j - 1}</text>
      </g>)}
    </g>;
  })}</g>;
}

function GateFigure({ spec }: { spec: Extract<IllustrationSpec, { kind: 'gate' }> }) {
  return <g>
    {spec.inputs.map((input, i) => {
      const y = spec.inputs.length === 1 ? 124 : 85 + i * 78;
      return <g key={input.name}><text x="87" y={y + 6}>{input.name} = {input.value}</text><Arrow x1={153} y1={y} x2={249} y2={y} color={COLORS[i]} /></g>;
    })}
    <rect x="250" y="57" width="145" height="133" rx="16" className="ei-block" />
    <text x="322" y="132" className="ei-question">{spec.gate}</text>
    <Arrow x1={395} y1={124} x2={496} y2={124} />
    <rect x="500" y="96" width="95" height="55" rx="8" className="ei-empty" />
    <text x="547" y="131">Y = ?</text>
    <text x="322" y="222">Sơ đồ khối logic</text>
  </g>;
}

function NeuronFigure({ spec }: { spec: Extract<IllustrationSpec, { kind: 'neuron' }> }) {
  return <g>
    {spec.inputs.map((value, i) => {
      const y = 43 + i * 75;
      return <g key={i}><text x="83" y={y + 6}>x{i + 1} = {fmt(value)}</text><Arrow x1={151} y1={y} x2={329} y2={124} color={COLORS[i]} /><rect x="199" y={y - 23} width="92" height="28" rx="5" className="ei-empty" /><text x="245" y={y - 3}>w{i + 1} = {fmt(spec.weights[i])}</text></g>;
    })}
    <circle cx="359" cy="124" r="30" className="ei-block" /><text x="359" y="133" className="ei-question">Σ</text>
    <Arrow x1={392} y1={124} x2={486} y2={124} /><text x="544" y="131">Σ = ?</text>
  </g>;
}

function Figure({ spec }: { spec: IllustrationSpec }) {
  switch (spec.kind) {
    case 'concept': return <ConceptFigure spec={spec} />;
    case 'vectors': return <VectorsFigure spec={spec} />;
    case 'matrices': return <MatricesFigure spec={spec} />;
    case 'numerals': return <NumeralsFigure spec={spec} />;
    case 'gate': return <GateFigure spec={spec} />;
    case 'neuron': return <NeuronFigure spec={spec} />;
  }
}

function describe(spec: IllustrationSpec): string {
  switch (spec.kind) {
    case 'concept': return spec.concept.stages.join(' → ');
    case 'vectors': return spec.vectors.map((v) => `${v.name} = (${v.values.join(', ')})`).join('; ');
    case 'matrices': return spec.matrices.map((m) => `${m.name}: ${m.rows.map((r) => r.join(', ')).join('; ')}`).join('. ');
    case 'numerals': return spec.numerals.map((n) => `${n.digits}, cơ số ${n.base}`).join('; ');
    case 'gate': return `${spec.inputs.map((v) => `${v.name} = ${v.value}`).join(', ')} → ${spec.gate} → đầu ra chưa biết.`;
    case 'neuron': return `Đầu vào (${spec.inputs.join(', ')}); trọng số (${spec.weights.join(', ')}); tổng chưa biết.`;
  }
}

/** Same safe data diagram before and after checking. Solution explanations
 * remain in the feedback panel; revealed does not grant access to answers. */
function ExerciseIllustration({ exercise }: { exercise: Exercise; revealed?: boolean }) {
  const id = useId();
  const spec = useMemo(() => buildIllustration({ prompt: exercise.prompt, skillId: exercise.skillId, type: exercise.type }), [exercise.prompt, exercise.skillId, exercise.type]);
  const conceptual = spec.source === 'concept';
  const title = conceptual ? spec.concept.title : 'Dữ kiện từ đề';
  const caption = conceptual ? spec.concept.caption : spec.caption;
  return <figure className="exercise-illustration" data-source={spec.source}>
    <div className="ei-heading"><span className="ei-source">{conceptual ? 'Sơ đồ quy luật' : 'Hình từ đề bài'}</span><strong>{title}</strong></div>
    {conceptual && <p className="ei-provenance">Minh họa khái niệm, không phải hình dựng từ dữ kiện của đề.</p>}
    <svg viewBox="0 0 640 260" role="img" aria-labelledby={`${id}-title ${id}-desc`} className="ei-svg">
      <title id={`${id}-title`}>{title}</title><desc id={`${id}-desc`}>{describe(spec)}</desc>
      <Figure spec={spec} />
    </svg>
    {!conceptual && <p className="ei-data">{describe(spec)}</p>}
    <figcaption>{caption}</figcaption>
  </figure>;
}

export default memo(ExerciseIllustration);
