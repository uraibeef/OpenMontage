import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Kanit";
import { CAPTIONS, HEIGHT, WIDTH } from "./config";

const { fontFamily } = loadFont("normal", {
  weights: ["500", "600"],
  subsets: ["thai", "latin"],
});

/**
 * Burned-in Thai captions cut to the voiceover.
 *
 * Most of this audience watches muted, so the reel has to land with no sound.
 * The plate is a soft dark pill rather than a hard box — over a hospital
 * corridor a hard box reads as a broadcast lower-third and breaks the handmade
 * feel the rest of the frame is working for.
 */

const FONT_SIZE = 50;
const LINE_HEIGHT = 1.32;
const BOTTOM_INSET = 0.16;
const SIDE_INSET = 0.08;
const FADE_FRAMES = 5;

export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const seconds = frame / fps;

  const active = CAPTIONS.find(
    (caption) => seconds >= caption.from && seconds < caption.to,
  );
  if (!active) return null;

  const fromFrame = active.from * fps;
  const toFrame = active.to * fps;
  const opacity = interpolate(
    frame,
    [fromFrame, fromFrame + FADE_FRAMES, toFrame - FADE_FRAMES, toFrame],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const rise = interpolate(frame, [fromFrame, fromFrame + FADE_FRAMES], [9, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: WIDTH * SIDE_INSET,
        width: WIDTH * (1 - SIDE_INSET * 2),
        bottom: HEIGHT * BOTTOM_INSET,
        display: "flex",
        justifyContent: "center",
        opacity,
        transform: `translateY(${rise}px)`,
      }}
    >
      <span
        style={{
          fontFamily,
          fontSize: FONT_SIZE,
          lineHeight: LINE_HEIGHT,
          fontWeight: 600,
          color: "#fffdf7",
          textAlign: "center",
          padding: "15px 32px",
          borderRadius: 26,
          background: "rgba(8, 10, 14, 0.66)",
          backdropFilter: "blur(6px)",
          textShadow: "0 2px 10px rgba(0,0,0,0.8)",
          boxDecorationBreak: "clone",
        }}
      >
        {active.text}
      </span>
    </div>
  );
};
