/**
 * @methamamao × Usmile ad #1 — "ไม้จิ้มฟันขอเลิก".
 *
 * Identity: a HANDWRITTEN BREAK-UP LETTER on paper. The toothpick is the writer;
 * cartoon/3D tooth footage sits in a taped "photo" at the top of the sheet while each
 * VO phrase is inked on the letter below. Twist (~13 s): the writer introduces its
 * replacement — a yellow sticky note "Usmile ไหมขัดฟันพลังน้ำ" slaps onto the photo.
 * Footage is cropped inside the photo window (burned-in captions/watermarks stay outside
 * the window); the paper, tape, notes and ink are ours. VO only — no music, no SFX.
 */
import { AbsoluteFill, Audio, Easing, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { PaperGrain } from "../../fxkit";
import { INK, NOTE_BLUE, NOTE_YELLOW, PAPER, PEN_RED, s, T } from "./style";

export const USMILE_AD_01_FPS = 30;
export const USMILE_AD_01_SECONDS = 26.55;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

interface Shot {
  from: number;
  to: number;
  clip: string;
  /** Source length (s); a shorter source is slowed to fill the slot. */
  srcLen: number;
  /** 0 = show top of the frame, 1 = show bottom (hides captions/watermarks). */
  anchorY?: number;
  zoom?: number;
}

const SHOTS: readonly Shot[] = [
  { from: 0, to: 1.44, clip: "s0421", srcLen: 3.0, anchorY: 0.4 },
  { from: 1.44, to: 2.74, clip: "s0444", srcLen: 3.62, anchorY: 0.3 },
  { from: 2.74, to: 4.16, clip: "s0445", srcLen: 4.35, anchorY: 0.3 },
  { from: 4.16, to: 4.96, clip: "s0424", srcLen: 3.0, anchorY: 0.4 },
  { from: 4.96, to: 7.0, clip: "s0430", srcLen: 3.0, anchorY: 0.4 },
  { from: 7.0, to: 8.56, clip: "s0428", srcLen: 3.0, anchorY: 0.4 },
  { from: 8.56, to: 10.0, clip: "s0018", srcLen: 3.0, anchorY: 0.4 },
  { from: 10.0, to: 11.76, clip: "s0426", srcLen: 3.0, anchorY: 0.4 },
  { from: 11.76, to: 13.16, clip: "s0433", srcLen: 2.82, anchorY: 0.4 },
  { from: 13.16, to: 15.32, clip: "s0008", srcLen: 1.77, anchorY: 0.75, zoom: 1.15 },
  { from: 15.32, to: 16.16, clip: "s0450", srcLen: 3.0, anchorY: 0.5 },
  { from: 16.16, to: 17.84, clip: "s0011", srcLen: 3.0, anchorY: 0.2, zoom: 1.32 },
  { from: 17.84, to: 19.48, clip: "s0187", srcLen: 3.0, anchorY: 0.15 },
  { from: 19.48, to: 21.12, clip: "s0194", srcLen: 3.0, anchorY: 0.2 },
  { from: 21.12, to: 22.32, clip: "s0422", srcLen: 3.0, anchorY: 0.4 },
  { from: 22.32, to: 24.04, clip: "s0442", srcLen: 2.0, anchorY: 0.4 },
  { from: 24.04, to: USMILE_AD_01_SECONDS, clip: "s0271", srcLen: 3.0, anchorY: 0.4 },
];

/** Ink lines: [from, to, text]. Each is wiped in left-to-right like a pen stroke. */
const LINES: readonly [number, number, string][] = [
  [0.0, 1.44, "ถึงมึง... กูขอเลิก"],
  [1.44, 2.74, "สิบปีที่เราคบกัน"],
  [2.74, 4.16, "กูทำให้มึงเจ็บไปกี่รอบ"],
  [4.16, 4.96, "กูไม่กล้านับ"],
  [4.96, 7.0, "กูรู้ตัวแล้วว่า กูไม่ใช่คนที่ใช่"],
  [7.0, 8.56, "กูไม่เคยเอาเศษออกจริงๆ"],
  [8.56, 10.0, "กูแค่ดันมันให้ลึกกว่าเดิม"],
  [10.0, 11.76, "แต่มึงก็ยังกลับมาหากู\nทุกมื้อ"],
  [11.76, 13.16, "กูเลยหาคนใหม่ให้มึงแล้ว"],
  [13.16, 15.32, "ไหมขัดฟันพลังน้ำ Usmile"],
  [15.32, 16.16, "ใช้น้ำซัด"],
  [16.16, 17.84, "ไม่ต้องจิ้ม\nปรับได้ 4 ระดับ"],
  [17.84, 19.48, "หัวฉีดนุ่ม ไม่บาดเหงือก"],
  [19.48, 21.12, "ชาร์จทีเดียว อยู่ได้ 3 เดือน"],
  [21.12, 22.32, "ซื่อสัตย์กว่ากูเยอะ"],
  [22.32, 24.04, "ส่วนกู ไม่หายไปไหนหรอก"],
  [24.04, USMILE_AD_01_SECONDS, "ยังนอนอยู่ในกล่อง\nข้างโต๊ะกินข้าวมึงนั่นแหละ"],
];

/** Video kept muted, slowed if short, with a slow push, cropped to the photo window. */
function WindowClip({ shot }: { shot: Shot }) {
  const frame = useCurrentFrame();
  const slot = shot.to - shot.from;
  const rate = Math.min(1, shot.srcLen / slot);
  const zoom = (shot.zoom ?? 1) * interpolate(frame, [0, s(slot)], [1.0, 1.07], clamp);
  const ay = shot.anchorY ?? 0.4;
  // Source is 1080x1920 shown 1.0x wide in a 960x1040 window → 1170 px of height visible... move the
  // 1920-tall frame so the chosen anchor sits in the window.
  const overflow = 1920 * 0.9 - 1040;
  const y = -overflow * ay;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: y, width: 960, height: 1728, transform: `scale(${zoom})`, transformOrigin: `50% ${ay * 100}%` }}>
        <OffthreadVideo
          src={staticFile(`usmile01/${shot.clip}.mp4`)}
          muted
          playbackRate={rate}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    </div>
  );
}

