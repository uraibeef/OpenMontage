import { loadFont as loadChonburi } from "@remotion/google-fonts/Chonburi";
import { loadFont as loadMali } from "@remotion/google-fonts/Mali";
import { loadFont as loadMitr } from "@remotion/google-fonts/Mitr";
import { loadFont as loadPattaya } from "@remotion/google-fonts/Pattaya";
import { loadFont as loadPrompt } from "@remotion/google-fonts/Prompt";
import { loadFont as loadSriracha } from "@remotion/google-fonts/Sriracha";
import { loadFont as loadTrirong } from "@remotion/google-fonts/Trirong";

const subsets: ("thai" | "latin")[] = ["thai", "latin"];

/**
 * Spray ad #3 identity: RECIPE CARD / COOKING-SHOW STEPS.
 * Prompt = step tiles + timer numerals, Trirong = recipe-card serif,
 * Sriracha = marker notes on footage, Chonburi = rubber stamp / enamel sign,
 * Mali = soap-bubble letters, Mitr = cooking-show ribbon, Pattaya = chef sign-off.
 */
export const T = {
  tile: loadPrompt("normal", { weights: ["700", "800"], subsets }).fontFamily,
  card: loadTrirong("normal", { weights: ["700", "800"], subsets }).fontFamily,
  marker: loadSriracha("normal", { weights: ["400"], subsets }).fontFamily,
  stamp: loadChonburi("normal", { weights: ["400"], subsets }).fontFamily,
  bubble: loadMali("normal", { weights: ["700"], subsets }).fontFamily,
  ribbon: loadMitr("normal", { weights: ["600"], subsets }).fontFamily,
  script: loadPattaya("normal", { weights: ["400"], subsets }).fontFamily,
} as const;

/** Kitchen palette keyed to the bottle: cedar green, card cream, tomato red. */
export const INK = "#1E1B18";
export const CREAM = "#F6EEDC";
export const CARD_LINE = "#9CC3D5";
export const CEDAR = "#3D5A3A";
export const CEDAR_LIGHT = "#8FB08A";
export const TOMATO = "#D9432B";
export const BUTTER = "#F2C94C";
export const WATER = "#7CC7EA";

export const FPS = 30;
export const s = (sec: number) => Math.round(sec * FPS);

/** SVG transform about a pivot. */
export const about = (x: number, y: number, t: string) =>
  `translate(${x} ${y}) ${t} translate(${-x} ${-y})`;

/** Deterministic 0..1 hash. */
export const hash = (n: number) => {
  const x = Math.sin(n * 91.7 + 17.3) * 43758.5453;
  return x - Math.floor(x);
};
