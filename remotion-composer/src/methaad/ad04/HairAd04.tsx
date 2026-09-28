/**
 * @methamamao hair-powder ad #4 — "POV ตัดผม 300" (17.01 s).
 *
 * Fictional POV: a young guy pays 300 for a cut + set, the volume is gone
 * after one wash, he asks the barber, gets a photo of one small bottle.
 * Identity: every beat is a different artifact from his phone or pocket —
 * receipt, lock screen, game HUD, chat, photo viewer, story, instant photo,
 * wall calendar. Logan VO, SFX accents, no BGM, no cart CTA.
 */

import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Flash, Glitch, PunchIn } from "../../fxkit";
import { Clip } from "../hooks/Clip";
import { Sfx, SfxId } from "../hooks/Sfx";
import { ChatScreen, ChatTimes } from "./ChatScreen";
import { HookCalendar } from "./HookCalendar";
import { HookHairBar } from "./HookHairBar";
import { HookLock } from "./HookLock";
import { HookReceipt } from "./HookReceipt";
import { HookStory, PhotoViewer } from "./HookStory";
import { ShotPolaroid } from "./ShotPolaroid";
import { f } from "./style";

export const HAIR_AD_04_FPS = 30;
export const HAIR_AD_04_SECONDS = 17.01;

const END = f(HAIR_AD_04_SECONDS);
const CHAT_FROM = f(6.12);
const EXPAND = f(9.22);
const EXPAND_DUR = 6;

interface Shot {
  from: number; // frame
  to: number;
  clip: string; // public path without .mp4
  glitch?: boolean;
}

/** Footage cuts (frames). The chat screen owns 6.12–9.22 s + its photo zoom. */
const SHOTS: readonly Shot[] = [
  { from: 0, to: f(1.14), clip: "methaad04/d01" },
  { from: f(1.14), to: f(2.81), clip: "methaad04/d02" },
  { from: f(2.81), to: f(4.31), clip: "methaad04/d03" },
  { from: f(4.31), to: CHAT_FROM, clip: "methaad01/b12", glitch: true },
  { from: EXPAND + EXPAND_DUR, to: f(10.48), clip: "methaad01/s06b" },
  { from: f(10.48), to: f(11.48), clip: "methaad01/b06" },
  { from: f(11.48), to: f(12.08), clip: "methaad01/b07" },
  { from: f(12.08), to: f(12.74), clip: "methaad01/b08" },
  { from: f(14.5), to: END, clip: "methaad01/b11" },
];

const CHAT: ChatTimes = {
  typeEnd: 17,
  send: 19,
  read: 27,
  dots: 31,
  photo: f(7.78) - CHAT_FROM,
  reply: f(9.0) - CHAT_FROM,
  expand: EXPAND - CHAT_FROM,
  expandDur: EXPAND_DUR,
};

const STORY_FROM = f(10.48);
const STORY_CUTS = [0, f(11.48), f(12.08), f(12.74)].map((x, i) => (i === 0 ? 0 : x - STORY_FROM));
const POLAROID_FROM = f(12.74);
const CAL_FROM = f(14.5);

/** Overlays and drawn shots: [from frame, to frame, node]. Each beat has its own look. */
const LAYERS: readonly [number, number, React.ReactNode][] = [
  [0, f(2.81), <HookReceipt key="receipt" stampAt={f(1.14)} />],
  [f(2.81), f(4.31), <HookLock key="lock" noteAt={f(3.0) - f(2.81)} />],
  [f(4.31), CHAT_FROM, <HookHairBar key="hp" drainFrom={4} drainTo={30} />],
  [CHAT_FROM, EXPAND + EXPAND_DUR, <ChatScreen key="chat" t={CHAT} />],
  [EXPAND + EXPAND_DUR, STORY_FROM, <PhotoViewer key="viewer" />],
  [STORY_FROM, POLAROID_FROM, <HookStory key="story" cuts={STORY_CUTS} sprinkleAt={STORY_CUTS[1]} scrunchAt={STORY_CUTS[2]} />],
  [
    POLAROID_FROM,
    CAL_FROM,
    <PunchIn key="polaroid" amount={0.04}>
      <ShotPolaroid src="methaad04/d04.mp4" dur={CAL_FROM - POLAROID_FROM} />
    </PunchIn>,
  ],
  [
    CAL_FROM,
    END,
    <HookCalendar key="cal" markFrom={1} crossFrom={f(14.9) - CAL_FROM} crossRow={5} stampAt={f(15.84) - CAL_FROM} />,
  ],
];

// [sfx, VO second, volume]
const HITS: readonly [SfxId, number, number][] = [
  ["pop", 0.05, 0.45],
  ["thud", 1.15, 0.7],
  ["whoosh", 2.8, 0.5],
  ["pop", 3.0, 0.4],
  ["scratch", 4.35, 0.35],
  ["click", 6.2, 0.25],
  ["click", 6.76, 0.5],
  ["pop", 7.8, 0.45],
  ["whoosh", 9.22, 0.5],
  ["pop", 11.49, 0.45],
  ["pop", 12.09, 0.45],
  ["whoosh", 12.74, 0.5],
  ["click", 14.9, 0.35],
  ["click", 15.1, 0.35],
  ["click", 15.3, 0.35],
  ["click", 15.5, 0.35],
  ["thud", 15.85, 0.75],
];

function ShotView({ shot }: { shot: Shot }) {
  const len = shot.to - shot.from;
  const clip = <Clip src={`${shot.clip}.mp4`} durationInFrames={len} zoomTo={1.05} />;
  const body = shot.glitch ? <Glitch id={`r4-glitch-${shot.from}`}>{clip}</Glitch> : clip;
  return <PunchIn amount={0.07}>{body}</PunchIn>;
}

export function HairAd04() {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {SHOTS.map((shot) => (
        <Sequence key={shot.from} from={shot.from} durationInFrames={shot.to - shot.from}>
          <ShotView shot={shot} />
        </Sequence>
      ))}
      {LAYERS.map(([from, to, node]) => (
        <Sequence key={from} from={from} durationInFrames={to - from}>
          {node}
        </Sequence>
      ))}
      <Sequence from={f(2.81)} durationInFrames={3}>
        <Flash dur={3} />
      </Sequence>
      {HITS.map(([id, sec, vol], i) => (
        <Sfx key={i} id={id} from={f(sec)} volume={vol} />
      ))}
      <Audio src={staticFile("methaad04/vo.mp3")} />
    </AbsoluteFill>
  );
}
