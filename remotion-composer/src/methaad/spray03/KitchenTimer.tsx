import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Canvas, clamp } from "../hooks/kit";
import { about, CEDAR, CEDAR_LIGHT, CREAM, INK, T, TOMATO } from "./style";

const CX = 918;
const CY = 1742;
const R = 118;
/** Dial angle (deg, 0 = up) for each step notch. */
const NOTCH = [-62, 0, 62] as const;

interface KitchenTimerProps {
  /** Local frames where the dial clicks to step 2 and step 3. */
  step2At: number;
  step3At: number;
  /** Local frame where the bell rings ("จบ"). */
  ringAt: number;
}

/** Step counter as a wind-up kitchen timer: the knob clicks 1 → 2 → 3, then the bell rings. */
export function KitchenTimer({ step2At, step3At, ringAt }: KitchenTimerProps) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 12, stiffness: 200, mass: 0.6 } });
  const exit = interpolate(frame, [durationInFrames - 6, durationInFrames], [1, 0], clamp);
  const click = (at: number) => spring({ frame: frame - at, fps, config: { damping: 9, stiffness: 260, mass: 0.5 } });
  const angle = NOTCH[0] + (NOTCH[1] - NOTCH[0]) * click(step2At) + (NOTCH[2] - NOTCH[1]) * click(step3At);
  const step = frame >= step3At ? 3 : frame >= step2At ? 2 : 1;
  const changedAt = step === 3 ? step3At : step === 2 ? step2At : 0;
  const numIn = interpolate(frame - changedAt, [0, 5], [40, 0], { ...clamp, easing: Easing.out(Easing.back(2)) });
  const ringing = frame >= ringAt && frame < ringAt + 22;
  const shake = ringing ? Math.sin((frame - ringAt) * 2.4) * 9 : 0;
  const ringLines = interpolate(frame, [ringAt, ringAt + 6, ringAt + 20], [0, 1, 0], clamp);

  return (
    <Canvas>
      <g transform={about(CX, CY, `rotate(${shake}) scale(${enter * exit})`)}>
        {/* feet + bells */}
        <path d={`M ${CX - 80} ${CY + 104} l -22 34 h 34 z M ${CX + 80} ${CY + 104} l 22 34 h -34 z`} fill={INK} />
        {[-1, 1].map((k) => (
          <g key={k} transform={about(CX + k * 70, CY - 118, `rotate(${k * 24})`)}>
            <path d={`M ${CX + k * 70 - 38} ${CY - 112} a 38 34 0 0 1 76 0 z`} fill={TOMATO} stroke={INK} strokeWidth={6} />
            <rect x={CX + k * 70 - 6} y={CY - 164} width={12} height={18} fill={INK} />
          </g>
        ))}
        <g opacity={ringLines} stroke={INK} strokeWidth={7} strokeLinecap="round">
          <path d={`M ${CX - 150} ${CY - 170} l -34 -26 M ${CX - 160} ${CY - 120} l -44 -4`} />
          <path d={`M ${CX + 150} ${CY - 170} l 34 -26 M ${CX + 160} ${CY - 120} l 44 -4`} />
        </g>
        {/* body */}
        <circle cx={CX + 8} cy={CY + 10} r={R} fill={INK} />
        <circle cx={CX} cy={CY} r={R} fill={CEDAR} stroke={INK} strokeWidth={7} />
        <circle cx={CX} cy={CY} r={R - 24} fill={CREAM} stroke={INK} strokeWidth={5} />
        {Array.from({ length: 24 }, (_, i) => {
          const a = (i / 24) * Math.PI * 2;
          const long = i % 4 === 0;
          const r1 = R - 28;
          const r2 = r1 - (long ? 16 : 8);
          return (
            <line key={i} x1={CX + Math.sin(a) * r1} y1={CY - Math.cos(a) * r1} x2={CX + Math.sin(a) * r2} y2={CY - Math.cos(a) * r2} stroke={INK} strokeWidth={long ? 5 : 3} />
          );
        })}
        {NOTCH.map((deg, i) => {
          const a = (deg * Math.PI) / 180;
          const on = i + 1 <= step;
          return (
            <circle key={deg} cx={CX + Math.sin(a) * (R - 12)} cy={CY - Math.cos(a) * (R - 12)} r={9} fill={on ? CEDAR_LIGHT : CEDAR} stroke={INK} strokeWidth={3} />
          );
        })}
        {/* knob pointer */}
        <g transform={about(CX, CY, `rotate(${angle})`)}>
          <path d={`M ${CX - 13} ${CY + 6} L ${CX} ${CY - 74} L ${CX + 13} ${CY + 6} Z`} fill={TOMATO} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
        </g>
        <circle cx={CX} cy={CY} r={40} fill={CREAM} stroke={INK} strokeWidth={5} />
        <clipPath id="tmr-num">
          <circle cx={CX} cy={CY} r={36} />
        </clipPath>
        <text x={CX} y={CY + 22 + numIn} textAnchor="middle" fontFamily={T.tile} fontWeight={800} fontSize={62} fill={INK} clipPath="url(#tmr-num)">
          {step}
        </text>
        <text x={CX} y={CY + 72} textAnchor="middle" fontFamily={T.tile} fontWeight={700} fontSize={24} fill={INK}>
          ขั้นที่
        </text>
      </g>
    </Canvas>
  );
}
