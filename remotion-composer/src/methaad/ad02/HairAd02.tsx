/**
 * @methamamao hair-powder ad #2 — "จัดอันดับของแต่งผม" (tier list).
 *
 * Identity: a school report card printed as a riso zine. Every beat grades one
 * product in its own printed voice — riso poster (opener), Dymo tape + F
 * rubber stamp (gel), red-marker C with margin notes (wax), award rosette A
 * (spray), full-bleed kinetic slabs + S (powder), a drawn tier chart (recap)
 * and a thermal receipt (deal). Footage is muted; VO + SFX only, no BGM.
 */

import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Flash, Glitch, PunchIn, Riso, SpeedLines } from "../../fxkit";
import { Sfx, SfxId } from "../hooks/Sfx";
import { FitClip } from "./FitClip";
import { GelLabels, PosterTitle } from "./HooksOpen";
import { MarkerGrade, RosetteAward } from "./HooksGrade";
import { PowderHooks } from "./HooksPowder";
import { Receipt } from "./Receipt";
import { C } from "./theme";
import { TierBoard } from "./TierBoard";

export const HAIR_AD_02_FPS = 30;
export const HAIR_AD_02_SECONDS = 26.59;
const s = (sec: number) => Math.round(sec * HAIR_AD_02_FPS);

/** Source clip lengths (s) — shorter sources are slowed to fill their shot. */
const SRC: Record<string, number> = {
  "methaad01/b01": 2.27,
  "methaad01/s02b": 0.9,
  "methaad02/a03": 1.8,
  "methaad01/b03": 2.8,
  "methaad01/b04": 3.47,
  "methaad02/a04": 2.1,
  "methaad02/a05": 2.4,
  "methaad02/a06": 2.7,
  "methaad02/a07": 1.6,
  "methaad02/a08": 1.8,
  "methaad01/b06": 1.97,
  "methaad01/s06b": 1.2,
  "methaad01/b07": 1.43,
  "methaad01/b08": 0.97,
  "methaad01/s09b": 0.9,
  "methaad01/b11": 2.53,
  "methaad01/s11b": 1.4,
};

interface Shot {
  to?: number;
  clip?: string;
  Cut?: React.ComponentType;
  riso?: boolean;
  glitch?: boolean;
}

interface Beat {
  from: number;
  to: number;
  shots: readonly Shot[];
  Hook?: React.ComponentType<{ dur: number }>;
}

const rel = (beatFrom: number, sec: number) => s(sec) - s(beatFrom);
const { RankOne, GiantS, WordSlab } = PowderHooks;

/** Powder beat hooks, sequenced on the VO words. */
const PowderKinetic = () => {
  const at = (sec: number) => rel(15.85, sec);
  const parts: [number, number, React.ReactNode][] = [
    [0, at(17.77), <RankOne key="rank" />],
    [at(17.77), at(18.61), <GiantS key="s" />],
    [at(18.61), at(19.24), <WordSlab key="roi" word="โรย" bg={C.yellow} ink={C.black} act="sprinkle" />],
    [at(19.24), at(19.93), <WordSlab key="yam" word="ขยำ" bg={C.blue} ink={C.paper} act="scrunch" />],
    [at(19.93), at(20.29), <WordSlab key="job" word="จบ" bg={C.pink} ink={C.black} act="slam" />],
  ];
  return (
    <>
      {parts.map(([from, to, node]) => (
        <Sequence key={from} from={from} durationInFrames={to - from}>
          {node}
        </Sequence>
      ))}
    </>
  );
};

