import { useRef, useState, type KeyboardEvent } from 'react';
import * as la from '../lib/linalg';
import Canvas2D, { type V2 } from './Canvas2D';
import Scene3D from './Scene3D';

type Vec3 = [number, number, number];

export interface CodePlaygroundProps {
  initialCode: string;
  numpyCode?: string;
  height?: number;
  scene?: '2d' | '3d' | 'none';
}

interface Draw2DState {
  vectors: V2[];
  points: { x: number; y: number; color?: string; label?: string }[];
  segments: {
    from: [number, number];
    to: [number, number];
    color?: string;
    dashed?: boolean;
    label?: string;
  }[];
  polygons: { points: [number, number][]; fill?: string; opacity?: number }[];
  matrix?: [[number, number], [number, number]];
}

interface Draw3DState {
  vectors: { id: string; v: Vec3; color?: string; label?: string }[];
  points: { p: Vec3; color?: string; label?: string }[];
  matrix?: la.Mat;
}

const EMPTY_2D: Draw2DState = {
  vectors: [],
  points: [],
  segments: [],
  polygons: [],
  matrix: undefined,
};
const EMPTY_3D: Draw3DState = { vectors: [], points: [], matrix: undefined };

export default function CodePlayground({
  initialCode,
  numpyCode,
  height = 420,
  scene = '2d',
}: CodePlaygroundProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [tab, setTab] = useState<'code' | 'numpy'>('code');
  const [draw2d, setDraw2d] = useState<Draw2DState>(EMPTY_2D);
  const [draw3d, setDraw3d] = useState<Draw3DState>(EMPTY_3D);
  const idc = useRef(0);

  const run = () => {
    setError('');
    const logs: string[] = [];
    const print = (...args: unknown[]) => {
      logs.push(
        args
          .map((a) =>
            typeof a === 'object' ? JSON.stringify(a) : String(a)
          )
          .join(' ')
      );
    };

    const next2d: Draw2DState = {
      vectors: [],
      points: [],
      segments: [],
      polygons: [],
      matrix: undefined,
    };
    const next3d: Draw3DState = { vectors: [], points: [], matrix: undefined };
    idc.current = 0;

    const draw = {
      vector: (x: number, y: number, o: { color?: string; label?: string } = {}) =>
        next2d.vectors.push({ id: `d${idc.current++}`, x, y, ...o }),
      point: (x: number, y: number, o: { color?: string; label?: string } = {}) =>
        next2d.points.push({ x, y, ...o }),
      segment: (
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        o: { color?: string; dashed?: boolean; label?: string } = {}
      ) => next2d.segments.push({ from: [x1, y1], to: [x2, y2], ...o }),
      polygon: (
        pts: [number, number][],
        o: { fill?: string; opacity?: number } = {}
      ) => next2d.polygons.push({ points: pts, ...o }),
      matrix: (m: [[number, number], [number, number]]) => {
        next2d.matrix = m;
      },
      // 3D
      vector3: (v: Vec3, o: { color?: string; label?: string } = {}) =>
        next3d.vectors.push({ id: `d${idc.current++}`, v, ...o }),
      point3: (p: Vec3, o: { color?: string; label?: string } = {}) =>
        next3d.points.push({ p, ...o }),
      matrix3: (m: la.Mat) => {
        next3d.matrix = m;
      },
      clear: () => {
        next2d.vectors = [];
        next2d.points = [];
        next2d.segments = [];
        next2d.polygons = [];
        next2d.matrix = undefined;
        next3d.vectors = [];
        next3d.points = [];
        next3d.matrix = undefined;
      },
    };

    try {
      // eslint-disable-next-line no-new-func
      const fn = new Function('la', 'draw', 'print', code);
      fn(la, draw, print);
      setDraw2d(next2d);
      setDraw3d(next3d);
      setOutput(logs.join('\n'));
    } catch (e) {
      setError(String(e instanceof Error ? e.message : e));
      setOutput(logs.join('\n'));
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const ta = e.currentTarget;
      const s = ta.selectionStart;
      const en = ta.selectionEnd;
      const next = code.slice(0, s) + '  ' + code.slice(en);
      setCode(next);
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = s + 2;
      });
    }
  };

  return (
    <div className="playground">
      <div className="pg-left">
        <div className="pg-tabs">
          <button
            className={`pg-tab ${tab === 'code' ? 'active' : ''}`}
            onClick={() => setTab('code')}
          >
            Code
          </button>
          {numpyCode && (
            <button
              className={`pg-tab ${tab === 'numpy' ? 'active' : ''}`}
              onClick={() => setTab('numpy')}
            >
              NumPy tương đương
            </button>
          )}
        </div>
        {tab === 'code' ? (
          <>
            <textarea
              className="pg-editor"
              value={code}
              spellCheck={false}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={onKeyDown}
              style={{ height: height - 120 }}
            />
            <div className="row">
              <button className="btn btn-primary" onClick={run}>
                ▶ Chạy
              </button>
            </div>
            <div className={`pg-output ${error ? 'pg-error' : ''}`}>
              {error ? `Lỗi: ${error}` : output || 'Kết quả sẽ hiện ở đây…'}
            </div>
          </>
        ) : (
          <textarea
            className="pg-editor"
            value={numpyCode}
            readOnly
            spellCheck={false}
            style={{ height: height - 60 }}
          />
        )}
      </div>

      {scene !== 'none' && (
        <div className="pg-right">
          {scene === '2d' ? (
            <Canvas2D
              height={height}
              vectors={draw2d.vectors}
              points={draw2d.points}
              segments={draw2d.segments}
              polygons={draw2d.polygons}
              matrix={draw2d.matrix}
            />
          ) : (
            <Scene3D
              height={height}
              vectors={draw3d.vectors}
              points={draw3d.points}
              matrix={draw3d.matrix}
            />
          )}
        </div>
      )}
    </div>
  );
}
