import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Canvas, clamp, usePop } from "../hooks/kit";
import { about, ALARM, CARBON, CHALK, LIME, PANEL, RING_OFF, T, WARN } from "./style";

/**
 * Opener — the challenge card "POV: 7 วัน" sits on the marble beside the spraying
 * bottle; its seven segments tick in, then the card zips up into the streak widget.
 */
export function PovCard() {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 12, stiffness: 220, mass: 0.6 } });
  const fly = interpolate(frame, [durationInFrames - 6, durationInFrames], [0, 1], clamp);
  const sx = 1 - fly * 0.62;
  const tx = -fly * 520;
  const ty = -fly * 420;
  return (
    <Canvas>
      <g transform={`translate(${tx} ${ty}) ${about(760, 600, `scale(${pop * sx})`)}`} opacity={1 - fly * 0.4}>
        <rect x={498} y={318} width={540} height={560} rx={46} fill="#000" opacity={0.3} />
        <rect x={486} y={304} width={540} height={560} rx={46} fill={PANEL} stroke="rgba(243,246,238,0.16)" strokeWidth={3} />
        <rect x={526} y={346} width={196} height={78} rx={39} fill={LIME} />
        <text x={624} y={402} textAnchor="middle" fontFamily={T.hud} fontWeight={900} fontSize={56} fill={CARBON}>
          POV:
        </text>
        <text x={756} y={660} textAnchor="middle" fontFamily={T.hud} fontWeight={900} fontSize={250} fill={CHALK}>
          7
        </text>
        <text x={756} y={760} textAnchor="middle" fontFamily={T.hud} fontWeight={800} fontSize={110} fill={LIME}>
          วัน
        </text>
        {Array.from({ length: 7 }, (_, i) => {
          const on = interpolate(frame, [4 + i * 1.6, 7 + i * 1.6], [0, 1], clamp);
          return (
            <g key={i}>
              <rect x={532 + i * 68} y={800} width={56} height={22} rx={11} fill={RING_OFF} />
              <rect x={532 + i * 68} y={800} width={56 * on} height={22} rx={11} fill={i === 0 ? LIME : CHALK} opacity={i === 0 ? 1 : 0.55} />
            </g>
          );
        })}
      </g>
    </Canvas>
  );
}

/**
 * Day 1 — "ฉีดเยอะไป": an over-dose warning badge buzzes in like a phone alert
 * (hazard-striped strip, drawn triangle). At "ผมหนัก" a drawn kettlebell stamped
 * "หนัก" drops onto it and squashes the strip.
 */
export function OverdoseWarning({ dropAt }: { dropAt: number }) {
  const frame = useCurrentFrame();
  const pop = usePop(0, 10);
  const buzz = frame < 12 ? Math.sin(frame * 3.1) * (12 - frame) * 1.6 : 0;
  const fall = interpolate(frame, [dropAt, dropAt + 6], [0, 1], { ...clamp, easing: (t) => t * t });
  const landed = frame - (dropAt + 6);
  const squash = landed >= 0 ? interpolate(landed, [0, 3, 10], [1, 0.72, 0.9], clamp) : 1;
  const bellY = -520 + fall * 520 + (landed >= 0 ? interpolate(landed, [0, 3, 10], [0, 40, 22], clamp) : 0);
  const dust = landed >= 0 ? interpolate(landed, [0, 10], [0, 1], clamp) : 0;
  const stripeW = 900;
  return (
    <Canvas>
      <defs>
        <pattern id="sp5-hazard" width={44} height={44} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width={22} height={44} fill={WARN} />
          <rect x={22} width={22} height={44} fill={CARBON} />
        </pattern>
      </defs>
      {/* the alert strip, squashed from its bottom edge */}
      <g transform={`translate(${buzz} 0) ${about(540, 1790, `scale(${pop} ${pop * squash})`)}`}>
        <rect x={90} y={1590} width={stripeW} height={200} rx={26} fill="url(#sp5-hazard)" />
        <rect x={106} y={1606} width={stripeW - 32} height={168} rx={18} fill={CARBON} />
        <path d="M 196 1624 L 272 1756 L 120 1756 Z" fill={WARN} stroke={WARN} strokeWidth={14} strokeLinejoin="round" />
        <rect x={188} y={1662} width={16} height={52} rx={6} fill={CARBON} />
        <circle cx={196} cy={1732} r={9} fill={CARBON} />
        <text x={318} y={1726} fontFamily={T.warn} fontWeight={700} fontSize={104} fill={WARN} letterSpacing={2}>
          ฉีดเยอะไป
        </text>
      </g>
      {/* the kettlebell */}
      {frame >= dropAt ? (
        <g transform={`translate(0 ${bellY})`}>
          <path d="M 742 1336 Q 742 1236 842 1236 Q 942 1236 942 1336" fill="none" stroke={CARBON} strokeWidth={44} strokeLinecap="round" />
          <path d="M 742 1336 Q 742 1236 842 1236 Q 942 1236 942 1336" fill="none" stroke="#3A3F3C" strokeWidth={26} strokeLinecap="round" />
          <path d="M 700 1470 Q 690 1330 842 1318 Q 994 1330 984 1470 Q 978 1586 842 1590 Q 706 1586 700 1470 Z" fill={CARBON} stroke="#3A3F3C" strokeWidth={8} />
          <path d="M 738 1400 Q 760 1350 820 1342" stroke="rgba(255,255,255,0.28)" strokeWidth={14} fill="none" strokeLinecap="round" />
          <text x={842} y={1512} textAnchor="middle" fontFamily={T.heavy} fontSize={96} fill={ALARM} stroke={CARBON} strokeWidth={4} paintOrder="stroke">
            หนัก
          </text>
        </g>
      ) : null}
      {dust > 0 && dust < 1
        ? [-1, 1].map((k) =>
            [0, 1, 2].map((j) => (
              <circle key={`${k}-${j}`} cx={842 + k * (150 + dust * 120 + j * 30)} cy={1590 - j * 22 - dust * 30} r={(14 - j * 3) * (1 - dust * 0.6)} fill={CHALK} opacity={0.9 - dust * 0.9} />
            )),
          )
        : null}
    </Canvas>
  );
}
