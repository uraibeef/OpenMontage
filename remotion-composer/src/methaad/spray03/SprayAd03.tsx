/**
 * @methamamao MAKE SENSE spray ad #3 — "วิธีใช้ 3 ขั้น".
 *
 * Identity: RECIPE CARD / COOKING-SHOW STEPS. A recipe index card with the step
 * tiles dumped out of order opens it, a wind-up kitchen timer counts the steps,
 * each step gets its own kitchen prop (enamel order sign, marker notes, show
 * ribbon + chef sign-off), and the wash-out closes with shower / soap / squeegee
 * doodles. Chinese creator clips are cropped clean, warm-graded and drawn over.
 * VoiceStudio VO (public/methaspray03/vo.mp3), SFX accents, no music, no cart CTA.
 */

import { AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Flash, Glitch, PunchIn, Riso, SpeedLines } from "../../fxkit";
import { clipScale } from "../hooks/Clip";
import { Sfx, SfxId } from "../hooks/Sfx";
import { DeflateWord, RecipeCardOpen } from "./HooksOpen";
import { PushArrows, RootLoop } from "./HooksPush";
import { ServeRibbon } from "./HooksServe";
import { ShowerRain, SoapBubbles, SqueegeeClean } from "./HooksWash";
import { KitchenTimer } from "./KitchenTimer";
import { OrderSign } from "./OrderSign";
import { CEDAR, CREAM, s } from "./style";

export const SPRAY_AD_03_FPS = 30;
export const SPRAY_AD_03_SECONDS = 12.09;

/** Warm "kitchen light" grade that re-colours the borrowed creator footage. */
const KITCHEN_GRADE = "contrast(1.08) saturate(1.12) sepia(0.14) brightness(1.02)";

interface Shot {
  from: number;
  to: number;
  clip: string;
  /** Source length (s); a shorter source is slowed to fill the slot. */
  srcLen: number;
  grade?: boolean;
  glitch?: boolean;
  riso?: boolean;
}

const SHOTS: readonly Shot[] = [
  { from: 0, to: 1.2, clip: "methaspray/p04.mp4", srcLen: 2.0 },
  { from: 1.2, to: 1.95, clip: "methaad01/b12.mp4", srcLen: 2.1 },
  { from: 1.95, to: 3.1, clip: "methaad01/s02b.mp4", srcLen: 0.9, glitch: true },
  { from: 3.1, to: 4.1, clip: "methaspray03/n01.mp4", srcLen: 1.2, grade: true },
  { from: 4.1, to: 5.35, clip: "methaspray/p03.mp4", srcLen: 2.7 },
  { from: 5.35, to: 6.55, clip: "methaspray03/n02.mp4", srcLen: 1.15, grade: true },
  { from: 6.55, to: 7.52, clip: "methaspray03/n03.mp4", srcLen: 1.2, grade: true },
  { from: 7.52, to: 8.5, clip: "methaspray03/n04.mp4", srcLen: 1.05, riso: true },
  { from: 8.5, to: 9.46, clip: "methaspray03/n05.mp4", srcLen: 1.05, grade: true },
  { from: 9.46, to: 10.3, clip: "methaspray03/n06.mp4", srcLen: 0.72 },
  { from: 10.3, to: 11.1, clip: "methaad03/c01.mp4", srcLen: 1.6 },
  { from: 11.1, to: SPRAY_AD_03_SECONDS, clip: "methaspray/p01.mp4", srcLen: 1.8 },
];

/** Local frame of a global second inside a hook that starts at `start`. */
const at = (sec: number, start: number) => s(sec) - s(start);

/** One hook style per beat: [from, to, node]. */
const HOOKS: readonly [number, number, React.ReactNode][] = [
  [0, 1.95, <RecipeCardOpen key="card" tilesAt={at(1.3, 0)} />],
  [1.95, 3.1, <DeflateWord key="deflate" />],
  [3.1, 5.35, <OrderSign key="sign" tickAt={at(3.66, 3.1)} moveAt={at(4.1, 3.1)} row2At={at(4.38, 3.1)} crossAt={at(4.72, 3.1)} />],
  [5.35, 6.55, <PushArrows key="push" pushAt={at(5.95, 5.35)} />],
  [6.55, 7.52, <RootLoop key="root" loopAt={at(6.92, 6.55)} />],
  [7.52, 9.46, <ServeRibbon key="serve" ribbonAt={at(8.15, 7.52)} doneAt={at(8.96, 7.52)} />],
  [9.46, 10.3, <ShowerRain key="shower" />],
  [10.3, 11.1, <SoapBubbles key="soap" popAt={at(10.98, 10.3)} />],
  [11.1, SPRAY_AD_03_SECONDS, <SqueegeeClean key="squeegee" wipeAt={at(11.16, 11.1)} />],
  [3.1, 9.46, <KitchenTimer key="timer" step2At={at(5.35, 3.1)} step3At={at(7.52, 3.1)} ringAt={at(8.96, 3.1)} />],
];

