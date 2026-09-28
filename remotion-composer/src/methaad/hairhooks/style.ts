import { loadFont as loadChonburi } from "@remotion/google-fonts/Chonburi";
import { loadFont as loadItim } from "@remotion/google-fonts/Itim";
import { loadFont as loadPattaya } from "@remotion/google-fonts/Pattaya";
import { loadFont as loadPrompt } from "@remotion/google-fonts/Prompt";

const subsets: ("thai" | "latin")[] = ["thai", "latin"];

/**
 * Hair-ad hook identity: old Thai barbershop signage. Chonburi = shop-sign
 * poster serif, Prompt = hard bold sans, Itim = hand lettering, Pattaya =
 * retro script. One barber-pole palette shared by every hook.
 */
export const H = {
  poster: loadChonburi("normal", { weights: ["400"], subsets }).fontFamily,
  bold: loadPrompt("normal", { weights: ["800", "900"], subsets }).fontFamily,
  hand: loadItim("normal", { weights: ["400"], subsets }).fontFamily,
  script: loadPattaya("normal", { weights: ["400"], subsets }).fontFamily,
} as const;

export const INK = "#141414";
export const CREAM = "#FFF4E0";
export const RED = "#E3262E";
export const BLUE = "#1F4FBF";

/** SVG transform applied about a pivot point. */
export const about = (x: number, y: number, t: string) =>
  `translate(${x} ${y}) ${t} translate(${-x} ${-y})`;
