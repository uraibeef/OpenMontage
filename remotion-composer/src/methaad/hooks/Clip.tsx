import { Video } from "@remotion/media";
import { Easing, interpolate, staticFile, useCurrentFrame } from "remotion";

const AUDIO_FADE = 3;

interface ClipProps {
  src: string;
  durationInFrames: number;
  /** Push-in target over the life of the clip; 1 holds the frame still. */
  zoomTo?: number;
}

/** The push-in scale at a clip-local frame; shared so mattes can track it. */
export function clipScale(
  frame: number,
  durationInFrames: number,
  zoomTo = 1.05,
) {
  return interpolate(frame, [0, durationInFrames], [1, zoomTo], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.33, 0, 0.67, 1),
  });
}

/**
 * Sync-sound A-roll. Splices land on silence, but a short ramp still keeps the
 * joins from ticking, and a slow push keeps a locked-off talking head alive.
 */
export function Clip({ src, durationInFrames, zoomTo = 1.05 }: ClipProps) {
  const frame = useCurrentFrame();
  const fade = Math.min(AUDIO_FADE, Math.floor(durationInFrames / 4));

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        scale: clipScale(frame, durationInFrames, zoomTo),
      }}
    >
      <Video
        src={staticFile(src)}
        durationInFrames={durationInFrames}
        volume={(f) =>
          interpolate(
            f,
            [0, fade, durationInFrames - fade, durationInFrames],
            [0, 1, 1, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
  );
}
