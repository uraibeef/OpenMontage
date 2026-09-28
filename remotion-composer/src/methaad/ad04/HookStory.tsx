import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { usePop } from "../hooks/kit";
import { clamp, CORAL, INK, P, SUN } from "./style";

/**
 * 9.22–10.48 s: the barber's photo opened full screen (viewer chrome only).
 * 10.48–12.74 s: his own story — segment bars on top, stickers that act out
 * the step words ("โรย" sheds powder, "ขยำ" gets squeezed in a fist).
 */

export function PhotoViewer() {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [2, 8], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ opacity: o, fontFamily: P.ui, color: "#fff" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 24,
          padding: "70px 40px 40px",
          background: "linear-gradient(180deg, rgba(0,0,0,0.55), rgba(0,0,0,0))",
        }}
      >
        <svg width={40} height={52} viewBox="0 0 40 52">
          <path d="M 30 6 L 10 26 L 30 46" stroke="#fff" strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 38, fontWeight: 600 }}>ช่างเอ็ม</div>
          <div style={{ fontSize: 26, opacity: 0.8 }}>วันนี้ 07:16</div>
        </div>
        <svg width={56} height={56} viewBox="0 0 56 56">
          <path d="M 28 8 V 36 M 16 24 L 28 36 L 40 24 M 10 46 H 46" stroke="#fff" strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </AbsoluteFill>
  );
}

interface StoryProps {
  /** Local frame each story segment starts; the last entry is the end. */
  cuts: readonly number[];
  sprinkleAt: number;
  scrunchAt: number;
}

function Bars({ cuts }: { cuts: readonly number[] }) {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 24, right: 24, top: 40, display: "flex", gap: 10 }}>
      {cuts.slice(0, -1).map((c, i) => {
        const p = interpolate(frame, [c, cuts[i + 1]], [0, 100], clamp);
        return (
          <div key={i} style={{ flex: 1, height: 8, borderRadius: 4, background: "rgba(255,255,255,0.4)", overflow: "hidden" }}>
            <div style={{ width: `${p}%`, height: "100%", background: "#fff" }} />
          </div>
        );
      })}
    </div>
  );
}

function StoryHead() {
  return (
    <div style={{ position: "absolute", left: 30, right: 36, top: 72, display: "flex", alignItems: "center", gap: 18, fontFamily: P.ui, color: "#fff" }}>
      <div style={{ width: 78, height: 78, borderRadius: 39, padding: 4, background: `conic-gradient(${CORAL}, ${SUN}, ${CORAL})` }}>
        <svg width={70} height={70} viewBox="0 0 70 70" style={{ borderRadius: 35, background: "#23232A" }}>
          <circle cx={35} cy={28} r={13} fill="#EFC49E" />
          <path d="M 20 26 Q 22 8 36 10 Q 52 10 50 26 Q 46 16 35 17 Q 24 16 20 26 Z" fill="#111" />
          <path d="M 12 66 Q 16 44 35 44 Q 54 44 58 66 Z" fill="#DDD" />
        </svg>
      </div>
      <span style={{ fontSize: 34, fontWeight: 600, textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>สตอรี่ของคุณ</span>
      <span style={{ fontSize: 30, opacity: 0.8, flex: 1, textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>1 นาที</span>
      <svg width={44} height={44} viewBox="0 0 44 44">
        <path d="M 8 8 L 36 36 M 36 8 L 8 36" stroke="#fff" strokeWidth={5} strokeLinecap="round" />
      </svg>
    </div>
  );
}

/** Story "highlight" text: each word on its own rounded slab. */
function TitleSticker() {
  const pop = usePop(2, 12);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 1560,
        display: "flex",
        justifyContent: "center",
        transform: `rotate(-4deg) scale(${pop})`,
      }}
    >
      <span
        style={{
          fontFamily: P.ui,
          fontWeight: 700,
          fontSize: 92,
          lineHeight: 1.25,
          color: INK,
          background: "#fff",
          padding: "8px 40px 14px",
          borderRadius: 26,
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
        }}
      >
        แป้งเซ็ตผม
      </span>
    </div>
  );
}

function SprinkleSticker({ at }: { at: number }) {
  const frame = useCurrentFrame();
  const pop = usePop(at, 9);
  const peel = interpolate(pop, [0, 1], [-40, 8]);
  const t = frame - at;
  return (
    <div style={{ position: "absolute", left: 520, top: 1400, transform: `translate(-50%, 0) rotate(${peel}deg) scale(${pop})` }}>
      <div
        style={{
          position: "relative",
          fontFamily: P.sticker,
          fontWeight: 900,
          fontSize: 230,
          lineHeight: 1.1,
          color: "#fff",
          background: CORAL,
          padding: "0 60px 20px",
          borderRadius: 60,
          border: "12px solid #fff",
          boxShadow: "0 18px 0 rgba(0,0,0,0.25)",
        }}
      >
        โรย
      </div>
      {Array.from({ length: 22 }, (_, i) => {
        const x = 70 + ((i * 53) % 330);
        const delay = (i * 7) % 11;
        const y = 280 + Math.max(0, t - delay) * (9 + (i % 4) * 3);
        const o = t > delay ? interpolate(t - delay, [0, 16], [1, 0], clamp) : 0;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: 10 + (i % 3) * 5, height: 10 + (i % 3) * 5, borderRadius: 10, background: "#fff", opacity: o }} />;
      })}
    </div>
  );
}

