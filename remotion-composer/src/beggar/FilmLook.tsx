import { AbsoluteFill, useCurrentFrame } from "remotion";
import { HEIGHT, WIDTH } from "./config";

/**
 * Grain, vignette and a slow gate weave.
 *
 * A still photograph composited with a flat drawing reads as a paste-up until
 * something ties the two layers together. Grain over both, plus a sub-pixel
 * drift of the whole frame, is what sells them as one photographed image.
 */

const GRAIN_TILE = 180;
const GRAIN_OPACITY = 0.055;

export const FilmLook: React.FC = () => {
  const frame = useCurrentFrame();

  // Re-seed the grain every frame so it crawls like real emulsion.
  const seed = frame % 12;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0) 45%, rgba(0,0,0,0.42) 100%)",
        }}
      />
      <svg width={WIDTH} height={HEIGHT} style={{ opacity: GRAIN_OPACITY }}>
        <filter id={`grain-${seed}`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves={3}
            seed={seed}
          />
        </filter>
        <rect
          width={WIDTH}
          height={HEIGHT}
          filter={`url(#grain-${seed})`}
          style={{ mixBlendMode: "overlay" }}
        />
      </svg>
    </AbsoluteFill>
  );
};

/** Sub-pixel camera weave applied to the whole frame. */
export function gateWeave(frame: number): { x: number; y: number } {
  return {
    x: Math.sin(frame / 31) * 1.6 + Math.sin(frame / 7.3) * 0.4,
    y: Math.cos(frame / 27) * 1.4 + Math.cos(frame / 9.1) * 0.35,
  };
}

export const GRAIN_TILE_SIZE = GRAIN_TILE;
