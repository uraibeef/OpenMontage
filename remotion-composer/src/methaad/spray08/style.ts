import { loadFont as loadBai } from "@remotion/google-fonts/BaiJamjuree";
import { loadFont as loadChakra } from "@remotion/google-fonts/ChakraPetch";
import { loadFont as loadCharm } from "@remotion/google-fonts/Charm";
import { loadFont as loadChonburi } from "@remotion/google-fonts/Chonburi";
import { loadFont as loadFahkwang } from "@remotion/google-fonts/Fahkwang";
import { loadFont as loadPlex } from "@remotion/google-fonts/IBMPlexSansThai";
import { loadFont as loadItim } from "@remotion/google-fonts/Itim";
import { loadFont as loadKanit } from "@remotion/google-fonts/Kanit";
import { loadFont as loadKodchasan } from "@remotion/google-fonts/Kodchasan";
import { loadFont as loadMali } from "@remotion/google-fonts/Mali";
import { loadFont as loadMitr } from "@remotion/google-fonts/Mitr";
import { loadFont as loadNotoSerif } from "@remotion/google-fonts/NotoSerifThai";
import { loadFont as loadPattaya } from "@remotion/google-fonts/Pattaya";
import { loadFont as loadPridi } from "@remotion/google-fonts/Pridi";
import { loadFont as loadPrompt } from "@remotion/google-fonts/Prompt";
import { loadFont as loadSarabun } from "@remotion/google-fonts/Sarabun";
import { loadFont as loadSriracha } from "@remotion/google-fonts/Sriracha";
import { loadFont as loadTaviraj } from "@remotion/google-fonts/Taviraj";
import { loadFont as loadTrirong } from "@remotion/google-fonts/Trirong";

const subsets: ("thai" | "latin")[] = ["thai", "latin"];

/**
 * Spray ad #8 identity: FIGHT NIGHT SCORECARD. Two corners — the gold-trunks
 * "ของเหนียวๆ" blob vs the green bottle — four rounds, four different round
 * cards, judges' scores, a KO bell, a 4–0 board and a championship belt.
 * One font per hook so no two beats read alike; ChakraPetch = arena chrome.
 */
export const S = {
  ui: loadChakra("normal", { weights: ["600", "700"], subsets }).fontFamily,
  poster: loadChonburi("normal", { weights: ["400"], subsets }).fontFamily,
  vs: loadKanit("italic", { weights: ["900"], subsets }).fontFamily,
  goo: loadItim("normal", { weights: ["400"], subsets }).fontFamily,
  card1: loadPrompt("normal", { weights: ["900"], subsets }).fontFamily,
  card2: loadBai("normal", { weights: ["700"], subsets }).fontFamily,
  card3: loadMitr("normal", { weights: ["700"], subsets }).fontFamily,
  card4: loadFahkwang("normal", { weights: ["700"], subsets }).fontFamily,
  drip: loadTrirong("normal", { weights: ["800"], subsets }).fontFamily,
  control: loadSarabun("normal", { weights: ["800"], subsets }).fontFamily,
  judge: loadSriracha("normal", { weights: ["400"], subsets }).fontFamily,
  stuck: loadMali("normal", { weights: ["700"], subsets }).fontFamily,
  clean: loadPlex("normal", { weights: ["700"], subsets }).fontFamily,
  flat: loadPattaya("normal", { weights: ["400"], subsets }).fontFamily,
  lift: loadKodchasan("normal", { weights: ["700"], subsets }).fontFamily,
  roots: loadNotoSerif("normal", { weights: ["900"], subsets }).fontFamily,
  wash: loadCharm("normal", { weights: ["700"], subsets }).fontFamily,
  once: loadTaviraj("normal", { weights: ["900"], subsets }).fontFamily,
  belt: loadPridi("normal", { weights: ["700"], subsets }).fontFamily,
} as const;

export const INK = "#0E0D0C";
export const CANVAS = "#F2EADB";
export const WHITE = "#FFFFFF";
/** Gel corner: gold trunks. */
export const GOLD = "#F0B323";
export const GOLD_LT = "#FFE08A";
export const GOLD_DK = "#6E4A05";
/** Spray corner: the green bottle. */
export const CEDAR = "#1D573A";
export const LEAF = "#72D68F";
/** Fight red: bell, KO, sale. */
export const RED = "#E0261C";

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

/** Full-frame SVG with the 1080x1920 viewBox. */
export const FRAME = { width: 1080, height: 1920, viewBox: "0 0 1080 1920", style: { position: "absolute", inset: 0 } } as const;

/** Dark text shadow that keeps type readable on busy footage. */
export const LIFT = "0 8px 22px rgba(0,0,0,0.6)";

/** Common stroke-behind-fill props for SVG text. */
export const outline = (color: string, width: number) =>
  ({ stroke: color, strokeWidth: width, strokeLinejoin: "round", style: { paintOrder: "stroke" } }) as const;
