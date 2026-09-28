import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { graphemes } from "../hooks/kit";
import { about, BLUSH, CHERRY, clamp, CREAM, FRAME, GOLD, INK, LEAF, ROSE, S, WHITE } from "./style";

/**
 * Beat 2 — "เพื่อนยื่นขวดเขียวให้ บอกฉีดก่อนแล้วค่อยจัด".
 * The friend speaks in rom-com cue cards (the doorstep-confession trope):
 * three different hand-lettered cards, each arriving its own way.
 */

/** Card 1: a lined index card drops in from the top-left, the friend's hand-off gets a drawn motion trail. */
export function HandOffCard() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const drop = spring({ frame, fps, config: { damping: 12, stiffness: 170, mass: 0.8 } });
  const trail = interpolate(frame, [4, 16], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const words = graphemes("เพื่อนยื่นให้");
  const ink = interpolate(frame, [6, 20], [0, words.length], clamp);

  return (
    <AbsoluteFill>
      <svg {...FRAME}>
        {/* motion trail: the bottle was just handed over from off-frame right */}
        {[0, 1, 2].map((i) => (
          <path
            key={i}
            d={`M 1080 ${1010 + i * 70} C 1000 ${1000 + i * 70}, 960 ${1040 + i * 60}, 900 ${1060 + i * 55}`}
            stroke={CREAM}
            strokeWidth={12 - i * 3}
            strokeLinecap="round"
            fill="none"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - trail}
            opacity={0.9}
          />
        ))}
        <g transform={`translate(0 ${(1 - drop) * -520}) ${about(300, 380, `rotate(${-5 + (1 - drop) * -14})`)}`}>
          <rect x={70} y={210} width={470} height={330} rx={10} fill={CREAM} stroke={INK} strokeWidth={4} style={{ filter: "drop-shadow(0 16px 26px rgba(0,0,0,0.45))" }} />
          <path d="M 70 272 H 540" stroke={ROSE} strokeWidth={3} />
          {[0, 1, 2, 3].map((i) => (
            <path key={i} d={`M 90 ${330 + i * 56} H 520`} stroke="#9EC3E6" strokeWidth={2} />
          ))}
          <text x={100} y={255} fontFamily={S.card1} fontSize={30} fill={CHERRY}>
            1/3
          </text>
        </g>
      </svg>
      <div
        style={{
          position: "absolute",
          top: 300 + (1 - drop) * -520,
          left: 70,
          width: 470,
          textAlign: "center",
          fontFamily: S.card1,
          fontSize: 92,
          lineHeight: "200px",
          color: INK,
          transform: `rotate(${-5 + (1 - drop) * -14}deg)`,
          whiteSpace: "nowrap",
        }}
      >
        {words.map((ch, i) => (
          <span key={i} style={{ opacity: i < ink ? 1 : 0 }}>
            {ch}
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
}

/** Card 2: a blush card taped to the frame; "ฉีดก่อน" is stamped letter by letter, mist dots puff off it. */
export function SprayFirstCard() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const swing = spring({ frame, fps, config: { damping: 9, stiffness: 150, mass: 0.7 } });
  const words = graphemes("ฉีดก่อน");
  const mist = interpolate(frame, [8, 24], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ transform: `rotate(${(1 - swing) * 22}deg)`, transformOrigin: "900px 1180px" }}>
      <svg {...FRAME}>
        <rect x={500} y={1210} width={500} height={330} rx={6} fill={BLUSH} stroke={INK} strokeWidth={4} transform={about(750, 1375, "rotate(4)")} style={{ filter: "drop-shadow(0 16px 26px rgba(0,0,0,0.4))" }} />
        {/* tape strips */}
        <rect x={560} y={1180} width={140} height={48} fill={WHITE} opacity={0.75} transform={about(630, 1204, "rotate(-12)")} />
        <rect x={830} y={1196} width={140} height={48} fill={WHITE} opacity={0.75} transform={about(900, 1220, "rotate(14)")} />
        {Array.from({ length: 14 }, (_, i) => {
          const a = (i / 14) * Math.PI - Math.PI;
          const r = 60 + mist * (140 + (i % 3) * 40);
          return <circle key={i} cx={560 + Math.cos(a) * r} cy={1260 + Math.sin(a) * r * 0.8} r={6 + (i % 3) * 3} fill={WHITE} opacity={(1 - mist) * 0.9} />;
        })}
        <text x={560} y={1500} fontFamily={S.card2} fontSize={34} fill={INK} opacity={0.7} transform={about(750, 1375, "rotate(4)")}>
          2/3
        </text>
      </svg>
      <div style={{ position: "absolute", top: 1240, left: 500, width: 500, textAlign: "center", fontFamily: S.card2, fontSize: 124, lineHeight: "220px", color: CHERRY, transform: "rotate(4deg)", whiteSpace: "nowrap" }}>
        {words.map((ch, i) => {
          const s = spring({ frame: frame - 3 - i * 1.6, fps, config: { damping: 10, stiffness: 260, mass: 0.5 } });
          return (
            <span key={i} style={{ display: "inline-block", opacity: s > 0.05 ? 1 : 0, transform: `scale(${1.8 - 0.8 * s})` }}>
              {ch}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}

/** Card 3: two drawn hands flip the card over (rotateY) to reveal "แล้วค่อยจัด", with an arrow comb-stroke. */
export function StyleAfterCard() {
  const frame = useCurrentFrame();
  const flip = interpolate(frame, [0, 9], [180, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const back = flip > 90;
  const arrow = interpolate(frame, [10, 20], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const bob = Math.sin(frame / 5) * 5;

  return (
    <AbsoluteFill style={{ transform: `translateY(${bob}px)` }}>
      <div style={{ position: "absolute", top: 200, left: 60, width: 560, height: 330, perspective: 1400 }}>
        <div
          style={{
            width: "100%",
            height: "100%",
            transform: `rotateY(${flip}deg) rotate(-3deg)`,
            background: back ? "#DCD2C4" : WHITE,
            border: `4px solid ${INK}`,
            borderRadius: 8,
            boxShadow: "0 18px 30px rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {!back && (
            <div style={{ fontFamily: S.card3, fontWeight: 700, fontSize: 98, color: INK, lineHeight: "180px", whiteSpace: "nowrap" }}>
              แล้ว<span style={{ color: CHERRY }}>ค่อยจัด</span>
            </div>
          )}
        </div>
      </div>
      <svg {...FRAME}>
        {/* comb-stroke arrow sweeping up toward the hair of the next scene */}
        <path d="M 250 520 C 300 610, 420 620, 520 560" stroke={GOLD} strokeWidth={10} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - arrow} transform="translate(0 20)" />
        <path d="M 488 548 L 526 578 L 530 530" stroke={GOLD} strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={arrow > 0.95 ? 1 : 0} transform="translate(0 20)" />
        {/* the friend's hands holding the card (drawn, no face) */}
        <g transform="translate(78 500) rotate(-3)">
          <path d="M 0 30 C -10 -5, 20 -30, 50 -20 L 80 -6 C 92 0, 86 18, 72 16 L 40 10 C 34 30, 20 44, 0 30 Z" fill="#E8B08E" stroke={INK} strokeWidth={4} />
        </g>
        <g transform="translate(600 480) rotate(-3) scale(-1 1)">
          <path d="M 0 30 C -10 -5, 20 -30, 50 -20 L 80 -6 C 92 0, 86 18, 72 16 L 40 10 C 34 30, 20 44, 0 30 Z" fill="#E8B08E" stroke={INK} strokeWidth={4} />
        </g>
        <text x={620} y={260} fontFamily={S.card3} fontWeight={700} fontSize={30} fill={LEAF} opacity={arrow}>
          3/3
        </text>
      </svg>
    </AbsoluteFill>
  );
}
