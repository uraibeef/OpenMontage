import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Kanit";
import { HEIGHT, WIDTH } from "./constants";
import type { Caption, CaptionStyle } from "./constants";

const { fontFamily } = loadFont("normal", {
  weights: ["500", "600"],
  subsets: ["thai", "latin"],
});

/**
 * Burned-in Thai captions cut to the voiceover.
 *
 * Most of this audience watches muted, so the reel has to land with no sound.
 * The plate is a soft dark pill rather than a hard box — over a kitchen floor a
 * hard box reads as a broadcast lower-third and breaks the handmade feel the
 * rest of the frame is working for.
 */

const FONT_SIZE = 50;
const LINE_HEIGHT = 1.32;
const BOTTOM_INSET = 0.16;
const SIDE_INSET = 0.08;
const FADE_FRAMES = 5;

/** Microlore legend look: bare white type, centred a little below the middle. */
const LEGEND_TOP = 0.6;
const LEGEND_FONT_SIZE = 58;

export const Captions: React.FC<{
  captions: Caption[];
  variant?: CaptionStyle;
}> = ({ captions, variant = "pill" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const seconds = frame / fps;

  const active = captions.find(
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

  if (variant === "legend") {
    return (
      <div
        style={{
          position: "absolute",
          left: WIDTH * SIDE_INSET,
          width: WIDTH * (1 - SIDE_INSET * 2),
          top: HEIGHT * LEGEND_TOP,
          display: "flex",
          justifyContent: "center",
          opacity,
          transform: `translateY(${rise}px)`,
        }}
      >
        <span
          style={{
            fontFamily,
            fontSize: LEGEND_FONT_SIZE,
            lineHeight: LINE_HEIGHT,
            fontWeight: 600,
            color: "#ffffff",
            textAlign: "center",
            textShadow:
              "0 0 3px rgba(0,0,0,0.95), 0 3px 14px rgba(0,0,0,0.9), 0 0 28px rgba(0,0,0,0.6)",
            ...({ textWrap: "balance" } as React.CSSProperties),
          }}
        >
          <PhraseWrapped text={active.text} />
        </span>
      </div>
    );
  }

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
          // Thai has no spaces, so Chrome breaks lines by dictionary and will
          // strand a single word on the second line. Balance the two lines.
          ...({ textWrap: "balance" } as React.CSSProperties),
        }}
      >
        <PhraseWrapped text={active.text} />
      </span>
    </div>
  );
};

/**
 * Render a caption so it can only wrap at the spaces the caption author put in.
 *
 * Thai is written without spaces between words; the spaces in a Thai caption
 * mark phrase boundaries. Left to itself Chrome breaks Thai by dictionary and
 * will split mid-phrase ("ศาลไม่ / เคยเอา"). Wrapping each phrase in a no-wrap
 * span makes the phrase boundaries the only legal break points.
 */
export const PhraseWrapped: React.FC<{ text: string }> = ({ text }) => (
  <>
    {text.split(" ").map((phrase, index) => (
      <span key={index}>
        {index > 0 ? " " : null}
        <span style={{ whiteSpace: "nowrap" }}>{phrase}</span>
      </span>
    ))}
  </>
);
