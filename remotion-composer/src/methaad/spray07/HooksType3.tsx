import { Easing, interpolate, useCurrentFrame } from "remotion";
import { BONE, clamp, CORAL, GOLD, INK, MINT, T } from "./style";

/**
 * Card 3 — "แบบที่สาม ต้องเจอลูกค้าบ่อย อยากให้ทรงอยู่ทั้งวัน"
 * (card-local, 0 = 7.05 s, front at 9). Tags are calendar-slot tiles with a
 * coloured time strip; the hook is a work-day ruler: the clock runs
 * 09:00 → 18:00 while a little hair tuft rides the knob and never droops.
 */
const SLOTS = [
  { text: "เจอลูกค้าบ่อย", time: "10:00", color: CORAL, at: 32 },
  { text: "ประชุมทั้งวัน", time: "14:00", color: GOLD, at: 45 },
  { text: "ทรงต้องอยู่", time: "17:30", color: MINT, at: 56 },
] as const;
const RULER_AT = 62;
const RULER_TO = 90;

function SlotTile({ text, time, color, at }: (typeof SLOTS)[number]) {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [at, at + 6], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  if (frame < at) return null;
  return (
    <div style={{ transform: `translateX(${(1 - t) * 60}px)`, opacity: t, backgroundColor: "rgba(20,32,27,0.92)", borderRadius: 10, overflow: "hidden", border: "2px solid rgba(246,241,231,0.25)" }}>
      <div style={{ backgroundColor: color, height: 12 }} />
      <div style={{ padding: "6px 22px 12px" }}>
        <div style={{ fontFamily: T.clock, fontWeight: 500, fontSize: 26, color: "rgba(246,241,231,0.7)" }}>{time}</div>
        <div style={{ fontFamily: T.clock, fontWeight: 700, fontSize: 40, color: BONE, whiteSpace: "nowrap", marginTop: -4 }}>{text}</div>
      </div>
    </div>
  );
}

function DayRuler() {
  const frame = useCurrentFrame();
  const show = interpolate(frame, [RULER_AT, RULER_AT + 5], [0, 1], clamp);
  if (show <= 0) return null;
  const p = interpolate(frame, [RULER_AT + 2, RULER_TO], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const minutes = 9 * 60 + Math.round(p * 9 * 60);
  const hh = String(Math.floor(minutes / 60)).padStart(2, "0");
  const mm = String(Math.floor((minutes % 60) / 15) * 15).padStart(2, "0");
  const W = 860;
  const x = 20 + p * W;
  return (
    <div style={{ position: "absolute", left: 40, top: 956, width: 900, opacity: show }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 22 }}>
        <span style={{ fontFamily: T.clock, fontWeight: 700, fontSize: 118, color: BONE, letterSpacing: -2 }}>อยู่ทั้งวัน</span>
        <span style={{ fontFamily: T.clock, fontWeight: 700, fontSize: 64, color: MINT, fontVariantNumeric: "tabular-nums" }}>{`${hh}:${mm}`}</span>
      </div>
      <svg width={900} height={84} viewBox="0 0 900 84" style={{ display: "block", marginTop: -14, overflow: "visible" }}>
        <line x1={20} x2={20 + W} y1={50} y2={50} stroke="rgba(246,241,231,0.35)" strokeWidth={8} strokeLinecap="round" />
        <line x1={20} x2={x} y1={50} y2={50} stroke={MINT} strokeWidth={8} strokeLinecap="round" />
        {Array.from({ length: 10 }, (_, i) => (
          <line key={i} x1={20 + (i * W) / 9} x2={20 + (i * W) / 9} y1={62} y2={i % 3 === 0 ? 78 : 70} stroke="rgba(246,241,231,0.6)" strokeWidth={3} />
        ))}
        <g transform={`translate(${x} 50)`}>
          <circle r={20} fill={BONE} stroke={INK} strokeWidth={4} />
          {/* the tuft on the knob stays standing the whole day */}
          <path d="M -10 -22 C -14 -44 -4 -56 0 -62 C 0 -48 6 -44 4 -22 M 4 -22 C 8 -40 18 -46 22 -50 C 20 -38 16 -30 12 -20" fill="none" stroke={BONE} strokeWidth={6} strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}

export function PanelType3() {
  const frame = useCurrentFrame();
  const name = interpolate(frame, [9, 16], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <>
      <div style={{ position: "absolute", left: 56, top: 856, opacity: name, clipPath: `inset(0 ${(1 - name) * 100}% 0 0)` }}>
        <span style={{ fontFamily: T.name, fontWeight: 800, fontSize: 84, color: BONE }}>แบบที่สาม</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 10, marginLeft: 22, fontFamily: T.ui, fontWeight: 600, fontSize: 36, color: "rgba(246,241,231,0.8)", verticalAlign: "middle" }}>
          <svg width={40} height={34} viewBox="0 0 40 34">
            <rect x={2} y={8} width={36} height={24} rx={4} fill="none" stroke="rgba(246,241,231,0.8)" strokeWidth={3.5} />
            <path d="M 13 8 V 3 H 27 V 8" fill="none" stroke="rgba(246,241,231,0.8)" strokeWidth={3.5} />
          </svg>
          ฝ่ายขาย
        </span>
      </div>
      <DayRuler />
      <div style={{ position: "absolute", left: 56, top: 1196, display: "flex", gap: 16 }}>
        {SLOTS.map((s) => (
          <SlotTile key={s.text} {...s} />
        ))}
      </div>
    </>
  );
}
