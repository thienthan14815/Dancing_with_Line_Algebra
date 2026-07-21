import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Check, Circle, ArrowRight, GraduationCap, Lock } from 'lucide-react';
import {
  PREREQ_EDGES,
  topoLayers,
  getPrereqs,
  getAllPrereqs,
  getDependents,
} from '../../core/content/knowledgeGraph';
import { SKILL_BY_ID, SKILL_IDS } from '../../core/content/skills';
import { flatMicroLessons } from '../../core/content/course';
import { useLearnStore } from '../../core/progress/store';
import { Button } from '../ui';
import './graph.css';

// ===========================================================================
// BẢN ĐỒ TRI THỨC — skill tree DAG tự vẽ.
// Nguồn sự thật: knowledgeGraph.ts (chỉ đọc). Cạnh vẽ bằng SVG (đường cong
// mảnh), node là pill button HTML đặt tuyệt đối lên trên (để chữ nét, bấm
// được bằng bàn phím). Bố cục: mỗi lớp topo = một hàng; trong hàng, node xếp
// theo thứ tự chương (SKILL_IDS) để cạnh ít chéo nhất.
// ===========================================================================

type NodeState = 'locked' | 'available' | 'learning' | 'mastered';

const NODE_W = 152;
const NODE_H = 48;
const GAP_X = 22;
const ROW_GAP = 116; // khoảng cách tâm-tâm giữa hai hàng
const PAD_X = 32;
const PAD_Y = 28;

/** Ngưỡng mastery coi là "đạt" một prereq (khớp default của knowledgeGraph). */
const MET = 0.4;

const STATE_LABEL: Record<NodeState, string> = {
  locked: 'Chưa mở khóa',
  available: 'Sẵn sàng học',
  learning: 'Đang học',
  mastered: 'Đã thành thạo',
};

/** Tên VN ngắn: phần trước dấu "(" trong tên skill. */
function shortLabel(id: string): string {
  const name = SKILL_BY_ID[id]?.name ?? id;
  const vi = name.split('(')[0].trim();
  return vi || name;
}

