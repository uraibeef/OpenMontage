import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { graphemes, usePop } from "../hooks/kit";
import { clamp, CLASS, G, GOLD, HOT, NAVY, WHITE } from "./style";

/**
 * Payoff beats.
 * ItemAcquired (12.55 s): god-ray pickup, gold banner, item plate that fits all 3 classes.
 * Cooldown (13.63 s): skill cooldown ring counting 5 → 0 on "ขยำใหม่".
 * LevelUp (14.78 s): chevrons climb beside his head, "พองเหมือนเดิม".
 * StackCount (15.4 s): inventory slot ticks x1 → x2 for ซื้อ 1 แถม 1.
 */

export function ItemAcquired() {
  const frame = useCurrentFrame();
  const banner = interpolate(frame, [0, 6], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.4)) });
  const plate = usePop(7, 12);
  const glow = 0.35 + 0.15 * Math.sin(frame * 0.5);
  const name = graphemes("แป้งเซ็ตผม");
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, mixBlendMode: "screen" }}>
        <g transform={`translate(540 900) rotate(${frame * 1.6})`}>
          {Array.from({ length: 14 }, (_, i) => (
            <polygon key={i} points="0,0 -60,-1100 60,-1100" fill={GOLD} opacity={glow * 0.5} transform={`rotate(${i * (360 / 14)})`} />
          ))}
        </g>
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 170, display: "flex", justifyContent: "center" }}>
        <div style={{ transform: `scaleX(${banner})`, background: `linear-gradient(90deg, transparent, ${GOLD} 12%, ${GOLD} 88%, transparent)`, padding: "10px 150px", fontFamily: G.hud, fontWeight: 700, fontSize: 88, letterSpacing: 10, color: NAVY, whiteSpace: "nowrap" }}>
          ITEM ACQUIRED
        </div>
      </div>
      <div style={{ position: "absolute", left: 90, right: 90, top: 1480, transform: `translateY(${(1 - plate) * 400}px)`, background: "rgba(11,14,31,0.92)", border: `6px solid ${GOLD}`, borderRadius: 14, padding: "30px 40px 34px", boxShadow: `0 0 60px rgba(255,200,58,${glow})` }}>
        <div style={{ fontFamily: G.item, fontSize: 118, lineHeight: 1.3, color: GOLD, textAlign: "center", textShadow: `0 6px 0 #7A4A00` }}>
          {name.map((g, i) => (
            <span key={i} style={{ opacity: frame > 9 + i ? 1 : 0 }}>
              {g}
            </span>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 18, marginTop: 10, fontFamily: G.hud, fontWeight: 700, fontSize: 44, color: WHITE, opacity: frame > 18 ? 1 : 0 }}>
          ใช้ได้ทั้ง 3 คลาส
          {[CLASS.lazy.main, CLASS.rider.main, CLASS.fine.main].map((c, i) => (
            <div key={c} style={{ width: 34, height: 34, background: c, transform: `rotate(45deg) scale(${frame > 19 + i * 2 ? 1 : 0})`, border: `4px solid ${WHITE}` }} />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
}

export function Cooldown({ dur }: { dur: number }) {
  const frame = useCurrentFrame();
  const enter = usePop(0, 11);
  const p = interpolate(frame, [2, dur - 2], [0, 1], clamp);
  const n = Math.max(0, Math.ceil(5 * (1 - p)));
  const tick = (5 * (1 - p)) % 1;
  const R = 150;
  const circ = 2 * Math.PI * R;
  const ready = n === 0;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 90, top: 1440, display: "flex", alignItems: "center", gap: 40, transform: `scale(${enter})`, transformOrigin: "left center" }}>
        <div style={{ position: "relative", width: 2 * R + 40, height: 2 * R + 40 }}>
          <svg width={2 * R + 40} height={2 * R + 40} style={{ position: "absolute", inset: 0 }}>
            <circle cx={R + 20} cy={R + 20} r={R} fill="rgba(11,14,31,0.88)" stroke="#2A3050" strokeWidth={26} />
            <circle cx={R + 20} cy={R + 20} r={R} fill="none" stroke={ready ? GOLD : WHITE} strokeWidth={26} strokeDasharray={circ} strokeDashoffset={circ * p} transform={`rotate(-90 ${R + 20} ${R + 20})`} strokeLinecap="butt" />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: G.hud, fontWeight: 700, fontSize: ready ? 100 : 190, color: ready ? GOLD : WHITE, transform: `scale(${1 + 0.18 * tick})` }}>
            {ready ? "READY" : n}
          </div>
        </div>
        <div style={{ fontFamily: G.hud, fontWeight: 700, color: WHITE, textShadow: `5px 5px 0 ${NAVY}` }}>
          <div style={{ fontSize: 50, color: GOLD, letterSpacing: 6 }}>SKILL</div>
          <div style={{ fontSize: 112, lineHeight: 1.1 }}>ขยำใหม่</div>
          <div style={{ fontSize: 62 }}>5 วิ</div>
        </div>
      </div>
    </AbsoluteFill>
  );
}

