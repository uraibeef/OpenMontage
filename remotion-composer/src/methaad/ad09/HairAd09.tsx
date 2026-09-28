/**
 * @methamamao hair-powder ad #9 — "ผู้ชาย 3 แบบ" (16.01 s).
 *
 * Angle: who it's for. Identity: a fighting-game CHARACTER SELECT screen /
 * trading cards. Three locked slots unlock one by one into class cards
 * (สายขี้เกียจ / สายซิ่ง / สายเส้นเล็ก); each class then shows a different
 * piece of game UI (stat sheet, equip slot + damage crit, scan + radar).
 * The powder is the ITEM ACQUIRED pickup, scrunch is a 5-second skill
 * cooldown, the result is a LEVEL UP, and 1 แถม 1 is an x2 inventory stack.
 * Logan VO, SFX accents, no BGM, no cart CTA.
 */

import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Flash, Glitch, PunchIn, SpeedLines } from "../../fxkit";
import { FitClip } from "../ad02/FitClip";
import { Sfx, SfxId } from "../hooks/Sfx";
import { CharacterCard } from "./CharacterCard";
import { HairScan, VolumeRadar } from "./HooksFine";
import { Cooldown, ItemAcquired, LevelUp, StackCount } from "./HooksEnd";
import { StatSheet } from "./HooksLazy";
import { QuestDialog, SelectScreen } from "./HooksOpen";
import { CritDamage, EquipSlot, HelmetOff } from "./HooksRider";
import { CLASS, f, GOLD } from "./style";

export const HAIR_AD_09_FPS = 30;
export const HAIR_AD_09_SECONDS = 16.01;

const END = f(HAIR_AD_09_SECONDS);

interface Shot {
  from: number;
  to: number;
  clip: string; // public path without .mp4
  secs: number; // source length
}

/** Full-frame footage cuts (frames). Graphic screens fill the gaps. */
const SHOTS: readonly Shot[] = [
  { from: f(1.0), to: f(1.95), clip: "methaad04/d03", secs: 1.7 },
  { from: f(1.95), to: f(2.95), clip: "methaad01/s12a", secs: 1.4 },
  { from: f(3.95), to: f(4.9), clip: "methaad02/a03", secs: 1.8 },
  { from: f(4.9), to: f(5.84), clip: "methaad09/g01", secs: 1.4 },
  { from: f(6.62), to: f(7.68), clip: "methaad09/g02", secs: 1.5 },
  { from: f(7.68), to: f(8.6), clip: "methaad09/g03", secs: 1.4 },
  { from: f(8.6), to: f(9.59), clip: "methaad01/s02b", secs: 0.9 },
  { from: f(10.49), to: f(11.37), clip: "methaad09/g04", secs: 1.3 },
  { from: f(11.37), to: f(12.55), clip: "methaad09/g05", secs: 1.6 },
  { from: f(12.55), to: f(13.63), clip: "methaad01/b06", secs: 1.97 },
  { from: f(13.63), to: f(14.2), clip: "methaad01/b08", secs: 0.97 },
  { from: f(14.2), to: f(14.78), clip: "methaad01/s10a", secs: 0.97 },
  { from: f(14.78), to: f(15.4), clip: "methaad01/s10b", secs: 1.0 },
  { from: f(15.4), to: END, clip: "methaad01/b11", secs: 2.53 },
];

const P1 = [f(2.95), f(3.95)] as const;
const P2 = [f(5.84), f(6.62)] as const;
const P3 = [f(9.59), f(10.49)] as const;

