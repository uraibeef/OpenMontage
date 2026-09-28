import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { graphemes } from "../hooks/kit";
import { about, CANVAS, CEDAR, clamp, FRAME, GOLD, GOLD_DK, GOLD_LT, hash, INK, LEAF, LIFT, outline, RED, S, WHITE } from "./style";

/**
 * Rounds 1 and 2 — "ของเหนียวเยิ้มทั้งวัน / สเปรย์ช่วยคุมมัน" and
 * "ของเหนียวติดมือ / สเปรย์ไม่เหนอะหนะ". Gold corner hooks ooze, green corner
 * hooks hit clean; each round ends on a judge's score.
 */

/** "เยิ้มทั้งวัน": glossy gold word whose drips keep lengthening while a day clock runs 08:00 -> 20:00. */
export function DripAllDay() {
  const frame = useCurrentFrame();
  const inT = interpolate(frame, [0, 6], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const hour = Math.round(interpolate(frame, [4, 24], [8, 20], clamp));
  const drips = [175, 300, 420, 560, 700, 830, 930];

  return (
    <AbsoluteFill>
      <svg {...FRAME}>
        <defs>
          <linearGradient id="s08-oil" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={GOLD_LT} />
            <stop offset="0.55" stopColor={GOLD} />
            <stop offset="1" stopColor={GOLD_DK} />
          </linearGradient>
        </defs>
        {/* day clock chip */}
        <g opacity={inT}>
          <rect x={330} y={1260} width={420} height={96} rx={48} fill="rgba(14,13,12,0.85)" stroke={GOLD} strokeWidth={4} />
          <text x={540} y={1326} textAnchor="middle" fontFamily={S.ui} fontWeight={700} fontSize={56} fill={GOLD_LT} letterSpacing={4}>
            {`${String(hour).padStart(2, "0")}:00`}
          </text>
        </g>
        {drips.map((x, i) => {
          const len = interpolate(frame, [4 + i * 1.5, 26 + i], [0, 110 + hash(i) * 150], { ...clamp, easing: Easing.in(Easing.quad) });
          const fallY = 1560 + len;
          return (
            <g key={x} opacity={inT}>
              <path d={`M ${x - 12} 1540 Q ${x - 6} ${1540 + len * 0.6} ${x} ${fallY} Q ${x + 6} ${1540 + len * 0.6} ${x + 12} 1540 Z`} fill="url(#s08-oil)" />
              <circle cx={x} cy={fallY} r={9 + len * 0.06} fill={GOLD} stroke={GOLD_DK} strokeWidth={2} />
              <circle cx={x - 3} cy={fallY - 4} r={3} fill={WHITE} opacity={0.8} />
            </g>
          );
        })}
        <g transform={about(540, 1500, `scale(${0.7 + 0.3 * inT})`)} opacity={inT}>
          <text x={540} y={1545} textAnchor="middle" fontFamily={S.drip} fontWeight={800} fontSize={172} fill="url(#s08-oil)" {...outline(INK, 14)}>
            เยิ้มทั้งวัน
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
}

/** "คุมมัน": a green glove jabs in from the right and pops an oil drop; the word locks in a clean frame. */
export function ControlOil() {
  const frame = useCurrentFrame();
  const jab = interpolate(frame, [0, 5, 9], [700, 0, 60], { ...clamp, easing: Easing.out(Easing.cubic) });
  const burst = interpolate(frame, [5, 13], [0, 1], clamp);
  const dropScale = frame < 5 ? 1 : 0;
  const word = interpolate(frame, [6, 11], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2.2)) });
  const DROP = { x: 380, y: 1530 };

  return (
    <AbsoluteFill>
      <svg {...FRAME}>
        {/* the oil drop that gets knocked out */}
        <path transform={about(DROP.x, DROP.y, `scale(${dropScale})`)} d={`M ${DROP.x} ${DROP.y - 90} C ${DROP.x + 60} ${DROP.y - 10}, ${DROP.x + 60} ${DROP.y + 60}, ${DROP.x} ${DROP.y + 60} C ${DROP.x - 60} ${DROP.y + 60}, ${DROP.x - 60} ${DROP.y - 10}, ${DROP.x} ${DROP.y - 90} Z`} fill={GOLD} stroke={INK} strokeWidth={6} />
        {Array.from({ length: 9 }, (_, i) => {
          const a = (i / 9) * Math.PI * 2;
          const r = 40 + burst * 180;
          return <circle key={i} cx={DROP.x + Math.cos(a) * r} cy={DROP.y + Math.sin(a) * r} r={14 * (1 - burst)} fill={GOLD} />;
        })}
        {/* glove */}
        <g transform={`translate(${jab} 0)`}>
          <rect x={560} y={1470} width={600} height={80} rx={20} fill={CEDAR} stroke={INK} strokeWidth={6} />
          <ellipse cx={530} cy={1510} rx={120} ry={100} fill={LEAF} stroke={INK} strokeWidth={8} />
          <path d="M 470 1450 q 40 40 0 110" stroke={CEDAR} strokeWidth={10} fill="none" strokeLinecap="round" />
          <rect x={620} y={1440} width={40} height={140} rx={8} fill={WHITE} stroke={INK} strokeWidth={5} />
        </g>
        {/* word in a clean frame */}
        <g transform={about(540, 1270, `scale(${word})`)}>
          <rect x={230} y={1170} width={620} height={200} fill={WHITE} stroke={CEDAR} strokeWidth={10} />
          <rect x={248} y={1188} width={584} height={164} fill="none" stroke={LEAF} strokeWidth={4} />
          <text x={540} y={1318} textAnchor="middle" fontFamily={S.control} fontWeight={800} fontSize={140} fill={CEDAR}>
            คุมมัน
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
}

