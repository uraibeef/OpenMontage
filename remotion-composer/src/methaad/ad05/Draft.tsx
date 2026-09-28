import { useId } from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { CAL, clamp, LIFT, LINE, PLATE, T } from "./style";

/** Draw-on progress 0→1 for linework. */
export function useDraw(from: number, dur = 8) {
  const frame = useCurrentFrame();
  return interpolate(frame, [from, from + dur], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
}

/** Full-frame SVG with the readability shadow applied. */
export function Sheet({ children, lift = true }: { children: React.ReactNode; lift?: boolean }) {
  return (
    <svg
      width={1080}
      height={1920}
      viewBox="0 0 1080 1920"
      style={{ position: "absolute", inset: 0, overflow: "visible", filter: lift ? LIFT : undefined }}
    >
      {children}
    </svg>
  );
}

/** A path that draws itself on (pathLength-normalised dash). */
export function Ink({
  d,
  p,
  color = LINE,
  width = 4,
  dash,
  fill = "none",
}: {
  d: string;
  p: number;
  color?: string;
  width?: number;
  dash?: string;
  fill?: string;
}) {
  const mid = "a5m" + useId().replace(/[^a-zA-Z0-9]/g, "");
  if (p <= 0) return null;
  if (dash) {
    return (
      <g>
        <mask id={mid} maskUnits="userSpaceOnUse" x={-2000} y={-2000} width={6000} height={6000}>
          <path d={d} pathLength={1} stroke="#fff" strokeWidth={width + 8} fill="none" strokeDasharray={`${p} 1`} />
        </mask>
        <path d={d} mask={`url(#${mid})`} stroke={color} strokeWidth={width} fill={fill} strokeDasharray={dash} strokeLinecap="round" />
      </g>
    );
  }
  return (
    <path
      d={d}
      pathLength={1}
      stroke={color}
      strokeWidth={width}
      fill={fill}
      strokeDasharray={`${p} 1`}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

/** Target ring on a feature: crosshair + ring that snaps in. */
export function Node({ x, y, p, r = 22 }: { x: number; y: number; p: number; r?: number }) {
  if (p <= 0) return null;
  const s = interpolate(p, [0, 0.6, 1], [2.4, 0.9, 1]);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={Math.min(1, p * 2)}>
      <circle r={r} fill="none" stroke={LINE} strokeWidth={4} />
      <circle r={6} fill={CAL} />
      <path d={`M ${-r - 12} 0 H ${-r + 6} M ${r - 6} 0 H ${r + 12} M 0 ${-r - 12} V ${-r + 6} M 0 ${r - 6} V ${r + 12}`} stroke={LINE} strokeWidth={3} />
    </g>
  );
}

/** Arrowhead-capped dimension line from (x1,y1) to (x2,y2), grows from the middle. */
export function DimLine({
  x1,
  y1,
  x2,
  y2,
  p,
  color = LINE,
  width = 4,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  p: number;
  color?: string;
  width?: number;
}) {
  if (p <= 0) return null;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const ax = mx + (x1 - mx) * p;
  const ay = my + (y1 - my) * p;
  const bx = mx + (x2 - mx) * p;
  const by = my + (y2 - my) * p;
  const ang = Math.atan2(by - ay, bx - ax);
  const head = (x: number, y: number, a: number) => {
    const L = 22;
    const w = 0.42;
    return `M ${x} ${y} L ${x - L * Math.cos(a - w)} ${y - L * Math.sin(a - w)} L ${x - L * Math.cos(a + w)} ${y - L * Math.sin(a + w)} Z`;
  };
  return (
    <g>
      <line x1={ax} y1={ay} x2={bx} y2={by} stroke={color} strokeWidth={width} />
      <path d={head(bx, by, ang)} fill={color} />
      <path d={head(ax, ay, ang + Math.PI)} fill={color} />
    </g>
  );
}

/** Graphite label plate: part code on top, Thai field text below. */
export function Plate({
  x,
  y,
  code,
  children,
  p,
  size = 64,
  align = "left",
  width,
}: {
  x: number;
  y: number;
  code?: string;
  children?: React.ReactNode;
  p: number;
  size?: number;
  align?: "left" | "right";
  width?: number;
}) {
  if (p <= 0) return null;
  const wipe = interpolate(p, [0, 1], [0, 100], clamp);
  return (
    <div
      style={{
        position: "absolute",
        left: align === "left" ? x : undefined,
        right: align === "right" ? 1080 - x : undefined,
        top: y,
        width,
        background: PLATE,
        borderLeft: align === "left" ? `8px solid ${CAL}` : undefined,
        borderRight: align === "right" ? `8px solid ${CAL}` : undefined,
        padding: "14px 26px 18px",
        clipPath: align === "left" ? `inset(0 ${100 - wipe}% 0 0)` : `inset(0 0 0 ${100 - wipe}%)`,
        boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
        textAlign: align,
        whiteSpace: "nowrap",
      }}
    >
      {code ? (
        <div style={{ fontFamily: T.mono, fontWeight: 500, fontSize: 24, letterSpacing: 3, color: CAL, lineHeight: 1.3 }}>{code}</div>
      ) : null}
      {children ? (
        <div style={{ fontFamily: T.th, fontWeight: 700, fontSize: size, color: LINE, lineHeight: 1.35 }}>{children}</div>
      ) : null}
    </div>
  );
}
