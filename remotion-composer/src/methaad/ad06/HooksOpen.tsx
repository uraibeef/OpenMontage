import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Canvas, clamp, graphemes, usePop } from "../hooks/kit";
import { InkBoil, Screentone } from "./ComicKit";
import { INK, M, NARR, PAPER, RED, TONE } from "./style";

/**
 * Beat A (0–1.76 s): a manga narration caption drops onto the first panel —
 * "POV" tab, then "ครั้งแรก" types in, then a red ink underline scrawls.
 */
export function PovCaption() {
  const frame = useCurrentFrame();
  const drop = usePop(0, 12);
  const tab = interpolate(frame, [2, 8], [-160, 0], { ...clamp, easing: Easing.out(Easing.back(1.8)) });
  const word = graphemes("ครั้งแรก");
  const shown = Math.floor(interpolate(frame, [5, 17], [0, word.length], clamp));
  const ink = interpolate(frame, [19, 29], [1, 0], { ...clamp, easing: Easing.out(Easing.quad) });

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 64,
          top: 150,
          transform: `translateY(${(1 - drop) * -260}px) rotate(-2.5deg)`,
          transformOrigin: "left top",
          opacity: Math.min(1, drop * 3),
        }}
      >
        <div
          style={{
            display: "inline-block",
            transform: `translateX(${tab}px)`,
            background: INK,
            color: PAPER,
            fontFamily: M.box,
            fontWeight: 700,
            fontSize: 44,
            letterSpacing: 6,
            padding: "4px 24px 8px",
            marginBottom: -2,
          }}
        >
          POV:
        </div>
        <div
          style={{
            background: NARR,
            border: `8px solid ${INK}`,
            boxShadow: `14px 14px 0 ${INK}`,
            padding: "6px 40px 26px 34px",
            minWidth: 470,
            height: 170,
            boxSizing: "border-box",
            fontFamily: M.box,
            fontWeight: 700,
            fontSize: 112,
            lineHeight: "150px",
            color: INK,
          }}
        >
          {word.map((g, i) => (
            <span key={i} style={{ opacity: i < shown ? 1 : 0 }}>
              {g}
            </span>
          ))}
        </div>
        <svg width={520} height={60} style={{ display: "block", marginTop: 14 }}>
          <path
            d="M 20 30 C 120 12, 220 44, 330 24 S 470 20, 500 34"
            fill="none"
            stroke={RED}
            strokeWidth={14}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={ink}
          />
        </svg>
      </div>
    </AbsoluteFill>
  );
}

const GAUGE = { cx: 520, cy: 540, r: 330 };
const polar = (deg: number, r: number) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [GAUGE.cx + Math.cos(a) * r, GAUGE.cy + Math.sin(a) * r] as const;
};
const arc = (from: number, to: number, r: number) => {
  const [x1, y1] = polar(from, r);
  const [x2, y2] = polar(to, r);
  return `M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`;
};

function QuestionMark({ x, y, size, at, tilt, seed }: { x: number; y: number; size: number; at: number; tilt: number; seed: number }) {
  const frame = useCurrentFrame();
  const p = usePop(at, 9);
  const bob = Math.sin((frame + seed * 7) / 4) * 10;
  return (
    <text
      x={x}
      y={y + bob - p * 30}
      fontFamily={M.shout}
      fontSize={size}
      textAnchor="middle"
      fill={seed % 2 ? RED : PAPER}
      stroke={INK}
      strokeWidth={10}
      paintOrder="stroke"
      strokeLinejoin="round"
      transform={`rotate(${tilt + Math.sin((frame + seed) / 5) * 6} ${x} ${y}) scale(1)`}
      opacity={Math.min(1, p * 2)}
    >
      ?
    </text>
  );
}

function SweatDrop({ x, y, at, s = 1 }: { x: number; y: number; at: number; s?: number }) {
  const frame = useCurrentFrame();
  const t = Math.max(0, frame - at);
  const o = interpolate(frame, [at, at + 3], [0, 1], clamp);
  return (
    <g transform={`translate(${x} ${y + t * 2.4}) scale(${s})`} opacity={o}>
      <path d="M 0 -46 C 16 -18, 30 4, 30 20 A 30 30 0 0 1 -30 20 C -30 4, -16 -18, 0 -46 Z" fill="#CFEFFF" stroke={INK} strokeWidth={6} />
      <path d="M -12 12 Q -14 24 -4 30" stroke={PAPER} strokeWidth={6} fill="none" strokeLinecap="round" />
    </g>
  );
}

/**
 * Beat B (1.76–3.50 s): a drawn top panel with a "งง" meter — the needle
 * slams into the red and trembles; at the cut the panel lifts away and the
 * confusion spills out as floating question marks and sweat drops.
 */
