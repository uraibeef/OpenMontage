import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { usePop } from "../hooks/kit";
import { DimLine, Ink, Plate, Sheet, useDraw } from "./Draft";
import { CAL, clamp, DIM, GRAPHITE, LIFT, LINE, SHEET, T } from "./style";

/**
 * Beats 7–9: where the two units go. Profile capture, a pocket fit test on a
 * dark drafting sheet, a mechanical QTY counter, a floor-plan pin, a bag cutaway.
 */

/** Beat 7a (11.50–12.20 s): dashed profile traced around the bottle in hand. */
export function HookProfile() {
  const trace = useDraw(0, 14);
  const label = useDraw(8, 6);
  return (
    <AbsoluteFill>
      <Sheet>
        <Ink d="M 150 330 H 610 Q 650 330 650 370 V 1620 Q 650 1660 610 1660 H 150 Q 110 1660 110 1620 V 370 Q 110 330 150 330 Z" p={trace} width={5} dash="22 14" color={CAL} />
      </Sheet>
      <Plate x={640} y={180} code="PROFILE CAPTURE" p={label} align="left" />
    </AbsoluteFill>
  );
}

function SheetGrid({ light }: { light: boolean }) {
  const c = light ? "rgba(16,17,19,0.08)" : "rgba(244,242,235,0.06)";
  return (
    <AbsoluteFill
      style={{
        backgroundColor: light ? SHEET : GRAPHITE,
        backgroundImage: `linear-gradient(${c} 2px, transparent 2px), linear-gradient(90deg, ${c} 2px, transparent 2px)`,
        backgroundSize: "60px 60px",
      }}
    />
  );
}

/** Beat 7b (12.20–13.35 s): pocket fit test — bottle profile drops into a jeans pocket. */
export function HookPocket() {
  const frame = useCurrentFrame();
  const draw = useDraw(0, 12);
  const drop = interpolate(frame, [8, 18], [-900, 0], { ...clamp, easing: Easing.bezier(0.5, 0, 0.3, 1.25) });
  const clear = useDraw(18, 6);
  const stamp = usePop(22, 9);
  return (
    <AbsoluteFill>
      <SheetGrid light={false} />
      <Sheet lift={false}>
        {/* jeans front: waistband, fly curve, front pocket opening, rivet */}
        <Ink d="M 80 520 H 1000" p={draw} width={5} />
        <Ink d="M 80 620 H 1000" p={draw} width={3} dash="10 10" color={DIM} />
        <Ink d="M 180 620 C 260 900, 520 980, 760 960 V 1760" p={draw} width={5} />
        <Ink d="M 150 640 C 240 940, 520 1020, 730 1000 V 1760" p={draw} width={3} dash="10 10" color={CAL} />
        <Ink d="M 260 980 V 1760 M 260 1760 H 900" p={draw} width={3} dash="14 12" color={DIM} />
        <circle cx={760} cy={960} r={14} fill="none" stroke={LINE} strokeWidth={4} opacity={draw} />
        {/* bottle profile inside the pocket bag */}
        <g transform={`translate(0 ${drop})`}>
          <rect x={420} y={1080} width={220} height={560} rx={36} fill="rgba(255,90,31,0.18)" stroke={CAL} strokeWidth={6} strokeDasharray="22 14" />
          <rect x={430} y={1080} width={200} height={70} rx={20} fill={CAL} opacity={0.5} />
        </g>
        <DimLine x1={290} y1={1360} x2={414} y2={1360} p={clear} color={LINE} />
        <DimLine x1={646} y1={1360} x2={754} y2={1360} p={clear} color={LINE} />
        <text x={80} y={440} fontFamily={T.mono} fontWeight={700} fontSize={26} letterSpacing={4} fill={DIM}>
          FIT TEST · FRONT POCKET
        </text>
      </Sheet>
      <div style={{ position: "absolute", left: 80, top: 170, fontFamily: T.disp, fontWeight: 700, fontSize: 112, color: LINE, lineHeight: 1.15, opacity: draw }}>
        ใส่กระเป๋ากางเกง
      </div>
      <div
        style={{
          position: "absolute",
          left: 560,
          top: 1500,
          padding: "6px 34px 14px",
          border: `8px solid ${CAL}`,
          color: CAL,
          fontFamily: T.th,
          fontWeight: 700,
          fontSize: 110,
          lineHeight: 1.2,
          background: "rgba(16,17,19,0.9)",
          transform: `rotate(-8deg) scale(${interpolate(stamp, [0, 1], [2.2, 1])})`,
          opacity: Math.min(1, stamp * 1.5),
        }}
      >
        สบาย
      </div>
    </AbsoluteFill>
  );
}

