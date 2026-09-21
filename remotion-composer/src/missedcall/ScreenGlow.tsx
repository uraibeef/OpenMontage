import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

/**
 * The pulse of a phone screen waking up.
 *
 * This reel's atmosphere layer is light, not weather. A phone that lights up in
 * a dark room does not hold a steady level — it ramps, sits, and decays — and
 * reproducing that ramp is what makes a still photograph of a lit screen read
 * as a screen that just turned on.
 */

const SOFT_OPACITY = 0.1;
const HARD_OPACITY = 0.22;

export const ScreenGlow: React.FC<{
  kind: "soft" | "hard";
  durationInFrames: number;
}> = ({ kind, durationInFrames }) => {
  const frame = useCurrentFrame();
  const peak = kind === "hard" ? HARD_OPACITY : SOFT_OPACITY;

  // Ramp up fast, hold, decay slowly — the shape of a screen timing out.
  const level = interpolate(
    frame,
    [0, 4, durationInFrames * 0.55, durationInFrames],
    [0, peak, peak * 0.75, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  // A slow flicker keeps it from reading as a flat colour wash.
  const flicker = 1 + Math.sin(frame / 5.5) * 0.06;

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        background:
          "radial-gradient(ellipse at 50% 58%, rgba(196, 226, 255, 1) 0%, rgba(150, 190, 235, 0.35) 38%, rgba(0,0,0,0) 72%)",
        opacity: level * flicker,
        mixBlendMode: "screen",
      }}
    />
  );
};
