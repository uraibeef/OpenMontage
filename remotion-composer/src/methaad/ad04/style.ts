import { loadFont as loadBai } from "@remotion/google-fonts/BaiJamjuree";
import { loadFont as loadChakra } from "@remotion/google-fonts/ChakraPetch";
import { loadFont as loadFahkwang } from "@remotion/google-fonts/Fahkwang";
import { loadFont as loadKanit } from "@remotion/google-fonts/Kanit";
import { loadFont as loadMali } from "@remotion/google-fonts/Mali";
import { loadFont as loadPlex } from "@remotion/google-fonts/IBMPlexSansThai";

const subsets: ("thai" | "latin")[] = ["thai", "latin"];

/**
 * Ad #4 identity: the artifacts on a young Thai guy's phone and desk.
 * Plex = the phone's own UI, Bai Jamjuree = thermal-printer / print type,
 * Fahkwang = shop letterhead, Mali = his ballpoint handwriting,
 * Chakra Petch = game HUD, Kanit = sticker + rubber-stamp display.
 */
export const P = {
  ui: loadPlex("normal", { weights: ["400", "500", "600", "700"], subsets }).fontFamily,
  print: loadBai("normal", { weights: ["500", "700"], subsets }).fontFamily,
  shop: loadFahkwang("normal", { weights: ["700"], subsets }).fontFamily,
  hand: loadMali("normal", { weights: ["600"], subsets }).fontFamily,
  hud: loadChakra("normal", { weights: ["700"], subsets }).fontFamily,
  sticker: loadKanit("normal", { weights: ["900"], subsets }).fontFamily,
} as const;

export const PAPER = "#FBF7EE";
export const INK = "#17171B";
export const STAMP_RED = "#D8262B";
export const PEN_BLUE = "#1C3FA0";
export const CORAL = "#FF5A3C";
export const LIME = "#B6F24A";
export const SUN = "#FFD23F";

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Frames at 30 fps for a VO second. */
export const f = (sec: number) => Math.round(sec * 30);
