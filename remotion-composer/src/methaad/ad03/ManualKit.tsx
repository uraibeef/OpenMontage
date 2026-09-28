import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { PaperGrain } from "../../fxkit";
import { Canvas, clamp, useIn } from "../hooks/kit";
import { about, INK, OK, PAPER, SIGNAL, T } from "./style";

/**
 * Shared instruction-manual chrome for the three full-frame diagram shots:
 * off-white page, black step block, numbered sub-panels, stroked ✗ / ✓ marks.
 * Only the chrome is shared; every page draws its own illustration.
 */

export const LINE_W = 7;

interface PageProps {
  step: number;
  title: string;
  sub?: string;
  subAt?: number;
  children: React.ReactNode;
}

export function ManualPage({ step, title, sub, subAt = 0, children }: PageProps) {
  const head = useIn(0, 6);
  const subIn = useIn(subAt, 6);
  return (
    <AbsoluteFill style={{ backgroundColor: PAPER }}>
      <Canvas>
        {/* crop marks + page furniture */}
        {[
          [40, 40, 1, 1],
          [1040, 40, -1, 1],
          [40, 1880, 1, -1],
          [1040, 1880, -1, -1],
        ].map(([x, y, sx, sy], k) => (
          <path key={k} d={`M ${x} ${y + sy * 40} V ${y} H ${x + sx * 40}`} stroke={INK} strokeWidth={3} fill="none" />
        ))}
        <g opacity={head} transform={`translate(${interpolate(head, [0, 1], [-40, 0])} 0)`}>
          <rect x={70} y={110} width={190} height={190} fill={INK} />
          <text x={165} y={265} textAnchor="middle" fontFamily={T.sign} fontWeight={800} fontSize={190} fill={PAPER}>
            {step}
          </text>
          <text x={295} y={215} fontFamily={T.manual} fontWeight={700} fontSize={120} fill={INK}>
            {title}
          </text>
          <line x1={295} x2={1010} y1={250} y2={250} stroke={INK} strokeWidth={5} />
        </g>
        {sub ? (
          <text x={295} y={300} fontFamily={T.manual} fontWeight={600} fontSize={52} fill={SIGNAL} opacity={subIn}>
            {sub}
          </text>
        ) : null}
        {children}
        <text x={70} y={1870} fontFamily={T.manual} fontWeight={600} fontSize={30} fill={INK} opacity={0.6}>
          MTH-03 · แป้งเซ็ตผม
        </text>
        <text x={1010} y={1870} textAnchor="end" fontFamily={T.manual} fontWeight={600} fontSize={30} fill={INK} opacity={0.6}>
          {`${step} / 3`}
        </text>
      </Canvas>
      <PaperGrain id={`manual-grain-${step}`} opacity={0.14} />
    </AbsoluteFill>
  );
}

/** Framed sub-panel with a circled number, scaling in at `at`. */
export function SubPanel({ x, y, w, h, n, at = 0, children }: { x: number; y: number; w: number; h: number; n: number; at?: number; children?: React.ReactNode }) {
  const frame = useCurrentFrame();
  const k = interpolate(frame, [at, at + 6], [0, 1], clamp);
  if (k <= 0) return null;
  return (
    <g opacity={k} transform={about(x + w / 2, y + h / 2, `scale(${0.94 + 0.06 * k})`)}>
      <rect x={x} y={y} width={w} height={h} fill="#FFFFFF" stroke={INK} strokeWidth={5} rx={6} />
      <circle cx={x + 52} cy={y + 52} r={34} fill="none" stroke={INK} strokeWidth={5} />
      <text x={x + 52} y={y + 70} textAnchor="middle" fontFamily={T.manual} fontWeight={700} fontSize={50} fill={INK}>
        {n}
      </text>
      {children}
    </g>
  );
}

/** Two-stroke cross; `p` 0→1 draws it. */
export function Cross({ cx, cy, r, p, width = 20 }: { cx: number; cy: number; r: number; p: number; width?: number }) {
  const a = interpolate(p, [0, 0.5], [0, 1], clamp);
  const b = interpolate(p, [0.5, 1], [0, 1], clamp);
  const len = r * 2.83;
  return (
    <g stroke={SIGNAL} strokeWidth={width} strokeLinecap="round" fill="none">
      <path d={`M ${cx - r} ${cy - r} L ${cx + r} ${cy + r}`} strokeDasharray={len} strokeDashoffset={len * (1 - a)} />
      <path d={`M ${cx + r} ${cy - r} L ${cx - r} ${cy + r}`} strokeDasharray={len} strokeDashoffset={len * (1 - b)} />
    </g>
  );
}

/** One-stroke tick; `p` 0→1 draws it. */
export function Tick({ cx, cy, r, p, width = 20, color = OK }: { cx: number; cy: number; r: number; p: number; width?: number; color?: string }) {
  const len = r * 3.2;
  return (
    <path
      d={`M ${cx - r} ${cy} L ${cx - r * 0.3} ${cy + r * 0.7} L ${cx + r} ${cy - r * 0.9}`}
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      strokeDasharray={len}
      strokeDashoffset={len * (1 - p)}
    />
  );
}
