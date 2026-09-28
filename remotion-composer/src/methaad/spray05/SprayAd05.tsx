/**
 * @methamamao MAKE SENSE spray ad #5 — "7 วันหลังใช้" as a POV streak story.
 *
 * Identity: FITNESS-APP STREAK / PROGRESS TRACKER. A "POV: 7 วัน" challenge card
 * zips into a pinned streak widget (drawn flame + flip counter + seven day-rings
 * that close 1 → 3 → 5 → 7). Each day unlocks its own achievement: an over-dose
 * warning squashed by a kettlebell, a dose gauge settling on "พอดี" with an
 * unlocked medal, a sunset clock, a water-drop badge shedding residue, then a
 * 7/7 summary ring and the "ติดกระเป๋าถาวร" card over the real bottle.
 * A different person carries each day; creator clips are cropped clean and
 * re-graded. VoiceStudio VO, SFX only, no music, no cart CTA.
 */

import { AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Flash, Glitch, PunchIn, Riso, SpeedLines } from "../../fxkit";
import { clipScale } from "../hooks/Clip";
import { Sfx, SfxId } from "../hooks/Sfx";
import { OverdoseWarning, PovCard } from "./HooksDay1";
import { DoseGauge, StyleCheck } from "./HooksDay3";
import { SunsetClock } from "./HooksDay5";
import { DropBadge } from "./HooksDay7";
import { PocketTrophy, SummaryRing } from "./HooksEnd";
import { StreakHud } from "./StreakHud";
import { CHALK, FLAME_MID, GOLD, LIME, s } from "./style";

export const SPRAY_AD_05_FPS = 30;
export const SPRAY_AD_05_SECONDS = 11.62;

type Grade = "app" | "dusk" | "cool";

/** Colour treatments that re-grade the borrowed footage per day. */
const GRADES: Record<Grade, string> = {
  app: "contrast(1.08) saturate(1.08)",
  dusk: "sepia(0.3) saturate(1.35) hue-rotate(-10deg) contrast(1.06) brightness(0.97)",
  cool: "saturate(0.9) hue-rotate(8deg) contrast(1.06) brightness(1.03)",
};

interface Shot {
  from: number;
  to: number;
  clip: string;
  /** Source length (s); a shorter source is slowed to fill the slot. */
  srcLen: number;
  grade?: Grade;
  glitch?: boolean;
  riso?: boolean;
}

const SHOTS: readonly Shot[] = [
  { from: 0, to: 0.85, clip: "methaspray/p03.mp4", srcLen: 2.7 },
  { from: 0.85, to: 1.46, clip: "methaspray05/v01.mp4", srcLen: 1.1, glitch: true },
  { from: 1.46, to: 2.4, clip: "methaspray05/v02.mp4", srcLen: 1.1 },
  { from: 2.4, to: 3.25, clip: "methaspray05/v03.mp4", srcLen: 1.1, grade: "app" },
  { from: 3.25, to: 4.1, clip: "methaspray/p06.mp4", srcLen: 1.27 },
  { from: 4.1, to: 4.96, clip: "methaspray05/v04.mp4", srcLen: 1.1, grade: "app" },
  { from: 4.96, to: 5.9, clip: "methaspray05/v05.mp4", srcLen: 1.2, grade: "dusk" },
  { from: 5.9, to: 6.9, clip: "methaspray05/v06.mp4", srcLen: 1.2, grade: "dusk" },
  { from: 6.9, to: 7.55, clip: "methaspray05/v08.mp4", srcLen: 1.0, grade: "cool" },
  { from: 7.55, to: 8.35, clip: "methaspray05/v07.mp4", srcLen: 1.1, grade: "cool" },
  { from: 8.35, to: 9.3, clip: "methaad03/c01.mp4", srcLen: 1.6, riso: true },
  { from: 9.3, to: 10.2, clip: "methaspray/p05.mp4", srcLen: 2.0 },
  { from: 10.2, to: SPRAY_AD_05_SECONDS, clip: "methaspray/p04.mp4", srcLen: 2.0 },
];

/** Local frame of a global second inside a hook that starts at `start`. */
const at = (sec: number, start: number) => s(sec) - s(start);

