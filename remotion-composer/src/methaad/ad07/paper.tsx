import { Easing, interpolate, useCurrentFrame } from "remotion";
import { clamp } from "./style";

/** Fibre grain for flat paper shapes: `filter="url(#id)"`. */
export function PaperFilter({ id, seed = 3, strength = 0.14 }: { id: string; seed?: number; strength?: number }) {
  return (
    <filter id={id} x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={seed} result="g" />
      <feColorMatrix in="g" type="matrix" values={`0 0 0 0 0.3  0 0 0 0 0.27  0 0 0 0 0.2  0 0 0 ${strength} 0`} result="tint" />
      <feComposite in="tint" in2="SourceGraphic" operator="in" result="grain" />
      <feMerge>
        <feMergeNode in="SourceGraphic" />
        <feMergeNode in="grain" />
      </feMerge>
    </filter>
  );
}

/** Hand-drawn wobble that re-draws every 3 frames. */
export function WobbleFilter({ id, scale = 4, seed = 11 }: { id: string; scale?: number; seed?: number }) {
  const frame = useCurrentFrame();
  return (
    <filter id={id} x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves={2} seed={seed + Math.floor(frame / 3) * 7} result="n" />
      <feDisplacementMap in="SourceGraphic" in2="n" scale={scale} xChannelSelector="R" yChannelSelector="G" />
    </filter>
  );
}

interface WriteOnProps {
  id: string;
  /** Box the writing lives in (the clip grows left → right across it). */
  x: number;
  y: number;
  w: number;
  h: number;
  from: number;
  dur: number;
  children: React.ReactNode;
}

/** Reveals handwriting left to right, like a pen travelling along the line. */
export function WriteOn({ id, x, y, w, h, from, dur, children }: WriteOnProps) {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [from, from + dur], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  if (p <= 0) return null;
  return (
    <>
      <clipPath id={id}>
        <rect x={x} y={y} width={w * p} height={h} />
      </clipPath>
      <g clipPath={`url(#${id})`}>{children}</g>
    </>
  );
}
