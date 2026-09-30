/**
 * Hand-drawn doodle scenes for Usmile ad #1: the toothpick (a character with a face) does
 * what the letter says — pokes, pushes the crumb deeper, comes back every meal, hides in its box.
 * All scenes are 932x1012 SVG "drawings" shown inside the taped photo; frame 0 = scene start
 * (place inside a <Sequence>). A displacement filter re-seeds every 3 frames = pen "boil".
 */
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { INK, PEN_RED, T } from "./style";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const W = 932;
export const H = 1012;

const C = {
  card: "#FBF6E9",
  wood: "#E2B36B",
  woodDark: "#B98B4E",
  tooth: "#FFFDF6",
  gum: "#E88E8A",
  gumDark: "#C9615F",
  crumb: "#6B4A2B",
  crumbLite: "#A8794A",
  tear: "#7FC7E8",
  table: "#C99A62",
  plate: "#FFFFFF",
} as const;

/** 0 → 1 over [start, start+dur] frames. */
const prog = (f: number, start: number, dur: number) => interpolate(f, [start, start + dur], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });

type Mood = "sad" | "flat" | "happy" | "whistle" | "sleep" | "wink";

interface ToothpickProps {
  x: number;
  y: number;
  /** Degrees; the sharp tip is at (x,y) and the body extends along +x rotated by rot. */
  rot: number;
  mood?: Mood;
  /** Sweat/tear drop animation phase (frames). */
  t?: number;
  scale?: number;
  look?: "front" | "side";
}

