import { Easing, interpolate, useCurrentFrame } from "remotion";
import { clamp } from "../hooks/kit";
import { Cross, LINE_W, ManualPage, SubPanel, Tick } from "./ManualKit";
import { about, hash, INK, OK, SIGNAL, T } from "./style";

/**
 * Manual page 3 — dose. Panel 1: an upturned bottle dumps a growing heap ✗.
 * Panel 2: a shaker taps on "สองสามที" (shot-local 28/36/44); each tap drops
 * a pinch and fills a counter dot, then ✓.
 */

export const TAPS = [28, 36, 44] as const;

/** Shaker bottle in local coords (cap at y=0, body down to y=300). */
function Shaker({ holes = true }: { holes?: boolean }) {
  return (
    <g>
      <rect x={-78} y={70} width={156} height={250} rx={26} fill="#FFFFFF" stroke={INK} strokeWidth={LINE_W} />
      <rect x={-78} y={150} width={156} height={90} fill="none" stroke={INK} strokeWidth={4} />
      <line x1={-50} x2={50} y1={195} y2={195} stroke={INK} strokeWidth={4} />
      <rect x={-64} y={0} width={128} height={70} rx={10} fill="#FFFFFF" stroke={INK} strokeWidth={LINE_W} />
      {holes ? [-34, -12, 12, 34].map((x) => <circle key={x} cx={x} cy={18} r={6} fill={INK} />) : null}
    </g>
  );
}

function Heap({ k }: { k: number }) {
  const w = 260 * k;
  const h = 170 * k;
  const cx = 600;
  const base = 900;
  if (k <= 0) return null;
  return (
    <g>
      <path d={`M ${cx - w} ${base} C ${cx - w * 0.5} ${base - h * 0.2}, ${cx - w * 0.3} ${base - h}, ${cx} ${base - h} C ${cx + w * 0.3} ${base - h}, ${cx + w * 0.5} ${base - h * 0.2}, ${cx + w} ${base} Z`} fill="#F2F0EA" stroke={INK} strokeWidth={LINE_W} strokeLinejoin="round" />
      {Array.from({ length: 14 }, (_, i) => (
        <circle key={i} cx={cx - w * 0.6 + hash(i) * w * 1.2} cy={base - 20 - hash(i + 7) * h * 0.7} r={5} fill={INK} opacity={0.35} />
      ))}
    </g>
  );
}

export function PanelTaps() {
  const frame = useCurrentFrame();
  const heap = interpolate(frame, [2, 22], [0.1, 1], { ...clamp, easing: Easing.out(Easing.quad) });
  const pour = frame < 22;
  const crossA = interpolate(frame, [14, 22], [0, 1], clamp);
  const bob = TAPS.reduce((acc, t) => acc + (frame >= t ? 34 * Math.exp(-(frame - t) / 2.2) * Math.min(1, (frame - t + 1) / 1.5) : 0), 0);
  const count = TAPS.filter((t) => frame >= t).length;
  const tick = interpolate(frame, [50, 58], [0, 1], clamp);
  return (
    <ManualPage step={3} title="ข้อ 3" sub="นิดเดียวพอ" subAt={2}>
      <SubPanel x={70} y={360} w={940} h={590} n={1}>
        <g transform={`translate(300 740) rotate(${150 + Math.sin(frame / 2) * 3})`}>
          <Shaker holes={false} />
        </g>
        {pour
          ? Array.from({ length: 16 }, (_, i) => {
              const ph = (frame * 0.12 + i / 16) % 1;
              return <circle key={i} cx={330 + ph * 190 + hash(i) * 30} cy={770 + ph * 110} r={7} fill="#FFFFFF" stroke={INK} strokeWidth={3} />;
            })
          : null}
        <Heap k={heap} />
        <rect x={800} y={420} width={160} height={160} fill="#FFFFFF" stroke={INK} strokeWidth={6} />
        <Cross cx={880} cy={500} r={50} p={crossA} width={20} />
      </SubPanel>
      <SubPanel x={70} y={990} w={940} h={830} n={2} at={6}>
        {/* scalp curve with a parting */}
        <path d="M 110 1720 C 250 1560, 610 1560, 760 1720" stroke={INK} strokeWidth={LINE_W} fill="none" />
        {Array.from({ length: 9 }, (_, i) => {
          const x = 170 + i * 62;
          const y = 1720 - Math.sin(((x - 110) / 650) * Math.PI) * 150;
          return <path key={i} d={`M ${x} ${y} q ${-10 + (i % 3) * 10} -70 ${14} -120`} stroke={INK} strokeWidth={5} fill="none" strokeLinecap="round" />;
        })}
        <g transform={`translate(${430} ${1400 + bob}) ${about(0, 0, "rotate(160)")}`}>
          <Shaker />
        </g>
        {TAPS.map((t, k) => {
          const dt = frame - t;
          if (dt < 0) return null;
          return Array.from({ length: 4 }, (_, i) => {
            const y = Math.min(1430 + dt * 20 + i * 8, 1585 + (i % 2) * 14);
            return <circle key={`${k}-${i}`} cx={410 + (i - 1.5) * 16 + k * 22} cy={y} r={8} fill="#FFFFFF" stroke={INK} strokeWidth={3} />;
          });
        })}
        {/* tap counter */}
        {[0, 1, 2].map((i) => {
          const on = count > i;
          const pop = on ? interpolate(frame - TAPS[i], [0, 4], [1.4, 1], clamp) : 1;
          return (
            <g key={i} transform={about(740 + i * 90, 1150, `scale(${pop})`)}>
              <circle cx={740 + i * 90} cy={1150} r={30} fill={on ? INK : "#FFFFFF"} stroke={INK} strokeWidth={6} />
            </g>
          );
        })}
        <text x={830} y={1275} textAnchor="middle" fontFamily={T.manual} fontWeight={700} fontSize={84} fill={count >= 2 ? INK : "#BDB9AE"}>
          2–3 ที
        </text>
        <rect x={800} y={1500} width={160} height={160} fill="#FFFFFF" stroke={INK} strokeWidth={6} />
        <Tick cx={880} cy={1585} r={52} p={tick} width={20} color={OK} />
        <text x={880} y={1450} textAnchor="middle" fontFamily={T.manual} fontWeight={600} fontSize={40} fill={SIGNAL} opacity={count >= 3 ? 1 : 0}>
          พอแล้ว
        </text>
      </SubPanel>
    </ManualPage>
  );
}
