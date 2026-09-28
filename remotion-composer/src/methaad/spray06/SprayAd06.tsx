/**
 * MAKE SENSE volume spray ad #6 — "จุดเด่น 3 อย่าง" (14.31 s).
 *
 * Identity: BOTANICAL SPECIMEN / FIELD-GUIDE PLATES. Aged paper, sepia ink,
 * pressed-leaf greens and a rust annotation red. Every feature is a numbered
 * plate drawn in code (I root lift, II oil control, III not sticky + rinse),
 * the scent is a herbarium sheet with pressed cedar and tea, and the ad ends
 * on the real bottle wearing a museum exhibit tag "ลด 45%". Creator clips
 * (green bottle only) are cropped past captions/logos and re-graded as
 * sepia photogravure plates; one is riso re-printed.
 * VoiceStudio narrator VO, SFX accents, no BGM, no cart CTA.
 */

import { AbsoluteFill, Audio, Img, Sequence, staticFile } from "remotion";
import { Flash, PunchIn, Riso, TearReveal } from "../../fxkit";
import { Sfx, SfxId } from "../hooks/Sfx";
import { Chrome, Grade, Shot } from "./Frame";
import { AppendixTab, MuseumTag, NowStamp, ScentCurl } from "./HooksEnd";
import { RiseWord, ThickWord } from "./HooksLift";
import { DayRuler, GlossBlot } from "./HooksOil";
import { IndexCover, PIN_AT, SpecimenTag } from "./HooksOpen";
import { RinseWord, StretchSnap } from "./HooksClean";
import { PlateLeaf, PlateRinse, PlateRoot } from "./Plates";
import { ScentSheet } from "./ScentSheet";
import { f, INK, LEAF, PAPER } from "./style";

export const SPRAY_AD_06_FPS = 30;
export const SPRAY_AD_06_SECONDS = 14.31;

const END = f(SPRAY_AD_06_SECONDS);
const P = "methaspray"; // the user's own bottle shots
const E = "methaspray06"; // this ad's cut shots

interface ShotDef {
  at: number; // VO second the shot starts
  clip: string | null; // public path without .mp4; null = drawn plate (see LAYERS)
  len: number; // source length, seconds
  grade: Grade;
  start?: number;
  riso?: boolean;
}

/** Footage cuts; each ends where the next begins. */
const SHOTS: readonly ShotDef[] = [
  { at: 0, clip: `${P}/p01`, len: 1.8, grade: "product" },
  { at: 0.8, clip: `${E}/v01`, len: 1.2, grade: "plate" },
  { at: 1.55, clip: `${P}/p05`, len: 2.0, grade: "product" },
  { at: 2.32, clip: `${E}/v02`, len: 1.3, grade: "plate" },
  { at: 3.2, clip: null, len: 0, grade: "raw" },
  { at: 4.05, clip: `${E}/v03`, len: 1.1, grade: "plate" },
  { at: 4.64, clip: `${E}/v04`, len: 1.3, grade: "plate" },
  { at: 5.45, clip: null, len: 0, grade: "raw" },
  { at: 6.35, clip: `${E}/v05`, len: 1.2, grade: "plate" },
  { at: 7.03, clip: `${E}/v06`, len: 1.2, grade: "raw", riso: true },
  { at: 7.85, clip: null, len: 0, grade: "raw" },
  { at: 8.85, clip: `${E}/v07`, len: 1.55, grade: "plate" },
  { at: 9.83, clip: `${P}/p03`, len: 2.7, grade: "product", start: 1.2 },
  { at: 10.55, clip: null, len: 0, grade: "raw" },
  { at: 11.6, clip: `${E}/v08`, len: 1.3, grade: "plate" },
  { at: 12.38, clip: `${P}/p06`, len: 1.27, grade: "product" },
  { at: 13.05, clip: `${P}/p04`, len: 2.0, grade: "product" },
];

