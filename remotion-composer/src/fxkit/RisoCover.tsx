import { Easing, interpolate, useCurrentFrame } from "remotion";
import { RISO } from "./Riso";

/** Drum pairs that overprint into a third colour (multiply on paper), like a real 2-drum riso print. */
const PAIRS = [
  { a: RISO.pink, b: RISO.yellow },
  { a: RISO.yellow, b: RISO.pink },
  { a: RISO.red, b: RISO.yellow },
  { a: RISO.yellow, b: RISO.teal },
  { a: RISO.pink, b: RISO.teal },
] as const;
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
  /** Any int — picks drum pair, tilt, label word. */
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
 * Label patch that sits where a burned-in caption/ID was and is printed like a REAL two-drum riso: opaque paper base,
 * drum A and drum B (offset = misregistration) overprint with `multiply` so their overlap turns into a third colour,
 * halftone dots, stochastic ink-drop speckle knocked out to paper, rough edge, single-ink black word. Pop-in + 2-frame boil.
 * Rectangles come from projects/_ads/tools/ocr/text_boxes.py.
 */
export function RisoCover({ x, y, w, h, seed = 0, words = WORDS, fontFamily = "sans-serif", pad = 12, minW = 210, minH = 92, id }: RisoCoverProps) {
  const frame = useCurrentFrame();
  const tick = Math.floor(frame / 2);
  const W = Math.max(w + pad * 2, minW);
  const H = Math.max(h + pad * 2, minH);
  const cx = x + w / 2;
  const cy = y + h / 2;
  const pair = PAIRS[Math.floor(rnd(seed) * PAIRS.length)];
  const tilt = (rnd(seed + 5) - 0.5) * 5;
  const jx = ((tick * 37 + seed) % 5) - 2;
  const jy = ((tick * 23 + seed) % 5) - 2;
  const word = words[Math.floor(rnd(seed + 9) * words.length)];
  const pop = interpolate(frame, [0, 6], [0.55, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(2.2)) });
  const size = Math.min(H * 0.56, 72);
  const m = 30;
  const dot = 8;
  const fid = `${id}-f`;
  const pid = `${id}-p`;
  const noise = `${id}-n`;
  return (
    <svg
      width={W + m * 2}
      height={H + m * 2}
      viewBox={`0 0 ${W + m * 2} ${H + m * 2}`}
      style={{ position: "absolute", left: cx - (W + m * 2) / 2, top: cy - (H + m * 2) / 2, transform: `rotate(${tilt}deg) scale(${pop})`, overflow: "visible", isolation: "isolate" }}
    >
      <defs>
        <filter id={fid} x="-10%" y="-20%" width="120%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency={0.045} numOctaves={2} seed={(tick + seed) % 7} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={4} />
        </filter>
        <pattern id={pid} width={dot} height={dot} patternUnits="userSpaceOnUse" patternTransform="rotate(24)">
          <circle cx={dot / 2} cy={dot / 2} r={2.2} fill={pair.b} />
        </pattern>
        <filter id={noise} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency={0.9} numOctaves={1} seed={(tick * 3 + seed) % 11} result="t" />
          <feColorMatrix in="t" type="matrix" values="0 0 0 0 0.957  0 0 0 0 0.937  0 0 0 0 0.890  0 0 0 -9 4.6" />
        </filter>
      </defs>
      <g transform={`translate(${m} ${m})`}>
        <g filter={`url(#${fid})`}>
          <rect x={0} y={0} width={W} height={H} fill={RISO.paper} />
          <rect x={0} y={0} width={W} height={H} fill={pair.a} style={{ mixBlendMode: "multiply" }} />
          <rect x={W * 0.52 + jx} y={jy + 5} width={W * 0.48} height={H} fill={pair.b} style={{ mixBlendMode: "multiply" }} opacity={0.95} />
          <rect x={0} y={0} width={W} height={H} fill={`url(#${pid})`} style={{ mixBlendMode: "multiply" }} opacity={0.35} />
        </g>
        <rect x={0} y={0} width={W} height={H} filter={`url(#${noise})`} />
        <text x={W / 2 + 3} y={H / 2 + size * 0.36 + 3} textAnchor="middle" fontFamily={fontFamily} fontWeight={800} fontSize={size} fill={pair.b} style={{ mixBlendMode: "multiply" }}>
          {word}
        </text>
        <text x={W / 2} y={H / 2 + size * 0.36} textAnchor="middle" fontFamily={fontFamily} fontWeight={800} fontSize={size} fill={RISO.black} style={{ mixBlendMode: "multiply" }}>
          {word}
        </text>
      </g>
    </svg>
  );
}
