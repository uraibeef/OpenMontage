import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { PaperGrain } from "../../fxkit";
import { Mist } from "./Frame";
import { BRASS, clamp, FOREST, PAPER, PINE, SAGE, T } from "./style";

/**
 * Drawn shot for "กลิ่นซีดาร์วูดกับชาเขียว": a fragrance-house notes card.
 * A cedar branch and a green-tea sprig draw themselves in forest hairline
 * on cream paper while a soft mist drifts across.
 */

const STROKE = { fill: "none", stroke: FOREST, strokeLinecap: "round", strokeLinejoin: "round" } as const;

/** Cubic bezier point. */
function bez(t: number, p0: number[], p1: number[], p2: number[], p3: number[]) {
  const u = 1 - t;
  const k = [u * u * u, 3 * u * u * t, 3 * u * t * t, t * t * t];
  return [0, 1].map((a) => k[0] * p0[a] + k[1] * p1[a] + k[2] * p2[a] + k[3] * p3[a]);
}

function Draw({ d, p, w = 3, color = FOREST }: { d: string; p: number; w?: number; color?: string }) {
  return <path d={d} {...STROKE} stroke={color} strokeWidth={w} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />;
}

function Cedar({ p }: { p: number }) {
  const P = [[330, 1260], [300, 1020], [200, 820], [150, 590]];
  const stem = `M ${P[0].join(" ")} C ${P[1].join(" ")} ${P[2].join(" ")} ${P[3].join(" ")}`;
  const sprays = Array.from({ length: 8 }, (_, i) => {
    const t = 0.12 + i * 0.11;
    const [x, y] = bez(t, P[0], P[1], P[2], P[3]);
    const side = i % 2 ? 1 : -1;
    const len = 150 - i * 11;
    const ang = side > 0 ? -0.55 : -2.55;
    const ex = x + Math.cos(ang) * len;
    const ey = y + Math.sin(ang) * len;
    const scales = Array.from({ length: 5 }, (_, k) => {
      const s = (k + 1) / 6;
      const sx = x + (ex - x) * s;
      const sy = y + (ey - y) * s;
      const n = 26 - k * 3;
      return `M ${sx} ${sy} l ${Math.cos(ang - 0.9) * n} ${Math.sin(ang - 0.9) * n} M ${sx} ${sy} l ${Math.cos(ang + 0.9) * n} ${Math.sin(ang + 0.9) * n}`;
    });
    const local = interpolate(p, [0.15 + i * 0.07, 0.45 + i * 0.07], [0, 1], clamp);
    return (
      <g key={i}>
        <Draw d={`M ${x} ${y} Q ${(x + ex) / 2} ${(y + ey) / 2 - 16} ${ex} ${ey}`} p={local} w={2.4} />
        <Draw d={scales.join(" ")} p={local} w={1.8} color={PINE} />
      </g>
    );
  });
  return (
    <g>
      <Draw d={stem} p={interpolate(p, [0, 0.5], [0, 1], clamp)} w={4} />
      {sprays}
    </g>
  );
}

function Leaf({ x, y, ang, len, wid, p }: { x: number; y: number; ang: number; len: number; wid: number; p: number }) {
  const veins = [0.3, 0.5, 0.7]
    .map((s) => `M 0 ${-len * s} L ${wid * 0.32} ${-len * s - 26} M 0 ${-len * s} L ${-wid * 0.32} ${-len * s - 26}`)
    .join(" ");
  return (
    <g transform={`translate(${x} ${y}) rotate(${ang})`}>
      <Draw d={`M 0 0 C ${wid * 0.7} ${-len * 0.25} ${wid * 0.55} ${-len * 0.75} 0 ${-len} C ${-wid * 0.55} ${-len * 0.75} ${-wid * 0.7} ${-len * 0.25} 0 0`} p={p} w={2.6} />
      <Draw d={`M 0 0 L 0 ${-len * 0.92}`} p={p} w={1.6} color={PINE} />
      <Draw d={veins} p={interpolate(p, [0.4, 1], [0, 1], clamp)} w={1.2} color={SAGE} />
    </g>
  );
}

