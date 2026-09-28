/**
 * @methamamao hair-powder ad #10 — "ตื่นสายวันทำงาน" (14.79 s).
 *
 * Angle: everyday life — woke up late, ten minutes to leave, the hair is
 * the last task. Identity: COUNTDOWN RACE HUD — a drawn seven-segment clock
 * ticks 10:00 → 00:03 across the whole ad (rolling minutes away on each
 * task), over a three-segment task bar; the alarm goes red at two minutes,
 * the ticket gets punched at the bus. Each beat's hook acts out its word.
 * Logan VO, SFX accents, no BGM, no cart CTA.
 */

import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Flash, Glitch, PunchIn, SpeedLines } from "../../fxkit";
import { FitClip } from "../ad02/FitClip";
import { Sfx, SfxId } from "../hooks/Sfx";
import { BusShot, DealSticker, FinishTape, KeyCard } from "./HooksFinish";
import { ScrunchWord, SprinkleWord, SquashWord, SwoopWord } from "./HooksHair";
import { AlertSlab, HangerTag, WaterWord } from "./HooksRush";
import { AlarmWord, DoorShot, HazardTape } from "./HooksWake";
import { Hud } from "./Hud";
import { f } from "./style";

export const HAIR_AD_10_FPS = 30;
export const HAIR_AD_10_SECONDS = 14.79;

const END = f(HAIR_AD_10_SECONDS);

interface Shot {
  at: number; // VO second the shot starts
  clip: string | null; // public path without .mp4; null = drawn shot (see LAYERS)
  len: number; // source length, seconds
  glitch?: boolean;
  /** Extra crop to push a burned-in watermark out of frame. */
  crop?: number;
}

/** Footage cuts; each ends where the next begins. */
const SHOTS: readonly Shot[] = [
  { at: 0, clip: "methaad10/n01", len: 1.3 },
  { at: 0.8, clip: "methaad10/n02", len: 1.6 },
  { at: 1.95, clip: null, len: 0 },
  { at: 3.05, clip: "methaad03/c01", len: 1.6 },
  { at: 4.21, clip: "methaad10/n03", len: 1.3 },
  { at: 5.06, clip: "methaad04/d03", len: 1.7 },
  { at: 5.88, clip: "methaad01/s12a", len: 1.4 },
  { at: 6.84, clip: "methaad01/b12", len: 2.1, glitch: true },
  { at: 7.7, clip: "methaad01/s02b", len: 0.9 },
  { at: 8.5, clip: "methaad01/b07", len: 1.43 },
  { at: 9.15, clip: "methaad01/s07b", len: 0.9, crop: 1.25 },
  { at: 9.76, clip: "methaad01/b08", len: 0.97 },
  { at: 10.34, clip: "methaad01/b09", len: 1.67 },
  { at: 11.52, clip: null, len: 0 },
  { at: 12.52, clip: "methaad04/d04", len: 2.1 },
  { at: 13.4, clip: "methaad01/s09b", len: 0.9 },
  { at: 14.0, clip: "methaad01/b11", len: 2.53 },
];

/** Hooks and drawn shots: [from s, to s, node]. Every beat has its own look. */
const LAYERS: readonly [number, number, React.ReactNode][] = [
  [0, 0.8, <AlarmWord key="alarm" />],
  [0.8, 1.95, <HazardTape key="tape" />],
  [1.95, 3.05, <DoorShot key="door" />],
  [3.05, 4.21, <WaterWord key="water" />],
  [4.21, 5.88, <HangerTag key="hanger" />],
  [5.88, 6.84, <AlertSlab key="alert" />],
  [6.84, 8.5, <SquashWord key="squash" />],
  [8.5, 9.76, <SprinkleWord key="sprinkle" />],
  [9.76, 10.34, <ScrunchWord key="scrunch" />],
  [10.34, 11.52, <SwoopWord key="swoop" />],
  [11.52, 12.52, <BusShot key="bus" />],
  [12.52, 13.4, <FinishTape key="finish" />],
  [13.4, 14.0, <KeyCard key="card" />],
  [14.0, HAIR_AD_10_SECONDS, <DealSticker key="deal" />],
];

/** Punch FX laid over a cut: [VO second, frames, node]. */
const FX: readonly [number, number, React.ReactNode][] = [
  [5.88, 12, <SpeedLines key="alarm-lines" dur={12} cy={1200} hole={720} />],
  [11.52, 4, <Flash key="flash" dur={4} />],
  [12.52, 10, <SpeedLines key="finish-lines" dur={10} cy={800} hole={560} />],
];

// [sfx, VO second, volume]
const HITS: readonly [SfxId, number, number][] = [
  ["click", 0.17, 0.45],
  ["click", 0.25, 0.45],
  ["click", 0.33, 0.45],
  ["click", 0.41, 0.45],
  ["thud", 0.8, 0.65],
  ["scratch", 0.86, 0.35],
  ["whoosh", 1.95, 0.5],
  ["click", 3.05, 0.4],
  ["whoosh", 3.18, 0.35],
  ["pop", 4.21, 0.45],
  ["whoosh", 4.3, 0.35],
  ["pop", 5.88, 0.45],
  ["thud", 5.9, 0.6],
  ["click", 6.1, 0.4],
  ["click", 6.37, 0.4],
  ["click", 6.64, 0.4],
  ["thud", 7.17, 0.7],
  ["scratch", 8.55, 0.35],
  ["scratch", 9.8, 0.4],
  ["scratch", 10.02, 0.4],
  ["whoosh", 10.4, 0.35],
  ["whoosh", 11.52, 0.55],
  ["thud", 11.82, 0.55],
  ["click", 12.05, 0.6],
  ["pop", 12.1, 0.4],
  ["thud", 12.7, 0.6],
  ["click", 13.63, 0.55],
  ["pop", 13.66, 0.4],
  ["thud", 14.07, 0.7],
];

function ShotView({ shot, dur }: { shot: Shot & { clip: string }; dur: number }) {
  const clip = <FitClip src={`${shot.clip}.mp4`} durationInFrames={dur} srcSeconds={shot.len} />;
  const cropped = shot.crop ? <AbsoluteFill style={{ transform: `scale(${shot.crop})`, transformOrigin: "0% 0%" }}>{clip}</AbsoluteFill> : clip;
  const body = shot.glitch ? <Glitch id={`r10-glitch-${shot.at}`}>{cropped}</Glitch> : cropped;
  return <PunchIn amount={0.07}>{body}</PunchIn>;
}

export function HairAd10() {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {SHOTS.map((shot, i) => {
        const from = f(shot.at);
        const to = i + 1 < SHOTS.length ? f(SHOTS[i + 1].at) : END;
        const clip = shot.clip;
        if (clip === null) return null;
        return (
          <Sequence key={shot.at} from={from} durationInFrames={to - from}>
            <ShotView shot={{ ...shot, clip }} dur={to - from} />
          </Sequence>
        );
      })}
      {LAYERS.map(([from, to, node]) => (
        <Sequence key={`${from}-${to}`} from={f(from)} durationInFrames={f(to) - f(from)}>
          {node}
        </Sequence>
      ))}
      <Hud />
      {FX.map(([sec, frames, node]) => (
        <Sequence key={sec} from={f(sec)} durationInFrames={frames}>
          {node}
        </Sequence>
      ))}
      {HITS.map(([id, sec, vol], i) => (
        <Sfx key={i} id={id} from={f(sec)} volume={vol} />
      ))}
      <Audio src={staticFile("methaad10/vo.mp3")} />
    </AbsoluteFill>
  );
}
