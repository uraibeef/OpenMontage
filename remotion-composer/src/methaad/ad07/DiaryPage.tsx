import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { PaperFilter, WobbleFilter, WriteOn } from "./paper";
import { about, clamp, D, DIARY_INK, DIARY_RED, PAD_RED, RULE } from "./style";

/**
 * Close. The last diary entry, written in fountain pen on a ruled page:
 * "สิ่งเดียวที่เสียดาย…" then, in red, "ไม่รู้จักมันเร็วกว่านี้". A rubber
 * stamp with the offer lands in the corner.
 */

const TOP = 1330;
const LEFT = 30;
const W = 1020;
const H = 640;
const MARGIN = 128;

interface DiaryProps {
  secondAt: number;
  stampAt: number;
}

function Stamp({ at }: { at: number }) {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const t = interpolate(frame, [at, at + 4], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const s = interpolate(t, [0, 1], [1.9, 1]);
  return (
    <g transform={`translate(860 ${TOP + 490}) rotate(-12) scale(${s})`} opacity={interpolate(t, [0, 0.4, 1], [0, 0.6, 0.92])}>
      <g filter="url(#d7-stamp-ink)">
        <circle r={112} fill="none" stroke={PAD_RED} strokeWidth={9} />
        <circle r={94} fill="none" stroke={PAD_RED} strokeWidth={3} />
        <text y={-16} textAnchor="middle" fontFamily={D.print} fontWeight={800} fontSize={46} fill={PAD_RED}>
          ซื้อ 1
        </text>
        <text y={40} textAnchor="middle" fontFamily={D.print} fontWeight={800} fontSize={46} fill={PAD_RED}>
          แถม 1
        </text>
      </g>
    </g>
  );
}

export function DiaryPage({ secondAt, stampAt }: DiaryProps) {
  const frame = useCurrentFrame();
  const rise = interpolate(frame, [0, 6], [H, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const swoosh = interpolate(frame, [secondAt + 14, secondAt + 20], [0, 1], { ...clamp, easing: Easing.out(Easing.quad) });

  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <PaperFilter id="d7-diary-grain" seed={61} strength={0.12} />
          <WobbleFilter id="d7-diary-wobble" scale={3} seed={71} />
          <filter id="d7-stamp-ink" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves={3} seed={19} result="n" />
            <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -3 2.8" result="pits" />
            <feComposite in="SourceGraphic" in2="pits" operator="in" />
          </filter>
        </defs>
        <g transform={`translate(0 ${rise}) ${about(540, TOP, "rotate(-1.5)")}`}>
          <rect x={LEFT + 10} y={TOP - 14} width={W} height={H} fill="rgba(0,0,0,0.35)" />
          <rect x={LEFT} y={TOP} width={W} height={H} fill="#FCF9F0" filter="url(#d7-diary-grain)" />
          {[TOP + 190, TOP + 340, TOP + 490].map((ly) => (
            <line key={ly} x1={LEFT} x2={LEFT + W} y1={ly} y2={ly} stroke={RULE} strokeWidth={3} />
          ))}
          <line x1={LEFT + MARGIN} x2={LEFT + MARGIN} y1={TOP} y2={TOP + H} stroke="#E58C8C" strokeWidth={3} />
          <text x={LEFT + MARGIN + 24} y={TOP + 78} fontFamily={D.diary} fontWeight={700} fontSize={48} fill="rgba(29,42,85,0.7)">
            วันที่ 7
          </text>
          <WriteOn id="d7-diary-l1" x={LEFT + MARGIN} y={TOP + 90} w={W - MARGIN} h={140} from={4} dur={14}>
            <text x={LEFT + MARGIN + 24} y={TOP + 176} fontFamily={D.diary} fontWeight={700} fontSize={90} fill={DIARY_INK}>
              สิ่งเดียวที่เสียดาย...
            </text>
          </WriteOn>
          <WriteOn id="d7-diary-l2" x={LEFT + 20} y={TOP + 240} w={W - 20} h={160} from={secondAt} dur={14}>
            <text x={LEFT + 44} y={TOP + 326} fontFamily={D.diary} fontWeight={700} fontSize={96} fill={DIARY_RED}>
              ไม่รู้จักมันเร็วกว่านี้
            </text>
          </WriteOn>
          <path
            d={`M ${LEFT + 60} ${TOP + 372} C ${LEFT + 300} ${TOP + 352}, ${LEFT + 640} ${TOP + 380}, ${LEFT + 930} ${TOP + 350}`}
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - swoosh}
            stroke={DIARY_RED}
            strokeWidth={9}
            fill="none"
            strokeLinecap="round"
            filter="url(#d7-diary-wobble)"
          />
          <Stamp at={stampAt} />
        </g>
      </svg>
    </AbsoluteFill>
  );
}
