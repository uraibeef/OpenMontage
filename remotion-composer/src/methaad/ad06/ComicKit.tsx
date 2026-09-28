import { OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import { clipScale } from "../hooks/Clip";
import { FPS, hash, INK, TONE } from "./style";

/** Halftone screentone fill; reference it as `url(#id)`. Ids must be unique. */
export function Screentone({ id, color = TONE, gap = 14, r = 3.4, angle = 45 }: {
  id: string;
  color?: string;
  gap?: number;
  r?: number;
  angle?: number;
}) {
  return (
    <pattern id={id} width={gap} height={gap} patternUnits="userSpaceOnUse" patternTransform={`rotate(${angle})`}>
      <circle cx={gap / 2} cy={gap / 2} r={r} fill={color} />
    </pattern>
  );
}

/** Jagged surprise-burst outline (manga "shout" balloon). */
export function burstPath(cx: number, cy: number, rx: number, ry: number, spikes: number, seed: number, depth = 0.28) {
  const pts: string[] = [];
  for (let i = 0; i < spikes * 2; i++) {
    const a = (i / (spikes * 2)) * Math.PI * 2 - Math.PI / 2;
    const out = i % 2 === 0;
    const k = out ? 1 + hash(seed + i) * 0.12 : 1 - depth - hash(seed + i * 3) * 0.08;
    pts.push(`${(cx + Math.cos(a) * rx * k).toFixed(1)} ${(cy + Math.sin(a) * ry * k).toFixed(1)}`);
  }
  return `M ${pts.join(" L ")} Z`;
}

/** Thought-cloud outline made of scalloped arcs around an ellipse. */
export function cloudPath(cx: number, cy: number, rx: number, ry: number, bumps: number) {
  let d = "";
  for (let i = 0; i <= bumps; i++) {
    const a = (i / bumps) * Math.PI * 2;
    const x = cx + Math.cos(a) * rx;
    const y = cy + Math.sin(a) * ry;
    d += i === 0 ? `M ${x.toFixed(1)} ${y.toFixed(1)}` : ` A ${rx * 0.34} ${ry * 0.42} 0 0 1 ${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return `${d} Z`;
}

/** Hand-inked line wobble: re-seeds every 3 frames so strokes boil like ink. */
export function InkBoil({ id, scale = 3.5 }: { id: string; scale?: number }) {
  const frame = useCurrentFrame();
  return (
    <filter id={id} x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves={2} seed={5 + Math.floor(frame / 3) * 11} result="n" />
      <feDisplacementMap in="SourceGraphic" in2="n" scale={scale} xChannelSelector="R" yChannelSelector="G" />
    </filter>
  );
}

/** Muted footage that always fills its slot (short sources slow down), with a slow push. */
export function Footage({ src, dur, srcSeconds, zoomTo = 1.05, position = "50% 50%" }: {
  src: string;
  dur: number;
  srcSeconds: number;
  zoomTo?: number;
  position?: string;
}) {
  const frame = useCurrentFrame();
  const rate = Math.min(1, (srcSeconds - 0.05) / (dur / FPS));
  return (
    <div style={{ width: "100%", height: "100%", overflow: "hidden", scale: clipScale(frame, dur, zoomTo) }}>
      <OffthreadVideo
        src={staticFile(src)}
        muted
        playbackRate={rate}
        style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: position }}
      />
    </div>
  );
}

/** A comic panel frame: white gutter outside, heavy ink keyline inside. */
export function PanelFrame({ x, y, w, h, tilt = 0, children }: {
  x: number;
  y: number;
  w: number;
  h: number;
  tilt?: number;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        overflow: "hidden",
        border: `9px solid ${INK}`,
        boxSizing: "border-box",
        transform: `rotate(${tilt}deg)`,
        background: "#000",
      }}
    >
      {children}
    </div>
  );
}
