import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

/**
 * The kitchen ceiling light coming on.
 *
 * This reel's atmosphere layer is a light switch. A fluorescent tube does not
 * arrive at full output — it strikes, overshoots, stutters once, then settles —
 * and reproducing that strike is what makes a still photograph read as a light
 * that has just been thrown. It is also the only violent thing in the episode:
 * nobody is ever shown being killed, the light just comes on and the narration
 * does the rest.
 */

const SOFT_OPACITY = 0.14;
const HARD_OPACITY = 0.4;
const STRIKE_FRAMES = 2;

export const KitchenLight: React.FC<{
  kind: "soft" | "hard";
  durationInFrames: number;
}> = ({ kind, durationInFrames }) => {
  const frame = useCurrentFrame();
  const peak = kind === "hard" ? HARD_OPACITY : SOFT_OPACITY;

  // Strike, stutter, settle — the shape of a fluorescent tube warming up.
  const level = interpolate(
    frame,
    [0, STRIKE_FRAMES, STRIKE_FRAMES + 2, STRIKE_FRAMES + 4, durationInFrames],
    [0, peak, peak * 0.3, peak * 0.85, peak * 0.7],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  // Mains hum, visible as a faint ripple rather than a flat wash.
  const hum = 1 + Math.sin(frame / 2.2) * 0.04;

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        background:
          "radial-gradient(ellipse at 50% 12%, rgba(255, 252, 240, 1) 0%, rgba(240, 240, 228, 0.42) 45%, rgba(0,0,0,0) 78%)",
        opacity: level * hum,
        mixBlendMode: "screen",
      }}
    />
  );
};
