/**
 * @methamamao MAKE SENSE volume spray ad #2 — "ครั้งแรก" (13.32 s).
 *
 * Angle: fictional POV of the first time using a volume spray. Identity:
 * EXPECTATION vs REALITY. What he imagines is re-printed as a graphite +
 * honey riso on notebook paper (pencil thought bubble, honey-gloop helmet);
 * what really happens is clean full-colour footage with cedar/wood/leaf
 * graphics; the two worlds meet in a torn split-screen where the imagined
 * stickiness gets a red X. A red "POV: ครั้งแรก" stamp docks top-left and
 * rides the whole ad. Ends on a drawn facepalm slap. VO, SFX, no music.
 */

import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Flash, Glitch, PunchIn, Riso, SpeedLines } from "../../fxkit";
import { FitClip } from "../ad02/FitClip";
import { Sfx, SfxId } from "../hooks/Sfx";
import { DizzyOrbit, LongWord, PalmSlap } from "./HooksEnd";
import { GooWord, PovStamp, ThoughtBubble, VolumeWord } from "./HooksImagine";
import { SproutWord, ThickWord, TodoTick, TouchRipple } from "./HooksReal";
import { AromaTrail, OrderTabs, WoodPlank } from "./HooksScent";
import { SplitShot } from "./SplitShot";
import { f, IMAGINE_INKS } from "./style";

export const SPRAY_AD_02_FPS = 30;
export const SPRAY_AD_02_SECONDS = 13.32;

const END = f(SPRAY_AD_02_SECONDS);
const SPLIT_AT = 9.25;

interface Shot {
  at: number; // VO second the shot starts
  clip: string | null; // public path without .mp4; null = drawn shot (SplitShot)
  len: number; // usable source length, seconds
  /** Imagined moment: re-print as graphite + honey riso. */
  imagine?: boolean;
  glitch?: boolean;
}

/** Cuts; each ends where the next begins. */
const SHOTS: readonly Shot[] = [
  { at: 0, clip: "methaspray/p04", len: 2.0 },
  { at: 0.9, clip: "methaspray/p01", len: 1.8 },
  { at: 1.88, clip: "methaad01/b02", len: 2.63, imagine: true, glitch: true },
  { at: 2.65, clip: "methaad01/b03", len: 2.8, imagine: true },
  { at: 3.72, clip: "methaspray/p03", len: 2.7 },
  { at: 4.68, clip: "methaspray/p05", len: 2.0 },
  { at: 5.35, clip: "methaspray02/m02", len: 1.5 },
  { at: 6.28, clip: "methaspray02/m03", len: 1.3 },
  { at: 6.95, clip: "methaspray02/m04", len: 1.4 },
  { at: 7.6, clip: "methaspray02/m05", len: 1.7 },
  { at: 8.6, clip: "methaspray02/m06", len: 1.0 },
  { at: SPLIT_AT, clip: null, len: 0 },
  { at: 10.92, clip: "methaspray02/m09", len: 1.0 },
  { at: 11.9, clip: "methaspray02/m10", len: 0.5 },
  { at: 12.45, clip: "methaspray/p06", len: 1.27 },
];

/** Hooks: [from s, to s, node]. Every beat has its own type and motion. */
const LAYERS: readonly [number, number, React.ReactNode][] = [
  [0.9, 1.88, <VolumeWord key="volume" />],
  [1.88, 2.65, <ThoughtBubble key="bubble" />],
  [2.65, 3.72, <GooWord key="goo" />],
  [3.72, 4.68, <OrderTabs key="order" />],
  [4.68, 5.35, <WoodPlank key="plank" />],
  [5.35, 6.28, <AromaTrail key="aroma" />],
  [6.28, 6.95, <TodoTick key="todo" />],
  [6.95, 7.6, <SproutWord key="sprout" />],
  [7.6, 8.6, <ThickWord key="thick" />],
  [8.6, SPLIT_AT, <TouchRipple key="touch" />],
  [10.92, 11.9, <DizzyOrbit key="dizzy" />],
  [11.9, 12.45, <PalmSlap key="slap" />],
  [12.45, SPRAY_AD_02_SECONDS, <LongWord key="long" />],
];

