import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { CLOCK_START, CLOCK_STOP, mmss, secondsLeft, SevenSeg } from "./SevenSeg";
import { ALERT, AMBER, clamp, GLASS, GO, R } from "./style";

/**
 * The race HUD that rides the whole ad: "leave the house in" clock over a
 * three-segment task bar (อาบน้ำ / แต่งตัว / ผม). It launches big, docks
 * top-left, jumps back to centre stage when two minutes are left, turns
 * green at the bus and flies off. Drive it with the global frame.
 */

const PW = 470;
const PH = 262;

/** Task segments: [label, fill start s, done s]. */
const TASKS: readonly [string, number, number][] = [
  ["อาบน้ำ", 3.05, 4.21],
  ["แต่งตัว", 4.21, 5.88],
  ["ผม", 8.5, 11.52],
];

const ALARM_FROM = 5.88;
const HIDE: readonly [number, number] = [1.95, 3.05];
const BIG_AGAIN: readonly [number, number] = [5.88, 6.84];
const EXIT = 12.52;

const BIG = { x: 540 - (PW * 1.9) / 2, y: 1270, s: 1.9 };
const DOCK = { x: 34, y: 64, s: 0.8 };

function place(sec: number) {
  const e = { ...clamp, easing: Easing.inOut(Easing.cubic) };
  const toBig = interpolate(sec, [BIG_AGAIN[0] - 0.02, BIG_AGAIN[0] + 0.15], [0, 1], e);
  const toDock = interpolate(sec, [BIG_AGAIN[1] - 0.1, BIG_AGAIN[1] + 0.08], [0, 1], e);
  const k = sec < HIDE[0] ? 1 : toBig * (1 - toDock);
  const lerp = (a: number, b: number) => a + (b - a) * k;
  const exit = interpolate(sec, [EXIT, EXIT + 0.22], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  return {
    x: lerp(DOCK.x, BIG.x),
    y: lerp(DOCK.y, BIG.y) - exit * 400,
    s: lerp(DOCK.s, BIG.s),
  };
}

function Check({ x, y, p }: { x: number; y: number; p: number }) {
  return (
    <path
      d={`M ${x - 13} ${y} L ${x - 3} ${y + 10} L ${x + 15} ${y - 10}`}
      fill="none"
      stroke="#0B0D10"
      strokeWidth={6}
      strokeLinecap="round"
      strokeLinejoin="round"
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - p}
    />
  );
}

export function Hud() {
  const frame = useCurrentFrame();
  const sec = frame / 30;
  if (sec < CLOCK_START || (sec >= HIDE[0] && sec < HIDE[1])) return null;

  const { x, y, s } = place(sec);
  const enterAt = sec < HIDE[0] ? CLOCK_START : HIDE[1];
  const pop = interpolate(sec, [enterAt, enterAt + 0.18], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2.2)) });
  const left = secondsLeft(sec);
  const done = sec >= CLOCK_STOP;
  const alarm = sec >= ALARM_FROM && !done;
  const blink = frame % 8 < 4;
  const tone = done ? GO : alarm ? ALERT : AMBER;
  const edge = alarm ? (blink ? ALERT : "rgba(255,59,48,0.25)") : tone;
  const rolling = (sec > 3.15 && sec < 3.75) || (sec > 4.3 && sec < 5.2);
  const jolt = rolling ? (frame % 2 ? 2.5 : -2.5) : 0;
  const stamp = interpolate(sec, [CLOCK_STOP, CLOCK_STOP + 0.2], [0, 1], { ...clamp, easing: Easing.out(Easing.back(3)) });

  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="r10-hud-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g transform={`translate(${x} ${y}) scale(${s * (0.6 + 0.4 * pop)})`} opacity={pop}>
          <rect x={10} y={14} width={PW} height={PH} rx={20} fill="rgba(0,0,0,0.35)" />
          <rect x={0} y={0} width={PW} height={PH} rx={20} fill={GLASS} stroke={edge} strokeWidth={4} />
          {/* corner notches */}
          {[
            [16, 16, 1, 1],
            [PW - 16, 16, -1, 1],
            [16, PH - 16, 1, -1],
            [PW - 16, PH - 16, -1, -1],
          ].map(([cx, cy, dx, dy], i) => (
            <path key={i} d={`M ${cx} ${cy + dy * 18} L ${cx} ${cy} L ${cx + dx * 18} ${cy}`} stroke={tone} strokeWidth={3} fill="none" opacity={0.7} />
          ))}
          <circle cx={36} cy={38} r={8} fill={tone} opacity={alarm ? (blink ? 1 : 0.2) : 1} />
          <text x={54} y={47} fontFamily={R.hud} fontWeight={700} fontSize={27} fill="#C9CFD8" letterSpacing={1}>
            {done ? "ทันเวลา" : "ออกจากบ้านใน"}
          </text>
          <text x={PW - 26} y={47} textAnchor="end" fontFamily={R.hud} fontWeight={500} fontSize={22} fill={tone} letterSpacing={3}>
            {done ? "STOP" : alarm ? "ALERT" : "T-MINUS"}
          </text>
          <g transform={`translate(0 ${jolt})`}>
            <SevenSeg
              text={mmss(left)}
              x={48}
              y={66}
              scale={0.92}
              color={tone}
              ghost={0.08}
              colonOn={done || frame % 30 < 20}
              glow="url(#r10-hud-glow)"
            />
          </g>
          {TASKS.map(([label, from, to], i) => {
            const bx = 26 + i * 146;
            const p = interpolate(sec, [from, to], [0, 1], clamp);
            const ok = interpolate(sec, [to, to + 0.2], [0, 1], clamp);
            const waiting = i === 2 && sec >= ALARM_FROM && sec < from;
            return (
              <g key={label}>
                <rect x={bx} y={196} width={136} height={30} rx={6} fill="rgba(255,255,255,0.08)" stroke={waiting && blink ? ALERT : "rgba(255,255,255,0.18)"} strokeWidth={2} />
                <rect x={bx} y={196} width={136 * p} height={30} rx={6} fill={ok > 0 ? GO : tone} />
                {ok > 0 ? <Check x={bx + 68} y={211} p={ok} /> : null}
                <text x={bx + 68} y={252} textAnchor="middle" fontFamily={R.hud} fontWeight={700} fontSize={22} fill={ok >= 1 ? GO : "#AEB6C2"}>
                  {label}
                </text>
              </g>
            );
          })}
          {stamp > 0 ? (
            <g transform={`translate(${PW - 4} ${PH - 6}) rotate(-12) scale(${stamp})`}>
              <circle r={46} fill="#07130C" stroke={GO} strokeWidth={5} />
              <text y={11} textAnchor="middle" fontFamily={R.hud} fontWeight={700} fontSize={32} fill={GO}>
                3/3
              </text>
            </g>
          ) : null}
        </g>
      </svg>
    </AbsoluteFill>
  );
}
