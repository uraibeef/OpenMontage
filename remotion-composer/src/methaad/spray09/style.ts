import { loadFont as loadChonburi } from "@remotion/google-fonts/Chonburi";
import { loadFont as loadIBMPlexSansThai } from "@remotion/google-fonts/IBMPlexSansThai";
import { loadFont as loadKanit } from "@remotion/google-fonts/Kanit";
import { loadFont as loadMitr } from "@remotion/google-fonts/Mitr";
import { loadFont as loadPattaya } from "@remotion/google-fonts/Pattaya";
import { loadFont as loadPrompt } from "@remotion/google-fonts/Prompt";
import { loadFont as loadSriracha } from "@remotion/google-fonts/Sriracha";
import { loadFont as loadTaviraj } from "@remotion/google-fonts/Taviraj";
import { interpolate, interpolateColors } from "remotion";

const subsets: ("thai" | "latin")[] = ["thai", "latin"];

/**
 * Spray ad #9 identity: SKY-TIMELAPSE / WEATHER-WIDGET DAY.
 * Prompt thin = lock-screen clock + sun chip, IBM Plex Sans Thai = widget chrome,
 * Kanit italic = "ออกจากบ้าน" walking out, Chonburi = heat-proof "ไม่เยิ้ม",
 * Mitr = calendar + standing "ตั้ง", Sriracha = map note, Pattaya = springy
 * "ไม่แบน", Taviraj = the brand's quote card.
 */
export const T = {
  clock: loadPrompt("normal", { weights: ["200", "300", "600"], subsets }).fontFamily,
  ui: loadIBMPlexSansThai("normal", { weights: ["500", "700"], subsets }).fontFamily,
  walk: loadKanit("italic", { weights: ["800"], subsets }).fontFamily,
  heat: loadChonburi("normal", { weights: ["400"], subsets }).fontFamily,
  cal: loadMitr("normal", { weights: ["500", "700"], subsets }).fontFamily,
  note: loadSriracha("normal", { weights: ["400"], subsets }).fontFamily,
  spring: loadPattaya("normal", { weights: ["400"], subsets }).fontFamily,
  quote: loadTaviraj("normal", { weights: ["600", "800"], subsets }).fontFamily,
} as const;

export const FPS = 30;
export const s = (sec: number) => Math.round(sec * FPS);

/** Widget glass + ink. */
export const GLASS = "rgba(250,250,247,0.9)";
export const GLASS_DARK = "rgba(16,20,30,0.78)";
export const INK = "#14171F";
export const SOFT = "#6B7280";
export const WHITE = "#FFFFFF";
/** The bottle's cedar green = "hair status: holding". */
export const CEDAR = "#2F5D45";
export const MINT = "#7FE0A8";
export const ALARM = "#FF6B3D";
export const HEAT = "#FF8A1F";
export const HEAT_HOT = "#E8402A";
export const CAL_RED = "#E5484D";
export const MAP_BLUE = "#2F7BF6";
export const DUSK_PINK = "#FF6F7D";
export const NIGHT = "#0F1733";

/** VO beats (s). */
export const BEAT = { noon: 2.48, three: 4.33, six: 6.5, brand: 9.13, end: 11.68 } as const;

/** Sky keyframes: [second, zenith, horizon, sun]. Dawn → noon glare → afternoon → dusk → night. */
const SKY: readonly [number, string, string, string][] = [
  [0, "#34447E", "#FF9F70", "#FF7A3D"],
  [1.8, "#4E79C2", "#FFC89A", "#FFB054"],
  [2.6, "#3AA6F2", "#FFF4CF", "#FFF6C8"],
  [4.1, "#3C9BE8", "#FFF0BF", "#FFF1B0"],
  [4.6, "#4A89D0", "#FFC867", "#FFD35A"],
  [6.2, "#5A7BC0", "#FFB45A", "#FFB23E"],
  [6.8, "#3F2F72", "#FF6A4D", "#FF5A2E"],
  [8.8, "#2E2860", "#FF5E62", "#FF4A2A"],
  [9.5, NIGHT, "#2E3B6E", "#2E3B6E"],
];

export function skyAt(sec: number) {
  const t = SKY.map((k) => k[0]);
  return {
    zenith: interpolateColors(sec, t, SKY.map((k) => k[1])),
    horizon: interpolateColors(sec, t, SKY.map((k) => k[2])),
    sun: interpolateColors(sec, t, SKY.map((k) => k[3])),
  };
}

/** Wall-clock minutes of the story day: holds on each time stamp, time-lapses between them. */
export function clockAt(sec: number) {
  return interpolate(
    sec,
    [0, 1.3, BEAT.noon, 3.3, BEAT.three, 5.3, BEAT.six, 8.2, BEAT.brand],
    [420, 420, 720, 720, 900, 900, 1080, 1080, 1120],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
}

export const hhmm = (min: number) => {
  const h = Math.floor(min / 60);
  const m = Math.floor(min % 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

/** SVG transform about a pivot. */
export const about = (x: number, y: number, t: string) =>
  `translate(${x} ${y}) ${t} translate(${-x} ${-y})`;
