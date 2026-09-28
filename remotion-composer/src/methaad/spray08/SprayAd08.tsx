/**
 * @methamamao MAKE SENSE volume spray ad #8 — "เปรียบเทียบ" (17.5 s).
 *
 * Angle: head-to-head vs generic sticky styling products ("ของเหนียวๆ" —
 * gel/wax in general, never powder, never a brand). Identity: FIGHT NIGHT
 * SCORECARD. Gold corner (a drawn gel blob in gold trunks) vs green corner
 * (the real bottle); four rounds, each opened by a different round card and
 * closed by a point on the arena tally; a KO bell, a 4–0 board, and the
 * championship belt buckled round the bottle with "ลด 45%" on its plate.
 * VO, SFX, no music.
 */

import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Flash, Glitch, PunchIn, SpeedLines } from "../../fxkit";
import { FitClip } from "../ad02/FitClip";
import { Sfx, SfxId } from "../hooks/Sfx";
import { CardFour, CardOne, CardThree, CardTwo } from "./Cards";
import { POINT_AT, TallyStrip } from "./Chrome";
import { CornerFrame } from "./CornerFrame";
import { ChampionBelt, KoBell, ScoreBoard } from "./Finale";
import { CleanCombo, ControlOil, DripAllDay, JudgeSlip, StuckToHand } from "./HooksA";
import { FlatKnockdown, FromTheRoots, OneRinse, UppercutPush, WashAgain } from "./HooksB";
import { GelCorner, GreenCorner, VsSlam } from "./Intro";
import { f, GOLD, RED, WHITE } from "./style";

export const SPRAY_AD_08_FPS = 30;
export const SPRAY_AD_08_SECONDS = 17.50;

const END = f(SPRAY_AD_08_SECONDS);
const CARDS = [3.03, 5.83, 8.39, 11.58] as const;
const KO_AT = 14.3;
const BOARD_AT = 14.83;
const BELT_AT = 15.58;

type Corner = "gold" | "green";

interface Shot {
  at: number; // VO second the shot starts
  clip?: string; // public path without .mp4; none = full-frame round card
  len?: number; // usable source length, seconds
  corner?: Corner; // which fighter this footage belongs to
  glitch?: boolean;
}

/** Cuts; each ends where the next begins (cuts sit on VO pauses). */
const SHOTS: readonly Shot[] = [
  { at: 0, clip: "methaspray/p06", len: 1.26, corner: "green" },
  { at: 1.1, clip: "methaad01/b04", len: 3.4, corner: "gold" },
  { at: 1.95, clip: "methaad01/b03", len: 2.8, corner: "gold" },
  { at: CARDS[0] },
  { at: 3.55, clip: "methaad02/a06", len: 2.7, corner: "gold" },
  { at: 4.45, clip: "methaspray/p05", len: 2.0, corner: "green" },
  { at: 5.1, clip: "methaspray08/g02", len: 1.3, corner: "green" },
  { at: CARDS[1] },
  { at: 6.4, clip: "methaad02/a05", len: 2.4, corner: "gold" },
  { at: 7.39, clip: "methaspray08/g03", len: 1.5, corner: "green", glitch: true },
  { at: CARDS[2] },
  { at: 9.0, clip: "methaad01/b01", len: 2.26, corner: "gold" },
  { at: 9.92, clip: "methaspray/p03", len: 2.7, corner: "green" },
  { at: 10.9, clip: "methaspray08/g04", len: 1.2, corner: "green" },
  { at: CARDS[3] },
  { at: 12.14, clip: "methaad03/c01", len: 1.8, corner: "gold" },
  { at: 13.35, clip: "methaspray08/g05", len: 1.5, corner: "green", glitch: true },
  { at: KO_AT, clip: "methaspray08/g06", len: 1.8 },
  { at: BELT_AT, clip: "methaspray/p01", len: 1.8 },
  { at: 16.48, clip: "methaspray/p04", len: 2.0 },
];

/** Hooks: [from s, to s, node]. Every beat has its own type and motion. */
const LAYERS: readonly [number, number, React.ReactNode][] = [
  [0, 1.1, <GreenCorner key="green" />],
  [1.1, 1.95, <VsSlam key="vs" />],
  [1.95, CARDS[0], <GelCorner key="gel" />],
  [CARDS[0], 3.55, <CardOne key="c1" />],
  [3.55, 4.45, <DripAllDay key="drip" />],
  [4.45, 5.1, <ControlOil key="oil" />],
  [5.1, CARDS[1], <JudgeSlip key="slip" />],
  [CARDS[1], 6.4, <CardTwo key="c2" />],
  [6.4, 7.39, <StuckToHand key="stuck" />],
  [7.39, CARDS[2], <CleanCombo key="clean" />],
  [CARDS[2], 9.0, <CardThree key="c3" />],
  [9.0, 9.92, <FlatKnockdown key="flat" />],
  [9.92, 10.9, <UppercutPush key="push" />],
  [10.9, CARDS[3], <FromTheRoots key="roots" />],
  [CARDS[3], 12.14, <CardFour key="c4" />],
  [12.14, 13.35, <WashAgain key="wash" />],
  [13.35, KO_AT, <OneRinse key="once" />],
  [KO_AT, BOARD_AT, <KoBell key="ko" />],
  [BOARD_AT, BELT_AT, <ScoreBoard key="board" />],
  [BELT_AT, SPRAY_AD_08_SECONDS, <ChampionBelt key="belt" />],
];

