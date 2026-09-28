import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { graphemes } from "../hooks/kit";
import { CARD_SHADOW, clamp, INK, MANILA, PAPER, RUST, SEPIA, T } from "./style";

/**
 * Beat 1 hooks — "สามอย่าง ที่สเปรย์ขวดเขียวทำได้".
 * IndexCover: a field-guide cover label swings down, "สามอย่าง" is
 * letter-pressed in, then three specimen pins I · II · III are pushed in.
 * SpecimenTag: a manila specimen tag tied to the bottle, "ขวดเขียว".
 */

export const PIN_AT = [9, 14, 19];

export function IndexCover({ y = 190 }: { y?: number }) {
  const frame = useCurrentFrame();
  const drop = interpolate(frame, [0, 9], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.4)) });
  const swing = Math.sin(frame * 0.5) * 3 * Math.exp(-frame / 10);
  const chars = graphemes("สามอย่าง");
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: 110,
          width: 860,
          top: y,
          padding: "30px 40px 38px",
          backgroundColor: PAPER,
          border: `3px double ${SEPIA}`,
          boxShadow: CARD_SHADOW,
          transformOrigin: "50% 0%",
          transform: `translateY(${(drop - 1) * 420}px) rotate(${swing - 1.5}deg)`,
          textAlign: "center",
        }}
      >
        <div style={{ fontFamily: T.fellSC, fontSize: 36, letterSpacing: 8, color: SEPIA }}>A Field Guide to</div>
        <div style={{ fontFamily: T.cover, fontSize: 158, color: INK, lineHeight: "220px" }}>
          {chars.map((c, i) => {
            const p = interpolate(frame, [3 + i * 0.8, 6 + i * 0.8], [0, 1], clamp);
            return (
              <span key={i} style={{ display: "inline-block", opacity: p, transform: `scale(${1.5 - p * 0.5})`, filter: `blur(${(1 - p) * 4}px)` }}>
                {c}
              </span>
            );
          })}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 70, marginTop: 6 }}>
          {["I", "II", "III"].map((r, i) => {
            const p = interpolate(frame, [PIN_AT[i], PIN_AT[i] + 4], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
            return (
              <div key={r} style={{ position: "relative", width: 140, height: 90, opacity: p, transform: `translateY(${(1 - p) * -40}px) scale(${0.6 + p * 0.4})` }}>
                <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `2.5px solid ${RUST}`, backgroundColor: MANILA }} />
                <div style={{ position: "absolute", inset: 0, fontFamily: T.fell, fontSize: 56, color: RUST, lineHeight: "90px" }}>{r}</div>
                <div style={{ position: "absolute", left: 62, top: -14, width: 16, height: 16, borderRadius: 8, backgroundColor: INK, boxShadow: "0 4px 4px rgba(0,0,0,0.4)" }} />
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
}

/** Manila specimen tag tied by a string to the bottle. */
export function SpecimenTag({ x = 100, y = 1240, tieX = 640, tieY = 900 }: { x?: number; y?: number; tieX?: number; tieY?: number }) {
  const frame = useCurrentFrame();
  const inP = interpolate(frame, [0, 8], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const string = interpolate(frame, [2, 10], [0, 1], clamp);
  const word = interpolate(frame, [3, 8], [0, 1], clamp);
  const swing = Math.sin(frame * 0.45 + 1) * 4 * Math.exp(-frame / 14);
  const holeX = x + 525;
  const holeY = y + 60;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        <path d={`M ${holeX} ${holeY} Q ${(holeX + tieX) / 2 + 40} ${(holeY + tieY) / 2 + 90} ${tieX} ${tieY}`} fill="none"
          stroke="#F1E6C8" strokeWidth={5} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - string} />
        <circle cx={tieX} cy={tieY} r={9} fill={RUST} opacity={string} />
      </svg>
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: 580,
          height: 360,
          backgroundColor: MANILA,
          clipPath: "polygon(0 0, 86% 0, 100% 20%, 100% 80%, 86% 100%, 0 100%)",
          boxShadow: CARD_SHADOW,
          opacity: inP,
          transformOrigin: "90% 20%",
          transform: `translateX(${(1 - inP) * -300}px) rotate(${swing - 4}deg)`,
          padding: "24px 34px",
          boxSizing: "border-box",
        }}
      >
        <div style={{ position: "absolute", left: 506, top: 60, width: 34, height: 34, borderRadius: 17, border: `5px solid #B08D57`, backgroundColor: "rgba(0,0,0,0.25)" }} />
        <div style={{ fontFamily: T.type, fontSize: 30, color: RUST }}>SPECIMEN Nº 06</div>
        <div style={{ fontFamily: T.hand, fontWeight: 700, fontSize: 132, color: INK, lineHeight: "170px", opacity: word }}>ขวดเขียว</div>
        <div style={{ fontFamily: T.fellItalic, fontSize: 40, color: SEPIA, opacity: word }}>Lagena viridis · 100 ml</div>
      </div>
    </AbsoluteFill>
  );
}
