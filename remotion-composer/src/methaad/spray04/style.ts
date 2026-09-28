import { loadFont as loadBai } from "@remotion/google-fonts/BaiJamjuree";
import { loadFont as loadChakra } from "@remotion/google-fonts/ChakraPetch";
import { loadFont as loadCharm } from "@remotion/google-fonts/Charm";
import { loadFont as loadChonburi } from "@remotion/google-fonts/Chonburi";
import { loadFont as loadFahkwang } from "@remotion/google-fonts/Fahkwang";
import { loadFont as loadPlex } from "@remotion/google-fonts/IBMPlexSansThai";
import { loadFont as loadItim } from "@remotion/google-fonts/Itim";
import { loadFont as loadKanit } from "@remotion/google-fonts/Kanit";
import { loadFont as loadKodchasan } from "@remotion/google-fonts/Kodchasan";
import { loadFont as loadMali } from "@remotion/google-fonts/Mali";
import { loadFont as loadMitr } from "@remotion/google-fonts/Mitr";
import { loadFont as loadPattaya } from "@remotion/google-fonts/Pattaya";
import { loadFont as loadPrompt } from "@remotion/google-fonts/Prompt";
import { loadFont as loadSarabun } from "@remotion/google-fonts/Sarabun";
import { loadFont as loadTrirong } from "@remotion/google-fonts/Trirong";

const subsets: ("thai" | "latin")[] = ["thai", "latin"];

/**
 * Spray ad #4 identity: the FRONT CAMERA. The whole ad is seen through a
 * selfie-camera app — black status bar, mode strip, yellow focus UI. The
 * camera stops focusing on the face and starts focusing on the hair; the
 * fix arrives as a PORTRAIT-mode upgrade; the deal is the shutter.
 * One font per hook so no two beats read alike; ChakraPetch = camera chrome.
 */
export const S = {
  ui: loadChakra("normal", { weights: ["600", "700"], subsets }).fontFamily,
  toast: loadSarabun("normal", { weights: ["800"], subsets }).fontFamily,
  look: loadKanit("italic", { weights: ["900"], subsets }).fontFamily,
  flat: loadChonburi("normal", { weights: ["400"], subsets }).fontFamily,
  shape: loadMali("normal", { weights: ["700"], subsets }).fontFamily,
  sticky: loadItim("normal", { weights: ["400"], subsets }).fontFamily,
  greasy: loadTrirong("normal", { weights: ["800"], subsets }).fontFamily,
  portrait: loadMitr("normal", { weights: ["700"], subsets }).fontFamily,
  step: loadBai("normal", { weights: ["700"], subsets }).fontFamily,
  root: loadPrompt("normal", { weights: ["900"], subsets }).fontFamily,
  oil: loadPlex("normal", { weights: ["700"], subsets }).fontFamily,
  smooth: loadCharm("normal", { weights: ["700"], subsets }).fontFamily,
  good: loadFahkwang("normal", { weights: ["700"], subsets }).fontFamily,
  filter: loadKodchasan("normal", { weights: ["700"], subsets }).fontFamily,
  deal: loadPattaya("normal", { weights: ["400"], subsets }).fontFamily,
} as const;

/** Camera app chrome. */
export const INK = "#0B0B0C";
export const CAM = "#FFD60A";
export const WHITE = "#FFFFFF";
/** Problem side: grease + warning. */
export const GREASE = "#E3A21A";
export const GREASE_DK = "#7A4A05";
export const RED = "#FF3B30";
/** Fix side: the green bottle. */
export const CEDAR = "#1F4D3A";
export const LEAF = "#7BD17A";

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

/** Full-frame SVG with the 1080x1920 viewBox. */
export const FRAME = { width: 1080, height: 1920, viewBox: "0 0 1080 1920", style: { position: "absolute", inset: 0 } } as const;

/** Dark text shadow that keeps white type readable on busy footage. */
export const LIFT = "0 6px 18px rgba(0,0,0,0.55)";