/** Overlays and drawn screens: [from, to, node]. Every beat wears a different piece of game UI. */
const LAYERS: readonly [number, number, React.ReactNode][] = [
  [0, f(1.0), <SelectScreen key="select" />],
  [f(1.0), f(2.95), <QuestDialog key="quest" line2At={f(1.95) - f(1.0)} />],
  [
    P1[0],
    P1[1],
    <CharacterCard key="p1" clip="methaad02/a03" clipSeconds={1.8} dur={P1[1] - P1[0]} tab="แบบแรก" cls="สายขี้เกียจ" color={CLASS.lazy} entrance="flip" emblem="moon" rank={2} />,
  ],
  [P1[1], P2[0], <StatSheet key="stats" secondAt={f(4.9) - P1[1]} />],
  [
    P2[0],
    P2[1],
    <CharacterCard key="p2" clip="methaad09/g02" clipSeconds={1.5} dur={P2[1] - P2[0]} tab="แบบที่สอง" cls="สายซิ่ง" color={CLASS.rider} entrance="slash" emblem="wheel" rank={3} />,
  ],
  [P2[1], f(7.68), <EquipSlot key="equip" />],
  [f(7.68), f(8.6), <HelmetOff key="helmet" liftAt={3} />],
  [f(8.6), P3[0], <CritDamage key="crit" />],
  [
    P3[0],
    P3[1],
    <Glitch key="p3" id="r9-glitch-p3" dur={7} amount={60}>
      <CharacterCard clip="methaad09/g04" clipSeconds={1.3} dur={P3[1] - P3[0]} tab="แบบที่สาม" cls="สายเส้นเล็ก" color={CLASS.fine} entrance="deal" emblem="strand" rank={1} />
    </Glitch>,
  ],
  [P3[1], f(11.37), <HairScan key="scan" />],
  [f(11.37), f(12.55), <VolumeRadar key="radar" />],
  [f(12.55), f(13.63), <ItemAcquired key="item" />],
  [f(13.63), f(14.78), <Cooldown key="cd" dur={f(14.78) - f(13.63)} />],
  [f(14.78), f(15.4), <LevelUp key="lvl" />],
  [f(15.4), END, <StackCount key="stack" />],
];

// [sfx, VO second, volume]
const HITS: readonly [SfxId, number, number][] = [
  ["pop", 0.05, 0.4],
  ["click", 0.23, 0.35],
  ["click", 0.5, 0.35],
  ["click", 0.77, 0.35],
  ["whoosh", 1.0, 0.45],
  ["pop", 1.96, 0.35],
  ["whoosh", 2.95, 0.55],
  ["click", 3.25, 0.4],
  ["thud", 4.45, 0.6],
  ["pop", 5.3, 0.4],
  ["whoosh", 5.84, 0.55],
  ["click", 6.12, 0.4],
  ["click", 7.08, 0.5],
  ["whoosh", 7.78, 0.55],
  ["thud", 8.6, 0.75],
  ["scratch", 9.59, 0.4],
  ["click", 10.5, 0.35],
  ["click", 10.9, 0.35],
  ["thud", 11.88, 0.6],
  ["whoosh", 12.55, 0.5],
  ["pop", 12.8, 0.45],
  ["click", 13.75, 0.35],
  ["click", 13.95, 0.35],
  ["click", 14.15, 0.35],
  ["click", 14.35, 0.35],
  ["click", 14.55, 0.35],
  ["pop", 14.79, 0.5],
  ["pop", 15.64, 0.5],
];

function ShotView({ shot }: { shot: Shot }) {
  return (
    <PunchIn amount={0.07}>
      <FitClip src={`${shot.clip}.mp4`} durationInFrames={shot.to - shot.from} srcSeconds={shot.secs} zoomTo={1.06} />
    </PunchIn>
  );
}

export function HairAd09() {
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
      <Sequence from={P1[0]} durationInFrames={4}>
        <Flash dur={4} />
      </Sequence>
      <Sequence from={f(12.55)} durationInFrames={12}>
        <SpeedLines dur={12} color={GOLD} cx={540} cy={900} />
      </Sequence>
      <Sequence from={f(14.78)} durationInFrames={4}>
        <Flash dur={4} color={GOLD} peak={0.6} />
      </Sequence>
      {HITS.map(([id, sec, vol], i) => (
        <Sfx key={i} id={id} from={f(sec)} volume={vol} />
      ))}
      <Audio src={staticFile("methaad09/vo.mp3")} />
    </AbsoluteFill>
  );
}
