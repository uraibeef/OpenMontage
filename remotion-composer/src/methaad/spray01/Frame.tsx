import { AbsoluteFill, interpolate, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import { PaperGrain } from "../../fxkit";
import { clipScale } from "../hooks/Clip";
import { CREAM, FOREST, T } from "./style";

const FPS = 30;

export type Grade = "product" | "forest" | "raw";

interface ShotProps {
  src: string;
  durationInFrames: number;
  /** Source seconds available from `start`; a short source is slowed to fill. */
  srcSeconds: number;
  start?: number;
  grade: Grade;
  zoomTo?: number;
}

/**
 * One footage shot, re-graded into the ad's forest/cream palette.
 * "product" = the user's own bottle shots, a light warm lift.
 * "forest" = creator clips, desaturated, green-cast, grained and scrimmed at
 * the top so the hook reads — a clear re-treatment, not a re-upload.
 * "raw" = untouched, for shots that get re-printed by an fxkit filter.
 */
export function Shot({ src, durationInFrames, srcSeconds, start = 0, grade, zoomTo = 1.05 }: ShotProps) {
  const frame = useCurrentFrame();
  const usable = srcSeconds - start - 0.05;
  const rate = Math.min(1, usable / (durationInFrames / FPS));
  const forest = grade === "forest";
  const filter = forest
    ? "saturate(0.62) contrast(1.1) brightness(0.96) sepia(0.14)"
    : grade === "product"
      ? "saturate(0.9) contrast(1.04) brightness(1.02) sepia(0.05)"
      : "none";

  return (
    <AbsoluteFill>
      <div style={{ width: "100%", height: "100%", overflow: "hidden", scale: clipScale(frame, durationInFrames, zoomTo) }}>
        <OffthreadVideo
          src={staticFile(src)}
          muted
          startFrom={Math.round(start * FPS)}
          playbackRate={rate}
          style={{ width: "100%", height: "100%", objectFit: "cover", filter }}
        />
      </div>
      {forest ? (
        <>
          <AbsoluteFill style={{ backgroundColor: "#2F5A3E", mixBlendMode: "color", opacity: 0.22 }} />
          <AbsoluteFill
            style={{ background: `linear-gradient(180deg, ${FOREST}D9 0%, ${FOREST}80 22%, ${FOREST}00 42%)` }}
          />
          <PaperGrain id={`sp01-grain-${src.replace(/\W/g, "")}`} opacity={0.14} />
        </>
      ) : grade === "product" ? (
        <AbsoluteFill style={{ background: `linear-gradient(180deg, ${FOREST}99 0%, ${FOREST}00 30%)` }} />
      ) : null}
    </AbsoluteFill>
  );
}

/**
 * Persistent fragrance-ad chrome: hairline corner brackets, a spaced
 * wordmark and an edition number. Sits above everything, very quiet.
 */
export function Chrome() {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 10], [0, 0.85], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const m = 42;
  const L = 70;
  const corner = (x: number, y: number, sx: number, sy: number) => (
    <path d={`M ${x} ${y + sy * L} L ${x} ${y} L ${x + sx * L} ${y}`} fill="none" stroke={CREAM} strokeWidth={2} />
  );
  return (
    <AbsoluteFill style={{ opacity: o, pointerEvents: "none" }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        {corner(m, m + 60, 1, 1)}
        {corner(1080 - m, m + 60, -1, 1)}
        {corner(m, 1920 - m, 1, -1)}
        {corner(1080 - m, 1920 - m, -1, -1)}
        <text x={540} y={m + 78} textAnchor="middle" fontFamily={T.latin} fontWeight={500} fontSize={24} letterSpacing={11} fill={CREAM}>
          MAKE SENSE
        </text>
        <text x={1080 - m - 16} y={1920 - m - 16} textAnchor="end" fontFamily={T.latinItalic} fontWeight={300} fontSize={26} fill={CREAM}>
          Nº 01 · first look
        </text>
      </svg>
    </AbsoluteFill>
  );
}

interface MistProps {
  seed: number;
  count?: number;
  /** Emitter point and spread direction (radians). */
  x: number;
  y: number;
  angle?: number;
  spread?: number;
  reach?: number;
  from?: number;
  life?: number;
  color?: string;
}

/** Soft mist particles puffing from a point — each call is seeded differently. */
export function Mist({ seed, count = 60, x, y, angle = -0.6, spread = 0.9, reach = 520, from = 0, life = 26, color = CREAM }: MistProps) {
  const frame = useCurrentFrame();
  const t = frame - from;
  if (t < 0) return null;
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
      <defs>
        <filter id={`sp01-mist-${seed}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={3} />
        </filter>
      </defs>
      <g filter={`url(#sp01-mist-${seed})`}>
        {Array.from({ length: count }, (_, i) => {
          const delay = hash2(seed, i, 1) * 8;
          const p = (t - delay) / life;
          if (p <= 0 || p >= 1) return null;
          const a = angle + (hash2(seed, i, 2) - 0.5) * spread;
          const d = reach * (0.25 + hash2(seed, i, 3) * 0.75) * (1 - Math.pow(1 - p, 3));
          const r = 3 + hash2(seed, i, 4) * 9 + p * 10;
          return (
            <circle
              key={i}
              cx={x + Math.cos(a) * d}
              cy={y + Math.sin(a) * d - p * 40}
              r={r}
              fill={color}
              opacity={(1 - p) * (0.35 + hash2(seed, i, 5) * 0.4)}
            />
          );
        })}
      </g>
    </svg>
  );
}

function hash2(seed: number, i: number, k: number) {
  const v = Math.sin(seed * 12.9898 + i * 78.233 + k * 37.719) * 43758.5453;
  return v - Math.floor(v);
}
