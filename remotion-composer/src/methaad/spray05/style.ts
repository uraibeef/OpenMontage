import { loadFont as loadBaiJamjuree } from "@remotion/google-fonts/BaiJamjuree";
import { loadFont as loadChakraPetch } from "@remotion/google-fonts/ChakraPetch";
import { loadFont as loadChonburi } from "@remotion/google-fonts/Chonburi";
import { loadFont as loadFahkwang } from "@remotion/google-fonts/Fahkwang";
import { loadFont as loadKanit } from "@remotion/google-fonts/Kanit";
import { loadFont as loadMali } from "@remotion/google-fonts/Mali";
import { loadFont as loadMitr } from "@remotion/google-fonts/Mitr";

const subsets: ("thai" | "latin")[] = ["thai", "latin"];

/**
 * Spray ad #5 identity: FITNESS-APP STREAK / PROGRESS TRACKER.
 * Kanit italic = the app's streak numerals + POV card, ChakraPetch = warning
 * badge, Chonburi = the kettlebell "หนัก", Mitr = unlocked medal,
 * Fahkwang = sunset-clock badge, Mali = water-drop badge,
 * BaiJamjuree = final achievement card.
 */
export const T = {
  hud: loadKanit("italic", { weights: ["800", "900"], subsets }).fontFamily,
  hudUp: loadKanit("normal", { weights: ["600", "800"], subsets }).fontFamily,
  warn: loadChakraPetch("normal", { weights: ["700"], subsets }).fontFamily,
  heavy: loadChonburi("normal", { weights: ["400"], subsets }).fontFamily,
  medal: loadMitr("normal", { weights: ["600", "700"], subsets }).fontFamily,
  dusk: loadFahkwang("normal", { weights: ["700"], subsets }).fontFamily,
  water: loadMali("normal", { weights: ["700"], subsets }).fontFamily,
  trophy: loadBaiJamjuree("normal", { weights: ["700"], subsets }).fontFamily,
} as const;

/** App palette: carbon panels, lime "ring closed", flame streak, bottle cedar. */
export const PANEL = "rgba(14,19,17,0.86)";
export const CARBON = "#0E1311";
export const CHALK = "#F3F6EE";
export const LIME = "#C8F53C";
export const RING_OFF = "rgba(243,246,238,0.2)";
export const FLAME = "#FF5B1F";
export const FLAME_MID = "#FF9A1F";
export const FLAME_CORE = "#FFE066";
export const WARN = "#FFB400";
export const ALARM = "#E8342A";
export const CEDAR = "#2F5D45";
export const MINT = "#9FE0B5";
export const SUN = "#FF8A3D";
export const SUN_PINK = "#FF5E7A";
export const DUSK = "#3B2A5C";
export const WATER = "#5BC8FF";
export const GOLD = "#F5C542";

export const FPS = 30;
export const s = (sec: number) => Math.round(sec * FPS);

/** SVG transform about a pivot. */
export const about = (x: number, y: number, t: string) =>
  `translate(${x} ${y}) ${t} translate(${-x} ${-y})`;

/** Deterministic 0..1 hash. */
export const hash = (n: number) => {
  const x = Math.sin(n * 91.7 + 17.3) * 43758.5453;
  return x - Math.floor(x);
};

/** Arc path (deg, 0 = 12 o'clock, clockwise) for rings and gauges. */
export function arc(cx: number, cy: number, r: number, a0: number, a1: number) {
  const p = (a: number) => {
    const rad = ((a - 90) * Math.PI) / 180;
    return [cx + Math.cos(rad) * r, cy + Math.sin(rad) * r];
  };
  const [x0, y0] = p(a0);
  const [x1, y1] = p(a1);
  const large = Math.abs(a1 - a0) > 180 ? 1 : 0;
  const sweep = a1 > a0 ? 1 : 0;
  return `M ${x0} ${y0} A ${r} ${r} 0 ${large} ${sweep} ${x1} ${y1}`;
}

/** Hand-drawn streak flame (not an emoji): outer tongue + inner core, sized by `k`. */
export function flamePath(cx: number, base: number, k: number, wob: number) {
  const h = 110 * k;
  const w = 46 * k;
  return (
    `M ${cx} ${base} ` +
    `C ${cx - w * 1.3} ${base - h * 0.08}, ${cx - w * 1.2} ${base - h * 0.55}, ${cx - w * 0.35} ${base - h * 0.72} ` +
    `C ${cx - w * 0.55} ${base - h * 0.5}, ${cx - w * 0.1} ${base - h * 0.45}, ${cx + wob} ${base - h} ` +
    `C ${cx + w * 0.7} ${base - h * 0.78}, ${cx + w * 1.35} ${base - h * 0.45}, ${cx + w * 1.05} ${base - h * 0.15} ` +
    `C ${cx + w * 0.9} ${base - h * 0.02}, ${cx + w * 0.4} ${base}, ${cx} ${base} Z`
  );
}
