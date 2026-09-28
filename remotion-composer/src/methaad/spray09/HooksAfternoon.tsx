import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Canvas, clamp, graphemes, usePop } from "../hooks/kit";
import { about, CAL_RED, CEDAR, INK, MINT, SOFT, T, WHITE } from "./style";

/**
 * Calendar widget at 15:00: the "ประชุม" block sits in the day grid; at
 * "ประชุมเสร็จ" a pen stroke strikes it through and a round check pops "เสร็จ".
 */
export function CalendarCard({ doneAt }: { doneAt: number }) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const pop = usePop(0, 13);
  const strike = interpolate(frame, [doneAt, doneAt + 6], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const check = usePop(doneAt + 4, 9);
  const out = interpolate(frame, [durationInFrames - 5, durationInFrames], [0, 1], clamp);
  const X = 52;
  const Y = 1446;
  return (
    <Canvas>
      <g transform={about(540, 1580, `scale(${pop * (1 - out * 0.1)})`)} opacity={1 - out}>
        <rect x={X} y={Y + 12} width={976} height={272} rx={44} fill="#000" opacity={0.2} />
        <rect x={X} y={Y} width={976} height={272} rx={44} fill={WHITE} />
        {/* date block */}
        <text x={X + 58} y={Y + 70} fontFamily={T.cal} fontWeight={700} fontSize={34} fill={CAL_RED}>
          วันนี้
        </text>
        <text x={X + 52} y={Y + 176} fontFamily={T.clock} fontWeight={300} fontSize={120} fill={INK}>
          15
        </text>
        <text x={X + 60} y={Y + 234} fontFamily={T.cal} fontWeight={500} fontSize={30} fill={SOFT}>
          บ่ายสาม
        </text>
        <line x1={X + 232} y1={Y + 34} x2={X + 232} y2={Y + 238} stroke="#E5E7EB" strokeWidth={3} />
        {/* hour grid */}
        {["14:00", "15:00"].map((h, i) => (
          <g key={h}>
            <text x={X + 262} y={Y + 70 + i * 116} fontFamily={T.clock} fontWeight={600} fontSize={24} fill={SOFT}>
              {h}
            </text>
            <line x1={X + 356} y1={Y + 62 + i * 116} x2={X + 940} y2={Y + 62 + i * 116} stroke="#EEF0F3" strokeWidth={3} />
          </g>
        ))}
        {/* event block 14–15 */}
        <rect x={X + 370} y={Y + 72} width={540} height={100} rx={18} fill={CEDAR} opacity={0.14} />
        <rect x={X + 370} y={Y + 72} width={10} height={100} rx={5} fill={CEDAR} />
        <text x={X + 402} y={Y + 142} fontFamily={T.cal} fontWeight={700} fontSize={56} fill={CEDAR}>
          ประชุม
        </text>
        <path
          d={`M ${X + 392} ${Y + 124} Q ${X + 520} ${Y + 112} ${X + 640} ${Y + 124}`}
          stroke={CAL_RED}
          strokeWidth={9}
          fill="none"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="1 1"
          strokeDashoffset={1 - strike}
        />
        <g transform={about(X + 790, Y + 122, `scale(${check})`)}>
          <circle cx={X + 790} cy={Y + 122} r={40} fill={CEDAR} />
          <path d={`M ${X + 770} ${Y + 122} l 14 14 l 26 -30`} stroke={WHITE} strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <text x={X + 850} y={Y + 142} fontFamily={T.cal} fontWeight={700} fontSize={50} fill={CEDAR} opacity={check}>
          เสร็จ
        </text>
        <text x={X + 402} y={Y + 232} fontFamily={T.cal} fontWeight={500} fontSize={30} fill={SOFT}>
          ต่อด้วยงานทั้งบ่าย
        </text>
      </g>
    </Canvas>
  );
}

/**
 * "ผมยังตั้งอยู่": every glyph starts lying flat on its back and springs upright,
 * one after another, with a drawn arrow shooting up beside them.
 */
export function StandUp() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const word = graphemes("ผมยังตั้งอยู่");
  const arrow = interpolate(frame, [4, 12], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: 60,
          top: 1480,
          width: 960,
          height: 230,
          borderRadius: 34,
          background: `linear-gradient(90deg, ${CEDAR} 0%, #1E3F2E 100%)`,
          boxShadow: "0 16px 36px rgba(0,0,0,0.3)",
          transform: `scaleX(${interpolate(frame, [0, 5], [0.2, 1], { ...clamp, easing: Easing.out(Easing.cubic) })})`,
        }}
      />
      <div style={{ position: "absolute", left: 110, top: 1486, display: "flex", alignItems: "flex-end", height: 220, fontFamily: T.cal, fontWeight: 700, fontSize: 132, color: WHITE, whiteSpace: "nowrap" }}>
        {word.map((g, i) => {
          const up = spring({ frame: frame - 2 - i * 0.9, fps, config: { damping: 9, stiffness: 200, mass: 0.6 } });
          return (
            <span key={i} style={{ display: "inline-block", transformOrigin: "50% 85%", transform: `rotate(${(1 - up) * 90}deg)`, opacity: up > 0.02 ? 1 : 0, lineHeight: "200px" }}>
              {g}
            </span>
          );
        })}
      </div>
      <Canvas>
        <g opacity={arrow}>
          <line x1={940} y1={1680} x2={940} y2={1680 - arrow * 160} stroke={MINT} strokeWidth={14} strokeLinecap="round" />
          <path d={`M 906 ${1560 - arrow * 40 + 40} L 940 ${1520 - arrow * 40 + 40} L 974 ${1560 - arrow * 40 + 40}`} stroke={MINT} strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </Canvas>
    </AbsoluteFill>
  );
}
