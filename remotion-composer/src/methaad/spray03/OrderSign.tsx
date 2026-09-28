import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Canvas, clamp } from "../hooks/kit";
import { about, CEDAR, CREAM, INK, T, TOMATO } from "./style";

const W = 400;
const ROW_H = 132;

interface OrderSignProps {
  tickAt: number;
  moveAt: number;
  row2At: number;
  crossAt: number;
}

/** Hand-drawn check stroke inside a box centred at (cx, cy). */
function Check({ cx, cy, p }: { cx: number; cy: number; p: number }) {
  return (
    <path
      d={`M ${cx - 34} ${cy + 2} L ${cx - 8} ${cy + 30} L ${cx + 40} ${cy - 36}`}
      stroke={CEDAR}
      strokeWidth={16}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - p}
    />
  );
}

function Cross({ cx, cy, p }: { cx: number; cy: number; p: number }) {
  const a = interpolate(p, [0, 0.5], [0, 1], clamp);
  const b = interpolate(p, [0.5, 1], [0, 1], clamp);
  return (
    <g stroke={TOMATO} strokeWidth={16} strokeLinecap="round">
      <line x1={cx - 32} y1={cy - 32} x2={cx - 32 + 64 * a} y2={cy - 32 + 64 * a} />
      <line x1={cx + 32} y1={cy - 32} x2={cx + 32 - 64 * b} y2={cy - 32 + 64 * b} />
    </g>
  );
}

/**
 * Beat 2 — a hanging enamel kitchen sign "ฉีด: ก่อน ✓ / หลัง ✗". It hangs top-left
 * beside the root spray, then swings over to the empty wall on the bottle shot,
 * where the "หลัง" plate drops down and gets crossed out.
 */
export function OrderSign({ tickAt, moveAt, row2At, crossAt }: OrderSignProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 10, stiffness: 170, mass: 0.7 } });
  const move = interpolate(frame, [moveAt, moveAt + 6], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const x = interpolate(move, [0, 1], [40, 560]);
  const y = interpolate(move, [0, 1], [150, 250]) + interpolate(enter, [0, 1], [-600, 0]);
  const sc = interpolate(move, [0, 1], [0.8, 1.2]);
  const jolt = (at: number) => (frame >= at ? Math.sin((frame - at) * 0.8) * 7 * Math.exp(-(frame - at) / 7) : 0);
  const swing = Math.sin(frame * 0.35) * 5 * Math.exp(-frame / 12) + jolt(tickAt) + jolt(moveAt) + jolt(crossAt);
  const tick = interpolate(frame, [tickAt, tickAt + 6], [0, 1], clamp);
  const row2 = spring({ frame: frame - row2At, fps, config: { damping: 9, stiffness: 220, mass: 0.5 } });
  const cross = interpolate(frame, [crossAt, crossAt + 6], [0, 1], clamp);
  const strike = interpolate(frame, [crossAt + 3, crossAt + 8], [0, 1], clamp);
  const boardH = 96 + ROW_H + ROW_H * row2;

  return (
    <Canvas>
      <g transform={`translate(${x} ${y}) scale(${sc})`}>
        <g transform={about(W / 2, -120, `rotate(${swing})`)}>
          <g stroke={INK} strokeWidth={5}>
            <line x1={W / 2} y1={-120} x2={70} y2={0} />
            <line x1={W / 2} y1={-120} x2={W - 70} y2={0} />
          </g>
          <circle cx={W / 2} cy={-120} r={10} fill={INK} />
          <rect x={10} y={12} width={W} height={boardH} rx={22} fill={INK} />
          <rect x={0} y={0} width={W} height={boardH} rx={22} fill={CREAM} stroke={CEDAR} strokeWidth={12} />
          <path d={`M 6 22 a 16 16 0 0 1 16 -16 H ${W - 22} a 16 16 0 0 1 16 16 V 92 H 6 Z`} fill={CEDAR} />
          <text x={W / 2} y={72} textAnchor="middle" fontFamily={T.stamp} fontSize={54} fill={CREAM}>
            ฉีด
          </text>
          {/* row 1: ก่อน ✓ */}
          <text x={34} y={96 + 96} fontFamily={T.stamp} fontSize={80} fill={INK}>
            ก่อน
          </text>
          <rect x={W - 124} y={96 + 22} width={96} height={88} rx={10} fill="none" stroke={INK} strokeWidth={6} />
          <Check cx={W - 76} cy={96 + 66} p={tick} />
          {/* row 2: หลัง ✗ — a plate that drops down on its hinge */}
          <g transform={`translate(0 ${96 + ROW_H}) scale(1 ${row2})`} opacity={row2 > 0.05 ? 1 : 0}>
            <line x1={24} x2={W - 24} y1={0} y2={0} stroke={CEDAR} strokeWidth={4} strokeDasharray="10 10" />
            <text x={34} y={96} fontFamily={T.stamp} fontSize={80} fill={INK} opacity={1 - strike * 0.45}>
              หลัง
            </text>
            <line x1={26} x2={26 + 210 * strike} y1={64} y2={60} stroke={TOMATO} strokeWidth={12} strokeLinecap="round" />
            <rect x={W - 124} y={22} width={96} height={88} rx={10} fill="none" stroke={INK} strokeWidth={6} />
            <Cross cx={W - 76} cy={66} p={cross} />
          </g>
        </g>
      </g>
    </Canvas>
  );
}
