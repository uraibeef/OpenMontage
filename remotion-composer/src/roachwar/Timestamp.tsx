import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Kanit";
import { HEIGHT, WIDTH } from "./constants";

const { fontFamily } = loadFont("normal", {
  weights: ["600"],
  subsets: ["thai", "latin"],
});

/**
 * The episode's clock stamp.
 *
 * Every episode gets at most a couple of these. Restraint is the point: when a
 * number is the only text on screen all hour, the viewer reads it as something
 * the narrator remembers rather than as a caption.
 */

const FONT_SIZE = 40;
const HOLD_IN_FRAMES = 8;

export const Timestamp: React.FC<{
  label: string;
  durationInFrames: number;
}> = ({ label, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(
    frame,
    [0, HOLD_IN_FRAMES, durationInFrames - fps * 0.3, durationInFrames],
    [0, 0.82, 0.82, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  // One-pixel jitter, like a clock that has just ticked over.
  const nudge = frame % 60 < 30 ? 0 : 0.6;

  return (
    <div
      style={{
        position: "absolute",
        top: HEIGHT * 0.085,
        left: 0,
        width: WIDTH,
        display: "flex",
        justifyContent: "center",
        opacity,
        transform: `translateY(${nudge}px)`,
      }}
    >
      <span
        style={{
          fontFamily,
          fontSize: FONT_SIZE,
          fontWeight: 600,
          letterSpacing: 6,
          color: "#d9ffe4",
          padding: "8px 22px",
          borderRadius: 999,
          border: "1px solid rgba(180, 255, 205, 0.26)",
          background: "rgba(6, 14, 9, 0.45)",
          textShadow: "0 0 18px rgba(120, 255, 170, 0.45)",
        }}
      >
        {label}
      </span>
    </div>
  );
};
