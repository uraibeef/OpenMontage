import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { PaperGrain } from "../../fxkit";
import { CARD_SHADOW, clamp, INK, LEAF, MANILA, MOSS, PAPER, PAPER_DK, RUST, SEPIA, T } from "./style";

/**
 * Drawn shot for "กลิ่นซีดาร์วูดกับชาเขียว": a herbarium sheet. A pressed
 * cedar sprig and a pressed green-tea twig are laid down one after the
 * other (lift shadow collapsing as they flatten), taped with paper strips,
 * then a typewritten collection label slides in.
 */

const PRESS_FILTER = "sp06-pressed";

/** Mottled, slightly translucent fill that reads as a dried pressed leaf. */
function PressedDefs() {
  return (
    <defs>
      <filter id={PRESS_FILTER} x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves={3} seed={11} result="n" />
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.22  0 0 0 0 0.2  0 0 0 0 0.08  0 0 0 0.55 0" result="tone" />
        <feComposite in="tone" in2="SourceGraphic" operator="in" result="mottle" />
        <feMerge>
          <feMergeNode in="SourceGraphic" />
          <feMergeNode in="mottle" />
        </feMerge>
      </filter>
    </defs>
  );
}

function Cedar() {
  const branches = Array.from({ length: 7 }, (_, i) => {
    const t = 0.1 + i * 0.12;
    const x = 300 - t * 60;
    const y = 1180 - t * 640;
    const side = i % 2 ? 1 : -1;
    const len = 190 - i * 14;
    const ang = side > 0 ? -0.45 : Math.PI + 0.45;
    const scales = Array.from({ length: 9 }, (_, k) => {
      const s = (k + 0.6) / 9;
      const sx = x + Math.cos(ang) * len * s;
      const sy = y + Math.sin(ang) * len * s;
      const r = 20 - k * 1.3;
      return (
        <ellipse key={k} cx={sx} cy={sy} rx={r} ry={r * 0.45} transform={`rotate(${(ang * 180) / Math.PI + (k % 2 ? 28 : -28)} ${sx} ${sy})`}
          fill={k % 3 ? LEAF : "#5B6E3A"} stroke={INK} strokeWidth={0.8} />
      );
    });
    return (
      <g key={i}>
        <path d={`M ${x} ${y} L ${x + Math.cos(ang) * len} ${y + Math.sin(ang) * len}`} stroke="#5A4128" strokeWidth={4} />
        {scales}
      </g>
    );
  });
  return (
    <g filter={`url(#${PRESS_FILTER})`}>
      <path d="M 300 1240 C 290 1000 270 780 230 520" fill="none" stroke="#5A4128" strokeWidth={7} strokeLinecap="round" />
      {branches}
    </g>
  );
}

/** Serrated elliptical tea leaf along +y from the origin. */
function TeaLeaf({ x, y, ang, len, wid, tone }: { x: number; y: number; ang: number; len: number; wid: number; tone: string }) {
  const teeth = 9;
  const side = (dir: number) =>
    Array.from({ length: teeth + 1 }, (_, i) => {
      const t = i / teeth;
      const w = Math.sin(Math.PI * t) * wid * (1 + (i % 2 ? 0.07 : 0));
      return `${dir * w} ${-t * len}`;
    });
  const outline = `M 0 0 L ${side(1).join(" L ")} L ${side(-1).reverse().join(" L ")} Z`;
  const veins = [0.25, 0.45, 0.65].map((t) => `M 0 ${-t * len} l ${wid * 0.6} ${-len * 0.12} M 0 ${-t * len} l ${-wid * 0.6} ${-len * 0.12}`).join(" ");
  return (
    <g transform={`translate(${x} ${y}) rotate(${ang})`}>
      <path d={outline} fill={tone} stroke={INK} strokeWidth={1.4} strokeLinejoin="round" />
      <path d={`M 0 0 L 0 ${-len}`} stroke="#C9C08A" strokeWidth={2.2} />
      <path d={veins} stroke="#C9C08A" strokeWidth={1.2} fill="none" opacity={0.8} />
    </g>
  );
}

