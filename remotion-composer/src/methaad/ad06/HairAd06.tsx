/**
 * @methamamao hair-powder ad #6 — "ครั้งแรก" first impression (16.15 s).
 *
 * A footage-narrated POV scenario (not a testimonial), labelled "POV: ครั้งแรก".
 * Identity: MANGA REACTION PAGE — narration caption boxes, a "งง" meter panel,
 * floating question marks and sweat drops, a silent thought cloud, brush
 * onomatopoeia, a surprise burst with speed lines at the wow moment, a
 * two-panel page, speech balloon and a stamped title panel. Ink black, white
 * paper, screentone, spot red. Logan VO, SFX accents, no BGM, no cart CTA.
 */

import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Flash, Glitch, PunchIn, Riso, RISO, SpeedLines } from "../../fxkit";
import { Sfx, SfxId } from "../hooks/Sfx";
import { Footage } from "./ComicKit";
import { DazeMeter, PovCaption, TalcCompare } from "./HooksOpen";
import { RiseBurst, ScrunchSfx, SilentThought } from "./HooksMid";
import { ClaimPage, EndPanel, NotWaxBalloon, TapFocus } from "./HooksEnd";
import { f } from "./style";

export const HAIR_AD_06_FPS = 30;
export const HAIR_AD_06_SECONDS = 16.15;

/** Source clip lengths (s) so short clips slow down instead of running out. */
const LEN: Record<string, number> = {
  "methaad01/b06": 1.97,
  "methaad01/b08": 0.97,
  "methaad01/b09": 1.67,
  "methaad01/b11": 2.53,
  "methaad01/s06b": 1.2,
  "methaad01/s09b": 0.9,
  "methaad01/s10a": 0.97,
  "methaad01/s10b": 1.0,
  "methaad01/s11b": 1.4,
  "methaad01/s12a": 1.4,
  "methaad06/e02": 1.5,
  "methaad06/e03": 1.4,
  "methaad06/e05": 1.3,
  "methaad06/e06": 1.3,
  "methaad06/e07": 1.1,
  "methaad06/e08": 1.3,
  "methaad06/e09": 1.5,
};

interface Shot {
  from: number; // VO seconds
  to: number;
  clip: string;
  glitch?: boolean;
  riso?: boolean;
}

const SHOTS: readonly Shot[] = [
  { from: 0, to: 0.8, clip: "methaad01/b06" },
  { from: 0.8, to: 1.76, clip: "methaad06/e03" },
  { from: 1.76, to: 2.72, clip: "methaad06/e02", glitch: true },
  { from: 2.72, to: 3.5, clip: "methaad01/s12a" },
  { from: 3.5, to: 4.36, clip: "methaad01/s06b", riso: true },
  { from: 4.36, to: 5.16, clip: "methaad06/e11" },
  { from: 5.16, to: 5.96, clip: "methaad06/e05" },
  { from: 5.96, to: 6.74, clip: "methaad06/e06" },
  { from: 6.74, to: 7.3, clip: "methaad01/b08" },
  { from: 7.3, to: 7.9, clip: "methaad06/e07" },
  { from: 7.9, to: 8.75, clip: "methaad06/e08" },
  { from: 8.75, to: 9.3, clip: "methaad01/s10a" },
  { from: 9.3, to: 9.89, clip: "methaad01/s10b" },
  { from: 9.89, to: 10.89, clip: "methaad06/e09" },
  // 10.89–12.13 is the drawn two-panel page (ClaimPage) with its own footage.
  { from: 12.13, to: 13.22, clip: "methaad01/s09b" },
  { from: 13.22, to: 14.2, clip: "methaad01/b09" },
  { from: 14.2, to: 15.0, clip: "methaad01/b11" },
  { from: 15.0, to: HAIR_AD_06_SECONDS, clip: "methaad01/s11b" },
];

const at = (sec: number, beat: number) => f(sec) - f(beat);

