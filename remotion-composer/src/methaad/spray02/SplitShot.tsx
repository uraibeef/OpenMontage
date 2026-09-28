import { AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame } from "remotion";
import { Riso } from "../../fxkit";
import { FitClip } from "../ad02/FitClip";
import { about, CEDAR, clamp, FRAME, GRAPHITE, hash, IMAGINE_INKS, NOTE, RED, S, WHITE } from "./style";

/**
 * The identity shot: a torn split-screen. Top = what he imagined (honey
 * riso gel head, "นึกว่าเหนียว"), bottom = what really happens (clean
 * hands, fluffy hair, "ไม่เหนียว"). On "อย่างที่คิด" a red X kills the top.
 */

const TEAR_Y = 950;
/** Frame (shot-local) where "อย่างที่คิด" lands. */
const STRIKE_AT = 21;
const B04_SECONDS = 2.0;
const SWAP_AT = 24;

interface PanelProps {
  src: string;
  frames: number;
  srcSeconds: number;
  /** Source scale inside the half panel. */
  zoom?: number;
  /** Pixels of the (zoomed) 9:16 source scrolled above the panel's top edge. */
  top: number;
}

function Panel({ src, frames, srcSeconds, zoom = 1, top }: PanelProps) {
  return (
    <div style={{ position: "absolute", left: -(zoom - 1) * 540, top: -top, width: 1080 * zoom, height: 1920 * zoom }}>
      <FitClip src={src} durationInFrames={frames} srcSeconds={srcSeconds} zoomTo={1.04} />
    </div>
  );
}

function tearPath(y: number, seed: number) {
  const pts = Array.from({ length: 19 }, (_, i) => `L ${i * 60} ${y + (hash(i * 5.3 + seed) - 0.5) * 34}`);
  return `M 0 ${y} ${pts.join(" ")} L 1080 ${y}`;
}

export function SplitShot({ dur }: { dur: number }) {
  const frame = useCurrentFrame();
  const slide = interpolate(frame, [0, 6], [1, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const strike = interpolate(frame, [STRIKE_AT, STRIKE_AT + 5], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const dim = interpolate(frame, [STRIKE_AT, STRIKE_AT + 6], [0, 0.45], clamp);
  const marker = interpolate(frame, [2, 9], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const upper = tearPath(TEAR_Y - 12, 1);
  const lower = tearPath(TEAR_Y + 16, 9);

  return (
    <AbsoluteFill style={{ backgroundColor: NOTE }}>
      {/* TOP: imagination */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: TEAR_Y, overflow: "hidden", transform: `translateY(${-slide * 400}px)` }}>
        <Riso id="s02-split-riso" inks={IMAGINE_INKS} grain={0.3} darkAt={0.3} midAt={0.62}>
          <Panel src="methaad01/b04.mp4" frames={dur} srcSeconds={B04_SECONDS} top={47} />
        </Riso>
        <AbsoluteFill style={{ backgroundColor: `rgba(20,20,24,${dim})` }} />
      </div>
      {/* BOTTOM: reality */}
      <div style={{ position: "absolute", left: 0, top: TEAR_Y, width: 1080, height: 1920 - TEAR_Y, overflow: "hidden", transform: `translateY(${slide * 400}px)` }}>
        <Sequence durationInFrames={SWAP_AT}>
          <Panel src="methaspray02/m07.mp4" frames={SWAP_AT} srcSeconds={0.75} zoom={1.3} top={1250} />
        </Sequence>
        <Sequence from={SWAP_AT}>
          <Panel src="methaspray02/m08.mp4" frames={dur - SWAP_AT} srcSeconds={0.75} top={114} />
        </Sequence>
      </div>
      <svg {...FRAME}>
        {/* torn paper edge between the two worlds */}
        <path d={`${upper} L 1080 ${TEAR_Y + 40} L 0 ${TEAR_Y + 40} Z`} fill={NOTE} />
        <path d={`${lower} L 1080 ${TEAR_Y - 30} L 0 ${TEAR_Y - 30} Z`} fill={WHITE} opacity={0.9} />
        <path d={upper} stroke={GRAPHITE} strokeWidth={4} fill="none" />

        {/* top label + imagined word */}
        <g transform={`translate(0 ${-slide * 400})`}>
          <rect x={760} y={210} width={270} height={96} rx={10} fill={NOTE} stroke={GRAPHITE} strokeWidth={5} transform={about(895, 258, "rotate(4)")} />
          <text x={895} y={278} textAnchor="middle" fontFamily={S.label} fontWeight={700} fontSize={62} fill={GRAPHITE} transform={about(895, 258, "rotate(4)")}>
            ในหัว
          </text>
          <text x={540} y={890} textAnchor="middle" fontFamily={S.label} fontWeight={700} fontSize={112} fill={NOTE} stroke={GRAPHITE} strokeWidth={14} strokeLinejoin="round" style={{ paintOrder: "stroke" }}>
            นึกว่าเหนียว
          </text>
        </g>
        {/* the red X on "อย่างที่คิด" */}
        <g stroke={RED} strokeWidth={34} strokeLinecap="round" fill="none" opacity={strike > 0 ? 1 : 0}>
          <path d="M 150 170 L 930 870" pathLength={1} strokeDasharray={`${Math.min(1, strike * 2)} 1`} />
          <path d="M 930 170 L 150 870" pathLength={1} strokeDasharray={`${Math.max(0, strike * 2 - 1)} 1`} />
        </g>

        {/* bottom label + real word */}
        <g transform={`translate(0 ${slide * 400})`}>
          <rect x={740} y={1030} width={300} height={96} rx={48} fill={CEDAR} />
          <text x={890} y={1098} textAnchor="middle" fontFamily={S.clean} fontWeight={800} fontSize={60} fill={WHITE}>
            ของจริง
          </text>
          <rect x={120} y={1692} width={Math.max(0.01, 840 * marker)} opacity={marker > 0.02 ? 1 : 0} height={150} rx={20} fill={WHITE} transform="rotate(-2 540 1767)" />
          <text x={540} y={1812} textAnchor="middle" fontFamily={S.clean} fontWeight={800} fontSize={140} fill={CEDAR} opacity={marker > 0.5 ? 1 : 0}>
            ไม่เหนียว
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
}