export function DazeMeter({ cut }: { cut: number }) {
  const frame = useCurrentFrame();
  const swing = interpolate(frame, [3, 15], [-78, 66], { ...clamp, easing: Easing.out(Easing.back(2.2)) });
  const needle = swing + (frame > 15 ? Math.sin(frame * 1.9) * 3.5 : 0);
  const lift = interpolate(frame, [cut - 3, cut + 4], [0, -760], { ...clamp, easing: Easing.in(Easing.cubic) });
  const [nx, ny] = polar(needle, 270);
  const label = usePop(12, 10);

  return (
    <AbsoluteFill>
      <Canvas>
        <defs>
          <Screentone id="r6-meter-tone" gap={16} r={3.2} />
          <InkBoil id="r6-meter-boil" scale={3} />
        </defs>
        <g transform={`translate(0 ${lift})`}>
          <rect x={-10} y={-10} width={1100} height={680} fill={PAPER} />
          <rect x={0} y={0} width={1080} height={670} fill="url(#r6-meter-tone)" opacity={0.55} />
          <rect x={22} y={22} width={1036} height={626} fill="none" stroke={INK} strokeWidth={10} />
          <rect x={0} y={660} width={1080} height={16} fill={INK} />
          <g filter="url(#r6-meter-boil)">
            <path d={`${arc(-90, 90, GAUGE.r)} Z`} fill={PAPER} stroke={INK} strokeWidth={10} />
            <path d={arc(-86, 10, GAUGE.r - 44)} fill="none" stroke={TONE} strokeWidth={58} />
            <path d={arc(12, 86, GAUGE.r - 44)} fill="none" stroke={RED} strokeWidth={58} />
            {Array.from({ length: 13 }, (_, i) => -84 + i * 14).map((d) => {
              const [x1, y1] = polar(d, GAUGE.r - 90);
              const [x2, y2] = polar(d, GAUGE.r - 118);
              return <line key={d} x1={x1} y1={y1} x2={x2} y2={y2} stroke={INK} strokeWidth={6} strokeLinecap="round" />;
            })}
            <line x1={GAUGE.cx} y1={GAUGE.cy} x2={nx} y2={ny} stroke={INK} strokeWidth={16} strokeLinecap="round" />
            <circle cx={GAUGE.cx} cy={GAUGE.cy} r={30} fill={RED} stroke={INK} strokeWidth={8} />
          </g>
          <text x={170} y={520} fontFamily={M.note} fontSize={60} fill={INK} textAnchor="middle">
            ปกติ
          </text>
          <g transform={`translate(920 250) scale(${0.4 + label * 0.6}) rotate(${-8 + Math.sin(frame * 1.7) * 3})`}>
            <text
              x={0}
              y={0}
              fontFamily={M.shout}
              fontSize={150}
              textAnchor="middle"
              fill={RED}
              stroke={INK}
              strokeWidth={14}
              paintOrder="stroke"
              strokeLinejoin="round"
            >
              งง
            </text>
          </g>
        </g>
        <QuestionMark x={150} y={620} size={190} at={cut + 1} tilt={-14} seed={1} />
        <QuestionMark x={940} y={520} size={230} at={cut + 4} tilt={12} seed={2} />
        <QuestionMark x={210} y={900} size={120} at={cut + 8} tilt={8} seed={3} />
        <QuestionMark x={880} y={860} size={140} at={cut + 11} tilt={-10} seed={4} />
        <SweatDrop x={780} y={560} at={cut + 5} />
        <SweatDrop x={320} y={500} at={cut + 12} s={0.75} />
      </Canvas>
    </AbsoluteFill>
  );
}

/** Generic talc shaker drawn in ink; local origin = bottom centre. */
function TalcBottle() {
  return (
    <g>
      <path d="M -120 0 L -120 -250 Q -120 -320 -60 -335 L 60 -335 Q 120 -320 120 -250 L 120 0 Z" fill={PAPER} stroke={INK} strokeWidth={9} />
      <path d="M 60 -320 Q 108 -300 108 -250 L 108 -12 L 70 -12 L 70 -300 Z" fill="url(#r6-talc-tone)" />
      <rect x={-78} y={-400} width={156} height={70} rx={14} fill={PAPER} stroke={INK} strokeWidth={9} />
      {[-40, -14, 14, 40].map((x) => (
        <circle key={x} cx={x} cy={-385} r={6} fill={INK} />
      ))}
      <rect x={-120} y={-215} width={240} height={120} fill="#FFD6E2" stroke={INK} strokeWidth={7} />
      <text x={0} y={-140} fontFamily={M.hand} fontSize={52} textAnchor="middle" fill={INK}>
        แป้งเด็ก
      </text>
      <path d="M -60 -120 Q 0 -100 60 -120" stroke={INK} strokeWidth={4} fill="none" />
    </g>
  );
}

/**
 * Beat C (3.50–5.16 s): an inset panel with a drawn baby-powder shaker lands
 * beside the real bottle; a red "=?" hangs between them, wobbling.
 */
export function TalcCompare() {
  const frame = useCurrentFrame();
  const land = usePop(3, 12);
  const mark = usePop(14, 8);
  const wob = Math.sin(frame / 3) * 7;

  return (
    <AbsoluteFill>
      <Canvas>
        <defs>
          <Screentone id="r6-talc-tone" gap={11} r={2.6} />
          <Screentone id="r6-talc-bg" gap={18} r={4} color="#E1DDE6" angle={20} />
        </defs>
        <g transform={`translate(300 1500) rotate(${-4 + (1 - land) * -18}) scale(${land})`}>
          <rect x={-240} y={-290} width={480} height={560} fill={PAPER} stroke={INK} strokeWidth={11} />
          <rect x={-231} y={-281} width={462} height={542} fill="url(#r6-talc-bg)" />
          <g transform="translate(0 220) scale(1.05)">
            <TalcBottle />
          </g>
          <rect x={-240} y={-290} width={480} height={560} fill="none" stroke={INK} strokeWidth={11} />
        </g>
        <g transform={`translate(700 1330) scale(${mark}) rotate(${wob})`}>
          <text
            x={0}
            y={0}
            fontFamily={M.shout}
            fontSize={200}
            textAnchor="middle"
            fill={RED}
            stroke={PAPER}
            strokeWidth={16}
            paintOrder="stroke"
            strokeLinejoin="round"
          >
            =?
          </text>
        </g>
      </Canvas>
    </AbsoluteFill>
  );
}
