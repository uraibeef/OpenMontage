import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { graphemes } from "../hooks/kit";
import { about, CANVAS, CEDAR, clamp, FRAME, GOLD, GOLD_DK, hash, INK, LEAF, outline, RED, S, WHITE } from "./style";

/**
 * Four round cards, four different objects — each one IS the round's word:
 * 1 a ring-card placard swinging under a spotlight, 2 an arena jumbotron,
 * 3 a banner hoisted between the ring ropes, 4 the judges' paper stamped.
 */

/** Round 1: placard on two cords swings down into a spotlight. "ความมัน" gleams. */
export function CardOne() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const drop = spring({ frame, fps, config: { damping: 7, stiffness: 120, mass: 0.7 } });
  const swing = Math.sin(frame / 3) * 7 * Math.exp(-frame / 10);
  const y = -700 + drop * 700;
  const cone = interpolate(frame, [0, 4], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: INK }}>
      <svg {...FRAME}>
        <defs>
          <radialGradient id="s08-spot" cx="0.5" cy="0.1" r="0.9">
            <stop offset="0" stopColor="rgba(255,240,200,0.55)" />
            <stop offset="1" stopColor="rgba(255,240,200,0)" />
          </radialGradient>
        </defs>
        <path d="M 440 0 L 640 0 L 1040 1920 L 40 1920 Z" fill="url(#s08-spot)" opacity={cone} />
        {/* crowd dots */}
        {Array.from({ length: 70 }, (_, i) => (
          <circle key={i} cx={hash(i) * 1080} cy={1600 + hash(i + 40) * 320} r={22 + hash(i + 3) * 18} fill="#1d1b19" />
        ))}
        <g transform={`translate(0 ${y}) ${about(540, 300, `rotate(${swing})`)}`}>
          <path d="M 300 0 L 250 640 M 780 0 L 830 640" stroke="#8a8a8a" strokeWidth={5} />
          <rect x={150} y={640} width={780} height={620} rx={20} fill={WHITE} stroke={GOLD} strokeWidth={16} />
          <text x={540} y={780} textAnchor="middle" fontFamily={S.ui} fontWeight={700} fontSize={70} fill={RED} letterSpacing={14}>
            ROUND
          </text>
          <text x={540} y={1040} textAnchor="middle" fontFamily={S.card1} fontWeight={900} fontSize={250} fill={INK}>
            1
          </text>
          <rect x={200} y={1080} width={680} height={140} fill={GOLD} />
          <text x={540} y={1180} textAnchor="middle" fontFamily={S.card1} fontWeight={900} fontSize={112} fill={INK}>
            ความมัน
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
}

/** Round 2: arena jumbotron. LED rows flicker on top-down; the word flips in on its LED glow. */
export function CardTwo() {
  const frame = useCurrentFrame();
  const rows = interpolate(frame, [0, 6], [0, 1], clamp);
  const flip = interpolate(frame, [4, 10], [90, 0], { ...clamp, easing: Easing.out(Easing.back(1.4)) });
  const glow = 0.8 + Math.sin(frame * 1.7) * 0.2;

  return (
    <AbsoluteFill style={{ backgroundColor: "#07100B" }}>
      <svg {...FRAME}>
        <defs>
          <pattern id="s08-led" width={14} height={14} patternUnits="userSpaceOnUse">
            <circle cx={7} cy={7} r={4} fill="rgba(114,214,143,0.14)" />
          </pattern>
          <clipPath id="s08-rows">
            <rect x={0} y={0} width={1080} height={1920 * rows} />
          </clipPath>
        </defs>
        <rect x={60} y={500} width={960} height={920} rx={24} fill="#0B0F0C" stroke="#2B3A30" strokeWidth={10} />
        <g clipPath="url(#s08-rows)">
          <rect x={80} y={520} width={920} height={880} fill="url(#s08-led)" />
        </g>
        {/* truss */}
        <path d="M 60 470 H 1020 M 60 440 H 1020" stroke="#3a3a3a" strokeWidth={8} />
        {Array.from({ length: 16 }, (_, i) => (
          <path key={i} d={`M ${60 + i * 60} 440 l 30 30 l 30 -30`} stroke="#3a3a3a" strokeWidth={5} fill="none" />
        ))}
      </svg>
      <div style={{ position: "absolute", top: 610, width: "100%", textAlign: "center", fontFamily: S.ui, fontWeight: 700, fontSize: 84, letterSpacing: 18, color: RED, opacity: rows, textShadow: `0 0 24px ${RED}` }}>
        ROUND 2
      </div>
      <div style={{ position: "absolute", top: 830, width: "100%", textAlign: "center", perspective: 900 }}>
        <div style={{ display: "inline-block", transform: `rotateX(${flip}deg)`, fontFamily: S.card2, fontWeight: 700, fontSize: 176, lineHeight: "260px", color: LEAF, textShadow: `0 0 ${30 * glow}px ${LEAF}, 0 0 6px ${WHITE}` }}>
          ความเหนียว
        </div>
      </div>
      <div style={{ position: "absolute", top: 1180, width: "100%", textAlign: "center", fontFamily: S.ui, fontWeight: 600, fontSize: 44, color: GOLD, letterSpacing: 6, opacity: interpolate(frame, [9, 12], [0, 1], clamp) }}>
        {"ทอง  VS  เขียว"}
      </div>
    </AbsoluteFill>
  );
}

