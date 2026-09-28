import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Code, GridPattern, StampSlam, Svg } from "./labkit";
import { about, clamp, FAIL, GLASS, GRID, hash, INK, L, PAPER, REAGENT } from "./style";

/**
 * Opener and the first test sheet. Three empty test tubes fill one by one
 * for "สามอย่าง"; the sticky stuff's name sags and drips like goo; a red
 * "ให้ไม่ได้" stamp lands. Then a full report sheet rolls its counter to 01.
 */

const TUBE_W = 74;
const TUBE_H = 300;
/** The rack sits low (under the chin) so the gel on the opener's head stays visible. */
const RACK_Y = 1330;

function Tube({ x, y, fillAt, n }: { x: number; y: number; fillAt: number; n: number }) {
  const frame = useCurrentFrame();
  const level = interpolate(frame, [fillAt, fillAt + 9], [0, 0.72], { ...clamp, easing: Easing.out(Easing.quad) });
  const slosh = Math.sin((frame - fillAt) * 0.9) * interpolate(frame, [fillAt + 6, fillAt + 20], [8, 0], clamp);
  const r = TUBE_W / 2;
  const body = `M ${x} ${y} L ${x} ${y + TUBE_H - r} A ${r} ${r} 0 0 0 ${x + TUBE_W} ${y + TUBE_H - r} L ${x + TUBE_W} ${y} Z`;
  const top = y + TUBE_H * (1 - level);
  return (
    <g>
      <clipPath id={`d8-tube-${n}`}>
        <path d={body} />
      </clipPath>
      <path d={body} fill={GLASS} />
      <g clipPath={`url(#d8-tube-${n})`}>
        <path
          d={`M ${x - 4} ${top + slosh} Q ${x + r} ${top - slosh} ${x + TUBE_W + 4} ${top + slosh} L ${x + TUBE_W + 4} ${y + TUBE_H + 4} L ${x - 4} ${y + TUBE_H + 4} Z`}
          fill={REAGENT}
        />
        <rect x={x + 12} y={y + 20} width={10} height={TUBE_H - 60} rx={5} fill="rgba(255,255,255,0.55)" />
      </g>
      <path d={body} fill="none" stroke="#FFFFFF" strokeWidth={6} />
      <rect x={x - 10} y={y - 14} width={TUBE_W + 20} height={20} rx={6} fill="#FFFFFF" />
    </g>
  );
}

