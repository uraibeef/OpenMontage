import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { clipScale } from "../hooks/Clip";
import { Canvas, clamp, LayeredText, useIn, usePop } from "../hooks/kit";
import { about, CREAM, H, INK, RED } from "./style";

/** Hooks for the "problem" half of the ad: flat head, gel, heat. */

interface SquashProps {
  scene: string;
  dur: number;
  /** Matte frames available in public/matte/<scene>/ — the hook ends there. */
  count: number;
  text: string;
  y: number;
  size: number;
  /** Frame the press plate lands and flattens the word. */
  squashAt: number;
}

/** Tall poster word behind the head gets pressed flat by a slab, dust puffing out. */
export function SquashHook({ scene, dur, count, text, y, size, squashAt }: SquashProps) {
  const frame = useCurrentFrame();
  const drop = usePop(0, 14);
  const press = usePop(squashAt, 10);
  if (frame >= count) return null;

  const sy = interpolate(press, [0, 1], [1.15, 0.58]);
  const sx = interpolate(press, [0, 1], [0.94, 1.2]);
  const fall = interpolate(drop, [0, 1], [-y - size, 0]);
  const capTop = y - size * 0.8 * sy;
  const plateY = interpolate(frame, [squashAt - 6, squashAt], [-120, capTop - 64], clamp);
  const plateLift = interpolate(frame, [squashAt + 12, squashAt + 20], [0, -320], clamp);
  const depth = 9;
  const extrude = Array.from({ length: depth }, (_, i) => ({
    fill: i === 0 ? INK : "#8E1218",
    dy: (depth - i) * size * 0.016,
  }));
  const puff = interpolate(frame, [squashAt, squashAt + 14], [0, 1], clamp);

  return (
    <AbsoluteFill>
      <Canvas>
        <g transform={`translate(0 ${fall}) ${about(540, y, `scale(${sx} ${sy})`)}`}>
          <LayeredText
            text={text}
            y={y}
            size={size}
            font={H.poster}
            weight={400}
            layers={[...extrude, { stroke: INK, width: size * 0.06 }, { fill: CREAM }]}
          />
        </g>
        {frame >= squashAt - 6 ? (
          <g transform={`translate(0 ${plateY + plateLift})`}>
            <rect x={140} y={0} width={800} height={64} rx={10} fill={INK} />
            <rect x={164} y={10} width={752} height={10} rx={5} fill="#4A4A4A" />
          </g>
        ) : null}
        {puff > 0 && puff < 1
          ? [-1, 1].flatMap((side) =>
              [0, 1, 2].map((k) => (
                <circle
                  key={`${side}${k}`}
                  cx={540 + side * (size * 1.5 + puff * (60 + k * 40))}
                  cy={y - k * 26}
                  r={12 + puff * (26 + k * 10)}
                  fill={CREAM}
                  opacity={0.85 * (1 - puff)}
                />
              )),
            )
          : null}
      </Canvas>
      <AbsoluteFill style={{ scale: clipScale(frame, dur) }}>
        <Img
          src={staticFile(`matte/${scene}/${String(frame).padStart(3, "0")}.png`)}
          style={{ width: 1080, height: 1920 }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

/** The line printed on a spirit level whose bubble wobbles and settles dead flat. */
export function LevelHook({ text, y }: { text: string; y: number }) {
  const frame = useCurrentFrame();
  const slide = useIn(0, 10);
  const t = Math.max(0, frame - 6);
  const wobble = Math.exp(-t / 14) * Math.cos(t / 3.2);
  const x = interpolate(slide, [0, 1], [-1100, 0]);

  return (
    <AbsoluteFill>
      <Canvas>
        <g transform={`translate(${x} 0) ${about(540, y, `rotate(${6 * wobble})`)}`}>
          <rect x={86} y={y - 114} width={920} height={250} rx={22} fill="rgba(0,0,0,0.35)" />
          <rect x={80} y={y - 120} width={920} height={250} rx={22} fill="#F4C20D" stroke={INK} strokeWidth={8} />
          <rect x={80} y={y - 120} width={64} height={250} rx={20} fill="#2B2B2B" />
          <rect x={936} y={y - 120} width={64} height={250} rx={20} fill="#2B2B2B" />
          {Array.from({ length: 31 }, (_, k) => (
            <line
              key={k}
              x1={165 + k * 25}
              y1={y + 126}
              x2={165 + k * 25}
              y2={y + 126 - (k % 5 === 0 ? 30 : 16)}
              stroke={INK}
              strokeWidth={3}
            />
          ))}
          <rect x={400} y={y - 102} width={280} height={70} rx={35} fill="#C8F7B8" stroke={INK} strokeWidth={6} />
          <line x1={506} y1={y - 102} x2={506} y2={y - 32} stroke={INK} strokeWidth={4} />
          <line x1={574} y1={y - 102} x2={574} y2={y - 32} stroke={INK} strokeWidth={4} />
          <ellipse cx={540 + 95 * wobble} cy={y - 67} rx={32} ry={21} fill="#F6FFF2" stroke="#5E8F4E" strokeWidth={3} />
          <LayeredText text={text} y={y + 72} size={96} font={H.bold} weight={900} layers={[{ fill: INK }]} />
        </g>
      </Canvas>
    </AbsoluteFill>
  );
}

const DRIPS = [
  { dx: -250, len: 150, at: 0 },
  { dx: -115, len: 240, at: 6 },
  { dx: 25, len: 110, at: 3 },
  { dx: 160, len: 270, at: 9 },
  { dx: 265, len: 140, at: 14 },
] as const;

/** Wobbling clear-gel letters that start dripping on "หนาๆ", with a red "อย่า" tab. */
export function DripHook({ y, dripAt }: { y: number; dripAt: number }) {
  const frame = useCurrentFrame();
  const badge = usePop(0, 10);
  const pop = usePop(4, 9);
  const t = Math.max(0, frame - 4);
  const jelly = 0.14 * Math.sin(t * 0.9) * Math.exp(-t / 9);

  return (
    <AbsoluteFill>
      <Canvas>
        <defs>
          <linearGradient id="gel-fill" x1={0} y1={0} x2={0} y2={1}>
            <stop offset={0} stopColor="#E6FBFF" />
            <stop offset={0.55} stopColor="#7FD8FF" />
            <stop offset={1} stopColor="#2A9BD6" />
          </linearGradient>
        </defs>
        {DRIPS.map((d) => {
          const len = interpolate(frame, [dripAt + d.at, dripAt + d.at + 30], [0, d.len], {
            ...clamp,
            easing: Easing.in(Easing.quad),
          });
          if (len <= 0) return null;
          const x = 540 + d.dx;
          return (
            <g key={d.dx}>
              <path
                d={`M ${x - 14} ${y - 10} L ${x - 14} ${y + len} A 14 14 0 0 0 ${x + 14} ${y + len} L ${x + 14} ${y - 10} Z`}
                fill="url(#gel-fill)"
                stroke="#0B4A6B"
                strokeWidth={6}
              />
              <circle cx={x} cy={y + len + 8} r={20} fill="url(#gel-fill)" stroke="#0B4A6B" strokeWidth={6} />
            </g>
          );
        })}
        <g transform={about(540, y, `scale(${pop * (1 + jelly)} ${pop * (1 - jelly)})`)}>
          <LayeredText
            text="เจลหนาๆ"
            y={y}
            size={170}
            font={H.bold}
            weight={900}
            layers={[
              { stroke: "#0B4A6B", width: 22 },
              { fill: "url(#gel-fill)" },
              { stroke: "rgba(255,255,255,0.75)", width: 3, dx: -4, dy: -5 },
            ]}
          />
        </g>
        <g transform={`translate(250 ${y - 200}) rotate(-8) scale(${badge})`}>
          <rect x={-110} y={-58} width={220} height={116} rx={58} fill={RED} stroke={INK} strokeWidth={6} />
          <LayeredText text="อย่า" x={0} y={28} size={84} font={H.bold} weight={900} layers={[{ fill: CREAM }]} />
        </g>
      </Canvas>
    </AbsoluteFill>
  );
}

const HOT = ["#FFD23F", "#FF9F1C", "#FF5A1F", RED] as const;

interface HeatLine {
  text: string;
  at: number;
}

/** Lines slide in hotter and hotter under a heat-haze shimmer; a thermometer climbs. */
export function HeatHook({ lines, x, y, gap }: { lines: readonly HeatLine[]; x: number; y: number; gap: number }) {
  const frame = useCurrentFrame();
  const heat = interpolate(frame, [0, 100], [0, 1], clamp);
  const temp = Math.round(interpolate(heat, [0, 1], [60, 230]));
  const tube = 276 * interpolate(heat, [0, 1], [0.15, 1]);

  return (
    <AbsoluteFill>
      <Canvas>
        <defs>
          <filter id="heat-haze" filterUnits="userSpaceOnUse" x={0} y={0} width={1080} height={1920}>
            <feTurbulence type="turbulence" baseFrequency="0.012 0.06" numOctaves={2} seed={frame} result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale={6} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
        {lines.map((l, i) => {
          if (frame < l.at) return null;
          const p = interpolate(frame, [l.at, l.at + 7], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.6)) });
          return (
            <g key={l.text} filter="url(#heat-haze)" transform={`translate(${(1 - p) * -700} 0)`}>
              <LayeredText
                text={l.text}
                x={x}
                y={y + i * gap}
                size={112}
                font={H.bold}
                weight={900}
                anchor="start"
                layers={[
                  { stroke: "#1A0500", width: 20, dy: 7 },
                  { stroke: "#1A0500", width: 20 },
                  { fill: HOT[i % HOT.length] },
                ]}
              />
            </g>
          );
        })}
        <g transform="translate(930 250)">
          <rect x={-22} y={0} width={44} height={300} rx={22} fill="rgba(0,0,0,0.55)" stroke={CREAM} strokeWidth={5} />
          <rect x={-12} y={288 - tube} width={24} height={tube} rx={12} fill={RED} />
          <circle cx={0} cy={322} r={40} fill={RED} stroke={CREAM} strokeWidth={5} />
          <LayeredText
            text={`${temp}°`}
            x={0}
            y={-24}
            size={56}
            font={H.bold}
            weight={900}
            layers={[{ stroke: INK, width: 12 }, { fill: CREAM }]}
          />
        </g>
      </Canvas>
    </AbsoluteFill>
  );
}
