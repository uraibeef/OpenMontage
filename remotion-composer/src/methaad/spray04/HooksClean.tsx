import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { about, CAM, CEDAR, clamp, FRAME, INK, LEAF, LIFT, S, WHITE } from "./style";

/**
 * Beat 5 — "ช่วยคุมความมัน แล้วยังไม่เหนียวเหนอะหนะ".
 * The camera's exposure slider is dragged down (shine turned down), then
 * "ไม่เหนียว" is written in one smooth script stroke as fingers glide.
 */

const TRACK = { x: 930, y0: 330, y1: 1150 };

/** Vertical exposure slider: sun dragged from +3 down to 0, "คุมมัน" reads out beside it. */
export function ExposureSlide() {
  const frame = useCurrentFrame();
  const drag = interpolate(frame, [3, 16], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const knobY = TRACK.y0 + (TRACK.y1 - TRACK.y0) * (0.08 + 0.42 * drag);
  const val = (3 * (1 - drag)).toFixed(1);
  const word = interpolate(frame, [10, 16], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.6)) });

  return (
    <AbsoluteFill>
      <svg {...FRAME}>
        <path d={`M ${TRACK.x} ${TRACK.y0} V ${TRACK.y1}`} stroke={CAM} strokeWidth={5} opacity={0.8} />
        {Array.from({ length: 13 }, (_, i) => (
          <path key={i} d={`M ${TRACK.x - (i % 3 === 0 ? 22 : 12)} ${TRACK.y0 + i * ((TRACK.y1 - TRACK.y0) / 12)} h ${i % 3 === 0 ? 44 : 24}`} stroke={CAM} strokeWidth={4} opacity={0.7} />
        ))}
        <g transform={`translate(${TRACK.x} ${knobY})`}>
          <circle r={40} fill={CAM} />
          <circle r={17} fill="none" stroke={INK} strokeWidth={6} />
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i / 8) * Math.PI * 2;
            return <path key={i} d={`M ${Math.cos(a) * 23} ${Math.sin(a) * 23} L ${Math.cos(a) * 31} ${Math.sin(a) * 31}`} stroke={INK} strokeWidth={5} strokeLinecap="round" />;
          })}
          <rect x={-190} y={-34} width={130} height={68} rx={14} fill="rgba(11,11,12,0.85)" />
          <text x={-125} y={14} textAnchor="middle" fontFamily={S.ui} fontWeight={700} fontSize={40} fill={drag > 0.95 ? LEAF : CAM}>
            {drag > 0.95 ? "0.0" : `+${val}`}
          </text>
        </g>
        <path d={`M ${TRACK.x - 60} ${TRACK.y0 + 80} q -30 ${(knobY - TRACK.y0) / 2} 0 ${knobY - TRACK.y0 - 80}`} stroke={WHITE} strokeWidth={6} strokeDasharray="4 16" strokeLinecap="round" fill="none" opacity={interpolate(frame, [3, 8, 16, 20], [0, 1, 1, 0], clamp)} />
      </svg>
      <div style={{ position: "absolute", left: 70, top: 1400, transform: `scale(${word})`, transformOrigin: "0% 50%" }}>
        <div style={{ fontFamily: S.oil, fontWeight: 700, fontSize: 60, color: WHITE, textShadow: LIFT }}>ช่วย</div>
        <div style={{ fontFamily: S.oil, fontWeight: 700, fontSize: 170, lineHeight: "200px", color: INK, background: CAM, padding: "0 34px 18px", borderRadius: 18, display: "inline-block" }}>
          คุมมัน
        </div>
      </div>
    </AbsoluteFill>
  );
}

/** "ไม่เหนียว" wiped on in one smooth script stroke; a "เหนอะหนะ 0%" chip clicks in later. */
export function SmoothScript({ chipAt }: { chipAt: number }) {
  const frame = useCurrentFrame();
  const wipe = interpolate(frame, [2, 16], [0, 100], { ...clamp, easing: Easing.inOut(Easing.sin) });
  const glide = interpolate(frame, [0, 18], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const chip = interpolate(frame, [chipAt, chipAt + 5], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
  const gx = 110 + 860 * glide;

  return (
    <AbsoluteFill>
      <svg {...FRAME}>
        {/* the glide swoosh the letters ride on */}
        <path d="M 90 400 C 330 365, 660 425, 990 385" stroke={WHITE} strokeWidth={10} strokeLinecap="round" fill="none" pathLength={1} strokeDasharray={`${glide} 1`} opacity={0.9} />
        <circle cx={gx} cy={400 - Math.sin(glide * Math.PI) * 30} r={14} fill={LEAF} opacity={glide < 1 ? 1 : 0} />
      </svg>
      <div
        style={{
          position: "absolute",
          top: 170,
          width: "100%",
          textAlign: "center",
          fontFamily: S.smooth,
          fontWeight: 700,
          fontSize: 170,
          lineHeight: "210px",
          color: WHITE,
          WebkitTextStroke: `12px ${CEDAR}`,
          paintOrder: "stroke fill",
          clipPath: `inset(0 ${100 - wipe}% 0 0)`,
        }}
      >
        ไม่เหนียว
      </div>
      <svg {...FRAME}>
        <g transform={about(540, 560, `scale(${chip}) rotate(${-4 + 4 * chip})`)}>
          <rect x={250} y={496} width={580} height={128} rx={64} fill={WHITE} stroke={CEDAR} strokeWidth={8} />
          <text x={470} y={582} textAnchor="middle" fontFamily={S.smooth} fontWeight={700} fontSize={70} fill={CEDAR}>
            เหนอะหนะ
          </text>
          <text x={730} y={582} textAnchor="middle" fontFamily={S.ui} fontWeight={700} fontSize={64} fill={CEDAR}>
            0%
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
}
