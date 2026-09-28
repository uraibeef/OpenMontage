/**
 * @methamamao MAKE SENSE volume spray ad #4 — "เลิกส่องหน้า มองทรงผมบ้าง" (17.0 s).
 *
 * Angle: problem -> fix, on the account's winning hook. Identity: the
 * FRONT CAMERA. The whole ad sits inside a selfie-camera app (status bar,
 * mode strip, yellow focus UI): the focus box is dragged off the face onto
 * the hair, flat hair gets a face-shape scan, grease redlines a shine meter,
 * the spray arrives as a PORTRAIT-mode upgrade, and the deal is the shutter.
 * VO, SFX, no music.
 */

import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Flash, Glitch, PunchIn, SpeedLines } from "../../fxkit";
import { FitClip } from "../ad02/FitClip";
import { Sfx, SfxId } from "../hooks/Sfx";
import { CameraChrome } from "./CameraChrome";
import { ExposureSlide, SmoothScript } from "./HooksClean";
import { BeautyOff, BestShot, ShutterDeal, TimerNow } from "./HooksEnd";
import { FaceShape, FlatPress } from "./HooksFlat";
import { OrderSteps, PortraitUpgrade, RootLevel } from "./HooksFix";
import { ShineMeter, StickyWord } from "./HooksGrease";
import { FaceLock, FocusDrag } from "./HooksOpen";
import { f, WHITE } from "./style";

export const SPRAY_AD_04_FPS = 30;
export const SPRAY_AD_04_SECONDS = 17.00;

const END = f(SPRAY_AD_04_SECONDS);
const PORTRAIT_AT = 7.15;
const SHUTTER_AT = 15.74;
const PHOTO_AT = 15.08;

interface Shot {
  at: number; // VO second the shot starts
  clip: string; // public path without .mp4
  len: number; // usable source length, seconds
  /** Fix-side footage (creator clips): a little extra colour so it reads as "after". */
  graded?: boolean;
  glitch?: boolean;
}

/** Cuts; each ends where the next begins (cuts sit on VO pauses). */
const SHOTS: readonly Shot[] = [
  { at: 0, clip: "methaspray04/k01", len: 1.2 },
  { at: 1.13, clip: "methaspray04/k02", len: 1.4 },
  { at: 2.48, clip: "methaspray04/k03", len: 1.1, glitch: true },
  { at: 3.55, clip: "methaspray04/k04", len: 1.3 },
  { at: 4.82, clip: "methaad01/b04", len: 3.4 },
  { at: 5.76, clip: "methaad01/b02", len: 2.6 },
  { at: PORTRAIT_AT, clip: "methaspray/p03", len: 2.7 },
  { at: 8.54, clip: "methaspray04/k05", len: 0.8, graded: true },
  { at: 9.3, clip: "methaspray04/k06", len: 1.2, graded: true },
  { at: 10.46, clip: "methaspray04/k07", len: 1.0, graded: true },
  { at: 11.43, clip: "methaspray04/k09", len: 0.8, graded: true },
  { at: 12.2, clip: "methaspray04/k08", len: 0.9, graded: true },
  { at: 13.03, clip: "methaspray04/k10", len: 0.9, graded: true, glitch: true },
  { at: 13.78, clip: "methaspray04/k11", len: 1.4, graded: true },
  { at: PHOTO_AT, clip: "methaspray/p01", len: 1.8 },
  { at: SHUTTER_AT, clip: "methaspray/p04", len: 2.0 },
];

/** Hooks: [from s, to s, node]. Every beat has its own type and motion. */
const LAYERS: readonly [number, number, React.ReactNode][] = [
  [0, 1.13, <FaceLock key="face" />],
  [1.13, 2.48, <FocusDrag key="drag" />],
  [2.48, 3.55, <FlatPress key="flat" />],
  [3.55, 4.82, <FaceShape key="shape" />],
  [4.82, 5.76, <StickyWord key="sticky" />],
  [5.76, PORTRAIT_AT, <ShineMeter key="shine" />],
  [PORTRAIT_AT, 8.54, <PortraitUpgrade key="portrait" />],
  [8.54, 9.3, <OrderSteps key="order" />],
  [9.3, 10.46, <RootLevel key="root" />],
  [10.46, 11.43, <ExposureSlide key="exposure" />],
  [11.43, 13.03, <SmoothScript key="smooth" chipAt={f(12.2 - 11.43)} />],
  [13.03, 13.78, <BestShot key="best" />],
  [13.78, PHOTO_AT, <BeautyOff key="beauty" />],
  [PHOTO_AT, SHUTTER_AT, <TimerNow key="timer" />],
  [SHUTTER_AT, SPRAY_AD_04_SECONDS, <ShutterDeal key="deal" />],
];

/** Punch FX over a cut: [VO second, frames, node]. */
const FX: readonly [number, number, React.ReactNode][] = [
  [PORTRAIT_AT, 5, <Flash key="portrait-flash" dur={5} color="#FFE680" peak={0.7} />],
  [9.3, 10, <SpeedLines key="root-lines" dur={10} cy={500} hole={520} color={WHITE} />],
  [SHUTTER_AT, 6, <Flash key="shutter-flash" dur={6} peak={1} />],
];

// [sfx, VO second, volume]
const HITS: readonly [SfxId, number, number][] = [
  ["click", 0.05, 0.55],
  ["click", 0.12, 0.4],
  ["scratch", 0.72, 0.4],
  ["whoosh", 1.18, 0.5],
  ["pop", 1.58, 0.45],
  ["thud", 2.7, 0.8],
  ["whoosh", 3.55, 0.35],
  ["pop", 3.9, 0.35],
  ["click", 4.1, 0.4],
  ["pop", 4.85, 0.4],
  ["pop", 4.95, 0.35],
  ["scratch", 5.78, 0.35],
  ["thud", 6.35, 0.5],
  ["whoosh", PORTRAIT_AT, 0.55],
  ["click", 7.35, 0.45],
  ["pop", 8.56, 0.4],
  ["whoosh", 8.8, 0.35],
  ["pop", 8.98, 0.4],
  ["whoosh", 9.32, 0.55],
  ["click", 9.62, 0.4],
  ["click", 10.5, 0.4],
  ["whoosh", 10.6, 0.3],
  ["whoosh", 11.46, 0.4],
  ["pop", 12.22, 0.45],
  ["pop", 13.05, 0.5],
  ["click", 14.08, 0.45],
  ["click", PHOTO_AT, 0.35],
  ["click", 15.25, 0.35],
  ["click", 15.42, 0.35],
  ["click", SHUTTER_AT, 0.8],
  ["thud", 15.84, 0.8],
];

const GRADE = "saturate(1.18) contrast(1.06) brightness(1.03)";

function ShotView({ shot, dur }: { shot: Shot; dur: number }) {
  const clip = <FitClip src={`${shot.clip}.mp4`} durationInFrames={dur} srcSeconds={shot.len} />;
  const graded = shot.graded ? <AbsoluteFill style={{ filter: GRADE }}>{clip}</AbsoluteFill> : clip;
  const body = shot.glitch ? <Glitch id={`s04-glitch-${shot.at}`}>{graded}</Glitch> : graded;
  return <PunchIn amount={0.07}>{body}</PunchIn>;
}

export function SprayAd04() {
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
      <CameraChrome portraitAt={PORTRAIT_AT} photoAt={PHOTO_AT} />
      {HITS.map(([id, sec, vol], i) => (
        <Sfx key={i} id={id} from={f(sec)} volume={vol} />
      ))}
      <Audio src={staticFile("methaspray04/vo.mp3")} />
    </AbsoluteFill>
  );
}
