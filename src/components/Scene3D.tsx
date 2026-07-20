import { useRef, useState, type ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html, Line, Grid } from '@react-three/drei';
import * as THREE from 'three';
import { identity, lerpMat, type Mat } from '../lib/linalg';

type Vec3 = [number, number, number];

export interface Scene3DProps {
  height?: number;
  vectors?: { id: string; v: Vec3; color?: string; label?: string }[];
  points?: { p: Vec3; color?: string; label?: string }[];
  planes?: { normal: Vec3; d?: number; color?: string; opacity?: number }[];
  spanPlanes?: { u: Vec3; v: Vec3; color?: string; opacity?: number }[];
  lines3?: { from: Vec3; to: Vec3; color?: string; dashed?: boolean }[];
  matrix?: Mat;
  transformElements?: boolean;
  showGrid?: boolean;
  showAxes?: boolean;
  children?: ReactNode;
}

const ID3: Mat = identity(3);

function apply3(m: Mat, v: Vec3): Vec3 {
  return [
    m[0][0] * v[0] + m[0][1] * v[1] + m[0][2] * v[2],
    m[1][0] * v[0] + m[1][1] * v[1] + m[1][2] * v[2],
    m[2][0] * v[0] + m[2][1] * v[1] + m[2][2] * v[2],
  ];
}

// Hook animation ma trận, gọi invalidate để render theo demand
function useAnimatedMatrix(target: Mat): Mat {
  const { invalidate } = useThree();
  const [mat, setMat] = useState<Mat>(target);
  const fromRef = useRef<Mat>(target);
  const startRef = useRef<number>(0);
  const animatingRef = useRef(false);
  const targetKey = JSON.stringify(target);
  const lastKey = useRef(targetKey);

  if (targetKey !== lastKey.current) {
    lastKey.current = targetKey;
    fromRef.current = mat;
    startRef.current = performance.now();
    animatingRef.current = true;
    invalidate();
  }

  useFrame(() => {
    if (!animatingRef.current) return;
    const t = Math.min(1, (performance.now() - startRef.current) / 600);
    const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    setMat(lerpMat(fromRef.current, target, e));
    if (t >= 1) {
      animatingRef.current = false;
      setMat(target);
    } else {
      invalidate();
    }
  });

  return mat;
}

