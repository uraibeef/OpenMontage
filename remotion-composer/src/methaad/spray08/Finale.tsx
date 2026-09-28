import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { about, CEDAR, clamp, FRAME, GOLD, GOLD_DK, GOLD_LT, hash, INK, LEAF, LIFT, outline, RED, S, WHITE } from "./style";

/**
 * Finale — (bell) "สี่ต่อศูนย์ ... แถมตอนนี้ลดสี่สิบห้าเปอร์เซ็นต์".
 * The KO bell rings, a split-flap board flips to 4–0, then the championship
 * belt buckles around the bottle; its centre plate is the deal.
 */

/** Ring bell swinging with shock rings and a red "KO". */
export function KoBell() {
  const frame = useCurrentFrame();
  const swing = Math.sin(frame * 1.6) * 16 * Math.exp(-frame / 14);
  const ko = interpolate(frame, [2, 7], [2.4, 1], { ...clamp, easing: Easing.out(Easing.back(1.6)) });

  return (
    <AbsoluteFill>
      <svg {...FRAME}>
        {[0, 5, 10].map((d) => {
          const t = interpolate(frame, [d, d + 10], [0, 1], clamp);
          return <circle key={d} cx={260} cy={330} r={120 + t * 200} fill="none" stroke={GOLD_LT} strokeWidth={10 * (1 - t)} opacity={1 - t} />;
        })}
        <g transform={about(260, 170, `rotate(${swing})`)}>
          <rect x={250} y={140} width={20} height={70} fill="#555" />
          <path d="M 150 390 C 150 250, 190 200, 260 200 C 330 200, 370 250, 370 390 Z" fill={GOLD} stroke={INK} strokeWidth={8} />
          <path d="M 190 360 C 195 280, 215 240, 250 232" stroke={GOLD_LT} strokeWidth={12} fill="none" strokeLinecap="round" />
          <rect x={130} y={385} width={260} height={30} rx={10} fill={GOLD_DK} stroke={INK} strokeWidth={6} />
          <circle cx={260 + swing * 3} cy={432} r={24} fill={INK} />
        </g>
        <g transform={about(700, 320, `scale(${ko}) rotate(-6)`)} opacity={interpolate(frame, [2, 4], [0, 1], clamp)}>
          <text x={700} y={400} textAnchor="middle" fontFamily={S.vs} fontStyle="italic" fontWeight={900} fontSize={250} fill={RED} {...outline(WHITE, 16)}>
            KO
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
}

/** One split-flap tile: flips through a few digits and settles on `to`. */
function Flap({ x, to, color, start }: { x: number; to: string; color: string; start: number }) {
  const frame = useCurrentFrame();
  const t = frame - start;
  const settled = t >= 8;
  const digit = settled ? to : String(Math.floor(hash(Math.max(0, t) + x) * 9));
  const flip = settled ? interpolate(t, [8, 11], [0.2, 1], clamp) : 1;
  return (
    <g opacity={t >= 0 ? 1 : 0}>
      <rect x={x - 120} y={200} width={240} height={330} rx={18} fill="#161616" stroke="#2c2c2c" strokeWidth={6} />
      <g transform={about(x, 365, `scale(1 ${flip})`)}>
        <text x={x} y={475} textAnchor="middle" fontFamily={S.ui} fontWeight={700} fontSize={300} fill={color}>
          {digit}
        </text>
      </g>
      <path d={`M ${x - 120} 365 H ${x + 120}`} stroke="#000" strokeWidth={6} />
    </g>
  );
}

/** Scoreboard: green 4 : gold 0, flaps flip then settle; the green side gets the winner's light. */
export function ScoreBoard() {
  const frame = useCurrentFrame();
  const drop = interpolate(frame, [0, 6], [-700, 0], { ...clamp, easing: Easing.out(Easing.back(1.2)) });
  const win = interpolate(frame, [12, 18], [0, 1], clamp);

  return (
    <AbsoluteFill>
      <svg {...FRAME}>
        <g transform={`translate(0 ${drop})`}>
          <rect x={60} y={110} width={960} height={560} rx={28} fill={INK} stroke={GOLD} strokeWidth={8} />
          <rect x={60} y={110} width={480} height={560} rx={28} fill={LEAF} opacity={win * 0.22} />
          <Flap x={300} to="4" color={LEAF} start={2} />
          <text x={540} y={450} textAnchor="middle" fontFamily={S.ui} fontWeight={700} fontSize={160} fill={WHITE}>
            :
          </text>
          <Flap x={780} to="0" color={GOLD} start={4} />
          <text x={300} y={620} textAnchor="middle" fontFamily={S.ui} fontWeight={700} fontSize={48} fill={LEAF} letterSpacing={4}>
            สเปรย์
          </text>
          <text x={780} y={620} textAnchor="middle" fontFamily={S.ui} fontWeight={700} fontSize={48} fill={GOLD} letterSpacing={4}>
            ของเหนียว
          </text>
          <text x={540} y={170} textAnchor="middle" fontFamily={S.ui} fontWeight={700} fontSize={36} fill={WHITE} letterSpacing={10}>
            FINAL · 4 ROUNDS
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
}

const SALE_AT = 27; // frames after the belt starts = VO 16.48 "ลดสี่สิบห้า"

/** Championship belt buckles around the bottle's waist; the centre plate turns into "ลด 45%". */
export function ChampionBelt() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const wrap = interpolate(frame, [0, 9], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const plate = spring({ frame: frame - 5, fps, config: { damping: 9, stiffness: 170, mass: 0.7 } });
  const sale = spring({ frame: frame - SALE_AT, fps, config: { damping: 8, stiffness: 220, mass: 0.6 } });
  const ribbon = interpolate(frame, [2, 8], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.8)) });
  const glint = interpolate((frame - SALE_AT) % 30, [0, 12], [-200, 1300], clamp);
  const Y = 1180;

  return (
    <AbsoluteFill>
      <svg {...FRAME}>
        <defs>
          <radialGradient id="s08-gold" cx="0.4" cy="0.35" r="0.8">
            <stop offset="0" stopColor={GOLD_LT} />
            <stop offset="0.6" stopColor={GOLD} />
            <stop offset="1" stopColor={GOLD_DK} />
          </radialGradient>
          <clipPath id="s08-plate">
            <ellipse cx={540} cy={Y} rx={250} ry={210} />
          </clipPath>
        </defs>
        {/* strap, wrapping in from both sides */}
        <g>
          <rect x={540 - 540 * wrap} y={Y - 95} width={1080 * wrap} height={190} fill={CEDAR} stroke={INK} strokeWidth={8} />
          <rect x={540 - 540 * wrap} y={Y - 70} width={1080 * wrap} height={8} fill={GOLD} />
          <rect x={540 - 540 * wrap} y={Y + 62} width={1080 * wrap} height={8} fill={GOLD} />
          {[-1, 1].map((s) => (
            <g key={s} opacity={wrap}>
              <rect x={540 + s * 390 - 70} y={Y - 80} width={140} height={160} rx={18} fill="url(#s08-gold)" stroke={INK} strokeWidth={6} />
              <circle cx={540 + s * 390} cy={Y} r={30} fill={RED} stroke={INK} strokeWidth={5} />
            </g>
          ))}
        </g>
        {/* centre plate */}
        <g transform={about(540, Y, `scale(${plate})`)}>
          <ellipse cx={540} cy={Y} rx={275} ry={235} fill="url(#s08-gold)" stroke={INK} strokeWidth={10} />
          <ellipse cx={540} cy={Y} rx={250} ry={210} fill="none" stroke={GOLD_DK} strokeWidth={6} />
          {Array.from({ length: 16 }, (_, i) => {
            const a = (i / 16) * Math.PI * 2;
            return <circle key={i} cx={540 + Math.cos(a) * 262} cy={Y + Math.sin(a) * 222} r={9} fill={GOLD_LT} stroke={GOLD_DK} strokeWidth={2} />;
          })}
          <g opacity={1 - Math.min(1, sale * 1.5)}>
            <text x={540} y={Y + 50} textAnchor="middle" fontFamily={S.belt} fontWeight={700} fontSize={140} fill={CEDAR} {...outline(GOLD_LT, 8)}>
              แชมป์
            </text>
          </g>
          <g transform={about(540, Y, `scale(${sale})`)}>
            <ellipse cx={540} cy={Y} rx={225} ry={185} fill={RED} stroke={WHITE} strokeWidth={8} />
            <text x={540} y={Y - 50} textAnchor="middle" fontFamily={S.belt} fontWeight={700} fontSize={90} fill={WHITE}>
              ลด
            </text>
            <text x={540} y={Y + 115} textAnchor="middle" fontFamily={S.belt} fontWeight={700} fontSize={190} fill={WHITE} {...outline(INK, 6)}>
              45%
            </text>
          </g>
          <g clipPath="url(#s08-plate)" opacity={sale > 0.9 ? 0.7 : 0}>
            <rect x={glint} y={Y - 260} width={70} height={520} fill={WHITE} transform={about(glint, Y, "skewX(-20)")} />
          </g>
        </g>
        {/* ribbon above */}
        <g transform={about(540, 820, `scale(${ribbon})`)}>
          <path d="M 250 760 H 830 L 790 820 L 830 880 H 250 L 290 820 Z" fill={INK} stroke={GOLD} strokeWidth={6} />
          <text x={540} y={846} textAnchor="middle" fontFamily={S.belt} fontWeight={700} fontSize={70} fill={GOLD_LT}>
            แถมตอนนี้
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
}
