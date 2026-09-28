import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { graphemes } from "../hooks/kit";
import { SevenSeg, segWidth } from "./SevenSeg";
import { about, ALERT, AMBER, clamp, HAZARD, INK, R } from "./style";

/**
 * Beats 1-2: the wake-up. "ตื่นสาย" rattles like a ringing alarm bell,
 * "เหลือ 10 นาที" arrives on a strip of hazard tape, then a drawn front door
 * wears the clock and an exit sign that runs for the door.
 */

/** "ตื่นสาย" dropped in letter by letter, then shaking like a bell hammer. */
export function AlarmWord() {
  const frame = useCurrentFrame();
  const g = graphemes("ตื่นสาย");
  const ring = frame >= 5;
  const rot = ring ? (frame % 2 ? 3.5 : -3.5) : 0;
  const shake = ring ? (frame % 2 ? 7 : -7) : 0;
  const cy = 1560;

  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        {ring
          ? [0, 1, 2].map((i) => {
              const p = ((frame - 5 + i * 3) % 9) / 9;
              const r = 250 + p * 120;
              return (
                <g key={i} opacity={1 - p} stroke={ALERT} strokeWidth={10} fill="none" strokeLinecap="round">
                  <path d={`M ${540 - r} ${cy - 110} A ${r} ${r * 0.7} 0 0 0 ${540 - r} ${cy + 10}`} />
                  <path d={`M ${540 + r} ${cy - 110} A ${r} ${r * 0.7} 0 0 1 ${540 + r} ${cy + 10}`} />
                </g>
              );
            })
          : null}
      </svg>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: cy - 190,
          textAlign: "center",
          fontFamily: R.alarm,
          fontSize: 190,
          lineHeight: "260px",
          color: "#FFFFFF",
          transform: `translateX(${shake}px) rotate(${rot}deg)`,
          textShadow: `8px 8px 0 ${ALERT}, 0 0 30px rgba(0,0,0,0.5)`,
          WebkitTextStroke: `6px ${INK}`,
          paintOrder: "stroke fill",
        }}
      >
        {g.map((ch, i) => {
          const p = interpolate(frame, [i, i + 4], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2.5)) });
          return (
            <span key={i} style={{ display: "inline-block", opacity: p, transform: `translateY(${(1 - p) * -160}px)` }}>
              {ch}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}

/** A strip of hazard tape slaps across the frame carrying "เหลือ 10 นาที". */
export function HazardTape() {
  const frame = useCurrentFrame();
  const slide = interpolate(frame, [0, 6], [-1200, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const y = 1085;
  const h = 150;
  const stripes = Array.from({ length: 26 }, (_, i) => i * 60 - 200 + ((frame * 4) % 60));

  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <clipPath id="r10-tape-clip">
            <rect x={-100} y={y} width={1280} height={h} />
          </clipPath>
        </defs>
        <g transform={`${about(540, y + h / 2, "rotate(-4)")} translate(${slide} 0)`}>
          <rect x={-100} y={y + 10} width={1280} height={h} fill="rgba(0,0,0,0.35)" />
          <g clipPath="url(#r10-tape-clip)">
            <rect x={-100} y={y} width={1280} height={h} fill={HAZARD} />
            {stripes.map((sx) => (
              <polygon key={sx} points={`${sx},${y} ${sx + 28},${y} ${sx + 28 - 40},${y + 22} ${sx - 40},${y + 22}`} fill={INK} />
            ))}
            {stripes.map((sx) => (
              <polygon key={`b${sx}`} points={`${sx},${y + h - 22} ${sx + 28},${y + h - 22} ${sx + 28 - 40},${y + h} ${sx - 40},${y + h}`} fill={INK} />
            ))}
          </g>
          <text x={540} y={y + 112} textAnchor="middle" fontFamily={R.alert} fontStyle="italic" fontWeight={900} fontSize={98} fill={INK}>
            เหลือ 10 นาที
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
}

/** Drawn shot: the front door wears the clock; an exit sign points the way. */
export function DoorShot() {
  const frame = useCurrentFrame();
  const open = interpolate(frame, [4, 30], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const zoom = interpolate(frame, [0, 33], [1.06, 1], clamp);
  const sign = interpolate(frame, [3, 9], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
  const run = Math.floor(frame / 3) % 2;
  const tw = segWidth("10:00") * 1.5;
  const dx = 250;
  const dy = 520;
  const dw = 580;
  const dh = 1180;
  const leaf = dw * (1 - open * 0.28);

  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg,#1A2233 0%,#0E131D 70%,#0A0D14 100%)" }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, transform: `scale(${zoom})` }}>
        <rect x={0} y={1700} width={1080} height={220} fill="#151B27" />
        <line x1={0} y1={1700} x2={1080} y2={1700} stroke="#2A3346" strokeWidth={4} />
        {/* frame + daylight behind the door */}
        <rect x={dx - 30} y={dy - 30} width={dw + 60} height={dh + 30} fill="#2B3447" />
        <rect x={dx} y={dy} width={dw} height={dh} fill="#FFF3D6" />
        <polygon points={`${dx},${dy + dh} ${dx + dw},${dy + dh} ${dx + dw + 260},1920 ${dx - 60},1920`} fill="rgba(255,236,190,0.18)" opacity={open} />
        {/* door leaf swinging in */}
        <rect x={dx} y={dy} width={leaf} height={dh} fill="#3A4A66" stroke="#1C2536" strokeWidth={4} />
        <rect x={dx + 50} y={dy + 70} width={leaf - 100} height={dh * 0.36} rx={8} fill="none" stroke="#2C3A52" strokeWidth={8} />
        <rect x={dx + 50} y={dy + 120 + dh * 0.36} width={leaf - 100} height={dh * 0.46} rx={8} fill="none" stroke="#2C3A52" strokeWidth={8} />
        <circle cx={dx + leaf - 60} cy={dy + dh * 0.54} r={22} fill={AMBER} />
        {/* clock plate on the door */}
        <g transform={`translate(${dx + leaf / 2} ${dy + 300})`}>
          <rect x={-tw / 2 - 40} y={-40} width={tw + 80} height={260} rx={18} fill="#07090D" stroke={AMBER} strokeWidth={5} />
          <SevenSeg text="10:00" x={-tw / 2} y={0} scale={1.5} color={AMBER} ghost={0.08} colonOn={frame % 30 < 20} />
        </g>
        {/* exit sign */}
        <g transform={about(540, 330, `scale(${sign})`)}>
          <rect x={150} y={250} width={780} height={160} rx={14} fill="#0F8A4B" stroke="#E8FFF1" strokeWidth={6} />
          <g transform={`translate(215 330)`} stroke="#FFFFFF" strokeWidth={12} strokeLinecap="round" fill="none">
            <circle cx={8} cy={-48} r={12} fill="#FFFFFF" stroke="none" />
            <path d={run ? "M 0 -30 L -8 10 L -34 42 M -8 10 L 22 44 M 0 -24 L 28 -8 M 0 -24 L -30 -12" : "M 0 -30 L -4 10 L 20 44 M -4 10 L -24 44 M 0 -24 L -26 -4 M 0 -24 L 30 -18"} />
          </g>
          <text x={570} y={352} textAnchor="middle" fontFamily={R.hud} fontWeight={700} fontSize={70} fill="#FFFFFF">
            ก่อนออกจากบ้าน
          </text>
          <path d={`M ${860 + run * 10} 330 l 30 0 m -16 -18 l 18 18 l -18 18`} stroke="#FFFFFF" strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </AbsoluteFill>
  );
}
