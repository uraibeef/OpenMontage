import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Canvas, clamp, LayeredText, usePop } from "../hooks/kit";
import { about, BLUE, CREAM, H, INK, RED } from "./style";

/** Hooks for the "fix" half of the ad: powder, crumple, snip, price tag. */

/** Risograph-misprint shop sign that condenses out of a powder puff. */
export function PowderHook({ title, sub, y }: { title: string; sub: string; y: number }) {
  const frame = useCurrentFrame();
  const reveal = interpolate(frame, [0, 16], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const threshold = interpolate(reveal, [0, 1], [0.85, 0.05]);
  const subPop = usePop(18, 10);
  const K = 10;

  return (
    <AbsoluteFill>
      <Canvas>
        <defs>
          <filter id="powder-in" x="-20%" y="-60%" width="140%" height="220%">
            <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves={3} seed={4} result="n" />
            <feColorMatrix
              in="n"
              type="matrix"
              values={`0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  ${K} 0 0 0 ${-K * threshold}`}
              result="m"
            />
            <feComposite in="SourceGraphic" in2="m" operator="in" />
          </filter>
        </defs>
        {Array.from({ length: 36 }, (_, i) => {
          const a = i * 2.39996;
          const dist = interpolate(frame, [0, 22], [40, 380 + (i % 5) * 40], {
            ...clamp,
            easing: Easing.out(Easing.quad),
          });
          const o = interpolate(frame, [0, 4, 22], [0, 0.9, 0], clamp);
          return (
            <circle
              key={i}
              cx={540 + Math.cos(a) * dist}
              cy={y - 50 + Math.sin(a) * dist * 0.55}
              r={5 + (i % 4) * 2}
              fill={CREAM}
              opacity={o}
            />
          );
        })}
        <g filter={frame < 17 ? "url(#powder-in)" : undefined}>
          <rect x={80} y={y - 150} width={920} height={210} rx={18} fill={BLUE} stroke={INK} strokeWidth={8} />
          <rect x={100} y={y - 130} width={880} height={170} rx={10} fill="none" stroke={CREAM} strokeWidth={4} />
          <LayeredText
            text={title}
            y={y}
            size={130}
            font={H.poster}
            weight={400}
            layers={[
              { fill: RED, dx: -8, dy: 4 },
              { fill: BLUE, dx: 8, dy: -4 },
              { stroke: INK, width: 10 },
              { fill: CREAM },
            ]}
          />
        </g>
        <g transform={`translate(660 ${y + 115}) rotate(-6) scale(${subPop})`}>
          <LayeredText
            text={sub}
            x={0}
            y={0}
            size={86}
            font={H.script}
            weight={400}
            layers={[{ stroke: CREAM, width: 16 }, { fill: RED }]}
          />
        </g>
      </Canvas>
    </AbsoluteFill>
  );
}

const CORNERS = [
  [-1, -1],
  [0, -1.05],
  [1, -1],
  [1.04, 0],
  [1, 1],
  [0, 1.05],
  [-1, 1],
  [-1.04, 0],
] as const;
const CRUMPLE = [
  [40, 30],
  [-10, 50],
  [-50, 20],
  [-60, -10],
  [-30, -45],
  [15, -40],
  [45, -25],
  [55, 15],
] as const;

/** A paper note that gets scrunched in a fist, the word squeezed with it. */
export function ScrunchHook({ badge, word, y }: { badge: string; word: string; y: number }) {
  const frame = useCurrentFrame();
  const enter = usePop(0, 12);
  const c = interpolate(frame, [5, 13], [0, 1], { ...clamp, easing: Easing.out(Easing.quad) });
  const W = 600;
  const Hh = 340;
  const cx = 540;
  const pts = CORNERS.map(
    ([bx, by], k) => `${cx + (bx * W) / 2 + c * CRUMPLE[k][0]},${y + (by * Hh) / 2 + c * CRUMPLE[k][1]}`,
  ).join(" ");

  return (
    <AbsoluteFill>
      <Canvas>
        <g transform={about(cx, y, `rotate(${-3 - c * 5}) scale(${enter})`)}>
          <polygon points={pts} fill="rgba(0,0,0,0.35)" transform="translate(10 14)" />
          <polygon points={pts} fill="#FFF8EC" stroke={INK} strokeWidth={4} />
          <g opacity={c} stroke="rgba(0,0,0,0.2)" strokeWidth={4} fill="none">
            <path d={`M ${cx - 220} ${y - 120} L ${cx - 40} ${y + 20} L ${cx + 190} ${y - 100}`} />
            <path d={`M ${cx - 130} ${y + 150} L ${cx + 30} ${y + 10}`} />
            <path d={`M ${cx + 230} ${y + 130} L ${cx + 90} ${y + 40}`} />
          </g>
          <LayeredText
            text={badge}
            x={cx - W / 2 + 40}
            y={y - Hh / 2 + 72}
            size={60}
            font={H.bold}
            weight={900}
            anchor="start"
            layers={[{ fill: RED }]}
          />
          <g transform={about(cx, y + 40, `scale(${1 - 0.28 * c} ${1 - 0.1 * c}) skewX(${-8 * c})`)}>
            <LayeredText text={word} y={y + 80} size={210} font={H.bold} weight={900} layers={[{ fill: INK }]} />
          </g>
        </g>
      </Canvas>
    </AbsoluteFill>
  );
}

/** Scissors run along a cut line through the step word; halves fall away and the finish word lands. */
export function SnipHook({ first, word, y, snipAt }: { first: string; word: string; y: number; snipAt: number }) {
  const frame = useCurrentFrame();
  const enter = usePop(0, 12);
  const stamp = usePop(snipAt + 1, 8);
  const mid = y - 58;
  const cutX = interpolate(frame, [snipAt - 12, snipAt], [40, 1040], clamp);
  const split = interpolate(frame, [snipAt, snipAt + 10], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const blade = 16 * Math.abs(Math.sin(frame * 0.9));

  const firstText = (
    <g transform={about(540, mid, `scale(${enter})`)}>
      <LayeredText text={first} y={y} size={160} font={H.hand} weight={400} layers={[{ stroke: INK, width: 18 }, { fill: CREAM }]} />
    </g>
  );

  return (
    <AbsoluteFill>
      <Canvas>
        <defs>
          <clipPath id="snip-top">
            <rect x={0} y={0} width={1080} height={mid} />
          </clipPath>
          <clipPath id="snip-bot">
            <rect x={0} y={mid} width={1080} height={1920 - mid} />
          </clipPath>
        </defs>
        {split < 1 ? (
          <g opacity={1 - split}>
            <g clipPath="url(#snip-top)">
              <g transform={`translate(${-30 * split} ${-80 * split}) ${about(540, mid, `rotate(${-5 * split})`)}`}>{firstText}</g>
            </g>
            <g clipPath="url(#snip-bot)">
              <g transform={`translate(${30 * split} ${80 * split}) ${about(540, mid, `rotate(${4 * split})`)}`}>{firstText}</g>
            </g>
          </g>
        ) : null}
        {frame < snipAt + 2 ? (
          <>
            <line x1={40} y1={mid} x2={1040} y2={mid} stroke={CREAM} strokeWidth={5} strokeDasharray="18 12" opacity={enter} />
            {frame >= snipAt - 12 ? (
              <g transform={`translate(${cutX} ${mid})`}>
                <g transform={`rotate(${-blade})`}>
                  <path d="M 0 0 L 84 -5 L 84 5 Z" fill="#DADADA" stroke={INK} strokeWidth={4} />
                  <circle cx={-30} cy={-18} r={17} fill="none" stroke={RED} strokeWidth={9} />
                </g>
                <g transform={`rotate(${blade})`}>
                  <path d="M 0 0 L 84 5 L 84 -5 Z" fill="#DADADA" stroke={INK} strokeWidth={4} />
                  <circle cx={-30} cy={18} r={17} fill="none" stroke={RED} strokeWidth={9} />
                </g>
                <circle r={6} fill={INK} />
              </g>
            ) : null}
          </>
        ) : null}
        {frame > snipAt ? (
          <g transform={about(540, y, `scale(${interpolate(stamp, [0, 1], [2.2, 1])})`)} opacity={Math.min(1, stamp * 3)}>
            <LayeredText
              text={word}
              y={y + 30}
              size={280}
              font={H.poster}
              weight={400}
              layers={[{ fill: INK, dx: 14, dy: 14 }, { stroke: INK, width: 14 }, { fill: RED }]}
            />
          </g>
        ) : null}
      </Canvas>
    </AbsoluteFill>
  );
}

interface TagProps {
  top: number;
  flipAt: number;
  front: [string, string];
  back: [string, string];
}

/** Manila price tag dropping on a string; it swings, then flips to the deal side. */
export function TagHook({ top, flipAt, front, back }: TagProps) {
  const frame = useCurrentFrame();
  const drop = usePop(0, 12);
  const kick = frame >= flipAt ? 10 * Math.exp(-(frame - flipAt) / 12) * Math.sin((frame - flipAt) / 4) : 0;
  const swing = 16 * Math.exp(-frame / 16) * Math.cos(frame / 4.5) + kick;
  const flip = interpolate(frame, [flipAt, flipAt + 8], [0, 1], clamp);
  const showBack = flip >= 0.5;
  const sx = Math.max(0.02, Math.abs(Math.cos(flip * Math.PI)));
  const px = 540;
  const py = top;
  const hang = interpolate(drop, [0, 1], [-640, 0]);
  const [small, big] = showBack ? back : front;

  return (
    <AbsoluteFill>
      <Canvas>
        <g transform={`translate(0 ${hang}) rotate(${swing} ${px} ${py})`}>
          <line x1={px} y1={py} x2={px} y2={py + 145} stroke="#3A2A12" strokeWidth={5} />
          <circle cx={px} cy={py} r={10} fill={INK} />
          <g transform={about(px, py + 320, `scale(${sx} 1)`)}>
            <path
              d={`M ${px - 120} ${py + 110} L ${px + 120} ${py + 110} L ${px + 250} ${py + 200} L ${px + 250} ${py + 500} Q ${px + 250} ${py + 530} ${px + 220} ${py + 530} L ${px - 220} ${py + 530} Q ${px - 250} ${py + 530} ${px - 250} ${py + 500} L ${px - 250} ${py + 200} Z`}
              fill={showBack ? RED : "#E8C88A"}
              stroke="#5A3D14"
              strokeWidth={6}
            />
            <circle cx={px} cy={py + 150} r={26} fill="none" stroke="#5A3D14" strokeWidth={4} opacity={0.6} />
            <circle cx={px} cy={py + 150} r={15} fill={INK} />
            <LayeredText
              text={small}
              x={px}
              y={py + 265}
              size={66}
              font={showBack ? H.script : H.hand}
              weight={400}
              layers={[{ fill: showBack ? CREAM : "#5A3D14" }]}
            />
            <LayeredText
              text={big}
              x={px}
              y={py + 430}
              size={108}
              font={H.poster}
              weight={400}
              layers={showBack ? [{ stroke: INK, width: 12 }, { fill: CREAM }] : [{ fill: INK }]}
            />
          </g>
        </g>
      </Canvas>
    </AbsoluteFill>
  );
}