/** "3 อย่าง": a rack of three tubes, each filling on its own beat. */
export function TubeRack() {
  const frame = useCurrentFrame();
  const rise = interpolate(frame, [0, 7], [520, 0], { ...clamp, easing: Easing.out(Easing.back(1.4)) });
  const numIn = interpolate(frame, [12, 18], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
  const xs = [110, 230, 350];
  return (
    <AbsoluteFill>
      <Svg>
        <g transform={`translate(0 ${RACK_Y + rise})`}>
          <rect x={70} y={120} width={950} height={420} rx={28} fill="rgba(13,20,34,0.72)" />
          <Code x={100} y={170} text="LAB REPORT · HX-08" size={30} fill="#9FE3D8" />
          {xs.map((x, i) => (
            <Tube key={x} x={x} y={205} fillAt={3 + i * 5} n={i} />
          ))}
          <rect x={86} y={420} width={386} height={34} rx={8} fill="#E9EEF2" />
          {xs.map((x, i) => (
            <text key={x} x={x + TUBE_W / 2} y={446} textAnchor="middle" fontFamily={L.readout} fontWeight={700} fontSize={26} fill={INK}>
              {`T0${i + 1}`}
            </text>
          ))}
          <g transform={about(740, 360, `scale(${numIn})`)} opacity={numIn > 0 ? 1 : 0}>
            <text x={600} y={470} textAnchor="middle" fontFamily={L.readout} fontWeight={700} fontSize={330} fill={REAGENT}>
              3
            </text>
            <text x={880} y={420} textAnchor="middle" fontFamily={L.report} fontWeight={800} fontSize={120} fill={PAPER}>
              อย่าง
            </text>
          </g>
        </g>
      </Svg>
    </AbsoluteFill>
  );
}

const GOO = "#A8E36B";

/** Drips hanging off a word; each grows, necks and falls on its own clock. */
function Drips({ x0, width, y, at }: { x0: number; width: number; y: number; at: number }) {
  const frame = useCurrentFrame();
  return (
    <g filter="url(#d8-goo)">
      <rect x={x0} y={y - 14} width={width} height={22} rx={11} fill={GOO} />
      {Array.from({ length: 7 }, (_, i) => {
        const t = frame - at - i * 2.5;
        const len = interpolate(t, [0, 26], [0, 60 + hash(i * 3) * 110], { ...clamp, easing: Easing.in(Easing.quad) });
        const cx = x0 + 30 + (i / 6) * (width - 60) + (hash(i) - 0.5) * 30;
        const r = 10 + hash(i * 7) * 8;
        return (
          <g key={i}>
            <rect x={cx - r * 0.55} y={y} width={r * 1.1} height={len} fill={GOO} />
            <circle cx={cx} cy={y + len} r={r} fill={GOO} />
          </g>
        );
      })}
    </g>
  );
}

/** "ของแต่งผมเหนียวๆ" sags like goo, then "ให้ไม่ได้" is stamped over it. */
export function GooLabel({ stampAt }: { stampAt: number }) {
  const frame = useCurrentFrame();
  const inP = interpolate(frame, [0, 6], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const sag = 1 + interpolate(frame, [6, 30], [0, 0.32], { ...clamp, easing: Easing.inOut(Easing.sin) }) + Math.sin(frame * 0.35) * 0.03;
  const y = 250;
  return (
    <AbsoluteFill>
      <Svg>
        <defs>
          <filter id="d8-goo">
            <feGaussianBlur stdDeviation={7} result="b" />
            <feColorMatrix in="b" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9" />
          </filter>
        </defs>
        <g opacity={inP} transform={`translate(${(1 - inP) * -60} 0)`}>
          <text x={540} y={y} textAnchor="middle" fontFamily={L.label} fontWeight={700} fontSize={78} fill="#FFFFFF" stroke={INK} strokeWidth={14} paintOrder="stroke">
            ที่ของแต่งผม
          </text>
          <Drips x0={250} width={580} y={y + 150} at={8} />
          <g transform={about(540, y + 40, `scale(1 ${sag})`)}>
            <text x={540} y={y + 150} textAnchor="middle" fontFamily={L.report} fontWeight={800} fontSize={150} fill={GOO} stroke={INK} strokeWidth={16} paintOrder="stroke">
              เหนียวๆ
            </text>
          </g>
        </g>
        <StampSlam id="d8-cant" at={stampAt} x={560} y={y + 400} rot={-8} color={FAIL} back={<rect x={-300} y={-86} width={600} height={150} rx={10} fill={PAPER} opacity={0.85} />}>
          <rect x={-300} y={-86} width={600} height={150} rx={10} fill="none" stroke="currentColor" strokeWidth={12} />
          <text x={0} y={30} textAnchor="middle" fontFamily={L.label} fontWeight={700} fontSize={104} fill="currentColor">
            ให้ไม่ได้
          </text>
        </StampSlam>
      </Svg>
    </AbsoluteFill>
  );
}

/** Odometer digit: rolls 0→target inside a window. */
function RollDigit({ x, y, target, from, dur }: { x: number; y: number; target: number; from: number; dur: number }) {
  const frame = useCurrentFrame();
  const h = 250;
  const turns = 10 + target;
  const pos = interpolate(frame, [from, from + dur], [0, turns], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <g>
      <clipPath id={`d8-roll-${x}`}>
        <rect x={x - 90} y={y - h / 2} width={180} height={h} rx={14} />
      </clipPath>
      <rect x={x - 90} y={y - h / 2} width={180} height={h} rx={14} fill={INK} />
      <g clipPath={`url(#d8-roll-${x})`}>
        {Array.from({ length: turns + 2 }, (_, i) => (
          <text key={i} x={x} y={y + 80 + (i - pos) * h} textAnchor="middle" fontFamily={L.readout} fontWeight={700} fontSize={230} fill={PAPER}>
            {i % 10}
          </text>
        ))}
      </g>
      <rect x={x - 90} y={y - 4} width={180} height={4} fill="rgba(255,255,255,0.18)" />
    </g>
  );
}

/** Full-frame report sheet for "หนึ่ง": the test counter rolls to 01. */
export function ReportSheet() {
  const frame = useCurrentFrame();
  const settle = interpolate(frame, [0, 10], [1.06, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ backgroundColor: PAPER }}>
      <Svg>
        <defs>
          <GridPattern id="d8-sheet-grid" color={GRID} />
        </defs>
        <g transform={about(540, 960, `scale(${settle})`)}>
          <rect x={0} y={0} width={1080} height={1920} fill="url(#d8-sheet-grid)" opacity={0.7} />
          <rect x={70} y={240} width={940} height={8} fill={INK} />
          <text x={80} y={210} fontFamily={L.report} fontWeight={800} fontSize={84} fill={INK}>
            รายงานผลทดสอบ
          </text>
          <Code x={1000} y={210} text="HX-08" size={40} fill={INK} anchor="end" />
          <text x={540} y={620} textAnchor="middle" fontFamily={L.readout} fontWeight={700} fontSize={70} fill={INK} letterSpacing={20}>
            TEST
          </text>
          <RollDigit x={440} y={860} target={0} from={1} dur={6} />
          <RollDigit x={640} y={860} target={1} from={2} dur={9} />
          <rect x={150} y={1100} width={780} height={4} fill={INK} />
          <text x={540} y={1250} textAnchor="middle" fontFamily={L.report} fontWeight={800} fontSize={120} fill={INK}>
            ความมัน
          </text>
          <Code x={540} y={1330} text="METHOD: BLOTTING PAPER" size={34} fill="#51607A" anchor="middle" />
        </g>
      </Svg>
    </AbsoluteFill>
  );
}
