import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { about, CHERRY, clamp, CREAM, FRAME, GOLD, INK, LIFT, MONITOR, ROSE, S } from "./style";

/**
 * Beat 1 — "ไปเดตครั้งแรก ผมดันแบนตั้งแต่ลงรถ".
 * The film opens: a script title "เดตแรก" writes itself on with a heart that
 * draws its own outline; then a bedside heart monitor races (first-date
 * nerves) and flatlines right on "แบน".
 */

const HEART = "M 0 30 C -10 5, -48 5, -48 -22 C -48 -48, -12 -52, 0 -26 C 12 -52, 48 -48, 48 -22 C 48 5, 10 5, 0 30 Z";

/** Film-title card: the title is revealed by a moving pen nib, a heart strokes on beside it. */
export function TitleCard() {
  const frame = useCurrentFrame();
  const write = interpolate(frame, [2, 16], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const heart = interpolate(frame, [10, 22], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const beat = 1 + 0.12 * Math.max(0, Math.sin((frame - 22) / 2.2)) * (frame > 22 ? 1 : 0);
  const rule = interpolate(frame, [12, 24], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const drift = interpolate(frame, [0, 28], [0, -14], clamp);
  const left = 150;
  const width = 780;

  return (
    <AbsoluteFill style={{ transform: `translateY(${drift}px)` }}>
      <svg {...FRAME}>
        {/* thin gold rules framing the title, like an old-Hollywood card */}
        <path d={`M ${540 - 330 * rule} 1238 H ${540 + 330 * rule}`} stroke={GOLD} strokeWidth={4} />
        <path d={`M ${540 - 250 * rule} 1528 H ${540 + 250 * rule}`} stroke={GOLD} strokeWidth={4} />
        <text x={540} y={1286} textAnchor="middle" fontFamily={S.chrome} fontWeight={600} fontSize={34} letterSpacing={10} fill={CREAM} opacity={rule} style={{ textShadow: LIFT }}>
          A LOVE STORY
        </text>
        <g transform={about(880, 1330, `scale(${heart * beat})`)} opacity={heart > 0 ? 1 : 0}>
          <path d={HEART} transform="translate(880 1330)" fill={CHERRY} fillOpacity={heart} stroke={CREAM} strokeWidth={6} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - heart} />
        </g>
      </svg>
      <div
        style={{
          position: "absolute",
          top: 1290,
          left,
          width,
          textAlign: "center",
          fontFamily: S.title,
          fontWeight: 700,
          fontSize: 210,
          lineHeight: "260px",
          color: CREAM,
          WebkitTextStroke: `10px ${CHERRY}`,
          paintOrder: "stroke fill",
          clipPath: `inset(-40px ${(1 - write) * 100}% -60px -40px)`,
          textShadow: "0 10px 30px rgba(0,0,0,0.45)",
        }}
      >
        เดตแรก
      </div>
      {/* the pen nib that "writes" it */}
      <svg {...FRAME} opacity={write > 0 && write < 1 ? 1 : 0}>
        <g transform={`translate(${left + width * write} 1420) rotate(28)`}>
          <path d="M 0 0 L -14 -70 L 14 -70 Z" fill={GOLD} stroke={INK} strokeWidth={4} />
          <circle cx={0} cy={-42} r={5} fill={INK} />
        </g>
      </svg>
    </AbsoluteFill>
  );
}

const PANEL = { x: 70, y: 1400, w: 940, h: 300 } as const;
const SPEED = 46; // px per frame the sweep head travels
const TRACE_W = PANEL.w - 80;
const BASE = PANEL.y + 190;

/** Nervous fast ECG until `flatAt` (local frame), then a dead flat line. */
function ecg(t: number, flatAt: number) {
  if (t < 0) return null;
  if (t >= flatAt) return 0;
  const p = (t % 6) / 6;
  if (p < 0.12) return -18 * (p / 0.12);
  if (p < 0.22) return -18 + 150 * ((p - 0.12) / 0.1);
  if (p < 0.3) return 132 - 200 * ((p - 0.22) / 0.08);
  if (p < 0.38) return -68 + 68 * ((p - 0.3) / 0.08);
  return 0;
}

/** Bedside monitor: the trace sweeps, races, then flatlines on "แบน"; the readout turns red. */
export function FlatMonitor({ flatAt }: { flatAt: number }) {
  const frame = useCurrentFrame();
  const inT = interpolate(frame, [0, 5], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.6)) });
  const head = (frame * SPEED) % TRACE_W;
  const dead = frame >= flatAt;
  const pts: string[] = [];
  for (let x = 0; x <= TRACE_W; x += 6) {
    if (Math.abs(x - head) < 30 && x > head) continue; // erase gap ahead of the head
    const lag = x <= head ? (head - x) / SPEED : (head + TRACE_W - x) / SPEED;
    const v = ecg(frame - lag, flatAt);
    if (v === null) continue;
    pts.push(`${PANEL.x + 40 + x},${BASE - v}`);
  }
  const color = dead ? CHERRY : MONITOR;
  const blink = dead && frame % 8 < 5;

  return (
    <AbsoluteFill style={{ transform: `translateY(${(1 - inT) * 340}px)` }}>
      <svg {...FRAME}>
        <rect x={PANEL.x} y={PANEL.y} width={PANEL.w} height={PANEL.h} rx={26} fill="#0B1411" fillOpacity={0.88} stroke={dead ? CHERRY : "#2C4A3C"} strokeWidth={5} />
        {Array.from({ length: 16 }, (_, i) => (
          <path key={i} d={`M ${PANEL.x + 40 + i * 58} ${PANEL.y + 80} V ${PANEL.y + PANEL.h - 20}`} stroke="#1D3329" strokeWidth={2} />
        ))}
        <text x={PANEL.x + 40} y={PANEL.y + 62} fontFamily={S.chrome} fontWeight={700} fontSize={40} fill={MONITOR} letterSpacing={3}>
          ใจ
        </text>
        <text x={PANEL.x + 110} y={PANEL.y + 62} fontFamily={S.chrome} fontWeight={600} fontSize={34} fill={MONITOR} opacity={0.75}>
          {dead ? "—" : `${128 + (frame % 5)} BPM`}
        </text>
        <text x={PANEL.x + PANEL.w - 40} y={PANEL.y + 66} textAnchor="end" fontFamily={S.chrome} fontWeight={700} fontSize={50} fill={dead ? CHERRY : MONITOR} opacity={dead ? (blink ? 1 : 0.35) : 0.85}>
          {dead ? "ผม: แบน" : "ผม: ..."}
        </text>
        <polyline points={pts.join(" ")} fill="none" stroke={color} strokeWidth={8} strokeLinejoin="round" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 10px ${color})` }} />
        <circle cx={PANEL.x + 40 + head} cy={BASE - (ecg(frame, flatAt) ?? 0)} r={10} fill={CREAM} />
        {dead && <rect x={PANEL.x} y={PANEL.y} width={PANEL.w} height={PANEL.h} rx={26} fill={ROSE} opacity={frame - flatAt < 3 ? 0.25 : 0} />}
      </svg>
    </AbsoluteFill>
  );
}
