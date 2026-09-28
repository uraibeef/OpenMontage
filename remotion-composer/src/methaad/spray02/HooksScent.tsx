import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { about, CEDAR, clamp, FRAME, hash, LEAF, MINT, S, WHITE, WOOD, WOOD_DK } from "./style";

/**
 * Beat 2 (reality starts): spray FIRST, then style — and the cedar scent,
 * drawn as a carved wood plank and a leafy aroma trail off the hair.
 */

/** Two step tabs: "ฉีด" lights up first, an arrow marked "ก่อน" runs to "จัดทรง". */
export function OrderTabs() {
  const frame = useCurrentFrame();
  const t1 = interpolate(frame, [0, 6], [-700, 0], { ...clamp, easing: Easing.out(Easing.back(1.4)) });
  const arrow = interpolate(frame, [6, 15], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const t2 = interpolate(frame, [13, 19], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
  const y = 1480;

  return (
    <AbsoluteFill>
      <svg {...FRAME}>
        {/* mist puffing off the first tab */}
        {Array.from({ length: 26 }, (_, i) => {
          const born = 3 + (i % 9);
          const t = (frame - born) / 12;
          if (t <= 0 || t >= 1) return null;
          const a = -1.2 + hash(i * 3.7) * 1.0;
          const d = 60 + t * (180 + hash(i) * 160);
          return <circle key={i} cx={260 + Math.cos(a) * d} cy={y - 90 + Math.sin(a) * d} r={4 + hash(i * 2) * 6} fill={WHITE} opacity={(1 - t) * 0.9} />;
        })}
        <g transform={`translate(${t1} 0)`}>
          <rect x={70} y={y - 110} width={330} height={170} rx={24} fill={CEDAR} stroke={WHITE} strokeWidth={6} />
          <circle cx={100} cy={y - 110} r={40} fill={WHITE} />
          <text x={100} y={y - 94} textAnchor="middle" fontFamily={S.order} fontWeight={700} fontSize={50} fill={CEDAR}>1</text>
          <text x={235} y={y + 12} textAnchor="middle" fontFamily={S.order} fontWeight={700} fontSize={120} fill={WHITE}>ฉีด</text>
        </g>
        <path d={`M 420 ${y - 25} H 560`} stroke={WHITE} strokeWidth={12} strokeLinecap="round" pathLength={1} strokeDasharray={`${arrow} 1`} />
        {arrow >= 1 ? <path d={`M 540 ${y - 55} L 580 ${y - 25} L 540 ${y + 5}`} stroke={WHITE} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" fill="none" /> : null}
        <text x={495} y={y - 60} textAnchor="middle" fontFamily={S.order} fontWeight={700} fontSize={58} fill={WHITE} opacity={arrow} stroke={CEDAR} strokeWidth={8} style={{ paintOrder: "stroke" }}>
          ก่อน
        </text>
        <g transform={about(800, y - 25, `scale(${t2})`)}>
          <rect x={600} y={y - 110} width={400} height={170} rx={24} fill="rgba(0,0,0,0.45)" stroke={WHITE} strokeWidth={6} strokeDasharray="18 12" />
          <circle cx={630} cy={y - 110} r={40} fill={WHITE} />
          <text x={630} y={y - 94} textAnchor="middle" fontFamily={S.order} fontWeight={700} fontSize={50} fill={CEDAR}>2</text>
          <text x={800} y={y + 8} textAnchor="middle" fontFamily={S.order} fontWeight={700} fontSize={100} fill={WHITE}>จัดทรง</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
}

const GRAIN = Array.from({ length: 9 }, (_, i) => i);

/** A cedar plank swings in with the scent carved into it: "หอมไม้ๆ". */
export function WoodPlank() {
  const frame = useCurrentFrame();
  const swing = interpolate(frame, [0, 8], [1, 0], { ...clamp, easing: Easing.out(Easing.back(1.8)) });
  const x = -900 * swing;
  const rot = -4 + 16 * swing;
  const y = 1330;

  return (
    <AbsoluteFill>
      <svg {...FRAME}>
        <defs>
          <clipPath id="s02-plank-clip">
            <rect x={90} y={y} width={900} height={250} rx={26} />
          </clipPath>
        </defs>
        <g transform={`translate(${x} 0) ${about(540, y + 125, `rotate(${rot})`)}`}>
          <rect x={98} y={y + 14} width={900} height={250} rx={26} fill="rgba(0,0,0,0.35)" />
          <rect x={90} y={y} width={900} height={250} rx={26} fill={WOOD} />
          <g clipPath="url(#s02-plank-clip)" stroke={WOOD_DK} fill="none" strokeLinecap="round">
            {GRAIN.map((i) => {
              const gy = y + 18 + i * 28;
              const bend = (hash(i * 3.1) - 0.5) * 40;
              return <path key={i} d={`M 60 ${gy} C 300 ${gy + bend}, 520 ${gy - bend}, 760 ${gy + bend * 0.6} S 1000 ${gy}, 1040 ${gy - 6}`} strokeWidth={2 + hash(i) * 3} opacity={0.45} />;
            })}
            {[0, 1, 2, 3].map((k) => (
              <ellipse key={k} cx={830} cy={y + 190} rx={22 + k * 20} ry={9 + k * 8} strokeWidth={3} opacity={0.55} />
            ))}
          </g>
          <rect x={90} y={y} width={900} height={250} rx={26} fill="none" stroke={WOOD_DK} strokeWidth={8} />
          {/* carved text: dark cut + light lower lip */}
          <text x={540} y={y + 172} textAnchor="middle" fontFamily={S.wood} fontWeight={800} fontSize={150} fill="rgba(255,236,200,0.55)">
            หอมไม้ๆ
          </text>
          <text x={540} y={y + 166} textAnchor="middle" fontFamily={S.wood} fontWeight={800} fontSize={150} fill={WOOD_DK}>
            หอมไม้ๆ
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
}

const TRAIL = "M 520 700 C 380 600, 420 470, 560 430 C 720 385, 760 300, 660 240 C 600 200, 660 120, 820 110";
const LEAVES = [
  [0.2, -40],
  [0.42, 30],
  [0.62, -25],
  [0.84, 40],
] as const;

/** Leaf aroma trail curling up off the sprayed hair, the notes written along it. */
export function AromaTrail() {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [0, 16], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const drift = Math.sin(frame / 6) * 8;
  const words = interpolate(frame, [8, 18], [0, 1], clamp);

  return (
    <AbsoluteFill>
      <svg {...FRAME}>
        <g transform={`translate(${drift} 0)`}>
          <path d={TRAIL} stroke={MINT} strokeOpacity={0.35} strokeWidth={110} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${draw} 1`} />
          <path d={TRAIL} stroke={WHITE} strokeWidth={10} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${draw} 1`} />
          <path d={TRAIL} stroke={LEAF} strokeWidth={4} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray="0.012 0.03" strokeDashoffset={-frame * 0.004} opacity={draw} />
          {LEAVES.map(([at, rot], i) => {
            const p = interpolate(draw, [at, Math.min(1, at + 0.12)], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2.5)) });
            if (p <= 0) return null;
            const pts: Record<number, [number, number]> = { 0: [430, 560], 1: [560, 430], 2: [720, 330], 3: [700, 170] };
            const [lx, ly] = pts[i];
            return (
              <g key={i} transform={`translate(${lx} ${ly}) rotate(${rot + Math.sin((frame + i * 7) / 5) * 8}) scale(${p * 1.5})`}>
                <path d="M 0 0 C 30 -46, 96 -46, 120 0 C 96 46, 30 46, 0 0 Z" fill={LEAF} stroke={CEDAR} strokeWidth={5} />
                <path d="M 6 0 H 110" stroke={CEDAR} strokeWidth={4} />
              </g>
            );
          })}
        </g>
        <g transform={about(330, 440, `scale(${0.8 + 0.2 * words}) rotate(-6)`)} opacity={words}>
          <text x={330} y={470} textAnchor="middle" fontFamily={S.script} fontWeight={700} fontSize={96} fill={WHITE} stroke={CEDAR} strokeWidth={14} style={{ paintOrder: "stroke" }}>
            ซีดาร์ + ชาเขียว
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
}
