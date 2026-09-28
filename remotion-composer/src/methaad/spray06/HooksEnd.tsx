import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { CARD_SHADOW, clamp, INK, MANILA, PAPER, RUST, SEPIA, T } from "./style";

/**
 * Beats 5-6 hooks.
 * AppendixTab: a rust index tab slides out of the page edge — "แถม".
 * ScentCurl: "หอมแบบผู้ชายๆ" rides along an inked scent waft as it curls up.
 * NowStamp: a rubber date-stamp slams "ตอนนี้".
 * MuseumTag: a manila exhibit tag on a string swings in — "ลด 45%".
 */

export function AppendixTab({ y = 1320 }: { y?: number }) {
  const frame = useCurrentFrame();
  const slide = interpolate(frame, [0, 7], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.3)) });
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", right: 0, top: y, width: 500, height: 250, backgroundColor: RUST, borderRadius: "28px 0 0 28px",
        boxShadow: CARD_SHADOW, transform: `translateX(${(1 - slide) * 520}px)`, padding: "22px 40px", boxSizing: "border-box" }}>
        <div style={{ fontFamily: T.fellSC, fontSize: 34, letterSpacing: 8, color: MANILA }}>Appendix</div>
        <div style={{ fontFamily: T.note, fontSize: 118, color: PAPER, lineHeight: "150px" }}>แถม +</div>
      </div>
    </AbsoluteFill>
  );
}

const WAFT = "M 150 640 C 260 520 420 640 520 540 C 610 450 540 360 640 330 C 760 290 860 380 930 300";

export function ScentCurl() {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [0, 10], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const ride = interpolate(frame, [2, 14], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const waft = (dy: number, w: number, o: number) => (
    <path d={WAFT} transform={`translate(0 ${dy})`} fill="none" stroke={PAPER} strokeWidth={w} strokeLinecap="round" opacity={o}
      pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
  );
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <path id="sp06-waft" d={WAFT} transform="translate(0 -20)" />
        </defs>
        {waft(70, 3, 0.7)}
        {waft(110, 2, 0.5)}
        <text fontFamily={T.hand} fontWeight={700} fontSize={106} fill={PAPER} stroke={INK} strokeWidth={11} paintOrder="stroke" strokeLinejoin="round">
          <textPath href="#sp06-waft" startOffset={`${(1 - ride) * 40}%`} opacity={ride}>
            หอมแบบผู้ชายๆ
          </textPath>
        </text>
      </svg>
    </AbsoluteFill>
  );
}

export function NowStamp({ x = 540, y = 1470 }: { x?: number; y?: number }) {
  const frame = useCurrentFrame();
  const slam = interpolate(frame, [0, 4], [1.7, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const o = interpolate(frame, [0, 3], [0, 1], clamp);
  const bounce = frame >= 4 ? Math.sin((frame - 4) * 1.2) * 0.03 * Math.exp(-(frame - 4) / 4) : 0;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="sp06-stamp-ink">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={1} seed={4} result="n" />
            <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.2 1.55" result="m" />
            <feComposite in="SourceGraphic" in2="m" operator="in" />
          </filter>
          <path id="sp06-stamp-arc" d={`M ${x - 190} ${y} A 190 190 0 0 1 ${x + 190} ${y}`} />
        </defs>
        <g transform={`translate(${x} ${y}) rotate(-11) scale(${slam + bounce}) translate(${-x} ${-y})`} opacity={o} filter="url(#sp06-stamp-ink)">
          <circle cx={x} cy={y} r={235} fill="rgba(236,226,198,0.9)" />
          <circle cx={x} cy={y} r={228} fill="none" stroke={RUST} strokeWidth={10} />
          <circle cx={x} cy={y} r={150} fill="none" stroke={RUST} strokeWidth={4} />
          <text fontFamily={T.fellSC} fontSize={44} letterSpacing={10} fill={RUST}>
            <textPath href="#sp06-stamp-arc" startOffset="50%" textAnchor="middle">hodie · now</textPath>
          </text>
          <text x={x} y={y + 40} textAnchor="middle" fontFamily={T.cover} fontSize={112} fill={RUST}>ตอนนี้</text>
          <text x={x} y={y + 196} textAnchor="middle" fontFamily={T.type} fontSize={30} fill={RUST}>MMXXVI</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
}

export function MuseumTag({ numberAt = 4 }: { numberAt?: number }) {
  const frame = useCurrentFrame();
  const drop = interpolate(frame, [0, 8], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.2)) });
  const swing = Math.sin(frame * 0.32) * 9 * Math.exp(-frame / 16);
  const num = interpolate(frame, [numberAt, numberAt + 6], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2.2)) });
  const plaque = interpolate(frame, [8, 16], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const pivotX = 760;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: pivotX - 300, top: 0, width: 600, height: 1300, transformOrigin: "50% 0%",
        transform: `translateY(${(drop - 1) * 900}px) rotate(${swing}deg)` }}>
        <div style={{ position: "absolute", left: 298, top: 0, width: 4, height: 300, backgroundColor: "#EDE2C4", boxShadow: "0 0 3px rgba(0,0,0,0.5)" }} />
        <div style={{ position: "absolute", left: 60, top: 290, width: 480, height: 720, backgroundColor: MANILA, boxShadow: CARD_SHADOW,
          clipPath: "polygon(18% 0, 82% 0, 100% 12%, 100% 100%, 0 100%, 0 12%)", textAlign: "center", paddingTop: 70, boxSizing: "border-box" }}>
          <div style={{ position: "absolute", left: 222, top: 26, width: 40, height: 40, borderRadius: 18, border: "6px solid #B08D57", backgroundColor: "rgba(0,0,0,0.3)" }} />
          <div style={{ fontFamily: T.fellSC, fontSize: 38, letterSpacing: 6, color: SEPIA }}>Exhibit Nº 06</div>
          <div style={{ height: 2, backgroundColor: SEPIA, margin: "14px 50px" }} />
          <div style={{ fontFamily: T.cover, fontSize: 140, color: INK, lineHeight: "190px" }}>ลด</div>
          <div style={{ fontFamily: T.cover, fontSize: 190, color: RUST, lineHeight: "250px", transform: `scale(${num})`, opacity: num > 0 ? 1 : 0 }}>
            45<span style={{ fontSize: 110 }}>%</span>
          </div>
          <div style={{ fontFamily: T.type, fontSize: 30, color: SEPIA, marginTop: 10 }}>Lagena viridis</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 90, bottom: 150, width: 560, padding: "20px 30px", boxSizing: "border-box",
        background: "linear-gradient(135deg, #D9BE84, #A9854B 60%, #D2B478)", border: "3px solid #7A5B2C", boxShadow: CARD_SHADOW,
        opacity: plaque, transform: `translateY(${(1 - plaque) * 60}px)` }}>
        <div style={{ fontFamily: T.fellSC, fontSize: 38, letterSpacing: 6, color: "#2E2010" }}>Make Sense</div>
        <div style={{ fontFamily: T.fellItalic, fontSize: 30, color: "#3B2A14" }}>pre-styling fluffy water · 100 ml</div>
      </div>
    </AbsoluteFill>
  );
}
