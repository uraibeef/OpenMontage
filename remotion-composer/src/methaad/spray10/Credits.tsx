import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { graphemes } from "../hooks/kit";
import { BLUSH, CHERRY, clamp, CREAM, FRAME, GOLD, INK, LEAF, S } from "./style";

/**
 * Beat 5 — "เพื่อนแบบนี้ หายากกว่าแฟนอีก".
 * THE END fades up in italic serif with the friend line under it, then the
 * end credits settle in over the real bottle: "ภาค: เพื่อนแท้", starring the
 * green bottle, and a quiet "ลด 45%".
 */

/** THE END: letters tracked wide then pulled in, a gold flourish draws under, the friend line fades up. */
export function TheEnd() {
  const frame = useCurrentFrame();
  const dim = interpolate(frame, [0, 8], [0, 0.55], clamp);
  const track = interpolate(frame, [0, 16], [60, 12], { ...clamp, easing: Easing.out(Easing.cubic) });
  const inT = interpolate(frame, [0, 10], [0, 1], clamp);
  const rule = interpolate(frame, [8, 20], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const line = graphemes("เพื่อนแบบนี้");
  const typed = interpolate(frame, [2, 14], [0, line.length], clamp);

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: INK, opacity: dim }} />
      <div style={{ position: "absolute", top: 700, width: 1080, textAlign: "center", fontFamily: S.end, fontStyle: "italic", fontWeight: 800, fontSize: 150, lineHeight: "200px", color: CREAM, letterSpacing: track, opacity: inT, textShadow: "0 8px 30px rgba(0,0,0,0.6)" }}>
        The End
      </div>
      <svg {...FRAME}>
        <path d="M 300 930 C 420 900, 480 960, 540 930 C 600 900, 660 960, 780 930" stroke={GOLD} strokeWidth={5} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - rule} />
      </svg>
      <div style={{ position: "absolute", top: 960, width: 1080, textAlign: "center", fontFamily: S.credits, fontWeight: 500, fontSize: 84, lineHeight: "150px", color: BLUSH, whiteSpace: "nowrap" }}>
        {line.map((ch, i) => (
          <span key={i} style={{ opacity: i < typed ? 1 : 0 }}>
            {ch}
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
}

interface CreditLine {
  at: number; // local frame it settles in
  text: string;
  font: string;
  size: number;
  color: string;
  weight?: number;
  y: number;
}

const LINES: readonly CreditLine[] = [
  { at: 0, text: "ภาค: เพื่อนแท้", font: S.part, size: 92, color: GOLD, y: 260 },
  { at: 4, text: "หายากกว่าแฟน", font: S.credits, size: 104, color: CREAM, weight: 700, y: 400 },
  { at: 12, text: "นำแสดงโดย", font: S.credits, size: 44, color: BLUSH, weight: 500, y: 1080 },
  { at: 14, text: "ขวดเขียว MAKE SENSE", font: S.credits, size: 74, color: LEAF, weight: 700, y: 1150 },
  { at: 17, text: "สเปรย์ฉีดก่อนจัดแต่งทรงผม", font: S.credits, size: 46, color: CREAM, weight: 500, y: 1250 },
];

/** End credits: each line rises into place like a roll that stops; a ticket stub stamps "ลด 45%". */
export function CreditsRoll() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const stamp = spring({ frame: frame - 22, fps, config: { damping: 10, stiffness: 220, mass: 0.6 } });

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: INK, opacity: interpolate(frame, [0, 6], [0.3, 0.5], clamp) }} />
      {LINES.map((l) => {
        const t = interpolate(frame, [l.at, l.at + 10], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
        return (
          <div
            key={l.text}
            style={{
              position: "absolute",
              top: l.y + (1 - t) * 160,
              width: 1080,
              textAlign: "center",
              fontFamily: l.font,
              fontWeight: l.weight ?? 400,
              fontSize: l.size,
              lineHeight: `${Math.round(l.size * 1.6)}px`,
              color: l.color,
              opacity: t,
              whiteSpace: "nowrap",
              textShadow: "0 6px 18px rgba(0,0,0,0.7)",
            }}
          >
            {l.text}
          </div>
        );
      })}
      <svg {...FRAME}>
        <g transform={`translate(700 1480) rotate(-6) scale(${stamp})`} opacity={stamp > 0.02 ? 1 : 0}>
          <path d="M -170 -62 H 170 A 20 20 0 0 0 170 -22 V 22 A 20 20 0 0 0 170 62 H -170 A 20 20 0 0 0 -170 22 V -22 A 20 20 0 0 0 -170 -62 Z" fill={CHERRY} stroke={CREAM} strokeWidth={5} />
          <path d="M -110 -62 V 62" stroke={CREAM} strokeWidth={3} strokeDasharray="8 8" />
          <text x={-140} y={12} textAnchor="middle" fontFamily={S.chrome} fontWeight={700} fontSize={26} fill={CREAM} transform="rotate(-90 -140 0)">
            TICKET
          </text>
          <text x={30} y={24} textAnchor="middle" fontFamily={S.credits} fontWeight={700} fontSize={70} fill={CREAM}>
            ลด 45%
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
}
