import { interpolate, useCurrentFrame } from "remotion";
import { Canvas, clamp } from "../hooks/kit";
import { CEDAR, clockAt, FPS, MINT, T, WHITE } from "./style";

const Y0 = 1752;
const X_LEFT = 356;
const X_RIGHT = 1004;
const HIGH = Y0 + 34;
const FLAT = Y0 + 82;
const TICKS: readonly [string, number][] = [
  ["07", 7],
  ["12", 12],
  ["15", 15],
  ["18", 18],
];

const xOfHour = (h: number) => X_LEFT + ((h - 7) / 11) * (X_RIGHT - X_LEFT);

/** Tiny wobble so the "holding" line reads as live data, never dipping toward flat. */
const lineY = (x: number) => HIGH + Math.sin(x * 0.045) * 3 + Math.sin(x * 0.013 + 1.3) * 4;

/**
 * Hair "status" line pinned under the day: a live chart from 07 to 18 whose
 * line stays up at "อยู่ทรง" the whole way, far above the dashed "แบน" floor.
 */
export function StatusLine() {
  const frame = useCurrentFrame();
  const sec = frame / FPS;
  const show = interpolate(sec, [0.3, 0.6, 8.2, 8.4], [0, 1, 1, 0], clamp);
  if (show <= 0) return null;
  const headX = xOfHour(clockAt(sec) / 60);
  const pts: string[] = [];
  for (let x = X_LEFT; x <= headX; x += 8) pts.push(`${x},${lineY(x).toFixed(1)}`);
  pts.push(`${headX},${lineY(headX).toFixed(1)}`);
  const pulse = 1 + (Math.sin(frame * 0.5) + 1) * 0.35;
  return (
    <Canvas>
      <g opacity={show} transform={`translate(0 ${(1 - show) * 40})`}>
        <rect x={36} y={Y0} width={1008} height={118} rx={30} fill="rgba(10,14,22,0.74)" stroke="rgba(255,255,255,0.14)" strokeWidth={2} />
        {/* drawn hair tuft that stands the whole day */}
        <g transform={`translate(96 ${Y0 + 86})`} stroke={MINT} strokeWidth={8} strokeLinecap="round" fill="none">
          <path d="M -18 0 Q -24 -34 -8 -58" />
          <path d="M 0 0 Q 2 -40 14 -64" />
          <path d="M 16 0 Q 26 -30 36 -46" />
        </g>
        <text x={150} y={Y0 + 50} fontFamily={T.ui} fontWeight={500} fontSize={30} fill="rgba(255,255,255,0.7)">
          สถานะผม
        </text>
        <text x={150} y={Y0 + 96} fontFamily={T.ui} fontWeight={700} fontSize={40} fill={MINT}>
          อยู่ทรง
        </text>
        <line x1={X_LEFT} y1={FLAT} x2={X_RIGHT} y2={FLAT} stroke="rgba(255,255,255,0.3)" strokeWidth={3} strokeDasharray="10 10" />
        <text x={X_RIGHT - 8} y={FLAT - 10} textAnchor="end" fontFamily={T.ui} fontWeight={500} fontSize={22} fill="rgba(255,255,255,0.45)">
          แบน
        </text>
        {TICKS.map(([label, h]) => {
          const x = xOfHour(h);
          const lit = headX >= x - 1;
          return (
            <g key={label}>
              <line x1={x} y1={Y0 + 14} x2={x} y2={FLAT + 6} stroke={WHITE} strokeOpacity={lit ? 0.35 : 0.12} strokeWidth={2} />
              <text x={x} y={Y0 + 112} textAnchor="middle" fontFamily={T.clock} fontWeight={600} fontSize={20} fill={lit ? WHITE : "rgba(255,255,255,0.35)"}>
                {label}
              </text>
            </g>
          );
        })}
        <polyline points={pts.join(" ")} fill="none" stroke={CEDAR} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
        <polyline points={pts.join(" ")} fill="none" stroke={MINT} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={headX} cy={lineY(headX)} r={10 * pulse} fill={MINT} opacity={0.3} />
        <circle cx={headX} cy={lineY(headX)} r={9} fill={WHITE} stroke={MINT} strokeWidth={4} />
      </g>
    </Canvas>
  );
}
