import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Code, Reveal, StampSlam, Svg } from "./labkit";
import { about, AMBER, clamp, hash, INK, L, PAPER, REAGENT } from "./style";

/**
 * TEST 03 — root lift. A barcode sample sticker is slapped on for "สาม";
 * then a two-column lift gauge: the ROOT column climbs first ("พองขึ้นจากโคน"),
 * the TIP column follows ("ไม่ใช่แค่ปลาย"), and a hexagon PASS lands.
 */

/** Peel-and-stick sample label: "03 · โคนผม". */
export function SampleSticker() {
  const frame = useCurrentFrame();
  const stick = interpolate(frame, [0, 5], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.4)) });
  const corner = interpolate(frame, [4, 10], [1, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const x = 120;
  const y = 1440;
  const w = 840;
  const h = 330;
  const bars = Array.from({ length: 38 }, (_, i) => ({ x: i * 13, w: 3 + Math.floor(hash(i + 3) * 3) * 3 }));
  return (
    <AbsoluteFill>
      <Svg>
        <g transform={about(x + w / 2, y + h / 2, `rotate(${-4 + (1 - stick) * -20}) scale(${0.6 + stick * 0.4})`)} opacity={stick > 0 ? 1 : 0}>
          <rect x={x + 10} y={y + 14} width={w} height={h} rx={18} fill="rgba(0,0,0,0.35)" />
          <rect x={x} y={y} width={w} height={h} rx={18} fill="#FFFFFF" />
          <rect x={x} y={y} width={w} height={70} rx={18} fill={AMBER} />
          <Code x={x + 30} y={y + 48} text="SAMPLE · HX-08" size={32} fill={INK} />
          <text x={x + 40} y={y + 285} fontFamily={L.readout} fontWeight={700} fontSize={220} fill={INK}>
            03
          </text>
          <text x={x + 330} y={y + 185} fontFamily={L.report} fontWeight={800} fontSize={92} fill={INK}>
            โคนผม
          </text>
          <g transform={`translate(${x + 335} ${y + 215})`}>
            {bars.map((b) => (
              <rect key={b.x} x={b.x} y={0} width={b.w} height={80} fill={INK} />
            ))}
          </g>
          <path d={`M ${x + w} ${y + h - 110 * corner} L ${x + w - 110 * corner} ${y + h} L ${x + w} ${y + h} Z`} fill="#D9D9D9" />
        </g>
      </Svg>
    </AbsoluteFill>
  );
}

const COL_H = 560;

function Column({ x, top, level, label, color }: { x: number; top: number; level: number; label: string; color: string }) {
  const base = top + COL_H;
  return (
    <g>
      <rect x={x} y={top} width={110} height={COL_H} rx={14} fill="rgba(255,255,255,0.14)" stroke={PAPER} strokeWidth={4} />
      <rect x={x + 10} y={base - 10 - (COL_H - 20) * level} width={90} height={(COL_H - 20) * level} rx={8} fill={color} />
      {Array.from({ length: 11 }, (_, i) => (
        <line key={i} x1={x + 110} y1={base - i * (COL_H / 10)} x2={x + (i % 5 === 0 ? 150 : 132)} y2={base - i * (COL_H / 10)} stroke={PAPER} strokeWidth={4} />
      ))}
      <text x={x + 55} y={base + 70} textAnchor="middle" fontFamily={L.label} fontWeight={700} fontSize={50} fill={PAPER}>
        {label}
      </text>
    </g>
  );
}

/** Root vs tip lift columns. `tipAt`/`stampAt` are beat-local frames. */
export function LiftGauge({ tipAt, stampAt }: { tipAt: number; stampAt: number }) {
  const frame = useCurrentFrame();
  const inP = interpolate(frame, [0, 6], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const root = interpolate(frame, [3, 18], [0.08, 0.88], { ...clamp, easing: Easing.out(Easing.back(1.3)) });
  const tip = interpolate(frame, [tipAt, tipAt + 12], [0.08, 0.7], { ...clamp, easing: Easing.out(Easing.back(1.3)) });
  const top = 250;
  const px = 60;
  return (
    <AbsoluteFill>
      <Svg>
        <g transform={`translate(${(1 - inP) * -460} 0)`}>
          <rect x={px} y={top - 110} width={400} height={COL_H + 230} rx={24} fill="rgba(13,20,34,0.8)" />
          <Code x={px + 30} y={top - 55} text="LIFT · T03" size={30} fill="#9FE3D8" />
          <Column x={px + 40} top={top} level={root} label="โคน" color={REAGENT} />
          <Column x={px + 220} top={top} level={tip} label="ปลาย" color={AMBER} />
        </g>
        <g opacity={inP}>
          <text x={540} y={1630} textAnchor="middle" fontFamily={L.readout} fontWeight={700} fontSize={104} fill={PAPER} stroke={INK} strokeWidth={14} paintOrder="stroke">
            พองขึ้น<tspan fill={REAGENT}>จากโคน</tspan>
          </text>
        </g>
        <Reveal id="d8-tip" x={200} y={1660} w={700} h={150} from={tipAt + 2} dur={9}>
          <text x={540} y={1770} textAnchor="middle" fontFamily={L.note} fontWeight={700} fontSize={72} fill={INK} stroke={PAPER} strokeWidth={12} paintOrder="stroke">
            ไม่ใช่แค่ปลาย
          </text>
        </Reveal>
        <StampSlam id="d8-pass3" at={stampAt} x={860} y={1000} rot={10} back={<polygon points="-150,0 -75,-130 75,-130 150,0 75,130 -75,130" fill={PAPER} opacity={0.82} />}>
          <polygon points="-150,0 -75,-130 75,-130 150,0 75,130 -75,130" fill="none" stroke="currentColor" strokeWidth={12} />
          <text y={24} textAnchor="middle" fontFamily={L.readout} fontWeight={700} fontSize={68} fill="currentColor" letterSpacing={3}>
            PASS
          </text>
          <text y={82} textAnchor="middle" fontFamily={L.readout} fontWeight={700} fontSize={24} fill="currentColor" letterSpacing={4}>
            T03 LIFT
          </text>
        </StampSlam>
      </Svg>
    </AbsoluteFill>
  );
}
