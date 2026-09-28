import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { graphemes, LayeredText } from "../hooks/kit";
import { clamp, INK, PAPER, RUST, SEPIA, T } from "./style";

/**
 * Beat 2 hooks — "หนึ่ง ผมตั้งขึ้นจากโคน ดูหนาขึ้น".
 * RiseWord: every letter of "ตั้งจากโคน" lies flat on a ruled baseline and
 * stands up from its foot, one after another, like roots lifting.
 * ThickWord: "ดูหนาขึ้น" — the ink outline swells, the word gets thicker.
 */

export function RiseWord({ y = 300 }: { y?: number }) {
  const frame = useCurrentFrame();
  const chars = graphemes("ตั้งจากโคน");
  const rule = interpolate(frame, [0, 6], [0, 1], clamp);
  const num = interpolate(frame, [0, 5], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 90, top: y - 40, fontFamily: T.fellItalic, fontSize: 190, color: RUST, lineHeight: "190px",
        opacity: num, transform: `scale(${0.6 + num * 0.4})`, transformOrigin: "0 100%", textShadow: `0 0 18px ${PAPER}, 0 0 4px ${PAPER}` }}>
        I.
      </div>
      <div style={{ position: "absolute", left: 90, right: 90, top: y + 170, height: 180, backgroundColor: "rgba(236,226,198,0.93)",
        transform: `scaleX(${rule})`, transformOrigin: "0 50%", boxShadow: "0 12px 30px rgba(20,14,6,0.35)" }} />
      <div style={{ position: "absolute", left: 120, right: 120, top: y + 330, height: 3, backgroundColor: SEPIA, transform: `scaleX(${rule})`, transformOrigin: "0 50%" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: y + 165, textAlign: "center", fontFamily: T.rise, fontWeight: 800, fontSize: 132, color: INK, lineHeight: "180px" }}>
        {chars.map((c, i) => {
          const p = interpolate(frame, [2 + i * 0.9, 7 + i * 0.9], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.6)) });
          return (
            <span key={i} style={{ display: "inline-block", transformOrigin: "0% 88%", transform: `rotate(${(1 - p) * 70}deg)`, opacity: Math.min(1, p * 3) }}>
              {c}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}

export function ThickWord({ y = 1560 }: { y?: number }) {
  const frame = useCurrentFrame();
  const grow = interpolate(frame, [2, 14], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const inP = interpolate(frame, [0, 4], [0, 1], clamp);
  const w = 2 + grow * 7;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: inP }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        <LayeredText
          text="ดูหนาขึ้น"
          y={y}
          size={150 + grow * 18}
          font={T.serif}
          weight={900}
          layers={[
            { stroke: "rgba(20,14,6,0.4)", width: 22 + grow * 22, dy: 10 },
            { stroke: PAPER, width: 18 + grow * 22 },
            { stroke: INK, width: w },
            { fill: INK },
          ]}
        />
        <g opacity={grow}>
          <line x1={960} x2={960} y1={y - 150 - grow * 10} y2={y + 30 + grow * 10} stroke={RUST} strokeWidth={4} />
          <line x1={945} x2={975} y1={y - 150 - grow * 10} y2={y - 150 - grow * 10} stroke={RUST} strokeWidth={4} />
          <line x1={945} x2={975} y1={y + 30 + grow * 10} y2={y + 30 + grow * 10} stroke={RUST} strokeWidth={4} />
          <text x={1000} y={y - 180} textAnchor="end" fontFamily={T.type} fontSize={30} fill={PAPER} stroke={INK} strokeWidth={6} paintOrder="stroke">
            +vol.
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
}
