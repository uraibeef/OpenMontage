import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { graphemes } from "../hooks/kit";
import { about, CEDAR, CHERRY, clamp, CREAM, FRAME, GOLD, INK, LEAF, S, WHITE } from "./style";

/**
 * Beat 3 — "สองนาทีในห้องน้ำ ผมตั้งขึ้นมาใหม่".
 * A drawn restroom door sign swings on its chain, a 2:00 clock is finger-
 * written into the fogged mirror and races down to 0:00, and "ตั้งใหม่"
 * stands up letter by letter like the hair.
 */

/** Hanging restroom sign: swings in on a chain and settles (damped pendulum). */
export function RestroomSign() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const drop = spring({ frame, fps, config: { damping: 14, stiffness: 180, mass: 0.7 } });
  const swing = 16 * Math.exp(-frame / 9) * Math.cos(frame / 2.6);
  const px = 830;
  const py = 150;

  return (
    <AbsoluteFill style={{ transform: `translateY(${(1 - drop) * -420}px)` }}>
      <svg {...FRAME}>
        <g transform={about(px, py, `rotate(${swing})`)}>
          <path d={`M ${px} ${py} L ${px - 90} ${py + 110} M ${px} ${py} L ${px + 90} ${py + 110}`} stroke={GOLD} strokeWidth={5} />
          <circle cx={px} cy={py} r={9} fill={GOLD} />
          <rect x={px - 150} y={py + 110} width={300} height={330} rx={26} fill={CEDAR} stroke={CREAM} strokeWidth={6} style={{ filter: "drop-shadow(0 14px 22px rgba(0,0,0,0.45))" }} />
          <rect x={px - 132} y={py + 128} width={264} height={294} rx={18} fill="none" stroke={LEAF} strokeWidth={3} />
          {/* pictogram man */}
          <circle cx={px} cy={py + 185} r={30} fill={CREAM} />
          <path d={`M ${px - 44} ${py + 225} H ${px + 44} L ${px + 36} ${py + 305} H ${px + 20} L ${px + 16} ${py + 370} H ${px - 16} L ${px - 20} ${py + 305} H ${px - 36} Z`} fill={CREAM} />
          <text x={px} y={py + 412} textAnchor="middle" fontFamily={S.sign} fontWeight={700} fontSize={38} fill={CREAM} letterSpacing={2}>
            ห้องน้ำ
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
}

const TOTAL = 120; // seconds on the movie clock

/** Fogged-mirror patch with the countdown finger-written in it. `dur` = frames until 0:00. */
export function MirrorClock({ dur }: { dur: number }) {
  const frame = useCurrentFrame();
  const fog = interpolate(frame, [0, 6], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const left = Math.max(0, Math.round(TOTAL * (1 - frame / dur)));
  const done = left === 0;
  const label = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`;
  const trace = interpolate(frame, [0, 8], [0, 1], clamp);
  const pulse = done ? 1 + 0.08 * Math.sin(frame / 1.5) : 1;

  return (
    <AbsoluteFill>
      <svg {...FRAME}>
        <defs>
          <filter id="s10-fog" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation={14} />
          </filter>
        </defs>
        <ellipse cx={250} cy={300} rx={220 * fog} ry={120 * fog} fill={WHITE} opacity={0.55} filter="url(#s10-fog)" />
        {/* drip lines under the written digits */}
        {[140, 230, 330].map((x, i) => (
          <path key={x} d={`M ${x} 360 v ${40 * trace + i * 12}`} stroke={WHITE} strokeWidth={5} strokeLinecap="round" opacity={0.6 * fog} />
        ))}
      </svg>
      <div
        style={{
          position: "absolute",
          top: 190,
          left: 40,
          width: 420,
          textAlign: "center",
          fontFamily: S.clock,
          fontWeight: 800,
          fontSize: 160,
          lineHeight: "220px",
          color: done ? CHERRY : "rgba(40,48,52,0.82)",
          letterSpacing: 4,
          clipPath: `inset(0 ${(1 - trace) * 100}% 0 0)`,
          transform: `scale(${pulse})`,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {label}
      </div>
    </AbsoluteFill>
  );
}

/** "ตั้งใหม่": each letter springs up from a flat line, with hair strands flicking up above it. */
export function StandUp() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chars = graphemes("ตั้งใหม่");
  const strands = interpolate(frame, [8, 18], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });

  return (
    <AbsoluteFill>
      <svg {...FRAME}>
        <path d="M 520 700 H 1030" stroke={INK} strokeWidth={10} strokeLinecap="round" opacity={0.8} />
        {Array.from({ length: 9 }, (_, i) => {
          const x = 560 + i * 55;
          const h = (50 + (i % 3) * 22) * strands;
          return <path key={i} d={`M ${x} 520 q ${(i % 2 ? 10 : -10)} ${-h / 2} ${i % 2 ? 4 : -4} ${-h}`} stroke={GOLD} strokeWidth={7} strokeLinecap="round" fill="none" />;
        })}
      </svg>
      <div style={{ position: "absolute", top: 510, left: 520, width: 520, display: "flex", justifyContent: "center", fontFamily: S.rise, fontWeight: 900, fontSize: 132, lineHeight: "190px", whiteSpace: "nowrap" }}>
        {chars.map((ch, i) => {
          const s = spring({ frame: frame - i * 2, fps, config: { damping: 8, stiffness: 220, mass: 0.6 } });
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                color: CREAM,
                transformOrigin: "50% 100%",
                transform: `scaleY(${Math.max(0.02, s)})`,
                WebkitTextStroke: `9px ${INK}`,
                paintOrder: "stroke fill",
              }}
            >
              {ch}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}
