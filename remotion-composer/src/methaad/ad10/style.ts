import { loadFont as loadBai } from "@remotion/google-fonts/BaiJamjuree";
import { loadFont as loadChakra } from "@remotion/google-fonts/ChakraPetch";
import { loadFont as loadChonburi } from "@remotion/google-fonts/Chonburi";
import { loadFont as loadItim } from "@remotion/google-fonts/Itim";
import { loadFont as loadKanit } from "@remotion/google-fonts/Kanit";
import { loadFont as loadMitr } from "@remotion/google-fonts/Mitr";
import { loadFont as loadPattaya } from "@remotion/google-fonts/Pattaya";
import { loadFont as loadPrompt } from "@remotion/google-fonts/Prompt";
import { loadFont as loadSriracha } from "@remotion/google-fonts/Sriracha";

const subsets: ("thai" | "latin")[] = ["thai", "latin"];

/**
 * Ad #10 identity: COUNTDOWN RACE HUD. A seven-segment "leave the house in"
 * clock ticks from 10:00 to the bus, over a segmented task bar.
 * Chakra Petch = HUD chrome, Chonburi = ringing alarm word, Kanit = hazard
 * tape + red alert, Mitr = water-level word, Bai Jamjuree = hanger tag + bus
 * ticket print, Prompt = the squashed flat word, Sriracha = powder marker,
 * Pattaya = scrunched word, Itim = swoop of the styling pass.
 */
export const R = {
  hud: loadChakra("normal", { weights: ["500", "700"], subsets }).fontFamily,
  alarm: loadChonburi("normal", { weights: ["400"], subsets }).fontFamily,
  alert: loadKanit("italic", { weights: ["900"], subsets }).fontFamily,
  water: loadMitr("normal", { weights: ["700"], subsets }).fontFamily,
  print: loadBai("normal", { weights: ["500", "700"], subsets }).fontFamily,
  flat: loadPrompt("normal", { weights: ["900"], subsets }).fontFamily,
  marker: loadSriracha("normal", { weights: ["400"], subsets }).fontFamily,
  scrunch: loadPattaya("normal", { weights: ["400"], subsets }).fontFamily,
  swoop: loadItim("normal", { weights: ["400"], subsets }).fontFamily,
} as const;

export const GLASS = "rgba(10,12,16,0.84)";
export const INK = "#0E1116";
export const AMBER = "#FFB21A";
export const ALERT = "#FF3B30";
export const GO = "#2EE07B";
export const WATER = "#3FA9F5";
export const PAPER = "#F6F3EA";
export const HAZARD = "#FFD21A";

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
