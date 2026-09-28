/**
 * @methamamao hair-powder ad #1 — "อย่า…แต่ให้…แทน" (v5).
 *
 * Footage from the Editor Team library, pre-cut to 1080x1920 by
 * projects/metha-hair-ad-01/cut.py + cut_v5.py (captioned source clips are
 * zoomed so their burned-in text falls outside the frame). Gold @methamamao
 * pacing: each VO phrase gets 1-3 shots with a punch-in on every cut, plus
 * fxkit punches (glitch, paper tear, riso + speed lines, flash). Two beats
 * are full-frame cutaways drawn in code (ink hatching, blueprint). Every beat carries its own
 * hook style from ./hairhooks (barbershop-sign identity); no hook repeats.
 * Logan voice-over from Magnific, SFX accents, no BGM, no cart CTA.
 */

import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Flash, Glitch, PunchIn, Riso, SpeedLines, TearReveal } from "../fxkit";
import { Clip } from "./hooks/Clip";
import { DripHook, HeatHook, LevelHook, SquashHook } from "./hairhooks/HooksProblem";
import { PowderHook, ScrunchHook, SnipHook, TagHook } from "./hairhooks/HooksFix";
import { FlapHook, SprinkleHook } from "./hairhooks/HooksType";
import { Sfx, SfxId } from "./hooks/Sfx";
import { ShotDryerStills } from "./shots/ShotDryerStills";
import { ShotGelInk } from "./shots/ShotGelInk";
import { ShotVolumeBlueprint } from "./shots/ShotVolumeBlueprint";

export const HAIR_AD_01_FPS = 30;
const DIR = "methaad01";
const s = (sec: number) => Math.round(sec * HAIR_AD_01_FPS);

interface Shot {
  /** VO second this shot ends; defaults to the end of its beat. */
  to?: number;
  clip?: string; // footage in public/methaad01
  Cut?: React.ComponentType; // full-frame drawn cutaway instead of footage
  /** Re-print the shot as a two-colour riso. */
  riso?: boolean;
  /** Open the shot with a scan-slice glitch. */
  glitch?: boolean;
}

interface Beat {
  from: number; // seconds on the VO timeline (phrase starts, assets/audio/vo_words.csv)
  to: number;
  shots: readonly Shot[];
  Hook?: React.ComponentType<{ dur: number }>;
  /** Skip the cut punch-in (a person matte is locked to the clip's own zoom). */
  still?: boolean;
}

/** Blueprint entered at its callout beat: hair already lifted, "ไม่มัน" pops at once. */
const BlueprintCallouts = () => (
  <Sequence from={-41}>
    <ShotVolumeBlueprint />
  </Sequence>
);

const BEATS: readonly Beat[] = [
  {
    from: 0,
    to: 1.96,
    still: true,
    shots: [{ clip: "b01" }],
    Hook: ({ dur }) => (
      <SquashHook scene="methaad01_b01" dur={dur} count={Math.min(dur, 60)} text="หัวแบน" y={250} size={190} squashAt={42} />
    ),
  },
  {
    from: 1.96,
    to: 4.32,
    shots: [{ clip: "b02", to: 2.75 }, { clip: "s02b", to: 3.34 }, { clip: "s02c" }],
    Hook: () => <LevelHook text="แปะติดหนังหัว" y={300} />,
  },
  { from: 4.32, to: 6.82, shots: [{ clip: "b03", to: 5.58 }, { clip: "b04" }], Hook: () => <DripHook y={1400} dripAt={38} /> },
  { from: 6.82, to: 9.99, shots: [{ Cut: ShotGelInk }] },
  {
    from: 9.99,
    to: 13.8,
    shots: [{ Cut: ShotDryerStills, to: 12.49, glitch: true }, { clip: "s05d" }],
    Hook: () => (
      <HeatHook
        x={80}
        y={1180}
        gap={120}
        lines={[
          { text: "อย่าไดร์ร้อน", at: 0 },
          { text: "เป่ากดทับ", at: 26 },
          { text: "ทุกเช้า", at: 52 },
          { text: "ผมเสียเปล่าๆ", at: 75 },
        ]}
      />
    ),
  },
  {
    from: 13.8,
    to: 15.46,
    shots: [{ clip: "b06", to: 14.6 }, { clip: "s06b" }],
    Hook: () => <PowderHook title="แป้งเซ็ตผม" sub="ใช้อันนี้แทน" y={1480} />,
  },
  {
    from: 15.46,
    to: 16.6,
    shots: [{ clip: "b07", to: 16.05 }, { clip: "s07b" }],
    Hook: () => <SprinkleHook badge="01" text="โรยตอนผมแห้ง" top={1330} />,
  },
  { from: 16.6, to: 17.26, shots: [{ clip: "b08" }], Hook: () => <ScrunchHook badge="02" word="ขยำ" y={1400} /> },
  {
    from: 17.26,
    to: 18.62,
    shots: [{ clip: "b09", to: 18.05 }, { clip: "s09b" }],
    Hook: () => <SnipHook first="03 จัดทรง" word="จบ" y={1520} snipAt={23} />,
  },
  {
    from: 18.62,
    to: 21.87,
    shots: [{ clip: "s10a", to: 19.3, riso: true }, { clip: "s10b", to: 19.99, riso: true }, { Cut: BlueprintCallouts }],
  },
  {
    from: 21.87,
    to: 24.11,
    shots: [{ clip: "b11", to: 23.03 }, { clip: "s11b" }],
    Hook: () => <TagHook top={90} flipAt={35} front={["ราคา", "ไม่ถึง 100"]} back={["ซื้อ", "1 แถม 1"]} />,
  },
  {
    from: 24.11,
    to: 26.8,
    shots: [{ clip: "s12a", to: 25.16 }, { clip: "b12" }],
    Hook: () => <FlapHook lead="จะหัวแบนต่อ?" word="แล้วแต่มึง" redTail={2} top={250} at={31} />,
  },
];