function Tape({ x, y, rot }: { x: number; y: number; rot: number }) {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 170,
        height: 52,
        transform: `rotate(${rot}deg)`,
        background: "rgba(235,222,170,0.82)",
        boxShadow: "0 2px 6px rgba(0,0,0,0.18)",
        clipPath: "polygon(3% 0, 100% 6%, 97% 100%, 0 92%)",
      }}
    />
  );
}

/** The taped photo: cuts flick the paper a hair so hard cuts feel physical. */
function Photo() {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const cutAt = SHOTS.map((sh) => sh.from).filter((f) => f <= t).pop() ?? 0;
  const since = (t - cutAt) * 30;
  const flick = since < 5 ? interpolate(since, [0, 5], [1, 0], clamp) : 0;
  const idx = SHOTS.findIndex((sh) => sh.from === cutAt);
  const rot = -1.1 + (idx % 2 === 0 ? 1 : -1) * flick * 0.9;
  return (
    <div style={{ position: "absolute", left: 60, top: 70, width: 960, height: 1040, transform: `rotate(${rot}deg)` }}>
      <div style={{ position: "absolute", inset: 0, background: "#fff", boxShadow: "0 18px 40px rgba(40,30,10,0.35)", padding: 0 }} />
      <div style={{ position: "absolute", inset: 14, overflow: "hidden", background: "#111" }}>
        <div style={{ position: "absolute", inset: 0, width: 932, height: 1012 }}>
          {SHOTS.map((sh) => (
            <Sequence key={sh.clip + sh.from} from={s(sh.from)} durationInFrames={s(sh.to - sh.from)} layout="none">
              <div style={{ position: "absolute", inset: 0, width: 960, height: 1040, transform: "scale(0.97)", transformOrigin: "0 0" }}>
                <WindowClip shot={sh} />
              </div>
            </Sequence>
          ))}
        </div>
      </div>
      <Tape x={-40} y={-22} rot={-34} />
      <Tape x={830} y={-24} rot={30} />
    </div>
  );
}

/** One inked phrase, wiped in by a pen stroke over its first ~35% of the slot. */
function InkLine({ text, dur }: { text: string; dur: number }) {
  const frame = useCurrentFrame();
  const wipe = interpolate(frame, [0, Math.max(6, dur * 0.35)], [0, 100], { ...clamp, easing: Easing.out(Easing.cubic) });
  const rise = interpolate(frame, [0, 6], [14, 0], clamp);
  const long = text.length > 22 || text.includes("\n");
  return (
    <div
      style={{
        position: "absolute",
        left: 80,
        right: 80,
        top: 1230,
        height: 480,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        transform: `translateY(${rise}px) rotate(-0.6deg)`,
      }}
    >
      <div
        style={{
          fontFamily: T.ink,
          fontWeight: 700,
          fontSize: text.length > 30 ? 74 : long ? 84 : 100,
          lineHeight: 1.28,
          whiteSpace: "pre-line",
          color: INK,
          clipPath: `inset(-10px ${100 - wipe}% -10px 0)`,
          textShadow: "0.6px 0.6px 0 rgba(30,37,64,0.35)",
        }}
      >
        {text}
      </div>
    </div>
  );
}

