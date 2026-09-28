import { loadFont as loadJamjuree } from "@remotion/google-fonts/BaiJamjuree";
import { loadFont as loadPlex } from "@remotion/google-fonts/IBMPlexSansThai";
import { loadFont as loadMali } from "@remotion/google-fonts/Mali";
import { loadFont as loadSarabun } from "@remotion/google-fonts/Sarabun";

const subsets: ("thai" | "latin")[] = ["thai", "latin"];

/**
 * Ad #3 identity: SYSTEM ERROR + INSTRUCTION MANUAL.
 * Plex = OS dialog / status UI, Bai Jamjuree = manual + instrument labels,
 * Mali = proof-reader / checklist handwriting, Sarabun = road-sign numerals.
 */
export const T = {
  ui: loadPlex("normal", { weights: ["500", "700"], subsets }).fontFamily,
  manual: loadJamjuree("normal", { weights: ["600", "700"], subsets }).fontFamily,
  hand: loadMali("normal", { weights: ["600", "700"], subsets }).fontFamily,
  sign: loadSarabun("normal", { weights: ["800"], subsets }).fontFamily,
} as const;

export const INK = "#16161A";
export const PAPER = "#F1EEE5";
export const SIGNAL = "#E5322B";
export const OK = "#1C9A57";
export const AMBER = "#FFC21A";
export const OS_GREY = "#C9C6BE";
export const OS_BLUE = "#1C2C8C";

/** SVG transform applied about a pivot point. */
export const about = (x: number, y: number, t: string) =>
  `translate(${x} ${y}) ${t} translate(${-x} ${-y})`;

/** Deterministic 0..1 hash. */
export const hash = (n: number) => {
  const x = Math.sin(n * 91.7 + 17.3) * 43758.5453;
  return x - Math.floor(x);
};