/** Punch FX laid over the cut at a VO second: [second, frames, node]. */
const FX: readonly [number, number, React.ReactNode][] = [
  [13.8, 12, <TearReveal key="tear" src={`${DIR}/tear_from.jpg`} seed={3} />],
  [18.62, 16, <SpeedLines key="speed" dur={16} cy={700} />],
  [21.87, 5, <Flash key="flash" dur={5} />],
];

export const HAIR_AD_01_SECONDS = BEATS[BEATS.length - 1].to;

// [sfx, VO second, volume] — accents on cutaway entries and step/deal beats; not every cut.
const HITS: readonly [SfxId, number, number][] = [
  ["thud", 1.4, 0.55],
  ["scratch", 9.99, 0.3],
  ["whoosh", 13.74, 0.55],
  ["whoosh", 6.78, 0.5],
  ["thud", 7.72, 0.7],
  ["thud", 10.86, 0.45],
  ["thud", 11.72, 0.45],
  ["pop", 13.82, 0.5],
  ["pop", 15.5, 0.35],
  ["scratch", 16.75, 0.4],
  ["click", 17.66, 0.5],
  ["thud", 18.06, 0.55],
  ["whoosh", 18.58, 0.5],
  ["pop", 19.99, 0.4],
  ["pop", 20.76, 0.4],
  ["whoosh", 23.03, 0.35],
  ["click", 25.28, 0.3],
  ["click", 25.48, 0.3],
  ["click", 25.68, 0.3],
];

function ShotView({ shot, dur, id, punch }: { shot: Shot; dur: number; id: string; punch: boolean }) {
  const { Cut } = shot;
  const base = Cut ? <Cut /> : <Clip src={`${DIR}/${shot.clip}.mp4`} durationInFrames={dur} zoomTo={1.05} />;
  const printed = shot.riso ? <Riso id={`riso-${id}`}>{base}</Riso> : base;
  const glitched = shot.glitch ? <Glitch id={`glitch-${id}`}>{printed}</Glitch> : printed;
  return punch ? <PunchIn amount={0.07}>{glitched}</PunchIn> : glitched;
}

export function HairAd01() {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {BEATS.map((b) => {
        const dur = s(b.to) - s(b.from);
        const { Hook } = b;
        return (
          <Sequence key={b.from} from={s(b.from)} durationInFrames={dur}>
            {b.shots.map((shot, i) => {
              const start = i === 0 ? b.from : (b.shots[i - 1].to ?? b.to);
              const end = shot.to ?? b.to;
              const len = s(end) - s(start);
              return (
                <Sequence key={i} from={s(start) - s(b.from)} durationInFrames={len}>
                  <ShotView shot={shot} dur={len} id={`${b.from}-${i}`} punch={!b.still && !shot.Cut} />
                </Sequence>
              );
            })}
            {Hook ? <Hook dur={dur} /> : null}
          </Sequence>
        );
      })}
      {FX.map(([sec, frames, node]) => (
        <Sequence key={sec} from={s(sec)} durationInFrames={frames}>
          {node}
        </Sequence>
      ))}
      {HITS.map(([id, sec, vol], i) => (
        <Sfx key={i} id={id} from={s(sec)} volume={vol} />
      ))}
      <Audio src={staticFile(`${DIR}/vo.mp3`)} />
    </AbsoluteFill>
  );
}
