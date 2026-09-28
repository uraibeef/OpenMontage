import { interpolate } from "remotion";
import { clamp } from "./style";

/**
 * The race clock: a drawn seven-segment readout (no font) and the story of
 * how many seconds are left at every VO second — it ticks, then rolls
 * minutes away in one gulp on each task, then crawls to 00:03 at the bus.
 */

/** [VO second, seconds left on the clock]. */
const CLOCK: readonly [number, number][] = [
  [0.8, 600],
  [3.05, 594],
  [3.15, 594],
  [3.75, 300],
  [4.21, 297],
  [4.3, 297],
  [5.2, 124],
  [5.88, 120],
  [6.84, 111],
  [8.5, 88],
  [9.76, 56],
  [10.34, 41],
  [11.4, 4],
  [11.52, 3],
];

export const CLOCK_START = CLOCK[0][0];
export const CLOCK_STOP = CLOCK[CLOCK.length - 1][0];

/** Seconds left at a VO second (whole seconds, like a real display). */
export function secondsLeft(sec: number): number {
  const v = interpolate(
    sec,
    CLOCK.map((k) => k[0]),
    CLOCK.map((k) => k[1]),
    clamp,
  );
  return Math.ceil(v - 0.001);
}

export const mmss = (s: number) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

// segments a b c d e f g
const MAP: Record<string, string> = {
  "0": "abcdef",
  "1": "bc",
  "2": "abged",
  "3": "abgcd",
  "4": "fgbc",
  "5": "afgcd",
  "6": "afgedc",
  "7": "abc",
  "8": "abcdefg",
  "9": "abcdfg",
  "-": "g",
  " ": "",
};

const W = 64;
const H = 116;
const T = 13;

/** Hexagonal segment polygon: horizontal or vertical bar with pointed ends. */
function seg(x: number, y: number, len: number, horiz: boolean) {
  const h = T / 2;
  if (horiz) {
    return `${x},${y} ${x + h},${y - h} ${x + len - h},${y - h} ${x + len},${y} ${x + len - h},${y + h} ${x + h},${y + h}`;
  }
  return `${x},${y} ${x + h},${y + h} ${x + h},${y + len - h} ${x},${y + len} ${x - h},${y + len - h} ${x - h},${y + h}`;
}

const G = 3; // gap between segments
const SEGS: Record<string, string> = {
  a: seg(G, 0, W - 2 * G, true),
  g: seg(G, H / 2, W - 2 * G, true),
  d: seg(G, H, W - 2 * G, true),
  f: seg(0, G, H / 2 - 2 * G, false),
  e: seg(0, H / 2 + G, H / 2 - 2 * G, false),
  b: seg(W, G, H / 2 - 2 * G, false),
  c: seg(W, H / 2 + G, H / 2 - 2 * G, false),
};

interface SevenSegProps {
  text: string; // digits, ':' , '-' or ' '
  x: number;
  y: number;
  scale?: number;
  color: string;
  /** Opacity of the unlit ghost segments. */
  ghost?: number;
  colonOn?: boolean;
  glow?: string;
}

/** Italic seven-segment readout drawn in SVG; (x, y) = top-left. */
export function SevenSeg({ text, x, y, scale = 1, color, ghost = 0.1, colonOn = true, glow }: SevenSegProps) {
  let cx = 0;
  const parts: React.ReactNode[] = [];
  Array.from(text).forEach((ch, i) => {
    if (ch === ":") {
      parts.push(
        <g key={i} opacity={colonOn ? 1 : ghost}>
          <rect x={cx + 6} y={H * 0.3 - 7} width={14} height={14} fill={color} />
          <rect x={cx + 2} y={H * 0.7 - 7} width={14} height={14} fill={color} />
        </g>,
      );
      cx += 32;
      return;
    }
    const lit = MAP[ch] ?? "";
    parts.push(
      <g key={i} transform={`translate(${cx} 0)`}>
        {Object.entries(SEGS).map(([k, pts]) => (
          <polygon key={k} points={pts} fill={color} opacity={lit.includes(k) ? 1 : ghost} />
        ))}
      </g>,
    );
    cx += W + 24;
  });
  return (
    <g transform={`translate(${x} ${y}) scale(${scale}) skewX(-8)`} filter={glow}>
      {parts}
    </g>
  );
}

/** Width of a readout in unscaled units, for centring. */
export const segWidth = (text: string) =>
  Array.from(text).reduce((w, ch) => w + (ch === ":" ? 32 : W + 24), 0) - 24;
export const SEG_H = H;
