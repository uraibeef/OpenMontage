import { AbsoluteFill, Easing, interpolate, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import { clamp } from "../hooks/kit";

interface PhotoShotProps {
  src: string;
  /** Source pixel size, used to keep the card's aspect. */
  w: number;
  h: number;
  rate: number;
  tilt: number;
}

/**
 * A split-screen panel shown as a "photo memories" widget: the clip plays in a
 * white-bordered card that settles in with a tilt, over its own blurred, darkened plate.
 */
export function PhotoShot({ src, w, h, rate, tilt }: PhotoShotProps) {
  const frame = useCurrentFrame();
  const settle = interpolate(frame, [0, 9], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.6)) });
  const cardW = 860;
  const cardH = (cardW * h) / w;
  const video = (style: React.CSSProperties) => (
    <OffthreadVideo src={staticFile(src)} muted playbackRate={rate} style={{ width: "100%", height: "100%", objectFit: "cover", ...style }} />
  );
  return (
    <AbsoluteFill style={{ backgroundColor: "#111" }}>
      <AbsoluteFill style={{ transform: "scale(1.25)" }}>{video({ filter: "blur(38px) brightness(0.62) saturate(1.3)" })}</AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: (1080 - cardW) / 2,
          top: 400,
          width: cardW,
          height: cardH,
          border: "16px solid #FFFFFF",
          borderRadius: 40,
          overflow: "hidden",
          boxShadow: "0 30px 70px rgba(0,0,0,0.5)",
          transform: `translateY(${(1 - settle) * 90}px) rotate(${tilt * settle + (1 - settle) * tilt * 3}deg) scale(${0.9 + settle * 0.1})`,
        }}
      >
        {video({})}
      </div>
    </AbsoluteFill>
  );
}
