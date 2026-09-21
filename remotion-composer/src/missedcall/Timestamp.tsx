import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Kanit";
import { HEIGHT, WIDTH } from "./config";

const { fontFamily } = loadFont("normal", {
  weights: ["600"],
  subsets: ["latin"],
});

/**
 * The 02:47 stamp.
 *
 * It appears on the three shots where a phone is ringing. The first two are her
 * calls; the third is the one he lets ring out. Same two digits, opposite
 * meaning — putting them on screen rather than only in the narration is what
 * makes the rhyme land for a viewer watching muted.
 */

const LABEL = "02:47";
const FONT_SIZE = 40;
const HOLD_IN_FRAMES = 8;

export const Timestamp: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
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
          color: "#e8f2ff",
          padding: "8px 22px",
          borderRadius: 999,
          border: "1px solid rgba(232, 242, 255, 0.28)",
          background: "rgba(8, 12, 20, 0.45)",
          textShadow: "0 0 18px rgba(150, 200, 255, 0.5)",
        }}
      >
        {LABEL}
      </span>
    </div>
  );
};
