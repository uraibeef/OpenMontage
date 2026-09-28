import { loadFont as loadBai } from "@remotion/google-fonts/BaiJamjuree";
import { loadFont as loadChakra } from "@remotion/google-fonts/ChakraPetch";
import { loadFont as loadCharm } from "@remotion/google-fonts/Charm";
import { loadFont as loadChonburi } from "@remotion/google-fonts/Chonburi";
import { loadFont as loadItim } from "@remotion/google-fonts/Itim";
import { loadFont as loadKanit } from "@remotion/google-fonts/Kanit";
import { loadFont as loadMali } from "@remotion/google-fonts/Mali";
import { loadFont as loadPridi } from "@remotion/google-fonts/Pridi";
import { loadFont as loadPrompt } from "@remotion/google-fonts/Prompt";
import { loadFont as loadSriracha } from "@remotion/google-fonts/Sriracha";
import { loadFont as loadSrisakdi } from "@remotion/google-fonts/Srisakdi";
import { loadFont as loadTrirong } from "@remotion/google-fonts/Trirong";

const subsets: ("thai" | "latin")[] = ["thai", "latin"];

/**
 * Spray ad #10 identity: ROM-COM MOVIE. Letterbox bars, a warm blush grade and
 * film grain wrap every shot; a film-title card opens, Love-Actually style
 * cue cards carry the friend's advice, a restroom sign + a 2:00 mirror clock
 * time the fix, a heart monitor flatlines and then jumps, and the credits roll
 * with the real green bottle as the star. One type voice per beat.
 */
export const S = {
  title: loadSrisakdi("normal", { weights: ["700"], subsets }).fontFamily,
  chrome: loadChakra("normal", { weights: ["600", "700"], subsets }).fontFamily,
  card1: loadItim("normal", { weights: ["400"], subsets }).fontFamily,
  card2: loadSriracha("normal", { weights: ["400"], subsets }).fontFamily,
  card3: loadMali("normal", { weights: ["700"], subsets }).fontFamily,
  sign: loadBai("normal", { weights: ["700"], subsets }).fontFamily,
  clock: loadKanit("normal", { weights: ["800"], subsets }).fontFamily,
  rise: loadPrompt("normal", { weights: ["900"], subsets }).fontFamily,
  date: loadCharm("normal", { weights: ["700"], subsets }).fontFamily,
  end: loadTrirong("italic", { weights: ["800"], subsets }).fontFamily,
  part: loadChonburi("normal", { weights: ["400"], subsets }).fontFamily,
  credits: loadPridi("normal", { weights: ["500", "700"], subsets }).fontFamily,
} as const;

/** Rom-com palette: cream paper, blush, cherry red, ink; bottle green for the star. */
export const INK = "#141013";
export const CREAM = "#FFF6EA";
export const BLUSH = "#F7B9C4";
export const ROSE = "#E4577A";
export const CHERRY = "#C4122F";
export const GOLD = "#F2C46D";
export const WHITE = "#FFFFFF";
export const MONITOR = "#7CFFB0";
export const CEDAR = "#1F5A3C";
export const LEAF = "#8FE3A8";

/** Letterbox bar height (px) — the frame every shot is shown through. */
export const BAR = 150;

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
export const FRAME = { width: 1080, height: 1920, viewBox: "0 0 1080 1920", style: { position: "absolute", inset: 0, overflow: "visible" } } as const;

/** Soft dark lift that keeps type readable on footage. */
export const LIFT = "0 6px 20px rgba(0,0,0,0.55)";
