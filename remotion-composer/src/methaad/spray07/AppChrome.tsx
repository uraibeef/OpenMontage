import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { PaperGrain } from "../../fxkit";
import { BONE, CEDAR, clamp, CORAL, MINT, MUTED, NIGHT, NIGHT_2, SKY, T } from "./style";

/** Night-forest app backdrop with a faint cedar glow behind the deck. */
export function AppBackdrop() {
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 80% 55% at 50% 45%, ${NIGHT_2} 0%, ${NIGHT} 70%)` }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 110%, ${CEDAR}66 0%, transparent 45%)` }} />
      <PaperGrain id="sp07-app-grain" opacity={0.08} />
    </AbsoluteFill>
  );
}

export type Button = "nope" | "star" | "like";

/** [VO-frame, which button] — the button dips then flares when the card is swiped. */
interface ChromeProps {
  presses: readonly [number, Button][];
  clock: readonly [number, string][]; // [frame, "HH:MM"] status-bar time
  hideFrom: number; // frame the chrome fades out (match screen)
}

function Leaf({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M 0 22 C -22 4 -18 -20 0 -30 C 18 -20 22 4 0 22 Z" fill={MINT} />
      <path d="M 0 20 V -22 M 0 -2 L -8 -10 M 0 8 L 8 0" stroke={NIGHT} strokeWidth={3} strokeLinecap="round" />
    </g>
  );
}

function ActionButton({ kind, x, press }: { kind: Button; x: number; press: number }) {
  const size = kind === "star" ? 118 : 150;
  const color = kind === "nope" ? MUTED : kind === "star" ? SKY : CORAL;
  const dip = interpolate(press, [0, 3, 9], [1, 0.84, 1.14], clamp);
  const settle = press > 9 ? interpolate(press, [9, 16], [1.14, 1], clamp) : dip;
  const glow = interpolate(press, [2, 6, 18], [0, 1, 0], clamp);
  const r = size / 2;
  return (
    <g transform={`translate(${x} 1712) scale(${settle})`}>
      <circle r={r + 22 * glow} fill={color} opacity={0.3 * glow} />
      <circle r={r} fill={glow > 0.3 ? color : "#0B1813"} stroke={color} strokeWidth={4} />
      {kind === "nope" ? (
        <path d="M -24 -24 L 24 24 M 24 -24 L -24 24" stroke={glow > 0.3 ? BONE : color} strokeWidth={11} strokeLinecap="round" />
      ) : kind === "star" ? (
        <path
          d="M 0 -30 L 9 -9 L 31 -9 L 13 5 L 20 27 L 0 14 L -20 27 L -13 5 L -31 -9 L -9 -9 Z"
          fill={glow > 0.3 ? BONE : color}
          strokeLinejoin="round"
        />
      ) : (
        <path d="M 0 30 C -44 2 -40 -34 -16 -34 C -6 -34 0 -26 0 -20 C 0 -26 6 -34 16 -34 C 40 -34 44 2 0 30 Z" fill={glow > 0.3 ? BONE : color} />
      )}
    </g>
  );
}

/** App chrome: status bar, logo header and the swipe buttons under the deck. */
export function AppChrome({ presses, clock, hideFrom }: ChromeProps) {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 6, hideFrom - 4, hideFrom], [0, 1, 1, 0], clamp);
  if (o <= 0) return null;
  const time = clock.reduce((acc, [at, t]) => (frame >= at ? t : acc), clock[0][1]);
  const pressOf = (b: Button) => {
    const hit = presses.filter(([at, k]) => k === b && frame >= at).pop();
    return hit ? frame - hit[0] : 99;
  };
  const drop = interpolate(frame, [0, 10], [-40, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(0 ${drop})`}>
          <text x={70} y={74} fontFamily={T.clock} fontWeight={700} fontSize={36} fill={BONE}>{time}</text>
          <g transform="translate(900 62)" fill={BONE}>
            {[0, 1, 2, 3].map((i) => (
              <rect key={i} x={i * 13} y={-6 - i * 6} width={9} height={12 + i * 6} rx={2} />
            ))}
            <rect x={66} y={-22} width={62} height={30} rx={8} fill="none" stroke={BONE} strokeWidth={3} />
            <rect x={71} y={-17} width={44} height={20} rx={4} />
          </g>
          <Leaf x={420} y={150} s={1.25} />
          <text x={462} y={168} fontFamily={T.name} fontWeight={800} fontSize={54} fill={BONE} letterSpacing={-1}>
            match<tspan fill={MINT}>ผม</tspan>
          </text>
          <g transform="translate(92 150)" stroke={MUTED} strokeWidth={5} fill="none">
            <circle r={24} />
            <circle cy={-6} r={9} />
            <path d="M -15 17 C -10 5 10 5 15 17" />
          </g>
          <g transform="translate(988 150)" stroke={MUTED} strokeWidth={5} strokeLinecap="round">
            <path d="M -24 -12 H 24 M -24 12 H 24" />
            <circle cx={8} cy={-12} r={7} fill={NIGHT} />
            <circle cx={-8} cy={12} r={7} fill={NIGHT} />
          </g>
        </g>
        <ActionButton kind="nope" x={250} press={pressOf("nope")} />
        <ActionButton kind="star" x={540} press={pressOf("star")} />
        <ActionButton kind="like" x={830} press={pressOf("like")} />
      </svg>
    </AbsoluteFill>
  );
}
