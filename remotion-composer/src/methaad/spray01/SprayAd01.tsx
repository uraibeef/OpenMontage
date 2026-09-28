/**
 * MAKE SENSE volume spray ad #1 — "แกะกล่อง / first look" (15.25 s).
 *
 * Identity: MINIMAL LUXURY FRAGRANCE AD. Deep forest green and cream,
 * hairline corner chrome, thin serifs, a fragrance-house notes card with a
 * cedar branch and a green-tea sprig drawn in code, soft mist particles and
 * jeweller-style spec callouts on the real 100ml bottle. Calm palette, fast
 * cuts. Real bottle shots (p01-p06) carry every product beat; the Chinese
 * creator clips are cropped past their captions/logos and re-graded
 * (desaturated green cast, grain, scrim) or riso re-printed.
 * VoiceStudio narrator VO, SFX accents, no BGM, no cart CTA.
 */

import { AbsoluteFill, Audio, Img, Sequence, staticFile } from "remotion";
import { Flash, PunchIn, Riso, TearReveal } from "../../fxkit";
import { Sfx, SfxId } from "../hooks/Sfx";
import { Chrome, Grade, Shot } from "./Frame";
import { Cartouche, MistWord, OrderLedger } from "./HooksOpen";
import { OneBottle, PriceTag, SnapStrands, TouchRipple } from "./HooksFeel";
import { CapLift, HandSpan, SpecCallout } from "./HooksSpec";
import { ManWisp, OrderSteps, PumpPress, SignedFree } from "./HooksUse";
import { ScentCard } from "./ScentCard";
import { CREAM, f, FOREST, SAGE } from "./style";

export const SPRAY_AD_01_FPS = 30;
export const SPRAY_AD_01_SECONDS = 15.25;

const END = f(SPRAY_AD_01_SECONDS);
const P = "methaspray"; // the user's own bottle shots
const E = "methaspray01"; // this ad's cut creator shots

interface ShotDef {
  at: number; // VO second the shot starts
  clip: string | null; // public path without .mp4; null = drawn shot (see LAYERS)
  len: number; // source length, seconds
  grade: Grade;
  start?: number;
  riso?: boolean;
}

/** Footage cuts; each ends where the next begins. */
const SHOTS: readonly ShotDef[] = [
  { at: 0, clip: `${E}/e01`, len: 1.0, grade: "forest" },
  { at: 0.55, clip: `${P}/p01`, len: 1.8, grade: "product" },
  { at: 1.3, clip: `${E}/e02`, len: 0.9, grade: "forest" },
  { at: 2.71, clip: `${P}/p02`, len: 1.8, grade: "product" },
  { at: 3.6, clip: `${P}/p05`, len: 2.0, grade: "product" },
  { at: 4.87, clip: `${P}/p06`, len: 1.27, grade: "product" },
  { at: 5.5, clip: null, len: 0, grade: "raw" },
  { at: 6.85, clip: `${E}/e03`, len: 1.1, grade: "raw", riso: true },
  { at: 7.97, clip: `${P}/p03`, len: 2.7, grade: "product", start: 0.25 },
  { at: 8.65, clip: `${E}/e04`, len: 1.1, grade: "forest" },
  { at: 9.5, clip: `${E}/e05`, len: 1.0, grade: "forest" },
  { at: 10.76, clip: `${E}/e06`, len: 1.0, grade: "forest" },
  { at: 11.5, clip: `${E}/e07`, len: 1.1, grade: "forest" },
  { at: 12.62, clip: `${E}/e08`, len: 1.0, grade: "forest" },
  { at: 13.59, clip: `${P}/p04`, len: 0.95, grade: "product" },
];

/** Hooks and drawn shots: [from s, to s, node]. Every beat has its own look. */
const LAYERS: readonly [number, number, React.ReactNode][] = [
  [0, 0.55, <MistWord key="mist" />],
  [0.55, 1.3, <Cartouche key="cartouche" />],
  [1.3, 2.71, <OrderLedger key="ledger" />],
  [2.71, 3.6, <SpecCallout key="spec" />],
  [3.6, 4.87, <HandSpan key="span" />],
  [4.87, 5.5, <CapLift key="cap" />],
  [5.5, 6.85, <ScentCard key="scent" />],
  [6.85, 7.97, <ManWisp key="man" />],
  [7.97, 8.65, <PumpPress key="pump" />],
  [8.65, 9.5, <OrderSteps key="steps" lightAt={f(9.08) - f(8.65)} />],
  [9.5, 10.76, <SignedFree key="signed" />],
  [10.76, 11.5, <TouchRipple key="touch" />],
  [11.5, 12.62, <SnapStrands key="snap" />],
  [12.62, 13.59, <OneBottle key="one" />],
  [13.59, SPRAY_AD_01_SECONDS, <PriceTag key="tag" numberAt={f(14.35) - f(13.59)} />],
];

/** Punch FX laid over a cut: [VO second, frames, node]. */
const FX: readonly [number, number, React.ReactNode][] = [
  [4.87, 5, <Flash key="cap-flash" dur={5} color={CREAM} peak={0.75} />],
  [5.5, 12, <TearReveal key="tear" src={`${E}/tear_from.png`} seed={5} paper={CREAM} />],
  [13.59, 5, <Flash key="tag-flash" dur={5} color={CREAM} peak={0.8} />],
];

// [sfx, VO second, volume]
const HITS: readonly [SfxId, number, number][] = [
  ["whoosh", 0.0, 0.3],
  ["pop", 0.6, 0.35],
  ["click", 1.45, 0.3],
  ["click", 1.62, 0.3],
  ["click", 1.79, 0.3],
  ["whoosh", 2.71, 0.3],
  ["pop", 3.1, 0.4],
  ["whoosh", 3.62, 0.25],
  ["click", 4.95, 0.5],
  ["pop", 5.0, 0.35],
  ["scratch", 5.5, 0.35],
  ["whoosh", 5.55, 0.3],
  ["whoosh", 6.87, 0.3],
  ["click", 8.05, 0.55],
  ["whoosh", 8.1, 0.4],
  ["pop", 9.08, 0.4],
  ["scratch", 9.65, 0.3],
  ["pop", 10.78, 0.35],
  ["thud", 11.93, 0.45],
  ["whoosh", 12.64, 0.3],
  ["whoosh", 13.59, 0.4],
  ["thud", 14.35, 0.6],
  ["pop", 14.38, 0.4],
];

function ShotView({ shot, dur }: { shot: ShotDef & { clip: string }; dur: number }) {
  const body = <Shot src={`${shot.clip}.mp4`} durationInFrames={dur} srcSeconds={shot.len} start={shot.start} grade={shot.grade} />;
  const printed = shot.riso ? (
    <Riso id={`sp01-riso-${shot.at}`} inks={{ dark: FOREST, mid: SAGE, paper: CREAM }} grain={0.3} darkAt={0.34} midAt={0.62}>
      {body}
    </Riso>
  ) : (
    body
  );
  return <PunchIn amount={0.05}>{printed}</PunchIn>;
}

export function SprayAd01() {
  return (
    <AbsoluteFill style={{ backgroundColor: FOREST }}>
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
      <Sequence from={f(4.87)} durationInFrames={f(6.0) - f(4.87)} layout="none">
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
