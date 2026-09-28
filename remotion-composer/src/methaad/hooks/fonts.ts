import { loadFont as loadChakra } from "@remotion/google-fonts/ChakraPetch";
import { loadFont as loadKanit } from "@remotion/google-fonts/Kanit";
import { loadFont as loadMitr } from "@remotion/google-fonts/Mitr";
import { loadFont as loadSriracha } from "@remotion/google-fonts/Sriracha";
import { loadFont as loadTrirong } from "@remotion/google-fonts/Trirong";

const subsets: ("thai" | "latin")[] = ["thai", "latin"];

loadKanit("italic", { weights: ["800", "900"], subsets });
loadTrirong("italic", { weights: ["500", "700"], subsets });

/**
 * One family per hook voice, so no two hook styles read alike:
 * Kanit = loud display, Trirong = editorial serif, Sriracha = brush hand,
 * Mitr = friendly rounded, Chakra Petch = tech readout.
 */
export const F = {
  display: loadKanit("normal", { weights: ["800", "900"], subsets }).fontFamily,
  serif: loadTrirong("normal", { weights: ["600", "800"], subsets }).fontFamily,
  brush: loadSriracha("normal", { weights: ["400"], subsets }).fontFamily,
  round: loadMitr("normal", { weights: ["500", "600"], subsets }).fontFamily,
  tech: loadChakra("normal", { weights: ["600", "700"], subsets }).fontFamily,
} as const;
