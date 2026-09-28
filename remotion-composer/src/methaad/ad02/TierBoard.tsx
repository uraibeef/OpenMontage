import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { PaperGrain } from "../../fxkit";
import { BoilFilter, clamp } from "../hooks/kit";
import { about, C, F, hash } from "./theme";

/** Full-frame recap: a riso-printed tier chart with hand-drawn products dropping into their rows. */

const INK = C.black;
const line = { stroke: INK, strokeWidth: 6, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

/** Powder bottle: flip cap, star label. */
const Bottle = () => (
  <g>
    <rect x={-52} y={-70} width={104} height={160} rx={16} fill={INK} {...line} />
    <rect x={-44} y={-104} width={88} height={40} rx={10} fill="#3A3A3A" {...line} />
    <rect x={-40} y={-20} width={80} height={62} fill={C.paper} />
    <path d="M 0 -12 L 7 4 L 24 5 L 11 16 L 15 33 L 0 24 L -15 33 L -11 16 L -24 5 L -7 4 Z" fill={C.pink} />
  </g>
);

/** Spray can: nozzle cap, mist puffs. */
const SprayCan = () => (
  <g>
    <rect x={-42} y={-60} width={84} height={150} rx={14} fill="#F2F2F2" {...line} />
    <path d="M -42 -52 Q 0 -96 42 -52" fill="#BFBFBF" {...line} />
    <rect x={-10} y={-100} width={24} height={24} rx={4} fill={INK} />
    <circle cx={44} cy={-96} r={9} fill="none" stroke={C.blue} strokeWidth={5} />
    <circle cx={66} cy={-110} r={12} fill="none" stroke={C.blue} strokeWidth={5} />
    <rect x={-42} y={0} width={84} height={30} fill={C.yellow} {...line} />
  </g>
);

/** Wax tin: squat drum, lid off to one side, finger swipe in the wax. */
const WaxTin = () => (
  <g>
    <ellipse cx={0} cy={50} rx={82} ry={24} fill="#8A8A8A" {...line} />
    <rect x={-82} y={0} width={164} height={50} fill="#B9B9B9" stroke="none" />
    <path d="M -82 0 L -82 50 M 82 0 L 82 50" {...line} />
    <ellipse cx={0} cy={0} rx={82} ry={24} fill="#F0D98A" {...line} />
    <path d="M -40 2 Q -5 -14 34 4" fill="none" stroke="#C9A94A" strokeWidth={8} strokeLinecap="round" />
    <ellipse cx={40} cy={-70} rx={70} ry={20} fill={C.red} {...line} transform="rotate(-18 40 -70)" />
  </g>
);

/** Gel tube: crimped end, squeezed blob. */
const GelTube = () => (
  <g transform="rotate(-20)">
    <path d="M -70 -30 L 60 -22 L 60 22 L -70 30 Z" fill="#6EC3F0" {...line} />
    <path d="M -86 -34 L -70 -30 L -70 30 L -86 34 Z" fill="#DADADA" {...line} />
    <rect x={60} y={-14} width={26} height={28} rx={4} fill={INK} />
    <path d="M 90 0 C 110 -20, 130 10, 116 22 C 104 34, 92 16, 90 0 Z" fill="#9FE0FF" {...line} />
  </g>
);

interface Row {
  tier: string;
  color: string;
  text: string;
  Icon?: () => React.JSX.Element;
  /** Frame the icon lands in the row. */
  at: number;
}

const ROWS: readonly Row[] = [
  { tier: "S", color: C.pink, text: C.black, Icon: Bottle, at: 22 },
  { tier: "A", color: C.blue, text: C.paper, Icon: SprayCan, at: 15 },
  { tier: "B", color: C.yellow, text: C.black, at: 30 },
  { tier: "C", color: C.red, text: C.black, Icon: WaxTin, at: 9 },
  { tier: "F", color: C.black, text: C.red, Icon: GelTube, at: 3 },
];

const TOP = 420;
const ROW_H = 262;
const GAP = 22;

function TierRow({ row, i }: { row: Row; i: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const y = TOP + i * (ROW_H + GAP);
  const slide = interpolate(frame, [i * 2, i * 2 + 7], [-1100, 0], clamp);
  const land = spring({ frame: frame - row.at, fps, config: { damping: 9, stiffness: 210, mass: 0.7 } });
  const dropY = (1 - land) * -900;
  const { Icon } = row;
  const winner = row.tier === "S";
  const glow = winner ? interpolate(frame, [row.at + 4, row.at + 14], [0, 1], clamp) : 0;
  const iconX = winner ? 560 : 560 + hash(i) * 160;

  return (
    <g transform={`translate(${slide} 0)`}>
      <rect x={60} y={y} width={960} height={ROW_H} fill="#FFFDF6" stroke={INK} strokeWidth={6} />
      <g opacity={0.35}>
        {Array.from({ length: 3 }, (_, k) => (
          <line key={k} x1={300} x2={1000} y1={y + 70 + k * 64} y2={y + 70 + k * 64} stroke={C.blue} strokeWidth={2} strokeDasharray="6 10" />
        ))}
      </g>
      <rect x={60} y={y} width={220} height={ROW_H} fill={row.color} stroke={INK} strokeWidth={6} />
      <text x={170 - 7} y={y + 190} textAnchor="middle" fontFamily={F.chart} fontWeight={700} fontSize={200} fill={row.tier === "F" ? C.pink : C.blue} opacity={0.55} style={{ mixBlendMode: "multiply" }}>
        {row.tier}
      </text>
      <text x={170} y={y + 184} textAnchor="middle" fontFamily={F.chart} fontWeight={700} fontSize={200} fill={row.text}>
        {row.tier}
      </text>
      {winner && glow > 0 ? (
        <g opacity={glow} filter="url(#board-boil)">
          {Array.from({ length: 10 }, (_, k) => {
            const a = (k / 10) * Math.PI * 2;
            return (
              <line key={k} x1={iconX + Math.cos(a) * 130} y1={y + 131 + Math.sin(a) * 110} x2={iconX + Math.cos(a) * (130 + 50 * glow)} y2={y + 131 + Math.sin(a) * (110 + 40 * glow)} stroke={C.pink} strokeWidth={10} strokeLinecap="round" />
            );
          })}
          <text x={880} y={y + 150} textAnchor="middle" fontFamily={F.marker} fontSize={56} fill={C.stamp} transform={about(880, y + 130, "rotate(-8)")}>
            ขี้เกียจชนะ
          </text>
        </g>
      ) : null}
      {Icon && frame >= row.at - 12 ? (
        <g transform={`translate(${iconX} ${y + 131 + dropY}) rotate(${(1 - land) * 25 + (hash(i + 4) - 0.5) * 10}) scale(1.1)`} filter="url(#icon-boil)">
          <Icon />
        </g>
      ) : null}
      {!Icon && frame >= row.at ? (
        <text x={620} y={y + 196} textAnchor="middle" fontFamily={F.marker} fontSize={190} fill={C.blue} fillOpacity={1} opacity={Math.min(1, (frame - row.at) / 5)} filter="url(#board-boil)">
          ?
        </text>
      ) : null}
    </g>
  );
}

export function TierBoard() {
  const frame = useCurrentFrame();
  const head = interpolate(frame, [0, 6], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ background: C.paper }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <BoilFilter id="board-boil" scale={4} />
          <filter id="icon-boil" x="-30%" y="-30%" width="160%" height="160%">
            <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves={2} seed={7 + Math.floor(frame / 3) * 13} result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale={4} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
        {Array.from({ length: 34 }, (_, k) => (
          <line key={k} x1={0} x2={1080} y1={60 + k * 56} y2={60 + k * 56} stroke={C.blue} strokeWidth={2} opacity={0.12} />
        ))}
        <line x1={120} x2={120} y1={0} y2={1920} stroke={C.red} strokeWidth={3} opacity={0.35} />
        <g opacity={head} transform={about(540, 250, `scale(${0.8 + 0.2 * head})`)}>
          <rect x={300} y={140} width={480} height={200} fill={C.yellow} style={{ mixBlendMode: "multiply" }} transform="rotate(-2 540 240)" />
          <text x={548} y={305} textAnchor="middle" fontFamily={F.chart} fontWeight={700} fontSize={190} fill={C.pink} style={{ mixBlendMode: "multiply" }}>
            สรุป
          </text>
          <text x={540} y={298} textAnchor="middle" fontFamily={F.chart} fontWeight={700} fontSize={190} fill={C.black}>
            สรุป
          </text>
        </g>
        {ROWS.map((r, i) => (
          <TierRow key={r.tier} row={r} i={i} />
        ))}
      </svg>
      <PaperGrain id="board-grain" opacity={0.22} />
    </AbsoluteFill>
  );
}
