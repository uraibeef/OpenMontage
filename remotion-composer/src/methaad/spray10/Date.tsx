import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { graphemes } from "../hooks/kit";
import { about, BLUSH, CHERRY, clamp, CREAM, FRAME, INK, ROSE, S, WHITE } from "./style";

/**
 * Beat 4 — "เดตทักว่า วันนี้ทรงผมดีนะ".
 * The date is only a drawn silhouette at the frame edge; her line arrives in
 * a hand-lettered speech bubble. Then the heart line comes back to life —
 * not in a monitor this time but as a giant red trace spiking across frame.
 */

const HEART = "M 0 30 C -10 5, -48 5, -48 -22 C -48 -48, -12 -52, 0 -26 C 12 -52, 48 -48, 48 -22 C 48 5, 10 5, 0 30 Z";

/** `ms` = frames per grapheme for the bubble text (timed to the VO line). */
export function DateLine({ perChar }: { perChar: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const slide = spring({ frame, fps, config: { damping: 16, stiffness: 140, mass: 0.9 } });
  const bubble = spring({ frame: frame - 3, fps, config: { damping: 11, stiffness: 200, mass: 0.6 } });
  const chars = graphemes("วันนี้ทรงผมดีนะ");
  const shown = Math.floor(Math.max(0, frame - 4) / perChar) + 1;
  const hair = Math.sin(frame / 6) * 4;

  return (
    <AbsoluteFill>
      <svg {...FRAME}>
        {/* the date: a soft silhouette leaning in from the right edge, rose rim light */}
        <g transform={`translate(${1080 + (1 - slide) * 380 + 40} 40) scale(-1 1)`}>
          <path
            d={`M -40 1780 C -30 1560, 40 1470, 120 1440 C 70 1400, 40 1320, 50 1230 C 60 1110, 150 1040, 240 1060 C 330 1080, 370 1170, 360 1260 C ${352 + hair} 1330, 330 1380, 290 1420 C 350 1470, 390 1600, 400 1780 Z`}
            fill={INK}
            opacity={0.93}
          />
          <path d="M 360 1260 C 352 1330, 330 1380, 290 1420" stroke={ROSE} strokeWidth={6} fill="none" opacity={0.9} />
          <path d={`M 240 1060 C 330 1080, 370 1170, 360 1260`} stroke={ROSE} strokeWidth={6} fill="none" opacity={0.9} />
          {/* hair bun + clip */}
          <circle cx={140} cy={1090} r={52} fill={INK} />
          <path d="M 110 1060 l 50 -16" stroke={BLUSH} strokeWidth={10} strokeLinecap="round" />
        </g>
        {/* speech bubble, tail pointing down to her */}
        <g transform={about(820, 560, `scale(${bubble})`)}>
          <path d="M 110 230 H 980 Q 1010 230 1010 260 V 470 Q 1010 500 980 500 H 880 L 900 700 L 740 500 H 110 Q 80 500 80 470 V 260 Q 80 230 110 230 Z" fill={CREAM} stroke={CHERRY} strokeWidth={6} style={{ filter: "drop-shadow(0 14px 22px rgba(0,0,0,0.4))" }} />
          <path d={HEART} transform="translate(960 250) scale(0.6) rotate(12)" fill={ROSE} stroke={CREAM} strokeWidth={5} />
        </g>
      </svg>
      <div style={{ position: "absolute", top: 262, left: 80, width: 930, textAlign: "center", fontFamily: S.date, fontWeight: 700, fontSize: 118, lineHeight: "200px", color: CHERRY, whiteSpace: "nowrap", opacity: bubble > 0.6 ? 1 : 0 }}>
        {chars.map((ch, i) => (
          <span key={i} style={{ opacity: i < shown ? 1 : 0 }}>
            {ch}
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
}

const Y0 = 560;

/** Wild ECG: tall spikes every few px, the head races left→right, hearts pop off each peak. */
export function HeartJump() {
  const frame = useCurrentFrame();
  const head = interpolate(frame, [0, 14], [0, 1080], { ...clamp, easing: Easing.out(Easing.quad) });
  const pts: string[] = [];
  for (let x = 0; x <= head; x += 6) {
    const p = (x % 180) / 180;
    let v = 0;
    if (p > 0.3 && p < 0.38) v = -40 * ((p - 0.3) / 0.08);
    else if (p >= 0.38 && p < 0.46) v = -40 + 260 * ((p - 0.38) / 0.08);
    else if (p >= 0.46 && p < 0.54) v = 220 - 330 * ((p - 0.46) / 0.08);
    else if (p >= 0.54 && p < 0.6) v = -110 + 110 * ((p - 0.54) / 0.06);
    pts.push(`${x},${Y0 - v * (1 + 0.15 * Math.sin(frame / 2 + x))}`);
  }
  const peaks = [0, 1, 2, 3, 4, 5].map((i) => 180 * i + 0.46 * 180).filter((x) => x < head);
  const bpm = Math.round(interpolate(frame, [0, 16], [0, 188], clamp));

  return (
    <AbsoluteFill>
      <svg {...FRAME}>
        <polyline points={pts.join(" ")} fill="none" stroke={CHERRY} strokeWidth={14} strokeLinejoin="round" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 16px ${ROSE})` }} />
        <polyline points={pts.join(" ")} fill="none" stroke={WHITE} strokeWidth={4} strokeLinejoin="round" opacity={0.8} />
        {peaks.map((x, i) => {
          const born = (x / 1080) * 14;
          const t = interpolate(frame, [born, born + 14], [0, 1], clamp);
          return (
            <path
              key={i}
              d={HEART}
              transform={`translate(${x} ${Y0 - 220 - t * 120}) scale(${0.3 + t * 0.5}) rotate(${(i % 2 ? 1 : -1) * 14 * t})`}
              fill={i % 2 ? ROSE : CHERRY}
              stroke={CREAM}
              strokeWidth={6}
              opacity={1 - t * 0.6}
            />
          );
        })}
        <text x={1030} y={Y0 + 190} textAnchor="end" fontFamily={S.chrome} fontWeight={700} fontSize={64} fill={CREAM} stroke={INK} strokeWidth={10} style={{ paintOrder: "stroke" }}>
          {`${bpm} BPM`}
        </text>
      </svg>
    </AbsoluteFill>
  );
}
