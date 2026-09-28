import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { graphemes } from "../hooks/kit";
import { clamp, hash, INK, PAPER, RUST, T, WATER } from "./style";

/**
 * Beat 4 hooks — "สาม ไม่เหนียวเหนอะหนะ สระออกง่าย".
 * StretchSnap: "ไม่เหนียว" is pulled apart; gluey strands try to stretch
 * between the halves and snap clean, the halves spring back.
 * RinseWord: "สระออกง่าย" holds, then its letters are rinsed down the frame
 * with water drips, leaving the space clean.
 */

const SNAP = 10;

export function StretchSnap({ y = 470 }: { y?: number }) {
  const frame = useCurrentFrame();
  const inP = interpolate(frame, [0, 4], [0, 1], clamp);
  const pull = interpolate(frame, [2, SNAP, SNAP + 6], [0, 1, 0], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const gap = pull * 90;
  const snapped = frame >= SNAP;
  const recoil = interpolate(frame, [SNAP, SNAP + 5], [1, 0], clamp);
  const strand = (i: number) => {
    const sy = y - 70 + i * 34;
    const sag = 16 + i * 6;
    return `M ${540 - gap} ${sy} Q 540 ${sy + sag} ${540 + gap} ${sy}`;
  };
  const style = (dx: number): React.CSSProperties => ({
    display: "inline-block",
    transform: `translateX(${dx}px)`,
  });
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: inP }}>
      <div style={{ position: "absolute", left: 70, right: 70, top: y - 200, height: 270, backgroundColor: PAPER, opacity: 0.92,
        transform: "rotate(1.2deg)", boxShadow: "0 12px 30px rgba(20,14,6,0.35)" }} />
      <div style={{ position: "absolute", left: 100, top: y - 190, fontFamily: T.fellItalic, fontSize: 64, color: RUST }}>III.</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: y - 170, textAlign: "center", fontFamily: T.ornate, fontWeight: 700,
        fontSize: 150, color: INK, lineHeight: "220px", whiteSpace: "nowrap" }}>
        <span style={style(-gap)}>ไม่</span>
        <span style={style(gap)}>เหนียว</span>
      </div>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        {!snapped
          ? [0, 1, 2].map((i) => <path key={i} d={strand(i)} fill="none" stroke="#B89A5A" strokeWidth={3} opacity={0.9} />)
          : [0, 1, 2].map((i) => (
              <g key={i} opacity={recoil}>
                <path d={`M ${450 - i * 6} ${y - 70 + i * 34} l -30 ${-10 + i * 10}`} stroke={RUST} strokeWidth={4} strokeLinecap="round" />
                <path d={`M ${630 + i * 6} ${y - 70 + i * 34} l 30 ${-10 + i * 10}`} stroke={RUST} strokeWidth={4} strokeLinecap="round" />
              </g>
            ))}
      </svg>
    </AbsoluteFill>
  );
}

const WASH = 17;

export function RinseWord({ y = 1520 }: { y?: number }) {
  const frame = useCurrentFrame();
  const chars = graphemes("สระออกง่าย");
  const inP = interpolate(frame, [0, 5], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: y - 150, textAlign: "center", fontFamily: T.serif, fontWeight: 500,
        fontSize: 138, lineHeight: "200px", color: PAPER, whiteSpace: "nowrap",
        textShadow: `0 0 3px ${INK}, 0 4px 18px rgba(10,20,26,0.8)`, opacity: inP, transform: `translateY(${(1 - inP) * -30}px)` }}>
        {chars.map((c, i) => {
          const t = Math.max(0, frame - WASH - hash(i + 20) * 5);
          const dy = t * t * 2.2;
          const o = interpolate(t, [0, 9], [1, 0], clamp);
          return (
            <span key={i} style={{ display: "inline-block", transform: `translateY(${dy}px) scaleY(${1 + t * 0.04})`, opacity: o }}>
              {c}
            </span>
          );
        })}
      </div>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: 9 }, (_, i) => {
          const x = 180 + i * 90 + hash(i) * 30;
          const start = 3 + hash(i + 5) * 12;
          const t = frame - start;
          if (t < 0) return null;
          const dy = y - 260 + t * t * 1.6 + t * 10;
          return (
            <path key={i} d={`M ${x} ${dy - 22} C ${x + 9} ${dy - 6} ${x + 11} ${dy + 4} ${x} ${dy + 10} C ${x - 11} ${dy + 4} ${x - 9} ${dy - 6} ${x} ${dy - 22} Z`}
              fill={WATER} stroke="#E8F2F4" strokeWidth={2} opacity={0.85} />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
}
