/**
 * @methamamao MAKE SENSE volume spray ad #9 — "1 วัน 7 โมงเช้า → 6 โมงเย็น" (11.68 s).
 *
 * Identity: SKY-TIMELAPSE / WEATHER-WIDGET DAY. A drawn sun arcs across the top
 * of the frame for the whole ad, trailing a wall-clock chip, while the sky
 * gradient (and a soft-light re-grade of the footage) runs dawn → noon glare →
 * afternoon → dusk → night. Every time stamp gets its own phone-widget: lock
 * clock + alarm (07:00), weather "แดดร้อน 36°" that flips to "ไม่เยิ้ม" (12:00),
 * calendar "ประชุม" struck through (15:00), dusk map pin "ไปต่อกับเพื่อน" (18:00).
 * A hair "status" line holds high all day. The 16-hour line is shown only as
 * the brand's quote card. Creator clips are cropped clean and re-graded; the
 * split-screen panels become framed photo widgets. VO + SFX, no music.
 */

import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Flash, Glitch, PunchIn, SpeedLines } from "../../fxkit";
import { FitClip } from "../ad02/FitClip";
import { Sfx, SfxId } from "../hooks/Sfx";
import { BrandQuote } from "./BrandQuote";
import { CalendarCard, StandUp } from "./HooksAfternoon";
import { MapCard, NotFlat } from "./HooksEvening";
import { AlarmCard, LockClock, WalkOut } from "./HooksMorning";
import { WeatherCard } from "./HooksNoon";
import { PhotoShot } from "./PhotoShot";
import { SkyTint, SunArc } from "./Sky";
import { StatusLine } from "./StatusLine";
import { DUSK_PINK, s, WHITE } from "./style";

export const SPRAY_AD_09_FPS = 30;
export const SPRAY_AD_09_SECONDS = 11.68;

type Grade = "dawn" | "noon" | "pm" | "dusk" | "night";

const GRADES: Record<Grade, string> = {
  dawn: "saturate(1.05) contrast(1.05)",
  noon: "brightness(1.07) contrast(1.1) saturate(1.12)",
  pm: "sepia(0.16) saturate(1.2) contrast(1.05)",
  dusk: "saturate(1.2) hue-rotate(-8deg) contrast(1.06) brightness(0.93)",
  night: "contrast(1.05) brightness(0.92)",
};

interface Shot {
  from: number;
  to: number;
  clip: string;
  /** Usable source length (s); shorter sources are slowed to fill the slot. */
  len: number;
  grade: Grade;
  /** Split-screen panel shown as a framed photo widget: [w, h, tilt]. */
  photo?: [number, number, number];
  glitch?: boolean;
}

const SHOTS: readonly Shot[] = [
  { from: 0, to: 0.78, clip: "methaspray/p03.mp4", len: 2.7, grade: "dawn" },
  { from: 0.78, to: 1.5, clip: "methaspray/p01.mp4", len: 1.8, grade: "dawn" },
  { from: 1.5, to: 2.48, clip: "methaspray09/d01.mp4", len: 1.2, grade: "dawn" },
  { from: 2.48, to: 3.36, clip: "methaspray09/d02.mp4", len: 0.97, grade: "noon", photo: [900, 818, -2.5] },
  { from: 3.36, to: 4.33, clip: "methaspray09/d03.mp4", len: 1.1, grade: "noon" },
  { from: 4.33, to: 5.3, clip: "methaspray09/d04.mp4", len: 1.2, grade: "pm", glitch: true },
  { from: 5.3, to: 6.5, clip: "methaspray09/d05.mp4", len: 1.3, grade: "pm" },
  { from: 6.5, to: 7.45, clip: "methaspray09/d06.mp4", len: 0.97, grade: "dusk", photo: [900, 886, 2.5] },
  { from: 7.45, to: 8.3, clip: "methaspray09/d07.mp4", len: 1.1, grade: "dusk" },
  { from: 8.3, to: 9.13, clip: "methaspray09/d08.mp4", len: 1.1, grade: "dusk" },
  { from: 9.13, to: 10.35, clip: "methaspray/p04.mp4", len: 2.0, grade: "night" },
  { from: 10.35, to: SPRAY_AD_09_SECONDS, clip: "methaspray/p06.mp4", len: 1.27, grade: "night" },
];

/** Local frame of a global second inside a layer that starts at `start`. */
const at = (sec: number, start: number) => s(sec) - s(start);

