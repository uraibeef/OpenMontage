/**
 * @methamamao MAKE SENSE volume spray ad #10 — "ขายแบบไม่ขาย" POV story (11.41 s).
 *
 * Angle: a fictional first-date POV; the product is only the friend's advice.
 * Identity: ROM-COM MOVIE. Letterbox bars + warm grade + grain frame every
 * shot; a script film title "เดตแรก" opens, a heart monitor flatlines on the
 * flat hair, the friend talks in cue cards, a restroom sign and a 2:00 clock
 * fogged into the mirror time the fix, the date (a silhouette) compliments
 * him and the heart line jumps, then THE END and credits starring the real
 * green bottle, with a quiet "ลด 45%". VO, SFX, no music.
 */

import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Flash, Glitch, PunchIn, SpeedLines } from "../../fxkit";
import { FitClip } from "../ad02/FitClip";
import { Sfx, SfxId } from "../hooks/Sfx";
import { GRADE, Letterbox, PovSlate } from "./Chrome";
import { CreditsRoll, TheEnd } from "./Credits";
import { HandOffCard, SprayFirstCard, StyleAfterCard } from "./CueCards";
import { DateLine, HeartJump } from "./Date";
import { FlatMonitor, TitleCard } from "./Opening";
import { MirrorClock, RestroomSign, StandUp } from "./Restroom";
import { f, ROSE, WHITE } from "./style";

export const SPRAY_AD_10_FPS = 30;
export const SPRAY_AD_10_SECONDS = 11.41;

const END = f(SPRAY_AD_10_SECONDS);

// VO line starts (brief) and key words
const FRIEND = 2.32;
const RESTROOM = 5.03;
const RISE = 6.38; // "ตั้งขึ้นมาใหม่"
const DATE = 7.44;
const JUMP = 8.4;
const THE_END = 9.17;
const CREDITS = 10.15;
const FLAT_AT = 1.22; // "แบน"
const CLOCK_ZERO = 7.2;

interface Shot {
  at: number; // VO second the shot starts
  clip: string; // public path without .mp4
  len: number; // usable source length, seconds
  glitch?: boolean;
}

/** Cuts; each ends where the next begins. */
const SHOTS: readonly Shot[] = [
  { at: 0, clip: "methaad01/b01", len: 2.26 },
  { at: 0.95, clip: "methaad01/s02b", len: 0.9 },
  { at: 1.55, clip: "methaad01/b12", len: 2.1 },
  { at: FRIEND, clip: "methaspray10/x1", len: 1.7 },
  { at: 3.35, clip: "methaspray/p03", len: 2.7 },
  { at: 4.2, clip: "methaspray/p04", len: 2.0 },
  { at: RESTROOM, clip: "methaspray10/x2", len: 1.4 },
  { at: 5.85, clip: "methaspray10/x3", len: 1.3, glitch: true },
  { at: RISE, clip: "methaspray10/x4", len: 1.5 },
  { at: DATE, clip: "methaspray10/x5", len: 1.6 },
  { at: JUMP, clip: "methaspray10/x6", len: 1.4 },
  { at: THE_END, clip: "methaspray/p05", len: 2.0 },
  { at: CREDITS, clip: "methaspray/p01", len: 1.8 },
];

/** Hooks: [from s, to s, node]. Each beat has its own type and motion. */
const LAYERS: readonly [number, number, React.ReactNode][] = [
  [0, 0.95, <TitleCard key="title" />],
  [0.95, FRIEND, <FlatMonitor key="monitor" flatAt={f(FLAT_AT) - f(0.95)} />],
  [FRIEND, 3.35, <HandOffCard key="card1" />],
  [3.35, 4.2, <SprayFirstCard key="card2" />],
  [4.2, RESTROOM, <StyleAfterCard key="card3" />],
  [RESTROOM, 5.85, <RestroomSign key="sign" />],
  [RESTROOM, DATE, <MirrorClock key="clock" dur={f(CLOCK_ZERO) - f(RESTROOM)} />],
  [RISE, DATE, <StandUp key="rise" />],
  [DATE, JUMP, <DateLine key="date" perChar={2} />],
  [JUMP, THE_END, <HeartJump key="jump" />],
  [THE_END, CREDITS, <TheEnd key="end" />],
  [CREDITS, SPRAY_AD_10_SECONDS, <CreditsRoll key="credits" />],
];

