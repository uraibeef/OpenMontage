import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Canvas, clamp, graphemes } from "../hooks/kit";
import { about, CARBON, CHALK, DUSK, GOLD, SUN, SUN_PINK, T } from "./style";

const CX = 850;
const CY = 440;
const R = 168;

/**
 * Day 5 — "ตกเย็น ทรงยังอยู่": a sunset-clock achievement. The hour hand sweeps
 * from morning to six o'clock while the sun sinks to the horizon inside the
 * dial and the sky turns dusk; "ทรงยังอยู่" then locks in letter by letter.
 */
export function SunsetClock({ duskAt, holdAt }: { duskAt: number; holdAt: number }) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 12, stiffness: 200, mass: 0.6 } });
  const exit = interpolate(frame, [durationInFrames - 5, durationInFrames], [1, 0], clamp);
  const sweep = interpolate(frame, [duskAt - 6, duskAt + 8], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const hour = 270 + sweep * 270; // 9 o'clock → 6 o'clock (540 = 180 deg)
  const minute = sweep * 360 * 9;
  const sunY = CY - 90 + sweep * 150;
  const hr = ((hour - 90) * Math.PI) / 180;
  const mr = ((minute - 90) * Math.PI) / 180;
  const dusk = interpolate(frame, [duskAt - 2, duskAt + 4], [0, 1], clamp);
  const letters = graphemes("ทรงยังอยู่");

  return (
    <AbsoluteFill>
      <Canvas>
        <defs>
          <linearGradient id="sp5-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={sweep > 0.5 ? DUSK : "#7FC4F0"} />
            <stop offset="0.75" stopColor={sweep > 0.5 ? SUN_PINK : "#CFE9F7"} />
            <stop offset="1" stopColor={sweep > 0.5 ? SUN : "#F2F7E8"} />
          </linearGradient>
          <clipPath id="sp5-dial">
            <circle cx={CX} cy={CY} r={R - 14} />
          </clipPath>
        </defs>
        <g transform={about(CX, CY, `scale(${enter * exit}) rotate(${(1 - enter) * 40})`)}>
          <circle cx={CX + 8} cy={CY + 12} r={R + 22} fill="#000" opacity={0.3} />
          {/* scalloped badge rim */}
          {Array.from({ length: 24 }, (_, i) => {
            const a = (i / 24) * Math.PI * 2;
            return <circle key={i} cx={CX + Math.cos(a) * (R + 6)} cy={CY + Math.sin(a) * (R + 6)} r={24} fill={GOLD} />;
          })}
          <circle cx={CX} cy={CY} r={R} fill={CARBON} />
          <g clipPath="url(#sp5-dial)">
            <rect x={CX - R} y={CY - R} width={R * 2} height={R * 2} fill="url(#sp5-sky)" />
            <circle cx={CX} cy={sunY} r={54} fill={sweep > 0.5 ? SUN : GOLD} />
            <rect x={CX - R} y={CY + 60} width={R * 2} height={R} fill={CARBON} />
            {[0, 1, 2].map((i) => (
              <line key={i} x1={CX - 90 + i * 20} y1={CY + 86 + i * 22} x2={CX + 90 - i * 20} y2={CY + 86 + i * 22} stroke={SUN} strokeWidth={6} strokeLinecap="round" opacity={dusk * (0.8 - i * 0.2)} />
            ))}
          </g>
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i / 12) * Math.PI * 2;
            return <circle key={i} cx={CX + Math.sin(a) * (R - 30)} cy={CY - Math.cos(a) * (R - 30)} r={i % 3 === 0 ? 8 : 4} fill={CHALK} />;
          })}
          <line x1={CX} y1={CY} x2={CX + Math.cos(mr) * (R - 44)} y2={CY + Math.sin(mr) * (R - 44)} stroke={CHALK} strokeWidth={8} strokeLinecap="round" />
          <line x1={CX} y1={CY} x2={CX + Math.cos(hr) * (R - 80)} y2={CY + Math.sin(hr) * (R - 80)} stroke={CHALK} strokeWidth={14} strokeLinecap="round" />
          <circle cx={CX} cy={CY} r={14} fill={GOLD} stroke={CARBON} strokeWidth={4} />
        </g>
      </Canvas>
      <div style={{ position: "absolute", left: 56, top: 300, opacity: enter * exit }}>
        <div
          style={{
            display: "inline-block",
            fontFamily: T.dusk,
            fontWeight: 700,
            fontSize: 62,
            color: CARBON,
            background: dusk > 0.5 ? SUN : CHALK,
            padding: "4px 26px 10px",
            borderRadius: 999,
            transform: `scale(${0.8 + dusk * 0.2})`,
            transformOrigin: "left center",
          }}
        >
          ตกเย็น
        </div>
        <div style={{ display: "flex", marginTop: 14 }}>
          {letters.map((g, i) => {
            const t = frame - holdAt - i * 1.2;
            const y = interpolate(t, [0, 5], [-70, 0], { ...clamp, easing: Easing.out(Easing.back(2.2)) });
            const o = interpolate(t, [0, 2], [0, 1], clamp);
            return (
              <span
                key={i}
                style={{
                  fontFamily: T.dusk,
                  fontWeight: 700,
                  fontSize: 104,
                  lineHeight: 1.25,
                  color: GOLD,
                  WebkitTextStroke: `12px ${CARBON}`,
                  paintOrder: "stroke",
                  transform: `translateY(${y}px)`,
                  opacity: o,
                  display: "inline-block",
                }}
              >
                {g}
              </span>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
}
