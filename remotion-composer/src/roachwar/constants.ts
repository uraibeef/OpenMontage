/**
 * Shared vocabulary for the "สงครามแมลงสาบ" trilogy.
 *
 * All three episodes run on one engine: flat 2D ink insects composited into
 * photoreal cinematic Bangkok, cut to a transcribed voiceover. Only the shot
 * list, the captions and the narration change per episode, so everything that
 * does not change lives here and each episode file stays a pure description of
 * that episode.
 *
 * Two rules hold across the series and are enforced by the prompts, not the
 * code: the camera never leaves the floor, and humans are only ever legs,
 * hands, boots and a gas mask.
 */

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

export type MarkKind = "question" | "exclaim" | "sweat" | "spark";

export interface Shot {
  id: string;
  src: string;
  durationInSeconds: number;
  zoom: [from: number, to: number];
  driftX?: number;
  driftY?: number;
  /**
   * Overhead light flare over the shot. In this series a light switch is the
   * pressure gauge — in a cockroach's world it is an air-raid siren — so every
   * beat that tightens gets one and every beat that hides does not.
   */
  glow?: "soft" | "hard";
  marks?: { kind: MarkKind; at: number; x: number; y: number }[];
  punchIn?: boolean;
  /**
   * Suppress the gate weave even though the shot is moving.
   *
   * Only the two halves of the loop use this. The weave is a function of the
   * shot's own frame counter, so the opening frame and the closing frame land
   * on different weave offsets — about two pixels apart, invisible mid-reel but
   * very visible across a loop cut. Freezing both ends removes the seam.
   */
  steady?: boolean;
}

export interface Caption {
  text: string;
  from: number;
  to: number;
}

export interface Episode {
  voiceoverSrc: string;
  shots: Shot[];
  captions: Caption[];
  /**
   * Shot ids that carry the on-screen stamp, and what it reads.
   *
   * A plain array rather than a Set: episodes are passed through Remotion's
   * `defaultProps`, which round-trips them as JSON, and a Set does not survive
   * that — it arrives as an empty object with no `has`.
   */
  timestampShots: string[];
  timestampLabel: string;
}

/**
 * Sum the shots' *rounded* frame counts, not the rounded sum of their seconds.
 *
 * Every Sequence rounds its own duration, so rounding the total separately
 * drifts by a frame or two and the composition ends up longer than the last
 * shot — which renders as a black tail and destroys the loop.
 */
export function totalFrames(shots: Shot[]): number {
  return shots.reduce(
    (sum, shot) => sum + Math.round(shot.durationInSeconds * FPS),
    0,
  );
}

export function shotStarts(shots: Shot[]): number[] {
  return shots.reduce<number[]>((starts, _shot, index) => {
    const previousStart = index === 0 ? 0 : starts[index - 1];
    const previousLength =
      index === 0 ? 0 : Math.round(shots[index - 1].durationInSeconds * FPS);
    starts.push(previousStart + previousLength);
    return starts;
  }, []);
}