const FX: readonly [number, number, React.ReactNode][] = [
  [6.24, 8, <SpeedLines key="speed" dur={8} cx={540} cy={820} color={CREAM} />],
  [8.96, 5, <Flash key="flash" dur={5} color={CREAM} peak={0.6} />],
];

// [sfx, VO second, volume]
const HITS: readonly [SfxId, number, number][] = [
  ["whoosh", 0.02, 0.45],
  ["pop", 1.3, 0.4],
  ["pop", 1.4, 0.4],
  ["pop", 1.5, 0.4],
  ["scratch", 1.6, 0.35],
  ["whoosh", 2.25, 0.35],
  ["pop", 3.1, 0.45],
  ["click", 3.66, 0.5],
  ["whoosh", 4.1, 0.35],
  ["scratch", 4.72, 0.4],
  ["click", 5.35, 0.5],
  ["scratch", 5.95, 0.35],
  ["scratch", 6.92, 0.35],
  ["click", 7.52, 0.5],
  ["whoosh", 8.15, 0.4],
  ["thud", 8.96, 0.55],
  ["click", 9.0, 0.4],
  ["click", 9.07, 0.4],
  ["click", 9.14, 0.4],
  ["pop", 9.46, 0.35],
  ["pop", 10.98, 0.4],
  ["pop", 11.03, 0.35],
  ["whoosh", 11.16, 0.4],
];

/** Muted footage that always fills its slot (slowed when the source is short), with a slow push. */
function Footage({ src, dur, srcLen, grade }: { src: string; dur: number; srcLen: number; grade?: boolean }) {
  const frame = useCurrentFrame();
  const rate = Math.min(1, (srcLen - 0.05) / (dur / SPRAY_AD_03_FPS));
  return (
    <AbsoluteFill style={{ overflow: "hidden", scale: clipScale(frame, dur, 1.05) }}>
      <OffthreadVideo
        src={staticFile(src)}
        muted
        playbackRate={rate}
        style={{ width: "100%", height: "100%", objectFit: "cover", filter: grade ? KITCHEN_GRADE : undefined }}
      />
    </AbsoluteFill>
  );
}

function ShotView({ shot, dur, id }: { shot: Shot; dur: number; id: string }) {
  const base = <Footage src={shot.clip} dur={dur} srcLen={shot.srcLen} grade={shot.grade} />;
  const printed = shot.riso ? (
    <Riso id={`sp3-riso-${id}`} inks={{ dark: "#27402A", mid: "#E08A5A", paper: CREAM }} mix={0.85}>
      {base}
    </Riso>
  ) : (
    base
  );
  const fx = shot.glitch ? (
    <Glitch id={`sp3-glitch-${id}`} dur={7}>
      {printed}
    </Glitch>
  ) : (
    printed
  );
  return <PunchIn amount={0.07}>{fx}</PunchIn>;
}

export function SprayAd03() {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {SHOTS.map((shot) => {
        const len = s(shot.to) - s(shot.from);
        const id = String(shot.from).replace(".", "-");
        return (
          <Sequence key={shot.from} from={s(shot.from)} durationInFrames={len}>
            <ShotView shot={shot} dur={len} id={id} />
          </Sequence>
        );
      })}
      {HOOKS.map(([from, to, node], i) => (
        <Sequence key={i} from={s(from)} durationInFrames={s(to) - s(from)}>
          {node}
        </Sequence>
      ))}
      {FX.map(([sec, frames, node]) => (
        <Sequence key={sec} from={s(sec)} durationInFrames={frames}>
          {node}
        </Sequence>
      ))}
      {HITS.map(([id, sec, vol], i) => (
        <Sfx key={i} id={id} from={s(sec)} volume={vol} />
      ))}
      <Audio src={staticFile("methaspray03/vo.mp3")} />
    </AbsoluteFill>
  );
}