function Arrow({ v, color, label }: { v: Vec3; color: string; label?: string }) {
  const dir = new THREE.Vector3(...v);
  const len = dir.length();
  if (len < 1e-6) return null;
  const ndir = dir.clone().normalize();
  const quat = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    ndir
  );
  const shaftLen = Math.max(0.001, len - 0.28);
  const mid = ndir.clone().multiplyScalar(shaftLen / 2);
  const conePos = ndir.clone().multiplyScalar(shaftLen + 0.14);
  return (
    <group>
      <mesh position={[mid.x, mid.y, mid.z]} quaternion={quat}>
        <cylinderGeometry args={[0.028, 0.028, shaftLen, 12]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[conePos.x, conePos.y, conePos.z]} quaternion={quat}>
        <coneGeometry args={[0.09, 0.28, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {label && (
        <Html position={[dir.x * 1.05, dir.y * 1.05, dir.z * 1.05]} center>
          <div
            style={{
              color,
              fontSize: 13,
              fontWeight: 600,
              pointerEvents: 'none',
              textShadow: '0 0 4px #000',
            }}
          >
            {label}
          </div>
        </Html>
      )}
    </group>
  );
}

function PlaneMesh({
  normal,
  d = 0,
  color = '#38bdf8',
  opacity = 0.25,
}: {
  normal: Vec3;
  d?: number;
  color?: string;
  opacity?: number;
}) {
  const n = new THREE.Vector3(...normal).normalize();
  const quat = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 0, 1),
    n
  );
  const nlen = new THREE.Vector3(...normal).length();
  const dist = nlen > 1e-6 ? d / nlen : 0;
  const pos = n.clone().multiplyScalar(dist);
  return (
    <mesh position={[pos.x, pos.y, pos.z]} quaternion={quat}>
      <planeGeometry args={[8, 8]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function SpanPlane({
  u,
  v,
  color = '#22c55e',
  opacity = 0.25,
}: {
  u: Vec3;
  v: Vec3;
  color?: string;
  opacity?: number;
}) {
  const uv = new THREE.Vector3(...u);
  const vv = new THREE.Vector3(...v);
  const n = new THREE.Vector3().crossVectors(uv, vv);
  if (n.length() < 1e-6) return null;
  return <PlaneMesh normal={[n.x, n.y, n.z]} d={0} color={color} opacity={opacity} />;
}

function Axes() {
  const L = 4;
  return (
    <group>
      <Line points={[[-L, 0, 0], [L, 0, 0]]} color="#f97316" lineWidth={1.5} />
      <Line points={[[0, -L, 0], [0, L, 0]]} color="#22c55e" lineWidth={1.5} />
      <Line points={[[0, 0, -L], [0, 0, L]]} color="#4f9cf9" lineWidth={1.5} />
      <Html position={[L + 0.2, 0, 0]} center>
        <div style={{ color: '#f97316', fontWeight: 700, pointerEvents: 'none' }}>x</div>
      </Html>
      <Html position={[0, L + 0.2, 0]} center>
        <div style={{ color: '#22c55e', fontWeight: 700, pointerEvents: 'none' }}>y</div>
      </Html>
      <Html position={[0, 0, L + 0.2]} center>
        <div style={{ color: '#4f9cf9', fontWeight: 700, pointerEvents: 'none' }}>z</div>
      </Html>
    </group>
  );
}

function SceneContent(props: Scene3DProps) {
  const {
    vectors = [],
    points = [],
    planes = [],
    spanPlanes = [],
    lines3 = [],
    matrix,
    transformElements = true,
    showGrid = true,
    showAxes = true,
    children,
  } = props;

  const animMat = useAnimatedMatrix(matrix ?? ID3);
  const tf = (v: Vec3): Vec3 => (transformElements ? apply3(animMat, v) : v);

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 8, 5]} intensity={0.8} />
      <directionalLight position={[-5, -3, -5]} intensity={0.25} />

      {showGrid && (
        <Grid
          args={[16, 16]}
          cellSize={1}
          cellThickness={0.6}
          cellColor="#2c3242"
          sectionSize={4}
          sectionThickness={1}
          sectionColor="#3a4560"
          fadeDistance={22}
          fadeStrength={1}
          infiniteGrid={false}
          position={[0, 0, 0]}
        />
      )}
      {showAxes && <Axes />}

      {planes.map((pl, i) => (
        <PlaneMesh
          key={`pl${i}`}
          normal={pl.normal}
          d={pl.d}
          color={pl.color}
          opacity={pl.opacity}
        />
      ))}
      {spanPlanes.map((sp, i) => (
        <SpanPlane key={`sp${i}`} u={sp.u} v={sp.v} color={sp.color} opacity={sp.opacity} />
      ))}

      {lines3.map((ln, i) => (
        <Line
          key={`ln${i}`}
          points={[tf(ln.from), tf(ln.to)]}
          color={ln.color ?? '#9aa4b6'}
          lineWidth={2}
          dashed={ln.dashed}
          dashSize={0.2}
          gapSize={0.15}
        />
      ))}

      {vectors.map((vec) => (
        <Arrow
          key={vec.id}
          v={tf(vec.v)}
          color={vec.color ?? '#4f9cf9'}
          label={vec.label}
        />
      ))}

      {points.map((pt, i) => {
        const p = tf(pt.p);
        return (
          <group key={`pt${i}`}>
            <mesh position={p}>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshStandardMaterial color={pt.color ?? '#e879f9'} />
            </mesh>
            {pt.label && (
              <Html position={[p[0], p[1] + 0.2, p[2]]} center>
                <div
                  style={{
                    color: pt.color ?? '#e879f9',
                    fontSize: 12,
                    pointerEvents: 'none',
                    textShadow: '0 0 4px #000',
                  }}
                >
                  {pt.label}
                </div>
              </Html>
            )}
          </group>
        );
      })}

      {children}

      <OrbitControls makeDefault enableDamping />
    </>
  );
}

export default function Scene3D(props: Scene3DProps) {
  const { height = 420 } = props;
  return (
    <div className="scene3d-wrap" style={{ height }}>
      <Canvas
        frameloop="demand"
        camera={{ position: [4.5, 3.5, 4.5], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <SceneContent {...props} />
      </Canvas>
    </div>
  );
}
