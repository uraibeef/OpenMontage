import { OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import { clipScale } from "../hooks/Clip";

interface FitClipProps {
  src: string;
  durationInFrames: number;
  /** Source length in seconds; shorter sources are slowed to fill the shot. */
  srcSeconds: number;
  zoomTo?: number;
}

const FPS = 30;

/** Muted footage that always fills its shot: a too-short source plays slower instead of running out. */
export function FitClip({ src, durationInFrames, srcSeconds, zoomTo = 1.05 }: FitClipProps) {
  const frame = useCurrentFrame();
  const usable = srcSeconds - 0.05;
  const rate = Math.min(1, usable / (durationInFrames / FPS));
  return (
    <div style={{ width: "100%", height: "100%", overflow: "hidden", scale: clipScale(frame, durationInFrames, zoomTo) }}>
      <OffthreadVideo
        src={staticFile(src)}
        muted
        playbackRate={rate}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
  );
}
