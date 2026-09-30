/**
 * @methamamao × Usmile ad #3 — "ไม้จิ้มฟันเอาเศษออกได้จริงไหม" (explainer story, ~33 s).
 *
 * Identity: EXPLAINER. Misconception first (everyone believes the toothpick removes the crumb) →
 * the 3D animation shows the crumb pushed deeper → floss picks can't reach molars → the water
 * jet washes debris off (real demos + corn test) → C10 feature run (listing claims only) →
 * dry callback ("keep the toothpick for fruit"). Every caption line sits over footage that shows it.
 * Full-width footage window, dark caption block (hides burned-in Chinese captions at y>61%),
 * white/amber Kanit captions, no doodles, no price, VO only.
 */
import { useLayoutEffect, useRef, useState } from "react";
import { AbsoluteFill, Audio, Easing, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { AMBER, BLOCK, s, T, WHITE } from "./style";

export const USMILE_AD_03_FPS = 30;
export const USMILE_AD_03_SECONDS = 33.6;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const WIN_TOP = 0;
const WIN_H = 1920;
/** Full-bleed footage is over-scaled so burned-in captions in the bottom ~22% and logos on top fall outside the frame. */
const BLEED = 1.34;
const CAP_X = 140;
const CAP_W = 800;
const CAP_TOP = 1090;
const CAP_H = 380;

interface Shot {
  from: number;
  to: number;
  clip: string;
  srcLen: number;
  start?: number;
  ay?: number;
  zoom?: number;
}

const SHOTS: readonly Shot[] = [
  { from: 0, to: 1.04, clip: "s0593", srcLen: 3, start: 0.2 },
  { from: 1.04, to: 1.9, clip: "s0594", srcLen: 3, start: 0.6 },
  { from: 1.9, to: 2.64, clip: "s0599", srcLen: 3, start: 0.5 },
  { from: 2.64, to: 3.56, clip: "s0595", srcLen: 3, start: 0.8 },
  { from: 3.56, to: 4.8, clip: "s0596", srcLen: 3, start: 0.8 },
  { from: 4.8, to: 5.6, clip: "s0597", srcLen: 3, start: 0.5 },
  { from: 5.6, to: 6.36, clip: "s0598", srcLen: 3, start: 0.5 },
  { from: 6.36, to: 7.8, clip: "s0601", srcLen: 2.89, start: 0.3 },
  { from: 7.8, to: 9.28, clip: "s0388", srcLen: 3, start: 0.6 },
  { from: 9.28, to: 10.4, clip: "s0392", srcLen: 3, start: 0.8 },
  { from: 10.4, to: 11.56, clip: "s0389", srcLen: 3, start: 1.2 },
  { from: 11.56, to: 12.6, clip: "s0048", srcLen: 2.52, start: 0.5 },
  { from: 12.6, to: 13.72, clip: "s0448", srcLen: 3, start: 0.8 },
  { from: 13.72, to: 14.7, clip: "s0610", srcLen: 4.96, start: 1.0 },
  { from: 14.7, to: 15.8, clip: "s0611", srcLen: 4.96, start: 1.0 },
  { from: 15.8, to: 16.92, clip: "s0616", srcLen: 3, start: 0.6 },
  { from: 16.92, to: 18.3, clip: "s0011", srcLen: 3, start: 0.9, zoom: 1.3 },
  { from: 18.3, to: 19.5, clip: "s0012", srcLen: 3, start: 0, zoom: 1.3 },
  { from: 19.5, to: 20.76, clip: "s0612", srcLen: 4.96, start: 1.0 },
  { from: 20.76, to: 22.1, clip: "s0043", srcLen: 3, start: 1.2 },
  { from: 22.1, to: 23.52, clip: "s0044", srcLen: 3.49, start: 1.0 },
  { from: 23.52, to: 24.5, clip: "s0190", srcLen: 4.49, start: 0.6 },
  { from: 24.5, to: 25.5, clip: "s0305", srcLen: 3, start: 0.5, ay: 0.4 },
  { from: 25.5, to: 26.44, clip: "s0006", srcLen: 1.59, start: 0.3 },
  { from: 26.44, to: 27.7, clip: "s0449", srcLen: 3, start: 1.0 },
  { from: 27.7, to: 29.42, clip: "s0045", srcLen: 2.05, start: 0.1, zoom: 1.15 },
  { from: 29.42, to: 30.52, clip: "s0046", srcLen: 3, start: 1.2 },
  { from: 30.52, to: 31.6, clip: "s0600", srcLen: 3, start: 0.2 },
  { from: 31.6, to: USMILE_AD_03_SECONDS, clip: "s0048", srcLen: 2.52, start: 1.0 },
];

/** `*word*` marks the amber keyword. */
const LINES: readonly [number, number, string][] = [
  [0, 1.04, "ทุกคนเชื่อว่า"],
  [1.04, 2.64, "*ไม้จิ้มฟัน*\nเอาเศษออกได้"],
  [2.64, 3.56, "แต่ดูภาพนี้ก่อน"],
  [3.56, 4.8, "เศษ*ไม่ได้ออก*มา"],
  [4.8, 6.36, "โดน*ดันลึก*\nกว่าเดิม"],
  [6.36, 7.8, "เหงือกโดน*ทิ่ม*\nทุกรอบ"],
  [7.8, 9.28, "หันไปใช้\n*ไหมขัดฟัน*"],
  [9.28, 11.56, "แต่ฟันกรามด้านใน\n*เอื้อมไม่ถึง*"],
  [11.56, 13.72, "วิธีใหม่\nใช้*น้ำ*"],
  [13.72, 16.92, "*น้ำแรงๆ* ยิงเข้าซอกฟัน\nเศษหลุดออกมา"],
  [16.92, 20.76, "ทดสอบกับข้าวโพด\nซอกแน่นก็ยิงออก"],
  [20.76, 23.52, "*Usmile C10*\nไหมขัดฟันพลังน้ำ"],
  [23.52, 26.44, "*4 โหมด*\nคนจัดฟัน · เหงือกบอบบาง"],
  [26.44, 29.42, "*กันน้ำ* · ชาร์จครั้งเดียว\nใช้ได้ *95 วัน*"],
  [29.42, 30.52, "แถมหัวฉีด *3 แบบ*"],
  [30.52, USMILE_AD_03_SECONDS, "ส่วนไม้จิ้มฟัน…\n*เก็บไว้จิ้มผลไม้*"],
];

function Clip({ shot }: { shot: Shot }) {
  const frame = useCurrentFrame();
  const slot = shot.to - shot.from;
  const start = shot.start ?? 0;
  const rate = Math.min(1, Math.max(0.5, (shot.srcLen - start) / slot));
  const pop = interpolate(frame, [0, 5], [1.07, 1.0], clamp);
  const push = interpolate(frame, [0, s(slot)], [1.0, 1.05], clamp);
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transform: `scale(${BLEED * pop * push * (shot.zoom ?? 1)})`, transformOrigin: "50% 32%" }}>
        <OffthreadVideo src={staticFile(`usmile03/${shot.clip}.mp4`)} muted startFrom={s(start)} playbackRate={rate} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
    </div>
  );
}

