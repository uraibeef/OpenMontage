import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Deterministic 0..1 hash so every render tears/glitches the same way. */
const hash = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

interface TearRevealProps {
  /** Still of the outgoing shot (public/ path) — it gets ripped away. */
  src: string;
  /** Frames to rip fully open. */
  dur?: number;
  seed?: number;
  /** Paper colour showing along the torn edges. */
  paper?: string;
}

/**
 * Paper-tear transition: the outgoing frame rips down a jagged vertical line
 * and both halves fly apart, showing white torn fibre along each edge, while
 * the incoming shot plays underneath. Put it on top of the incoming shot at
 * the cut.
 */
export function TearReveal({ src, dur = 10, seed = 1, paper = "#FFFFFF" }: TearRevealProps) {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, dur], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  if (p >= 1) return null;

  const step = 64;
  const pts = Array.from({ length: Math.ceil(1920 / step) + 1 }, (_, i) => {
    const y = i * step;
    const x = 540 + (hash(seed * 100 + i) - 0.5) * 90 + Math.sin(i * 0.7 + seed) * 30;
    return [x, y] as const;
  });
  const edge = pts.map(([x, y]) => `${x},${y}`).join(" ");
  const edgeBack = [...pts].reverse().map(([x, y]) => `${x},${y}`).join(" ");
  const left = `0,0 ${edge} 0,1920`;
  const right = `1080,0 1080,1920 ${edgeBack}`;
  const fibre = (dir: number) =>
    pts.map(([x, y], i) => `${x + dir * (6 + hash(seed + i * 3) * 16)},${y}`).join(" ");
  const shift = p * 700;
  const tilt = p * 7;

  const half = (side: "L" | "R") => {
    const dir = side === "L" ? -1 : 1;
    const poly = side === "L" ? left : right;
    const fibrePoly = side === "L" ? `0,0 ${fibre(1)} 0,1920` : `1080,0 1080,1920 ${[...fibre(-1).split(" ")].reverse().join(" ")}`;
    return (
      <g transform={`translate(${dir * shift} ${p * 60}) rotate(${dir * tilt} 540 1920)`}>
        <clipPath id={`tear-${side}-${seed}`}>
          <polygon points={poly} />
        </clipPath>
        <polygon points={fibrePoly} fill={paper} />
        <g clipPath={`url(#tear-${side}-${seed})`}>
          <image href={staticFile(src)} x={0} y={0} width={1080} height={1920} preserveAspectRatio="xMidYMid slice" />
        </g>
      </g>
    );
  };

  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        {half("L")}
        {half("R")}
      </svg>
    </AbsoluteFill>
  );
}

interface GlitchProps {
  id: string;
  children: React.ReactNode;
  /** Frames the glitch lasts from the start of the Sequence it sits in. */
  dur?: number;
  /** Peak horizontal slice displacement, px. */
  amount?: number;
}

/**
 * Scan-slice glitch for the first frames of a shot: horizontal bands shear
 * sideways, RGB splits, scanlines flicker — then it settles to the clean shot.
 */
export function Glitch({ id, children, dur = 6, amount = 70 }: GlitchProps) {
  const frame = useCurrentFrame();
  const k = interpolate(frame, [0, dur], [1, 0], clamp);
  if (k <= 0) return <AbsoluteFill>{children}</AbsoluteFill>;
  const split = 14 * k;

  return (
    <AbsoluteFill>
      <svg width={0} height={0} style={{ position: "absolute" }} aria-hidden>
        <defs>
          <filter id={id} x={0} y={0} width={1} height={1} colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.0001 0.035" numOctaves={1} seed={frame * 5 + 1} result="bands" />
            <feDisplacementMap in="SourceGraphic" in2="bands" scale={amount * k * 2} xChannelSelector="R" yChannelSelector="B" result="shear" />
            <feColorMatrix in="shear" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r" />
            <feOffset in="r" dx={split} result="rs" />
            <feColorMatrix in="shear" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" result="gb" />
            <feOffset in="gb" dx={-split} result="gbs" />
            <feBlend in="rs" in2="gbs" mode="screen" />
          </filter>
        </defs>
      </svg>
      <AbsoluteFill style={{ filter: `url(#${id})` }}>{children}</AbsoluteFill>
      <AbsoluteFill
        style={{
          opacity: 0.35 * k,
          backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.9) 0 3px, transparent 3px 7px)",
          transform: `translateY(${(frame % 2) * 3}px)`,
        }}
      />
    </AbsoluteFill>
  );
}

/** Full-frame colour flash that fades out over `dur` frames. */
export function Flash({ dur = 4, color = "#FFFFFF", peak = 0.9 }: { dur?: number; color?: string; peak?: number }) {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, dur], [peak, 0], clamp);
  if (o <= 0) return null;
  return <AbsoluteFill style={{ backgroundColor: color, opacity: o }} />;
}

/** Scale punch on a cut: starts zoomed and snaps to 1 — wrap each new shot. */
export function PunchIn({ children, amount = 0.08, dur = 5 }: { children: React.ReactNode; amount?: number; dur?: number }) {
  const frame = useCurrentFrame();
  const s = interpolate(frame, [0, dur], [1 + amount, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return <AbsoluteFill style={{ transform: `scale(${s})` }}>{children}</AbsoluteFill>;
}
