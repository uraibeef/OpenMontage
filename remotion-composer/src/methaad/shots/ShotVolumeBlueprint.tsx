import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { F } from "../hooks/fonts";
import { Canvas, clamp, LayeredText, useIn, usePop } from "../hooks/kit";

/**
 * Blueprint spec sheet: a head profile draws on, its hair lies flat, powder
 * dots fall and the hair lifts — a dimension line measures the new volume.
 * Callouts pop on the VO words (shot-local frames at 30 fps):
 * "ผมพองมีวอลลุมทันที" 0–41, "ไม่มัน" 41–64, "ไม่เหนียวหัว" 64–87.
 */

const BG = "#0B3D91";
const LINE = "#EAF4FF";
const CYAN = "#6FD3FF";

const HEAD =
  "M 430 1420 C 330 1400 300 1280 320 1170 C 340 1040 430 930 560 915 C 700 900 800 990 815 1110 C 822 1170 812 1210 830 1250 C 850 1290 860 1310 838 1322 C 820 1330 812 1350 815 1380 C 818 1420 790 1440 740 1440 L 700 1440 L 690 1560";

function hairPath(lift: number): string {
  // Flat cap hugging the skull → tall crown broken into textured tufts.
  const top = interpolate(lift, [0, 1], [905, 700]);
  const tufts = 9;
  let d = "M 318 1180 C 300 1060 330 960 400 925";
  for (let k = 0; k <= tufts; k++) {
    const x = 400 + (k * 420) / tufts;
    const arc = Math.sin((k / tufts) * Math.PI);
    const peak = top - arc * 40 - (k % 2 === 0 ? lift * 55 : 0);
    const valley = top + 30 - arc * 20;
    d += ` L ${x - 18} ${valley} L ${x} ${peak}`;
  }
  d += " C 840 900 835 1000 822 1090";
  return d;
}

export function ShotVolumeBlueprint() {
  const frame = useCurrentFrame();
  const draw = useIn(0, 14);
  const lift = interpolate(frame, [10, 34], [0, 1], clamp);
  const dim = useIn(26, 10);
  const c1 = usePop(41, 12);
  const c2 = usePop(64, 12);
  const title = useIn(4, 10);

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <Canvas>
        <defs>
          <pattern id="bp-grid" width={60} height={60} patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(234,244,255,0.12)" strokeWidth={2} />
          </pattern>
        </defs>
        <rect width={1080} height={1920} fill="url(#bp-grid)" />
        {/* fold creases */}
        <line x1={540} y1={0} x2={540} y2={1920} stroke="rgba(0,0,0,0.18)" strokeWidth={3} />
        <line x1={0} y1={960} x2={1080} y2={960} stroke="rgba(255,255,255,0.08)" strokeWidth={3} />

        {/* Head profile, drawn on */}
        <path
          d={HEAD}
          fill="none"
          stroke={LINE}
          strokeWidth={7}
          strokeLinecap="round"
          strokeDasharray={2400}
          strokeDashoffset={2400 * (1 - draw)}
        />
        {/* Hair outline + inner texture strokes */}
        <path d={hairPath(lift)} fill="rgba(111,211,255,0.14)" stroke={CYAN} strokeWidth={8} strokeLinejoin="round" />
        {[0, 1, 2, 3, 4, 5].map((k) => {
          const x = 400 + k * 65;
          const h = interpolate(lift, [0, 1], [30, 150 + (k % 2) * 40]);
          return (
            <path
              key={k}
              d={`M ${x} 1000 q ${10 - k * 3} ${-h * 0.6} ${20} ${-h}`}
              stroke={CYAN}
              strokeWidth={5}
              fill="none"
              strokeLinecap="round"
              opacity={0.8}
            />
          );
        })}

        {/* Powder falling in */}
        {Array.from({ length: 22 }, (_, i) => {
          const x = 380 + ((i * 97) % 420);
          const start = (i % 7) * 2;
          const y = interpolate(frame, [start, start + 18], [560, 900 - lift * 120], clamp);
          const o = interpolate(frame, [start, start + 4, start + 18, start + 22], [0, 1, 1, 0], clamp);
          return <circle key={i} cx={x} cy={y} r={7} fill={LINE} opacity={o} />;
        })}

        {/* Dimension line: volume gained */}
        <g opacity={dim}>
          <line x1={900} y1={900} x2={900} y2={690} stroke={LINE} strokeWidth={4} />
          <line x1={870} y1={900} x2={930} y2={900} stroke={LINE} strokeWidth={4} />
          <line x1={870} y1={690} x2={930} y2={690} stroke={LINE} strokeWidth={4} />
          <line x1={830} y1={900} x2={760} y2={900} stroke={LINE} strokeWidth={3} strokeDasharray="10 8" />
          <line x1={830} y1={690} x2={620} y2={690} stroke={LINE} strokeWidth={3} strokeDasharray="10 8" />
          <LayeredText text="+ วอลลุม" x={960} y={640} size={52} font={F.tech} weight={700} anchor="middle" layers={[{ fill: LINE }]} />
        </g>

        {/* Callout 1: no oil */}
        <g transform={`translate(250 1640) scale(${c1})`}>
          <circle r={62} fill="none" stroke={LINE} strokeWidth={6} />
          <path d="M 0 -34 C 18 -8 30 8 30 22 A 30 30 0 0 1 -30 22 C -30 8 -18 -8 0 -34 Z" fill={CYAN} />
          <line x1={-44} y1={44} x2={44} y2={-44} stroke="#FF5A5A" strokeWidth={9} strokeLinecap="round" />
          <LayeredText text="ไม่มัน" x={0} y={140} size={70} font={F.tech} weight={700} layers={[{ fill: LINE }]} />
        </g>
        {/* Callout 2: not sticky */}
        <g transform={`translate(700 1640) scale(${c2})`}>
          <circle r={62} fill="none" stroke={LINE} strokeWidth={6} />
          <path d="M -30 -20 C -10 -40 10 0 30 -20 M -30 10 C -10 -10 10 30 30 10" stroke={CYAN} strokeWidth={8} fill="none" strokeLinecap="round" />
          <line x1={-44} y1={44} x2={44} y2={-44} stroke="#FF5A5A" strokeWidth={9} strokeLinecap="round" />
          <LayeredText text="ไม่เหนียว" x={0} y={140} size={70} font={F.tech} weight={700} layers={[{ fill: LINE }]} />
        </g>

        {/* Title block */}
        <g opacity={title}>
          <rect x={70} y={250} width={940} height={170} fill="none" stroke={LINE} strokeWidth={5} />
          <line x1={70} y1={330} x2={1010} y2={330} stroke={LINE} strokeWidth={3} />
          <LayeredText text="FIG. 1  แป้งเซ็ตผม" x={100} y={310} size={54} font={F.tech} weight={700} anchor="start" layers={[{ fill: LINE }]} />
          <LayeredText text="ผมพองทันทีหลังโรย" x={100} y={395} size={44} font={F.tech} weight={600} anchor="start" layers={[{ fill: CYAN }]} />
        </g>
      </Canvas>
    </AbsoluteFill>
  );
}