const BEATS: readonly Beat[] = [
  {
    from: 0,
    to: 4.0,
    shots: [
      { clip: "methaad01/b01", to: 1.5, riso: true },
      { clip: "methaad01/s02b", to: 2.58, riso: true },
      { clip: "methaad02/a03", riso: true },
    ],
    Hook: () => <PosterTitle subAt={rel(0, 2.58)} />,
  },
  {
    from: 4.0,
    to: 8.68,
    shots: [
      { clip: "methaad01/b03", to: 5.32, glitch: true },
      { clip: "methaad01/b04", to: 6.96 },
      { clip: "methaad02/a04" },
    ],
    Hook: () => (
      <GelLabels
        stampAt={rel(4, 4.88)}
        lines={[
          { text: "เจล", at: 0 },
          { text: "มันเยิ้ม", at: rel(4, 5.32) },
          { text: "เหนียว", at: rel(4, 5.9) },
          { text: "ตกเย็นแบน", at: rel(4, 6.96) },
        ]}
      />
    ),
  },
  {
    from: 8.68,
    to: 13.09,
    shots: [{ clip: "methaad02/a05", to: 10.72 }, { clip: "methaad02/a06" }],
    Hook: () => (
      <MarkerGrade
        notes={[
          {
            text: "ต้องใช้เป็น",
            at: rel(8.68, 9.76),
            x: 440,
            y: 1560,
            rot: -5,
            arrow: "M 470 1790 C 620 1770, 800 1760, 960 1720",
            head: "M 470 1830 C 560 1815, 700 1812, 900 1790",
          },
          {
            text: "หัวมัน!",
            at: rel(8.68, 11.56),
            x: 620,
            y: 120,
            rot: 5,
            arrow: "M 900 380 C 910 430, 880 470, 830 500",
            head: "M 850 455 L 826 503 L 880 510",
          },
        ]}
      />
    ),
  },
  {
    from: 13.09,
    to: 15.85,
    shots: [{ clip: "methaad02/a07", to: 14.38 }, { clip: "methaad02/a08" }],
    Hook: () => <RosetteAward cx={290} cy={1480} banner="วันสำคัญ" bannerAt={rel(13.09, 14.38)} />,
  },
  {
    from: 15.85,
    to: 20.29,
    shots: [
      { clip: "methaad01/b06", to: 17.77 },
      { clip: "methaad01/s06b", to: 18.61 },
      { clip: "methaad01/b07", to: 19.24 },
      { clip: "methaad01/b08", to: 19.93 },
      { clip: "methaad01/s09b" },
    ],
    Hook: PowderKinetic,
  },
  { from: 20.29, to: 22.39, shots: [{ Cut: TierBoard }] },
  {
    from: 22.39,
    to: HAIR_AD_02_SECONDS,
    shots: [{ clip: "methaad01/b11", to: 24.15 }, { clip: "methaad01/s11b" }],
    Hook: () => <Receipt dealAt={rel(22.39, 23.01)} priceAt={rel(22.39, 24.15)} riceAt={rel(22.39, 25.15)} />,
  },
];

const FX: readonly [number, number, React.ReactNode][] = [
  [17.77, 24, <SpeedLines key="speed" dur={24} cy={1320} hole={460} />],
  [20.29, 4, <Flash key="flash" dur={4} />],
];

// [sfx, VO second, volume]
const HITS: readonly [SfxId, number, number][] = [
  ["thud", 4.88, 0.6],
  ["click", 8.7, 0.45],
  ["pop", 13.1, 0.5],
  ["whoosh", 15.83, 0.5],
  ["pop", 17.78, 0.45],
  ["click", 18.62, 0.4],
  ["click", 19.25, 0.4],
  ["thud", 19.94, 0.6],
  ["pop", 20.3, 0.45],
  ["scratch", 22.4, 0.35],
  ["click", 24.16, 0.4],
];

function ShotView({ shot, dur, id }: { shot: Shot; dur: number; id: string }) {
  const { Cut } = shot;
  const base = Cut ? (
    <Cut />
  ) : (
    <FitClip src={`${shot.clip}.mp4`} durationInFrames={dur} srcSeconds={SRC[shot.clip ?? ""] ?? 99} zoomTo={1.05} />
  );
  const printed = shot.riso ? <Riso id={`riso-${id}`}>{base}</Riso> : base;
  const glitched = shot.glitch ? <Glitch id={`glitch-${id}`}>{printed}</Glitch> : printed;
  return Cut ? glitched : <PunchIn amount={0.07}>{glitched}</PunchIn>;
}

export function HairAd02() {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {BEATS.map((b) => {
        const dur = s(b.to) - s(b.from);
        const { Hook } = b;
        return (
          <Sequence key={b.from} from={s(b.from)} durationInFrames={dur}>
            {b.shots.map((shot, i) => {
              const start = i === 0 ? b.from : (b.shots[i - 1].to ?? b.to);
              const end = shot.to ?? b.to;
              const len = s(end) - s(start);
              return (
                <Sequence key={i} from={s(start) - s(b.from)} durationInFrames={len}>
                  <ShotView shot={shot} dur={len} id={`${b.from}-${i}`.replace(".", "_")} />
                </Sequence>
              );
            })}
            {Hook ? <Hook dur={dur} /> : null}
          </Sequence>
        );
      })}
      {FX.map(([sec, frames, node]) => (
        <Sequence key={sec} from={s(sec)} durationInFrames={frames}>
          {node}
        </Sequence>
      ))}
      {HITS.map(([id, sec, vol], i) => (
        <Sfx key={i} id={id} from={s(sec)} volume={vol} />
      ))}
      <Audio src={staticFile("methaad02/vo.mp3")} />
    </AbsoluteFill>
  );
}
