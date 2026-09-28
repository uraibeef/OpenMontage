import { loadFont as loadBai } from "@remotion/google-fonts/BaiJamjuree";
import { loadFont as loadChakra } from "@remotion/google-fonts/ChakraPetch";
import { loadFont as loadIbm } from "@remotion/google-fonts/IBMPlexSansThai";
import { loadFont as loadKanit } from "@remotion/google-fonts/Kanit";
import { loadFont as loadMitr } from "@remotion/google-fonts/Mitr";
import { loadFont as loadSriracha } from "@remotion/google-fonts/Sriracha";
import { loadFont as loadTaviraj } from "@remotion/google-fonts/Taviraj";

const subsets: ("thai" | "latin")[] = ["thai", "latin"];

/**
 * Hair ad #2 identity: a school report card printed as a riso zine.
 * Each beat takes a different "printed matter" voice, so each has its own face.
 */
export const F = {
  poster: loadKanit("normal", { weights: ["900"], subsets }).fontFamily, // riso poster
  tape: loadBai("normal", { weights: ["700"], subsets }).fontFamily, // Dymo tape
  marker: loadSriracha("normal", { weights: ["400"], subsets }).fontFamily, // teacher's pen
  award: loadTaviraj("normal", { weights: ["800", "900"], subsets }).fontFamily, // rosette
  slab: loadMitr("normal", { weights: ["700"], subsets }).fontFamily, // kinetic slabs
  chart: loadChakra("normal", { weights: ["700"], subsets }).fontFamily, // tier chart
  receipt: loadIbm("normal", { weights: ["500", "700"], subsets }).fontFamily, // thermal slip
} as const;

/** Riso drum inks on cream stock. */
export const C = {
  paper: "#F4EFE3",
  pink: "#FF48B0",
  blue: "#0078BF",
  red: "#FF665E",
  yellow: "#FFE800",
  black: "#1A1A1A",
  stamp: "#D8262E",
} as const;

/** SVG transform applied about a pivot point. */
export const about = (x: number, y: number, t: string) =>
  `translate(${x} ${y}) ${t} translate(${-x} ${-y})`;

/** Deterministic 0..1 hash. */
export const hash = (n: number) => {
  const x = Math.sin(n * 91.3 + 7.7) * 43758.5453;
  return x - Math.floor(x);
};
