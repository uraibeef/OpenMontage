import {
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

/** 0→1 over `dur` frames starting at `from`, eased out. */
export function useIn(from: number, dur = 8) {
  const frame = useCurrentFrame();
  return interpolate(frame, [from, from + dur], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
}

/** Springy 0→1 (with overshoot) starting at `from`. */
export function usePop(from: number, damping = 11) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({
    frame: frame - from,
    fps,
    config: { damping, stiffness: 190, mass: 0.7 },
  });
}

/** Thai-safe character units: never split a consonant from its vowel/tone marks. */
export function graphemes(text: string): string[] {
  // Intl.Segmenter exists in the render browser; the TS lib target predates it.
  const Seg = (
    Intl as unknown as {
      Segmenter: new (
        l: string,
        o: object,
      ) => { segment: (t: string) => Iterable<{ segment: string }> };
    }
  ).Segmenter;
  return Array.from(
    new Seg("th", { granularity: "grapheme" }).segment(text),
    (s) => s.segment,
  );
}

export interface Layer {
  stroke?: string;
  width?: number;
  fill?: string;
  dx?: number;
  dy?: number;
  filter?: string;
}

interface LayeredTextProps {
  text: string;
  x?: number;
  y: number;
  size: number;
  font: string;
  weight?: number;
  italic?: boolean;
  layers: readonly Layer[];
  anchor?: "start" | "middle" | "end";
  letterSpacing?: number;
}

/**
 * Text drawn as a stack of stroked copies, back to front — the only reliable
 * way to get fat outlines, inner keylines and offset shadows on Thai glyphs.
 */
export function LayeredText({
  text,
  x = 540,
  y,
  size,
  font,
  weight = 900,
  italic = false,
  layers,
  anchor = "middle",
  letterSpacing = 0,
}: LayeredTextProps) {
  return (
    <>
      {layers.map((l, i) => (
        <text
          key={i}
          x={x + (l.dx ?? 0)}
          y={y + (l.dy ?? 0)}
          fontFamily={font}
          fontWeight={weight}
          fontStyle={italic ? "italic" : "normal"}
          fontSize={size}
          textAnchor={anchor}
          letterSpacing={letterSpacing}
          fill={l.fill ?? "none"}
          stroke={l.stroke ?? "none"}
          strokeWidth={l.width ?? 0}
          strokeLinejoin="round"
          paintOrder="stroke"
          filter={l.filter}
        >
          {text}
        </text>
      ))}
    </>
  );
}

/** Full-frame SVG canvas for overlays. */
export function Canvas({ children }: { children: React.ReactNode }) {
  return (
    <svg
      width={1080}
      height={1920}
      viewBox="0 0 1080 1920"
      style={{ position: "absolute", inset: 0, overflow: "visible" }}
    >
      {children}
    </svg>
  );
}

/** Marker-line boil for doodles on footage: new drawing every 3 frames. */
export function BoilFilter({ id, scale = 5 }: { id: string; scale?: number }) {
  const frame = useCurrentFrame();
  const seed = 7 + Math.floor(frame / 3) * 13;
  return (
    <filter
      id={id}
      filterUnits="userSpaceOnUse"
      x={0}
      y={0}
      width={1080}
      height={1920}
    >
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.025"
        numOctaves={2}
        seed={seed}
        result="n"
      />
      <feDisplacementMap
        in="SourceGraphic"
        in2="n"
        scale={scale}
        xChannelSelector="R"
        yChannelSelector="G"
      />
    </filter>
  );
}
