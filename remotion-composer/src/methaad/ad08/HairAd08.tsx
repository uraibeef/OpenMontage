/**
 * @methamamao hair-powder ad #8 — "จุดเด่น 3 ข้อ" (17.91 s).
 *
 * Angle: three things generic sticky styling products can't give you.
 * Identity: LAB TEST / EXPERIMENT REPORT. Each feature is a bench test on its
 * own piece of lab stationery — T01 oil (blotting paper + gloss meter),
 * T02 stickiness (petri count, fingertip on a glass slide, loupe),
 * T03 root lift (barcode sample sticker, root-vs-tip lift columns) — each
 * closed by a differently cut PASS stamp. The bonus bottle gets a caliper and
 * a refill log; the deal is the report's summary box, a red seal and an LCD
 * price readout. Logan VO, SFX accents, no BGM, no cart CTA.
 */

import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Flash, Glitch, PunchIn, SpeedLines, TearReveal } from "../../fxkit";
import { FitClip } from "../ad02/FitClip";
import { Sfx, SfxId } from "../hooks/Sfx";
import { Caliper, RefillLog } from "./HooksCarry";
import { GooLabel, ReportSheet, TubeRack } from "./HooksOpen";
import { BlotStrip, GlossMeter } from "./HooksTest1";
import { FingerSlide, PetriDish } from "./HooksTest2";
import { LiftGauge, SampleSticker } from "./HooksTest3";
import { f } from "./style";
import { Verdict } from "./Verdict";

export const HAIR_AD_08_FPS = 30;
export const HAIR_AD_08_SECONDS = 17.91;

const END = f(HAIR_AD_08_SECONDS);

interface Shot {
  at: number; // VO second the shot starts
  clip?: string; // public path without .mp4
  len?: number; // source length, seconds
  Cut?: React.ComponentType; // full-frame drawn cutaway instead of footage
  glitch?: boolean;
}

/** Footage cuts; each ends where the next begins. */
const SHOTS: readonly Shot[] = [
  { at: 0, clip: "methaad01/b03", len: 2.8 },
  { at: 0.95, clip: "methaad02/a06", len: 2.7 },
  { at: 1.95, clip: "methaad01/b04", len: 3.47 },
  { at: 3.13, Cut: ReportSheet },
  { at: 3.69, clip: "methaad04/d04", len: 2.1 },
  { at: 4.29, clip: "methaad08/g02", len: 1.0 },
  { at: 5.29, clip: "methaad08/g01", len: 1.5, glitch: true },
  { at: 6.0, clip: "methaad07/e01", len: 1.0 },
  { at: 6.7, clip: "methaad06/e07", len: 1.1 },
  { at: 7.96, clip: "methaad01/s10a", len: 0.97 },
  { at: 8.8, clip: "methaad01/b08", len: 0.97 },
  { at: 9.71, clip: "methaad01/b07", len: 1.43 },
  { at: 10.55, clip: "methaad06/e10", len: 1.3 },
  { at: 11.41, clip: "methaad01/s10b", len: 1.0 },
  { at: 12.05, clip: "methaad01/b09", len: 1.67 },
  { at: 12.72, clip: "methaad01/b06", len: 1.97 },
  { at: 13.39, clip: "methaad05/e09", len: 1.8 },
  { at: 14.1, clip: "methaad01/s06b", len: 1.2 },
  { at: 14.6, clip: "methaad06/e11", len: 1.3 },
  { at: 15.2, clip: "methaad01/b11", len: 2.53 },
  { at: 16.3, clip: "methaad01/s11b", len: 1.4 },
];

const rel = (sec: number, from: number) => f(sec) - f(from);

/** Hooks and drawn lab artifacts: [from s, to s, node]. Every beat has its own look. */
const LAYERS: readonly [number, number, React.ReactNode][] = [
  [0, 3.13, <TubeRack key="rack" />],
  [1.0, 3.13, <GooLabel key="goo" stampAt={rel(2.25, 1.0)} />],
  [3.69, 5.29, <BlotStrip key="blot" noteAt={rel(4.29, 3.69)} />],
  [5.29, 6.7, <GlossMeter key="gloss" dropAt={rel(6.0, 5.29)} />],
  [6.7, 7.2, <PetriDish key="petri" />],
  [7.2, 9.71, <FingerSlide key="finger" loupeAt={rel(7.96, 7.2)} stampAt={rel(9.25, 7.2)} y0={1560} />],
  [9.71, 10.19, <SampleSticker key="sticker" />],
  [10.19, 12.72, <LiftGauge key="lift" tipAt={rel(11.41, 10.19)} stampAt={rel(12.2, 10.19)} />],
  [12.72, 13.39, <Caliper key="caliper" />],
  [13.39, 15.2, <RefillLog key="refill" ticks={[rel(13.62, 13.39), rel(14.12, 13.39), rel(14.62, 13.39)]} />],
  [15.2, HAIR_AD_08_SECONDS, <Verdict key="verdict" dealAt={rel(15.95, 15.2)} priceAt={rel(16.7, 15.2)} />],
];

/** Punch FX laid over a cut: [VO second, frames, node]. */
const FX: readonly [number, number, React.ReactNode][] = [
  [3.13, 10, <TearReveal key="tear" src="methaad08/tear_from.jpg" seed={8} paper="#F4F1E8" />],
  [10.19, 16, <SpeedLines key="speed" dur={16} cy={600} hole={380} />],
  [15.2, 5, <Flash key="flash" dur={5} />],
];

// [sfx, VO second, volume]
const HITS: readonly [SfxId, number, number][] = [
  ["thud", 0.08, 0.55],
  ["pop", 0.12, 0.3],
  ["pop", 0.28, 0.3],
  ["pop", 0.45, 0.3],
  ["scratch", 1.05, 0.3],
  ["thud", 2.25, 0.7],
  ["whoosh", 3.08, 0.5],
  ["click", 3.2, 0.35],
  ["click", 3.33, 0.35],
  ["whoosh", 3.69, 0.4],
  ["click", 3.88, 0.4],
  ["scratch", 4.3, 0.3],
  ["scratch", 5.29, 0.35],
  ["click", 6.02, 0.45],
  ["thud", 6.25, 0.65],
  ["pop", 6.72, 0.45],
  ["click", 7.5, 0.4],
  ["whoosh", 7.96, 0.4],
  ["thud", 9.25, 0.65],
  ["pop", 9.72, 0.5],
  ["whoosh", 10.17, 0.45],
  ["pop", 11.45, 0.4],
  ["thud", 12.2, 0.65],
  ["click", 12.85, 0.5],
  ["click", 13.62, 0.35],
  ["click", 14.12, 0.35],
  ["click", 14.62, 0.35],
  ["whoosh", 15.17, 0.45],
  ["thud", 15.95, 0.75],
  ["click", 16.7, 0.45],
];

function ShotView({ shot, dur }: { shot: Shot; dur: number }) {
  const { Cut } = shot;
  if (Cut) return <Cut />;
  const clip = <FitClip src={`${shot.clip}.mp4`} durationInFrames={dur} srcSeconds={shot.len ?? 99} />;
  const body = shot.glitch ? <Glitch id={`d8-glitch-${f(shot.at)}`}>{clip}</Glitch> : clip;
  return <PunchIn amount={0.07}>{body}</PunchIn>;
}

export function HairAd08() {
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
      {HITS.map(([id, sec, vol], i) => (
        <Sfx key={i} id={id} from={f(sec)} volume={vol} />
      ))}
      <Audio src={staticFile("methaad08/vo.mp3")} />
    </AbsoluteFill>
  );
}
