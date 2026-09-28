import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Code, Svg } from "./labkit";
import { about, clamp, HILITE, INK, L, PAPER, REAGENT } from "./style";

/**
 * Bonus spec, not a test: a vernier caliper closes on the bottle for
 * "กระปุกเล็ก"; then a day-log clock sweeps and ticks three refill times
 * for "พกไปเติมระหว่างวันได้".
 */

const STEEL = "#D7DDE3";

/** Caliper jaws close on the bottle; readout snaps to SIZE S. */
export function Caliper({ y = 1250 }: { y?: number }) {
  const frame = useCurrentFrame();
  const inP = interpolate(frame, [0, 5], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const close = interpolate(frame, [3, 12], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.8)) });
  const left = 330;
  const jaw = interpolate(close, [0, 1], [1010, 760]);
  return (
    <AbsoluteFill>
      <Svg>
        <g opacity={inP} transform={`translate(0 ${(1 - inP) * 120})`}>
          <rect x={60} y={y} width={970} height={70} rx={8} fill={STEEL} stroke={INK} strokeWidth={5} />
          {Array.from({ length: 46 }, (_, i) => (
            <line key={i} x1={80 + i * 20} y1={y} x2={80 + i * 20} y2={y + (i % 5 === 0 ? 34 : 20)} stroke={INK} strokeWidth={3} />
          ))}
          <path d={`M ${left - 40} ${y - 180} L ${left} ${y - 180} L ${left} ${y + 70} L ${left - 40} ${y + 70} Z`} fill={STEEL} stroke={INK} strokeWidth={5} />
          <g transform={`translate(${jaw - 760} 0)`}>
            <path d={`M 760 ${y - 180} L 800 ${y - 180} L 800 ${y + 150} L 700 ${y + 150} L 700 ${y + 70} L 760 ${y + 70} Z`} fill={STEEL} stroke={INK} strokeWidth={5} />
          </g>
          <rect x={120} y={y + 110} width={420} height={120} rx={14} fill={INK} />
          <Code x={150} y={y + 160} text="SIZE" size={30} fill="#9FE3D8" />
          <text x={250} y={y + 208} fontFamily={L.readout} fontWeight={700} fontSize={84} fill={close > 0.95 ? HILITE : PAPER}>
            {close > 0.95 ? "S" : "--"}
          </text>
          <text x={560} y={y + 350} textAnchor="middle" fontFamily={L.label} fontWeight={700} fontSize={100} fill={PAPER} stroke={INK} strokeWidth={14} paintOrder="stroke">
            แถมกระปุกเล็ก
          </text>
        </g>
      </Svg>
    </AbsoluteFill>
  );
}

const TIMES = ["08:00", "12:30", "17:00"];

/** Day-log clock + refill ticks. Ticks land at the given beat-local frames. */
export function RefillLog({ ticks }: { ticks: readonly number[] }) {
  const frame = useCurrentFrame();
  const inP = interpolate(frame, [0, 6], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.4)) });
  const hand = interpolate(frame, [0, ticks[2] + 4], [-60, 300], clamp);
  const cx = 210;
  const cy = 330;
  return (
    <AbsoluteFill>
      <Svg>
        <g transform={about(540, 330, `scale(${inP})`)}>
          <rect x={50} y={130} width={980} height={400} rx={26} fill="rgba(244,241,232,0.95)" />
          <circle cx={cx} cy={cy} r={130} fill="#FFFFFF" stroke={INK} strokeWidth={10} />
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i / 12) * Math.PI * 2;
            return <line key={i} x1={cx + 104 * Math.sin(a)} y1={cy - 104 * Math.cos(a)} x2={cx + 120 * Math.sin(a)} y2={cy - 120 * Math.cos(a)} stroke={INK} strokeWidth={5} />;
          })}
          <line x1={cx} y1={cy} x2={cx + 96 * Math.sin((hand * Math.PI) / 180)} y2={cy - 96 * Math.cos((hand * Math.PI) / 180)} stroke={REAGENT} strokeWidth={10} strokeLinecap="round" />
          <circle cx={cx} cy={cy} r={12} fill={INK} />
          <text x={380} y={235} fontFamily={L.report} fontWeight={800} fontSize={68} fill={INK}>
            พกไปเติม
          </text>
          <text x={380} y={315} fontFamily={L.report} fontWeight={800} fontSize={68} fill={REAGENT}>
            ระหว่างวันได้
          </text>
          {TIMES.map((t, i) => {
            const on = interpolate(frame, [ticks[i], ticks[i] + 4], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2.5)) });
            const x = 400 + i * 205;
            return (
              <g key={t}>
                <Code x={x} y={400} text={t} size={34} fill={INK} />
                <rect x={x} y={420} width={150} height={70} rx={10} fill="none" stroke={INK} strokeWidth={4} />
                <path
                  d={`M ${x + 40} ${455} l 22 22 l 48 -48`}
                  fill="none"
                  stroke={REAGENT}
                  strokeWidth={12}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={120}
                  strokeDashoffset={120 * (1 - on)}
                />
              </g>
            );
          })}
        </g>
      </Svg>
    </AbsoluteFill>
  );
}
