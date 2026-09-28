import { loadFont as loadBodoni } from "@remotion/google-fonts/BodoniModa";
import { loadFont as loadCharm } from "@remotion/google-fonts/Charm";
import { loadFont as loadCormorant } from "@remotion/google-fonts/CormorantGaramond";
import { loadFont as loadFahkwang } from "@remotion/google-fonts/Fahkwang";
import { loadFont as loadNotoSerif } from "@remotion/google-fonts/NotoSerifThai";
import { loadFont as loadPlex } from "@remotion/google-fonts/IBMPlexSansThai";
import { loadFont as loadKanit } from "@remotion/google-fonts/Kanit";
import { loadFont as loadSarabun } from "@remotion/google-fonts/Sarabun";
import { loadFont as loadPridi } from "@remotion/google-fonts/Pridi";
import { loadFont as loadSrisakdi } from "@remotion/google-fonts/Srisakdi";
import { loadFont as loadTaviraj } from "@remotion/google-fonts/Taviraj";
import { loadFont as loadTrirong } from "@remotion/google-fonts/Trirong";

const thai: ("thai" | "latin")[] = ["thai", "latin"];
const latin: "latin"[] = ["latin"];

/**
 * Spray ad #1 identity: MINIMAL LUXURY FRAGRANCE AD. Deep forest green and
 * cream, hairline rules, thin serifs, botanical line drawings, soft mist.
 * One typeface per beat so every hook reads differently:
 * Trirong = mist word · Taviraj = engraved cartouche · Noto Serif Thai =
 * order ledger + scent notes · Cormorant/Bodoni = Latin numerals and labels ·
 * Fahkwang = spec callout · Pridi = dimension label · Srisakdi = cap word ·
 * IBM Plex Sans Thai (thin) = pump press · Charm = handwritten "ตามใจ" ·
 * Sarabun italic = touch word · Kanit thin = non-sticky word.
 */
export const T = {
  mist: loadTrirong("italic", { weights: ["200", "300"], subsets: thai }).fontFamily,
  mistUp: loadTrirong("normal", { weights: ["200", "700"], subsets: thai }).fontFamily,
  engraved: loadTaviraj("normal", { weights: ["300", "600"], subsets: thai }).fontFamily,
  ledger: loadNotoSerif("normal", { weights: ["200", "400", "800"], subsets: thai }).fontFamily,
  spec: loadFahkwang("normal", { weights: ["300", "500"], subsets: thai }).fontFamily,
  specItalic: loadFahkwang("italic", { weights: ["300"], subsets: thai }).fontFamily,
  dim: loadPridi("normal", { weights: ["200", "500"], subsets: thai }).fontFamily,
  ornate: loadSrisakdi("normal", { weights: ["400", "700"], subsets: thai }).fontFamily,
  thin: loadPlex("normal", { weights: ["100", "300"], subsets: thai }).fontFamily,
  script: loadCharm("normal", { weights: ["400", "700"], subsets: thai }).fontFamily,
  touch: loadSarabun("italic", { weights: ["200"], subsets: thai }).fontFamily,
  clean: loadKanit("normal", { weights: ["200", "500"], subsets: thai }).fontFamily,
  latin: loadCormorant("normal", { weights: ["300", "500"], subsets: latin }).fontFamily,
  latinItalic: loadCormorant("italic", { weights: ["300", "500"], subsets: latin }).fontFamily,
  didone: loadBodoni("normal", { weights: ["400", "600"], subsets: latin }).fontFamily,
  didoneItalic: loadBodoni("italic", { weights: ["400"], subsets: latin }).fontFamily,
} as const;

/** Forest + cream palette. */
export const FOREST = "#16301F";
export const PINE = "#2C4D36";
export const SAGE = "#8FA67E";
export const CREAM = "#F3ECDC";
export const PAPER = "#EFE6D2";
export const BRASS = "#C2A66B";
export const INKGREEN = "#0E2216";

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Frames at 30 fps for a VO second. */
export const f = (sec: number) => Math.round(sec * 30);

/** Deterministic 0..1 hash. */
export const hash = (n: number) => {
  const x = Math.sin(n * 91.345 + 47.853) * 43758.5453;
  return x - Math.floor(x);
};

/** SVG transform applied about a pivot point. */
export const about = (x: number, y: number, t: string) => `translate(${x} ${y}) ${t} translate(${-x} ${-y})`;

/** Soft cream text shadow that keeps thin serifs legible on footage. */
export const LIFT = "0 2px 18px rgba(8,20,12,0.55), 0 0 2px rgba(8,20,12,0.6)";
