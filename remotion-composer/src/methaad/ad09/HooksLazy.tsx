import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { usePop } from "../hooks/kit";
import { clamp, CLASS, G, GOLD, HOT, NAVY, WHITE } from "./style";

/**
 * Class 1 "สายขี้เกียจ" (3.95–5.84 s): the character's stat sheet. Laziness
 * rolls up past the bar into 99 MAX; styling time sits almost empty at 2 นาที.
 */

const C = CLASS.lazy;

function Bar({ label, at, to, value, valueColor, max }: { label: string; at: number; to: number; value: string; valueColor: string; max?: boolean }) {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [at, at + 5], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const fill = interpolate(frame, [at + 3, at + 14], [0, to], { ...clamp, easing: Easing.out(Easing.quad) });
  const pop = usePop(at + 12, 9);
  const blink = max && frame > at + 14 && Math.floor(frame / 3) % 2 === 0;
  return (
    <div style={{ opacity: enter, transform: `translateX(${(1 - enter) * -120}px)`, marginBottom: 34 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontFamily: G.hud, fontWeight: 700, color: WHITE }}>
        <span style={{ fontSize: 62 }}>{label}</span>
        <span style={{ fontSize: 96, color: valueColor, display: "inline-block", transform: `scale(${0.4 + 0.6 * pop})`, transformOrigin: "right bottom", textShadow: `5px 5px 0 ${NAVY}` }}>
          {value}
        </span>
      </div>
      <div style={{ position: "relative", height: 46, background: "#22283F", border: `5px solid ${WHITE}`, marginTop: 6 }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${fill * 100}%`, background: `repeating-linear-gradient(90deg, ${C.main} 0 34px, #FFB85A 34px 40px)` }} />
        {max && frame > at + 14 ? (
          <div style={{ position: "absolute", right: -18, top: -46, background: blink ? WHITE : HOT, color: blink ? HOT : WHITE, fontFamily: G.hud, fontWeight: 700, fontSize: 40, padding: "0 16px", transform: "rotate(8deg)", border: `4px solid ${NAVY}` }}>
            MAX
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function StatSheet({ secondAt }: { secondAt: number }) {
  const frame = useCurrentFrame();
  const slide = interpolate(frame, [0, 6], [700, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const lazyNum = Math.round(interpolate(frame, [3, 15], [0, 99], clamp));
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          top: 1230,
          padding: "70px 50px 20px",
          background: "rgba(11,14,31,0.9)",
          clipPath: "polygon(0 0, 88% 0, 100% 9%, 100% 100%, 6% 100%, 0 92%)",
          borderLeft: `14px solid ${C.main}`,
          transform: `translateY(${slide}px)`,
        }}
      >
        <div style={{ position: "absolute", top: 14, left: 50, fontFamily: G.hud, fontWeight: 700, fontSize: 36, letterSpacing: 10, color: C.main }}>
          STATUS // สายขี้เกียจ
        </div>
        <Bar label="ความขี้เกียจ" at={2} to={1} value={`${lazyNum}`} valueColor={C.main} max />
        {frame >= secondAt ? <Bar label="เวลาจัดผม" at={secondAt} to={0.1} value="2 นาที" valueColor={GOLD} /> : null}
      </div>
    </AbsoluteFill>
  );
}
