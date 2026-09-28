import { Easing, interpolate, useCurrentFrame } from "remotion";
import { Draw, PlateSheet } from "./Frame";
import { clamp, hash, INK, LEAF, MOSS, RUST, SEPIA, T, WATER } from "./style";

/**
 * The three drawn specimen plates (full-frame shots between footage).
 * I  root lift — hair strands rise off a scalp section against a ruler.
 * II oil control — an oil bead rolls off a leaf and drops away.
 * III not sticky + washes out — a fingertip lifts clean, a rinse drop lands.
 */

const SCALP_Y = 1150;
const ROOTS = [250, 330, 410, 490, 570, 650, 730];

/** Hatched skin cross-section under a wavy scalp line. */
function ScalpSection({ p }: { p: number }) {
  const top = `M 190 ${SCALP_Y} ` + Array.from({ length: 14 }, (_, i) => `Q ${215 + i * 50} ${SCALP_Y - 10} ${240 + i * 50} ${SCALP_Y}`).join(" ");
  const hatch = Array.from({ length: 30 }, (_, i) => `M ${200 + i * 22} ${SCALP_Y + 14} l -34 70`).join(" ");
  return (
    <g>
      <Draw d={top} p={p} w={3} />
      <Draw d={`M 190 ${SCALP_Y + 96} L 890 ${SCALP_Y + 96}`} p={p} w={1.5} color={SEPIA} />
      <Draw d={hatch} p={p} w={1.2} color={SEPIA} />
      {ROOTS.map((x, i) => (
        <g key={x} opacity={p}>
          <path d={`M ${x} ${SCALP_Y} L ${x} ${SCALP_Y + 44}`} stroke={INK} strokeWidth={3} />
          <ellipse cx={x} cy={SCALP_Y + 54} rx={11} ry={15} fill={i % 2 ? MOSS : "none"} stroke={INK} strokeWidth={2.5} />
        </g>
      ))}
    </g>
  );
}

export function PlateRoot() {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [0, 8], [0, 1], clamp);
  const lift = interpolate(frame, [5, 17], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.6)) });
  const topY = SCALP_Y - (120 + lift * 520);
  const strands = ROOTS.map((x, i) => {
    const sway = (hash(i + 3) - 0.5) * 60;
    const flatEnd = [x + 260, SCALP_Y - 60];
    const upEnd = [x + sway, SCALP_Y - 560 - hash(i) * 60];
    const ex = flatEnd[0] + (upEnd[0] - flatEnd[0]) * lift;
    const ey = flatEnd[1] + (upEnd[1] - flatEnd[1]) * lift;
    const c1 = `${x + (1 - lift) * 30} ${SCALP_Y - 120}`;
    const c2 = `${ex - (1 - lift) * 160 + sway * 0.3} ${ey + (1 - lift) * 10 + lift * 200}`;
    return <Draw key={x} d={`M ${x} ${SCALP_Y} C ${c1} ${c2} ${ex} ${ey}`} p={draw} w={5 + (i % 3)} />;
  });
  const ticks = Array.from({ length: 23 }, (_, i) => {
    const y = SCALP_Y - i * 30;
    return <line key={i} x1={880} x2={i % 5 ? 902 : 920} y1={y} y2={y} stroke={SEPIA} strokeWidth={2} />;
  });
  return (
    <PlateSheet roman="I" latin="Radix erecta" thai="ผมตั้งขึ้นจากโคน" id="root">
      <ScalpSection p={draw} />
      <g opacity={draw}>
        <line x1={880} x2={880} y1={SCALP_Y} y2={SCALP_Y - 660} stroke={SEPIA} strokeWidth={2.5} />
        {ticks}
      </g>
      {strands}
      <g opacity={lift}>
        <path d={`M 820 ${SCALP_Y - 10} L 820 ${topY}`} stroke={RUST} strokeWidth={3} />
        <path d={`M 804 ${topY + 24} L 820 ${topY} L 836 ${topY + 24}`} fill="none" stroke={RUST} strokeWidth={3} />
        <text x={800} y={topY - 24} textAnchor="end" fontFamily={T.hand} fontWeight={700} fontSize={54} fill={RUST}>ยกจากโคน</text>
      </g>
      <g opacity={draw}>
        <line x1={250} y1={SCALP_Y + 70} x2={170} y2={SCALP_Y + 150} stroke={SEPIA} strokeWidth={1.5} />
        <text x={160} y={SCALP_Y + 180} fontFamily={T.type} fontSize={26} fill={SEPIA}>radix</text>
      </g>
    </PlateSheet>
  );
}

const LEAF_PATH =
  "M 210 540 C 420 420 820 640 880 1160 C 640 1110 260 900 210 540 Z";