export default function KnowledgeMap() {
  const navigate = useNavigate();
  const masteryBySkill = useLearnStore((s) => s.masteryBySkill);

  const masteryOf = useCallback(
    (id: string) => masteryBySkill[id]?.score ?? 0,
    [masteryBySkill],
  );

  // --- Bố cục (chỉ phụ thuộc đồ thị tĩnh → tính một lần) ---
  const layout = useMemo(() => {
    const layers = topoLayers();
    const order = new Map(SKILL_IDS.map((id, i) => [id, i] as const));
    const rows = layers.map((layer) =>
      [...layer].sort((a, b) => (order.get(a) ?? 0) - (order.get(b) ?? 0)),
    );
    let boardW = 0;
    for (const row of rows) {
      boardW = Math.max(boardW, row.length * NODE_W + (row.length - 1) * GAP_X);
    }
    const width = boardW + PAD_X * 2;
    const pos = new Map<string, { cx: number; cy: number }>();
    rows.forEach((row, d) => {
      const rowW = row.length * NODE_W + (row.length - 1) * GAP_X;
      const startX = (width - rowW) / 2;
      row.forEach((id, i) => {
        pos.set(id, {
          cx: startX + i * (NODE_W + GAP_X) + NODE_W / 2,
          cy: PAD_Y + d * ROW_GAP + NODE_H / 2,
        });
      });
    });
    const height = PAD_Y * 2 + (rows.length - 1) * ROW_GAP + NODE_H;
    return { pos, width, height };
  }, []);

  const edges = useMemo(
    () => PREREQ_EDGES.filter(([a, b]) => layout.pos.has(a) && layout.pos.has(b)),
    [layout],
  );

  // --- Ánh xạ skill → micro-lesson để "Học kỹ năng này" ---
  // Ưu tiên bài KHÁI NIỆM (mở đầu bằng phần trực quan), sau đó luyện tập/ôn tập.
  const lessonForSkill = useMemo(() => {
    const flat = flatMicroLessons();
    const map = new Map<string, string>();
    for (const kind of ['concept', 'practice', 'review'] as const) {
      for (const f of flat) {
        if (f.lesson.kind !== kind) continue;
        for (const sid of f.lesson.skillIds) if (!map.has(sid)) map.set(sid, f.lesson.id);
      }
    }
    return map;
  }, []);

  const stateOf = useCallback(
    (id: string): NodeState => {
      const score = masteryOf(id);
      if (score >= 0.8) return 'mastered';
      if (score >= MET) return 'learning';
      const hasUnmet = getPrereqs(id).some((p) => masteryOf(p) < MET);
      if (score <= 1e-6 && hasUnmet) return 'locked';
      return 'available';
    },
    [masteryOf],
  );

  const [selected, setSelected] = useState<string | null>(null);

  const highlight = useMemo(() => {
    if (!selected) return null;
    return {
      prereqs: new Set(getAllPrereqs(selected)),
      deps: new Set(getDependents(selected)),
    };
  }, [selected]);

  const edgeKind = useCallback(
    (a: string, b: string): 'prereq' | 'dependent' | 'dim' | 'base' => {
      if (!highlight || !selected) return 'base';
      const inChain = (id: string) => id === selected || highlight.prereqs.has(id);
      if (inChain(a) && inChain(b)) return 'prereq';
      if (a === selected && highlight.deps.has(b)) return 'dependent';
      return 'dim';
    },
    [highlight, selected],
  );

  const learn = useCallback(
    (id: string) => {
      const lessonId = lessonForSkill.get(id);
      navigate(lessonId ? `/learn/${lessonId}` : '/luyen');
    },
    [lessonForSkill, navigate],
  );

  const panel = selected ? (
    <NodePanel
      id={selected}
      state={stateOf(selected)}
      masteryOf={masteryOf}
      onClose={() => setSelected(null)}
      onJump={setSelected}
      onLearn={learn}
    />
  ) : null;

  return (
    <div className="kg-root">
      <div className="dl-context-col">
        <div className="kg-main">
          <div className="kg-legend" aria-hidden="true">
            {(Object.keys(STATE_LABEL) as NodeState[]).map((st) => (
              <span key={st} className="kg-legend-item">
                <span className={`kg-legend-dot kg-node--${st}`} />
                {STATE_LABEL[st]}
              </span>
            ))}
          </div>

          <div className="kg-board-wrap">
            <div
              className="kg-board"
              style={{ width: layout.width, height: layout.height }}
              onClick={() => setSelected(null)}
            >
              <svg
                className="kg-edges"
                width={layout.width}
                height={layout.height}
                aria-hidden="true"
              >
                {edges.map(([a, b]) => {
                  const pa = layout.pos.get(a)!;
                  const pb = layout.pos.get(b)!;
                  const x1 = pa.cx;
                  const y1 = pa.cy + NODE_H / 2;
                  const x2 = pb.cx;
                  const y2 = pb.cy - NODE_H / 2;
                  const my = (y1 + y2) / 2;
                  return (
                    <path
                      key={`${a}->${b}`}
                      className={`kg-edge kg-edge--${edgeKind(a, b)}`}
                      d={`M${x1},${y1} C${x1},${my} ${x2},${my} ${x2},${y2}`}
                    />
                  );
                })}
              </svg>

              {[...layout.pos.keys()].map((id) => {
                const p = layout.pos.get(id)!;
                const cls = ['kg-node', `kg-node--${stateOf(id)}`];
                if (selected === id) cls.push('is-selected');
                else if (highlight?.prereqs.has(id)) cls.push('is-prereq');
                else if (highlight?.deps.has(id)) cls.push('is-dependent');
                else if (highlight) cls.push('is-faded');
                return (
                  <button
                    key={id}
                    type="button"
                    className={cls.join(' ')}
                    style={{
                      left: p.cx - NODE_W / 2,
                      top: p.cy - NODE_H / 2,
                      width: NODE_W,
                      height: NODE_H,
                    }}
                    aria-pressed={selected === id}
                    title={SKILL_BY_ID[id]?.name ?? id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelected(id);
                    }}
                  >
                    <span className="kg-node-label">{shortLabel(id)}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <aside className="dl-context-aside kg-aside">
          {panel ?? (
            <div className="kg-aside-empty">
              <span className="kg-aside-empty-icon" aria-hidden="true">
                <GraduationCap size={22} strokeWidth={1.75} />
              </span>
              <p>Chọn một kỹ năng trên bản đồ để xem mức thành thạo, điều kiện tiên quyết và bắt đầu học.</p>
            </div>
          )}
        </aside>
      </div>

      {/* Mobile: bottom-sheet (aside bị ẩn dưới 1100px) */}
      {selected && (
        <>
          <div className="kg-sheet-scrim" onClick={() => setSelected(null)} aria-hidden="true" />
          <div className="kg-sheet" role="dialog" aria-label="Chi tiết kỹ năng">
            {panel}
          </div>
        </>
      )}
    </div>
  );
}

interface NodePanelProps {
  id: string;
  state: NodeState;
  masteryOf: (id: string) => number;
  onClose: () => void;
  onJump: (id: string) => void;
  onLearn: (id: string) => void;
}

function NodePanel({ id, state, masteryOf, onClose, onJump, onLearn }: NodePanelProps) {
  const skill = SKILL_BY_ID[id];
  const pct = Math.round(masteryOf(id) * 100);
  const prereqs = getPrereqs(id);

  return (
    <div className="kg-panel">
      <div className="kg-panel-head">
        <span className={`kg-badge kg-badge--${state}`}>
          {state === 'locked' && <Lock size={12} strokeWidth={2.25} />}
          {STATE_LABEL[state]}
        </span>
        <button type="button" className="kg-panel-close" onClick={onClose} aria-label="Đóng">
          <X size={18} strokeWidth={2} />
        </button>
      </div>

      <h3 className="kg-panel-title">{skill?.name ?? id}</h3>

      <div className="kg-mastery">
        <div className="kg-mastery-row">
          <span className="kg-mastery-lbl">Thành thạo</span>
          <span className="kg-mastery-val">{pct}%</span>
        </div>
        <div className="kg-mastery-track">
          <span className="kg-mastery-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {prereqs.length > 0 && (
        <div className="kg-prereqs">
          <span className="kg-prereqs-title">Cần nắm trước</span>
          <ul className="kg-prereq-list">
            {prereqs.map((p) => {
              const met = masteryOf(p) >= MET;
              return (
                <li key={p}>
                  <button
                    type="button"
                    className={`kg-prereq${met ? ' is-met' : ''}`}
                    onClick={() => onJump(p)}
                    title={`Tới: ${SKILL_BY_ID[p]?.name ?? p}`}
                  >
                    <span className="kg-prereq-mark" aria-hidden="true">
                      {met ? <Check size={15} strokeWidth={2.5} /> : <Circle size={15} strokeWidth={2} />}
                    </span>
                    <span className="kg-prereq-name">{shortLabel(p)}</span>
                    <ArrowRight size={14} strokeWidth={2} className="kg-prereq-go" />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <Button block className="kg-learn" onClick={() => onLearn(id)}>
        <GraduationCap size={17} strokeWidth={2} />
        Học kỹ năng này
      </Button>
    </div>
  );
}