function TeaSprig({ p }: { p: number }) {
  const P = [[770, 1270], [790, 1060], [740, 850], [790, 620]];
  const stem = `M ${P[0].join(" ")} C ${P[1].join(" ")} ${P[2].join(" ")} ${P[3].join(" ")}`;
  const leaves = [
    { t: 0.22, ang: 58, len: 200, wid: 92 },
    { t: 0.4, ang: -54, len: 220, wid: 100 },
    { t: 0.6, ang: 48, len: 190, wid: 88 },
    { t: 0.77, ang: -40, len: 160, wid: 76 },
    { t: 1, ang: 8, len: 120, wid: 52 },
  ];
  return (
    <g>
      <Draw d={stem} p={interpolate(p, [0.05, 0.5], [0, 1], clamp)} w={4} />
      {leaves.map((l, i) => {
        const [x, y] = bez(l.t, P[0], P[1], P[2], P[3]);
        const lp = interpolate(p, [0.2 + i * 0.1, 0.55 + i * 0.1], [0, 1], { ...clamp, easing: Easing.out(Easing.quad) });
        return <Leaf key={i} x={x} y={y} ang={l.ang} len={l.len} wid={l.wid} p={lp} />;
      })}
    </g>
  );
}

export function ScentCard() {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [0, 26], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const head = interpolate(frame, [2, 10], [0, 1], clamp);
  const left = interpolate(frame, [8, 16], [0, 1], clamp);
  const right = interpolate(frame, [16, 24], [0, 1], clamp);
  const drift = frame * 0.6;
  const label = (x: number, th: string, en: string, o: number) => (
    <div style={{ position: "absolute", left: x - 240, width: 480, top: 1330, textAlign: "center", opacity: o, transform: `translateY(${(1 - o) * 20}px)` }}>
      <div style={{ fontFamily: T.ledger, fontWeight: 200, fontSize: 92, color: FOREST, lineHeight: "130px" }}>{th}</div>
      <div style={{ fontFamily: T.latinItalic, fontWeight: 300, fontSize: 44, color: PINE, letterSpacing: 3 }}>{en}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{ backgroundColor: PAPER }}>
      <AbsoluteFill style={{ transform: `scale(${1.04 - draw * 0.04})` }}>
        <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
          <rect x={60} y={150} width={960} height={1620} fill="none" stroke={FOREST} strokeWidth={1.5} />
          <rect x={76} y={166} width={928} height={1588} fill="none" stroke={FOREST} strokeWidth={0.8} opacity={0.6} />
          <g transform={`translate(${-drift * 0.3} 0)`}>
            <Cedar p={draw} />
          </g>
          <g transform={`translate(${drift * 0.3} 0)`}>
            <TeaSprig p={draw} />
          </g>
          <line x1={540} y1={1330} x2={540} y2={1560} stroke={BRASS} strokeWidth={1.5} opacity={right} />
        </svg>
        <div style={{ position: "absolute", left: 0, right: 0, top: 230, textAlign: "center", opacity: head }}>
          <div style={{ fontFamily: T.latin, fontWeight: 500, fontSize: 26, letterSpacing: 12, color: PINE }}>THE SCENT</div>
          <div style={{ fontFamily: T.ledger, fontWeight: 200, fontSize: 120, color: FOREST, lineHeight: "170px" }}>กลิ่น</div>
        </div>
        {label(290, "ซีดาร์วูด", "cedarwood", left)}
        {label(790, "ชาเขียว", "green tea", right)}
        <div
          style={{
            position: "absolute",
            left: 490,
            width: 100,
            top: 1590,
            textAlign: "center",
            fontFamily: T.didoneItalic,
            fontSize: 110,
            color: BRASS,
            opacity: right,
          }}
        >
          &amp;
        </div>
      </AbsoluteFill>
      <Mist seed={31} count={70} x={-40} y={1150} angle={-0.15} spread={0.7} reach={1100} life={40} color={SAGE} />
      <PaperGrain id="sp01-scent-grain" opacity={0.2} />
    </AbsoluteFill>
  );
}
