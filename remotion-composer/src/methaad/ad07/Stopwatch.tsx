import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { clamp, D, INK, PAD_RED } from "./style";

/**
 * Day 7. A chrome stopwatch times the whole styling session: the hand races,
 * slams to a stop well short of the minute, and a red band calls it
 * "ไม่ถึงนาที". It hops from the corner to centre stage on the second shot.
 */

const R = 200;
const A = { x: 215, y: 1650 };
const B = { x: 540, y: 1530 };
const STOP_SEC = 48;

interface StopwatchProps {
  startAt: number;
  stopAt: number;
  moveAt: number;
}

const polar = (deg: number, r: number) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [Math.cos(a) * r, Math.sin(a) * r] as const;
};

function sector(fromSec: number, toSec: number, r: number) {
  if (toSec - fromSec <= 0.01) return "";
  const [x1, y1] = polar(fromSec * 6, r);
  const [x2, y2] = polar(toSec * 6, r);
  const large = (toSec - fromSec) * 6 > 180 ? 1 : 0;
  return `M 0 0 L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
}

function Dial() {
  return (
    <g>
      {Array.from({ length: 60 }, (_, i) => {
        const major = i % 5 === 0;
        const [x1, y1] = polar(i * 6, 162);
        const [x2, y2] = polar(i * 6, major ? 138 : 150);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={INK} strokeWidth={major ? 6 : 2.5} />;
      })}
      {[60, 15, 30, 45].map((n) => {
        const [x, y] = polar((n % 60) * 6, 112);
        return (
          <text key={n} x={x} y={y + 14} textAnchor="middle" fontFamily={D.watch} fontWeight={700} fontSize={40} fill={INK}>
            {n}
          </text>
        );
      })}
    </g>
  );
}

export function Stopwatch({ startAt, stopAt, moveAt }: StopwatchProps) {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 5], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.7)) });
  const move = interpolate(frame, [moveAt, moveAt + 4], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const x = interpolate(move, [0, 1], [A.x, B.x]);
  const y = interpolate(move, [0, 1], [A.y, B.y]) - Math.sin(move * Math.PI) * 90;
  const sec = interpolate(frame, [startAt, stopAt], [0, STOP_SEC], { ...clamp, easing: Easing.in(Easing.quad) });
  const stopped = frame >= stopAt;
  const kick = interpolate(frame, [stopAt, stopAt + 2, stopAt + 7], [0, 1, 0], clamp);
  const band = interpolate(frame, [stopAt + 1, stopAt + 6], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
  const [hx, hy] = polar(sec * 6, 150);
  const scale = enter * (1 + kick * 0.07);

  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="d7-chrome" cx="0.35" cy="0.3" r="0.9">
            <stop offset="0" stopColor="#FFFFFF" />
            <stop offset="0.45" stopColor="#B9BCC4" />
            <stop offset="0.8" stopColor="#6B6E78" />
            <stop offset="1" stopColor="#3B3D44" />
          </radialGradient>
        </defs>
        <g transform={`translate(${x + kick * 6} ${y}) scale(${scale}) rotate(${-4 + kick * 3})`}>
          <circle cx={10} cy={18} r={R} fill="rgba(0,0,0,0.35)" />
          <rect x={-16} y={-R - 50} width={32} height={50} fill="url(#d7-chrome)" />
          <rect x={-36} y={-R - 78 + (stopped ? 6 : 0)} width={72} height={32} rx={8} fill="url(#d7-chrome)" stroke="#2C2D33" strokeWidth={3} />
          <circle cx={0} cy={-R - 104} r={26} fill="none" stroke="url(#d7-chrome)" strokeWidth={12} />
          <g transform="rotate(42)">
            <rect x={-14} y={-R - 34} width={28} height={40} rx={6} fill="url(#d7-chrome)" stroke="#2C2D33" strokeWidth={3} />
          </g>
          <circle cx={0} cy={0} r={R} fill="url(#d7-chrome)" stroke="#2C2D33" strokeWidth={4} />
          <circle cx={0} cy={0} r={172} fill="#FAF8F2" stroke="#2C2D33" strokeWidth={3} />
          <path d={sector(0, sec, 168)} fill="rgba(33,65,184,0.16)" />
          {stopped ? <path d={sector(STOP_SEC, 60, 168)} fill="rgba(217,52,43,0.22)" /> : null}
          <Dial />
          <rect x={-86} y={-92} width={172} height={62} rx={10} fill="#1F2A22" />
          <text x={0} y={-45} textAnchor="middle" fontFamily={D.watch} fontWeight={700} fontSize={46} fill="#B8F07A" letterSpacing={3}>
            {`00:${String(Math.floor(sec)).padStart(2, "0")}`}
          </text>
          <line x1={0} y1={0} x2={hx} y2={hy} stroke={PAD_RED} strokeWidth={7} strokeLinecap="round" />
          <line x1={0} y1={0} x2={-hx * 0.18} y2={-hy * 0.18} stroke={PAD_RED} strokeWidth={10} strokeLinecap="round" />
          <circle cx={0} cy={0} r={14} fill={PAD_RED} stroke="#2C2D33" strokeWidth={3} />
          {band > 0 ? (
            <g transform={`translate(0 92) rotate(-7) scale(${band})`}>
              <rect x={-238} y={-50} width={476} height={100} fill="rgba(0,0,0,0.3)" transform="translate(6 8)" />
              <rect x={-238} y={-50} width={476} height={100} fill={PAD_RED} />
              <text x={0} y={27} textAnchor="middle" fontFamily={D.watch} fontWeight={700} fontSize={74} fill="#FFFFFF">
                ไม่ถึงนาที
              </text>
            </g>
          ) : null}
        </g>
      </svg>
    </AbsoluteFill>
  );
}