/** The writer: a sharp-tipped stick with an upright face near its blunt end. */
export function Toothpick({ x, y, rot, mood = "flat", t = 0, scale = 1, look = "front" }: ToothpickProps) {
  const eyeDx = look === "side" ? 9 : 0;
  const drop = (t % 30) / 30;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${scale})`}>
      <path d="M0 0 L110 -34 L370 -34 L480 0 L370 34 L110 34 Z" fill={C.wood} stroke={INK} strokeWidth={7} strokeLinejoin="round" />
      <path d="M0 0 L40 -12 L40 12 Z M480 0 L440 -12 L440 12 Z" fill={C.woodDark} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      <path d="M140 -20 L200 -20 M290 22 L350 22" stroke={C.woodDark} strokeWidth={4} strokeLinecap="round" />
      <g transform={`translate(240 0) rotate(${-rot}) scale(1.2)`}>
        {mood === "sleep" ? (
          <>
            <path d="M-34 -8 Q-24 2 -14 -8 M14 -8 Q24 2 34 -8" stroke={INK} strokeWidth={5} fill="none" strokeLinecap="round" />
            <path d="M-14 16 Q0 26 14 16" stroke={INK} strokeWidth={5} fill="none" strokeLinecap="round" />
          </>
        ) : mood === "wink" ? (
          <>
            <circle cx={-24} cy={-8} r={7} fill={INK} />
            <path d="M14 -8 Q24 -16 34 -8" stroke={INK} strokeWidth={5} fill="none" strokeLinecap="round" />
            <path d="M-18 12 Q0 32 18 12" stroke={INK} strokeWidth={5} fill="none" strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx={-24 + eyeDx} cy={-8} r={7} fill={INK} />
            <circle cx={24 + eyeDx} cy={-8} r={7} fill={INK} />
            {mood === "sad" ? (
              <>
                <path d="M-40 -24 L-12 -18 M40 -24 L12 -18" stroke={INK} strokeWidth={5} strokeLinecap="round" />
                <path d="M-18 24 Q0 8 18 24" stroke={INK} strokeWidth={5} fill="none" strokeLinecap="round" />
                <ellipse cx={-24} cy={4 + drop * 22} rx={5} ry={8} fill={C.tear} stroke={INK} strokeWidth={2.5} opacity={1 - drop * 0.7} />
              </>
            ) : null}
            {mood === "flat" ? <path d="M-16 18 L16 18" stroke={INK} strokeWidth={5} strokeLinecap="round" /> : null}
            {mood === "happy" ? <path d="M-18 12 Q0 32 18 12" stroke={INK} strokeWidth={5} fill="none" strokeLinecap="round" /> : null}
            {mood === "whistle" ? <circle cx={0} cy={18} r={7} fill="none" stroke={INK} strokeWidth={5} /> : null}
          </>
        )}
      </g>
    </g>
  );
}

function Tooth({ x, y, w = 190, h = 300, wince = false }: { x: number; y: number; w?: number; h?: number; wince?: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d={`M0 60 Q0 0 60 0 L${w - 60} 0 Q${w} 0 ${w} 60 L${w} ${h} L0 ${h} Z`} fill={C.tooth} stroke={INK} strokeWidth={7} strokeLinejoin="round" />
      <path d={`M28 52 Q30 30 52 26`} stroke="#E8E2D2" strokeWidth={9} fill="none" strokeLinecap="round" />
      {wince ? (
        <>
          <path d={`M${w * 0.24} 96 L${w * 0.4} 112 L${w * 0.24} 128 M${w * 0.76} 96 L${w * 0.6} 112 L${w * 0.76} 128`} stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d={`M${w * 0.36} 166 Q${w * 0.5} 150 ${w * 0.64} 166`} stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" />
        </>
      ) : null}
    </g>
  );
}

/** Gum band whose top peaks between teeth (`gaps` = x centres of the gaps). */
function Gum({ gy, gaps, gapHalf = 40 }: { gy: number; gaps: number[]; gapHalf?: number }) {
  let d = `M0 ${H} L0 ${gy}`;
  for (const g of gaps) d += ` L${g - gapHalf} ${gy} Q${g} ${gy - 70} ${g + gapHalf} ${gy}`;
  d += ` L${W} ${gy} L${W} ${H} Z`;
  return <path d={d} fill={C.gum} stroke={INK} strokeWidth={7} strokeLinejoin="round" />;
}

function Crumb({ x, y, s = 1, rot = 0 }: { x: number; y: number; s?: number; rot?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <path d="M0 -26 Q34 -34 44 -6 Q54 26 20 36 Q-22 46 -40 12 Q-50 -20 0 -26 Z" fill={C.crumb} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      <circle cx={-8} cy={-4} r={6} fill={C.crumbLite} />
      <circle cx={16} cy={12} r={5} fill={C.crumbLite} />
      <circle cx={-14} cy={16} r={4} fill={C.crumbLite} />
    </g>
  );
}

function Ink({ text, x, y, size = 64, color = INK, rot = 0, opacity = 1, anchor = "start" }: { text: string; x: number; y: number; size?: number; color?: string; rot?: number; opacity?: number; anchor?: "start" | "middle" }) {
  return (
    <text x={x} y={y} fontFamily={T.ink} fontWeight={700} fontSize={size} fill={color} textAnchor={anchor} opacity={opacity} transform={`rotate(${rot} ${x} ${y})`}>
      {text}
    </text>
  );
}

/** Pen-drawn stroke that reveals over `dur` frames. */
function PenPath({ d, f, start, dur, color = PEN_RED, width = 12 }: { d: string; f: number; start: number; dur: number; color?: string; width?: number }) {
  const p = prog(f, start, dur);
  if (p <= 0) return null;
  return <path d={d} pathLength={1} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={1} strokeDashoffset={1 - p} />;
}

function Scene({ children }: { children: React.ReactNode }) {
  const frame = useCurrentFrame();
  const seed = Math.floor(frame / 3) % 6;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, background: C.card }}>
      <filter id="boil" x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency={0.018} numOctaves={2} seed={seed} result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale={7} />
      </filter>
      <g filter="url(#boil)">{children}</g>
    </svg>
  );
}

/** 1 · "ถึงมึง กูขอเลิก" — sad toothpick, broken heart, sealed letter. */
export function SceneBreakup() {
  const f = useCurrentFrame();
  const drop = interpolate(f, [0, 9, 13], [-420, 30, 0], clamp);
  return (
    <Scene>
      <g transform={`translate(0 ${drop})`}>
        <Toothpick x={130} y={800} rot={-36} mood="sad" t={f} scale={1.3} />
      </g>
      <path d="M690 250 C690 170 800 150 810 240 C822 150 930 170 924 250 C918 330 810 380 810 380 C810 380 690 330 690 250 Z" fill="#F6B9B3" stroke={INK} strokeWidth={7} strokeLinejoin="round" transform="translate(-150 20)" />
      <PenPath d="M660 190 L700 250 L650 290 L710 340 L676 396" f={f} start={12} dur={14} width={9} />
      <g transform="translate(60 860)">
        <rect width={250} height={150} fill="#fff" stroke={INK} strokeWidth={6} />
        <path d="M0 0 L125 90 L250 0" fill="none" stroke={INK} strokeWidth={6} />
      </g>
    </Scene>
  );
}

/** 2 · "สิบปีที่เราคบกัน กูทำให้มึงเจ็บไปกี่รอบ กูไม่กล้านับ" — pokes, years, tally. */
export function ScenePokes() {
  const f = useCurrentFrame();
  const year = f < 34 ? "1" : f < 68 ? "5" : "10";
  const cycle = f % 14;
  const poke = cycle < 7 ? cycle / 7 : (14 - cycle) / 7;
  const off = poke * 46;
  const talk = ["ซี๊ด!", "โอ๊ย!", "เจ็บ!"][Math.floor(f / 14) % 3];
  const tally = Math.min(40, Math.floor(f * 0.55 + Math.max(0, f - 60) * 0.9));
  const ang = (-55 * Math.PI) / 180;
  const tip = { x: 446 + off * Math.cos(ang + Math.PI), y: 790 + off * Math.sin(ang + Math.PI) * -1 };
  return (
    <Scene>
      <Tooth x={250} y={470} wince />
      <Tooth x={470} y={470} />
      <Toothpick x={tip.x} y={tip.y} rot={-62} mood="sad" t={f} scale={1.25} />
      <Gum gy={790} gaps={[460]} />
      <Ink text={`ปีที่ ${year}`} x={60} y={150} size={92} />
      {cycle < 8 ? <Ink text={talk} x={110} y={420} size={78} color={PEN_RED} rot={-8} /> : null}
      <g transform="translate(620 90)">
        {Array.from({ length: tally }, (_, i) => {
          const gi = Math.floor(i / 5);
          const k = i % 5;
          const gx = (gi % 4) * 84;
          const gy = Math.floor(gi / 4) * 90;
          return k < 4 ? <line key={i} x1={gx + k * 15} y1={gy} x2={gx + k * 15} y2={gy + 66} stroke={INK} strokeWidth={6} strokeLinecap="round" /> : <line key={i} x1={gx - 8} y1={gy + 56} x2={gx + 62} y2={gy + 8} stroke={INK} strokeWidth={6} strokeLinecap="round" />;
        })}
      </g>
      <PenPath d="M600 90 C700 150 800 140 910 250 M600 250 C720 170 820 220 910 100" f={f} start={86} dur={12} width={10} />
    </Scene>
  );
}

/** 3 · "กูรู้ตัวแล้วว่ากูไม่ใช่คนที่ใช่" — the couple that doesn't fit, heart crossed out. */
export function SceneNotTheOne() {
  const f = useCurrentFrame();
  return (
    <Scene>
      <Tooth x={560} y={430} w={280} h={430} />
      <Gum gy={860} gaps={[]} />
      <Toothpick x={110} y={830} rot={-74} mood="sad" t={f} scale={1.05} />
      <path d="M430 300 C430 220 540 200 550 290 C562 200 670 220 664 300 C658 380 550 430 550 430 C550 430 430 380 430 300 Z" fill="#F6B9B3" stroke={INK} strokeWidth={7} strokeLinejoin="round" transform="translate(-200 -20)" />
      <PenPath d="M170 190 L400 430 M400 190 L170 430" f={f} start={18} dur={10} width={16} />
      <Ink text="?" x={470} y={190} size={150} color={INK} rot={8} opacity={prog(f, 34, 8)} />
    </Scene>
  );
}

/** 4 · "กูไม่เคยเอาเศษออกจริงๆ / กูแค่ดันมันให้ลึกกว่าเดิม" — pokes, crumb stays, then pushed deeper. */
export function ScenePushDeeper() {
  const f = useCurrentFrame();
  const pushAt = 47;
  const cycle = f % 12;
  const poke = f < pushAt ? (cycle < 6 ? cycle / 6 : (12 - cycle) / 6) : 0;
  const push = interpolate(f, [pushAt, pushAt + 20], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const crumbY = 650 + push * 150 + (f < pushAt ? Math.sin(f * 1.4) * 4 * poke : 0);
  const tipY = 560 + poke * 40 + push * 150;
  const tipX = 528 + poke * 26 - push * 0;
  return (
    <Scene>
      <Tooth x={190} y={420} w={220} h={420} />
      <Tooth x={530} y={420} w={220} h={420} />
      <Crumb x={470} y={crumbY} s={1.05} rot={f * 0.2} />
      <Toothpick x={tipX + 20} y={tipY - 30} rot={-58} mood={f < pushAt ? "flat" : "sad"} t={f} scale={1.2} />
      <Gum gy={800} gaps={[470]} gapHalf={64} />
      {f < pushAt ? <Ink text="ออกมั้ย…" x={60} y={330} size={70} rot={-6} opacity={0.85} /> : null}
      <PenPath d="M470 330 L470 470 M430 430 L470 480 L510 430" f={f} start={pushAt + 14} dur={10} width={14} />
      <Ink text="ลึกกว่าเดิม" x={310} y={250} size={84} color={PEN_RED} rot={-4} opacity={prog(f, pushAt + 20, 8)} />
    </Scene>
  );
}

function Bowl() {
  return (
    <g>
      <path d="M-110 -10 Q-110 90 0 90 Q110 90 110 -10 Z" fill="#fff" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
      <path d="M-100 -10 Q-70 -70 0 -70 Q70 -70 100 -10 Z" fill="#fff" stroke={INK} strokeWidth={6} />
      <path d="M-30 -100 Q-46 -140 -24 -170 M20 -100 Q36 -140 12 -176" fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />
    </g>
  );
}
function Noodles() {
  return (
    <g>
      <path d="M-120 -6 Q-120 100 0 100 Q120 100 120 -6 Z" fill="#fff" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
      <path d="M-100 -6 C-70 -60 -40 20 -10 -40 C20 -90 50 10 100 -20" fill="none" stroke="#E7C463" strokeWidth={14} strokeLinecap="round" />
      <path d="M-90 20 C-50 -30 -20 40 30 0 C60 -20 80 30 100 10" fill="none" stroke="#E7C463" strokeWidth={14} strokeLinecap="round" />
      <path d="M-60 -20 L 90 -130" stroke={INK} strokeWidth={7} strokeLinecap="round" />
    </g>
  );
}
function Skewer() {
  return (
    <g transform="rotate(-24)">
      <path d="M-170 0 L170 0" stroke={C.woodDark} strokeWidth={10} strokeLinecap="round" />
      {[-90, -20, 50].map((x) => (
        <rect key={x} x={x} y={-30} width={54} height={60} rx={14} fill="#B5643C" stroke={INK} strokeWidth={6} />
      ))}
    </g>
  );
}

/** 5 · "แต่มึงก็ยังกลับมาหากูทุกมื้อ" — meals cycle, the toothpick pops out of its cup each time. */
export function SceneEveryMeal() {
  const f = useCurrentFrame();
  const idx = Math.floor(f / 18) % 3;
  const local = f % 18;
  const pop = interpolate(local, [0, 5, 10], [0, 1, 0.8], clamp);
  const n = Math.round(interpolate(f, [0, 52], [1, 3650], { ...clamp, easing: Easing.in(Easing.cubic) }));
  return (
    <Scene>
      <g transform="translate(350 470)">{idx === 0 ? <Bowl /> : idx === 1 ? <Noodles /> : <Skewer />}</g>
      <g transform="translate(770 620)">
        <g transform={`translate(0 ${120 - pop * 80})`}>
          <Toothpick x={0} y={0} rot={-90} mood="happy" t={f} scale={0.62} />
        </g>
        <path d="M-90 -30 L-70 150 Q0 170 70 150 L90 -30 Z" fill="#8FC9B8" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
      </g>
      <Ink text={`มื้อที่ ${n.toLocaleString("en-US")}`} x={60} y={130} size={90} />
      <Ink text="ที่นี่ๆ!" x={640} y={330} size={70} color={PEN_RED} rot={6} opacity={pop} />
    </Scene>
  );
}

/** 6 · "กูเลยหาคนใหม่ให้มึงแล้ว" — the toothpick presents a mystery gift box that pops open. */
export function SceneMatchmaker() {
  const f = useCurrentFrame();
  const shake = f < 26 ? Math.sin(f * 1.8) * 6 : 0;
  const lid = interpolate(f, [28, 38], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
  return (
    <Scene>
      <Toothpick x={70} y={900} rot={-56} mood="happy" t={f} scale={1.15} />
      <g transform={`translate(${560 + shake} 610)`}>
        <rect x={-190} y={-40} width={380} height={320} fill="#7FC7E8" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
        <rect x={-30} y={-40} width={60} height={320} fill="#F7D64A" stroke={INK} strokeWidth={6} />
        <g transform={`translate(0 ${-lid * 240}) rotate(${lid * 18} -190 -40)`}>
          <rect x={-210} y={-110} width={420} height={80} fill="#5DB2DA" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
          <rect x={-30} y={-110} width={60} height={80} fill="#F7D64A" stroke={INK} strokeWidth={6} />
        </g>
        <Ink text="?" x={0} y={200} size={190} anchor="middle" opacity={1 - lid} />
      </g>
      <Ink text="ตาม่ะ!" x={70} y={260} size={92} color={PEN_RED} rot={-6} opacity={prog(f, 8, 8)} />
    </Scene>
  );
}

/** 7 · "ซื่อสัตย์กว่ากูเยอะ" — the toothpick looks away, whistling and sweating. */
export function SceneWhistle() {
  const f = useCurrentFrame();
  const sweat = (f % 20) / 20;
  return (
    <Scene>
      <Toothpick x={90} y={840} rot={-44} mood="whistle" look="side" t={f} scale={1.25} />
      <ellipse cx={520} cy={300 + sweat * 60} rx={16} ry={26} fill={C.tear} stroke={INK} strokeWidth={5} opacity={1 - sweat * 0.6} />
      <Ink text="♪" x={640} y={330 - Math.sin(f / 4) * 14} size={120} color={INK} rot={-10} />
      <Ink text="♫" x={740} y={230 + Math.sin(f / 4) * 14} size={100} color={INK} rot={8} />
    </Scene>
  );
}

/** 8 · "ส่วนกู ไม่หายไปไหน… นอนอยู่ในกล่องข้างโต๊ะกินข้าว" — waves, then dozes off in its box. */
export function SceneInTheBox() {
  const f = useCurrentFrame();
  const asleep = f >= 56;
  const bob = Math.sin(f / 5) * (asleep ? 3 : 10);
  const zPhase = (f % 40) / 40;
  return (
    <Scene>
      <rect x={0} y={760} width={W} height={252} fill={C.table} stroke={INK} strokeWidth={7} />
      <path d="M0 830 H932 M0 900 H932" stroke="#A97A46" strokeWidth={4} />
      <ellipse cx={230} cy={770} rx={190} ry={44} fill={C.plate} stroke={INK} strokeWidth={7} />
      <path d="M90 762 Q230 660 370 762" fill="#F3E9C6" stroke={INK} strokeWidth={6} />
      <path d="M150 700 L330 640 M170 720 L350 660" stroke={INK} strokeWidth={6} strokeLinecap="round" />
      <g transform="translate(640 500)">
        <g transform={`translate(0 ${bob})`}>
          <Toothpick x={0} y={390} rot={-90} mood={asleep ? "sleep" : "wink"} t={f} scale={0.78} />
        </g>
        <path d="M-130 240 L-150 500 L150 500 L130 240 Z" fill="#E9D9B5" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
        <path d="M-130 240 L130 240" stroke={INK} strokeWidth={8} />
        <Ink text="ไม้จิ้มฟัน" x={0} y={400} size={44} anchor="middle" opacity={0.7} />
      </g>
      {asleep ? (
        <g opacity={1 - zPhase}>
          <Ink text="z" x={760} y={330 - zPhase * 90} size={70} rot={8} />
          <Ink text="Z" x={820} y={260 - zPhase * 90} size={96} rot={8} />
        </g>
      ) : (
        <Ink text="ไม่ไปไหน~" x={560} y={190} size={68} color={PEN_RED} rot={-6} opacity={prog(f, 4, 8)} />
      )}
    </Scene>
  );
}
