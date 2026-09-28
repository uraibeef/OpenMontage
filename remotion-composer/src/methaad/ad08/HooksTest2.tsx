import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Code, Reveal, StampSlam, Svg } from "./labkit";
import { about, clamp, GLASS, hash, INK, L, PAPER, PASS, REAGENT } from "./style";

/**
 * TEST 02 — stickiness. "สอง" grows as a colony count in a petri dish; a
 * fingertip presses a glass slide and lifts with no strings ("ไม่เหนียว");
 * a loupe reads the fingerprint clean ("มือไม่เลอะ") and a box PASS lands.
 */

/** Dot-matrix "02" the colonies grow into (5x7 cells per digit). */
const DIGITS: Record<string, string[]> = {
  "0": ["01110", "10001", "10011", "10101", "11001", "10001", "01110"],
  "2": ["01110", "10001", "00001", "00110", "01000", "10000", "11111"],
};

export function PetriDish() {
  const frame = useCurrentFrame();
  const inP = interpolate(frame, [0, 5], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.6)) });
  const cx = 540;
  const cy = 460;
  const cell = 34;
  const dots: [number, number, number][] = [];
  ["0", "2"].forEach((d, di) =>
    DIGITS[d].forEach((row, r) =>
      row.split("").forEach((c, col) => {
        if (c === "1") dots.push([cx - 205 + di * 230 + col * cell, cy - 110 + r * cell, dots.length]);
      }),
    ),
  );
  return (
    <AbsoluteFill>
      <Svg>
        <g transform={about(cx, cy, `scale(${inP}) rotate(${(1 - inP) * -30})`)}>
          <circle cx={cx} cy={cy + 14} r={330} fill="rgba(0,0,0,0.3)" />
          <circle cx={cx} cy={cy} r={330} fill="rgba(240,248,250,0.9)" />
          <circle cx={cx} cy={cy} r={330} fill="none" stroke="#FFFFFF" strokeWidth={16} />
          <circle cx={cx} cy={cy} r={300} fill="none" stroke="#C9DCE4" strokeWidth={4} />
          {dots.map(([x, y, i]) => {
            const g = interpolate(frame, [2 + hash(i) * 7, 7 + hash(i) * 7], [0, 1], { ...clamp, easing: Easing.out(Easing.back(3)) });
            return <circle key={i} cx={x} cy={y} r={15 * g} fill={REAGENT} />;
          })}
          <text x={cx} y={cy - 170} textAnchor="middle" fontFamily={L.readout} fontWeight={700} fontSize={40} fill={INK} letterSpacing={14}>
            TEST
          </text>
          <text x={cx} y={cy + 215} textAnchor="middle" fontFamily={L.report} fontWeight={800} fontSize={62} fill={INK}>
            ความเหนียว
          </text>
        </g>
      </Svg>
    </AbsoluteFill>
  );
}

const SKIN = "#E7B48F";
const NAIL = "#F4D6C4";

