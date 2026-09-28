import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Canvas, clamp, usePop } from "../hooks/kit";
import { about, AMBER, INK, OS_BLUE, OS_GREY, SIGNAL, T } from "./style";

/**
 * Opener hook: retro OS dialogs. An install box fills its progress bar on
 * "ซื้อแป้งเซ็ตผมมาแล้ว", a warning cascades into an error trail on
 * "หัวยังแบน?", and a critical box slams in and shakes on "มึงใช้ผิด".
 * Everything stays above y≈740 (the flat-hair guy's mouth sits at ~810).
 */

const HI = "#FFFFFF";
const LO = "#5E5B55";

interface WinProps {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  bar: [string, string];
  children?: React.ReactNode;
}

/** Bevelled window chrome with a hard offset shadow and a drawn close box. */
function Win({ x, y, w, h, title, bar, children }: WinProps) {
  const gid = `bar-${x}-${y}-${bar[0].slice(1)}`;
  return (
    <g>
      <defs>
        <linearGradient id={gid} x1={0} x2={1}>
          <stop offset={0} stopColor={bar[0]} />
          <stop offset={1} stopColor={bar[1]} />
        </linearGradient>
      </defs>
      <rect x={x + 16} y={y + 18} width={w} height={h} fill="rgba(0,0,0,0.55)" />
      <rect x={x} y={y} width={w} height={h} fill={OS_GREY} stroke={INK} strokeWidth={3} />
      <path d={`M ${x + 4} ${y + h - 4} V ${y + 4} H ${x + w - 4}`} stroke={HI} strokeWidth={5} fill="none" />
      <path d={`M ${x + 4} ${y + h - 4} H ${x + w - 4} V ${y + 4}`} stroke={LO} strokeWidth={5} fill="none" />
      <rect x={x + 10} y={y + 10} width={w - 20} height={58} fill={`url(#${gid})`} />
      <text x={x + 30} y={y + 51} fontFamily={T.ui} fontWeight={700} fontSize={34} fill={HI}>
        {title}
      </text>
      <Bevel x={x + w - 64} y={y + 18} w={42} h={42} />
      <path
        d={`M ${x + w - 54} ${y + 28} l 22 22 M ${x + w - 32} ${y + 28} l -22 22`}
        stroke={INK}
        strokeWidth={6}
        strokeLinecap="square"
      />
      {children}
    </g>
  );
}

function Bevel({ x, y, w, h, pressed = false }: { x: number; y: number; w: number; h: number; pressed?: boolean }) {
  const a = pressed ? LO : HI;
  const b = pressed ? HI : LO;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={OS_GREY} stroke={INK} strokeWidth={2} />
      <path d={`M ${x + 3} ${y + h - 3} V ${y + 3} H ${x + w - 3}`} stroke={a} strokeWidth={4} fill="none" />
      <path d={`M ${x + 3} ${y + h - 3} H ${x + w - 3} V ${y + 3}`} stroke={b} strokeWidth={4} fill="none" />
    </g>
  );
}

function Button({ x, y, label, focus = false, pressed = false }: { x: number; y: number; label: string; focus?: boolean; pressed?: boolean }) {
  return (
    <g>
      <Bevel x={x} y={y} w={190} h={70} pressed={pressed} />
      {focus ? (
        <rect x={x + 12} y={y + 11} width={166} height={48} fill="none" stroke={INK} strokeWidth={2} strokeDasharray="4 4" />
      ) : null}
      <text x={x + 95 + (pressed ? 2 : 0)} y={y + 47 + (pressed ? 2 : 0)} textAnchor="middle" fontFamily={T.ui} fontWeight={700} fontSize={34} fill={INK}>
        {label}
      </text>
    </g>
  );
}