/** The tally strip only rides the footage stretches of the four rounds. */
const TALLY: readonly [number, number][] = [
  [3.55, CARDS[1]],
  [6.4, CARDS[2]],
  [9.0, CARDS[3]],
  [12.14, KO_AT],
];

/** Punch FX over a cut: [VO second, frames, node]. */
const FX: readonly [number, number, React.ReactNode][] = [
  [CARDS[0], 5, <Flash key="round-flash" dur={5} color={WHITE} peak={0.8} />],
  [9.92, 10, <SpeedLines key="uppercut-lines" dur={10} cy={1300} hole={420} color={WHITE} />],
  [KO_AT, 6, <Flash key="ko-flash" dur={6} color={RED} peak={0.75} />],
  [16.48, 6, <Flash key="sale-flash" dur={6} color={GOLD} peak={0.6} />],
];

// [sfx, VO second, volume]
const HITS: readonly [SfxId, number, number][] = [
  ["whoosh", 0.02, 0.5],
  ["pop", 0.3, 0.35],
  ["whoosh", 1.1, 0.4],
  ["thud", 1.27, 0.9],
  ["pop", 1.97, 0.45],
  ["pop", 2.35, 0.35],
  ["scratch", 3.6, 0.3],
  ["whoosh", 4.45, 0.45],
  ["thud", 4.62, 0.7],
  ["whoosh", 5.1, 0.35],
  ["click", 5.26, 0.45],
  ["click", 5.36, 0.45],
  ["scratch", 5.5, 0.4],
  ["scratch", 6.5, 0.35],
  ["pop", 7.4, 0.35],
  ["pop", 7.5, 0.35],
  ["pop", 7.6, 0.35],
  ["pop", 7.95, 0.5],
  ["whoosh", 9.0, 0.35],
  ["thud", 9.3, 0.95],
  ["click", 9.45, 0.4],
  ["click", 9.62, 0.4],
  ["whoosh", 9.93, 0.6],
  ["whoosh", 10.9, 0.4],
  ["pop", 11.12, 0.45],
  ["pop", 12.2, 0.3],
  ["pop", 12.45, 0.3],
  ["pop", 12.75, 0.3],
  ["whoosh", 13.36, 0.55],
  ["whoosh", 13.72, 0.3],
  ["thud", 13.95, 0.5],
  ["thud", BOARD_AT + 0.2, 0.8],
  ["click", BOARD_AT + 0.3, 0.4],
  ["click", BOARD_AT + 0.4, 0.4],
  ["thud", BELT_AT + 0.2, 0.7],
  ["pop", 16.5, 0.6],
];

/** Ring bell: a ding opens every round, the KO rings three times. [VO second, volume] */
const BELLS: readonly [number, number][] = [
  [CARDS[0], 0.35],
  [CARDS[1], 0.35],
  [CARDS[2], 0.35],
  [CARDS[3], 0.35],
  [KO_AT, 0.7],
  [KO_AT + 0.16, 0.6],
  [KO_AT + 0.32, 0.55],
];

/** Gold side reads greasy-warm; green side reads crisp and fresh. */
const GRADE: Record<Corner, string> = {
  gold: "sepia(0.22) saturate(1.05) contrast(1.04) brightness(0.97)",
  green: "saturate(1.12) contrast(1.08) brightness(1.03) hue-rotate(-6deg)",
};

function ShotView({ shot, dur }: { shot: Shot; dur: number }) {
  if (!shot.clip) return null;
  const clip = <FitClip src={`${shot.clip}.mp4`} durationInFrames={dur} srcSeconds={shot.len ?? 1} />;
  const graded = shot.corner ? <AbsoluteFill style={{ filter: GRADE[shot.corner] }}>{clip}</AbsoluteFill> : clip;
  const body = shot.glitch ? <Glitch id={`s08-glitch-${shot.at}`}>{graded}</Glitch> : graded;
  return (
    <PunchIn amount={0.07}>
      {body}
      {shot.corner && <CornerFrame corner={shot.corner} />}
    </PunchIn>
  );
}

export function SprayAd08() {
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
      {TALLY.map(([from, to]) => (
        <Sequence key={`tally-${from}`} from={f(from)} durationInFrames={f(to) - f(from)}>
          <TallyAt offset={f(from)} />
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
      {POINT_AT.map((sec) => (
        <Sfx key={`pt-${sec}`} id="click" from={f(sec)} volume={0.5} />
      ))}
      {BELLS.map(([sec, vol]) => (
        <Sequence key={`bell-${sec}`} from={f(sec)} durationInFrames={48} layout="none">
          <Audio src={staticFile("methaspray08/bell.wav")} volume={vol} />
        </Sequence>
      ))}
      <Audio src={staticFile("methaspray08/vo.mp3")} />
    </AbsoluteFill>
  );
}

/** The tally counts in absolute VO time, so re-offset its local frame. */
function TallyAt({ offset }: { offset: number }) {
  return (
    <Sequence from={-offset} layout="none">
      <TallyStrip />
    </Sequence>
  );
}
