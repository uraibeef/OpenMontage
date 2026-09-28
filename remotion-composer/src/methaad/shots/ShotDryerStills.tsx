import { AbsoluteFill, Img, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { clamp } from "../hooks/kit";

/**
 * Blow-dry beat built from three held poses of the source clip (the source is
 * the creator's own ~4 fps jump-cut edit, so playing it stutters). Each pose
 * gets a smooth push-in and lands with a small punch; hard cuts fall on the
 * SlamStack words "อย่า ไดร์ร้อน" 0, "กดทับ" 26, "ทุกเช้า" 52 (shot-local frames).
 */

const POSES = [
  { src: "methaad01/b05a.jpg", from: 0, to: 26, originY: "45%" },
  { src: "methaad01/b05b.jpg", from: 26, to: 52, originY: "30%" },
  { src: "methaad01/b05c.jpg", from: 52, to: 114, originY: "35%" },
] as const;

function Pose({ src, dur, originY }: { src: string; dur: number; originY: string }) {
  const frame = useCurrentFrame();
  const punch = interpolate(frame, [0, 5], [1.08, 1], clamp);
  const push = interpolate(frame, [0, dur], [1, 1.07], clamp);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${punch * push})`,
          transformOrigin: `50% ${originY}`,
        }}
      />
    </AbsoluteFill>
  );
}

export function ShotDryerStills() {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {POSES.map((p) => (
        <Sequence key={p.src} from={p.from} durationInFrames={p.to - p.from}>
          <Pose src={p.src} dur={p.to - p.from} originY={p.originY} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
}
