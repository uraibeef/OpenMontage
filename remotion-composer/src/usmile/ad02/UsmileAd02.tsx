/**
 * @methamamao × Usmile ad #2 — "ไม้จิ้มฟัน vs น้ำ" (fast-cut, real footage).
 *
 * Identity: real product/demo footage full-width in the top window, cut every ~1 s, with our
 * paper caption block below (hides every burned-in Chinese caption at y>61%) and a paper strip on
 * top (hides platform logos). Hook = the payoff first (water blasts corn kernels clean), then a
 * toothpick sticker (hand-drawn character, ad #1 doodles) reacts while the "old way" plays, the
 * twist lands on the product at ~8 s, and the toothpick is sent to sleep at the end.
 * VO only — no music, no SFX, no price.
 */
import { AbsoluteFill, Audio, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { PaperGrain } from "../../fxkit";
import { SceneInTheBox, Toothpick } from "../ad01/Doodles";
import { InkLine, LevelDots, Note } from "../ad01/UsmileAd01";
import { INK, NOTE_BLUE, NOTE_YELLOW, PAPER, s } from "../ad01/style";

export const USMILE_AD_02_FPS = 30;
export const USMILE_AD_02_SECONDS = 17.2;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const WIN_TOP = 110;
const WIN_H = 1070;

interface Shot {
  from: number;
  to: number;
  clip: string;
  srcLen: number;
  /** Where in the source to start (s). */
  start?: number;
  /** 0 = show source from y=0, 1 = show source bottom. Default ≈ hides the top logo strip. */
  ay?: number;
  zoom?: number;
}

const SHOTS: readonly Shot[] = [
  { from: 0, to: 0.62, clip: "s0011", srcLen: 3.0, start: 0.9 },
  { from: 0.62, to: 1.62, clip: "s0012", srcLen: 3.0, start: 0.0 },
  { from: 1.62, to: 2.64, clip: "s0003", srcLen: 1.39, start: 0.2 },
  { from: 2.64, to: 3.6, clip: "s0388", srcLen: 3.0, start: 0.5 },
  { from: 3.6, to: 4.56, clip: "s0392", srcLen: 3.0, start: 0.5 },
  { from: 4.56, to: 6.08, clip: "s0018", srcLen: 3.0, start: 0.2 },
  { from: 6.08, to: 7.0, clip: "s0185", srcLen: 2.39, start: 0.3 },
  { from: 7.0, to: 7.84, clip: "s0389", srcLen: 3.0, start: 0.8 },
  { from: 7.84, to: 8.9, clip: "s0048", srcLen: 2.52, start: 0.6 },
  { from: 8.9, to: 10.52, clip: "s0043", srcLen: 3.0, start: 1.2 },
  { from: 10.52, to: 11.4, clip: "s0190", srcLen: 4.49, start: 0.6 },
  { from: 11.4, to: 12.2, clip: "s0046", srcLen: 3.0, start: 1.2 },
  { from: 12.2, to: 13.04, clip: "s0006", srcLen: 1.59, start: 0.3 },
  { from: 13.04, to: 14.68, clip: "s0045", srcLen: 2.05, start: 0.2 },
];

const LINES: readonly [number, number, string][] = [
  [0, 0.62, "ดูนะ"],
  [0.62, 2.64, "น้ำล้วนๆ\nเศษหลุดออกมา"],
  [2.64, 4.56, "ไม้จิ้มฟัน\nที่ใช้มาสิบปี"],
  [4.56, 6.08, "แค่ดันเศษ\nให้ลึกกว่าเดิม"],
  [6.08, 7.84, "แล้วก็จิ้มต่อ\nทุกมื้อ"],
  [7.84, 8.9, "ลองตัวนี้"],
  [8.9, 10.52, "ไหมขัดฟันพลังน้ำ\nUsmile"],
  [10.52, 11.4, "ปรับได้ 4 ระดับ"],
  [11.4, 12.2, "หัวฉีดนุ่ม"],
  [12.2, 13.04, "ไม่บาดเหงือก"],
  [13.04, 14.68, "ชาร์จทีเดียว\nอยู่ได้ 3 เดือน"],
  [14.68, 15.92, "ไม้จิ้มฟันเอ๋ย"],
  [15.92, USMILE_AD_02_SECONDS, "ไปนอนพักเหอะ"],
];

function Clip({ shot }: { shot: Shot }) {
  const frame = useCurrentFrame();
  const slot = shot.to - shot.from;
  const start = shot.start ?? 0;
  const rate = Math.min(1, Math.max(0.5, (shot.srcLen - start) / slot));
  const ay = shot.ay ?? 0.13;
  const pop = interpolate(frame, [0, 5], [1.09, 1.0], clamp);
  const push = interpolate(frame, [0, s(slot)], [1.0, 1.06], clamp);
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: -ay * (1920 - WIN_H), width: 1080, height: 1920, transform: `scale(${pop * push * (shot.zoom ?? 1)})`, transformOrigin: "50% 40%" }}>
        <OffthreadVideo src={staticFile(`usmile02/${shot.clip}.mp4`)} muted startFrom={s(start)} playbackRate={rate} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
    </div>
  );
}

