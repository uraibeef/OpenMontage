import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { clamp } from "../hooks/kit";
import { C, F } from "./theme";

/** Deal beat: a thermal receipt feeds up from the bottom edge, one printed block per VO line. */

const PAPER = "#FBFAF5";
const THERMAL = "#2A2A2E";
const LEFT = 90;
const WIDTH = 900;

interface Block {
  at: number;
  height: number;
  node: React.ReactNode;
}

const txt = (size: number, weight = 500): React.CSSProperties => ({
  fontFamily: F.receipt,
  fontWeight: weight,
  fontSize: size,
  color: THERMAL,
  lineHeight: 1.45,
  whiteSpace: "nowrap",
});

/** Item line with a dotted leader between name and price. */
function Leader({ name, price, mark }: { name: React.ReactNode; price: string; mark?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 12, ...txt(60) }}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>{name}</span>
      <span style={{ flex: 1, borderBottom: `6px dotted ${THERMAL}`, opacity: 0.55, transform: "translateY(-12px)" }} />
      <span style={{ fontWeight: 700, padding: "0 8px", background: mark ? C.pink : undefined, mixBlendMode: "multiply" }}>{price}</span>
    </div>
  );
}

/** Tiny drawn plate of kaprao: rice dome, basil, fried egg. */
const Plate = () => (
  <svg width={96} height={64} viewBox="-48 -34 96 64" style={{ transform: "translateY(8px)" }}>
    <ellipse cx={0} cy={12} rx={44} ry={16} fill="#fff" stroke={THERMAL} strokeWidth={4} />
    <path d="M -30 10 Q -26 -22 2 -22 Q 28 -22 30 10 Z" fill="#fff" stroke={THERMAL} strokeWidth={4} />
    <circle cx={-6} cy={-6} r={11} fill={C.yellow} stroke={THERMAL} strokeWidth={3} />
    <path d="M 12 -12 q 8 -8 14 0 q -8 6 -14 0 Z" fill={THERMAL} />
    <path d="M -24 0 q 6 -9 13 -2 q -7 6 -13 2 Z" fill={THERMAL} />
  </svg>
);

const Dashes = () => <div style={{ borderTop: `5px dashed ${THERMAL}`, opacity: 0.6, margin: "18px 0" }} />;

export function Receipt({ dealAt, priceAt, riceAt }: { dealAt: number; priceAt: number; riceAt: number }) {
  const frame = useCurrentFrame();
  const blocks: Block[] = [
    {
      at: 0,
      height: 120,
      node: (
        <div style={{ display: "flex", justifyContent: "space-between", ...txt(36, 700), letterSpacing: 4 }}>
          <span>ใบเสร็จ</span>
          <span>No.02</span>
        </div>
      ),
    },
    {
      at: dealAt,
      height: 170,
      node: <div style={{ ...txt(112, 700), textAlign: "center", letterSpacing: -1 }}>ซื้อ 1 แถม 1</div>,
    },
    {
      at: priceAt,
      height: 240,
      node: (
        <>
          <Leader name="แป้งเซ็ตผม x2" price="80.-" />
          <Leader name="ตกอันละ" price="40.-" mark />
        </>
      ),
    },
    {
      at: riceAt,
      height: 220,
      node: (
        <>
          <Dashes />
          <Leader
            name={
              <>
                <Plate />
                <span>ข้าวกะเพรา 1 จาน</span>
              </>
            }
            price="แพงกว่า"
          />
        </>
      ),
    },
  ];

  // Printed height eases up as each block leaves the print head.
  const printed = blocks.reduce((h, b) => h + b.height * interpolate(frame, [b.at, b.at + 9], [0, 1], { ...clamp, easing: Easing.out(Easing.quad) }), 0);
  const MARGIN = 60;
  const paperTop = 1920 - printed - MARGIN;
  const buzz = blocks.some((b) => frame >= b.at && frame < b.at + 9) ? Math.sin(frame * 3) * 1.5 : 0;

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: LEFT + buzz,
          width: WIDTH,
          top: paperTop,
          height: printed + MARGIN + 40,
          transform: "rotate(-1.5deg)",
          transformOrigin: "50% 100%",
          background: PAPER,
          boxShadow: "0 30px 60px rgba(0,0,0,0.45), 0 4px 10px rgba(0,0,0,0.25)",
          clipPath:
            "polygon(" +
            Array.from({ length: 25 }, (_, i) => `${(i / 24) * 100}% ${i % 2 ? 14 : 0}px`).join(", ") +
            ", 100% 100%, 0 100%)",
          padding: "40px 40px 0",
          overflow: "hidden",
        }}
      >
        {blocks.map((b, i) => (
          <div key={i} style={{ height: b.height, opacity: frame >= b.at ? 1 : 0, overflow: "visible" }}>
            {b.node}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
}
