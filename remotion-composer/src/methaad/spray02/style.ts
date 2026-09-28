import { loadFont as loadBai } from "@remotion/google-fonts/BaiJamjuree";
import { loadFont as loadChakra } from "@remotion/google-fonts/ChakraPetch";
import { loadFont as loadCharm } from "@remotion/google-fonts/Charm";
import { loadFont as loadChonburi } from "@remotion/google-fonts/Chonburi";
import { loadFont as loadFahkwang } from "@remotion/google-fonts/Fahkwang";
import { loadFont as loadItim } from "@remotion/google-fonts/Itim";
import { loadFont as loadKanit } from "@remotion/google-fonts/Kanit";
import { loadFont as loadKodchasan } from "@remotion/google-fonts/Kodchasan";
import { loadFont as loadMali } from "@remotion/google-fonts/Mali";
import { loadFont as loadMitr } from "@remotion/google-fonts/Mitr";
import { loadFont as loadPridi } from "@remotion/google-fonts/Pridi";
import { loadFont as loadPrompt } from "@remotion/google-fonts/Prompt";
import { loadFont as loadSarabun } from "@remotion/google-fonts/Sarabun";
import { loadFont as loadSriracha } from "@remotion/google-fonts/Sriracha";
import { loadFont as loadTaviraj } from "@remotion/google-fonts/Taviraj";
import { loadFont as loadTrirong } from "@remotion/google-fonts/Trirong";

const subsets: ("thai" | "latin")[] = ["thai", "latin"];

/**
 * Spray ad #2 identity: EXPECTATION vs REALITY. What he imagines is printed
 * as a boiling graphite + honey riso on notebook paper (pencil thought
 * bubbles, sticky honey gloop); what really happens is clean full-colour
 * footage with cedar-green / wood / leaf graphics. They meet in a torn
 * split-screen, and a "POV: ครั้งแรก" stamp rides along the whole ad.
 * One font per hook so no two beats read alike.
 */
export const S = {
  stamp: loadBai("normal", { weights: ["700"], subsets }).fontFamily,
  volume: loadMitr("normal", { weights: ["700"], subsets }).fontFamily,
  pencil: loadItim("normal", { weights: ["400"], subsets }).fontFamily,
  goo: loadChonburi("normal", { weights: ["400"], subsets }).fontFamily,
  order: loadChakra("normal", { weights: ["700"], subsets }).fontFamily,
  wood: loadTaviraj("normal", { weights: ["800"], subsets }).fontFamily,
  script: loadCharm("normal", { weights: ["700"], subsets }).fontFamily,
  todo: loadPridi("normal", { weights: ["600"], subsets }).fontFamily,
  sprout: loadFahkwang("normal", { weights: ["700"], subsets }).fontFamily,
  thick: loadPrompt("normal", { weights: ["900"], subsets }).fontFamily,
  touch: loadMali("normal", { weights: ["700"], subsets }).fontFamily,
  label: loadKodchasan("normal", { weights: ["700"], subsets }).fontFamily,
  clean: loadSarabun("normal", { weights: ["800"], subsets }).fontFamily,
  dizzy: loadSriracha("normal", { weights: ["400"], subsets }).fontFamily,
  slap: loadKanit("italic", { weights: ["900"], subsets }).fontFamily,
  long: loadTrirong("normal", { weights: ["800"], subsets }).fontFamily,
} as const;

/** Imagination world (riso print). */
export const GRAPHITE = "#1E1E22";
export const HONEY = "#E6A92E";
export const HONEY_DK = "#9A6410";
export const NOTE = "#F2EDE0";
/** Reality world. */
export const CEDAR = "#1F4D3A";
export const LEAF = "#6DBE6A";
export const MINT = "#DDF2E3";
export const WOOD = "#B27B45";
export const WOOD_DK = "#5E3A1A";
export const WHITE = "#FFFFFF";
/** Punch accent: stamps, strikes, the deal. */
export const RED = "#E4322B";

export const IMAGINE_INKS = { dark: GRAPHITE, mid: HONEY, paper: NOTE };

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
