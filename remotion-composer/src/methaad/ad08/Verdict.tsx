import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Code, StampSlam, Svg } from "./labkit";
import { about, clamp, FAIL, GRID, INK, L, PAPER, PASS } from "./style";

/**
 * Deal close: the report's result box prints "3/3 PASS", a red approval
 * seal lands "ซื้อ 1 แถม 1", and an LCD scale readout counts up to 80 บาท.
 */

const ROWS = ["ไม่มัน", "ไม่เหนียว", "พองจากโคน"];

/** Scalloped approval-seal outline, 28 bumps. */
const SEAL = Array.from({ length: 56 }, (_, i) => {
  const a = (i / 56) * Math.PI * 2;
  const r = i % 2 === 0 ? 215 : 196;
  return `${(r * Math.cos(a)).toFixed(1)},${(r * Math.sin(a)).toFixed(1)}`;
}).join(" ");

export function Verdict({ dealAt, priceAt }: { dealAt: number; priceAt: number }) {
  const frame = useCurrentFrame();
  const inP = interpolate(frame, [0, 6], [-560, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const price = Math.round(interpolate(frame, [priceAt, priceAt + 9], [0, 80], { ...clamp, easing: Easing.out(Easing.cubic) }));
  const lcdIn = interpolate(frame, [priceAt - 2, priceAt + 4], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.6)) });
  const x = 90;
  const y = 70;
  return (
    <AbsoluteFill>
      <Svg>
        <defs>
          <pattern id="d8-verdict-grid" width={28} height={28} patternUnits="userSpaceOnUse">
            <path d="M 28 0 L 0 0 0 28" fill="none" stroke={GRID} strokeWidth={1.2} />
          </pattern>
        </defs>
        <g transform={`translate(0 ${inP})`}>
          <rect x={x + 8} y={y + 12} width={900} height={440} rx={8} fill="rgba(0,0,0,0.3)" />
          <rect x={x} y={y} width={900} height={440} rx={8} fill={PAPER} />
          <rect x={x} y={y} width={900} height={440} rx={8} fill="url(#d8-verdict-grid)" opacity={0.6} />
          <text x={x + 36} y={y + 86} fontFamily={L.report} fontWeight={800} fontSize={64} fill={INK}>
            สรุปผลทดสอบ
          </text>
          <Code x={x + 864} y={y + 80} text="HX-08" size={30} fill={INK} anchor="end" />
          <rect x={x + 36} y={y + 110} width={828} height={5} fill={INK} />
          {ROWS.map((r, i) => {
            const t = interpolate(frame, [4 + i * 3, 8 + i * 3], [0, 1], clamp);
            const ry = y + 190 + i * 80;
            return (
              <g key={r} opacity={t}>
                <Code x={x + 40} y={ry} text={`T0${i + 1}`} size={36} fill="#51607A" />
                <text x={x + 160} y={ry} fontFamily={L.report} fontWeight={800} fontSize={52} fill={INK}>
                  {r}
                </text>
                <rect x={x + 680} y={ry - 44} width={180} height={58} rx={6} fill={PASS} />
                <Code x={x + 770} y={ry - 3} text="PASS" size={36} fill={PAPER} anchor="middle" />
              </g>
            );
          })}
        </g>
        <StampSlam id="d8-deal" at={dealAt} x={540} y={1300} rot={-7} color={FAIL}>
          <polygon points={SEAL} fill="currentColor" />
          <circle r={176} fill="none" stroke={PAPER} strokeWidth={5} strokeDasharray="4 10" />
          <text y={-50} textAnchor="middle" fontFamily={L.label} fontWeight={700} fontSize={74} fill={PAPER}>
            ซื้อ 1
          </text>
          <text y={75} textAnchor="middle" fontFamily={L.label} fontWeight={700} fontSize={108} fill={PAPER}>
            แถม 1
          </text>
        </StampSlam>
        {lcdIn > 0 ? (
          <g transform={about(540, 1640, `scale(${lcdIn})`)}>
            <rect x={230} y={1540} width={620} height={210} rx={24} fill={INK} />
            <rect x={255} y={1565} width={570} height={160} rx={12} fill="#A9C99A" />
            <text x={630} y={1702} textAnchor="end" fontFamily={L.readout} fontWeight={700} fontSize={150} fill="#1F2D1A">
              {String(price).padStart(2, "0")}
            </text>
            <text x={650} y={1690} fontFamily={L.report} fontWeight={800} fontSize={76} fill="#1F2D1A">
              บาท
            </text>
          </g>
        ) : null}
      </Svg>
    </AbsoluteFill>
  );
}
