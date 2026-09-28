import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { F } from "../hooks/fonts";
import { BoilFilter, Canvas, clamp, LayeredText, usePop } from "../hooks/kit";

/**
 * Pen-and-ink hatching: a gel blob drops on a row of standing hair strands,
 * a "หนัก" weight stamp lands, and by dusk (sun sinks, moon rises) every
 * strand has folded flat. Beat timing (shot-local frames at 30 fps) follows
 * the VO: "แม่งเหนียว" 0–26, "หนัก" 26–41, "ตกเย็นก็แบนกลับเหมือนเดิม" 41–88.
 */

const INK = "#161616";
const PAPER = "#F6F0E2";
const STRANDS = 13;
const BASE_Y = 1330;

function strandPath(i: number, flat: number): string {
  const x = 170 + i * 62;
  const lean = (i - STRANDS / 2) * 4;
  const len = 360 + ((i * 37) % 60);
  // Standing: gentle S-curve upwards. Flat: folded sideways along the scalp.
  const tipX = x + lean + flat * (len * 0.85);
  const tipY = BASE_Y - len * (1 - flat * 0.93);
  const c1x = x + lean * 0.3 + flat * 60;
  const c1y = BASE_Y - len * 0.45 * (1 - flat * 0.8);
  const c2x = tipX - flat * 120 - lean * 0.4;
  const c2y = tipY + len * 0.2 * (1 - flat);
  return `M ${x} ${BASE_Y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${tipX} ${tipY}`;
}

export function ShotGelInk() {
  const frame = useCurrentFrame();
  const drop = interpolate(frame, [0, 12], [-420, 0], clamp);
  const squash = interpolate(frame, [12, 16, 22], [1, 1.25, 1], clamp);
  const flat = interpolate(frame, [30, 80], [0, 1], clamp);
  const sunY = interpolate(frame, [36, 84], [300, 760], clamp);
  const moon = interpolate(frame, [60, 84], [0, 1], clamp);
  const stamp = usePop(27, 9);
  const ribbon = usePop(44, 13);
  // Held drawing keeps its marks; boil re-seeds on 3s only.
  const jitter = Math.floor(frame / 3) % 2 === 0 ? 0 : 1.5;

  return (
    <AbsoluteFill style={{ backgroundColor: PAPER }}>
      <Canvas>
        <defs>
          <BoilFilter id="gel-boil" scale={4} />
          <pattern id="hatch" width={14} height={14} patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
            <line x1={0} y1={0} x2={0} y2={14} stroke={INK} strokeWidth={3} />
          </pattern>
          <pattern id="hatch-x" width={16} height={16} patternUnits="userSpaceOnUse" patternTransform="rotate(-40)">
            <line x1={0} y1={0} x2={0} y2={16} stroke={INK} strokeWidth={2.4} />
            <line x1={0} y1={0} x2={16} y2={0} stroke={INK} strokeWidth={2.4} />
          </pattern>
        </defs>

        <g filter="url(#gel-boil)" transform={`translate(${jitter} 0)`}>
          {/* Sky: sun sinking behind the horizon line, moon rising */}
          <circle cx={200} cy={sunY} r={70} fill="url(#hatch)" stroke={INK} strokeWidth={6} />
          {[0, 1, 2, 3, 4, 5, 6, 7].map((k) => {
            const a = (k / 8) * Math.PI * 2;
            return (
              <line
                key={k}
                x1={200 + Math.cos(a) * 95}
                y1={sunY + Math.sin(a) * 95}
                x2={200 + Math.cos(a) * 125}
                y2={sunY + Math.sin(a) * 125}
                stroke={INK}
                strokeWidth={6}
                strokeLinecap="round"
                opacity={1 - moon}
              />
            );
          })}
          <g opacity={moon} transform={`translate(880 ${interpolate(moon, [0, 1], [420, 300])})`}>
            <path d="M 40 -70 A 80 80 0 1 0 40 70 A 60 60 0 1 1 40 -70 Z" fill={INK} />
          </g>
          <line x1={60} y1={800} x2={1020} y2={800} stroke={INK} strokeWidth={4} strokeDasharray="30 18" />

          {/* Scalp: hatched band */}
          <path
            d={`M 60 ${BASE_Y} Q 540 ${BASE_Y - 40} 1020 ${BASE_Y} L 1020 ${BASE_Y + 180} L 60 ${BASE_Y + 180} Z`}
            fill="url(#hatch-x)"
            stroke={INK}
            strokeWidth={7}
          />

          {/* Hair strands — tapered by drawing twice (thick base, thin tip) */}
          {Array.from({ length: STRANDS }, (_, i) => (
            <g key={i}>
              <path d={strandPath(i, flat)} stroke={INK} strokeWidth={16} fill="none" strokeLinecap="round" />
              <path d={strandPath(i, flat)} stroke={PAPER} strokeWidth={5} fill="none" strokeLinecap="round" strokeDasharray="0 60 400" />
            </g>
          ))}

          {/* Gel blob: lands, squashes, drips */}
          <g transform={`translate(540 ${interpolate(flat, [0, 1], [900, 1150]) + drop}) scale(${squash} ${2 - squash})`}>
            <path
              d="M -210 40 C -230 -90 -90 -150 0 -140 C 110 -150 240 -80 210 40 C 190 130 -190 130 -210 40 Z"
              fill="url(#hatch)"
              stroke={INK}
              strokeWidth={9}
            />
            <path d="M -130 -60 C -110 -100 -60 -110 -30 -100" stroke={PAPER} strokeWidth={16} fill="none" strokeLinecap="round" />
            {[-120, 20, 140].map((dx, k) => (
              <path
                key={dx}
                d={`M ${dx} 100 q 12 ${40 + k * 20 + flat * 60} 0 ${70 + k * 25 + flat * 80}`}
                stroke={INK}
                strokeWidth={10}
                fill="none"
                strokeLinecap="round"
              />
            ))}
          </g>
        </g>

        {/* Weight stamp */}
        <g transform={`translate(800 1010) rotate(-12) scale(${stamp})`} opacity={stamp > 0.02 ? 1 : 0}>
          <rect x={-150} y={-80} width={300} height={160} rx={18} fill="none" stroke="#C4161C" strokeWidth={10} />
          <LayeredText text="หนัก" x={0} y={40} size={120} font={F.display} weight={900} layers={[{ fill: "#C4161C" }]} />
        </g>

        {/* Ribbon banner */}
        <g transform={`translate(540 1650) scale(${ribbon})`}>
          <path d="M -470 -70 L 470 -70 L 430 0 L 470 70 L -470 70 L -430 0 Z" fill={INK} />
          <LayeredText text="ตกเย็น = แบนกลับ" x={0} y={30} size={88} font={F.serif} weight={800} layers={[{ fill: PAPER }]} />
        </g>
      </Canvas>
    </AbsoluteFill>
  );
}
