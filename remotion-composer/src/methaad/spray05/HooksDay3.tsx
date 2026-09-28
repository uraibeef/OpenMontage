import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Canvas, clamp } from "../hooks/kit";
import { about, ALARM, arc, CARBON, CEDAR, CHALK, LIME, MINT, PANEL, RING_OFF, T } from "./style";

const GX = 560;
const GY = 1330;
const GR = 280;
/** Gauge sweep in degrees (0 = straight up). */
const LO = -90;
const HI = 90;
const SWEET: readonly [number, number] = [-22, 22];

/**
 * Day 3 — "รู้ละว่าฉีดพอดีๆ": a dose gauge. The needle starts pinned in the red
 * "เยอะ" zone (day 1's mistake), swings back, wobbles and settles in the lime
 * sweet spot; at "พอดี" a medal pops out of the hub and its padlock springs open.
 */
export function DoseGauge({ settleAt }: { settleAt: number }) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 13, stiffness: 200, mass: 0.6 } });
  const exit = interpolate(frame, [durationInFrames - 5, durationInFrames], [1, 0], clamp);
  const swing = spring({ frame: frame - 2, fps, config: { damping: 6, stiffness: 120, mass: 0.7 } });
  const needle = 78 + (4 - 78) * swing;
  const medal = spring({ frame: frame - settleAt, fps, config: { damping: 9, stiffness: 230, mass: 0.6 } });
  const shackle = interpolate(frame, [settleAt + 5, settleAt + 10], [0, 1], { ...clamp, easing: Easing.out(Easing.back(3)) });
  const glow = interpolate(frame, [settleAt, settleAt + 4, settleAt + 14], [0, 1, 0.35], clamp);
  const zone = (a0: number, a1: number, color: string, w = 46) => (
    <path d={arc(GX, GY, GR, a0, a1)} fill="none" stroke={color} strokeWidth={w} strokeLinecap="butt" />
  );
  const rad = ((needle - 90) * Math.PI) / 180;

  return (
    <Canvas>
      <g transform={about(GX, GY, `scale(${enter * exit})`)}>
        <path d={`${arc(GX, GY, GR + 64, LO - 6, HI + 6)} L ${GX + GR + 64} ${GY + 70} L ${GX - GR - 64} ${GY + 70} Z`} fill={PANEL} />
        {zone(LO, SWEET[0] - 2, RING_OFF)}
        {zone(SWEET[1] + 2, HI, ALARM)}
        {zone(SWEET[0], SWEET[1], LIME, 46 + glow * 20)}
        {Array.from({ length: 13 }, (_, i) => {
          const a = LO + (i * (HI - LO)) / 12;
          const r1 = GR - 36;
          const r2 = r1 - (i % 3 === 0 ? 30 : 14);
          const ar = ((a - 90) * Math.PI) / 180;
          return <line key={i} x1={GX + Math.cos(ar) * r1} y1={GY + Math.sin(ar) * r1} x2={GX + Math.cos(ar) * r2} y2={GY + Math.sin(ar) * r2} stroke={CHALK} strokeWidth={i % 3 === 0 ? 6 : 3} opacity={0.75} />;
        })}
        <text x={GX - GR - 10} y={GY + 52} textAnchor="middle" fontFamily={T.medal} fontWeight={600} fontSize={40} fill="rgba(243,246,238,0.6)">
          น้อย
        </text>
        <text x={GX + GR + 10} y={GY + 52} textAnchor="middle" fontFamily={T.medal} fontWeight={600} fontSize={40} fill={ALARM}>
          เยอะ
        </text>
        <line x1={GX} y1={GY} x2={GX + Math.cos(rad) * (GR - 50)} y2={GY + Math.sin(rad) * (GR - 50)} stroke={CHALK} strokeWidth={14} strokeLinecap="round" />
        <circle cx={GX} cy={GY} r={26} fill={CHALK} />
        {/* unlocked medal */}
        {medal > 0.01 ? (
          <g transform={about(GX, GY - 150, `scale(${medal}) rotate(${(1 - medal) * -30})`)}>
            <path d={`M ${GX - 70} ${GY - 110} L ${GX - 100} ${GY + 10} L ${GX - 60} ${GY - 10} L ${GX - 30} ${GY + 20} L ${GX - 10} ${GY - 100} Z`} fill={CEDAR} />
            <path d={`M ${GX + 70} ${GY - 110} L ${GX + 100} ${GY + 10} L ${GX + 60} ${GY - 10} L ${GX + 30} ${GY + 20} L ${GX + 10} ${GY - 100} Z`} fill={CEDAR} />
            <circle cx={GX} cy={GY - 170} r={128} fill={LIME} stroke={CARBON} strokeWidth={10} />
            <circle cx={GX} cy={GY - 170} r={106} fill="none" stroke={CARBON} strokeWidth={4} strokeDasharray="6 10" />
            <text x={GX} y={GY - 138} textAnchor="middle" fontFamily={T.medal} fontWeight={700} fontSize={96} fill={CARBON}>
              พอดี
            </text>
            {/* padlock on the rim, shackle flips open */}
            <g transform={`translate(${GX + 96} ${GY - 276})`}>
              <path d={`M -22 0 V -26 A 22 22 0 0 1 22 -26 V ${-shackle * 30}`} fill="none" stroke={CARBON} strokeWidth={11} strokeLinecap="round" transform={`translate(${shackle * 18} ${-shackle * 16}) rotate(${shackle * 28})`} />
              <rect x={-36} y={-4} width={72} height={58} rx={12} fill={MINT} stroke={CARBON} strokeWidth={7} />
              <circle cx={0} cy={22} r={7} fill={CARBON} />
            </g>
          </g>
        ) : null}
      </g>
    </Canvas>
  );
}

