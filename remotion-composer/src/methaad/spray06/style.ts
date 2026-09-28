import { loadFont as loadCharm } from "@remotion/google-fonts/Charm";
import { loadFont as loadChonburi } from "@remotion/google-fonts/Chonburi";
import { loadFont as loadFell } from "@remotion/google-fonts/IMFellEnglish";
import { loadFont as loadFellSC } from "@remotion/google-fonts/IMFellEnglishSC";
import { loadFont as loadElite } from "@remotion/google-fonts/SpecialElite";
import { loadFont as loadSriracha } from "@remotion/google-fonts/Sriracha";
import { loadFont as loadTrirong } from "@remotion/google-fonts/Trirong";
import { loadFont as loadPridi } from "@remotion/google-fonts/Pridi";
import { loadFont as loadSrisakdi } from "@remotion/google-fonts/Srisakdi";
import { loadFont as loadNotoSerif } from "@remotion/google-fonts/NotoSerifThai";

const thai: ("thai" | "latin")[] = ["thai", "latin"];
const latin: "latin"[] = ["latin"];

/**
 * Spray ad #6 identity: BOTANICAL SPECIMEN / FIELD-GUIDE PLATES.
 * Aged paper, sepia ink, pressed-leaf greens and a rust annotation red.
 * Latin side: IM Fell (old-style letterpress) + Special Elite (typewritten
 * specimen labels). Thai side, one face per hook so every beat reads new:
 * Chonburi = cover title · Charm = handwritten tag · Trirong = rising word ·
 * Noto Serif Thai heavy = swelling word · Pridi = glossy/blotted word ·
 * Sriracha = field-note ruler + appendix · Srisakdi = stretched word ·
 * Noto Serif Thai light = rinse word · Charm = scent curl · Chonburi = tag.
 */
export const T = {
  cover: loadChonburi("normal", { weights: ["400"], subsets: thai }).fontFamily,
  hand: loadCharm("normal", { weights: ["400", "700"], subsets: thai }).fontFamily,
  rise: loadTrirong("normal", { weights: ["300", "800"], subsets: thai }).fontFamily,
  riseItalic: loadTrirong("italic", { weights: ["300"], subsets: thai }).fontFamily,
  serif: loadNotoSerif("normal", { weights: ["200", "500", "900"], subsets: thai }).fontFamily,
  gloss: loadPridi("normal", { weights: ["300", "700"], subsets: thai }).fontFamily,
  note: loadSriracha("normal", { weights: ["400"], subsets: thai }).fontFamily,
  ornate: loadSrisakdi("normal", { weights: ["700"], subsets: thai }).fontFamily,
  fell: loadFell("normal", { weights: ["400"], subsets: latin }).fontFamily,
  fellItalic: loadFell("italic", { weights: ["400"], subsets: latin }).fontFamily,
  fellSC: loadFellSC("normal", { weights: ["400"], subsets: latin }).fontFamily,
  type: loadElite("normal", { weights: ["400"], subsets: latin }).fontFamily,
} as const;

/** Field-guide palette. */
export const PAPER = "#ECE2C6";
export const PAPER_DK = "#D8C8A0";
export const MANILA = "#E2CF9E";
export const INK = "#2B2116";
export const SEPIA = "#6B4F32";
export const LEAF = "#3E5A34";
export const MOSS = "#7A9152";
export const RUST = "#A4452C";
export const WATER = "#6E9AA6";

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Frames at 30 fps for a VO second. */
export const f = (sec: number) => Math.round(sec * 30);

/** Deterministic 0..1 hash. */
export const hash = (n: number) => {
  const x = Math.sin(n * 91.345 + 47.853) * 43758.5453;
  return x - Math.floor(x);
};

/** Soft paper-shadow for labels lying on footage. */
export const CARD_SHADOW = "0 18px 40px rgba(20,14,6,0.45), 0 3px 8px rgba(20,14,6,0.35)";
