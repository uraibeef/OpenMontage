import { Easing, interpolate, useCurrentFrame } from "remotion";
import { RISO } from "./Riso";

const INKS = [RISO.pink, RISO.yellow, RISO.blue, RISO.teal, RISO.red] as const;
const TEXT_ON: Record<string, string> = { [RISO.pink]: "#fff", [RISO.yellow]: RISO.black, [RISO.blue]: "#fff", [RISO.teal]: "#fff", [RISO.red]: "#fff" };
const rnd = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

interface RisoCoverProps {
  /** Rectangle to hide, in px of the 1080x1920 canvas. */
  x: number;
  y: number;
  w: number;
  h: number;
  /** Any int — picks ink colour, tilt and the label word. */
  seed?: number;
  /** Short words printed on the label so it reads as an intentional annotation (Thai by default). */
  words?: readonly string[];
  fontFamily?: string;
  pad?: number;
  minW?: number;
  minH?: number;
  /** Unique within the composition. */
  id: string;
}

const WORDS = ["ดูนะ", "ชัดๆ", "จริงๆ", "เห็นมั้ย", "ลองดู"] as const;

/**
 * Riso label-tape that sits exactly where a burned-in caption/ID was: solid drum ink, halftone shading, a misregistered
 * second-ink outline and text shadow, two tape strips, slight tilt, a pop-in on the first frames and a 2-frame boil.
 * It is drawn to look like an annotation the editor chose to add — not a blur or a blank box.
 * Rectangles come from projects/_ads/tools/ocr/text_boxes.py.
 */
export function RisoCover({ x, y, w, h, seed = 0, words = WORDS, fontFamily = "sans-serif", pad = 12, minW = 210, minH = 92, id }: RisoCoverProps) {
  const frame = useCurrentFrame();
  const tick = Math.floor(frame / 2);
  const W = Math.max(w + pad * 2, minW);
  const H = Math.max(h + pad * 2, minH);
  const cx = x + w / 2;
  const cy = y + h / 2;
  const ink = INKS[Math.floor(rnd(seed) * INKS.length)];
  const ink2 = INKS[(INKS.indexOf(ink) + 2) % INKS.length];
  const tilt = (rnd(seed + 5) - 0.5) * 5;
  const jx = ((tick * 37 + seed) % 5) - 2;
  const jy = ((tick * 23 + seed) % 5) - 2;
  const word = words[Math.floor(rnd(seed + 9) * words.length)];
  const pop = interpolate(frame, [0, 6], [0.55, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(2.2)) });
  const size = Math.min(H * 0.56, 72);
  const dot = 8;
  const m = 34;
  return (
    <svg
      width={W + m * 2}
      height={H + m * 2}
      viewBox={`0 0 ${W + m * 2} ${H + m * 2}`}
      style={{ position: "absolute", left: cx - (W + m * 2) / 2, top: cy - (H + m * 2) / 2, transform: `rotate(${tilt}deg) scale(${pop})`, overflow: "visible" }}
    >
      <defs>
        <filter id={`${id}-rough`} x="-10%" y="-20%" width="120%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency={0.04} numOctaves={2} seed={(tick + seed) % 7} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={4} />
        </filter>
        <pattern id={`${id}-dots`} width={dot} height={dot} patternUnits="userSpaceOnUse" patternTransform="rotate(24)">
          <circle cx={dot / 2} cy={dot / 2} r={1.9} fill={ink2} opacity={0.5} />
        </pattern>
        <linearGradient id={`${id}-fade`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#fff" stopOpacity="1" />
        </linearGradient>
        <mask id={`${id}-m`}>
          <rect x={0} y={0} width={W} height={H} fill={`url(#${id}-fade)`} />
        </mask>
      </defs>
      <g transform={`translate(${m} ${m})`}>
        <g filter={`url(#${id}-rough)`}>
          <rect x={jx + 6} y={jy + 6} width={W} height={H} rx={10} fill="none" stroke={ink2} strokeWidth={5} opacity={0.95} />
          <rect x={0} y={0} width={W} height={H} rx={10} fill={ink} />
          <rect x={0} y={0} width={W} height={H} rx={10} fill={`url(#${id}-dots)`} mask={`url(#${id}-m)`} />
        </g>
        <text x={W / 2 + 3} y={H / 2 + size * 0.36 + 3} textAnchor="middle" fontFamily={fontFamily} fontWeight={800} fontSize={size} fill={ink2} opacity={0.85}>
          {word}
        </text>
        <text x={W / 2} y={H / 2 + size * 0.36} textAnchor="middle" fontFamily={fontFamily} fontWeight={800} fontSize={size} fill={TEXT_ON[ink]}>
          {word}
        </text>
        <rect x={-26} y={-14} width={78} height={30} fill="rgba(240,224,170,0.85)" transform={`rotate(-30 13 1)`} />
        <rect x={W - 52} y={H - 16} width={78} height={30} fill="rgba(240,224,170,0.85)" transform={`rotate(-30 ${W - 13} ${H - 1})`} />
      </g>
    </svg>
  );
}
