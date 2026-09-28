import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { graphemes } from "../hooks/kit";
import { about, CEDAR, clamp, FRAME, GOLD, GOLD_DK, GOLD_LT, hash, INK, LEAF, LIFT, outline, RED, S, WHITE } from "./style";

/**
 * Beat 0 — "สเปรย์เพิ่มวอลลุ่ม ... เทียบกับของเหนียวๆ ที่มึงใช้อยู่".
 * Fighter introductions: the green corner's nameplate, a VS slam, then the
 * gold-trunks gel blob bounces into its corner.
 */

/** Green corner: a skewed poster slab slides in; the name stamps on letter by letter. */
export function GreenCorner() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const slab = interpolate(frame, [0, 7], [1200, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const tag = interpolate(frame, [4, 10], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
  const name = graphemes("สเปรย์เพิ่มวอลลุ่ม");
  const tape = interpolate(frame, [16, 26], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ transform: "translateY(-1150px)" }}>
      <svg {...FRAME}>
        <g transform={`translate(${slab} 0)`}>
          <path d="M 70 1390 L 1080 1360 L 1080 1640 L 40 1665 Z" fill={CEDAR} />
          <path d="M 70 1390 L 1080 1360" stroke={LEAF} strokeWidth={10} />
          <path d="M 40 1665 L 1080 1640" stroke={GOLD} strokeWidth={6} />
        </g>
        <g transform={about(250, 1330, `scale(${tag}) rotate(-4)`)}>
          <rect x={90} y={1282} width={330} height={82} rx={8} fill={LEAF} stroke={INK} strokeWidth={5} />
          <text x={255} y={1339} textAnchor="middle" fontFamily={S.ui} fontWeight={700} fontSize={44} fill={INK} letterSpacing={3}>
            มุมเขียว
          </text>
        </g>
        {/* tale of the tape: the one real spec we can print */}
        <g opacity={tape}>
          <text x={100} y={1730} fontFamily={S.ui} fontWeight={600} fontSize={36} fill={WHITE} style={{ textShadow: LIFT }}>
            {"น้ำหนัก 100ml  ·  กลิ่นซีดาร์วูด"}
          </text>
          <path d={`M 100 1750 H ${100 + 700 * tape}`} stroke={LEAF} strokeWidth={4} />
        </g>
      </svg>
      <div style={{ position: "absolute", top: 1418, left: 0, width: 1080, textAlign: "center", fontFamily: S.poster, fontSize: 98, lineHeight: "200px", whiteSpace: "nowrap", transform: "rotate(-1.6deg)" }}>
        {name.map((ch, i) => {
          const s = spring({ frame: frame - 6 - i * 0.9, fps, config: { damping: 13, stiffness: 260, mass: 0.5 } });
          return (
            <span key={i} style={{ display: "inline-block", color: WHITE, opacity: s > 0.03 ? 1 : 0, transform: `scale(${2.2 - 1.2 * s})`, WebkitTextStroke: `8px ${INK}`, paintOrder: "stroke fill" }}>
              {ch}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}

/** "VS" drops from the lights and slams; the frame shakes; "เทียบกับ" rides a red plate above it. */
export function VsSlam() {
  const frame = useCurrentFrame();
  const drop = interpolate(frame, [0, 5], [3.2, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const land = frame >= 5;
  const shake = land ? Math.exp(-(frame - 5) / 4) * 16 : 0;
  const dx = (hash(frame) - 0.5) * shake;
  const dy = (hash(frame + 9) - 0.5) * shake;
  const plate = interpolate(frame, [6, 12], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.8)) });
  const ring = interpolate(frame, [5, 16], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ transform: `translate(${dx}px, ${dy}px)` }}>
      <svg {...FRAME}>
        {/* impact ring */}
        <ellipse cx={540} cy={1640} rx={200 + ring * 380} ry={60 + ring * 110} fill="none" stroke={WHITE} strokeWidth={14 * (1 - ring)} opacity={1 - ring} />
        <g transform={about(540, 1640, `scale(${plate})`)}>
          <rect x={330} y={1400} width={420} height={96} fill={RED} transform={about(540, 1448, "skewX(-12)")} />
          <text x={540} y={1470} textAnchor="middle" fontFamily={S.vs} fontStyle="italic" fontWeight={900} fontSize={66} fill={WHITE}>
            เทียบกับ
          </text>
        </g>
        <g transform={about(540, 1680, `scale(${drop})`)} opacity={interpolate(frame, [0, 2], [0, 1], clamp)}>
          <text x={540} y={1790} textAnchor="middle" fontFamily={S.vs} fontStyle="italic" fontWeight={900} fontSize={330} fill={GOLD} {...outline(INK, 22)} dx={-6}>
            V
          </text>
          <text x={660} y={1790} textAnchor="middle" fontFamily={S.vs} fontStyle="italic" fontWeight={900} fontSize={330} fill={LEAF} {...outline(INK, 22)}>
            S
          </text>
          <path d="M 470 1830 L 640 1530" stroke={WHITE} strokeWidth={10} />
        </g>
      </svg>
    </AbsoluteFill>
  );
}

/** The gel blob in gold trunks: a translucent amber lump with a gloss, brows and gloves. */
function GelBlob({ squash, blink }: { squash: number; blink: boolean }) {
  return (
    <g transform={about(200, 1800, `scale(${1 + squash * 0.18} ${1 - squash * 0.2})`)}>
      <path d="M 70 1790 C 40 1640, 110 1500, 205 1495 C 300 1490, 360 1620, 340 1790 Z" fill={GOLD} opacity={0.92} stroke={GOLD_DK} strokeWidth={7} />
      <path d="M 120 1580 C 140 1535, 180 1520, 215 1522" stroke={GOLD_LT} strokeWidth={16} strokeLinecap="round" fill="none" />
      {/* drips */}
      <path d="M 95 1700 q 6 40 -2 70" stroke={GOLD} strokeWidth={14} strokeLinecap="round" />
      <path d="M 318 1690 q 8 30 2 60" stroke={GOLD} strokeWidth={12} strokeLinecap="round" />
      {/* face */}
      <path d="M 150 1600 l 40 14 M 270 1600 l -40 14" stroke={INK} strokeWidth={9} strokeLinecap="round" />
      <ellipse cx={175} cy={1635} rx={10} ry={blink ? 2 : 12} fill={INK} />
      <ellipse cx={245} cy={1635} rx={10} ry={blink ? 2 : 12} fill={INK} />
      <path d="M 180 1672 q 30 -14 60 0" stroke={INK} strokeWidth={7} fill="none" strokeLinecap="round" />
      {/* gold trunks */}
      <path d="M 80 1735 H 335 L 342 1800 H 215 L 205 1775 L 195 1800 H 72 Z" fill={GOLD_DK} stroke={INK} strokeWidth={6} />
      <rect x={80} y={1733} width={255} height={18} fill={GOLD_LT} />
      {/* gloves */}
      <circle cx={70} cy={1660} r={42} fill={RED} stroke={INK} strokeWidth={6} />
      <circle cx={350} cy={1640} r={42} fill={RED} stroke={INK} strokeWidth={6} />
    </g>
  );
}

/** Gold corner: the blob bounces in, the gooey name stretches off the slab, "ที่มึงใช้อยู่" points at the head. */
export function GelCorner() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 9, stiffness: 160, mass: 0.8 } });
  const squash = Math.max(0, Math.sin(frame / 3.2)) * Math.exp(-frame / 12);
  const name = graphemes("ของเหนียวๆ");
  const point = interpolate(frame, [12, 18], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
  const bob = Math.sin(frame / 4) * 10;

  return (
    <AbsoluteFill>
      <svg {...FRAME}>
        <path d="M 0 1560 L 1080 1590 L 1080 1920 L 0 1920 Z" fill={GOLD_DK} opacity={0.9} />
        <path d="M 0 1560 L 1080 1590" stroke={GOLD} strokeWidth={10} />
        <g transform={`translate(${(1 - enter) * -500} 20)`}>
          <GelBlob squash={squash} blink={frame % 22 < 2} />
        </g>
        <g transform={about(260, 1545, `scale(${enter})`)}>
          <rect x={60} y={1500} width={300} height={70} rx={8} fill={GOLD} stroke={INK} strokeWidth={5} />
          <text x={210} y={1549} textAnchor="middle" fontFamily={S.ui} fontWeight={700} fontSize={38} fill={INK} letterSpacing={3}>
            มุมทอง
          </text>
        </g>
        {/* pointer tag up to the head */}
        <g opacity={point} transform={`translate(0 ${bob})`}>
          <g transform={about(760, 300, `scale(${point})`)}>
            <rect x={560} y={236} width={440} height={104} rx={52} fill={INK} stroke={GOLD} strokeWidth={5} />
            <text x={780} y={307} textAnchor="middle" fontFamily={S.goo} fontSize={64} fill={GOLD_LT}>
              ที่มึงใช้อยู่
            </text>
          </g>
          <path d="M 640 350 Q 600 420 560 450" stroke={GOLD} strokeWidth={10} fill="none" strokeLinecap="round" />
          <path d="M 548 420 L 556 458 L 594 450" stroke={GOLD} strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
      <div style={{ position: "absolute", top: 1630, left: 370, width: 690, fontFamily: S.goo, fontSize: 124, lineHeight: "200px", whiteSpace: "nowrap" }}>
        {name.map((ch, i) => {
          const t = interpolate(frame, [2 + i * 1.5, 12 + i * 1.5], [0, 1], { ...clamp, easing: Easing.out(Easing.elastic(1.2)) });
          return (
            <span key={i} style={{ display: "inline-block", color: GOLD, transformOrigin: "50% 0%", transform: `scaleY(${0.2 + 0.8 * t}) translateY(${(1 - t) * -80}px)`, opacity: t > 0.02 ? 1 : 0, WebkitTextStroke: `10px ${INK}`, paintOrder: "stroke fill" }}>
              {ch}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}