/** Sun chip position at 1.55 s, where the lock clock flies to. */
const CHIP_AT_155: [number, number] = [260, 327];

const HOOKS: readonly [number, number, React.ReactNode][] = [
  [0.12, 1.55, <AlarmCard key="alarm" labelAt={at(0.62, 0.12)} />],
  [0, 1.55, <LockClock key="lock" flyTo={CHIP_AT_155} />],
  [1.5, 2.48, <WalkOut key="walk" />],
  [2.48, 4.33, <WeatherCard key="weather" hotAt={at(2.95, 2.48)} flipAt={at(3.36, 2.48)} />],
  [4.33, 5.5, <CalendarCard key="cal" doneAt={at(5.08, 4.33)} />],
  [5.45, 6.5, <StandUp key="stand" />],
  [6.5, 8.2, <MapCard key="map" pinAt={at(7.3, 6.5)} />],
  [8.28, 9.13, <NotFlat key="flat" slamAt={at(8.5, 8.28)} />],
  [9.13, SPRAY_AD_09_SECONDS, <BrandQuote key="quote" countAt={at(10.43, 9.13)} tagAt={at(11.0, 9.13)} />],
];

const FX: readonly [number, number, React.ReactNode][] = [
  [2.48, 6, <Flash key="glare" dur={6} color="#FFF6D0" peak={0.7} />],
  [5.45, 9, <SpeedLines key="up" dur={9} cx={540} cy={1600} hole={460} color={WHITE} />],
  [6.5, 6, <Flash key="dusk" dur={6} color={DUSK_PINK} peak={0.45} />],
  [9.13, 5, <Flash key="night" dur={5} color={WHITE} peak={0.5} />],
];

// [sfx, VO second, volume]
const HITS: readonly [SfxId, number, number][] = [
  ["whoosh", 0.02, 0.4],
  ["click", 0.08, 0.35],
  ["click", 0.16, 0.35],
  ["click", 0.24, 0.35],
  ["click", 0.32, 0.45],
  ["pop", 0.65, 0.35],
  ["whoosh", 1.42, 0.4],
  ["thud", 1.52, 0.4],
  ["pop", 1.62, 0.3],
  ["whoosh", 2.48, 0.45],
  ["pop", 2.95, 0.4],
  ["whoosh", 3.36, 0.4],
  ["pop", 3.6, 0.5],
  ["whoosh", 4.33, 0.45],
  ["scratch", 5.08, 0.45],
  ["pop", 5.22, 0.5],
  ["whoosh", 5.47, 0.4],
  ["pop", 5.62, 0.3],
  ["whoosh", 6.5, 0.45],
  ["scratch", 6.62, 0.3],
  ["pop", 7.3, 0.5],
  ["pop", 7.45, 0.35],
  ["whoosh", 8.33, 0.35],
  ["thud", 8.5, 0.8],
  ["pop", 8.64, 0.5],
  ["whoosh", 9.13, 0.45],
  ["pop", 9.2, 0.4],
  ["click", 10.43, 0.4],
  ["click", 10.52, 0.4],
  ["click", 10.61, 0.4],
  ["pop", 11.0, 0.5],
];

function ShotView({ shot, dur }: { shot: Shot; dur: number }) {
  const rate = Math.min(1, (shot.len - 0.05) / (dur / SPRAY_AD_09_FPS));
  const base = shot.photo ? (
    <PhotoShot src={shot.clip} w={shot.photo[0]} h={shot.photo[1]} tilt={shot.photo[2]} rate={rate} />
  ) : (
    <FitClip src={shot.clip} durationInFrames={dur} srcSeconds={shot.len} />
  );
  const graded = <AbsoluteFill style={{ filter: GRADES[shot.grade] }}>{base}</AbsoluteFill>;
  const body = shot.glitch ? (
    <Glitch id={`sp9-glitch-${String(shot.from).replace(".", "-")}`} dur={7}>
      {graded}
    </Glitch>
  ) : (
    graded
  );
  return <PunchIn amount={0.07}>{body}</PunchIn>;
}

export function SprayAd09() {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {SHOTS.map((shot) => {
        const len = s(shot.to) - s(shot.from);
        return (
          <Sequence key={shot.from} from={s(shot.from)} durationInFrames={len}>
            <ShotView shot={shot} dur={len} />
          </Sequence>
        );
      })}
      <SkyTint />
      <SunArc />
      <StatusLine />
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
      <Audio src={staticFile("methaspray09/vo.mp3")} />
    </AbsoluteFill>
  );
}
