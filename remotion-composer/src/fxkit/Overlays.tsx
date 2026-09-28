import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const hash = (n: number) => {
  const x = Math.sin(n * 91.7 + 17.3) * 43758.5453;
  return x - Math.floor(x);
};

interface SpeedLinesProps {
  dur?: number;
  count?: number;
  color?: string;
  /** Focus point the lines rush toward. */
  cx?: number;
  cy?: number;
  /** Clear radius around the focus, px. */
  hole?: number;
  /** Re-draw the lines every N frames (manga boil). */
  boilEvery?: number;
}

/** Manga speed lines rushing in from the frame edge toward a focus point. */
export function SpeedLines({
  dur = 14,
  count = 46,
  color = "#FFFFFF",
  cx = 540,
  cy = 760,
  hole = 380,
  boilEvery = 2,
}: SpeedLinesProps) {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 2, dur - 4, dur], [0, 1, 1, 0], clamp);
  if (o <= 0) return null;
  const tick = Math.floor(frame / boilEvery);
  const R = 1400;

  return (
    <AbsoluteFill style={{ opacity: o }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: count }, (_, i) => {
          const a = (i / count) * Math.PI * 2 + (hash(i + tick * 13) - 0.5) * 0.12;
          const inner = hole + hash(i * 7 + tick) * 220;
          const w = 4 + hash(i * 3 + tick * 5) * 14;
          const ca = Math.cos(a);
          const sa = Math.sin(a);
          const nx = -sa * w;
          const ny = ca * w;
          const ox = cx + ca * R;
          const oy = cy + sa * R;
          return (
            <polygon
              key={i}
              points={`${cx + ca * inner},${cy + sa * inner} ${ox + nx},${oy + ny} ${ox - nx},${oy - ny}`}
              fill={color}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
}

/** Paper-grain + faint halftone dot texture to lay over flat graphics. */
export function PaperGrain({ id, opacity = 0.18 }: { id: string; opacity?: number }) {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ mixBlendMode: "multiply", opacity, pointerEvents: "none" }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        <filter id={id}>
          <feTurbulence type="fractalNoise" baseFrequency={0.9} numOctaves={2} seed={Math.floor(frame / 2)} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width={1080} height={1920} filter={`url(#${id})`} />
      </svg>
    </AbsoluteFill>
  );
}