/** Small "from" header so viewers know who is writing from the first frame. */
function FromHeader() {
  return (
    <div style={{ position: "absolute", left: 90, top: 1150, display: "flex", alignItems: "center", gap: 18, transform: "rotate(-0.6deg)" }}>
      <svg width={120} height={30} viewBox="0 0 120 30">
        <path d="M6 15 L112 12" stroke="#B98B4E" strokeWidth={9} strokeLinecap="round" />
        <path d="M100 12.5 L116 12" stroke="#7A5526" strokeWidth={9} strokeLinecap="round" />
      </svg>
      <span style={{ fontFamily: T.ink, fontWeight: 600, fontSize: 40, color: INK, opacity: 0.75 }}>จาก ไม้จิ้มฟัน</span>
    </div>
  );
}

/** Sticky note that slaps onto the photo at the twist. */
function Note({ at, until, text, sub, x, y, rot, color, w = 470 }: { at: number; until: number; text: string; sub?: string; x: number; y: number; rot: number; color: string; w?: number }) {
  const frame = useCurrentFrame();
  const f = frame - s(at);
  if (f < 0 || frame >= s(until)) return null;
  const sc = interpolate(f, [0, 5, 9], [1.5, 0.94, 1], clamp);
  const o = interpolate(f, [0, 3], [0, 1], clamp);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        padding: "26px 30px 30px",
        background: color,
        color: INK,
        fontFamily: T.note,
        boxShadow: "0 14px 26px rgba(30,20,0,0.35)",
        opacity: o,
        transform: `rotate(${rot}deg) scale(${sc})`,
      }}
    >
      <div style={{ fontWeight: 600, fontSize: 62, lineHeight: 1.1 }}>{text}</div>
      {sub ? <div style={{ fontWeight: 500, fontSize: 46, lineHeight: 1.2, marginTop: 8 }}>{sub}</div> : null}
    </div>
  );
}

/** Four settings dots: the fourth "fills in" like a pen tick. */
function LevelDots({ at, until }: { at: number; until: number }) {
  const frame = useCurrentFrame();
  const f = frame - s(at);
  if (f < 0 || frame >= s(until)) return null;
  return (
    <div style={{ position: "absolute", left: 560, top: 860, display: "flex", gap: 22, transform: "rotate(-3deg)", background: PAPER, padding: "18px 26px", boxShadow: "0 10px 20px rgba(0,0,0,0.3)" }}>
      {[0, 1, 2, 3].map((i) => {
        const on = f > 4 + i * 5;
        return <div key={i} style={{ width: 46, height: 46, borderRadius: 23, border: `5px solid ${INK}`, background: on ? INK : "transparent" }} />;
      })}
    </div>
  );
}

/** Red-pen scribble over the writer's own "promise" after it admits fault. */
function RedScribble({ at, dur }: { at: number; dur: number }) {
  const frame = useCurrentFrame();
  const f = frame - s(at);
  if (f < 0) return null;
  const p = interpolate(f, [0, s(dur)], [0, 1], clamp);
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
      <path d="M90 1440 C 300 1400, 500 1480, 990 1420" stroke={PEN_RED} strokeWidth={9} fill="none" strokeLinecap="round" strokeDasharray={1000} strokeDashoffset={1000 * (1 - p)} opacity={0.9} />
    </svg>
  );
}

export function UsmileAd01() {
  return (
    <AbsoluteFill style={{ background: PAPER }}>
      <Audio src={staticFile("usmile01/vo.mp3")} />
      {/* faint ruled lines */}
      <AbsoluteFill>
        <svg width={1080} height={1920} viewBox="0 0 1080 1920">
          {Array.from({ length: 9 }, (_, i) => (
            <line key={i} x1={60} x2={1020} y1={1300 + i * 70} y2={1302 + i * 70} stroke="#9AA6C4" strokeWidth={2} opacity={0.35} />
          ))}
        </svg>
      </AbsoluteFill>
      <Photo />
      <FromHeader />
      {LINES.map(([a, b, text]) => (
        <Sequence key={a} from={s(a)} durationInFrames={s(b - a)} layout="none">
          <InkLine text={text} dur={s(b - a)} />
        </Sequence>
      ))}
      <Sequence from={s(4.16)} durationInFrames={s(0.9)} layout="none">
        <RedScribble at={0} dur={0.6} />
      </Sequence>
      <Note at={13.16} until={15.32} text="Usmile" sub="ไหมขัดฟันพลังน้ำ" x={420} y={640} rot={-4} color={NOTE_YELLOW} />
      <Note at={19.48} until={21.12} text="ชาร์จ 1 ครั้ง" sub="ใช้ได้ ~3 เดือน" x={70} y={700} rot={3} color={NOTE_BLUE} w={430} />
      <LevelDots at={16.2} until={17.84} />
      <PaperGrain id="ug01" opacity={0.22} />
    </AbsoluteFill>
  );
}
