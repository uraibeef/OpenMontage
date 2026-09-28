/**
 * @methamamao hair-powder ad #3 — "มึงใช้แป้งเซ็ตผมผิด 3 ข้อ".
 *
 * Identity: SYSTEM ERROR + INSTRUCTION MANUAL. Retro OS dialogs open the ad,
 * each mistake gets a footage hook of its own kind (road sign, proof-reader
 * edit, panel meter) followed by a full-frame manual page drawn in code, and
 * the fix is a clipboard checklist + stopwatch, closed by a store-status pill.
 * Logan VO (public/methaad03/vo.mp3), SFX accents, no music, no cart CTA.
 */

import { AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Flash, Glitch, PunchIn } from "../../fxkit";
import { Clip, clipScale } from "../hooks/Clip";
import { Sfx, SfxId } from "../hooks/Sfx";
import { OpenerDialogs } from "./Dialogs";
import { DealStatusHook, FixChecklistHook } from "./HooksFix";
import { DoseMeterHook, ProofHook, WetSignHook } from "./HooksMistake";
import { PanelTaps } from "./PanelTaps";
import { PanelRoot, PanelWet } from "./PanelsWetRoot";

export const HAIR_AD_03_FPS = 30;
export const HAIR_AD_03_SECONDS = 21.31;
const s = (sec: number) => Math.round(sec * HAIR_AD_03_FPS);

interface Shot {
  from: number;
  to: number;
  clip?: string; // path under public/
  /** Source length in seconds when it is shorter than the slot: played slowed to fit. */
  srcLen?: number;
  Cut?: React.ComponentType;
  glitch?: boolean;
}

const SHOTS: readonly Shot[] = [
  { from: 0, to: 1.34, clip: "methaad01/b06.mp4" },
  { from: 1.34, to: 2.16, clip: "methaad01/b02.mp4" },
  { from: 2.16, to: 3.76, clip: "methaad01/s05d.mp4", glitch: true },
  { from: 3.76, to: 5.02, clip: "methaad03/c01.mp4" },
  { from: 5.02, to: 6.72, Cut: PanelWet },
  { from: 6.72, to: 8.38, clip: "methaad01/s07b.mp4", srcLen: 0.9 },
  { from: 8.38, to: 10.01, Cut: PanelRoot },
  { from: 10.01, to: 11.21, clip: "methaad03/c02.mp4" },
  { from: 11.21, to: 13.62, Cut: PanelTaps },
  { from: 13.62, to: 15.41, clip: "methaad03/c03.mp4" },
  { from: 15.41, to: 16.2, clip: "methaad01/b07.mp4" },
  { from: 16.2, to: 16.66, clip: "methaad01/b08.mp4" },
  { from: 16.66, to: 18.14, clip: "methaad01/b09.mp4" },
  { from: 18.14, to: 18.49, clip: "methaad01/s10b.mp4" },
  { from: 18.49, to: 19.49, clip: "methaad01/b11.mp4" },
  { from: 19.49, to: HAIR_AD_03_SECONDS, clip: "methaad01/s11b.mp4", srcLen: 1.4 },
];

/** One hook style per beat: [from, to, node]. */
const HOOKS: readonly [number, number, React.ReactNode][] = [
  [0, 3.76, <OpenerDialogs key="dialogs" />],
  [3.76, 5.02, <WetSignHook key="sign" />],
  [6.72, 8.38, <ProofHook key="proof" />],
  [10.01, 11.21, <DoseMeterHook key="meter" />],
  [13.62, 18.49, <FixChecklistHook key="fix" stopAt={s(18.14) - s(13.62)} />],
  [18.49, HAIR_AD_03_SECONDS, <DealStatusHook key="deal" liveAt={s(19.49) - s(18.49)} />],
];

const FX: readonly [number, number, React.ReactNode][] = [[13.62, 3, <Flash key="flash" dur={3} />]];

// [sfx, VO second, volume]
const HITS: readonly [SfxId, number, number][] = [
  ["pop", 1.35, 0.45],
  ["thud", 2.17, 0.65],
  ["scratch", 3.77, 0.35],
  ["pop", 5.03, 0.4],
  ["scratch", 6.73, 0.35],
  ["pop", 8.39, 0.4],
  ["click", 10.02, 0.45],
  ["pop", 11.22, 0.4],
  ["click", 12.14, 0.4],
  ["click", 12.4, 0.4],
  ["click", 12.66, 0.4],
  ["whoosh", 13.6, 0.5],
  ["click", 14.63, 0.4],
  ["click", 15.42, 0.4],
  ["click", 16.21, 0.4],
  ["click", 16.67, 0.4],
  ["thud", 18.15, 0.6],
  ["pop", 19.5, 0.45],
];

/** Footage shorter than its slot: slowed to fill it, with the same slow push as Clip. */
function SlowClip({ src, dur, srcLen }: { src: string; dur: number; srcLen: number }) {
  const frame = useCurrentFrame();
  const rate = Math.min(1, srcLen / (dur / HAIR_AD_03_FPS) - 0.01);
  return (
    <AbsoluteFill style={{ overflow: "hidden", scale: clipScale(frame, dur, 1.05) }}>
      <OffthreadVideo src={staticFile(src)} muted playbackRate={rate} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </AbsoluteFill>
  );
}

function ShotView({ shot, dur, id }: { shot: Shot; dur: number; id: string }) {
  const { Cut } = shot;
  if (Cut) {
    return (
      <PunchIn amount={0.04} dur={4}>
        <Cut />
      </PunchIn>
    );
  }
  const clip = shot.clip ?? "";
  const base = shot.srcLen ? (
    <SlowClip src={clip} dur={dur} srcLen={shot.srcLen} />
  ) : (
    <Clip src={clip} durationInFrames={dur} zoomTo={1.05} />
  );
  const fx = shot.glitch ? (
    <Glitch id={`glitch-${id}`} dur={7}>
      {base}
    </Glitch>
  ) : (
    base
  );
  return <PunchIn amount={0.07}>{fx}</PunchIn>;
}

export function HairAd03() {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {SHOTS.map((shot) => {
        const len = s(shot.to) - s(shot.from);
        return (
          <Sequence key={shot.from} from={s(shot.from)} durationInFrames={len}>
            <ShotView shot={shot} dur={len} id={String(shot.from).replace(".", "-")} />
          </Sequence>
        );
      })}
      {HOOKS.map(([from, to, node]) => (
        <Sequence key={from} from={s(from)} durationInFrames={s(to) - s(from)}>
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
      <Audio src={staticFile("methaad03/vo.mp3")} />
    </AbsoluteFill>
  );
}
