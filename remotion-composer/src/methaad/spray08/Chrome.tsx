import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { about, CEDAR, clamp, f, FRAME, GOLD, GOLD_DK, INK, LEAF, RED, S, WHITE } from "./style";

/**
 * Arena tally strip along the bottom: gold corner left, green corner right,
 * round pips in the middle. The green score ticks up as each round is won.
 * Frame 0 of this component = VO second 0 (it is mounted in absolute time).
 */

/** VO seconds each round's point lands for the spray. */
export const POINT_AT = [5.3, 7.95, 11.12, 13.95] as const;
const ROUND_AT = [3.03, 5.83, 8.39, 11.58] as const;

const Y = 1776;

function Pip({ x, won, pop }: { x: number; won: boolean; pop: number }) {
  return (
    <g transform={about(x, Y + 52, `scale(${1 + pop * 0.6})`)}>
      <rect x={x - 17} y={Y + 35} width={34} height={34} rx={4} transform={about(x, Y + 52, "rotate(45)")} fill={won ? LEAF : "rgba(255,255,255,0.14)"} stroke={won ? WHITE : "rgba(255,255,255,0.4)"} strokeWidth={3} />
    </g>
  );
}

export function TallyStrip() {
  const frame = useCurrentFrame();
  const score = POINT_AT.filter((s) => frame >= f(s)).length;
  const round = ROUND_AT.filter((s) => frame >= f(s)).length;
  const last = score > 0 ? f(POINT_AT[score - 1]) : -99;
  const bump = interpolate(frame - last, [0, 3, 10], [0, 1, 0], clamp);
  const flash = interpolate(frame - last, [0, 12], [1, 0], { ...clamp, easing: Easing.out(Easing.quad) });

  return (
    <AbsoluteFill>
      <svg {...FRAME}>
        <defs>
          <linearGradient id="s08-strip" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={GOLD_DK} />
            <stop offset="0.38" stopColor={INK} />
            <stop offset="0.62" stopColor={INK} />
            <stop offset="1" stopColor={CEDAR} />
          </linearGradient>
        </defs>
        <path d={`M 30 ${Y} H 1050 L 1020 ${Y + 104} H 60 Z`} fill="url(#s08-strip)" opacity={0.93} />
        <path d={`M 30 ${Y} H 1050`} stroke={RED} strokeWidth={6} />
        {/* gold corner */}
        <text x={82} y={Y + 70} fontFamily={S.ui} fontWeight={700} fontSize={40} fill={GOLD}>
          ของเหนียว
        </text>
        <text x={330} y={Y + 76} textAnchor="middle" fontFamily={S.ui} fontWeight={700} fontSize={62} fill={WHITE}>
          0
        </text>
        {/* round pips */}
        {[0, 1, 2, 3].map((i) => (
          <Pip key={i} x={450 + i * 60} won={i < score} pop={i === score - 1 ? bump : 0} />
        ))}
        <text x={540} y={Y + 24} textAnchor="middle" fontFamily={S.ui} fontWeight={700} fontSize={22} fill={WHITE} letterSpacing={6}>
          {`ROUND ${Math.max(1, round)}/4`}
        </text>
        {/* green corner */}
        <g transform={about(750, Y + 52, `scale(${1 + bump * 0.45})`)}>
          <text x={750} y={Y + 76} textAnchor="middle" fontFamily={S.ui} fontWeight={700} fontSize={62} fill={score > 0 ? LEAF : WHITE}>
            {score}
          </text>
        </g>
        <text x={998} y={Y + 70} textAnchor="end" fontFamily={S.ui} fontWeight={700} fontSize={40} fill={LEAF}>
          สเปรย์
        </text>
        <rect x={660} y={Y} width={390} height={104} fill={LEAF} opacity={flash * 0.35} />
      </svg>
    </AbsoluteFill>
  );
}
