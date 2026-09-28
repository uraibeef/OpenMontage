import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Canvas, clamp, graphemes, usePop } from "../hooks/kit";
import { about, ALARM, GLASS, INK, SOFT, T, WHITE } from "./style";

/**
 * 07:00 lock screen: thin digits flip down one by one over the spraying bottle,
 * then the whole clock shrinks up into the sun's time chip.
 */
export function LockClock({ flyTo }: { flyTo: [number, number] }) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const fly = interpolate(frame, [durationInFrames - 9, durationInFrames], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const cx = 540 + (flyTo[0] - 540) * fly;
  const cy = 640 + (flyTo[1] - 640) * fly;
  const k = 1 - fly * 0.82;
  const digits = ["0", "7", ":", "0", "0"];
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: cx,
          top: cy,
          transform: `translate(-50%, -50%) scale(${k})`,
          opacity: 1 - fly * 0.5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={{ fontFamily: T.ui, fontWeight: 500, fontSize: 40, color: WHITE, letterSpacing: 6, opacity: interpolate(frame, [2, 8], [0, 0.9], clamp), textShadow: "0 3px 14px rgba(0,0,0,0.45)" }}>
          เช้าวันทำงาน
        </div>
        <div style={{ display: "flex", fontFamily: T.clock, fontWeight: 200, fontSize: 250, lineHeight: 1, color: WHITE, textShadow: "0 8px 30px rgba(0,0,0,0.4)" }}>
          {digits.map((d, i) => {
            const t = interpolate(frame, [i * 2, i * 2 + 7], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.8)) });
            return (
              <span key={i} style={{ display: "inline-block", transform: `perspective(600px) rotateX(${(1 - t) * -95}deg)`, transformOrigin: "50% 0%", opacity: t, width: d === ":" ? 70 : undefined, textAlign: "center" }}>
                {d}
              </span>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
}

/** Drawn alarm bell (not an emoji), rung by `ring` degrees. */
function Bell({ x, y, ring }: { x: number; y: number; ring: number }) {
  return (
    <g transform={about(x, y - 40, `rotate(${ring})`)}>
      <path d={`M ${x - 44} ${y + 26} Q ${x - 40} ${y - 50} ${x} ${y - 52} Q ${x + 40} ${y - 50} ${x + 44} ${y + 26} Z`} fill={ALARM} />
      <rect x={x - 54} y={y + 20} width={108} height={16} rx={8} fill={ALARM} />
      <circle cx={x} cy={y + 46} r={11} fill={ALARM} />
      <circle cx={x} cy={y - 58} r={8} fill={ALARM} />
      <path d={`M ${x - 22} ${y - 26} Q ${x - 18} ${y - 38} ${x - 6} ${y - 40}`} stroke={WHITE} strokeOpacity={0.7} strokeWidth={6} fill="none" strokeLinecap="round" />
    </g>
  );
}

/**
 * Alarm notification: the bell rings, the toggle snaps on, and the alarm's label
 * mists in dot by dot — "ฉีดก่อนจัดทรง". At the end the card is swiped away.
 */
export function AlarmCard({ labelAt }: { labelAt: number }) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const pop = usePop(0, 12);
  const ring = frame < 30 ? Math.sin(frame * 1.9) * 16 * Math.max(0, 1 - frame / 30) : 0;
  const on = interpolate(frame, [5, 9], [0, 1], clamp);
  const swipe = interpolate(frame, [durationInFrames - 7, durationInFrames], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const label = graphemes("ฉีดก่อนจัดทรง");
  return (
    <Canvas>
      <g transform={`translate(${swipe * 1150} 0) ${about(540, 1590, `scale(${pop})`)}`}>
        <rect x={52} y={1476} width={976} height={236} rx={48} fill="#000" opacity={0.18} transform="translate(0 12)" />
        <rect x={52} y={1476} width={976} height={236} rx={48} fill={GLASS} />
        <Bell x={150} y={1582} ring={ring} />
        <text x={236} y={1540} fontFamily={T.ui} fontWeight={500} fontSize={34} fill={SOFT}>
          นาฬิกาปลุก · 07:00
        </text>
        {/* toggle */}
        <rect x={880} y={1506} width={112} height={62} rx={31} fill={on > 0.5 ? ALARM : "#D6D8DC"} />
        <circle cx={911 + on * 50} cy={1537} r={25} fill={WHITE} />
        <foreignObject x={228} y={1556} width={780} height={130}>
          <div style={{ fontFamily: T.ui, fontWeight: 700, fontSize: 84, color: INK, lineHeight: "120px", whiteSpace: "nowrap" }}>
            {label.map((g, i) => {
              const t = interpolate(frame, [labelAt + i * 1.2, labelAt + i * 1.2 + 5], [0, 1], clamp);
              return (
                <span key={i} style={{ opacity: t, filter: `blur(${(1 - t) * 8}px)`, display: "inline-block", transform: `translateY(${(1 - t) * -14}px)` }}>
                  {g}
                </span>
              );
            })}
          </div>
        </foreignObject>
        {/* mist dots breathing off the label */}
        {Array.from({ length: 9 }, (_, i) => {
          const t = interpolate(frame, [labelAt + i, labelAt + i + 14], [0, 1], clamp);
          if (t <= 0 || t >= 1) return null;
          return <circle key={i} cx={250 + i * 78 + t * 20} cy={1590 - t * 70 - (i % 3) * 14} r={7 - t * 4} fill={ALARM} opacity={0.6 * (1 - t)} />;
        })}
      </g>
    </Canvas>
  );
}

/**
 * "ออกจากบ้าน": a drawn front door swings open and the word walks out of it,
 * each syllable taking its own hopping step.
 */
export function WalkOut() {
  const frame = useCurrentFrame();
  const open = interpolate(frame, [0, 6], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const word = graphemes("ออกจากบ้าน");
  const doorX = 88;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <Canvas>
        <g opacity={interpolate(frame, [0, 3], [0, 1], clamp)}>
          <rect x={doorX} y={1464} width={170} height={262} rx={10} fill="rgba(20,23,31,0.82)" stroke={WHITE} strokeWidth={10} />
          <rect x={doorX + 12} y={1476} width={146} height={240} fill="#FFD9A0" opacity={0.55 * open} />
          {/* the door leaf swinging out */}
          <g transform={`translate(${doorX + 5} 0) scale(${1 - open * 0.78} 1) translate(${-(doorX + 5)} 0)`}>
            <rect x={doorX + 5} y={1469} width={160} height={252} rx={6} fill="#C6553A" stroke={WHITE} strokeWidth={6} />
            <circle cx={doorX + 138} cy={1600} r={10} fill={WHITE} />
          </g>
        </g>
      </Canvas>
      <div style={{ position: "absolute", left: 282, top: 1500, display: "flex", fontFamily: T.walk, fontWeight: 800, fontStyle: "italic", fontSize: 126, lineHeight: "210px", color: WHITE, whiteSpace: "nowrap" }}>
        {word.map((g, i) => {
          const start = 2 + i * 1.6;
          const t = interpolate(frame, [start, start + 7], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
          const hop = Math.sin(Math.min(1, t) * Math.PI) * 46;
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                opacity: t > 0 ? 1 : 0,
                transform: `translate(${(1 - t) * -260}px, ${-hop}px) rotate(${(1 - t) * -12}deg)`,
                textShadow: `6px 8px 0 ${INK}, 0 0 24px rgba(0,0,0,0.35)`,
                WebkitTextStroke: `3px ${INK}`,
              }}
            >
              {g}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}