/** One achievement style per day: [from, to, node]. */
const HOOKS: readonly [number, number, React.ReactNode][] = [
  [0, 0.85, <PovCard key="pov" />],
  [0.58, 2.4, <OverdoseWarning key="warn" dropAt={at(1.46, 0.58)} />],
  [3.25, 4.1, <DoseGauge key="gauge" settleAt={at(3.54, 3.25)} />],
  [4.1, 4.96, <StyleCheck key="check" checkAt={at(4.26, 4.1)} />],
  [4.96, 6.9, <SunsetClock key="dusk" duskAt={at(5.5, 4.96)} holdAt={at(5.88, 4.96)} />],
  [7.55, 9.3, <DropBadge key="drop" offAt={at(8.04, 7.55)} cleanAt={at(8.36, 7.55)} />],
  [9.3, 10.2, <SummaryRing key="sum" closeAt={at(9.86, 9.3)} />],
  [10.2, SPRAY_AD_05_SECONDS, <PocketTrophy key="trophy" zipAt={at(10.5, 10.2)} keepAt={at(10.8, 10.2)} />],
  [0.7, 9.3, <StreakHud key="hud" dayAt={[at(2.4, 0.7), at(4.96, 0.7), at(6.9, 0.7)]} />],
];

const FX: readonly [number, number, React.ReactNode][] = [
  [3.54, 5, <Flash key="unlock" dur={5} color={LIME} peak={0.35} />],
  [6.9, 9, <SpeedLines key="speed" dur={9} cx={200} cy={170} color={FLAME_MID} />],
  [9.86, 4, <Flash key="ring" dur={4} color={CHALK} peak={0.4} />],
  [10.2, 6, <Flash key="trophy" dur={6} color={GOLD} peak={0.55} />],
];

// [sfx, VO second, volume]
const HITS: readonly [SfxId, number, number][] = [
  ["whoosh", 0.02, 0.45],
  ["click", 0.2, 0.35],
  ["click", 0.3, 0.35],
  ["pop", 0.58, 0.45],
  ["scratch", 0.62, 0.3],
  ["whoosh", 0.7, 0.3],
  ["whoosh", 1.46, 0.3],
  ["thud", 1.66, 0.6],
  ["whoosh", 2.4, 0.4],
  ["click", 2.45, 0.45],
  ["click", 3.28, 0.4],
  ["pop", 3.54, 0.5],
  ["click", 3.72, 0.4],
  ["scratch", 4.26, 0.4],
  ["whoosh", 4.96, 0.4],
  ["click", 5.0, 0.4],
  ["click", 5.5, 0.4],
  ["pop", 5.88, 0.4],
  ["whoosh", 6.9, 0.45],
  ["thud", 6.92, 0.4],
  ["pop", 7.58, 0.4],
  ["whoosh", 8.04, 0.35],
  ["pop", 8.36, 0.45],
  ["whoosh", 9.32, 0.4],
  ["pop", 9.86, 0.5],
  ["thud", 10.2, 0.5],
  ["scratch", 10.5, 0.45],
  ["pop", 10.8, 0.55],
];

/** Muted footage that always fills its slot (slowed when the source is short), with a slow push. */
function Footage({ src, dur, srcLen, grade }: { src: string; dur: number; srcLen: number; grade?: Grade }) {
  const frame = useCurrentFrame();
  const rate = Math.min(1, (srcLen - 0.05) / (dur / SPRAY_AD_05_FPS));
  return (
    <AbsoluteFill style={{ overflow: "hidden", scale: clipScale(frame, dur, 1.05) }}>
      <OffthreadVideo
        src={staticFile(src)}
        muted
        playbackRate={rate}
        style={{ width: "100%", height: "100%", objectFit: "cover", filter: grade ? GRADES[grade] : undefined }}
      />
      {grade === "dusk" ? (
        <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(255,94,122,0.28), rgba(255,138,61,0.12) 45%, rgba(59,42,92,0.18))", mixBlendMode: "soft-light" }} />
      ) : null}
    </AbsoluteFill>
  );
}

function ShotView({ shot, dur, id }: { shot: Shot; dur: number; id: string }) {
  const base = <Footage src={shot.clip} dur={dur} srcLen={shot.srcLen} grade={shot.grade} />;
  const printed = shot.riso ? (
    <Riso id={`sp5-riso-${id}`} inks={{ dark: "#0B3D5C", mid: "#5BC8FF", paper: "#EAF6FF" }} mix={0.8}>
      {base}
    </Riso>
  ) : (
    base
  );
  const fx = shot.glitch ? (
    <Glitch id={`sp5-glitch-${id}`} dur={7}>
      {printed}
    </Glitch>
  ) : (
    printed
  );
  return <PunchIn amount={0.07}>{fx}</PunchIn>;
}

export function SprayAd05() {
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
      <Audio src={staticFile("methaspray05/vo.mp3")} />
    </AbsoluteFill>
  );
}
