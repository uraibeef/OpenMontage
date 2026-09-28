import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { graphemes } from "../hooks/kit";
import { BRASS, clamp, CREAM, FOREST, LIFT, PINE, T } from "./style";

/**
 * Beat 1 — "สเปรย์ขวดเขียว ที่คนสั่งกันเยอะมากตอนนี้".
 * The word condenses out of mist, the green bottle is engraved into a
 * cartouche, then an order ledger fills row after row with tiny bottles.
 */

/** "สเปรย์" condenses letter by letter out of the forest mist. */
export function MistWord() {
  const frame = useCurrentFrame();
  const g = graphemes("สเปรย์");
  const sub = interpolate(frame, [6, 14], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 96,
          top: 330,
          fontFamily: T.mist,
          fontStyle: "italic",
          fontWeight: 200,
          fontSize: 230,
          lineHeight: "300px",
          color: CREAM,
          textShadow: LIFT,
          whiteSpace: "nowrap",
        }}
      >
        {g.map((ch, i) => {
          const p = interpolate(frame, [i * 1.6, i * 1.6 + 9], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                opacity: p,
                filter: `blur(${(1 - p) * 16}px)`,
                transform: `translateY(${(1 - p) * 40}px) scale(${1.25 - p * 0.25})`,
              }}
            >
              {ch}
            </span>
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          left: 110,
          top: 650,
          fontFamily: T.latinItalic,
          fontWeight: 300,
          fontSize: 50,
          letterSpacing: 4,
          color: CREAM,
          opacity: sub,
          textShadow: LIFT,
        }}
      >
        <span style={{ display: "inline-block", width: 90 * sub, height: 2, background: BRASS, verticalAlign: "middle", marginRight: 22 }} />
        pre-styling mist
      </div>
    </AbsoluteFill>
  );
}

/** "ขวดเขียว" engraved inside a hairline double cartouche that draws itself. */
export function Cartouche() {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [0, 12], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const word = interpolate(frame, [4, 14], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const cx = 540;
  const cy = 430;
  const rx = 400;
  const ry = 150;
  const perim = Math.PI * (3 * (rx + ry) - Math.sqrt((3 * rx + ry) * (rx + 3 * ry)));
  const ring = (grow: number, w: number) => (
    <ellipse
      cx={cx}
      cy={cy}
      rx={rx + grow}
      ry={ry + grow}
      fill="none"
      stroke={CREAM}
      strokeWidth={w}
      strokeDasharray={perim + grow * 7}
      strokeDashoffset={(perim + grow * 7) * (1 - draw)}
      transform={`rotate(${grow ? 180 : 0} ${cx} ${cy})`}
    />
  );
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={FOREST} opacity={0.55 * draw} />
        {ring(0, 3)}
        {ring(18, 1.5)}
        {[-1, 1].map((s) => (
          <g key={s} opacity={draw} transform={`translate(${cx + s * (rx + 18)} ${cy}) rotate(45)`}>
            <rect x={-11} y={-11} width={22} height={22} fill={BRASS} />
          </g>
        ))}
      </svg>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: cy - 100,
          textAlign: "center",
          fontFamily: T.engraved,
          fontWeight: 300,
          fontSize: 150,
          lineHeight: "190px",
          letterSpacing: interpolate(word, [0, 1], [40, 10]),
          color: CREAM,
          opacity: word,
          clipPath: `inset(0 ${(1 - word) * 50}% 0 ${(1 - word) * 50}%)`,
        }}
      >
        ขวดเขียว
      </div>
    </AbsoluteFill>
  );
}

/** Tiny line-drawn pump bottle for the ledger. */
function BottleIcon({ x, y, s, p }: { x: number; y: number; s: number; p: number }) {
  return (
    <g transform={`translate(${x} ${y + (1 - p) * 14}) scale(${s})`} opacity={p} fill="none" stroke={PINE} strokeWidth={2.4 / s}>
      <rect x={-13} y={-20} width={26} height={46} rx={5} fill={p > 0.9 ? PINE : "none"} />
      <rect x={-7} y={-30} width={14} height={10} rx={2} />
      <path d="M -3 -30 L -3 -36 L 10 -36" />
    </g>
  );
}

/** "คนสั่งกันเยอะมาก" — an order ledger that fills row after row with bottles. */
export function OrderLedger() {
  const frame = useCurrentFrame();
  const band = interpolate(frame, [0, 7], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const cols = 13;
  const rows = 3;
  const top = 200;
  const now = interpolate(frame, [30, 36], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        <g style={{ transform: `scaleY(${band})`, transformOrigin: `540px ${top}px` }}>
          <rect x={70} y={top} width={940} height={460} fill={CREAM} />
          <rect x={86} y={top + 16} width={908} height={428} fill="none" stroke={PINE} strokeWidth={1.5} />
          <line x1={130} y1={top + 190} x2={950} y2={top + 190} stroke={PINE} strokeWidth={1} />
          <text x={130} y={top + 70} fontFamily={T.latin} fontWeight={500} fontSize={24} letterSpacing={8} fill={PINE}>
            ORDER LEDGER
          </text>
          <text x={950} y={top + 70} textAnchor="end" fontFamily={T.ledger} fontWeight={400} fontSize={34} fill={PINE} opacity={now}>
            ตอนนี้
          </text>
          <text x={130} y={top + 160} fontFamily={T.ledger} fontWeight={800} fontSize={78} fill={FOREST}>
            คนสั่งกันเยอะมาก
          </text>
        </g>
        {Array.from({ length: rows * cols }, (_, i) => {
          const r = Math.floor(i / cols);
          const c = i % cols;
          const p = interpolate(frame, [5 + i * 0.55, 9 + i * 0.55], [0, 1], clamp);
          return <BottleIcon key={i} x={160 + c * 63} y={top + 250 + r * 76} s={1} p={p * band} />;
        })}
      </svg>
    </AbsoluteFill>
  );
}
