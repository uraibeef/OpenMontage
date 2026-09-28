/**
 * @methamamao hair-powder ad #5 — "แกะกล่อง" unboxing (20.44 s).
 *
 * Identity: PRODUCT TEARDOWN SPEC SHEET. The two X'JIALO boxes are inspected
 * like an engineering part — price under a dimension line, a scan reticle,
 * colour chip, cap-height dimension, leader callouts, a protractor on the
 * flip cap, a specimen tag, a loupe on the sifter, a caliper against the palm,
 * a pocket fit test, a QTY counter, a floor-plan pin, a bag cutaway, a
 * unit-price calculator and a signed title block. Logan VO, SFX only.
 */

import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Flash, Glitch, PunchIn, SpeedLines } from "../../fxkit";
import { FitClip } from "../ad02/FitClip";
import { Sfx, SfxId } from "../hooks/Sfx";
import { HookBag, HookCounter, HookHome, HookPocket, HookProfile } from "./HooksCarry";
import { HookCalc, HookTitleBlock } from "./HooksDeal";
import { HookCallouts, HookCapHeight, HookInspect, HookPrice, HookSwatch } from "./HooksBox";
import { HookCaliper, HookLoupe, HookProtractor, HookSpecimen } from "./HooksOpen";
import { f, LINE } from "./style";

export const HAIR_AD_05_FPS = 30;
export const HAIR_AD_05_SECONDS = 20.44;

const END = f(HAIR_AD_05_SECONDS);

interface Shot {
  at: number; // VO second the cut lands on
  to: number;
  clip: string; // public path without .mp4
  src: number; // source length, s
  glitch?: boolean;
}

/** Footage cuts. Gaps (12.20–13.35, 15.57–16.98) are full-frame drawn sheets. */
const SHOTS: readonly Shot[] = [
  { at: 0, to: 0.85, clip: "methaad05/e01", src: 1.2 },
  { at: 0.85, to: 1.72, clip: "methaad05/e02", src: 1.2 },
  { at: 1.72, to: 2.6, clip: "methaad05/e03", src: 1.2 },
  { at: 2.6, to: 3.49, clip: "methaad01/s11b", src: 1.4 },
  { at: 3.49, to: 4.25, clip: "methaad05/e04", src: 1.1 },
  { at: 4.25, to: 5.15, clip: "methaad05/e05", src: 0.8, glitch: true },
  { at: 5.15, to: 6.97, clip: "methaad05/e06", src: 1.5 },
  { at: 6.97, to: 7.88, clip: "methaad05/e07", src: 1.3 },
  { at: 7.88, to: 8.9, clip: "methaad01/s06b", src: 1.2 },
  { at: 8.9, to: 10.0, clip: "methaad05/e08", src: 1.5 },
  { at: 10.0, to: 11.5, clip: "methaad05/e09", src: 1.8 },
  { at: 11.5, to: 12.2, clip: "methaad01/b06", src: 1.96 },
  { at: 13.35, to: 14.69, clip: "methaad05/e10", src: 1.4 },
  { at: 14.69, to: 15.57, clip: "methaad05/e11", src: 1.3 },
  { at: 16.98, to: 18.36, clip: "methaad05/e12", src: 1.7 },
  { at: 18.36, to: HAIR_AD_05_SECONDS, clip: "methaad01/b11", src: 2.53 },
];

