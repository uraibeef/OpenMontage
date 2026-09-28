import { loadFont as loadChakra } from "@remotion/google-fonts/ChakraPetch";
import { loadFont as loadChonburi } from "@remotion/google-fonts/Chonburi";
import { loadFont as loadKanit } from "@remotion/google-fonts/Kanit";
import { loadFont as loadKodchasan } from "@remotion/google-fonts/Kodchasan";
import { loadFont as loadPattaya } from "@remotion/google-fonts/Pattaya";

const subsets: ("thai" | "latin")[] = ["thai", "latin"];

/**
 * Ad #9 identity: a fighting-game CHARACTER SELECT / trading-card screen.
 * Kanit Black Italic = arcade title slam, Chakra Petch = HUD + stats,
 * Pattaya = card class names, Kodchasan = RPG dialogue box,
 * Chonburi = legendary item name.
 */
export const G = {
  title: loadKanit("italic", { weights: ["900"], subsets }).fontFamily,
  hud: loadChakra("normal", { weights: ["500", "700"], subsets }).fontFamily,
  cls: loadPattaya("normal", { weights: ["400"], subsets }).fontFamily,
  talk: loadKodchasan("normal", { weights: ["600", "700"], subsets }).fontFamily,
  item: loadChonburi("normal", { weights: ["400"], subsets }).fontFamily,
} as const;

/** Screen: deep ink navy, arcade gold highlight; each class has its own colour. */
export const NAVY = "#0B0E1F";
export const NAVY_2 = "#161C3A";
export const GOLD = "#FFC83A";
export const WHITE = "#F7F4EC";
export const HOT = "#FF3B5C";

export const CLASS = {
  lazy: { main: "#FF9E1F", dark: "#5A2A00" },
  rider: { main: "#2BD4F0", dark: "#003A48" },
  fine: { main: "#C66BFF", dark: "#330058" },
} as const;

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Frames at 30 fps for a VO second. */
export const f = (sec: number) => Math.round(sec * 30);

/** Deterministic 0..1 hash. */
export const hash = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
