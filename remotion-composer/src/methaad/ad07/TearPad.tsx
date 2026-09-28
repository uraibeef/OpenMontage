import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { PaperFilter, WobbleFilter } from "./paper";
import { about, clamp, D, hash, INK, PAD_RED, PAPER } from "./style";

/**
 * The day counter: a Thai tear-off day pad (ปฏิทินฉีก) turned 7-day habit
 * tracker. Each "วันที่ X" beat rips pages off the same pad, every time with
 * a different hand: day 1 slams down, day 3 rips, day 5 flutters, day 7 gets
 * the last page ripped and the 7 ringed in red marker.
 */

const W = 600;
const H = 640;
const X0 = 240;
const Y0 = 1210;
const LABELS = ["", "วันแรก", "วันที่สอง", "วันที่สาม", "วันที่สี่", "วันที่ห้า", "วันที่หก", "วันที่เจ็ด"];
const TALLY = 7;
const BOX = 50;
const GAP = 18;

export type PadVariant = "drop" | "rip" | "flutter" | "final";

interface TearPadProps {
  id: string;
  /** Page on top when the beat starts. */
  first: number;
  /** Frames (beat-local) at which each top page is torn off; pages torn = tearAt.length. */
  tearAt: readonly number[];
  variant: PadVariant;
  /** Beat-local frame the red ring starts on the final page ("final" only). */
  ringAt?: number;
}

function Page({ n, id }: { n: number; id: string }) {
  const tallyX = (W - (TALLY * BOX + (TALLY - 1) * GAP)) / 2;
  return (
    <g>
      <rect x={0} y={0} width={W} height={H} fill={PAPER} filter={`url(#${id}-grain)`} />
      {Array.from({ length: 24 }, (_, i) => (
        <circle key={i} cx={16 + i * 24.5} cy={16} r={3.2} fill="rgba(27,27,34,0.22)" />
      ))}
      <line x1={60} x2={170} y1={62} y2={62} stroke={PAD_RED} strokeWidth={4} />
      <line x1={W - 170} x2={W - 60} y1={62} y2={62} stroke={PAD_RED} strokeWidth={4} />
      <text x={W / 2} y={75} textAnchor="middle" fontFamily={D.print} fontWeight={800} fontSize={36} fill={PAD_RED}>
        บันทึก 7 วัน
      </text>
      <text x={W / 2} y={420} textAnchor="middle" fontFamily={D.pad} fontSize={370} fill={n === 7 ? PAD_RED : INK}>
        {n}
      </text>
      <text x={W / 2} y={520} textAnchor="middle" fontFamily={D.print} fontWeight={800} fontSize={62} fill={INK}>
        {LABELS[n]}
      </text>
      {Array.from({ length: TALLY }, (_, i) => {
        const x = tallyX + i * (BOX + GAP);
        const done = i < n;
        return (
          <g key={i}>
            <rect x={x} y={560} width={BOX} height={BOX} rx={6} fill="none" stroke="rgba(27,27,34,0.45)" strokeWidth={3} />
            {done ? (
              <path
                d={`M ${x + 10} ${560 + 27} L ${x + 22} ${560 + 40} L ${x + 42} ${560 + 10}`}
                stroke={PAD_RED}
                strokeWidth={7}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : null}
          </g>
        );
      })}
    </g>
  );
}

/** The page currently leaving the pad, per variant. */
function tornTransform(variant: PadVariant, p: number) {
  if (variant === "flutter") {
    return `${about(W, 0, `rotate(${-p * 55})`)} translate(${-p * 420} ${p * p * 700}) ${about(W / 2, 0, `scale(1 ${1 - p * 0.45})`)}`;
  }
  const spin = variant === "final" ? 42 : 32;
  return `translate(${p * 300} ${p * p * 1000}) ${about(0, 0, `rotate(${p * spin})`)}`;
}

/** Jagged paper stub left along the perforation once a page is ripped. */
function Stub({ seed }: { seed: number }) {
  const pts = Array.from({ length: 31 }, (_, i) => `${i * 20},${14 + hash(seed + i) * 14}`).join(" ");
  return <polygon points={`0,0 ${W},0 ${pts.split(" ").reverse().join(" ")}`} fill={PAPER} opacity={0.96} />;
}

function Ring({ at, id }: { at: number; id: string }) {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 7], [0, 1], { ...clamp, easing: Easing.out(Easing.quad) });
  if (p <= 0) return null;
  return (
    <path
      d="M 470 150 C 380 60, 150 80, 130 250 C 110 430, 330 500, 450 420 C 540 350, 520 170, 380 120"
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - p}
      stroke={PAD_RED}
      strokeWidth={16}
      strokeLinecap="round"
      fill="none"
      opacity={0.9}
      filter={`url(#${id}-wobble)`}
    />
  );
}

export function TearPad({ id, first, tearAt, variant, ringAt = 0 }: TearPadProps) {
  const frame = useCurrentFrame();
  const enter =
    variant === "drop"
      ? interpolate(frame, [0, 9], [-1500, 0], { ...clamp, easing: Easing.out(Easing.back(1.5)) })
      : interpolate(frame, [0, 5], [900, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const tilt = { drop: -2.5, rip: -1.5, flutter: 2, final: -1 }[variant];
  const dropSpin = variant === "drop" ? interpolate(frame, [0, 9], [-9, 0], clamp) : 0;

  const torn = tearAt.filter((t) => frame >= t + 9).length;
  const top = first + torn;
  const active = tearAt.findIndex((t) => frame >= t && frame < t + 9);
  const leaving = active >= 0 ? first + active : null;
  const leaveP = active >= 0 ? interpolate(frame, [tearAt[active], tearAt[active] + 9], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) }) : 0;
  const under = leaving !== null ? leaving + 1 : top;
  const ripped = tearAt.some((t) => frame >= t);

  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <defs>
          <PaperFilter id={`${id}-grain`} seed={first * 3} />
          <WobbleFilter id={`${id}-wobble`} scale={5} />
        </defs>
        <g transform={`translate(${X0} ${Y0 + enter}) ${about(W / 2, H / 2, `rotate(${tilt + dropSpin})`)}`}>
          <rect x={16} y={24} width={W} height={H} rx={4} fill="rgba(0,0,0,0.38)" />
          {[3, 2, 1].map((k) => (
            <rect key={k} x={k * 2} y={k * 5} width={W} height={H} fill="#E8E1D0" stroke="rgba(0,0,0,0.12)" strokeWidth={1} />
          ))}
          <Page n={under} id={id} />
          {ripped && leaving === null ? <Stub seed={first * 17 + torn} /> : null}
          {leaving !== null ? (
            <g transform={tornTransform(variant, leaveP)} opacity={interpolate(leaveP, [0.7, 1], [1, 0], clamp)}>
              <rect x={10} y={16} width={W} height={H} fill="rgba(0,0,0,0.25)" />
              <Page n={leaving} id={id} />
            </g>
          ) : null}
          {variant === "final" ? <Ring at={ringAt} id={id} /> : null}
          <rect x={-16} y={-44} width={W + 32} height={50} rx={8} fill="#26262C" />
          <rect x={-16} y={-44} width={W + 32} height={12} rx={6} fill="#3A3A42" />
          {[60, W - 60].map((cx) => (
            <circle key={cx} cx={cx} cy={-19} r={9} fill="#8E8E98" stroke="#15151A" strokeWidth={3} />
          ))}
        </g>
      </svg>
    </AbsoluteFill>
  );
}
