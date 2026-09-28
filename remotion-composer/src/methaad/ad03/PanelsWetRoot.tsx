import { Easing, interpolate, useCurrentFrame } from "remotion";
import { clamp, useIn } from "../hooks/kit";
import { Cross, LINE_W, ManualPage, SubPanel, Tick } from "./ManualKit";
import { hash, INK, SIGNAL, T } from "./style";

/** Manual pages 1 and 2: wet strands clumping, and the strand cross-section (tip ✗ → root ✓). */

/** Closed blob through `n` jittered points around (cx, cy). */
function blob(cx: number, cy: number, r: number, seed: number, n = 8) {
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    const rr = r * (0.72 + hash(seed * 31 + i) * 0.5);
    return [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr] as const;
  });
  const mid = (i: number) => {
    const [ax, ay] = pts[i % n];
    const [bx, by] = pts[(i + 1) % n];
    return [(ax + bx) / 2, (ay + by) / 2] as const;
  };
  let d = `M ${mid(0)[0]} ${mid(0)[1]}`;
  for (let i = 1; i <= n; i++) {
    const [px, py] = pts[i % n];
    const [mx, my] = mid(i);
    d += ` Q ${px} ${py} ${mx} ${my}`;
  }
  return `${d} Z`;
}

const WET_STRANDS = [210, 340, 470, 600, 730, 860];