function renderMarked(line: string) {
  return line.split("*").map((part, i) => (
    <span key={i} style={{ color: i % 2 ? AMBER : WHITE }}>
      {part}
    </span>
  ));
}

/** Caption block text: slides up 14px, fitted to the TikTok-safe width. */
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

/** Spec chip that pops in over the footage (listing claims only). */
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

export function UsmileAd03() {
  return (
    <AbsoluteFill style={{ background: BLOCK }}>
      <Audio src={staticFile("usmile03/vo.mp3")} />
      <div style={{ position: "absolute", left: 0, top: WIN_TOP, width: 1080, height: WIN_H, overflow: "hidden", background: "#000" }}>
        {SHOTS.map((sh) => (
          <Sequence key={sh.clip + sh.from} from={s(sh.from)} durationInFrames={s(sh.to - sh.from)} layout="none">
            <Clip shot={sh} />
          </Sequence>
        ))}
      </div>
      <div style={{ position: "absolute", left: 0, top: 900, width: 1080, height: 1020, background: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.7) 100%)" }} />
      {LINES.map(([a, b, text]) => (
        <Sequence key={a} from={s(a)} durationInFrames={s(b - a)} layout="none">
          <Caption text={text} />
        </Sequence>
      ))}
      <Chip at={20.76} until={23.52} text="Usmile C10" />
      <Chip at={23.52} until={26.44} text="4 โหมด" />
      <Chip at={26.44} until={29.42} text="IPX7 กันน้ำ" />
      <Chip at={29.42} until={30.52} text="หัวฉีด 3 แบบ + กล่อง" />
    </AbsoluteFill>
  );
}