const ROPES = [560, 760, 960] as const;

/** Round 3: three ring ropes; a banner is hoisted UP between them — the word itself gains height. */
export function CardThree() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const hoist = spring({ frame, fps, config: { damping: 12, stiffness: 300, mass: 0.5 } });
  const rope = (i: number) => Math.sin(frame / 2.4 + i) * 10 * Math.exp(-frame / 9);
  const word = graphemes("วอลลุ่ม");

  return (
    <AbsoluteFill style={{ backgroundColor: CEDAR }}>
      <svg {...FRAME}>
        <rect x={0} y={1180} width={1080} height={740} fill={CANVAS} />
        <path d="M 0 1180 L 1080 1180" stroke="#C9BCA3" strokeWidth={6} />
        {/* corner post */}
        <rect x={40} y={420} width={60} height={900} rx={10} fill={RED} stroke={INK} strokeWidth={6} />
        <rect x={980} y={420} width={60} height={900} rx={10} fill={GOLD} stroke={INK} strokeWidth={6} />
        {ROPES.map((y, i) => (
          <path key={y} d={`M 70 ${y} Q 540 ${y + 26 + rope(i)} 1010 ${y}`} stroke={[RED, WHITE, "#2E6FD8"][i]} strokeWidth={22} fill="none" strokeLinecap="round" />
        ))}
        {/* banner */}
        <g transform={`translate(0 ${(1 - hoist) * 900})`}>
          <path d="M 170 700 H 910 L 880 1000 L 910 1150 H 170 L 200 1000 Z" fill={WHITE} stroke={INK} strokeWidth={8} />
          <text x={540} y={775} textAnchor="middle" fontFamily={S.ui} fontWeight={700} fontSize={58} fill={CEDAR} letterSpacing={10}>
            ROUND 3
          </text>
        </g>
      </svg>
      <div style={{ position: "absolute", top: 870, width: "100%", textAlign: "center", fontFamily: S.card3, fontWeight: 700, fontSize: 165, lineHeight: "260px", whiteSpace: "nowrap" }}>
        {word.map((ch, i) => {
          const s = spring({ frame: frame - 2 - i * 0.6, fps, config: { damping: 11, stiffness: 320, mass: 0.45 } });
          return (
            <span key={i} style={{ display: "inline-block", color: INK, transformOrigin: "50% 100%", transform: `translateY(${(1 - s) * 600 + (1 - hoist) * 900}px) scaleY(${0.6 + 0.4 * s + (i % 2) * 0.05})` }}>
              {ch}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}

/** Round 4: the judges' paper. A red "ยกสุดท้าย" stamp slams; "ล้างออก" is typed in. */
export function CardFour() {
  const frame = useCurrentFrame();
  const stamp = interpolate(frame, [0, 5], [2.6, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const ink = frame >= 5 ? 1 : interpolate(frame, [0, 5], [0, 0.9], clamp);
  const typed = Math.floor(interpolate(frame, [6, 14], [0, 1], clamp) * graphemes("ล้างออก").length);
  const word = graphemes("ล้างออก").slice(0, typed).join("");

  return (
    <AbsoluteFill style={{ backgroundColor: CANVAS }}>
      <svg {...FRAME}>
        {/* ruled scorecard paper */}
        {Array.from({ length: 22 }, (_, i) => (
          <path key={i} d={`M 60 ${220 + i * 76} H 1020`} stroke="#CFC2A8" strokeWidth={3} />
        ))}
        <path d="M 170 120 V 1860" stroke={RED} strokeWidth={3} opacity={0.6} />
        <text x={200} y={290} fontFamily={S.ui} fontWeight={700} fontSize={46} fill={GOLD_DK} letterSpacing={4}>
          OFFICIAL SCORECARD · R4
        </text>
        <g transform={about(540, 760, `scale(${stamp}) rotate(-8)`)} opacity={ink}>
          <rect x={150} y={600} width={780} height={320} rx={30} fill="none" stroke={RED} strokeWidth={18} />
          <rect x={180} y={630} width={720} height={260} rx={18} fill="none" stroke={RED} strokeWidth={6} />
          <text x={540} y={815} textAnchor="middle" fontFamily={S.card4} fontWeight={700} fontSize={150} fill={RED}>
            ยกสุดท้าย
          </text>
        </g>
        <text x={210} y={1240} fontFamily={S.card4} fontWeight={700} fontSize={200} fill={INK}>
          {word}
        </text>
        <text x={210} y={1400} fontFamily={S.ui} fontWeight={600} fontSize={40} fill={GOLD_DK} {...outline(CANVAS, 0)}>
          ทอง ____ / เขียว ____
        </text>
      </svg>
    </AbsoluteFill>
  );
}