/** Page 1 — powder rains on dripping strands, then lumps up on a close-up; ✗. */
export function PanelWet() {
  const frame = useCurrentFrame();
  const arrow = useIn(9, 6);
  const lumps = interpolate(frame, [13, 26], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
  const label = useIn(20, 6);
  const cross = interpolate(frame, [28, 37], [0, 1], clamp);
  const sway = Math.sin(frame / 6) * 6;
  return (
    <ManualPage step={1} title="ข้อ 1" sub="แป้ง + ผมเปียก">
      <SubPanel x={70} y={360} w={940} h={620} n={1}>
        {WET_STRANDS.map((x, k) => {
          const end = 830 + (k % 3) * 40;
          const bend = (k % 2 ? 30 : -30) + sway;
          const dripT = (frame + k * 7) % 24;
          return (
            <g key={x}>
              <path d={`M ${x} 370 C ${x + bend} 520, ${x - bend} 680, ${x + 8} ${end}`} stroke={INK} strokeWidth={LINE_W + 3} fill="none" strokeLinecap="round" />
              <path d={`M ${x + 22} 370 C ${x + 22 + bend} 520, ${x + 22 - bend} 680, ${x + 14} ${end - 30}`} stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" />
              <path
                d={`M ${x + 8} ${end + 6 + dripT * 2.4} q 16 22 0 34 q -16 -12 0 -34 Z`}
                fill="#8FD8FF"
                stroke={INK}
                strokeWidth={4}
                opacity={interpolate(dripT, [0, 3, 18, 24], [0, 1, 1, 0])}
              />
            </g>
          );
        })}
        {Array.from({ length: 34 }, (_, i) => {
          const x = 180 + hash(i) * 720;
          const start = (i % 9) * 1.3;
          const y = interpolate(frame, [start, start + 12], [380, 520 + hash(i + 50) * 360], clamp);
          return <circle key={i} cx={x} cy={y} r={6 + (i % 3) * 2} fill="#FFFFFF" stroke={INK} strokeWidth={3} opacity={frame >= start ? 1 : 0} />;
        })}
      </SubPanel>
      <g opacity={arrow}>
        <path d="M 540 990 V 1070" stroke={INK} strokeWidth={14} />
        <path d="M 500 1060 L 540 1110 L 580 1060 Z" fill={INK} />
      </g>
      <SubPanel x={70} y={1120} w={940} h={700} n={2} at={10}>
        {[330, 540, 750].map((x, k) => (
          <g key={x}>
            <path d={`M ${x - 40} 1130 C ${x - 10} 1400, ${x - 70} 1600, ${x - 20} 1810`} stroke={INK} strokeWidth={LINE_W + 4} fill="none" />
            <path d={`M ${x + 40} 1130 C ${x + 70} 1400, ${x + 10} 1600, ${x + 60} 1810`} stroke={INK} strokeWidth={LINE_W + 4} fill="none" />
            {[0, 1, 2].map((j) => {
              const cy = 1280 + j * 170 + (k % 2) * 60;
              const r = (46 + hash(k * 3 + j) * 30) * lumps;
              return r > 1 ? (
                <path key={j} d={blob(x + (j % 2 ? 18 : -14), cy, r, k * 5 + j)} fill="#EDEBE4" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
              ) : null;
            })}
          </g>
        ))}
        <g opacity={label}>
          <rect x={560} y={1690} width={420} height={104} fill={INK} />
          <text x={770} y={1767} textAnchor="middle" fontFamily={T.manual} fontWeight={700} fontSize={72} fill="#FFFFFF">
            เป็นก้อน
          </text>
        </g>
        <circle cx={870} cy={1260} r={100} fill="#FFFFFF" stroke={SIGNAL} strokeWidth={10} opacity={cross > 0 ? 1 : 0} />
        <Cross cx={870} cy={1260} r={52} p={cross} width={22} />
      </SubPanel>
    </ManualPage>
  );
}

/** Strand path from the follicle (540,1500) to a tip that lifts from a flop to upright. */
function strand(rootX: number, lift: number, lean: number) {
  const tipX = interpolate(lift, [0, 1], [rootX + 300 * lean, rootX + 30 * lean]);
  const tipY = interpolate(lift, [0, 1], [760, 520]);
  const c1y = interpolate(lift, [0, 1], [1100, 1150]);
  return { d: `M ${rootX} 1500 C ${rootX} ${c1y}, ${tipX - 120 * lean * (1 - lift)} ${tipY - 60}, ${tipX} ${tipY}`, tipX, tipY };
}

/** Page 2 — cross-section: powder parked on the tip ✗, an arrow drags it to the root ✓, the strand stands up. */
export function PanelRoot() {
  const frame = useCurrentFrame();
  const tipDots = useIn(2, 8);
  const cross = interpolate(frame, [8, 16], [0, 1], clamp);
  const arrow = interpolate(frame, [15, 27], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const rootDots = useIn(26, 6);
  const tick = interpolate(frame, [31, 38], [0, 1], clamp);
  const lift = interpolate(frame, [31, 44], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.6)) });
  const main = strand(540, lift, 1);
  const side = [strand(410, lift, 0.8), strand(680, lift, 1.1)];
  const tipFade = 1 - interpolate(frame, [22, 30], [0, 1], clamp);
  return (
    <ManualPage step={2} title="ข้อ 2" sub="โรยที่โคน ไม่ใช่ปลาย" subAt={28}>
      <SubPanel x={70} y={360} w={940} h={1460} n={1}>
        {/* scalp cross-section */}
        <path d="M 75 1500 C 300 1480, 780 1520, 1005 1495 V 1815 H 75 Z" fill="#F4E3D3" />
        <path d="M 75 1500 C 300 1480, 780 1520, 1005 1495" stroke={INK} strokeWidth={LINE_W} fill="none" />
        <path d="M 75 1600 C 300 1590, 780 1615, 1005 1595" stroke={INK} strokeWidth={3} strokeDasharray="14 10" fill="none" />
        {[410, 540, 680].map((x) => (
          <path key={x} d={`M ${x - 22} 1500 C ${x - 26} 1600, ${x - 40} 1690, ${x} 1700 C ${x + 40} 1690, ${x + 26} 1600, ${x + 22} 1500`} fill="#FFFFFF" stroke={INK} strokeWidth={5} />
        ))}
        {side.map((s, k) => (
          <path key={k} d={s.d} stroke={INK} strokeWidth={12} fill="none" strokeLinecap="round" opacity={0.55} />
        ))}
        <path d={main.d} stroke={INK} strokeWidth={34} fill="none" strokeLinecap="round" />
        <path d={main.d} stroke="#FFFFFF" strokeWidth={18} fill="none" strokeLinecap="round" />
        {/* powder on tip (wrong) */}
        <g opacity={tipDots * tipFade}>
          {Array.from({ length: 12 }, (_, i) => (
            <circle key={i} cx={main.tipX - 40 + hash(i + 3) * 90} cy={main.tipY - 30 + hash(i + 9) * 70} r={11} fill="#FFFFFF" stroke={INK} strokeWidth={4} />
          ))}
        </g>
        <text x={880} y={700} textAnchor="middle" fontFamily={T.manual} fontWeight={700} fontSize={56} fill={INK} opacity={tipFade}>
          ปลาย
        </text>
        <Cross cx={880} cy={560} r={48} p={cross * tipFade + (1 - tipFade) * 0} width={20} />
        {/* the move */}
        <path
          d="M 720 770 C 400 820, 190 1080, 470 1440"
          stroke={SIGNAL}
          strokeWidth={14}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={1000}
          strokeDashoffset={1000 * (1 - arrow)}
        />
        <path d="M 430 1400 L 490 1462 L 500 1375 Z" fill={SIGNAL} opacity={arrow >= 1 ? 1 : 0} />
        {/* powder at root (right) */}
        <g opacity={rootDots}>
          {Array.from({ length: 10 }, (_, i) => (
            <circle key={i} cx={500 + hash(i + 21) * 90} cy={1440 + hash(i + 40) * 50} r={11} fill="#FFFFFF" stroke={INK} strokeWidth={4} />
          ))}
        </g>
        <path d="M 610 1470 L 760 1400" stroke={INK} strokeWidth={4} />
        <text x={775} y={1415} fontFamily={T.manual} fontWeight={700} fontSize={64} fill={INK}>
          โคน
        </text>
        <circle cx={880} cy={1250} r={92} fill="#FFFFFF" stroke="#1C9A57" strokeWidth={10} opacity={tick > 0 ? 1 : 0} />
        <Tick cx={880} cy={1255} r={50} p={tick} width={22} />
      </SubPanel>
    </ManualPage>
  );
}