/** Hooks and drawn plates: [from s, to s, node]. Every beat has its own look. */
const LAYERS: readonly [number, number, React.ReactNode][] = [
  [0, 1.55, <IndexCover key="cover" />],
  [1.55, 2.32, <SpecimenTag key="tag" />],
  [2.32, 3.2, <RiseWord key="rise" />],
  [3.2, 4.05, <PlateRoot key="plate1" />],
  [4.05, 4.64, <ThickWord key="thick" />],
  [4.64, 5.45, <GlossBlot key="gloss" />],
  [5.45, 6.35, <PlateLeaf key="plate2" />],
  [6.35, 7.03, <DayRuler key="ruler" />],
  [7.03, 7.85, <StretchSnap key="snap" />],
  [7.85, 8.85, <PlateRinse key="plate3" />],
  [8.85, 9.83, <RinseWord key="rinse" />],
  [9.83, 10.55, <AppendixTab key="appendix" />],
  [10.55, 11.6, <ScentSheet key="scent" />],
  [11.6, 12.38, <ScentCurl key="curl" />],
  [12.38, 13.05, <NowStamp key="now" />],
  [13.05, SPRAY_AD_06_SECONDS, <MuseumTag key="museum" numberAt={f(13.3) - f(13.05)} />],
];

/** Punch FX laid over a cut: [VO second, frames, node]. */
const FX: readonly [number, number, React.ReactNode][] = [
  [3.2, 5, <Flash key="plate1-flash" dur={5} color={PAPER} peak={0.8} />],
  [10.55, 12, <TearReveal key="tear" src={`${E}/tear_from.png`} seed={6} paper={PAPER} />],
  [13.05, 5, <Flash key="tag-flash" dur={5} color={PAPER} peak={0.7} />],
];

// [sfx, VO second, volume]
const HITS: readonly [SfxId, number, number][] = [
  ["whoosh", 0.0, 0.3],
  ["click", PIN_AT[0] / 30, 0.45],
  ["click", PIN_AT[1] / 30, 0.45],
  ["click", PIN_AT[2] / 30, 0.45],
  ["whoosh", 0.8, 0.25],
  ["pop", 1.6, 0.35],
  ["whoosh", 2.34, 0.3],
  ["scratch", 3.2, 0.35],
  ["pop", 3.6, 0.3],
  ["thud", 4.1, 0.4],
  ["whoosh", 4.66, 0.25],
  ["thud", 5.0, 0.45],
  ["scratch", 5.45, 0.3],
  ["pop", 6.05, 0.3],
  ["whoosh", 6.4, 0.25],
  ["pop", 7.37, 0.4],
  ["scratch", 7.85, 0.3],
  ["click", 8.1, 0.4],
  ["pop", 8.6, 0.3],
  ["whoosh", 9.4, 0.3],
  ["whoosh", 9.85, 0.3],
  ["scratch", 10.55, 0.4],
  ["click", 10.9, 0.3],
  ["whoosh", 11.62, 0.3],
  ["thud", 12.5, 0.55],
  ["whoosh", 13.05, 0.35],
  ["thud", 13.3, 0.5],
  ["pop", 13.33, 0.4],
];

function ShotView({ shot, dur }: { shot: ShotDef & { clip: string }; dur: number }) {
  const body = <Shot src={`${shot.clip}.mp4`} durationInFrames={dur} srcSeconds={shot.len} start={shot.start} grade={shot.grade} />;
  const printed = shot.riso ? (
    <Riso id={`sp06-riso-${shot.at}`} inks={{ dark: INK, mid: LEAF, paper: PAPER }} grain={0.3} darkAt={0.32} midAt={0.6}>
      {body}
    </Riso>
  ) : (
    body
  );
  return <PunchIn amount={0.05}>{printed}</PunchIn>;
}

export function SprayAd06() {
  return (
    <AbsoluteFill style={{ backgroundColor: INK }}>
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
      {FX.map(([sec, frames, node]) => (
        <Sequence key={sec} from={f(sec)} durationInFrames={frames}>
          {node}
        </Sequence>
      ))}
      {/* Preload the tear still (SVG <image> does not delay the render). */}
      <Sequence from={f(9.83)} durationInFrames={f(11.0) - f(9.83)} layout="none">
        <Img src={staticFile(`${E}/tear_from.png`)} style={{ position: "absolute", width: 2, height: 2, opacity: 0 }} />
      </Sequence>
      <Chrome />
      {HITS.map(([id, sec, vol], i) => (
        <Sfx key={i} id={id} from={f(sec)} volume={vol} />
      ))}
      <Audio src={staticFile(`${E}/vo.mp3`)} />
    </AbsoluteFill>
  );
}