/** Overlays and drawn sheets: [from s, to s, node]. Every beat has its own instrument. */
const LAYERS: readonly [number, number, React.ReactNode][] = [
  [0, 1.72, <HookPrice key="price" splitAt={f(0.9)} />],
  [1.72, 3.49, <HookInspect key="inspect" />],
  [3.49, 4.25, <HookSwatch key="swatch" />],
  [4.25, 5.15, <HookCapHeight key="caph" />],
  [5.15, 6.97, <HookCallouts key="callouts" readAt={f(6.1) - f(5.15)} />],
  [6.97, 7.88, <HookProtractor key="protractor" />],
  [7.88, 8.9, <HookSpecimen key="specimen" />],
  [8.9, 10.0, <HookLoupe key="loupe" src="methaad05/e08.mp4" dur={f(10.0) - f(8.9)} />],
  [10.0, 11.5, <HookCaliper key="caliper" />],
  [11.5, 12.2, <HookProfile key="profile" />],
  [12.2, 13.35, <PunchIn key="pocket" amount={0.05}><HookPocket /></PunchIn>],
  [13.35, 14.69, <HookCounter key="counter" />],
  [14.69, 15.57, <HookHome key="home" />],
  [15.57, 16.98, <PunchIn key="bag" amount={0.05}><HookBag /></PunchIn>],
  [16.98, 18.36, <HookCalc key="calc" />],
  [18.36, HAIR_AD_05_SECONDS, <HookTitleBlock key="title" stampAt={f(19.22) - f(18.36)} />],
];

// [sfx, VO second, volume]
const HITS: readonly [SfxId, number, number][] = [
  ["thud", 0.03, 0.6],
  ["click", 0.9, 0.4],
  ["click", 1.0, 0.4],
  ["whoosh", 1.72, 0.35],
  ["click", 2.02, 0.3],
  ["click", 2.32, 0.3],
  ["click", 2.62, 0.3],
  ["pop", 3.05, 0.45],
  ["whoosh", 3.55, 0.4],
  ["scratch", 4.25, 0.35],
  ["click", 6.1, 0.4],
  ["click", 6.24, 0.4],
  ["whoosh", 6.97, 0.5],
  ["pop", 8.12, 0.4],
  ["pop", 8.97, 0.45],
  ["whoosh", 10.0, 0.35],
  ["click", 10.74, 0.5],
  ["whoosh", 12.2, 0.5],
  ["thud", 12.8, 0.65],
  ["pop", 12.95, 0.45],
  ["click", 13.5, 0.4],
  ["click", 13.76, 0.4],
  ["pop", 15.05, 0.45],
  ["whoosh", 15.57, 0.45],
  ["thud", 16.3, 0.5],
  ["click", 17.05, 0.35],
  ["click", 17.15, 0.35],
  ["click", 17.32, 0.35],
  ["click", 17.45, 0.35],
  ["pop", 17.65, 0.5],
  ["whoosh", 18.36, 0.45],
  ["thud", 19.23, 0.8],
];

function ShotView({ shot }: { shot: Shot }) {
  const len = f(shot.to) - f(shot.at);
  const clip = <FitClip src={`${shot.clip}.mp4`} durationInFrames={len} srcSeconds={shot.src} zoomTo={1.05} />;
  const body = shot.glitch ? <Glitch id={`a5-glitch-${f(shot.at)}`}>{clip}</Glitch> : clip;
  return <PunchIn amount={0.07}>{body}</PunchIn>;
}

export function HairAd05() {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {SHOTS.map((shot) => (
        <Sequence key={shot.at} from={f(shot.at)} durationInFrames={f(shot.to) - f(shot.at)}>
          <ShotView shot={shot} />
        </Sequence>
      ))}
      <Sequence from={0} durationInFrames={12}>
        <SpeedLines dur={12} cx={540} cy={380} hole={330} color={LINE} />
      </Sequence>
      {LAYERS.map(([from, to, node]) => (
        <Sequence key={from} from={f(from)} durationInFrames={Math.min(END, f(to)) - f(from)}>
          {node}
        </Sequence>
      ))}
      <Sequence from={f(6.97)} durationInFrames={4}>
        <Flash dur={4} />
      </Sequence>
      <Sequence from={f(12.2)} durationInFrames={3}>
        <Flash dur={3} peak={0.7} />
      </Sequence>
      {HITS.map(([id, sec, vol], i) => (
        <Sfx key={i} id={id} from={f(sec)} volume={vol} />
      ))}
      <Audio src={staticFile("methaad05/vo.mp3")} />
    </AbsoluteFill>
  );
}