function ScrunchSticker({ at }: { at: number }) {
  const frame = useCurrentFrame();
  const pop = usePop(at, 10);
  const t = Math.max(0, frame - at);
  const squeeze = t > 2 ? Math.abs(Math.sin((t - 2) * 0.55)) * interpolate(t, [2, 20], [1, 0.2], clamp) : 0;
  const sx = 1 - 0.3 * squeeze;
  const sy = 1 + 0.18 * squeeze;
  return (
    <div
      style={{
        position: "absolute",
        left: 540,
        top: 1420,
        transform: `translate(-50%, 0) rotate(-7deg) scale(${pop * sx}, ${pop * sy})`,
      }}
    >
      <div
        style={{
          fontFamily: P.sticker,
          fontWeight: 900,
          fontSize: 230,
          lineHeight: 1.1,
          color: INK,
          background: SUN,
          padding: "0 64px 20px",
          clipPath: "polygon(4% 8%, 22% 0, 48% 6%, 76% 0, 97% 7%, 100% 50%, 96% 94%, 70% 100%, 45% 93%, 20% 100%, 2% 92%, 0 50%)",
          transform: `skewX(${-10 * squeeze}deg)`,
        }}
      >
        ขยำ
      </div>
    </div>
  );
}

export function HookStory({ cuts, sprinkleAt, scrunchAt }: StoryProps) {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", inset: 0, height: 260, background: "linear-gradient(180deg, rgba(0,0,0,0.45), rgba(0,0,0,0))" }} />
      <Bars cuts={cuts} />
      <StoryHead />
      {frame < sprinkleAt ? <TitleSticker /> : null}
      {frame >= sprinkleAt && frame < scrunchAt ? <SprinkleSticker at={sprinkleAt} /> : null}
      {frame >= scrunchAt ? <ScrunchSticker at={scrunchAt} /> : null}
      <div
        style={{
          position: "absolute",
          left: 40,
          right: 40,
          bottom: 60,
          height: 96,
          borderRadius: 48,
          border: "3px solid rgba(255,255,255,0.75)",
          display: "flex",
          alignItems: "center",
          padding: "0 38px",
          fontFamily: P.ui,
          fontSize: 34,
          color: "rgba(255,255,255,0.9)",
          opacity: interpolate(frame, [0, 6], [0, 1], { ...clamp, easing: Easing.out(Easing.quad) }),
        }}
      >
        ส่งข้อความ
      </div>
    </AbsoluteFill>
  );
}
