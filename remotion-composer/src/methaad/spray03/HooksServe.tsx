import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Canvas, clamp } from "../hooks/kit";
import { about, CEDAR, CREAM, INK, T, TOMATO } from "./style";

/**
 * Beat 4 — cooking-show step ribbon "จัดทรงตามชอบ" unfurls across the top,
 * then the chef signs off "จบ" in script with a flourish (timer rings under it).
 */
export function ServeRibbon({ ribbonAt, doneAt }: { ribbonAt: number; doneAt: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const unfurl = spring({ frame: frame - ribbonAt, fps, config: { damping: 13, stiffness: 180, mass: 0.6 } });
  const wobble = Math.sin((frame - ribbonAt) * 0.5) * 2 * Math.exp(-(frame - ribbonAt) / 10);
  const sign = interpolate(frame, [doneAt, doneAt + 6], [0, 1], { ...clamp, easing: Easing.out(Easing.quad) });
  const flourish = interpolate(frame, [doneAt + 4, doneAt + 10], [0, 1], clamp);
  const burst = interpolate(frame, [doneAt + 6, doneAt + 12], [0, 1], clamp);
  const L = 370;
  const R = 1030;
  const cx = (L + R) / 2;
  return (
    <Canvas>
      <g opacity={frame >= ribbonAt ? 1 : 0} transform={about(R, 265, `scale(${unfurl} 1) rotate(${wobble - 3})`)}>
        {/* tails */}
        <path d={`M ${L + 30} 230 L ${L - 60} 222 L ${L - 20} 272 L ${L - 64} 322 L ${L + 30} 318 Z`} fill="#27402A" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
        <path d={`M ${R - 30} 230 L ${R + 50} 222 L ${R + 14} 272 L ${R + 54} 322 L ${R - 30} 318 Z`} fill="#27402A" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
        <path d={`M ${L} 188 Q ${cx} 160 ${R} 188 L ${R} 336 Q ${cx} 308 ${L} 336 Z`} fill={CEDAR} stroke={INK} strokeWidth={7} strokeLinejoin="round" />
        <path d={`M ${L + 16} 204 Q ${cx} 178 ${R - 16} 204`} stroke={CREAM} strokeWidth={3} strokeDasharray="12 10" fill="none" />
        <path d={`M ${L + 16} 320 Q ${cx} 294 ${R - 16} 320`} stroke={CREAM} strokeWidth={3} strokeDasharray="12 10" fill="none" />
        <text x={cx} y={290} textAnchor="middle" fontFamily={T.ribbon} fontWeight={600} fontSize={84} fill={CREAM}>
          จัดทรงตามชอบ
        </text>
      </g>
      <clipPath id="sp3-sign">
        <rect x={540} y={380} width={520 * sign} height={360} />
      </clipPath>
      <g clipPath="url(#sp3-sign)" transform={about(800, 560, "rotate(-8)")}>
        <text x={808} y={622} textAnchor="middle" fontFamily={T.script} fontSize={320} fill={INK}>
          จบ
        </text>
        <text x={800} y={612} textAnchor="middle" fontFamily={T.script} fontSize={320} fill={TOMATO} stroke={CREAM} strokeWidth={8} paintOrder="stroke">
          จบ
        </text>
      </g>
      <path
        d="M 600 700 C 720 660, 880 690, 1010 640 C 1040 628, 1030 600, 1000 610"
        stroke={TOMATO}
        strokeWidth={12}
        strokeLinecap="round"
        fill="none"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - flourish}
      />
      <g stroke={INK} strokeWidth={9} strokeLinecap="round" opacity={burst > 0 && burst < 1 ? 1 : 0}>
        {[-60, -20, 20].map((a) => {
          const r0 = 150 + burst * 30;
          const r1 = r0 + 40;
          const rad = (a * Math.PI) / 180;
          return <line key={a} x1={960 + Math.sin(rad) * r0} y1={470 - Math.cos(rad) * r0} x2={960 + Math.sin(rad) * r1} y2={470 - Math.cos(rad) * r1} />;
        })}
      </g>
    </Canvas>
  );
}