/** Hooks, one per beat, each a different comic device: [from s, to s, node]. */
const HOOKS: readonly [number, number, React.ReactNode][] = [
  [0, 1.76, <PovCaption key="pov" />],
  [1.76, 3.5, <DazeMeter key="daze" cut={at(2.72, 1.76)} />],
  [3.5, 5.16, <TalcCompare key="talc" />],
  [5.16, 6.74, <SilentThought key="silent" />],
  [6.74, 7.9, <ScrunchSfx key="scrunch" />],
  [7.9, 9.89, <RiseBurst key="burst" subAt={at(8.75, 7.9)} />],
  [9.89, 10.89, <TapFocus key="tap" hx={250} hy={900} />],
  [10.89, 12.13, <ClaimPage key="page" second={at(11.51, 10.89)} dur={at(12.13, 10.89)} />],
  [12.13, 13.22, <NotWaxBalloon key="wax" />],
  [
    13.22,
    HAIR_AD_06_SECONDS,
    <EndPanel key="end" quitAt={at(13.9, 13.22)} stampAt={at(15.0, 13.22)} tagAt={at(15.45, 13.22)} />,
  ],
];

/** Punch FX: [VO second, frames, node]. */
const FX: readonly [number, number, React.ReactNode][] = [
  [7.9, 4, <Flash key="flash" dur={4} />],
  [7.9, 18, <SpeedLines key="speed" dur={18} cy={700} hole={330} color="#141216" />],
];

// [sfx, VO second, volume]
const HITS: readonly [SfxId, number, number][] = [
  ["pop", 0.05, 0.45],
  ["click", 0.25, 0.3],
  ["scratch", 1.76, 0.35],
  ["whoosh", 1.84, 0.35],
  ["pop", 2.76, 0.4],
  ["pop", 2.88, 0.35],
  ["thud", 3.6, 0.5],
  ["pop", 3.98, 0.4],
  ["click", 5.33, 0.35],
  ["click", 5.53, 0.35],
  ["click", 5.73, 0.35],
  ["scratch", 6.74, 0.4],
  ["thud", 7.04, 0.45],
  ["thud", 7.34, 0.55],
  ["whoosh", 7.82, 0.5],
  ["thud", 7.92, 0.8],
  ["pop", 8.78, 0.4],
  ["click", 9.99, 0.45],
  ["click", 10.26, 0.45],
  ["whoosh", 10.87, 0.45],
  ["pop", 11.52, 0.4],
  ["scratch", 11.8, 0.35],
  ["pop", 12.16, 0.45],
  ["thud", 12.42, 0.5],
  ["scratch", 14.28, 0.4],
  ["thud", 15.02, 0.8],
  ["pop", 15.47, 0.5],
];

function ShotView({ shot }: { shot: Shot }) {
  const len = f(shot.to) - f(shot.from);
  const id = `r6-${shot.clip.replace("/", "-")}`;
  const base = <Footage src={`${shot.clip}.mp4`} dur={len} srcSeconds={LEN[shot.clip] ?? 1.3} />;
  const printed = shot.riso ? (
    <Riso id={`${id}-riso`} inks={{ dark: RISO.black, mid: "#E3262E", paper: "#FFFFFF" }}>
      {base}
    </Riso>
  ) : (
    base
  );
  const body = shot.glitch ? <Glitch id={`${id}-glitch`}>{printed}</Glitch> : printed;
  return <PunchIn amount={0.07}>{body}</PunchIn>;
}

export function HairAd06() {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {SHOTS.map((shot) => (
        <Sequence key={shot.from} from={f(shot.from)} durationInFrames={f(shot.to) - f(shot.from)}>
          <ShotView shot={shot} />
        </Sequence>
      ))}
      {HOOKS.map(([from, to, node]) => (
        <Sequence key={from} from={f(from)} durationInFrames={f(to) - f(from)}>
          {node}
        </Sequence>
      ))}
      {FX.map(([sec, frames, node], i) => (
        <Sequence key={i} from={f(sec)} durationInFrames={frames}>
          {node}
        </Sequence>
      ))}
      {HITS.map(([id, sec, vol], i) => (
        <Sfx key={i} id={id} from={f(sec)} volume={vol} />
      ))}
      <Audio src={staticFile("methaad06/vo.mp3")} />
    </AbsoluteFill>
  );
}
