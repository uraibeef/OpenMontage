/**
 * @methamamao hair-powder ad #1 — "อย่า…แต่ให้…แทน" (v2).
 *
 * Footage beats from the Editor Team library, pre-cut to 1080x1920 by
 * projects/metha-hair-ad-01/cut.py (captioned source clips are zoomed so their
 * burned-in text falls outside the frame). Two beats are full-frame cutaways
 * drawn in code (ink hatching, blueprint). Every footage beat carries a
 * different hook style from the drawn-explainer-reel kit; no hook repeats.
 * Logan voice-over from Magnific, SFX accents, no BGM, no cart CTA.
 */

import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { BehindHook } from "./hooks/Behind";
import { Clip } from "./hooks/Clip";
import {
  ArcHook,
  EchoHook,
  GlowHook,
  MarkerHook,
  PillHook,
  PuffyHook,
  SlamStack,
  StickerHook,
  TypeHook,
} from "./hooks/Hooks";
import { Sfx, SfxId } from "./hooks/Sfx";
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
      <BehindHook scene="methaad01_b01" sceneDuration={dur} count={Math.min(dur, 60)} text="หัวแบน" y={330} size={230} look="puffy" />
    ),
  },
  { from: 1.96, to: 4.32, clip: "b02", Hook: () => <MarkerHook text="แปะติดหนังหัว" top={260} size={100} /> },
  {
    from: 4.32,
    to: 6.82,
    clip: "b03",
    Hook: () => <StickerHook text="อย่า เจลหนาๆ" top={1450} rotate={-5} color="#FF3B3B" ink="#FFFFFF" />,
  },
  { from: 6.82, to: 9.99, Cut: ShotGelInk },
  {
    from: 9.99,
    to: 13.8,
    clip: "b05",
    Hook: () => (
      <SlamStack
        y={1380}
        words={[
          { text: "อย่า ไดร์ร้อน", at: 0, color: "#FFFFFF", size: 110 },
          { text: "กดทับ", at: 26, color: "#FF3B3B", size: 130 },
          { text: "ทุกเช้า", at: 52, color: "#FFFFFF", size: 110 },
        ]}
      />
    ),
  },
  { from: 13.8, to: 15.46, clip: "b06", Hook: () => <GlowHook title="แป้งเซ็ตผม" sub="ใช้อันนี้แทน" y={1500} size={150} /> },
  { from: 15.46, to: 16.6, clip: "b07", Hook: () => <TypeHook lines={["01 โรยตอนผมแห้ง"]} top={1420} rate={1.6} /> },
  { from: 16.6, to: 17.26, clip: "b08", Hook: () => <PillHook word="02" pill="ขยำ" top={1450} /> },
  { from: 17.26, to: 18.62, clip: "b09", Hook: () => <EchoHook text="จบ" y={1680} size={200} /> },
  { from: 18.62, to: 21.87, Cut: ShotVolumeBlueprint },
  { from: 21.87, to: 24.11, clip: "b11", Hook: () => <PuffyHook text="1 แถม 1" y={330} size={180} /> },
  {
    from: 24.11,
    to: 26.8,
    clip: "b12",
    Hook: () => <ArcHook arc="จะหัวแบนต่อ" big="แล้วแต่มึง" y={330} />,
  },
];

export const HAIR_AD_01_SECONDS = BEATS[BEATS.length - 1].to;

// [sfx, VO second, volume] — accents on cutaway entries and step/deal beats; not every cut.
const HITS: readonly [SfxId, number, number][] = [
  ["whoosh", 6.78, 0.5],
  ["thud", 7.72, 0.7],
  ["pop", 13.82, 0.5],
  ["click", 15.48, 0.5],
  ["click", 16.62, 0.5],
  ["pop", 17.3, 0.45],
  ["whoosh", 18.58, 0.5],
  ["pop", 19.99, 0.4],
  ["pop", 20.76, 0.4],
  ["scratch", 21.9, 0.35],
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
