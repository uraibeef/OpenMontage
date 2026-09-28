import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { about, ALERT, clamp, hash, INK, PAPER, R, WATER } from "./style";

/**
 * Beats 3-5: the rush. "อาบน้ำ" fills with water like a tank, "แต่งตัว"
 * swings in on a clothes-hanger tag, and "เหลือ 2 นาที" strobes on a red
 * alert slab while the HUD takes the stage.
 */

/** Hollow word that fills with rising water; bubbles escape the surface. */
export function WaterWord() {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 5], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
  const level = interpolate(frame, [3, 30], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const top = 1440;
  const bottom = 1640;
  const surface = bottom + 20 - level * (bottom - top + 60);
  const wave = Array.from({ length: 23 }, (_, i) => {
    const x = i * 50;
    return `${x},${surface + Math.sin(i * 0.9 + frame * 0.5) * 12}`;
  }).join(" L ");
  const word = (
    <text x={540} y={1610} textAnchor="middle" fontFamily={R.water} fontWeight={700} fontSize={190}>
      อาบน้ำ
    </text>
  );

  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <clipPath id="r10-water-clip">{word}</clipPath>
        </defs>
        <g transform={about(540, 1540, `scale(${enter})`)}>
          <g fill="rgba(8,20,36,0.55)" stroke="#FFFFFF" strokeWidth={10} strokeLinejoin="round" style={{ paintOrder: "stroke" }}>
            {word}
          </g>
          <g clipPath="url(#r10-water-clip)">
            <path d={`M 0 ${surface} L ${wave} L 1100 1900 L 0 1900 Z`} fill={WATER} />
            <path d={`M 0 ${surface + 26} L 1100 ${surface + 26} L 1100 1900 L 0 1900 Z`} fill="#1E7FD0" opacity={0.5} />
          </g>
          {Array.from({ length: 9 }, (_, i) => {
            const born = 6 + i * 3;
            const t = frame - born;
            if (t < 0 || t > 12) return null;
            const bx = 250 + hash(i * 7) * 580;
            return <circle key={i} cx={bx + Math.sin(t) * 6} cy={surface - t * 9} r={6 + hash(i) * 9} fill="none" stroke="#FFFFFF" strokeWidth={4} opacity={1 - t / 12} />;
          })}
          <g transform="translate(540 1745) rotate(-3)">
            <rect x={-150} y={-52} width={300} height={84} rx={42} fill={WATER} stroke="#FFFFFF" strokeWidth={5} />
            <text y={14} textAnchor="middle" fontFamily={R.water} fontWeight={700} fontSize={56} fill="#FFFFFF">
              5 นาที
            </text>
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
}

/** A wire hanger drops in and swings; its card tag reads "แต่งตัว 3 นาที". */
export function HangerTag() {
  const frame = useCurrentFrame();
  const drop = interpolate(frame, [0, 6], [-700, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const swing = Math.sin(frame * 0.42) * 14 * Math.exp(-frame / 22);
  const px = 760;
  const py = 1180 + drop;

  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        <g transform={about(px, py, `rotate(${swing})`)}>
          {/* wire hanger */}
          <path
            d={`M ${px} ${py + 70} C ${px} ${py + 30}, ${px - 36} ${py + 26}, ${px - 36} ${py - 10} C ${px - 36} ${py - 46}, ${px + 30} ${py - 46}, ${px + 30} ${py - 12}`}
            fill="none"
            stroke="#D9DDE3"
            strokeWidth={10}
            strokeLinecap="round"
          />
          <path d={`M ${px} ${py + 70} L ${px - 250} ${py + 200} L ${px + 250} ${py + 200} Z`} fill="none" stroke="#D9DDE3" strokeWidth={11} strokeLinejoin="round" />
          {/* string + card tag */}
          <line x1={px + 120} y1={py + 200} x2={px + 60} y2={py + 270} stroke={INK} strokeWidth={4} />
          <g transform={about(px + 60, py + 270, "rotate(-6)")}>
            <path d={`M ${px - 210} ${py + 290} L ${px + 230} ${py + 290} L ${px + 230} ${py + 520} L ${px - 210} ${py + 520} L ${px - 250} ${py + 405} Z`} fill="rgba(0,0,0,0.35)" transform="translate(10 12)" />
            <path d={`M ${px - 210} ${py + 290} L ${px + 230} ${py + 290} L ${px + 230} ${py + 520} L ${px - 210} ${py + 520} L ${px - 250} ${py + 405} Z`} fill={PAPER} />
            <circle cx={px - 196} cy={py + 405} r={14} fill="none" stroke={INK} strokeWidth={4} />
            <text x={px + 20} y={py + 405} textAnchor="middle" fontFamily={R.print} fontWeight={700} fontSize={104} fill={INK}>
              แต่งตัว
            </text>
            <line x1={px - 150} y1={py + 432} x2={px + 200} y2={py + 432} stroke={INK} strokeWidth={3} strokeDasharray="10 8" />
            <text x={px + 20} y={py + 500} textAnchor="middle" fontFamily={R.print} fontWeight={500} fontSize={58} fill={ALERT} letterSpacing={2}>
              3 นาที
            </text>
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
}

/** Red alert slab strobing above the big HUD: "เหลือ 2 นาที". */
export function AlertSlab() {
  const frame = useCurrentFrame();
  const inv = Math.floor(frame / 3) % 2 === 1;
  const enter = interpolate(frame, [0, 4], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2.5)) });
  const y = 1150;
  const bg = inv ? "#FFFFFF" : ALERT;
  const fg = inv ? ALERT : "#FFFFFF";

  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        <g transform={about(540, y, `scale(${enter}) skewX(-10)`)}>
          <rect x={140} y={y - 78} width={800} height={150} fill="rgba(0,0,0,0.35)" transform="translate(10 12)" />
          <rect x={140} y={y - 78} width={800} height={150} fill={bg} />
          <text x={540} y={y + 36} textAnchor="middle" fontFamily={R.alert} fontStyle="italic" fontWeight={900} fontSize={112} fill={fg}>
            เหลือ 2 นาที
          </text>
          {[0, 1, 2].map((i) => {
            const on = (Math.floor(frame / 2) + i) % 3 === 0;
            return (
              <g key={i} opacity={on ? 1 : 0.3} fill={ALERT}>
                <polygon points={`${60 + i * 26},${y - 40} ${84 + i * 26},${y} ${60 + i * 26},${y + 40} ${48 + i * 26},${y + 40} ${72 + i * 26},${y} ${48 + i * 26},${y - 40}`} />
                <polygon points={`${1020 - i * 26},${y - 40} ${996 - i * 26},${y} ${1020 - i * 26},${y + 40} ${1032 - i * 26},${y + 40} ${1008 - i * 26},${y} ${1032 - i * 26},${y - 40}`} />
              </g>
            );
          })}
        </g>
      </svg>
    </AbsoluteFill>
  );
}
