import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { graphemes } from "../hooks/kit";
import { about, clamp, FRAME, GREASE, GREASE_DK, hash, INK, RED, S, WHITE } from "./style";

/**
 * Beat 3 — "ของเหนียวๆ ที่ใส่อยู่ ตกบ่ายก็มันเยิ้ม".
 * Generic gel/wax only ("ของเหนียวๆ"): the word hangs off gooey strings;
 * then an afternoon clock spins and a shine meter redlines on greasy hair.
 */

const TOP = 250;

/** "ของเหนียวๆ" drops off a gel blob; amber strings stretch thin behind each letter. */
export function StickyWord() {
  const frame = useCurrentFrame();
  const g = graphemes("ของเหนียวๆ");
  const blob = interpolate(frame, [0, 5], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
  const width = 880;
  const step = width / g.length;

  return (
    <AbsoluteFill>
      <svg {...FRAME}>
        {/* the gel blob they hang from */}
        <g transform={about(540, TOP, `scale(${blob})`)}>
          <path d={`M 90 ${TOP - 30} C 200 ${TOP - 60}, 880 ${TOP - 60}, 990 ${TOP - 30} C 1000 ${TOP + 30}, 80 ${TOP + 30}, 90 ${TOP - 30} Z`} fill={GREASE} stroke={GREASE_DK} strokeWidth={8} />
          <path d={`M 170 ${TOP - 30} C 300 ${TOP - 44}, 500 ${TOP - 46}, 620 ${TOP - 40}`} stroke="rgba(255,255,255,0.8)" strokeWidth={10} strokeLinecap="round" fill="none" />
        </g>
        {g.map((ch, i) => {
          const start = 3 + i * 1.3;
          const fall = interpolate(frame, [start, start + 10], [0, 1], { ...clamp, easing: Easing.out(Easing.quad) });
          const bounce = Math.sin(Math.max(0, frame - start - 10) / 2.2) * 14 * Math.exp(-Math.max(0, frame - start - 10) / 7);
          const y = TOP + 70 + fall * (330 + hash(i) * 60) + bounce;
          const x = 100 + step * (i + 0.5);
          const thick = 22 * (1 - fall * 0.8);
          return (
            <g key={i}>
              <path d={`M ${x - thick / 2} ${TOP + 10} Q ${x} ${(TOP + y) / 2} ${x - thick / 2 + 2} ${y - 90} L ${x + thick / 2 - 2} ${y - 90} Q ${x} ${(TOP + y) / 2} ${x + thick / 2} ${TOP + 10} Z`} fill={GREASE} stroke={GREASE_DK} strokeWidth={3} opacity={fall > 0 ? 0.95 : 0} />
              <text x={x} y={y} textAnchor="middle" fontFamily={S.sticky} fontSize={150} fill={GREASE} stroke={INK} strokeWidth={12} strokeLinejoin="round" style={{ paintOrder: "stroke" }} opacity={fall > 0 ? 1 : 0}>
                {ch}
              </text>
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
}

const METER = { x0: 150, x1: 930, y: 1450 };

/** Afternoon clock spins to บ่าย, the shine meter slams into the red, glints pop on the hair. */
export function ShineMeter() {
  const frame = useCurrentFrame();
  const clock = interpolate(frame, [0, 12], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const needle = interpolate(frame, [8, 20], [0.15, 0.97], { ...clamp, easing: Easing.out(Easing.back(1.4)) });
  const jitter = frame > 20 ? (hash(frame) - 0.5) * 0.02 : 0;
  const nx = METER.x0 + (METER.x1 - METER.x0) * (needle + jitter);
  const word = interpolate(frame, [18, 24], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const sweep = interpolate(frame, [24, 36], [-300, 1300], clamp);

  return (
    <AbsoluteFill>
      <svg {...FRAME}>
        <defs>
          <linearGradient id="s04-gloss" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFE9A8" />
            <stop offset="0.5" stopColor={GREASE} />
            <stop offset="1" stopColor={GREASE_DK} />
          </linearGradient>
          <clipPath id="s04-gloss-clip">
            <text x={540} y={1700} textAnchor="middle" fontFamily={S.greasy} fontWeight={800} fontSize={190}>
              มันเยิ้ม
            </text>
          </clipPath>
        </defs>

        {/* clock chip */}
        <g transform="translate(90 190)">
          <rect x={0} y={0} width={420} height={120} rx={60} fill="rgba(11,11,12,0.82)" />
          <circle cx={60} cy={60} r={40} fill={WHITE} />
          <path d={`M 60 60 L ${60 + Math.sin(clock * Math.PI * 2 * 1.5) * 28} ${60 - Math.cos(clock * Math.PI * 2 * 1.5) * 28}`} stroke={INK} strokeWidth={6} strokeLinecap="round" />
          <path d={`M 60 60 L ${60 + Math.sin((0.25 + clock * 0.25) * Math.PI * 2) * 20} ${60 - Math.cos((0.25 + clock * 0.25) * Math.PI * 2) * 20}`} stroke={RED} strokeWidth={7} strokeLinecap="round" />
          <text x={124} y={82} fontFamily={S.greasy} fontWeight={800} fontSize={60} fill={WHITE}>
            {clock < 1 ? "เช้า..." : "ตกบ่าย"}
          </text>
        </g>

        {/* glints on the hair */}
        {Array.from({ length: 6 }, (_, i) => {
          const born = 10 + i * 3;
          const t = interpolate(frame, [born, born + 6, born + 12], [0, 1, 0.4], clamp);
          const x = 250 + hash(i * 3.7) * 580;
          const y = 380 + hash(i * 1.9) * 260;
          const r = 26 + hash(i) * 24;
          return (
            <path key={i} transform={about(x, y, `scale(${t}) rotate(${frame * 3})`)} d={`M ${x} ${y - r} Q ${x} ${y} ${x + r} ${y} Q ${x} ${y} ${x} ${y + r} Q ${x} ${y} ${x - r} ${y} Q ${x} ${y} ${x} ${y - r} Z`} fill={WHITE} opacity={t} />
          );
        })}

        {/* shine meter */}
        <rect x={METER.x0 - 30} y={METER.y - 110} width={METER.x1 - METER.x0 + 60} height={170} rx={24} fill="rgba(11,11,12,0.8)" />
        <text x={METER.x0} y={METER.y - 58} fontFamily={S.ui} fontWeight={700} fontSize={34} fill={WHITE} letterSpacing={2}>
          SHINE
        </text>
        <text x={METER.x1} y={METER.y - 58} textAnchor="end" fontFamily={S.ui} fontWeight={700} fontSize={34} fill={RED}>
          +3.0
        </text>
        {Array.from({ length: 25 }, (_, i) => {
          const x = METER.x0 + ((METER.x1 - METER.x0) * i) / 24;
          const hot = i >= 17;
          return <path key={i} d={`M ${x} ${METER.y} v ${i % 4 === 0 ? -34 : -18}`} stroke={hot ? RED : WHITE} strokeWidth={i % 4 === 0 ? 6 : 4} />;
        })}
        <rect x={METER.x0} y={METER.y + 10} width={(METER.x1 - METER.x0) * needle} height={14} rx={7} fill={needle > 0.7 ? RED : GREASE} />
        <path d={`M ${nx} ${METER.y - 44} l -18 -26 h 36 Z`} fill={GREASE} />

        {/* glossy word with a light sweep */}
        <g opacity={word} transform={about(540, 1640, `scale(${0.8 + 0.2 * word})`)}>
          <text x={540} y={1700} textAnchor="middle" fontFamily={S.greasy} fontWeight={800} fontSize={190} fill="url(#s04-gloss)" stroke={INK} strokeWidth={14} strokeLinejoin="round" style={{ paintOrder: "stroke" }}>
            มันเยิ้ม
          </text>
          <g clipPath="url(#s04-gloss-clip)">
            <rect x={sweep} y={1480} width={110} height={300} fill="rgba(255,255,255,0.75)" transform={`skewX(-20)`} />
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
}
