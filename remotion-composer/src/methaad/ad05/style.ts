import { loadFont as loadChakra } from "@remotion/google-fonts/ChakraPetch";
import { loadFont as loadPlex } from "@remotion/google-fonts/IBMPlexSansThai";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";

const subsets: ("thai" | "latin")[] = ["thai", "latin"];

/**
 * Ad #5 identity: a PRODUCT TEARDOWN SPEC SHEET. Everything on screen is a
 * drafting instrument or a document field — leader lines, dimension arrows,
 * a caliper, a loupe, a calculator, a title block. Graphite plates, drafting
 * white linework, one calibration-orange accent.
 * Chakra Petch = engineered display, Plex Thai = field labels,
 * JetBrains Mono = part codes / readouts (latin + digits only).
 */
export const T = {
  disp: loadChakra("normal", { weights: ["600", "700"], subsets }).fontFamily,
  th: loadPlex("normal", { weights: ["500", "700"], subsets }).fontFamily,
  mono: loadMono("normal", { weights: ["500", "700"], subsets: ["latin"] }).fontFamily,
} as const;

export const GRAPHITE = "#101113";
export const PLATE = "rgba(16,17,19,0.86)";
export const LINE = "#F4F2EB";
export const SHEET = "#EDEAE1";
export const CAL = "#FF5A1F";
export const DIM = "rgba(244,242,235,0.55)";

/** Shadow that keeps white linework readable on busy footage. */
export const LIFT = "drop-shadow(0 0 3px rgba(0,0,0,0.85)) drop-shadow(0 3px 8px rgba(0,0,0,0.5))";

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Frames at 30 fps for a VO second. */
export const f = (sec: number) => Math.round(sec * 30);
