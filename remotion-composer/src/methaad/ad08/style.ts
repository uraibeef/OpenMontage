import { loadFont as loadChakra } from "@remotion/google-fonts/ChakraPetch";
import { loadFont as loadMali } from "@remotion/google-fonts/Mali";
import { loadFont as loadPlex } from "@remotion/google-fonts/IBMPlexSansThai";
import { loadFont as loadSarabun } from "@remotion/google-fonts/Sarabun";

const subsets: ("thai" | "latin")[] = ["thai", "latin"];

/**
 * Ad #8 identity: LAB TEST / EXPERIMENT REPORT. Three bench tests, one per
 * feature, each logged on a different piece of lab stationery.
 * Sarabun = official report print (the Thai government-form face),
 * Chakra Petch = instrument readouts and sample codes,
 * IBM Plex Sans Thai = bold spec labels, Mali = the tech's ballpoint notes.
 */
export const L = {
  report: loadSarabun("normal", { weights: ["500", "800"], subsets }).fontFamily,
  readout: loadChakra("normal", { weights: ["500", "700"], subsets }).fontFamily,
  label: loadPlex("normal", { weights: ["600", "700"], subsets }).fontFamily,
  note: loadMali("normal", { weights: ["600", "700"], subsets }).fontFamily,
} as const;

export const PAPER = "#F4F1E8";
export const GRID = "#AFCBDD";
export const INK = "#131B2C";
export const PASS = "#12814A";
export const FAIL = "#D2302A";
export const REAGENT = "#23B0A0";
export const AMBER = "#F2A93B";
export const HILITE = "#FFE14D";
export const GLASS = "rgba(236,246,250,0.28)";

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Frames at 30 fps for a VO second. */
export const f = (sec: number) => Math.round(sec * 30);

/** Deterministic 0..1 hash. */
export const hash = (n: number) => {
  const x = Math.sin(n * 91.345 + 47.853) * 43758.5453;
  return x - Math.floor(x);
};

/** SVG transform applied about a pivot point. */
export const about = (x: number, y: number, t: string) => `translate(${x} ${y}) ${t} translate(${-x} ${-y})`;