/** One odometer wheel rolling to `to` from `from`. */
function Wheel({ value, size }: { value: number; size: number }) {
  const h = size * 1.2;
  return (
    <div style={{ height: h, overflow: "hidden", width: size * 0.72, background: "#F7F5EF", borderRadius: 10, boxShadow: "inset 0 14px 18px rgba(0,0,0,0.35), inset 0 -14px 18px rgba(0,0,0,0.35)" }}>
      <div style={{ transform: `translateY(${-value * h}px)` }}>
        {[0, 1, 2, 3].map((n) => (
          <div key={n} style={{ height: h, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: T.mono, fontWeight: 700, fontSize: size, color: GRAPHITE }}>
            {n}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Beat 8 (13.35–14.69 s): mechanical QTY counter rolls 0 → 2. */
export function HookCounter() {
  const frame = useCurrentFrame();
  const inP = usePop(0, 12);
  const v = interpolate(frame, [4, 12, 16, 24], [0, 1, 1, 2], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const label = useDraw(22, 6);
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          right: 60,
          top: 120,
          padding: "24px 30px 26px",
          background: "linear-gradient(180deg, #2A2C30, #111214)",
          borderRadius: 18,
          border: `3px solid #3A3D42`,
          boxShadow: "0 30px 60px rgba(0,0,0,0.55)",
          transform: `translateY(${(1 - inP) * -300}px)`,
        }}
      >
        <div style={{ fontFamily: T.mono, fontWeight: 700, fontSize: 26, letterSpacing: 6, color: CAL, marginBottom: 14 }}>QTY / UNITS</div>
        <div style={{ display: "flex", gap: 12 }}>
          <Wheel value={0} size={170} />
          <Wheel value={v} size={170} />
        </div>
      </div>
      <Plate x={1020} y={560} align="right" p={label} size={80}>
        ได้มา 2 กระปุก
      </Plate>
    </AbsoluteFill>
  );
}

/** Beat 9 (14.69–15.57 s): floor-plan pin drops unit 01 at home. */
export function HookHome() {
  const frame = useCurrentFrame();
  const plan = useDraw(0, 12);
  const pin = interpolate(frame, [10, 16], [-160, 0], { ...clamp, easing: Easing.out(Easing.back(2.2)) });
  const ox = 70;
  const oy = 240;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: ox - 20, top: oy - 20, width: 480, height: 560, background: "rgba(16,17,19,0.82)", opacity: plan }} />
      <Sheet lift={false}>
        <Ink d={`M ${ox + 20} ${oy + 460} V ${oy + 200} L ${ox + 220} ${oy + 40} L ${ox + 420} ${oy + 200} V ${oy + 460} Z`} p={plan} width={6} />
        <Ink d={`M ${ox + 20} ${oy + 300} H ${ox + 250} M ${ox + 250} ${oy + 200} V ${oy + 360}`} p={plan} width={3} />
        <Ink d={`M ${ox + 170} ${oy + 460} A 60 60 0 0 1 ${ox + 110} ${oy + 400}`} p={plan} width={3} dash="8 8" color={DIM} />
        <g transform={`translate(${ox + 330} ${oy + 360 + pin})`} opacity={frame >= 10 ? 1 : 0}>
          <path d="M 0 0 C -50 -60, -50 -120, 0 -120 C 50 -120, 50 -60, 0 0 Z" fill={CAL} />
          <text x={0} y={-68} textAnchor="middle" fontFamily={T.mono} fontWeight={700} fontSize={34} fill={GRAPHITE}>
            01
          </text>
        </g>
      </Sheet>
      <div style={{ position: "absolute", left: ox + 20, top: oy + 470, fontFamily: T.th, fontWeight: 700, fontSize: 74, color: LINE, opacity: plan, filter: LIFT, lineHeight: 1.1 }}>
        เก็บไว้บ้าน
      </div>
    </AbsoluteFill>
  );
}

/** Beat 10 (15.57–16.98 s): work-bag cutaway, unit 02 slots into the side pocket. */
export function HookBag() {
  const frame = useCurrentFrame();
  const draw = useDraw(0, 14);
  const slide = interpolate(frame, [12, 22], [-700, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const tag = useDraw(2, 9);
  const stroke = GRAPHITE;
  return (
    <AbsoluteFill>
      <SheetGrid light />
      <Sheet lift={false}>
        {/* strap, body, flap, side pocket */}
        <Ink d="M 300 760 C 300 420, 780 420, 780 760" p={draw} width={10} color={stroke} />
        <Ink d="M 170 760 H 910 Q 950 760 950 800 V 1560 Q 950 1600 910 1600 H 170 Q 130 1600 130 1560 V 800 Q 130 760 170 760 Z" p={draw} width={8} color={stroke} />
        <Ink d="M 130 800 H 950 V 1060 Q 540 1160 130 1060 Z" p={draw} width={5} color={stroke} />
        <Ink d="M 610 1180 H 890 V 1540 H 610 Z" p={draw} width={4} dash="14 10" color={CAL} />
        <g transform={`translate(0 ${slide})`} opacity={frame >= 12 ? 1 : 0}>
          <rect x={660} y={1110} width={180} height={410} rx={30} fill={GRAPHITE} />
          <rect x={660} y={1110} width={180} height={60} rx={20} fill="#2E3034" />
          <text x={750} y={1360} textAnchor="middle" fontFamily={T.mono} fontWeight={700} fontSize={44} fill={CAL}>
            02
          </text>
        </g>
        <Ink d="M 180 1250 H 560" p={draw} width={3} dash="10 10" color="rgba(16,17,19,0.35)" />
        <text x={180} y={1330} fontFamily={T.mono} fontWeight={700} fontSize={26} fill="rgba(16,17,19,0.55)" letterSpacing={3}>
          WORK BAG · SIDE POCKET
        </text>
      </Sheet>
      <div style={{ position: "absolute", left: 70, top: 150, fontFamily: T.mono, fontWeight: 700, fontSize: 28, letterSpacing: 5, color: CAL, opacity: draw }}>
        UNIT 02 → CARRY
      </div>
      <div style={{ position: "absolute", left: 70, top: 200, fontFamily: T.disp, fontWeight: 700, fontSize: 124, color: GRAPHITE, lineHeight: 1.15, clipPath: `inset(0 ${100 - tag * 100}% 0 0)` }}>
        พกไปทำงาน
      </div>
    </AbsoluteFill>
  );
}
