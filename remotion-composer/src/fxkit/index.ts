/**
 * fxkit — reusable punch FX for vertical reels (see README.md for the catalog).
 * All components are frame-driven and deterministic; place them inside a
 * <Sequence> so frame 0 is the moment the effect starts.
 */
export { Riso, RisoFilter, RISO, RISO_DEFAULT } from "./Riso";
export type { RisoInks } from "./Riso";
export { TearReveal, Glitch, Flash, PunchIn } from "./Transitions";
export { SpeedLines, PaperGrain } from "./Overlays";
export { TimeCut, cutLength, cutPoints, mapFrame } from "./TimeCut";
export type { KeepRanges } from "./TimeCut";
