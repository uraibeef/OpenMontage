import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { HEIGHT, WIDTH } from "./config";

/**
 * Rain, in two strengths.
 *
 * Rain is the story's pressure gauge here: light while the rich man still
 * controls the game, heavy once he loses it, and absent on the twist — a shot
 * with no atmosphere at all reads as held breath.
 */

const LIGHT_STREAKS = 55;
const HEAVY_STREAKS = 150;

/** Deterministic per-index noise — Remotion requires frame-stable randomness. */
function noise(seed: number): number {
  const value = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return value - Math.floor(value);
}

interface RainProps {
  count: number;
  speedBase: number;
  lengthBase: number;
  opacityBase: number;
  intensity: number;
}

const Rain: React.FC<RainProps> = ({
  count,
  speedBase,
  lengthBase,
  opacityBase,
  intensity,
}) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width={WIDTH} height={HEIGHT}>
        {new Array(count).fill(0).map((_, index) => {
          const x = noise(index) * WIDTH;
          const speed = speedBase + noise(index + 100) * speedBase * 0.8;
          const length = lengthBase + noise(index + 200) * lengthBase;
          const slant = 5 + noise(index + 300) * 7;
          const cycle = HEIGHT + length;
          const y = ((frame * speed + noise(index + 400) * cycle) % cycle) - length;
          const opacity = (opacityBase + noise(index + 500) * opacityBase) * intensity;

          return (
            <line
              key={index}
              x1={x}
              y1={y}
              x2={x - slant}
              y2={y + length}
              stroke="#d6e9f7"
              strokeWidth={1.5}
              strokeLinecap="round"
              opacity={opacity}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

export const Atmosphere: React.FC<{
  kind: "rain-light" | "rain-heavy";
  durationInFrames: number;
}> = ({ kind, durationInFrames }) => {
  const frame = useCurrentFrame();

  // Fade at both ends so a hard cut never clips a streak mid-air.
  const intensity = interpolate(
    frame,
    [0, 5, durationInFrames - 5, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  if (kind === "rain-heavy") {
    return (
      <Rain
        count={HEAVY_STREAKS}
        speedBase={34}
        lengthBase={80}
        opacityBase={0.13}
        intensity={intensity}
      />
    );
  }

  return (
    <Rain
      count={LIGHT_STREAKS}
      speedBase={22}
      lengthBase={45}
      opacityBase={0.08}
      intensity={intensity}
    />
  );
};
