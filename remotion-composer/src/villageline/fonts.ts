import { loadFont as loadPlex } from "@remotion/google-fonts/IBMPlexSansThai";
import { loadFont as loadMono } from "@remotion/google-fonts/IBMPlexMono";
import { loadFont as loadKanit } from "@remotion/google-fonts/Kanit";

/**
 * Three voices of type, each with one job.
 *
 * - UI: IBM Plex Sans Thai, because a chat app speaks in a neutral system face.
 *   Using the caption face for the UI would make the phone look designed, and
 *   the horror depends on it looking ordinary.
 * - Mono: the CCTV burn-in. Security footage is the only machine that tells the
 *   time in this story, so it gets the only monospace.
 * - Captions: Kanit, the house caption face across every reel in this repo.
 */
export const UI_FONT = loadPlex("normal", {
  weights: ["400", "500", "600"],
  subsets: ["thai", "latin"],
}).fontFamily;

export const MONO_FONT = loadMono("normal", {
  weights: ["500"],
  subsets: ["latin"],
}).fontFamily;

export const CAPTION_FONT = loadKanit("normal", {
  weights: ["500", "600"],
  subsets: ["thai", "latin"],
}).fontFamily;