export function PlateLeaf() {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [0, 9], [0, 1], clamp);
  const roll = interpolate(frame, [6, 19], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const fall = Math.max(0, frame - 19);
  // Bead path: along the midrib, then off the tip under gravity.
  const bx = 300 + roll * 560 + fall * 6;
  const by = 620 + roll * roll * 500 + roll * 20 + fall * fall * 3.2;
  const veins = [0.25, 0.42, 0.58, 0.74].map((t) => {
    const mx = 210 + t * 670;
    const my = 540 + t * 620;
    return `M ${mx} ${my} q -40 ${-120 + t * 40} ${60 - t * 30} ${-190 + t * 30} M ${mx} ${my} q -110 30 ${-150 + t * 20} 110`;
  });
  const trail = roll > 0 ? `M 300 620 Q ${300 + roll * 280} ${620 + roll * 150} ${Math.min(bx, 860)} ${Math.min(by, 1150)}` : "";
  return (
    <PlateSheet roman="II" latin="Sebum domitum" thai="คุมความมัน" id="leaf">
      <path d={LEAF_PATH} fill={MOSS} opacity={0.35 * draw} />
      <Draw d={LEAF_PATH} p={draw} w={4} color={LEAF} />
      <Draw d="M 210 540 C 480 700 720 900 880 1160" p={draw} w={3} color={LEAF} />
      <Draw d={veins.join(" ")} p={interpolate(frame, [4, 12], [0, 1], clamp)} w={1.8} color={LEAF} />
      <Draw d="M 210 540 C 170 500 150 470 120 430" p={draw} w={4} color={SEPIA} />
      {trail ? <path d={trail} fill="none" stroke={SEPIA} strokeWidth={2} strokeDasharray="4 14" strokeLinecap="round" /> : null}
      <g opacity={draw} transform={`translate(${bx} ${by})`}>
        <ellipse cx={0} cy={0} rx={34} ry={30} fill="#C9A24A" opacity={0.85} stroke={INK} strokeWidth={2.5} />
        <ellipse cx={-10} cy={-10} rx={10} ry={7} fill="#FFF6DA" />
      </g>
      <g opacity={interpolate(frame, [10, 16], [0, 1], clamp)}>
        <text x={560} y={450} fontFamily={T.hand} fontWeight={700} fontSize={58} fill={RUST}>ไม่เกาะ ไม่เยิ้ม</text>
        <path d="M 640 470 Q 600 540 560 600" fill="none" stroke={RUST} strokeWidth={2.5} />
        <text x={250} y={1080} fontFamily={T.type} fontSize={26} fill={SEPIA}>folium siccum</text>
      </g>
    </PlateSheet>
  );
}

/** A fingertip seen from the side, pointing down, nail on the right. */
function Finger({ y, p }: { y: number; p: number }) {
  const body = "M 470 150 L 470 520 C 470 600 610 600 610 520 L 610 150";
  const nail = "M 536 586 C 520 560 520 520 540 505 C 575 500 600 515 604 540 C 600 570 580 585 560 590";
  const creases = "M 480 400 q 60 14 124 0 M 486 420 q 56 10 112 0";
  return (
    <g transform={`translate(0 ${y})`}>
      <path d={body} fill="#EAD2B4" stroke="none" opacity={p} />
      <Draw d={body} p={p} w={4} />
      <Draw d={nail} p={p} w={2.5} color={SEPIA} />
      <Draw d={creases} p={p} w={1.6} color={SEPIA} />
    </g>
  );
}

export function PlateRinse() {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [0, 8], [0, 1], clamp);
  const press = interpolate(frame, [4, 10, 16], [-40, 175, 20], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const dropT = interpolate(frame, [13, 22], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const ring = interpolate(frame, [22, 30], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const tuft = [0, 1, 2, 3, 4].map((i) => {
    const x = 470 + i * 34;
    const bend = frame >= 8 && frame <= 12 ? 18 : 0;
    return <Draw key={i} d={`M ${x} 900 Q ${x - 10 + bend} 820 ${x + 6 - i * 4} 760`} p={draw} w={4} />;
  });
  const dy = 300 + dropT * 820;
  return (
    <PlateSheet roman="III" latin="Non glutinosa" thai="ไม่เหนียว · สระออกง่าย" id="rinse">
      <Draw d="M 380 900 q 160 16 320 0" p={draw} w={3} color={SEPIA} />
      {tuft}
      <clipPath id="sp06-finger-clip"><rect x={90} y={340} width={900} height={1000} /></clipPath>
      <g clipPath="url(#sp06-finger-clip)"><Finger y={press} p={draw} /></g>
      <g opacity={interpolate(frame, [14, 18], [0, 1], clamp)}>
        <text x={660} y={560} fontFamily={T.hand} fontWeight={700} fontSize={52} fill={RUST}>ไม่ติดมือ</text>
        <path d="M 650 580 L 690 620 L 760 540" fill="none" stroke={RUST} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      {dropT > 0 && dropT < 1 ? (
        <g transform={`translate(300 ${dy})`}>
          <path d="M 0 -60 C 20 -20 34 0 34 18 C 34 40 18 54 0 54 C -18 54 -34 40 -34 18 C -34 0 -20 -20 0 -60 Z" fill={WATER} opacity={0.7} stroke={INK} strokeWidth={2.5} />
          <path d="M -12 10 q -4 16 8 26" fill="none" stroke="#F4F8F8" strokeWidth={4} strokeLinecap="round" />
        </g>
      ) : null}
      <g opacity={draw}>
        <Draw d="M 150 1180 q 150 -14 300 0" p={draw} w={2.5} color={WATER} />
        {ring > 0
          ? [0, 1, 2].map((k) => (
              <ellipse key={k} cx={300} cy={1180} rx={40 + ring * (90 + k * 70)} ry={10 + ring * (18 + k * 12)} fill="none"
                stroke={WATER} strokeWidth={3} opacity={1 - ring * (0.3 + k * 0.2)} />
            ))
          : null}
        <text x={470} y={1200} fontFamily={T.hand} fontWeight={700} fontSize={52} fill={RUST} opacity={ring}>ล้างออกง่าย</text>
      </g>
    </PlateSheet>
  );
}
