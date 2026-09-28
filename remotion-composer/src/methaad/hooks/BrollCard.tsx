import { Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { Sfx } from "./Sfx";

const NEVER = 1e6;

interface BrollCardProps {
  left: number;
  top: number;
  width: number;
  height: number;
  from: number;
  until?: number;
  children: React.ReactNode;
  /** Card tilt in degrees, for the slightly-tossed-in look. */
  rotate?: number;
}

/**
 * "di cut": a B-roll insert that punches into frame — fast zoom overshoot then
 * settle, whoosh underneath — instead of a plain fade. Hard rectangular edges
 * and a top overlap, matching the reference's photo-insert cutaways.
 */
export function BrollCard({
  left,
  top,
  width,
  height,
  from,
  until,
  children,
  rotate = -2,
}: BrollCardProps) {
  const frame = useCurrentFrame();
  const out = until ?? NEVER;
  const local = frame - from;

  // Punch: overshoot past 1 then settle, all inside ~16 frames.
  const scale =
    local < 0
      ? 0
      : local < 8
        ? interpolate(local, [0, 8], [0.5, 1.18], {
            easing: Easing.out(Easing.cubic),
          })
        : interpolate(local, [8, 16], [1.18, 1], {
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.back(1.6)),
          });

  const opacity = interpolate(
    frame,
    [from, from + 4, out, out + 6],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <>
      <Interactive.Div
        name="BrollCard"
        style={{
          position: "absolute",
          left,
          top,
          width,
          height,
          borderRadius: 10,
          overflow: "hidden",
          backgroundColor: "#0B0B0B",
          boxShadow: "0 30px 60px rgba(0,0,0,0.55)",
          opacity,
          scale,
          rotate: `${rotate}deg`,
          transformOrigin: "50% 20%",
        }}
      >
        {children}
      </Interactive.Div>
      <Sfx id="whoosh" from={from} volume={0.7} />
    </>
  );
}