/** Judge's slip for round 1: handwritten 9 / 10, then the 10 gets circled in red. */
export function JudgeSlip() {
  const frame = useCurrentFrame();
  const slide = interpolate(frame, [0, 6], [-620, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const write9 = interpolate(frame, [4, 8], [0, 1], clamp);
  const write10 = interpolate(frame, [7, 11], [0, 1], clamp);
  const circle = interpolate(frame, [11, 18], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });

  return (
    <AbsoluteFill>
      <svg {...FRAME}>
        <g transform={`translate(${slide} 0) rotate(-5 300 1200)`}>
          <rect x={60} y={980} width={520} height={470} rx={8} fill={CANVAS} stroke={INK} strokeWidth={5} style={{ filter: "drop-shadow(0 18px 24px rgba(0,0,0,0.5))" }} />
          <rect x={60} y={980} width={520} height={80} fill={INK} />
          <text x={320} y={1036} textAnchor="middle" fontFamily={S.ui} fontWeight={700} fontSize={40} fill={WHITE} letterSpacing={4}>
            JUDGE · ยก 1
          </text>
          <path d="M 320 1070 V 1430" stroke="#BFB199" strokeWidth={4} />
          <text x={190} y={1130} textAnchor="middle" fontFamily={S.ui} fontWeight={700} fontSize={36} fill={GOLD_DK}>
            ทอง
          </text>
          <text x={450} y={1130} textAnchor="middle" fontFamily={S.ui} fontWeight={700} fontSize={36} fill={CEDAR}>
            เขียว
          </text>
          <text x={190} y={1340} textAnchor="middle" fontFamily={S.judge} fontSize={190} fill={INK} opacity={write9}>
            9
          </text>
          <text x={450} y={1340} textAnchor="middle" fontFamily={S.judge} fontSize={190} fill={INK} opacity={write10}>
            10
          </text>
          <ellipse cx={450} cy={1275} rx={120} ry={105} fill="none" stroke={RED} strokeWidth={10} pathLength={1} strokeDasharray={`${circle} 1`} transform={about(450, 1275, "rotate(-70)")} />
        </g>
      </svg>
    </AbsoluteFill>
  );
}

/** "ติดมือ": the word is pulled apart between two points; gold goo strings stretch between the halves and won't let go. */
export function StuckToHand() {
  const frame = useCurrentFrame();
  const pull = interpolate(frame, [3, 22], [0, 1], { ...clamp, easing: Easing.inOut(Easing.sin) });
  const snapBack = Math.sin(frame / 2) * 6 * pull;
  const gap = 20 + pull * 260 + snapBack;
  const inT = interpolate(frame, [0, 5], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
  const Y = 1000;

  return (
    <AbsoluteFill>
      <svg {...FRAME}>
        {/* goo strings between halves */}
        {[-60, -20, 25, 60].map((dy, i) => {
          const sag = 30 + pull * (60 + i * 12);
          const w = Math.max(4, 22 - pull * 16 + i);
          return (
            <path key={dy} d={`M ${540 - gap / 2} ${Y + dy} Q 540 ${Y + dy + sag} ${540 + gap / 2} ${Y + dy}`} stroke={GOLD} strokeWidth={w} fill="none" strokeLinecap="round" opacity={inT} />
          );
        })}
        <g transform={about(540, Y, `scale(${inT})`)}>
          <text x={540 - gap / 2} y={Y + 70} textAnchor="end" fontFamily={S.stuck} fontWeight={700} fontSize={220} fill={GOLD} {...outline(INK, 16)} transform={about(540 - gap / 2, Y, `rotate(${-pull * 6})`)}>
            ติด
          </text>
          <text x={540 + gap / 2} y={Y + 70} textAnchor="start" fontFamily={S.stuck} fontWeight={700} fontSize={220} fill={GOLD} {...outline(INK, 16)} transform={about(540 + gap / 2, Y, `rotate(${pull * 6})`)}>
            มือ
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
}

/** "ไม่เหนอะหนะ": letters land as a combo of jabs, each with an impact spark; a judge paddle "10" pops up after. */
export function CleanCombo() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const g = graphemes("ไม่เหนอะหนะ");
  const paddle = spring({ frame: frame - 16, fps, config: { damping: 10, stiffness: 200, mass: 0.6 } });

  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 230, width: "100%", textAlign: "center", fontFamily: S.clean, fontWeight: 700, fontSize: 150, lineHeight: "230px", whiteSpace: "nowrap" }}>
        {g.map((ch, i) => {
          const at = i * 1.6;
          const t = interpolate(frame, [at, at + 3], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
          const side = i % 2 === 0 ? -1 : 1;
          return (
            <span key={i} style={{ display: "inline-block", color: WHITE, opacity: t > 0.01 ? 1 : 0, transform: `translateX(${(1 - t) * side * 160}px) scale(${1 + (1 - t) * 0.6})`, WebkitTextStroke: `10px ${CEDAR}`, paintOrder: "stroke fill", textShadow: LIFT }}>
              {ch}
            </span>
          );
        })}
      </div>
      <svg {...FRAME}>
        {g.map((_, i) => {
          const at = i * 1.6 + 2;
          const s = interpolate(frame, [at, at + 5], [0, 1], clamp);
          const x = 200 + (i / (g.length - 1)) * 680;
          return (
            <g key={i} opacity={1 - s} transform={about(x, 330, `scale(${0.4 + s})`)}>
              {[0, 1, 2, 3, 4, 5].map((k) => {
                const a = (k / 6) * Math.PI * 2 + i;
                return <path key={k} d={`M ${x + Math.cos(a) * 40} ${330 + Math.sin(a) * 40} L ${x + Math.cos(a) * 80} ${330 + Math.sin(a) * 80}`} stroke={LEAF} strokeWidth={8} strokeLinecap="round" />;
              })}
            </g>
          );
        })}
        {/* judge paddle */}
        <g transform={`translate(0 ${(1 - paddle) * 700}) rotate(${(1 - paddle) * 20} 900 700)`}>
          <rect x={885} y={620} width={30} height={280} rx={8} fill="#8B5A2B" stroke={INK} strokeWidth={5} />
          <circle cx={900} cy={560} r={120} fill={WHITE} stroke={CEDAR} strokeWidth={12} />
          <text x={900} y={610} textAnchor="middle" fontFamily={S.ui} fontWeight={700} fontSize={130} fill={CEDAR}>
            10
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
}
