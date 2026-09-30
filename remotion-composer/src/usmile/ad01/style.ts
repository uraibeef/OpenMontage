import { loadFont as loadMali } from "@remotion/google-fonts/Mali";
import { loadFont as loadMitr } from "@remotion/google-fonts/Mitr";

const subsets: ("thai" | "latin")[] = ["thai", "latin"];

/**
 * Usmile ad #1 identity: a HANDWRITTEN BREAK-UP LETTER from a toothpick.
 * Mali = the ink handwriting, Mitr = the Usmile sticky note.
 */
export const T = {
  ink: loadMali("normal", { weights: ["600", "700"], subsets }).fontFamily,
  note: loadMitr("normal", { weights: ["500", "600"], subsets }).fontFamily,
} as const;

export const PAPER = "#F3EBDA";
export const INK = "#1E2540";
export const PEN_RED = "#C8362B";
export const NOTE_YELLOW = "#F7D64A";
export const NOTE_BLUE = "#7FC7E8";
export const FPS = 30;
export const s = (sec: number) => Math.round(sec * FPS);
