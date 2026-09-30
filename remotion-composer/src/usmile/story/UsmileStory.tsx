/**
 * Data-driven Usmile explainer (full-bleed footage + overlay captions + riso label-tape over burned-in text).
 * One JSON spec per ad (src/usmile/story/specs/<id>.json, built by projects/_ads/tools/usmile_story.py).
 * Look: footage over-scaled (BLEED) so captions/IDs near the edges fall off-frame, dark gradient under white/amber
 * Kanit captions centred at ~60–70 % height (TikTok safe: x 140–940, y < 1560), spec chips top-left, RisoCover labels
 * where OCR found CJK/Hangul text. VO only — no music/SFX, no price.
 */
import { useLayoutEffect, useRef, useState } from "react";
import { AbsoluteFill, Audio, Easing, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { RisoCover } from "../../fxkit";
import boxCache from "./textBoxes.json";
import { AMBER, BLOCK, s, T, WHITE } from "../ad03/style";

export const STORY_FPS = 30;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const BLEED = 1.34;
const CAP_X = 140;
const CAP_W = 800;
const CAP_TOP = 1090;
const CAP_H = 380;

export interface StoryShot {
  from: number;
  to: number;
  /** Shot id, file at public/usmile/<clip>.mp4 */
  clip: string;
  srcLen: number;
  start?: number;
  zoom?: number;
}
export interface StorySpec {
  id: string;
  seconds: number;
  vo: string;
  shots: StoryShot[];
  /** [from, to, text]; `*word*` = amber keyword, `\n` = line break. */
  lines: [number, number, string][];
  chips?: [number, number, string][];
}

function mergeBoxes(boxes: number[][]): number[][] {
  const out = boxes.map((b) => [...b]);
  let changed = true;
  while (changed) {
    changed = false;
    for (let i = 0; i < out.length && !changed; i++) {
      for (let j = i + 1; j < out.length && !changed; j++) {
        const a = out[i];
        const b = out[j];
        const g = 0.04;
        if (a[0] - g < b[2] && b[0] - g < a[2] && a[1] - g < b[3] && b[1] - g < a[3]) {
          const m = [Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.max(a[2], b[2]), Math.max(a[3], b[3])];
          if (m[2] - m[0] > 0.92 || m[3] - m[1] > 0.1) continue;
          out[i] = m;
          out.splice(j, 1);
          changed = true;
        }
      }
    }
  }
  return out;
}
const area = (b: number[]) => (b[2] - b[0]) * (b[3] - b[1]);
/** Merge, then keep the 3 biggest boxes per clip so labels stay a few deliberate accents, not a pile. */
const BOXES: Record<string, number[][]> = Object.fromEntries(Object.entries(boxCache as Record<string, number[][]>).map(([k, v]) => [k, mergeBoxes(v).sort((a, b) => area(b) - area(a)).slice(0, 3)]));
const onScreen = (y0: number, y1: number) => {
  const sy = (n: number) => 0.32 * 1920 + (n * 1920 - 0.32 * 1920) * BLEED;
  const c = sy((y0 + y1) / 2);
  return c > 150 && c < 1880;
};

function Clip({ shot }: { shot: StoryShot }) {
  const frame = useCurrentFrame();
  const slot = shot.to - shot.from;
  const start = shot.start ?? 0;
  const rate = Math.min(1, Math.max(0.5, (shot.srcLen - start) / slot));
  const pop = interpolate(frame, [0, 5], [1.07, 1.0], clamp);
  const push = interpolate(frame, [0, s(slot)], [1.0, 1.05], clamp);
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transform: `scale(${BLEED * pop * push * (shot.zoom ?? 1)})`, transformOrigin: "50% 32%" }}>
        <OffthreadVideo src={staticFile(`usmile/${shot.clip}.mp4`)} muted startFrom={s(start)} playbackRate={rate} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        {(BOXES[shot.clip] ?? [])
          .filter(([, y0, , y1]) => onScreen(y0, y1))
          .map(([x0, y0, x1, y1], i) => (
            <RisoCover key={i} id={`rc-${shot.clip}-${i}`} fontFamily={T.cap} seed={i * 3 + Number(shot.clip.slice(1))} x={x0 * 1080} y={y0 * 1920} w={(x1 - x0) * 1080} h={(y1 - y0) * 1920} />
          ))}
      </div>
    </div>
  );
}

const renderMarked = (line: string) =>
  line.split("*").map((part, i) => (
    <span key={i} style={{ color: i % 2 ? AMBER : WHITE }}>
      {part}
    </span>
  ));

function Caption({ text }: { text: string }) {
  const frame = useCurrentFrame();
  const ref = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState(1);
  useLayoutEffect(() => {
    if (ref.current) setFit(Math.min(1, CAP_W / ref.current.scrollWidth));
  }, [text]);
  const rise = interpolate(frame, [0, 5], [16, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const o = interpolate(frame, [0, 3], [0, 1], clamp);
  const lines = text.split("\n");
  const size = lines.length > 1 ? 112 : 136;
  return (
    <div style={{ position: "absolute", left: CAP_X, top: CAP_TOP, width: CAP_W, height: CAP_H, display: "flex", alignItems: "center", justifyContent: "center", opacity: o, transform: `translateY(${rise}px)` }}>
      <div style={{ transform: `scale(${fit})`, transformOrigin: "50% 50%", textAlign: "center" }}>
        <div ref={ref} style={{ display: "inline-block", fontFamily: T.cap, fontWeight: 800, fontSize: size, lineHeight: 1.22, whiteSpace: "pre", textShadow: "0 4px 0 rgba(0,0,0,0.55), 0 0 24px rgba(0,0,0,0.6)", WebkitTextStroke: "3px rgba(0,0,0,0.85)", paintOrder: "stroke fill" }}>
          {lines.map((l, i) => (
            <div key={i}>{renderMarked(l)}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Chip({ at, until, text }: { at: number; until: number; text: string }) {
  const frame = useCurrentFrame();
  const f = frame - s(at);
  if (f < 0 || frame >= s(until)) return null;
  const sc = interpolate(f, [0, 6], [0.85, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
  const o = interpolate(f, [0, 4], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", left: 48, top: 160, padding: "14px 28px", background: "rgba(15,18,26,0.9)", borderRadius: 14, borderLeft: `8px solid ${AMBER}`, color: WHITE, fontFamily: T.cap, fontWeight: 600, fontSize: 52, opacity: o, transform: `scale(${sc})`, transformOrigin: "0 0" }}>
      {text}
    </div>
  );
}

export function UsmileStory({ spec }: { spec: StorySpec }) {
  return (
    <AbsoluteFill style={{ background: BLOCK }}>
      <Audio src={staticFile(spec.vo)} />
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#000" }}>
        {spec.shots.map((sh) => (
          <Sequence key={sh.clip + sh.from} from={s(sh.from)} durationInFrames={Math.max(1, s(sh.to - sh.from))} layout="none">
            <Clip shot={sh} />
          </Sequence>
        ))}
      </div>
      <div style={{ position: "absolute", left: 0, top: 900, width: 1080, height: 1020, background: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.7) 100%)" }} />
      {spec.lines.map(([a, b, text]) => (
        <Sequence key={a} from={s(a)} durationInFrames={Math.max(1, s(b - a))} layout="none">
          <Caption text={text} />
        </Sequence>
      ))}
      {(spec.chips ?? []).map(([a, b, text]) => (
        <Chip key={text + a} at={a} until={b} text={text} />
      ))}
    </AbsoluteFill>
  );
}