const ROWS = ["ฉีดพอดี", "จัดทรง"] as const;

/** Day 3b — "แล้วค่อยจัดทรง": the app's to-do card; the second box ticks with a drawn check. */
export function StyleCheck({ checkAt }: { checkAt: number }) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const slide = spring({ frame, fps, config: { damping: 14, stiffness: 200, mass: 0.6 } });
  const exit = interpolate(frame, [durationInFrames - 5, durationInFrames], [0, 1], clamp);
  const x0 = 604 + (1 - slide) * 520 + exit * 520;
  return (
    <Canvas>
      <g transform={`translate(${x0 - 604} 0)`}>
        <rect x={604} y={300} width={440} height={250} rx={34} fill={PANEL} />
        {ROWS.map((label, i) => {
          const y = 360 + i * 110;
          const at = i === 0 ? 2 : checkAt;
          const draw = interpolate(frame, [at, at + 6], [0, 1], clamp);
          const strike = interpolate(frame, [at + 5, at + 11], [0, 1], clamp);
          const done = draw > 0;
          return (
            <g key={label}>
              <rect x={640} y={y} width={68} height={68} rx={16} fill={done ? LIME : "none"} stroke={done ? LIME : CHALK} strokeWidth={6} />
              <path d={`M ${652} ${y + 36} L ${668} ${y + 52} L ${698} ${y + 16}`} fill="none" stroke={CARBON} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
              <text x={734} y={y + 54} fontFamily={T.hudUp} fontWeight={800} fontSize={i === 1 ? 64 : 50} fill={i === 1 ? CHALK : "rgba(243,246,238,0.6)"}>
                {label}
              </text>
              <line x1={730} y1={y + 34} x2={730 + strike * (i === 1 ? 210 : 190)} y2={y + 34} stroke={i === 1 ? LIME : "rgba(243,246,238,0.6)"} strokeWidth={6} strokeLinecap="round" opacity={i === 0 ? 1 : 0} />
            </g>
          );
        })}
      </g>
    </Canvas>
  );
}
