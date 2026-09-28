import { loadFont as loadBai } from "@remotion/google-fonts/BaiJamjuree";
import { loadFont as loadPlex } from "@remotion/google-fonts/IBMPlexSansThai";
import { loadFont as loadItim } from "@remotion/google-fonts/Itim";
import { loadFont as loadKanit } from "@remotion/google-fonts/Kanit";
import { loadFont as loadMitr } from "@remotion/google-fonts/Mitr";
import { loadFont as loadPattaya } from "@remotion/google-fonts/Pattaya";
import { loadFont as loadPrompt } from "@remotion/google-fonts/Prompt";
import { loadFont as loadSriracha } from "@remotion/google-fonts/Sriracha";

const thai: ("thai" | "latin")[] = ["thai", "latin"];

/**
 * Spray ad #7 identity: DATING-APP MATCH DECK.
 * Night-forest app background, bone-white profile cards with rounded photo
 * wells, coral "like" accents and a mint "match" glow borrowed from the
 * bottle's cedar green. Plex = app chrome, Kanit = profile names,
 * Itim = handwritten bios, then one face per hook so every beat reads new:
 * Prompt black = opening count · Plex typed = filter search · Kanit italic
 * = greasy slumping word · Mitr = extruded "มิติ" · Bai Jamjuree = time
 * ruler · Sriracha = "สักแบบ?" marker · Pattaya = "It's a Match".
 */
export const T = {
  ui: loadPlex("normal", { weights: ["400", "600", "700"], subsets: thai }).fontFamily,
  name: loadKanit("normal", { weights: ["600", "800", "900"], subsets: thai }).fontFamily,
  nameItalic: loadKanit("italic", { weights: ["800", "900"], subsets: thai }).fontFamily,
  bio: loadItim("normal", { weights: ["400"], subsets: thai }).fontFamily,
  count: loadPrompt("normal", { weights: ["900"], subsets: thai }).fontFamily,
  depth: loadMitr("normal", { weights: ["600", "700"], subsets: thai }).fontFamily,
  clock: loadBai("normal", { weights: ["500", "700"], subsets: thai }).fontFamily,
  marker: loadSriracha("normal", { weights: ["400"], subsets: thai }).fontFamily,
  script: loadPattaya("normal", { weights: ["400"], subsets: thai }).fontFamily,
} as const;

/** App palette. */
export const NIGHT = "#0E1F19";
export const NIGHT_2 = "#16342A";
export const BONE = "#F6F1E7";
export const INK = "#14201B";
export const MUTED = "#7F8C85";
export const CORAL = "#FF5C4D";
export const CORAL_DK = "#D63A2E";
export const MINT = "#7FE0B0";
export const CEDAR = "#2F5A43";
export const GOLD = "#FFC94A";
export const SKY = "#5FB6FF";

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Frames at 30 fps for a VO second. */
export const f = (sec: number) => Math.round(sec * 30);

/** The profile card on the 1080x1920 canvas. */
export const CARD = { x: 50, y: 214, w: 980, h: 1330, r: 46 } as const;

/** Soft stacked shadow for cards lying on the app background. */
export const CARD_SHADOW = "0 30px 60px rgba(0,0,0,0.45), 0 6px 14px rgba(0,0,0,0.35)";
