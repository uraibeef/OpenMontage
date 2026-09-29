/**
 * Retention cut of hair ad #2 (sample for the pacing study,
 * projects/_ads/RETENTION_RESEARCH.md):
 * - every VO gap removed with picture + sound (fxkit TimeCut) → jump cuts;
 * - alternating punch zoom so the picture changes every ≤ 0.87 s;
 * - open loop: a tier ladder on the right fills F → C → A while S stays "?"
 *   until the powder reveal; thin progress bar on top;
 * - sound never drops: soft tick on every jump cut, optional beat bed (B).
 */
import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { cutLength, cutPoints, KeepRanges, mapFrame, TimeCut } from "../../fxkit/TimeCut";
import { Sfx } from "../hooks/Sfx";
import { HairAd02 } from "./HairAd02";
import { C, F } from "./theme";

/** Built with projects/_ads/tools/gapcut.py public/methaad02/vo.mp3 26.59 */
const KEEP: KeepRanges = [
  [0, 43], [46, 83], [86, 112], [121, 145], [148, 161], [163, 209], [212, 254], [260, 291],
  [294, 320], [322, 347], [351, 383], [394, 427], [431, 468], [475, 531], [534, 558], [562, 576],
  [580, 597], [600, 606], [609, 662], [672, 693], [696, 724], [726, 753], [757, 798],
];
export const HAIR_AD_02R_FRAMES = cutLength(KEEP);

const at = (sec: number) => mapFrame(KEEP, Math.round(sec * 30));
/** Tier rows fill when the VO grades each product (source seconds). */
const ROWS = [
  { tier: "S", color: C.pink, fill: at(17.77), label: "แป้ง" },
  { tier: "A", color: C.blue, fill: at(13.09), label: "สเปรย์" },
  { tier: "C", color: C.red, fill: at(8.68), label: "แว็กซ์" },
  { tier: "F", color: C.black, fill: at(4.88), label: "เจล" },
] as const;
const LADDER_IN = at(4.0);
const LADDER_OUT = at(20.29);

function Ladder() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < LADDER_IN || frame >= LADDER_OUT) return null;
  const enter = spring({ frame: frame - LADDER_IN, fps, config: { damping: 14 } });
  const out = interpolate(frame, [LADDER_OUT - 6, LADDER_OUT], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        position: "absolute",
        right: 22,
        top: 640,
        width: 150,
        opacity: out,
        transform: `translateX(${(1 - enter) * 220}px)`,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      {ROWS.map((r) => {
        const on = frame >= r.fill;
        const pop = spring({ frame: frame - r.fill, fps, config: { damping: 9, stiffness: 240 } });
        const locked = r.tier === "S" && !on;
        const pulse = locked ? 1 + 0.06 * Math.sin(frame / 3) : 1;
        return (
          <div
            key={r.tier}
            style={{
              display: "flex",
              alignItems: "center",
              height: 74,
              borderRadius: 14,
              background: "rgba(20,20,20,0.82)",
              border: `3px solid ${on || locked ? r.color : "rgba(255,255,255,0.25)"}`,
              transform: `scale(${pulse})`,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: 60,
                height: "100%",
                background: r.color,
                color: r.tier === "F" ? C.paper : C.black,
                fontFamily: F.poster,
                fontSize: 46,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {r.tier}
            </div>
            <div
              style={{
                flex: 1,
                textAlign: "center",
                fontFamily: F.chart,
                fontWeight: 700,
                fontSize: locked ? 44 : 28,
                color: C.paper,
                transform: `scale(${on ? pop : 1})`,
              }}
            >
              {on ? r.label : locked ? "?" : ""}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ProgressBar({ total }: { total: number }) {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", top: 0, left: 0, height: 10, width: `${(frame / total) * 100}%`, background: C.yellow }} />
  );
}

export function HairAd02Retention({ bed = false }: { bed?: boolean }) {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <TimeCut keep={KEEP} maxHold={26}>
        <HairAd02 />
      </TimeCut>
      <Ladder />
      <ProgressBar total={HAIR_AD_02R_FRAMES} />
      {cutPoints(KEEP).map((p, i) => (
        <Sfx key={p} id={i % 2 ? "click" : "whoosh"} from={p} volume={0.18} />
      ))}
      {ROWS.map((r) => (
        <Sfx key={r.tier} id="pop" from={r.fill} volume={0.45} />
      ))}
      {bed ? <Audio src={staticFile("fxkit/beat_bed_100.wav")} volume={0.16} /> : null}
    </AbsoluteFill>
  );
}
