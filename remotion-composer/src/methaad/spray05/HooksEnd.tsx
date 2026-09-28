import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Canvas, clamp } from "../hooks/kit";
import { about, arc, CARBON, CEDAR, CHALK, FLAME, GOLD, LIME, MINT, PANEL, T } from "./style";

const RX = 540;
const RY = 960;
const RR = 250;

/** "สรุป" — the weekly summary: one big activity ring closes all the way to 7/7. */
export function SummaryRing({ closeAt }: { closeAt: number }) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 12, stiffness: 200, mass: 0.6 } });
  const exit = interpolate(frame, [durationInFrames - 4, durationInFrames], [1, 0], clamp);
  const close = interpolate(frame, [2, closeAt], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const done = spring({ frame: frame - closeAt, fps, config: { damping: 8, stiffness: 260, mass: 0.5 } });
  const count = Math.max(1, Math.round(close * 7));
  return (
    <Canvas>
      <g transform={about(RX, RY, `scale(${enter * exit * (1 + done * 0.06 - (done > 0.9 ? 0.06 : 0))})`)}>
        <circle cx={RX} cy={RY} r={RR + 70} fill={PANEL} />
        <circle cx={RX} cy={RY} r={RR} fill="none" stroke="rgba(200,245,60,0.18)" strokeWidth={62} />
        {close > 0.005 ? (
          <path d={arc(RX, RY, RR, 0, Math.min(359.9, close * 360))} fill="none" stroke={LIME} strokeWidth={62} strokeLinecap="round" />
        ) : null}
        <rect x={RX - 90} y={RY - 150} width={180} height={62} rx={31} fill={CHALK} />
        <text x={RX} y={RY - 104} textAnchor="middle" fontFamily={T.hudUp} fontWeight={800} fontSize={44} fill={CARBON}>
          สรุป
        </text>
        <text x={RX - 10} y={RY + 90} textAnchor="middle" fontFamily={T.hud} fontWeight={900} fontSize={200} fill={CHALK}>
          {count}
          <tspan fontSize={110} fill={LIME}>
            /7
          </tspan>
        </text>
      </g>
    </Canvas>
  );
}

/**
 * Final achievement — "ติดกระเป๋าถาวร": a gold-edged card slides up over the real
 * bottle; a drawn pouch zips shut at "กระเป๋า", and at "ถาวร" an endless loop is
 * drawn under the word and the card is stamped for keeps.
 */
export function PocketTrophy({ zipAt, keepAt }: { zipAt: number; keepAt: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rise = spring({ frame, fps, config: { damping: 13, stiffness: 190, mass: 0.7 } });
  const zip = interpolate(frame, [zipAt, zipAt + 8], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const loop = interpolate(frame, [keepAt, keepAt + 12], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const stamp = spring({ frame: frame - keepAt, fps, config: { damping: 9, stiffness: 260, mass: 0.6 } });
  const y0 = (1 - rise) * 700;
  const BX = 210;
  const BY = 1250;
  const zipX = BX - 100 + zip * 200;

  return (
    <Canvas>
      <g transform={`translate(0 ${y0})`}>
        <rect x={60} y={1030} width={960} height={470} rx={48} fill={GOLD} />
        <rect x={72} y={1042} width={936} height={446} rx={40} fill={CARBON} />
        <rect x={108} y={1070} width={260} height={56} rx={28} fill={GOLD} />
        <text x={238} y={1110} textAnchor="middle" fontFamily={T.trophy} fontWeight={700} fontSize={34} fill={CARBON}>
          ปลดล็อกแล้ว
        </text>
        {/* drawn pouch with a zipper */}
        <path d={`M ${BX - 130} ${BY - 60} Q ${BX - 140} ${BY + 150} ${BX} ${BY + 160} Q ${BX + 140} ${BY + 150} ${BX + 130} ${BY - 60} Z`} fill={CEDAR} stroke={MINT} strokeWidth={6} />
        <path d={`M ${BX - 60} ${BY - 60} Q ${BX - 60} ${BY - 130} ${BX} ${BY - 130} Q ${BX + 60} ${BY - 130} ${BX + 60} ${BY - 60}`} fill="none" stroke={MINT} strokeWidth={14} strokeLinecap="round" />
        <line x1={BX - 118} y1={BY - 40} x2={BX + 118} y2={BY - 40} stroke={CHALK} strokeWidth={6} strokeDasharray="10 8" />
        <line x1={BX - 118} y1={BY - 40} x2={zipX} y2={BY - 40} stroke={GOLD} strokeWidth={12} strokeLinecap="round" />
        <rect x={zipX - 10} y={BY - 54} width={20} height={44} rx={6} fill={GOLD} stroke={CARBON} strokeWidth={4} />
        {zip >= 1 ? (
          <path d={`M ${BX} ${BY + 10} Q ${BX + 6} ${BY + 44} ${BX + 40} ${BY + 50} Q ${BX + 6} ${BY + 56} ${BX} ${BY + 90} Q ${BX - 6} ${BY + 56} ${BX - 40} ${BY + 50} Q ${BX - 6} ${BY + 44} ${BX} ${BY + 10} Z`} fill={LIME} />
        ) : null}
        <text x={400} y={1270} fontFamily={T.trophy} fontWeight={700} fontSize={104} fill={CHALK}>
          ติดกระเป๋า
        </text>
        <g transform={about(560, 1400, `scale(${frame >= keepAt ? 1 + (1 - stamp) * 1.2 : 0})`)} opacity={frame >= keepAt ? Math.min(1, stamp * 2) : 0}>
          <text x={400} y={1420} fontFamily={T.trophy} fontWeight={700} fontSize={128} fill={GOLD}>
            ถาวร
          </text>
        </g>
        {/* endless loop drawn beside the word */}
        <path
          d="M 800 1380 C 800 1330, 870 1330, 900 1380 C 930 1430, 1000 1430, 1000 1380 C 1000 1330, 930 1330, 900 1380 C 870 1430, 800 1430, 800 1380 Z"
          fill="none"
          stroke={FLAME}
          strokeWidth={14}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - loop}
        />
      </g>
    </Canvas>
  );
}
