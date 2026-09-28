import { Easing, interpolate, useCurrentFrame } from "remotion";
import { BoilFilter, Canvas, clamp } from "../hooks/kit";
import { BUTTER, CREAM, INK, T, TOMATO } from "./style";

/** Thick marker stroke with a cream keyline so it reads on busy hair. */
function Marker({ d, p, color = TOMATO, width = 20 }: { d: string; p: number; color?: string; width?: number }) {
  return (
    <>
      <path d={d} stroke={CREAM} strokeWidth={width + 14} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
      <path d={d} stroke={color} strokeWidth={width} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
    </>
  );
}

const ARROWS = [
  [250, 1060, 0],
  [540, 1010, 3],
  [830, 1060, 6],
] as const;

/** Beat 3a — "ใช้มือ / ดันขึ้น" written in marker on the wall, three arrows shove up out of the hair. */
export function PushArrows({ pushAt }: { pushAt: number }) {
  const frame = useCurrentFrame();
  const small = interpolate(frame, [pushAt - 10, pushAt - 4], [0, 1], clamp);
  const hi = interpolate(frame, [pushAt - 4, pushAt + 2], [0, 1], { ...clamp, easing: Easing.out(Easing.quad) });
  const big = interpolate(frame, [pushAt, pushAt + 8], [0, 1], clamp);
  return (
    <Canvas>
      <defs>
        <BoilFilter id="sp3-boil-push" scale={6} />
        <clipPath id="sp3-push-write">
          <rect x={120} y={260} width={900 * big} height={300} />
        </clipPath>
      </defs>
      <g filter="url(#sp3-boil-push)">
        <text x={150} y={250} fontFamily={T.marker} fontSize={78} fill={CREAM} stroke={INK} strokeWidth={10} paintOrder="stroke" opacity={small} transform={`rotate(-4 150 250)`}>
          ใช้มือ
        </text>
        <path d={`M 150 440 L ${150 + 800 * hi} 420 L ${150 + 800 * hi} 540 L 150 550 Z`} fill={BUTTER} opacity={0.92} transform="rotate(-3 540 480)" />
        <g clipPath="url(#sp3-push-write)" transform="rotate(-3 540 480)">
          <text x={170} y={520} fontFamily={T.marker} fontSize={150} fill={INK}>
            ดันขึ้น!
          </text>
        </g>
        {ARROWS.map(([x, y0, delay]) => {
          const t = frame - pushAt - delay;
          const p = interpolate(t, [0, 7], [0, 1], clamp);
          const lift = t > 7 ? -((t - 7) % 10) * 3 : 0;
          const top = 640;
          return (
            <g key={x} transform={`translate(0 ${lift})`}>
              <Marker d={`M ${x} ${y0} C ${x - 30} ${y0 - 140}, ${x + 30} ${top + 140}, ${x} ${top}`} p={p} width={22} />
              <Marker d={`M ${x - 56} ${top + 60} L ${x} ${top} L ${x + 56} ${top + 60}`} p={interpolate(t, [6, 10], [0, 1], clamp)} width={22} />
            </g>
          );
        })}
      </g>
    </Canvas>
  );
}

/** Beat 3b — the scalp line gets dashed in, "จากโคน" is written on the wall and "โคน" is looped in red. */
export function RootLoop({ loopAt }: { loopAt: number }) {
  const frame = useCurrentFrame();
  const line = interpolate(frame, [1, 10], [0, 1], clamp);
  const write = interpolate(frame, [4, 14], [0, 1], clamp);
  const lead = interpolate(frame, [10, 17], [0, 1], clamp);
  const loop = interpolate(frame, [loopAt, loopAt + 8], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  return (
    <Canvas>
      <defs>
        <BoilFilter id="sp3-boil-root" scale={5} />
        <clipPath id="sp3-root-write">
          <rect x={0} y={300} width={360 * write} height={330} />
        </clipPath>
      </defs>
      <g filter="url(#sp3-boil-root)">
        <clipPath id="sp3-root-line">
          <rect x={200} y={480} width={760 * line} height={280} />
        </clipPath>
        <g clipPath="url(#sp3-root-line)">
          <path d="M 250 700 C 420 560, 700 540, 900 640" stroke={INK} strokeWidth={16} fill="none" strokeDasharray="30 22" />
          <path d="M 250 700 C 420 560, 700 540, 900 640" stroke={BUTTER} strokeWidth={9} fill="none" strokeDasharray="30 22" />
        </g>
        <g clipPath="url(#sp3-root-write)" transform="rotate(-6 160 480)">
          <text x={40} y={400} fontFamily={T.marker} fontSize={92} fill={CREAM} stroke={INK} strokeWidth={10} paintOrder="stroke">
            จาก
          </text>
          <text x={40} y={570} fontFamily={T.marker} fontSize={124} fill={CREAM} stroke={INK} strokeWidth={12} paintOrder="stroke">
            โคน
          </text>
        </g>
        <Marker d="M 200 610 C 210 660, 230 690, 262 700" p={lead} width={12} color={INK} />
        <Marker d="M 232 668 L 266 704 L 216 716" p={interpolate(frame, [16, 19], [0, 1], clamp)} width={12} color={INK} />
        <Marker d="M 40 530 C 10 460, 190 440, 260 490 C 320 540, 270 640, 140 630 C 40 622, 20 560, 80 516" p={loop} width={14} />
      </g>
    </Canvas>
  );
}
