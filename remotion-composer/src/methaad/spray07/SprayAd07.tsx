/**
 * MAKE SENSE volume spray ad #7 — "เหมาะกับใคร / ผู้ชาย 3 แบบ" (12.31 s).
 *
 * Identity: DATING-APP MATCH DECK. A night-forest app ("matchผม") deals three
 * men as swipeable profile cards: gallery bars, a bio line and three tag
 * chips each. Card 1 (oily, flat by afternoon) is stamped "ใช่เลย" and
 * swiped right, card 2 (round face, wants a hair shape with dimension) is
 * super-liked up, card 3 (meets clients all day) shrinks into an avatar;
 * then "It's a Match!" pairs him with the real green bottle, "ลด 45%".
 * Every hook has its own type and motion. Creator clips (green bottle only)
 * are cropped past captions and live inside the drawn cards with a cedar
 * grade; one is glitched in, one riso re-printed.
 * VoiceStudio narrator VO, SFX accents, no BGM, no cart CTA.
 */

import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Flash, SpeedLines } from "../../fxkit";
import { Sfx, SfxId } from "../hooks/Sfx";
import { AppBackdrop, AppChrome, Button } from "./AppChrome";
import { CardShot, ProfileCard } from "./Card";
import { DealThree, FilterSheet } from "./HooksOpen";
import { PanelType1, StampYes } from "./HooksType1";
import { PanelType2, StampSuper } from "./HooksType2";
import { PanelType3 } from "./HooksType3";
import { AnyOfThree, AVATAR_D, AVATAR_Y, AVATARS, ItsAMatch } from "./Match";
import { f, MINT, SKY } from "./style";

export const SPRAY_AD_07_FPS = 30;
export const SPRAY_AD_07_SECONDS = 12.31;

const END = f(SPRAY_AD_07_SECONDS);
const P = "methaspray"; // the user's own bottle shots
const E = "methaspray07"; // this ad's cut shots

/** Card-local frame for a VO second, given the card's start second. */
const at = (sec: number, from: number) => f(sec) - f(from);

// --- the bottle's own card under the filter sheet (1.00 → 2.71) ---
const C0 = 1.0;
const PRODUCT: readonly CardShot[] = [
  { src: `${P}/p01.mp4`, from: 0, srcSeconds: 1.8 },
  { src: `${P}/p05.mp4`, from: at(1.85, C0), srcSeconds: 2.0 },
];

// --- card 1: oily, flat by the afternoon (2.71 → 4.78) ---
const C1 = 2.71;
const CARD1: readonly CardShot[] = [
  { src: `${E}/t1a.mp4`, from: 0, srcSeconds: 1.4, glitch: true },
  { src: `${E}/t1b.mp4`, from: at(3.75, C1), srcSeconds: 1.6 },
];

// --- card 2: round face, wants dimension (4.45 → 7.35, front at 4.80) ---
const C2 = 4.45;
const CARD2: readonly CardShot[] = [
  { src: `${E}/t2a.mp4`, from: 0, srcSeconds: 1.4, pos: 88 },
  { src: `${E}/t2b.mp4`, from: at(5.75, C2), srcSeconds: 1.3, pos: 88 },
  { src: `${E}/t2c.mp4`, from: at(6.55, C2), srcSeconds: 1.3, pos: 88 },
];

// --- card 3: meets clients all day (button-shirt office look) (7.05 → 11.2, front at 7.35, avatar from 10.45) ---
const C3 = 7.05;
const CARD3: readonly CardShot[] = [
  { src: `${E}/t3a.mp4`, from: 0, srcSeconds: 1.4, pos: 95 },
  { src: `${E}/t3b.mp4`, from: at(8.35, C3), srcSeconds: 1.4, riso: true, pos: 100 },
  { src: `${E}/t3c.mp4`, from: at(9.35, C3), srcSeconds: 1.4, pos: 100 },
];

const M = 11.2; // match screen

const PRESSES: readonly [number, Button][] = [
  [f(4.45), "like"],
  [f(7.05), "star"],
  [f(10.15), "like"],
];
const CLOCK: readonly [number, string][] = [
  [0, "08:30"],
  [f(2.71), "15:40"],
  [f(4.8), "12:15"],
  [f(7.35), "09:00"],
];

