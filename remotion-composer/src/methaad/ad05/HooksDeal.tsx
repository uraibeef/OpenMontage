import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { usePop } from "../hooks/kit";
import { useDraw } from "./Draft";
import { CAL, clamp, GRAPHITE, LIFT, LINE, SHEET, T } from "./style";

/** Beats 11–12: the unit-price calculator, then the signed-off title block. */

const KEYS = ["7", "8", "9", "÷", "4", "5", "6", "×", "1", "2", "3", "−", "0", ".", "=", "+"];

// [frame, key pressed, display after press]
const PRESSES: readonly [number, string, string][] = [
  [2, "8", "8"],
  [5, "0", "80"],
  [10, "÷", "80 ÷"],
  [14, "2", "80 ÷ 2"],
  [20, "=", "40"],
];

/** Beat 11 (16.98–18.36 s): 80 ÷ 2 keyed in, result = price per tub. */
export function HookCalc() {
  const frame = useCurrentFrame();
  const inP = usePop(0, 13);
  const last = [...PRESSES].reverse().find((p) => frame >= p[0]);
  const display = last ? last[2] : "0";
  const isResult = frame >= 20;
  const resPop = usePop(20, 8);
  const per = useDraw(24, 6);
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 60,
          top: 150,
          width: 480,
          padding: 26,
          borderRadius: 34,
          background: "linear-gradient(170deg, #2B2D31 0%, #121316 100%)",
          boxShadow: "0 40px 80px rgba(0,0,0,0.6), inset 0 2px 0 rgba(255,255,255,0.12)",
          transform: `translateX(${(1 - inP) * -600}px) rotate(${(1 - inP) * -12 - 2}deg)`,
        }}
      >
        <div style={{ fontFamily: T.mono, fontSize: 20, letterSpacing: 5, color: CAL, marginBottom: 12 }}>UNIT PRICE</div>
        <div
          style={{
            height: 170,
            borderRadius: 14,
            background: "#C9D3C0",
            boxShadow: "inset 0 6px 12px rgba(0,0,0,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            padding: "0 22px",
            fontFamily: T.mono,
            fontWeight: 700,
            fontSize: isResult ? 130 : 88,
            color: "#1B2418",
            transform: isResult ? `scale(${0.8 + resPop * 0.2})` : undefined,
            transformOrigin: "right center",
          }}
        >
          {display}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginTop: 22 }}>
          {KEYS.map((k) => {
            const hit = PRESSES.find((p) => p[1] === k && frame >= p[0] && frame < p[0] + 3);
            const op = k === "÷" || k === "=" ;
            return (
              <div
                key={k}
                style={{
                  height: 76,
                  borderRadius: 14,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: T.mono,
                  fontWeight: 700,
                  fontSize: 38,
                  color: op ? GRAPHITE : LINE,
                  background: op ? CAL : "#3A3D42",
                  transform: hit ? "translateY(5px) scale(0.93)" : undefined,
                  boxShadow: hit ? "none" : "0 5px 0 #0A0A0B",
                  filter: hit ? "brightness(1.5)" : undefined,
                }}
              >
                {k}
              </div>
            );
          })}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 1010,
          filter: LIFT,
          clipPath: `inset(0 ${100 - per * 100}% 0 0)`,
        }}
      >
        <span style={{ fontFamily: T.disp, fontWeight: 700, fontSize: 104, color: LINE }}>40.- </span>
        <span style={{ fontFamily: T.th, fontWeight: 700, fontSize: 72, color: CAL }}>/ กระปุก</span>
      </div>
    </AbsoluteFill>
  );
}

const ROWS: readonly [string, string][] = [
  ["ITEM", "X'JIALO VOLUME POWDER"],
  ["OFFER", "ซื้อ 1 แถม 1"],
  ["PRICE", "80 บาท / 2 กระปุก"],
];

/** Beat 12 (18.36–20.44 s): drawing title block fills in, verdict stamped. */
export function HookTitleBlock({ stampAt }: { stampAt: number }) {
  const frame = useCurrentFrame();
  const up = interpolate(frame, [0, 8], [500, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const head = usePop(2, 11);
  const t = interpolate(frame, [stampAt, stampAt + 5], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const shake = frame >= stampAt + 5 && frame < stampAt + 9 ? (frame % 2 ? 6 : -6) : 0;
  return (
    <AbsoluteFill style={{ transform: `translate(${shake}px, ${shake / 2}px)` }}>
      <div style={{ position: "absolute", left: 60, right: 60, top: 110, filter: LIFT, transform: `scale(${head})`, transformOrigin: "left top" }}>
        <div style={{ fontFamily: T.disp, fontWeight: 700, fontSize: 150, color: LINE, lineHeight: 1.1 }}>คุ้มกว่านี้</div>
        <div style={{ fontFamily: T.disp, fontWeight: 700, fontSize: 92, color: CAL, lineHeight: 1.2 }}>หาที่ไหน?</div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 50,
          right: 50,
          top: 1350,
          background: SHEET,
          border: `6px solid ${GRAPHITE}`,
          transform: `translateY(${up}px)`,
          boxShadow: "0 30px 60px rgba(0,0,0,0.55)",
        }}
      >
        {ROWS.map(([k, v], i) => {
          const on = interpolate(frame, [6 + i * 5, 10 + i * 5], [0, 1], clamp);
          return (
            <div key={k} style={{ display: "flex", borderBottom: `3px solid ${GRAPHITE}`, height: 104, alignItems: "center" }}>
              <div style={{ width: 190, fontFamily: T.mono, fontWeight: 700, fontSize: 26, letterSpacing: 4, color: "#6B6B70", paddingLeft: 24 }}>{k}</div>
              <div
                style={{
                  flex: 1,
                  borderLeft: `3px solid ${GRAPHITE}`,
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: 26,
                  fontFamily: i === 0 ? T.disp : T.th,
                  fontWeight: 700,
                  fontSize: i === 0 ? 46 : 58,
                  color: GRAPHITE,
                  clipPath: `inset(0 ${100 - on * 100}% 0 0)`,
                }}
              >
                {v}
              </div>
            </div>
          );
        })}
        <div style={{ display: "flex", height: 150, alignItems: "center" }}>
          <div style={{ width: 190, fontFamily: T.mono, fontWeight: 700, fontSize: 26, letterSpacing: 4, color: CAL, paddingLeft: 24 }}>VERDICT</div>
          <div style={{ flex: 1, borderLeft: `3px solid ${GRAPHITE}`, height: "100%", position: "relative" }}>
            {frame >= stampAt ? (
              <div
                style={{
                  position: "absolute",
                  left: 70,
                  top: -30,
                  padding: "0 40px 10px",
                  border: `10px solid ${CAL}`,
                  borderRadius: 16,
                  color: CAL,
                  fontFamily: T.th,
                  fontWeight: 700,
                  fontSize: 150,
                  lineHeight: 1.15,
                  background: "rgba(237,234,225,0.85)",
                  transform: `rotate(-7deg) scale(${interpolate(t, [0, 1], [2.6, 1])})`,
                  opacity: interpolate(t, [0, 0.4, 1], [0, 0.8, 1]),
                }}
              >
                คุ้ม
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}
