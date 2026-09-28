import { Easing, interpolate, useCurrentFrame } from "remotion";
import { about, clamp, L, PASS } from "./style";

/** Full-frame SVG layer. */
export function Svg({ children }: { children: React.ReactNode }) {
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      {children}
    </svg>
  );
}

/** Rubber-stamp ink: speckled gaps knocked out of the fill. */
export function InkFilter({ id, seed = 5 }: { id: string; seed?: number }) {
  return (
    <filter id={id} x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves={3} seed={seed} result="n" />
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.8 1.72" result="mask" />
      <feComposite in="SourceGraphic" in2="mask" operator="in" />
    </filter>
  );
}

/** Graph-paper cell pattern for report paper. */
export function GridPattern({ id, color, size = 36 }: { id: string; color: string; size?: number }) {
  return (
    <pattern id={id} width={size} height={size} patternUnits="userSpaceOnUse">
      <path d={`M ${size} 0 L 0 0 0 ${size}`} fill="none" stroke={color} strokeWidth={1.4} />
    </pattern>
  );
}

/** Reveals children left → right, like a pen or a printer head travelling. */
export function Reveal({ id, x, y, w, h, from, dur, children }: {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  from: number;
  dur: number;
  children: React.ReactNode;
}) {
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

/** 0→1 slam curve for a stamp landing at `at` (overshoots, then settles). */
export function useSlam(at: number) {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 5], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2.2)) });
  const shake = interpolate(frame, [at + 3, at + 5, at + 8], [0, 1, 0], clamp);
  return { p, scale: interpolate(p, [0, 1], [1.9, 1]), shake, on: frame >= at };
}

interface StampProps {
  id: string;
  at: number;
  x: number;
  y: number;
  rot: number;
  color?: string;
  /** Clean paper backing drawn under the speckled ink. */
  back?: React.ReactNode;
  children: React.ReactNode;
}

/** Slams children in like a hand stamp, with speckled ink. */
export function StampSlam({ id, at, x, y, rot, color = PASS, back, children }: StampProps) {
  const s = useSlam(at);
  if (!s.on) return null;
  return (
    <g
      transform={`translate(${x} ${y}) ${about(0, 0, `rotate(${rot + s.shake * 2}) scale(${s.scale})`)}`}
      opacity={interpolate(s.p, [0, 0.4], [0, 1], clamp)}
      color={color}
    >
      <defs>
        <InkFilter id={`${id}-ink`} seed={id.length * 7} />
      </defs>
      {back}
      <g filter={`url(#${id}-ink)`}>{children}</g>
    </g>
  );
}

/** Mono sample code, e.g. "HX-08 / T01". */
export function Code({ x, y, text, size = 30, fill, anchor = "start" }: {
  x: number;
  y: number;
  text: string;
  size?: number;
  fill: string;
  anchor?: "start" | "middle" | "end";
}) {
  return (
    <text x={x} y={y} fontFamily={L.readout} fontWeight={500} fontSize={size} fill={fill} letterSpacing={3} textAnchor={anchor}>
      {text}
    </text>
  );
}
