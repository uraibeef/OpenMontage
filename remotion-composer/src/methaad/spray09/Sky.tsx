import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Canvas, clamp } from "../hooks/kit";
import { BEAT, clockAt, FPS, hhmm, skyAt, T, WHITE } from "./style";

const SUNSET = 8.9;
const ARC_X0 = 110;
const ARC_X1 = 970;
const ARC_BASE = 330;
const ARC_RISE = 210;

/** Where the sun sits on its arc at a VO second (sinks after SUNSET). */
function sunPos(sec: number) {
  const p = Math.min(1, sec / SUNSET);
  const x = ARC_X0 + (ARC_X1 - ARC_X0) * p;
  const y = ARC_BASE - ARC_RISE * Math.sin(Math.PI * p);
  const sink = interpolate(sec, [SUNSET, BEAT.brand + 0.3], [0, 110], clamp);
  return { x, y: y + sink };
}

/**
 * Whole-ad atmosphere: the sky gradient hangs off the top edge and re-tints the
 * footage (soft-light) as the day goes dawn → noon glare → afternoon → dusk → night.
 */
export function SkyTint() {
  const frame = useCurrentFrame();
  const sec = frame / FPS;
  const { zenith, horizon, sun } = skyAt(sec);
  const glare = interpolate(sec, [2.5, 2.9, 3.9, 4.4], [0, 1, 1, 0], clamp);
  const tint = interpolate(sec, [0, 9.2, 9.6], [0.34, 0.34, 0.12], clamp);
  const { x, y } = sunPos(sec);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: horizon, mixBlendMode: "soft-light", opacity: tint }} />
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, ${zenith} 0px, ${zenith}CC 90px, ${horizon}8C 300px, ${horizon}00 560px)`,
        }}
      />
      {glare > 0 ? (
        <AbsoluteFill
          style={{
            background: `radial-gradient(circle at ${x}px ${y}px, ${sun} 0px, rgba(255,250,225,0.55) 180px, rgba(255,250,225,0) 900px)`,
            mixBlendMode: "screen",
            opacity: glare * 0.75,
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
}

/** The drawn sun travelling its dotted arc, trailing the wall-clock chip. */
export function SunArc() {
  const frame = useCurrentFrame();
  const sec = frame / FPS;
  const { sun, horizon } = skyAt(sec);
  const { x, y } = sunPos(sec);
  const fade = interpolate(sec, [0, 0.25, SUNSET + 0.1, BEAT.brand + 0.3], [0, 1, 1, 0], clamp);
  const noon = interpolate(sec, [2.4, 2.9, 3.9, 4.4], [0, 1, 1, 0], clamp);
  const r = 46 + noon * 8;
  const spin = frame * 0.9;
  const rays = 12;
  const rayLen = 22 + noon * 26;
  const pulse = 1 + Math.sin(frame * 0.35) * 0.06 * (0.4 + noon);
  const chipX = Math.min(Math.max(x, 150), 930);
  const moon = interpolate(sec, [BEAT.brand, BEAT.brand + 0.5], [0, 1], clamp);
  const arcD = `M ${ARC_X0} ${ARC_BASE} Q 540 ${ARC_BASE - ARC_RISE * 2} ${ARC_X1} ${ARC_BASE}`;
  return (
    <Canvas>
      <g opacity={fade}>
        <path d={arcD} fill="none" stroke={WHITE} strokeOpacity={0.5} strokeWidth={4} strokeDasharray="2 18" strokeLinecap="round" />
        <circle cx={x} cy={y} r={r * 2.4} fill={sun} opacity={0.22} />
        <g transform={`translate(${x} ${y}) rotate(${spin}) scale(${pulse})`}>
          {Array.from({ length: rays }, (_, i) => {
            const a = (i / rays) * Math.PI * 2;
            const long = i % 2 === 0 ? 1 : 0.6;
            const r0 = r + 12;
            const r1 = r0 + rayLen * long;
            return (
              <line
                key={i}
                x1={Math.cos(a) * r0}
                y1={Math.sin(a) * r0}
                x2={Math.cos(a) * r1}
                y2={Math.sin(a) * r1}
                stroke={sun}
                strokeWidth={9}
                strokeLinecap="round"
              />
            );
          })}
        </g>
        <circle cx={x} cy={y} r={r} fill={sun} stroke={WHITE} strokeOpacity={0.85} strokeWidth={5} />
        <path d={`M ${x - r * 0.55} ${y - r * 0.2} Q ${x - r * 0.35} ${y - r * 0.62} ${x + r * 0.1} ${y - r * 0.62}`} fill="none" stroke={WHITE} strokeOpacity={0.7} strokeWidth={7} strokeLinecap="round" />
        {/* wall-clock chip riding under the sun */}
        <g transform={`translate(${chipX} ${y + r + 64})`}>
          <rect x={-104} y={-40} width={208} height={72} rx={36} fill="rgba(12,16,28,0.72)" stroke={horizon} strokeWidth={3} />
          <text x={0} y={16} textAnchor="middle" fontFamily={T.clock} fontSize={46} fill={WHITE} fontWeight={600} letterSpacing={2}>
            {hhmm(clockAt(sec))}
          </text>
        </g>
      </g>
      {moon > 0 ? (
        <g opacity={moon} transform={`translate(${880} ${190 + (1 - moon) * 60})`}>
          <circle r={40} fill="#F4F1E1" />
          <circle cx={18} cy={-12} r={36} fill="#0F1733" />
          {[[-140, 30, 5], [-230, -40, 4], [60, 90, 4], [-320, 60, 3]].map(([sx, sy, sr], i) => (
            <circle key={i} cx={sx} cy={sy} r={sr * (0.8 + 0.3 * Math.sin(frame * 0.4 + i))} fill={WHITE} opacity={0.85} />
          ))}
        </g>
      ) : null}
    </Canvas>
  );
}
