import { Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
const C = { red: "#FF2D2D" } as const;
const EASE_OUT = [0.16, 1, 0.3, 1] as const;

interface RedCircleProps {
  left: number;
  top: number;
  size?: number;
  from?: number;
}

/** The reference's signature move: a hand-drawn red circle calling out one detail. */
export function RedCircle({ left, top, size = 150, from = 0 }: RedCircleProps) {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [from, from + 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EASE_OUT),
  });

  return (
    <Interactive.Div
      name="RedCircle"
      style={{ position: "absolute", left, top, width: size, height: size }}
    >
      <svg width={size} height={size} viewBox="0 0 100 100">
        <ellipse
          cx={50}
          cy={50}
          rx={44}
          ry={38}
          fill="none"
          stroke={C.red}
          strokeWidth={5}
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - progress}
          transform="rotate(-6 50 50)"
        />
      </svg>
    </Interactive.Div>
  );
}