/** Small sad toothpick pinned to the corner of the footage while the "old way" plays. */
function Sticker({ from, to }: { from: number; to: number }) {
  const frame = useCurrentFrame();
  const f = frame - s(from);
  if (f < 0 || frame >= s(to)) return null;
  const pop = interpolate(f, [0, 6], [0.2, 1], clamp);
  const bob = Math.sin(f / 6) * 6;
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, transform: `scale(${pop})`, transformOrigin: "150px 1170px" }}>
      <g transform={`translate(0 ${bob})`}>
        <Toothpick x={150} y={1170} rot={-90} mood="sad" t={f} scale={0.9} />
      </g>
    </svg>
  );
}

export function UsmileAd02() {
  return (
    <AbsoluteFill style={{ background: PAPER }}>
      <Audio src={staticFile("usmile02/vo.mp3")} />
      <div style={{ position: "absolute", left: 0, top: WIN_TOP, width: 1080, height: WIN_H, overflow: "hidden", background: "#111" }}>
        {SHOTS.map((sh) => (
          <Sequence key={sh.clip + sh.from} from={s(sh.from)} durationInFrames={s(sh.to - sh.from)} layout="none">
            <Clip shot={sh} />
          </Sequence>
        ))}
        <Sequence from={s(14.68)} durationInFrames={s(USMILE_AD_02_SECONDS - 14.68)} layout="none">
          <div style={{ position: "absolute", left: 0, top: 0, width: 932, height: 1012, transform: "scale(1.16)", transformOrigin: "0 0" }}>
            <SceneInTheBox />
          </div>
        </Sequence>
      </div>
      {/* torn paper edge under the footage */}
      <svg width={1080} height={40} viewBox="0 0 1080 40" style={{ position: "absolute", left: 0, top: WIN_TOP + WIN_H - 14 }}>
        <path d={`M0 0 ${Array.from({ length: 28 }, (_, i) => `L${i * 40 + 20} ${i % 2 ? 6 : 26}`).join(" ")} L1080 0 L1080 40 L0 40 Z`} fill={PAPER} />
      </svg>
      <Sticker from={2.64} to={7.84} />
      {LINES.map(([a, b, text]) => (
        <Sequence key={a} from={s(a)} durationInFrames={s(b - a)} layout="none">
          <InkLine text={text} dur={s(b - a)} boost={1.22} />
        </Sequence>
      ))}
      <Note at={8.9} until={10.52} text="Usmile" sub="ไหมขัดฟันพลังน้ำ" x={40} y={160} rot={-4} color={NOTE_YELLOW} w={430} />
      <LevelDots at={10.55} until={11.4} />
      <Note at={13.04} until={14.68} text="ชาร์จ 1 ครั้ง" sub="ใช้ได้ ~3 เดือน" x={40} y={160} rot={3} color={NOTE_BLUE} w={430} />
      <PaperGrain id="ug02" opacity={0.2} />
    </AbsoluteFill>
  );
}
