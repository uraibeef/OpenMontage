/**
 * @methamamao hair-powder ad #1 — "อย่า…แต่ให้…แทน" (v2).
 *
 * Footage beats from the Editor Team library, pre-cut to 1080x1920 by
 * projects/metha-hair-ad-01/cut.py (captioned source clips are zoomed so their
 * burned-in text falls outside the frame). Two beats are full-frame cutaways
 * drawn in code (ink hatching, blueprint). Every beat carries its own
 * hook style from ./hairhooks (barbershop-sign identity); no hook repeats.
 * Logan voice-over from Magnific, SFX accents, no BGM, no cart CTA.
 */

import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
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

interface Beat {
  from: number; // seconds on the VO timeline (phrase starts, assets/audio/vo_words.csv)
  to: number;
  clip?: string; // footage beat
  Cut?: React.ComponentType; // full-frame drawn cutaway instead of footage
  Hook?: React.ComponentType<{ dur: number }>;
}

const BEATS: readonly Beat[] = [
  {
    from: 0,
    to: 1.96,
    clip: "b01",
    Hook: ({ dur }) => (
      <SquashHook scene="methaad01_b01" dur={dur} count={Math.min(dur, 60)} text="หัวแบน" y={250} size={190} squashAt={42} />
    ),
  },
  { from: 1.96, to: 4.32, clip: "b02", Hook: () => <LevelHook text="แปะติดหนังหัว" y={300} /> },
  { from: 4.32, to: 6.82, clip: "b03", Hook: () => <DripHook y={1400} dripAt={38} /> },
  { from: 6.82, to: 9.99, Cut: ShotGelInk },
  {
    from: 9.99,
    to: 13.8,
    Cut: ShotDryerStills,
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
  { from: 13.8, to: 15.46, clip: "b06", Hook: () => <PowderHook title="แป้งเซ็ตผม" sub="ใช้อันนี้แทน" y={1480} /> },
  { from: 15.46, to: 16.6, clip: "b07", Hook: () => <SprinkleHook badge="01" text="โรยตอนผมแห้ง" top={1330} /> },
  { from: 16.6, to: 17.26, clip: "b08", Hook: () => <ScrunchHook badge="02" word="ขยำ" y={1400} /> },
  { from: 17.26, to: 18.62, clip: "b09", Hook: () => <SnipHook first="03 จัดทรง" word="จบ" y={1520} snipAt={23} /> },
  { from: 18.62, to: 21.87, Cut: ShotVolumeBlueprint },
  {
    from: 21.87,
    to: 24.11,
    clip: "b11",
    Hook: () => <TagHook top={90} flipAt={35} front={["ราคา", "ไม่ถึง 100"]} back={["ซื้อ", "1 แถม 1"]} />,
  },
  {
    from: 24.11,
    to: 26.8,
    clip: "b12",
    Hook: () => <FlapHook lead="จะหัวแบนต่อ?" word="แล้วแต่มึง" redTail={2} top={250} at={31} />,
  },
];

export const HAIR_AD_01_SECONDS = BEATS[BEATS.length - 1].to;

// [sfx, VO second, volume] — accents on cutaway entries and step/deal beats; not every cut.
const HITS: readonly [SfxId, number, number][] = [
  ["thud", 1.4, 0.55],
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

export function HairAd01() {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {BEATS.map((b) => {
        const dur = s(b.to) - s(b.from);
        const { Cut, Hook } = b;
        return (
          <Sequence key={b.from} from={s(b.from)} durationInFrames={dur}>
            <AbsoluteFill>
              {Cut ? <Cut /> : <Clip src={`${DIR}/${b.clip}.mp4`} durationInFrames={dur} zoomTo={1.05} />}
              {Hook ? <Hook dur={dur} /> : null}
            </AbsoluteFill>
          </Sequence>
        );
      })}
      {HITS.map(([id, sec, vol], i) => (
        <Sfx key={i} id={id} from={s(sec)} volume={vol} />
      ))}
      <Audio src={staticFile(`${DIR}/vo.mp3`)} />
    </AbsoluteFill>
  );
}
