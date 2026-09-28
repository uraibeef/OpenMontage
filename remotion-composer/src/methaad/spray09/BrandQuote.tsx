import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { clamp, usePop } from "../hooks/kit";
import { CAL_RED, CEDAR, INK, SOFT, T, WHITE } from "./style";

/** Drawn opening quote mark (two teardrop commas). */
function QuoteMark({ color }: { color: string }) {
  const one = "M 30 0 C 12 0 0 14 0 30 C 0 46 12 56 28 56 C 26 74 16 88 0 96 C 34 92 58 64 58 30 C 58 12 46 0 30 0 Z";
  return (
    <svg width={140} height={100} viewBox="0 0 140 100" style={{ position: "absolute", left: 44, top: -52 }}>
      <path d={one} fill={color} />
      <path d={one} fill={color} transform="translate(72 0)" />
    </svg>
  );
}

/**
 * The 16-hour line as the BRAND's words, not ours: a quote card with a
 * "แบรนด์บอกว่า" tab and a MAKE SENSE attribution, its tail pointing at the
 * name on the real bottle. "16" counts up when the VO says it; a small
 * "ลด 45%" tag tucks onto the corner at the end.
 */
export function BrandQuote({ countAt, tagAt }: { countAt: number; tagAt: number }) {
  const frame = useCurrentFrame();
  const pop = usePop(0, 12);
  const line = interpolate(frame, [7, 15], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const n = Math.round(interpolate(frame, [countAt, countAt + 8], [1, 16], { ...clamp, easing: Easing.out(Easing.cubic) }));
  const big = interpolate(frame, [countAt, countAt + 9], [0, 1], clamp);
  const tag = usePop(tagAt, 9);
  const attr = interpolate(frame, [countAt + 8, countAt + 14], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: 70,
          top: 1010,
          width: 940,
          height: 440,
          transform: `scale(${pop}) rotate(${-1.5 * pop}deg)`,
          transformOrigin: "50% 100%",
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: "#FBF8F1", borderRadius: 30, boxShadow: "0 24px 60px rgba(0,0,0,0.45)" }} />
        {/* speech tail pointing down at the bottle's name */}
        <svg width={120} height={80} style={{ position: "absolute", left: 420, top: 436 }}>
          <path d="M 0 0 L 120 0 L 40 70 Z" fill="#FBF8F1" />
        </svg>
        <QuoteMark color={CEDAR} />
        {/* tab */}
        <div style={{ position: "absolute", left: 200, top: -50, background: INK, color: WHITE, fontFamily: T.quote, fontWeight: 800, fontSize: 58, padding: "4px 34px 10px", borderRadius: 18 }}>
          แบรนด์บอกว่า
        </div>
        <div style={{ position: "absolute", left: 60, top: 64, fontFamily: T.quote, fontWeight: 600, fontSize: 70, color: INK, opacity: line, transform: `translateX(${(1 - line) * -30}px)` }}>
          อยู่ทรงได้นาน
        </div>
        <div style={{ position: "absolute", left: 52, top: 140, display: "flex", alignItems: "baseline", fontFamily: T.quote, fontWeight: 800, color: CEDAR, whiteSpace: "nowrap" }}>
          <span style={{ fontSize: 200, lineHeight: "230px", width: 250, display: "inline-block", opacity: big > 0 ? 1 : 0, transform: `scale(${0.8 + big * 0.2})`, transformOrigin: "0% 80%" }}>{n}</span>
          <span style={{ fontSize: 100, marginLeft: 12, opacity: big }}>ชั่วโมง</span>
        </div>
        <div style={{ position: "absolute", left: 60, bottom: 30, right: 60, display: "flex", alignItems: "center", gap: 18, opacity: attr }}>
          <div style={{ width: 60, height: 4, background: SOFT }} />
          <span style={{ fontFamily: T.ui, fontWeight: 700, fontSize: 42, color: INK, letterSpacing: 3 }}>MAKE SENSE</span>
          <span style={{ fontFamily: T.ui, fontWeight: 500, fontSize: 30, color: SOFT }}>(คำกล่าวอ้างของแบรนด์)</span>
        </div>
        {/* promo tag */}
        <div
          style={{
            position: "absolute",
            right: -18,
            top: -64,
            background: CAL_RED,
            color: WHITE,
            fontFamily: T.clock,
            fontWeight: 600,
            fontSize: 58,
            padding: "4px 26px 8px",
            borderRadius: 14,
            transform: `scale(${tag}) rotate(8deg)`,
            opacity: tag > 0.01 ? 1 : 0,
            boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
          }}
        >
          ลด 45%
        </div>
      </div>
    </AbsoluteFill>
  );
}
