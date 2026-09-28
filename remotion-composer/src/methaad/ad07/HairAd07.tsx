/**
 * @methamamao hair-powder ad #7 — "POV: 7 วันแรก" (15.35 s).
 *
 * Angle: a 7-day review told as a fictional POV diary (tape label up front so
 * it never reads as a real testimonial). Identity: DIARY / HABIT TRACKER —
 * a tear-off day pad counts 1 → 3 → 5 → 7, and each day is a different
 * journal artifact: sticky note (mistake), ballpoint arrow to the root,
 * crumpled scrap, a friend's chat bubble, a stopwatch, the last diary line.
 * Different people across days (no before/after of one body). Logan VO,
 * SFX accents, no BGM, no cart CTA.
 */

import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Flash, Glitch, PunchIn, SpeedLines, TearReveal } from "../../fxkit";
import { FitClip } from "../ad02/FitClip";
import { Sfx, SfxId } from "../hooks/Sfx";
import { ChatPing } from "./ChatPing";
import { DiaryPage } from "./DiaryPage";
import { StickyNote, TapeLabel } from "./HooksDay1";
import { CrumpleWord, RootArrow } from "./HooksDay3";
import { Stopwatch } from "./Stopwatch";
import { f } from "./style";
import { TearPad } from "./TearPad";

export const HAIR_AD_07_FPS = 30;
export const HAIR_AD_07_SECONDS = 15.35;

const END = f(HAIR_AD_07_SECONDS);

interface Shot {
  at: number; // VO second the shot starts
  clip: string; // public path without .mp4
  len: number; // source length, seconds
  glitch?: boolean;
  /** Extra crop to push a burned-in watermark out of frame. */
  crop?: number;
}

/** Footage cuts; each ends where the next begins. */
const SHOTS: readonly Shot[] = [
  { at: 0, clip: "methaad01/s06b", len: 1.2 },
  { at: 0.8, clip: "methaad03/c02", len: 1.57 },
  { at: 1.66, clip: "methaad03/c03", len: 2.1, glitch: true },
  { at: 2.93, clip: "methaad01/b06", len: 1.97 },
  { at: 3.67, clip: "methaad01/b07", len: 1.43 },
  { at: 4.75, clip: "methaad01/s07b", len: 0.9, crop: 1.25 },
  { at: 5.64, clip: "methaad01/b08", len: 0.97 },
  { at: 6.61, clip: "methaad07/e01", len: 1.0 },
  { at: 7.23, clip: "methaad07/e02", len: 1.4 },
  { at: 8.29, clip: "methaad07/e03", len: 1.77 },
  { at: 9.71, clip: "methaad07/e04", len: 0.93 },
  { at: 10.35, clip: "methaad07/e05", len: 1.4 },
  { at: 11.4, clip: "methaad07/e06", len: 1.37 },
  { at: 12.41, clip: "methaad07/e07", len: 1.5 },
  { at: 13.57, clip: "methaad01/b11", len: 2.53 },
  { at: 14.5, clip: "methaad01/s11b", len: 1.4 },
];

const rel = (sec: number, from: number) => f(sec) - f(from);

/** Hooks and drawn artifacts: [from s, to s, node]. Every beat has its own look. */
const LAYERS: readonly [number, number, React.ReactNode][] = [
  [0, 0.8, <TearPad key="pad1" id="d7-pad1" first={1} tearAt={[]} variant="drop" />],
  [0, 2.93, <TapeLabel key="tape" />],
  [0.8, 2.93, <StickyNote key="note" secondAt={rel(1.66, 0.8)} />],
  [2.93, 3.67, <TearPad key="pad3" id="d7-pad3" first={1} tearAt={[3, 10]} variant="rip" />],
  [3.67, 5.64, <RootArrow key="arrow" underlineAt={rel(4.75, 3.67)} />],
  [5.64, 6.61, <CrumpleWord key="crumple" />],
  [6.61, 7.23, <TearPad key="pad5" id="d7-pad5" first={3} tearAt={[2, 7]} variant="flutter" />],
  [7.23, 9.71, <ChatPing key="chat" textAt={rel(8.29, 7.23)} />],
  [9.71, 10.35, <TearPad key="pad7" id="d7-pad7" first={5} tearAt={[1, 5]} variant="final" ringAt={12} />],
  [10.35, 12.41, <Stopwatch key="watch" startAt={2} stopAt={rel(11.95, 10.35)} moveAt={rel(11.4, 10.35) - 2} />],
  [12.41, END / 30, <DiaryPage key="diary" secondAt={rel(13.57, 12.41)} stampAt={rel(14.55, 12.41)} />],
];

/** Punch FX laid over a cut: [VO second, frames, node]. */
const FX: readonly [number, number, React.ReactNode][] = [
  [10.35, 12, <SpeedLines key="speed" dur={12} cy={820} />],
  [12.41, 10, <TearReveal key="tear" src="methaad07/tear_from.jpg" seed={7} paper="#FCF9F0" />],
  [13.57, 4, <Flash key="flash" dur={4} />],
];

// [sfx, VO second, volume]
const HITS: readonly [SfxId, number, number][] = [
  ["thud", 0.25, 0.6],
  ["pop", 0.82, 0.45],
  ["scratch", 1.66, 0.35],
  ["scratch", 3.03, 0.45],
  ["scratch", 3.27, 0.45],
  ["click", 3.72, 0.3],
  ["scratch", 5.8, 0.4],
  ["scratch", 6.1, 0.35],
  ["whoosh", 6.66, 0.45],
  ["pop", 7.25, 0.35],
  ["pop", 8.31, 0.5],
  ["scratch", 9.75, 0.45],
  ["scratch", 9.88, 0.45],
  ["click", 10.4, 0.55],
  ["whoosh", 11.33, 0.35],
  ["click", 11.95, 0.65],
  ["whoosh", 12.38, 0.5],
  ["pop", 13.58, 0.35],
  ["thud", 14.57, 0.7],
];

function ShotView({ shot, dur }: { shot: Shot; dur: number }) {
  const clip = <FitClip src={`${shot.clip}.mp4`} durationInFrames={dur} srcSeconds={shot.len} />;
  const cropped = shot.crop ? <AbsoluteFill style={{ transform: `scale(${shot.crop})`, transformOrigin: "0% 0%" }}>{clip}</AbsoluteFill> : clip;
  const body = shot.glitch ? <Glitch id={`d7-glitch-${shot.at}`}>{cropped}</Glitch> : cropped;
  return <PunchIn amount={0.07}>{body}</PunchIn>;
}

export function HairAd07() {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {SHOTS.map((shot, i) => {
        const from = f(shot.at);
        const to = i + 1 < SHOTS.length ? f(SHOTS[i + 1].at) : END;
        return (
          <Sequence key={shot.at} from={from} durationInFrames={to - from}>
            <ShotView shot={shot} dur={to - from} />
          </Sequence>
        );
      })}
      {LAYERS.map(([from, to, node]) => (
        <Sequence key={`${from}-${to}`} from={f(from)} durationInFrames={f(to) - f(from)}>
          {node}
        </Sequence>
      ))}
      {FX.map(([sec, frames, node]) => (
        <Sequence key={sec} from={f(sec)} durationInFrames={frames}>
          {node}
        </Sequence>
      ))}
      {HITS.map(([id, sec, vol], i) => (
        <Sfx key={i} id={id} from={f(sec)} volume={vol} />
      ))}
      <Audio src={staticFile("methaad07/vo.mp3")} />
    </AbsoluteFill>
  );
}
