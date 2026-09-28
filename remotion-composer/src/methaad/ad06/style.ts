import { loadFont as loadChonburi } from "@remotion/google-fonts/Chonburi";
import { loadFont as loadItim } from "@remotion/google-fonts/Itim";
import { loadFont as loadMitr } from "@remotion/google-fonts/Mitr";
import { loadFont as loadPattaya } from "@remotion/google-fonts/Pattaya";
import { loadFont as loadSriracha } from "@remotion/google-fonts/Sriracha";

const subsets: ("thai" | "latin")[] = ["thai", "latin"];

/**
 * Ad #6 identity: a first-time-user manga reaction page.
 * Mitr = narration caption boxes, Sriracha = hand-lettered balloons,
 * Pattaya = brushy onomatopoeia (SFX lettering), Chonburi = shout / title
 * lettering, Itim = small margin notes. Black ink on white paper, grey
 * screentone, one spot red, and a narration-box yellow.
 */
export const M = {
  box: loadMitr("normal", { weights: ["500", "700"], subsets }).fontFamily,
  hand: loadSriracha("normal", { weights: ["400"], subsets }).fontFamily,
  sfx: loadPattaya("normal", { weights: ["400"], subsets }).fontFamily,
  shout: loadChonburi("normal", { weights: ["400"], subsets }).fontFamily,
  note: loadItim("normal", { weights: ["400"], subsets }).fontFamily,
} as const;

export const INK = "#141216";
export const PAPER = "#FFFFFF";
export const TONE = "#8B8791";
export const RED = "#E3262E";
export const NARR = "#FFE45C";

export const FPS = 30;
/** Frames at 30 fps for a VO second. */
export const f = (sec: number) => Math.round(sec * FPS);

/** Deterministic 0..1 noise. */
export const hash = (n: number) => {
  const x = Math.sin(n * 91.7 + 17.3) * 43758.5453;
  return x - Math.floor(x);
};