/** Fingertip coming down from above, pad on a glass slide. */
function Finger({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M ${x - 70} ${y - 520} L ${x - 70} ${y - 70} Q ${x - 70} ${y} ${x} ${y} Q ${x + 70} ${y} ${x + 70} ${y - 70} L ${x + 70} ${y - 520} Z`} fill={SKIN} stroke={INK} strokeWidth={6} />
      <path d={`M ${x - 42} ${y - 150} L ${x - 42} ${y - 60} Q ${x} ${y - 28} ${x + 42} ${y - 60} L ${x + 42} ${y - 150} Z`} fill={NAIL} stroke={INK} strokeWidth={5} />
      <path d={`M ${x - 70} ${y - 260} Q ${x} ${y - 240} ${x + 70} ${y - 260}`} fill="none" stroke={INK} strokeWidth={4} opacity={0.5} />
    </g>
  );
}

/** Press + lift on the slide, then a loupe reads the print clean. */
export function FingerSlide({ loupeAt, stampAt, y0 }: { loupeAt: number; stampAt: number; y0: number }) {
  const frame = useCurrentFrame();
  const slideIn =
    interpolate(frame, [0, 5], [900, 0], { ...clamp, easing: Easing.out(Easing.cubic) }) +
    interpolate(frame, [loupeAt, loupeAt + 6], [0, -1100], { ...clamp, easing: Easing.in(Easing.cubic) });
  const touch = interpolate(frame, [4, 9, 13, 19], [-260, 0, 0, -200], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const lens = interpolate(frame, [loupeAt, loupeAt + 7], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.7)) });
  const sx = 540;
  const sy = y0;
  return (
    <AbsoluteFill>
      <Svg>
        <g transform={`translate(${slideIn} 0)`}>
          <rect x={sx - 330} y={sy + 16} width={660} height={130} rx={10} fill="rgba(0,0,0,0.3)" />
          <rect x={sx - 330} y={sy} width={660} height={130} rx={10} fill={GLASS} stroke="#FFFFFF" strokeWidth={5} />
          <rect x={sx - 330} y={sy} width={170} height={130} rx={10} fill={PAPER} />
          <Code x={sx - 245} y={sy + 58} text="T02" size={34} fill={INK} anchor="middle" />
          <Code x={sx - 245} y={sy + 100} text="STICK 0" size={22} fill={PASS} anchor="middle" />
          <text x={sx + 90} y={sy + 96} textAnchor="middle" fontFamily={L.label} fontWeight={700} fontSize={86} fill="#FFFFFF" stroke={INK} strokeWidth={12} paintOrder="stroke">
            ไม่เหนียว
          </text>
        </g>
        {frame < loupeAt ? (
          <g transform={`translate(0 ${touch})`}>
            <Finger x={sx + 60} y={sy - 4} />
          </g>
        ) : null}
        {lens > 0 ? <Loupe cx={sx} cy={sy - 270} scale={lens} labelAt={loupeAt + 6} /> : null}
        <StampSlam id="d8-pass2" at={stampAt} x={850} y={sy + 220} rot={8} back={<rect x={-190} y={-78} width={380} height={156} fill={PAPER} opacity={0.82} />}>
          <rect x={-190} y={-78} width={380} height={156} fill="none" stroke="currentColor" strokeWidth={10} />
          <rect x={-172} y={-60} width={344} height={120} fill="none" stroke="currentColor" strokeWidth={3} />
          <text y={30} textAnchor="middle" fontFamily={L.label} fontWeight={700} fontSize={84} fill="currentColor" letterSpacing={6}>
            PASS
          </text>
        </StampSlam>
      </Svg>
    </AbsoluteFill>
  );
}

/** Magnifier over the fingertip pad: clean ridges, then the note. */
function Loupe({ cx, cy, scale, labelAt }: { cx: number; cy: number; scale: number; labelAt: number }) {
  const r = 200;
  return (
    <g>
      <g transform={about(cx, cy, `scale(${scale})`)}>
        <line x1={cx + r * 0.72} y1={cy + r * 0.72} x2={cx + r * 1.25} y2={cy + r * 1.25} stroke={INK} strokeWidth={46} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={r} fill={SKIN} />
        <clipPath id="d8-loupe">
          <circle cx={cx} cy={cy} r={r - 8} />
        </clipPath>
        <g clipPath="url(#d8-loupe)">
          {Array.from({ length: 13 }, (_, i) => (
            <ellipse key={i} cx={cx + 10} cy={cy + 30} rx={30 + i * 22} ry={20 + i * 17} fill="none" stroke="#B9805E" strokeWidth={6} />
          ))}
        </g>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={INK} strokeWidth={22} />
        <circle cx={cx} cy={cy} r={r - 16} fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth={5} />
        <path d={`M ${cx - r * 0.55} ${cy - r * 0.35} A ${r * 0.7} ${r * 0.7} 0 0 1 ${cx - r * 0.2} ${cy - r * 0.62}`} stroke="rgba(255,255,255,0.8)" strokeWidth={14} fill="none" strokeLinecap="round" />
      </g>
      <Reveal id="d8-clean" x={cx - 420} y={cy + r - 10} w={840} h={170} from={labelAt} dur={8}>
        <rect x={cx - 360} y={cy + r + 20} width={720} height={130} rx={12} fill={INK} />
        <text x={cx} y={cy + r + 114} textAnchor="middle" fontFamily={L.note} fontWeight={700} fontSize={84} fill={PAPER}>
          มือไม่เลอะ
        </text>
      </Reveal>
    </g>
  );
}