function Chevrons({ x }: { x: number }) {
  const frame = useCurrentFrame();
  return (
    <svg width={160} height={1000} style={{ position: "absolute", left: x, top: 200 }}>
      {Array.from({ length: 6 }, (_, i) => {
        const y = 1000 - ((frame * 26 + i * 170) % 1000);
        return <polyline key={i} points={`20,${y + 50} 80,${y} 140,${y + 50}`} fill="none" stroke={i % 2 ? GOLD : WHITE} strokeWidth={22} strokeLinejoin="miter" opacity={interpolate(y, [0, 300, 1000], [0, 1, 0.4])} />;
      })}
    </svg>
  );
}

export function LevelUp() {
  const frame = useCurrentFrame();
  const hit = usePop(0, 9);
  const word = graphemes("พองเหมือนเดิม");
  return (
    <AbsoluteFill>
      <Chevrons x={10} />
      <Chevrons x={910} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1600, textAlign: "center", transform: `scale(${interpolate(hit, [0, 1], [0.3, 1])})` }}>
        <div style={{ display: "inline-block", fontFamily: G.hud, fontWeight: 700, fontSize: 58, letterSpacing: 14, color: NAVY, background: GOLD, padding: "0 30px", transform: "skewX(-12deg)" }}>LEVEL UP</div>
        <div style={{ fontFamily: G.title, fontWeight: 900, fontStyle: "italic", fontSize: 130, lineHeight: 1.15, color: WHITE, WebkitTextStroke: `10px ${NAVY}`, paintOrder: "stroke fill" }}>
          {word.map((g, i) => {
            const bob = Math.sin(frame * 0.6 - i * 0.7) * 10;
            return (
              <span key={i} style={{ display: "inline-block", transform: `translateY(${bob}px)` }}>
                {g}
              </span>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
}

export function StackCount() {
  const frame = useCurrentFrame();
  const enter = usePop(0, 12);
  const two = frame >= 7;
  const bump = usePop(7, 8);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1480, display: "flex", justifyContent: "center", alignItems: "center", gap: 34, transform: `translateY(${(1 - enter) * 300}px)` }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ width: 240, height: 240, background: "rgba(11,14,31,0.9)", border: `6px solid ${i === 0 ? GOLD : "#3A4165"}`, borderRadius: 12, position: "relative", boxShadow: i === 0 ? `0 0 40px ${GOLD}` : "none" }}>
            {i === 0 ? (
              <>
                <svg width={240} height={240} viewBox="0 0 200 200" style={{ position: "absolute", inset: 0 }}>
                  <rect x={70} y={40} width={60} height={120} rx={10} fill="#111" stroke={WHITE} strokeWidth={4} />
                  <rect x={76} y={26} width={48} height={20} rx={4} fill="#111" stroke={WHITE} strokeWidth={4} />
                  <line x1={80} y1={96} x2={120} y2={96} stroke={GOLD} strokeWidth={6} />
                </svg>
                <div style={{ position: "absolute", right: 10, bottom: 2, fontFamily: G.hud, fontWeight: 700, fontSize: 70, color: two ? GOLD : WHITE, transform: `scale(${two ? 0.7 + 0.3 * bump + 0.3 * (1 - bump) : 1})`, transformOrigin: "right bottom", textShadow: `4px 4px 0 ${NAVY}` }}>
                  {two ? "x2" : "x1"}
                </div>
              </>
            ) : null}
          </div>
        ))}
      </div>
      {two ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1760, textAlign: "center" }}>
          <span style={{ display: "inline-block", transform: `scale(${bump}) rotate(-2deg)`, fontFamily: G.hud, fontWeight: 700, fontSize: 100, color: WHITE, background: HOT, padding: "0 34px", border: `6px solid ${NAVY}` }}>
            ซื้อ 1 แถม 1
          </span>
        </div>
      ) : null}
    </AbsoluteFill>
  );
}