/** Punch FX over a cut: [VO second, frames, node]. (The glitch rides shot x3.) */
const FX: readonly [number, number, React.ReactNode][] = [
  [RESTROOM, 5, <Flash key="restroom-flash" dur={5} color={WHITE} peak={0.7} />],
  [RISE, 10, <SpeedLines key="rise-lines" dur={10} cy={620} hole={380} color={WHITE} />],
  [JUMP, 6, <Flash key="heart-flash" dur={6} color={ROSE} peak={0.6} />],
];

// [sfx, VO second, volume]
const HITS: readonly [SfxId, number, number][] = [
  ["whoosh", 0.02, 0.45],
  ["scratch", 0.1, 0.35],
  ["pop", 0.5, 0.45],
  ["whoosh", FRIEND, 0.45],
  ["scratch", 2.5, 0.35],
  ["whoosh", 3.35, 0.4],
  ["pop", 3.45, 0.35],
  ["pop", 3.52, 0.35],
  ["pop", 3.6, 0.35],
  ["click", 4.2, 0.55],
  ["whoosh", 4.22, 0.3],
  ["scratch", 4.55, 0.3],
  ["click", 5.08, 0.45],
  ["pop", 5.18, 0.45],
  ["whoosh", 5.85, 0.35],
  ["whoosh", RISE, 0.55],
  ["pop", RISE + 0.07, 0.3],
  ["pop", RISE + 0.14, 0.3],
  ["pop", RISE + 0.21, 0.3],
  ["pop", DATE + 0.1, 0.5],
  ["thud", THE_END + 0.03, 0.7],
  ["whoosh", CREDITS, 0.4],
  ["thud", CREDITS + 0.75, 0.75],
];

/** Mirror clock ticks while the 2:00 runs down. */
const TICKS = Array.from({ length: 8 }, (_, i) => RESTROOM + 0.2 + i * 0.28);

/** Heart monitor: two nervous beeps, the flatline tone, then a racing heart on the compliment. */
const BEEPS = [0.95, 1.15, ...Array.from({ length: 6 }, (_, i) => JUMP + 0.05 + i * 0.12)];

function ShotView({ shot, dur }: { shot: Shot; dur: number }) {
  const clip = (
    <AbsoluteFill style={{ filter: GRADE }}>
      <FitClip src={`${shot.clip}.mp4`} durationInFrames={dur} srcSeconds={shot.len} />
    </AbsoluteFill>
  );
  return <PunchIn amount={0.07}>{shot.glitch ? <Glitch id={`s10-glitch-${shot.at}`}>{clip}</Glitch> : clip}</PunchIn>;
}

export function SprayAd10() {
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
      <Letterbox closeAt={THE_END} />
      <Sequence from={0} durationInFrames={f(FRIEND)}>
        <PovSlate />
      </Sequence>
      {HITS.map(([id, sec, vol], i) => (
        <Sfx key={i} id={id} from={f(sec)} volume={vol} />
      ))}
      {TICKS.map((sec) => (
        <Sfx key={`tick-${sec}`} id="click" from={f(sec)} volume={0.28} />
      ))}
      {BEEPS.map((sec) => (
        <Sequence key={`beep-${sec}`} from={f(sec)} durationInFrames={6} layout="none">
          <Audio src={staticFile("methaspray10/beep.wav")} volume={0.5} />
        </Sequence>
      ))}
      <Sequence from={f(FLAT_AT)} durationInFrames={f(1.1)} layout="none">
        <Audio src={staticFile("methaspray10/flat.wav")} volume={0.45} />
      </Sequence>
      <Audio src={staticFile("methaspray10/vo.mp3")} />
    </AbsoluteFill>
  );
}
