import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { graphemes } from "../hooks/kit";
import { about, CEDAR, clamp, FRAME, GOLD, GOLD_DK, GOLD_LT, hash, INK, LEAF, LIFT, outline, RED, S, WHITE } from "./style";

/**
 * Rounds 3 and 4 — "ของเหนียวทำผมแปะ / สเปรย์ดันผมขึ้นจากโคน" and
 * "ของเหนียวสระหลายรอบ / สเปรย์สระทีเดียวหลุด".
 */

/** "แปะ": a gold glove drops on the word and flattens it into a pancake; the ref counts it out. */
export function FlatKnockdown() {
  const frame = useCurrentFrame();
  const fall = interpolate(frame, [4, 9], [-900, 0], { ...clamp, easing: Easing.in(Easing.cubic) });
  const hit = frame >= 9;
  const squash = hit ? interpolate(frame, [9, 12], [1, 0.34], { ...clamp, easing: Easing.out(Easing.cubic) }) : 1;
  const lift = hit ? interpolate(frame, [12, 17], [0, -1500], { ...clamp, easing: Easing.in(Easing.cubic) }) : 0;
  const count = hit ? Math.min(3, 1 + Math.floor((frame - 12) / 5)) : 0;
  const inT = interpolate(frame, [0, 4], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
  const BASE = 1640;

  return (
    <AbsoluteFill>
      <svg {...FRAME}>
        <g transform={about(540, BASE, `scale(${(1 + (1 - squash) * 0.9) * inT} ${squash * inT})`)}>
          <text x={540} y={BASE} textAnchor="middle" fontFamily={S.flat} fontSize={300} fill={GOLD} {...outline(INK, 18)}>
            แปะ
          </text>
        </g>
        {hit && frame < 16 && (
          <g opacity={interpolate(frame, [9, 16], [1, 0], clamp)}>
            {[-1, 1].map((s) => (
              <path key={s} d={`M ${540 + s * 360} ${BASE - 20} l ${s * 120} -30 M ${540 + s * 360} ${BASE} l ${s * 140} 0 M ${540 + s * 360} ${BASE + 20} l ${s * 120} 30`} stroke={WHITE} strokeWidth={10} strokeLinecap="round" />
            ))}
          </g>
        )}
        {/* the glove from above */}
        <g transform={`translate(0 ${fall + lift + 130})`}>
          <rect x={470} y={1000} width={140} height={330} rx={20} fill={GOLD_DK} stroke={INK} strokeWidth={6} />
          <rect x={455} y={1300} width={170} height={40} rx={8} fill={WHITE} stroke={INK} strokeWidth={5} />
          <path d="M 410 1340 C 400 1470, 480 1520, 540 1520 C 620 1520, 690 1470, 670 1340 Z" fill={GOLD} stroke={INK} strokeWidth={8} />
          <path d="M 450 1390 q 40 20 90 10" stroke={GOLD_LT} strokeWidth={12} fill="none" strokeLinecap="round" />
        </g>
        {/* ref's count */}
        {count > 0 && (
          <g>
            <rect x={760} y={1260} width={250} height={130} rx={16} fill={INK} stroke={WHITE} strokeWidth={4} />
            <text x={885} y={1352} textAnchor="middle" fontFamily={S.ui} fontWeight={700} fontSize={80} fill={WHITE}>
              {`นับ ${count}`}
            </text>
          </g>
        )}
      </svg>
    </AbsoluteFill>
  );
}

/** "ดันผม": an uppercut — the letters launch UP on a green swoosh arc. */
export function UppercutPush() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const g = graphemes("ดันผม");
  const arc = interpolate(frame, [0, 8], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });

  return (
    <AbsoluteFill>
      <svg {...FRAME}>
        <path d="M 180 1860 C 260 1560, 520 1420, 900 1330" stroke={LEAF} strokeWidth={46} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${arc} 1`} opacity={0.85} />
        <path d="M 180 1860 C 260 1560, 520 1420, 900 1330" stroke={WHITE} strokeWidth={12} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${arc} 1`} />
        <path d="M 860 1290 L 940 1322 L 880 1390" stroke={WHITE} strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={arc > 0.95 ? 1 : 0} />
      </svg>
      <div style={{ position: "absolute", top: 1100, width: "100%", textAlign: "center", fontFamily: S.lift, fontWeight: 700, fontSize: 230, lineHeight: "300px", whiteSpace: "nowrap" }}>
        {g.map((ch, i) => {
          const s = spring({ frame: frame - 3 - i * 2, fps, config: { damping: 8, stiffness: 180, mass: 0.6 } });
          return (
            <span key={i} style={{ display: "inline-block", color: LEAF, opacity: s > 0.02 ? 1 : 0, transform: `translateY(${(1 - s) * 520}px) rotate(${(1 - s) * -25}deg)`, WebkitTextStroke: `12px ${INK}`, paintOrder: "stroke fill", textShadow: LIFT }}>
              {ch}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}

/** "ขึ้นจากโคน": a row of root arrows grows up from a baseline, carrying the words on their tips. */
export function FromTheRoots() {
  const frame = useCurrentFrame();
  const grow = interpolate(frame, [0, 12], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const word = interpolate(frame, [5, 11], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.8)) });
  const BASE = 560;

  return (
    <AbsoluteFill>
      <svg {...FRAME}>
        <path d={`M 90 ${BASE} H 990`} stroke={WHITE} strokeWidth={6} strokeDasharray="14 12" opacity={0.9} />
        <text x={100} y={BASE + 50} fontFamily={S.ui} fontWeight={700} fontSize={34} fill={WHITE} letterSpacing={4} style={{ textShadow: LIFT }}>
          โคนผม
        </text>
        {Array.from({ length: 7 }, (_, i) => {
          const x = 160 + i * 127;
          const h = (150 + hash(i) * 70) * grow;
          return (
            <g key={i}>
              <path d={`M ${x} ${BASE} V ${BASE - h}`} stroke={LEAF} strokeWidth={12} strokeLinecap="round" />
              <path d={`M ${x - 22} ${BASE - h + 24} L ${x} ${BASE - h} L ${x + 22} ${BASE - h + 24}`} stroke={LEAF} strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          );
        })}
        <g transform={about(540, 250, `scale(${word}) translate(0 ${(1 - word) * 200})`)}>
          <text x={540} y={300} textAnchor="middle" fontFamily={S.roots} fontWeight={900} fontSize={150} fill={WHITE} {...outline(CEDAR, 18)}>
            ขึ้นจากโคน
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
}

/** "สระหลายรอบ": a rinse counter ticks ×1 ×2 ×3 while foam piles higher around the script word. */
export function WashAgain() {
  const frame = useCurrentFrame();
  const rinse = Math.min(3, 1 + Math.floor(frame / 9));
  const pile = interpolate(frame, [0, 30], [0.3, 1], clamp);
  const word = interpolate(frame, [2, 9], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const tick = interpolate(frame % 9, [0, 3], [1.4, 1], { ...clamp, easing: Easing.out(Easing.cubic) });

  return (
    <AbsoluteFill>
      <svg {...FRAME}>
        {/* foam */}
        {Array.from({ length: 26 }, (_, i) => {
          const born = hash(i) * 26;
          const t = interpolate(frame, [born, born + 6], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
          const x = 80 + hash(i + 11) * 920;
          const y = 1720 - hash(i + 5) * 300 * pile;
          const r = 30 + hash(i + 7) * 50;
          return (
            <g key={i} transform={about(x, y, `scale(${t})`)}>
              <circle cx={x} cy={y} r={r} fill="rgba(255,255,255,0.88)" stroke="#C8DCE8" strokeWidth={4} />
              <circle cx={x - r * 0.35} cy={y - r * 0.35} r={r * 0.2} fill={WHITE} />
            </g>
          );
        })}
        <g opacity={word} transform={about(540, 1500, `scale(${0.85 + 0.15 * word})`)}>
          <text x={540} y={1560} textAnchor="middle" fontFamily={S.wash} fontWeight={700} fontSize={170} fill={GOLD} {...outline(INK, 14)}>
            สระหลายรอบ
          </text>
        </g>
        {/* rinse counter */}
        <g transform={about(880, 1280, `scale(${tick})`)}>
          <circle cx={880} cy={1280} r={95} fill={RED} stroke={WHITE} strokeWidth={8} />
          <text x={880} y={1318} textAnchor="middle" fontFamily={S.ui} fontWeight={700} fontSize={104} fill={WHITE}>
            {`×${rinse}`}
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
}

/** "ทีเดียวหลุด": one water swipe wipes across and leaves the word behind; the gold corner throws in the towel. */
export function OneRinse() {
  const frame = useCurrentFrame();
  const swipe = interpolate(frame, [0, 8], [-200, 1280], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const towelT = interpolate(frame, [10, 24], [0, 1], { ...clamp, easing: Easing.out(Easing.quad) });
  const tx = 60 + towelT * 380;
  const ty = -150 + Math.sin(towelT * Math.PI * 0.9) * -80 + towelT * 950;

  return (
    <AbsoluteFill>
      <svg {...FRAME}>
        <defs>
          <clipPath id="s08-rinse">
            <rect x={0} y={120} width={Math.max(0, swipe)} height={380} />
          </clipPath>
          <linearGradient id="s08-water" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="rgba(160,220,255,0)" />
            <stop offset="1" stopColor="rgba(200,240,255,0.95)" />
          </linearGradient>
        </defs>
        <g clipPath="url(#s08-rinse)">
          <text x={540} y={380} textAnchor="middle" fontFamily={S.once} fontWeight={900} fontSize={160} fill={WHITE} {...outline(CEDAR, 18)}>
            ทีเดียวหลุด
          </text>
        </g>
        <rect x={swipe - 240} y={150} width={240} height={320} fill="url(#s08-water)" opacity={swipe < 1200 ? 1 : 0} />
        <rect x={swipe - 12} y={140} width={18} height={340} rx={9} fill={WHITE} opacity={swipe < 1200 ? 1 : 0} />
        {/* towel thrown in by the gold corner */}
        <g opacity={towelT > 0 ? 1 : 0} transform={`translate(${tx} ${ty}) rotate(${towelT * 200})`}>
          <path d="M -90 -60 Q 0 -90 90 -60 Q 110 20 80 90 Q 0 60 -80 95 Q -110 20 -90 -60 Z" fill={WHITE} stroke={INK} strokeWidth={6} />
          <path d="M -70 -30 Q 0 -50 70 -30" stroke={GOLD} strokeWidth={10} fill="none" />
        </g>
      </svg>
    </AbsoluteFill>
  );
}
