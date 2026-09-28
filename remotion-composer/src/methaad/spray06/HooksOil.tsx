import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { clamp, INK, PAPER, RUST, SEPIA, T } from "./style";

/**
 * Beat 3 hooks — "สอง คุมความมัน หัวไม่เยิ้มระหว่างวัน".
 * GlossBlot: "คุมความมัน" starts slick and glossy (a highlight slides over
 * amber ink); a sheet of blotting paper presses on it and lifts away with
 * an oil stain — the word is left matte.
 * DayRuler: a field-notes time ruler 08:00 → 20:00; a marker walks the day
 * carrying "ไม่เยิ้ม".
 */

const BLOT_DOWN = 11;
const BLOT_UP = 16;

export function GlossBlot({ y = 1380 }: { y?: number }) {
  const frame = useCurrentFrame();
  const inP = interpolate(frame, [0, 5], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const matte = frame >= BLOT_DOWN + 2;
  const sheen = interpolate(frame, [0, BLOT_DOWN], [-0.4, 1.2], clamp);
  const down = interpolate(frame, [BLOT_DOWN - 3, BLOT_DOWN], [-500, 0], { ...clamp, easing: Easing.in(Easing.quad) });
  const up = interpolate(frame, [BLOT_UP, BLOT_UP + 7], [0, -1100], { ...clamp, easing: Easing.in(Easing.cubic) });
  const blotY = frame < BLOT_UP ? down : up;
  const blotRot = frame < BLOT_UP ? -3 : -3 - (frame - BLOT_UP) * 2.5;
  const showBlot = frame >= BLOT_DOWN - 3 && frame < BLOT_UP + 8;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, opacity: inP }}>
        <defs>
          <linearGradient id="sp06-gloss" x1="0" y1="0" x2="1" y2="0.3">
            <stop offset={0} stopColor="#8A5A12" />
            <stop offset={Math.max(0, sheen - 0.12)} stopColor="#C8901E" />
            <stop offset={Math.min(1, Math.max(0, sheen))} stopColor="#FFF4C8" />
            <stop offset={Math.min(1, sheen + 0.12)} stopColor="#C8901E" />
            <stop offset={1} stopColor="#8A5A12" />
          </linearGradient>
        </defs>
        <rect x={100} y={y - 190} width={880} height={250} fill={PAPER} opacity={0.93} transform={`rotate(-1.5 540 ${y})`} />
        <text x={130} y={y - 130} fontFamily={T.fellItalic} fontSize={64} fill={RUST}>II.</text>
        <text x={540} y={y} textAnchor="middle" fontFamily={T.gloss} fontWeight={700} fontSize={140}
          fill={matte ? SEPIA : "url(#sp06-gloss)"} stroke={matte ? "none" : "#5A3A08"} strokeWidth={2}>
          คุมความมัน
        </text>
        {matte ? (
          <text x={880} y={y - 128} textAnchor="end" fontFamily={T.type} fontSize={28} fill={RUST}>matte.</text>
        ) : null}
      </svg>
      {showBlot ? (
        <div style={{ position: "absolute", left: 150, top: y - 230, width: 780, height: 300, backgroundColor: "#F2EEE6",
          transform: `translateY(${blotY}px) rotate(${blotRot}deg)`, boxShadow: "0 20px 40px rgba(20,14,6,0.4)",
          border: "1px solid #CFC6B4" }}>
          <div style={{ position: "absolute", left: 180, top: 100, width: 420, height: 110, borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(200,144,30,0.5), rgba(200,144,30,0) 70%)", opacity: frame >= BLOT_DOWN ? 1 : 0 }} />
          <div style={{ position: "absolute", left: 24, top: 18, fontFamily: T.type, fontSize: 24, color: SEPIA }}>blotting paper</div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
}

const HOURS = ["08", "10", "12", "14", "16", "18", "20"];

export function DayRuler({ y = 360 }: { y?: number }) {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [0, 6], [0, 1], clamp);
  const walk = interpolate(frame, [4, 19], [0, 1], { ...clamp, easing: Easing.inOut(Easing.sin) });
  const x0 = 150;
  const x1 = 930;
  const mx = x0 + (x1 - x0) * walk;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        <rect x={90} y={y - 150} width={900} height={350} fill={PAPER} opacity={0.9 * draw} />
        <text x={540} y={y + 160} textAnchor="middle" fontFamily={T.note} fontSize={56} fill={INK} opacity={draw}>ระหว่างวัน</text>
        <line x1={x0} x2={x0 + (x1 - x0) * draw} y1={y} y2={y} stroke={INK} strokeWidth={4} />
        {HOURS.map((h, i) => {
          const hx = x0 + ((x1 - x0) * i) / (HOURS.length - 1);
          return (
            <g key={h} opacity={draw}>
              <line x1={hx} x2={hx} y1={y - 18} y2={y + 18} stroke={INK} strokeWidth={3} />
              <text x={hx} y={y + 62} textAnchor="middle" fontFamily={T.type} fontSize={28} fill={SEPIA}>{`${h}:00`}</text>
            </g>
          );
        })}
        <path d={`M ${x0} ${y} L ${mx} ${y}`} stroke={RUST} strokeWidth={8} strokeLinecap="round" />
        <g transform={`translate(${mx} ${y})`}>
          <path d="M 0 -14 L 16 -40 L -16 -40 Z" fill={RUST} />
          <text x={0} y={-58} textAnchor={walk > 0.8 ? "end" : walk < 0.2 ? "start" : "middle"} fontFamily={T.note} fontSize={62} fill={RUST}>
            ไม่เยิ้ม
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
}