// [sfx, VO second, volume]
const HITS: readonly [SfxId, number, number][] = [
  ["whoosh", 0.0, 0.3],
  ["pop", 0.02, 0.35],
  ["pop", 0.18, 0.35],
  ["pop", 0.35, 0.4],
  ["whoosh", 1.0, 0.25],
  ["click", 1.15, 0.3],
  ["click", 1.4, 0.3],
  ["click", 1.65, 0.3],
  ["click", 2.0, 0.5],
  ["whoosh", 2.71, 0.3],
  ["pop", 3.21, 0.3],
  ["pop", 3.48, 0.3],
  ["pop", 3.75, 0.3],
  ["thud", 4.12, 0.45],
  ["thud", 4.45, 0.5],
  ["whoosh", 4.5, 0.3],
  ["pop", 5.28, 0.3],
  ["pop", 5.72, 0.3],
  ["pop", 6.05, 0.3],
  ["whoosh", 6.4, 0.3],
  ["whoosh", 7.05, 0.4],
  ["pop", 7.08, 0.4],
  ["click", 8.12, 0.35],
  ["click", 8.55, 0.35],
  ["click", 8.92, 0.35],
  ["scratch", 9.12, 0.3],
  ["whoosh", 10.15, 0.35],
  ["pop", 10.4, 0.3],
  ["pop", 10.5, 0.3],
  ["click", 10.64, 0.35],
  ["click", 10.8, 0.35],
  ["click", 10.97, 0.35],
  ["thud", M, 0.5],
  ["whoosh", M + 0.02, 0.3],
  ["pop", 11.45, 0.45],
  ["pop", 11.64, 0.45],
];

const span = (a: number, b: number) => ({ from: f(a), durationInFrames: f(b) - f(a) });

export function SprayAd07() {
  const third = AVATARS[2];
  return (
    <AbsoluteFill>
      <AppBackdrop />

      <Sequence {...span(0, C0)}>
        <DealThree />
      </Sequence>
      <Sequence {...span(C0, C1)}>
        <ProfileCard id="p" shots={PRODUCT} frontAt={0} end={at(C1, C0)} panel={null} />
      </Sequence>

      {/* deck order: later cards sit underneath the front one */}
      <Sequence {...span(C3, M)}>
        <ProfileCard
          id="c3"
          shots={CARD3}
          frontAt={at(7.35, C3)}
          end={at(M, C3)}
          exit={{ at: at(10.15, C3), dur: 10, kind: "shrink", to: { x: third.x, y: AVATAR_Y, d: AVATAR_D } }}
          panel={<PanelType3 />}
        />
      </Sequence>
      <Sequence {...span(C2, 7.4)}>
        <ProfileCard
          id="c2"
          shots={CARD2}
          frontAt={at(4.8, C2)}
          end={at(7.4, C2)}
          exit={{ at: at(7.05, C2), dur: 9, kind: "up" }}
          panel={<PanelType2 />}
          stamp={<StampSuper />}
        />
      </Sequence>
      <Sequence {...span(C1, 4.8)}>
        <ProfileCard
          id="c1"
          shots={CARD1}
          frontAt={3}
          end={at(4.8, C1)}
          exit={{ at: at(4.45, C1), dur: 10, kind: "right" }}
          panel={<PanelType1 />}
          stamp={<StampYes />}
        />
      </Sequence>

      <AppChrome presses={PRESSES} clock={CLOCK} hideFrom={f(M)} />

      <Sequence {...span(C0, C1)}>
        <FilterSheet />
      </Sequence>
      <Sequence {...span(10.37, M)}>
        <AnyOfThree />
      </Sequence>
      <Sequence from={f(M)} durationInFrames={END - f(M)}>
        <ItsAMatch bgSplit={f(11.85) - f(M)} end={END - f(M)} />
      </Sequence>

      <Sequence from={f(7.05)} durationInFrames={12}>
        <SpeedLines dur={12} color={SKY} cx={540} cy={880} hole={420} />
      </Sequence>
      <Sequence from={f(M)} durationInFrames={6}>
        <Flash dur={6} color={MINT} peak={0.75} />
      </Sequence>

      {HITS.map(([id, sec, vol], i) => (
        <Sfx key={i} id={id} from={f(sec)} volume={vol} />
      ))}
      <Audio src={staticFile(`${E}/vo.mp3`)} />
    </AbsoluteFill>
  );
}
