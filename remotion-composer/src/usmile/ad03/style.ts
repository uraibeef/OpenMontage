import { loadFont as loadKanit } from "@remotion/google-fonts/Kanit";

const subsets: ("thai" | "latin")[] = ["thai", "latin"];

/** Usmile ad #3: clean explainer look — dark caption block, white Kanit, amber keywords. */
export const T = {
  cap: loadKanit("normal", { weights: ["600", "800"], subsets }).fontFamily,
} as const;

export const BLOCK = "#0F1218";
export const AMBER = "#FFC933";
export const WHITE = "#FFFFFF";
export const FPS = 30;
export const s = (sec: number) => Math.round(sec * FPS);
