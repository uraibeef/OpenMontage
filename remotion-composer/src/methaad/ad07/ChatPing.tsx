import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { graphemes } from "../hooks/kit";
import { clamp, D, INK } from "./style";

/**
 * Day 5. A friend's chat bubble: typing dots while the VO says "เพื่อนทักว่า",
 * then the bubble bursts open letter by letter into "ไปตัดผมใหม่มาเหรอ".
 */

const LINE = "ไปตัดผมใหม่มาเหรอ";
const BX = 230;
const BY = 1540;
const BH = 132;
const FULL_W = 760;
const DOTS_W = 190;

function Avatar() {
  return (
    <g>
      <circle cx={150} cy={BY + BH - 40} r={56} fill="#6C7CF0" stroke="#FFFFFF" strokeWidth={6} />
      <circle cx={150} cy={BY + BH - 52} r={22} fill="#FFFFFF" />
      <path d={`M 112 ${BY + BH - 6} Q 150 ${BY + BH - 44} 188 ${BY + BH - 6}`} fill="#FFFFFF" />
      <path d={`M 130 ${BY + BH - 70} q 10 -16 22 -6 q 8 -14 20 -2`} stroke="#1B1B22" strokeWidth={6} fill="none" strokeLinecap="round" />
    </g>
  );
}

export function ChatPing({ textAt }: { textAt: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = interpolate(frame, [0, 6], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const open = spring({ frame: frame - textAt, fps, config: { damping: 12, stiffness: 210, mass: 0.6 } });
  const w = frame < textAt ? DOTS_W : interpolate(open, [0, 1], [DOTS_W, FULL_W]);
  const ring = interpolate(frame, [textAt, textAt + 10], [0, 1], clamp);
  const letters = graphemes(LINE);

  return (
    <AbsoluteFill style={{ transform: `translateY(${(1 - enter) * 220}px)`, opacity: enter }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        <text x={BX + 16} y={BY - 22} fontFamily={D.ui} fontWeight={600} fontSize={38} fill="#FFFFFF" stroke="rgba(0,0,0,0.55)" strokeWidth={6} paintOrder="stroke">
          เพื่อน
        </text>
        <text x={BX + 150} y={BY - 22} fontFamily={D.ui} fontWeight={500} fontSize={30} fill="rgba(255,255,255,0.85)" stroke="rgba(0,0,0,0.5)" strokeWidth={5} paintOrder="stroke">
          07:23
        </text>
        <Avatar />
        {ring > 0 && ring < 1 ? (
          <rect
            x={BX - 20 * ring}
            y={BY - 20 * ring}
            width={w + 40 * ring}
            height={BH + 40 * ring}
            rx={60}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth={6}
            opacity={1 - ring}
          />
        ) : null}
        <rect x={BX + 6} y={BY + 10} width={w} height={BH} rx={56} fill="rgba(0,0,0,0.3)" />
        <path d={`M ${BX + 30} ${BY + BH - 30} Q ${BX - 10} ${BY + BH + 8} ${BX - 30} ${BY + BH + 4} Q ${BX + 10} ${BY + BH - 2} ${BX + 60} ${BY + BH - 20}`} fill="#FFFFFF" />
        <rect x={BX} y={BY} width={w} height={BH} rx={56} fill="#FFFFFF" />
        {frame < textAt
          ? [0, 1, 2].map((i) => {
              const bob = Math.sin((frame - i * 3) / 2.2) * 9;
              return <circle key={i} cx={BX + 58 + i * 38} cy={BY + BH / 2 + bob} r={13} fill="#9A9AA6" />;
            })
          : null}
      </svg>
      {frame >= textAt ? (
        <div
          style={{
            position: "absolute",
            left: BX + 44,
            top: BY + 22,
            fontFamily: D.ui,
            fontWeight: 600,
            fontSize: 64,
            lineHeight: "88px",
            color: INK,
            whiteSpace: "nowrap",
          }}
        >
          {letters.map((g, i) => {
            const p = interpolate(frame, [textAt + 2 + i * 0.7, textAt + 5 + i * 0.7], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2.2)) });
            return (
              <span key={i} style={{ display: "inline-block", opacity: p, transform: `translateY(${(1 - p) * 26}px) scale(${0.6 + p * 0.4})` }}>
                {g}
              </span>
            );
          })}
        </div>
      ) : null}
    </AbsoluteFill>
  );
}