/** Install box: segmented progress bar fills, then the status flips to done. */
function InstallBox({ at }: { at: number }) {
  const frame = useCurrentFrame();
  const pop = usePop(at, 13);
  const fill = interpolate(frame, [at + 4, at + 30], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const blocks = Math.floor(fill * 16);
  const done = fill >= 1;
  const x = 70;
  const y = 110;
  return (
    <g transform={about(x + 340, y + 125, `scale(${pop})`)} opacity={Math.min(1, pop * 2)}>
      <Win x={x} y={y} w={680} h={260} title="ติดตั้งโปรแกรม" bar={[OS_BLUE, "#4F6BD8"]}>
        <text x={x + 36} y={y + 130} fontFamily={T.ui} fontWeight={500} fontSize={40} fill={INK}>
          {done ? "แป้งเซ็ตผม  ติดตั้งเสร็จ" : "กำลังติดตั้ง แป้งเซ็ตผม..."}
        </text>
        <rect x={x + 36} y={y + 160} width={608} height={60} fill="#FFFFFF" stroke={LO} strokeWidth={4} />
        {Array.from({ length: blocks }, (_, i) => (
          <rect key={i} x={x + 46 + i * 37.5} y={y + 170} width={30} height={40} fill={OS_BLUE} />
        ))}
      </Win>
    </g>
  );
}

/** Amber warning triangle with a stroked "!" — drawn, not a glyph. */
function WarnIcon({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g>
      <path d={`M ${cx} ${cy - 56} L ${cx + 62} ${cy + 50} L ${cx - 62} ${cy + 50} Z`} fill={AMBER} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      <line x1={cx} y1={cy - 22} x2={cx} y2={cy + 14} stroke={INK} strokeWidth={12} strokeLinecap="round" />
      <circle cx={cx} cy={cy + 34} r={7} fill={INK} />
    </g>
  );
}

function WarnBox({ x, y }: { x: number; y: number }) {
  return (
    <Win x={x} y={y} w={780} h={290} title="คำเตือน" bar={["#6B6B6B", "#A9A9A9"]}>
      <WarnIcon cx={x + 100} cy={y + 150} />
      <text x={x + 190} y={y + 190} fontFamily={T.ui} fontWeight={700} fontSize={100} fill={INK}>
        หัวยังแบน?
      </text>
    </Win>
  );
}

const TRAIL = [0, 4, 8, 12, 16] as const;

/** Classic runaway-error trail: the warning re-spawns down-right, each copy on top. */
function WarnTrail({ at }: { at: number }) {
  const frame = useCurrentFrame();
  const first = usePop(at, 12);
  return (
    <g>
      {TRAIL.map((d, k) => {
        if (frame < at + d) return null;
        const x = 150 + k * 24;
        const y = 250 + k * 20;
        return k === 0 ? (
          <g key={k} transform={about(x + 390, y + 145, `scale(${first})`)}>
            <WarnBox x={x} y={y} />
          </g>
        ) : (
          <WarnBox key={k} x={x} y={y} />
        );
      })}
    </g>
  );
}

/** Red-circle X icon, stroked. */
function StopIcon({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={64} fill={SIGNAL} stroke={INK} strokeWidth={6} />
      <path d={`M ${cx - 28} ${cy - 28} L ${cx + 28} ${cy + 28} M ${cx + 28} ${cy - 28} L ${cx - 28} ${cy + 28}`} stroke="#FFFFFF" strokeWidth={16} strokeLinecap="round" />
    </g>
  );
}

/** Critical box: slams in oversized, then shakes; re-kicks on the last syllable. */
function CriticalBox({ at }: { at: number }) {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const t = frame - at;
  const slam = interpolate(t, [0, 4], [1.35, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const kick = (from: number, amp: number) =>
    t >= from ? amp * Math.exp(-(t - from) / 7) * Math.sin((t - from) * 2.6) : 0;
  const dx = kick(2, 34) + kick(16, 22) + 3 * Math.sin(t * 3.1);
  const dy = kick(2, 8) * 0.6;
  const rot = kick(2, 1.6) + kick(16, 1.1);
  const x = 50;
  const y = 250;
  return (
    <g transform={`translate(${dx} ${dy}) ${about(540, 470, `rotate(${rot}) scale(${slam})`)}`}>
      <Win x={x} y={y} w={980} h={450} title="ข้อผิดพลาดร้ายแรง" bar={["#8E0F0B", SIGNAL]}>
        <StopIcon cx={x + 110} cy={y + 200} />
        <text x={x + 205} y={y + 250} fontFamily={T.ui} fontWeight={700} fontSize={150} fill={INK}>
          มึงใช้ผิด
        </text>
        <text x={x + 210} y={y + 318} fontFamily={T.ui} fontWeight={500} fontSize={36} fill="#3A3833">
          รหัส 0x03 : ผิดวิธี 3 ข้อ
        </text>
        <Button x={x + 530} y={y + 350} label="ตกลง" focus pressed={t > 26 && t < 30} />
        <Button x={x + 750} y={y + 350} label="ยกเลิก" />
      </Win>
    </g>
  );
}

export function OpenerDialogs() {
  return (
    <AbsoluteFill>
      <Canvas>
        <InstallBox at={2} />
        <WarnTrail at={40} />
        <CriticalBox at={65} />
      </Canvas>
    </AbsoluteFill>
  );
}