/** Punch FX over a cut: [VO second, frames, node]. */
const FX: readonly [number, number, React.ReactNode][] = [
  [3.72, 5, <Flash key="reality-flash" dur={5} />],
  [10.92, 10, <SpeedLines key="dizzy-lines" dur={10} cy={470} hole={620} />],
  [12.07, 9, <SpeedLines key="slap-lines" dur={9} cy={520} hole={700} color="#E4322B" />],
];

// [sfx, VO second, volume]
const HITS: readonly [SfxId, number, number][] = [
  ["thud", 0.17, 0.75],
  ["pop", 0.95, 0.45],
  ["pop", 1.02, 0.4],
  ["pop", 1.09, 0.4],
  ["pop", 1.16, 0.4],
  ["pop", 1.23, 0.4],
  ["scratch", 1.9, 0.4],
  ["pop", 2.05, 0.35],
  ["thud", 2.68, 0.5],
  ["whoosh", 3.72, 0.55],
  ["click", 3.93, 0.4],
  ["whoosh", 4.68, 0.45],
  ["thud", 4.93, 0.55],
  ["whoosh", 5.4, 0.3],
  ["click", 6.3, 0.45],
  ["scratch", 6.47, 0.45],
  ["pop", 6.97, 0.35],
  ["pop", 7.04, 0.35],
  ["pop", 7.11, 0.35],
  ["thud", 7.65, 0.5],
  ["click", 8.7, 0.5],
  ["pop", 8.72, 0.4],
  ["whoosh", SPLIT_AT, 0.5],
  ["scratch", 9.95, 0.5],
  ["thud", 10.0, 0.6],
  ["pop", 10.94, 0.4],
  ["whoosh", 11.0, 0.35],
  ["whoosh", 11.92, 0.4],
  ["thud", 12.07, 0.85],
  ["whoosh", 12.47, 0.4],
  ["pop", 12.7, 0.45],
];

function ShotView({ shot, dur }: { shot: Shot & { clip: string }; dur: number }) {
  const clip = <FitClip src={`${shot.clip}.mp4`} durationInFrames={dur} srcSeconds={shot.len} />;
  const printed = shot.imagine ? (
    <Riso id={`s02-imagine-${shot.at}`} inks={IMAGINE_INKS} grain={0.32} darkAt={0.3} midAt={0.6}>
      {clip}
    </Riso>
  ) : (
    clip
  );
  const body = shot.glitch ? <Glitch id={`s02-glitch-${shot.at}`}>{printed}</Glitch> : printed;
  return <PunchIn amount={0.07}>{body}</PunchIn>;
}

export function SprayAd02() {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {SHOTS.map((shot, i) => {
        const from = f(shot.at);
        const to = i + 1 < SHOTS.length ? f(SHOTS[i + 1].at) : END;
        const clip = shot.clip;
        return (
          <Sequence key={shot.at} from={from} durationInFrames={to - from}>
            {clip === null ? <SplitShot dur={to - from} /> : <ShotView shot={{ ...shot, clip }} dur={to - from} />}
          </Sequence>
        );
      })}
      {LAYERS.map(([from, to, node]) => (
        <Sequence key={`${from}-${to}`} from={f(from)} durationInFrames={f(to) - f(from)}>
          {node}
        </Sequence>
      ))}
      <Sequence durationInFrames={END}>
        <PovStamp />
      </Sequence>
      {FX.map(([sec, frames, node]) => (
        <Sequence key={sec} from={f(sec)} durationInFrames={frames}>
          {node}
        </Sequence>
      ))}
      {HITS.map(([id, sec, vol], i) => (
        <Sfx key={i} id={id} from={f(sec)} volume={vol} />
      ))}
      <Audio src={staticFile("methaspray02/vo.mp3")} />
    </AbsoluteFill>
  );
}
