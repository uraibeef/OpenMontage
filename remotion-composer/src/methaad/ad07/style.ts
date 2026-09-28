import { loadFont as loadChakra } from "@remotion/google-fonts/ChakraPetch";
import { loadFont as loadCharm } from "@remotion/google-fonts/Charm";
import { loadFont as loadChonburi } from "@remotion/google-fonts/Chonburi";
import { loadFont as loadItim } from "@remotion/google-fonts/Itim";
import { loadFont as loadKodchasan } from "@remotion/google-fonts/Kodchasan";
import { loadFont as loadMitr } from "@remotion/google-fonts/Mitr";
import { loadFont as loadPlex } from "@remotion/google-fonts/IBMPlexSansThai";
import { loadFont as loadSarabun } from "@remotion/google-fonts/Sarabun";
import { loadFont as loadSriracha } from "@remotion/google-fonts/Sriracha";

const subsets: ("thai" | "latin")[] = ["thai", "latin"];

/**
 * Ad #7 identity: a 7-DAY DIARY / HABIT TRACKER. A Thai tear-off day pad
 * counts the days; every beat is a different journal artifact.
 * Chonburi = tear-off pad numerals, Sarabun = pad print + rubber stamp,
 * Kodchasan = masking-tape label, Sriracha = marker on a sticky note,
 * Itim = ballpoint doodle, Mitr = crumpled scrap, Plex = chat UI,
 * Chakra Petch = stopwatch, Charm = fountain-pen diary line.
 */
export const D = {
  pad: loadChonburi("normal", { weights: ["400"], subsets }).fontFamily,
  print: loadSarabun("normal", { weights: ["800"], subsets }).fontFamily,
  tape: loadKodchasan("normal", { weights: ["700"], subsets }).fontFamily,
  marker: loadSriracha("normal", { weights: ["400"], subsets }).fontFamily,
  pen: loadItim("normal", { weights: ["400"], subsets }).fontFamily,
  scrap: loadMitr("normal", { weights: ["700"], subsets }).fontFamily,
  ui: loadPlex("normal", { weights: ["500", "600"], subsets }).fontFamily,
  watch: loadChakra("normal", { weights: ["700"], subsets }).fontFamily,
  diary: loadCharm("normal", { weights: ["700"], subsets }).fontFamily,
} as const;

export const PAPER = "#FBF6EA";
export const INK = "#1B1B22";
export const PAD_RED = "#D9342B";
export const POSTIT = "#FFE45C";
export const BIC = "#2141B8";
export const RULE = "#9DB7E8";
export const DIARY_INK = "#1D2A55";
export const DIARY_RED = "#B3261E";

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Frames at 30 fps for a VO second. */
export const f = (sec: number) => Math.round(sec * 30);

/** Deterministic 0..1 hash. */
export const hash = (n: number) => {
  const x = Math.sin(n * 78.233 + 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

/** SVG transform applied about a pivot point. */
export const about = (x: number, y: number, t: string) => `translate(${x} ${y}) ${t} translate(${-x} ${-y})`;
