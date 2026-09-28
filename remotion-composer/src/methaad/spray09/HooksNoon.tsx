import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { clamp, graphemes, usePop } from "../hooks/kit";
import { HEAT, HEAT_HOT, INK, T, WHITE } from "./style";

const CARD: React.CSSProperties = {
  position: "absolute",
  left: 52,
  top: 1452,
  width: 976,
  height: 262,
  borderRadius: 50,
  backfaceVisibility: "hidden",
  overflow: "hidden",
  boxShadow: "0 18px 40px rgba(0,0,0,0.3)",
};

/** Drawn blazing sun icon with heat squiggles. */
function HotSun({ frame }: { frame: number }) {
  return (
    <svg width={190} height={190} viewBox="-95 -95 190 190" style={{ position: "absolute", left: 34, top: 36 }}>
      <g transform={`rotate(${frame * 3})`}>
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i / 8) * Math.PI * 2;
          return <line key={i} x1={Math.cos(a) * 50} y1={Math.sin(a) * 50} x2={Math.cos(a) * 80} y2={Math.sin(a) * 80} stroke="#FFF3B0" strokeWidth={11} strokeLinecap="round" />;
        })}
      </g>
      <circle r={40} fill="#FFE35C" stroke="#FFF7D0" strokeWidth={6} />
    </svg>
  );
}

/** Heat shimmer wobble for the glyphs. */
const shimmer = (frame: number, i: number) => Math.sin(frame * 0.7 + i * 0.9) * 3;

/**
 * Weather widget: "แดดร้อน" with the temperature climbing to 36°. When the VO
 * reaches "หัวยังไม่เยิ้ม" the widget flips to its back: a drawn oil drop falls,
 * hits the heat and evaporates into steam while "ไม่เยิ้ม" stamps in.
 */
export function WeatherCard({ hotAt, flipAt }: { hotAt: number; flipAt: number }) {
  const frame = useCurrentFrame();
  const pop = usePop(0, 12);
  const temp = Math.round(interpolate(frame, [hotAt, hotAt + 12], [29, 36], { ...clamp, easing: Easing.out(Easing.cubic) }));
  const hot = interpolate(frame, [hotAt, hotAt + 12], [0, 1], clamp);
  const flip = interpolate(frame, [flipAt, flipAt + 7], [0, 180], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const b = frame - flipAt;
  const dropFall = interpolate(b, [2, 7], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const evap = interpolate(b, [7, 15], [0, 1], clamp);
  const stamp = interpolate(b, [9, 14], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2.4)) });
  const head = graphemes("หัวยัง");
  return (
    <AbsoluteFill style={{ perspective: 1400, pointerEvents: "none" }}>
      <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: `scale(${pop}) rotateX(${flip}deg)`, transformOrigin: "540px 1583px" }}>
        {/* front: weather */}
        <div style={{ ...CARD, background: `linear-gradient(120deg, ${HEAT} 0%, ${HEAT_HOT} ${100 - hot * 30}%)` }}>
          <HotSun frame={frame} />
          <div style={{ position: "absolute", left: 244, top: 38, fontFamily: T.ui, fontWeight: 500, fontSize: 34, color: "rgba(255,255,255,0.85)" }}>เที่ยงตรง · กลางแจ้ง</div>
          <div style={{ position: "absolute", left: 240, top: 88, fontFamily: T.ui, fontWeight: 700, fontSize: 96, lineHeight: "130px", color: WHITE, display: "flex" }}>
            {graphemes("แดดร้อน").map((g, i) => (
              <span key={i} style={{ display: "inline-block", transform: `translateY(${shimmer(frame, i) * hot}px)` }}>
                {g}
              </span>
            ))}
          </div>
          <div style={{ position: "absolute", right: 44, top: 22, fontFamily: T.clock, fontWeight: 300, fontSize: 190, lineHeight: "220px", color: WHITE }}>
            {temp}°
          </div>
        </div>
        {/* back: not greasy */}
        <div style={{ ...CARD, background: "#FFF8EC", transform: "rotateX(180deg)" }}>
          <svg width={976} height={262} style={{ position: "absolute", inset: 0 }}>
            {evap < 1 ? (
              <path
                d="M 0 -46 C 16 -20 32 0 32 18 C 32 38 17 50 0 50 C -17 50 -32 38 -32 18 C -32 0 -16 -20 0 -46 Z"
                transform={`translate(${130} ${-40 + dropFall * 170}) scale(${1 - evap * 0.9} ${1 - evap})`}
                fill="#E3B64A"
                stroke={INK}
                strokeWidth={5}
                opacity={1 - evap * 0.6}
              />
            ) : null}
            {evap > 0
              ? [0, 1, 2].map((i) => (
                  <path
                    key={i}
                    d={`M ${100 + i * 30} ${190} q 12 -18 0 -36 q -12 -18 0 -36`}
                    stroke={HEAT}
                    strokeWidth={8}
                    fill="none"
                    strokeLinecap="round"
                    opacity={Math.sin(evap * Math.PI)}
                    transform={`translate(0 ${-evap * 60})`}
                  />
                ))
              : null}
          </svg>
          <div style={{ position: "absolute", left: 240, top: 30, fontFamily: T.heat, fontSize: 64, lineHeight: "90px", color: INK, display: "flex" }}>
            {head.map((g, i) => (
              <span key={i} style={{ display: "inline-block", transform: `translateY(${shimmer(frame, i)}px)` }}>
                {g}
              </span>
            ))}
          </div>
          <div style={{ position: "absolute", left: 234, top: 104, fontFamily: T.heat, fontSize: 118, lineHeight: "150px", display: "flex", whiteSpace: "nowrap" }}>
            <span style={{ display: "inline-block", color: WHITE, background: HEAT_HOT, borderRadius: 18, padding: "0 18px", transform: `scale(${stamp}) rotate(${(1 - stamp) * -30 - 4}deg)`, opacity: stamp > 0 ? 1 : 0 }}>ไม่</span>
            <span style={{ color: INK, marginLeft: 16 }}>เยิ้ม</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}
