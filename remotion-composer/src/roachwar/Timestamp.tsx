import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Kanit";
import { HEIGHT, WIDTH } from "./constants";
import type { StampTone } from "./constants";

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

const TONES: Record<StampTone, { text: string; border: string; plate: string; glow: string }> = {
  green: {
    text: "#d9ffe4",
    border: "rgba(180, 255, 205, 0.26)",
    plate: "rgba(6, 14, 9, 0.45)",
    glow: "rgba(120, 255, 170, 0.45)",
  },
  red: {
    text: "#ffd9d4",
    border: "rgba(255, 120, 105, 0.34)",
    plate: "rgba(20, 5, 4, 0.5)",
    glow: "rgba(255, 60, 40, 0.55)",
  },
  // A product name rather than a number: the pale blue of the thing itself.
  ice: {
    text: "#eef6ff",
    border: "rgba(170, 205, 240, 0.45)",
    plate: "rgba(10, 16, 24, 0.45)",
    glow: "rgba(150, 200, 255, 0.5)",
  },
};
const HOLD_IN_FRAMES = 8;

export const Timestamp: React.FC<{
  label: string;
  tone?: StampTone;
  durationInFrames: number;
}> = ({ label, tone = "green", durationInFrames }) => {
  const palette = TONES[tone];
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
          color: palette.text,
          padding: "8px 22px",
          borderRadius: 999,
          border: `1px solid ${palette.border}`,
          background: palette.plate,
          textShadow: `0 0 18px ${palette.glow}`,
        }}
      >
        {label}
      </span>
    </div>
  );
};