function Tea() {
  return (
    <g filter={`url(#${PRESS_FILTER})`}>
      <path d="M 780 1250 C 790 1060 760 860 790 560" fill="none" stroke="#5A4128" strokeWidth={6} strokeLinecap="round" />
      <TeaLeaf x={784} y={1080} ang={-62} len={250} wid={70} tone={MOSS} />
      <TeaLeaf x={776} y={930} ang={55} len={230} wid={64} tone="#6C8447" />
      <TeaLeaf x={782} y={760} ang={-48} len={190} wid={54} tone={MOSS} />
      <TeaLeaf x={790} y={600} ang={12} len={120} wid={30} tone="#8FA15E" />
    </g>
  );
}

function Tape({ x, y, rot, o }: { x: number; y: number; rot: number; o: number }) {
  return (
    <rect x={x - 60} y={y - 18} width={120} height={36} fill="#F6EFD9" opacity={0.78 * o} transform={`rotate(${rot} ${x} ${y})`}
      stroke={PAPER_DK} strokeWidth={1} />
  );
}

export function ScentSheet() {
  const frame = useCurrentFrame();
  const lay = (from: number) => interpolate(frame, [from, from + 8], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const a = lay(0);
  const b = lay(6);
  const label = interpolate(frame, [15, 23], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const press = (p: number, cx: number, cy: number) => ({
    opacity: interpolate(p, [0, 0.3], [0, 1], clamp),
    transform: `translate(${cx}px, ${cy}px) scale(${1.12 - p * 0.12}) translate(${-cx}px, ${-cy}px)`,
    filter: `drop-shadow(${(1 - p) * 26}px ${(1 - p) * 40}px ${(1 - p) * 18 + 2}px rgba(30,20,8,${0.15 + (1 - p) * 0.35}))`,
  });
  const name = (x: number, th: string, la: string, p: number) => (
    <div style={{ position: "absolute", left: x - 230, width: 460, top: 1290, textAlign: "center", opacity: p }}>
      <div style={{ fontFamily: T.hand, fontWeight: 700, fontSize: 84, color: INK, lineHeight: "110px" }}>{th}</div>
      <div style={{ fontFamily: T.fellItalic, fontSize: 38, color: SEPIA }}>{la}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{ backgroundColor: PAPER }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 40%, #F3EBD3 40%, ${PAPER_DK} 100%)` }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 200, textAlign: "center", opacity: a }}>
        <div style={{ fontFamily: T.fellSC, fontSize: 34, letterSpacing: 10, color: SEPIA }}>Herbarium · the scent</div>
        <div style={{ fontFamily: T.serif, fontWeight: 200, fontSize: 130, color: INK, lineHeight: "170px" }}>กลิ่น</div>
      </div>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, ...press(a, 280, 900) }}>
        <PressedDefs />
        <Cedar />
      </svg>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, ...press(b, 780, 900) }}>
        <PressedDefs />
        <Tea />
      </svg>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        <Tape x={290} y={1120} rot={-14} o={lay(9)} />
        <Tape x={250} y={620} rot={10} o={lay(11)} />
        <Tape x={785} y={1170} rot={12} o={lay(13)} />
        <Tape x={790} y={700} rot={-8} o={lay(14)} />
      </svg>
      {name(290, "ซีดาร์วูด", "Cedrus", a)}
      {name(790, "ชาเขียว", "Camellia sinensis", b)}
      <div
        style={{
          position: "absolute",
          left: 380,
          width: 560,
          top: 1520,
          padding: "22px 30px",
          backgroundColor: MANILA,
          boxShadow: CARD_SHADOW,
          border: `2px solid ${SEPIA}`,
          transform: `translateY(${(1 - label) * 240}px) rotate(-2deg)`,
          opacity: label,
          fontFamily: T.type,
          color: INK,
          fontSize: 28,
          lineHeight: "40px",
        }}
      >
        <div style={{ color: RUST }}>HERB. MAKE SENSE Nº 06</div>
        <div>Cedrus · Camellia sinensis</div>
        <div>coll. 2026 · pressed &amp; dried</div>
      </div>
      <PaperGrain id="sp06-herb-grain" opacity={0.2} />
    </AbsoluteFill>
  );
}
