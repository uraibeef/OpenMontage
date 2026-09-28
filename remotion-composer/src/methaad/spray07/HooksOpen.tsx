import { AbsoluteFill, Easing, interpolate, OffthreadVideo, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { graphemes } from "../hooks/kit";
import { BONE, clamp, CORAL, INK, MINT, MUTED, NIGHT, T } from "./style";

/**
 * Beat 0a — "ผู้ชายสามแบบ".
 * Three mini profile cards are dealt into a fan; a coral notification badge
 * counts 1 → 2 → 3 as each one lands, next to "ผู้ชาย ... แบบ".
 */
const MINIS = [
  { src: "methaspray07/t1a.mp4", rot: -13, dx: -250, at: 0 },
  { src: "methaspray07/t2c.mp4", rot: 12, dx: 250, at: 5 },
  { src: "methaspray07/t3c.mp4", rot: 0, dx: 0, at: 10 },
] as const;

function MiniCard({ src, rot, dx, at }: (typeof MINIS)[number]) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: { damping: 13, stiffness: 170, mass: 0.7 } });
  if (frame < at) return null;
  const y = interpolate(s, [0, 1], [900, 0]);
  return (
    <div
      style={{
        position: "absolute",
        left: 540 - 205 + dx,
        top: 470,
        width: 410,
        height: 620,
        borderRadius: 30,
        overflow: "hidden",
        border: `6px solid ${BONE}`,
        boxShadow: "0 24px 50px rgba(0,0,0,0.55)",
        transform: `translateY(${y}px) rotate(${rot * s}deg)`,
        backgroundColor: NIGHT,
      }}
    >
      <OffthreadVideo src={staticFile(src)} muted style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 40%" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 62%, rgba(8,16,12,0.85) 100%)" }} />
    </div>
  );
}

export function DealThree() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const count = frame >= 10 ? 3 : frame >= 5 ? 2 : 1;
  const lastAt = count === 3 ? 10 : count === 2 ? 5 : 0;
  const bump = spring({ frame: frame - lastAt, fps, config: { damping: 8, stiffness: 260, mass: 0.5 } });
  const word = interpolate(frame, [2, 9], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill>
      {MINIS.map((m) => (
        <MiniCard key={m.src} {...m} />
      ))}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1250, display: "flex", justifyContent: "center", alignItems: "center", gap: 26, opacity: word, transform: `translateY(${(1 - word) * 40}px)` }}>
        <span style={{ fontFamily: T.count, fontWeight: 900, fontSize: 150, color: BONE, letterSpacing: -4 }}>ผู้ชาย</span>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 200,
            height: 200,
            borderRadius: 100,
            backgroundColor: CORAL,
            color: BONE,
            fontFamily: T.count,
            fontWeight: 900,
            fontSize: 170,
            lineHeight: 1,
            transform: `scale(${0.6 + 0.4 * bump}) rotate(${(1 - bump) * -20}deg)`,
            boxShadow: `0 0 0 10px ${NIGHT}, 0 0 60px ${CORAL}AA`,
            paddingTop: 12,
          }}
        >
          {count}
        </span>
        <span style={{ fontFamily: T.count, fontWeight: 900, fontSize: 150, color: BONE, letterSpacing: -4 }}>แบบ</span>
      </div>
    </AbsoluteFill>
  );
}

/**
 * Beat 0b — "ที่ควรมีสเปรย์เพิ่มวอลลุ่ม".
 * A filter bottom-sheet slides over the bottle's card: the search field
 * types the words, then the "ต้องมี" switch flips on in mint.
 */
const QUERY = "สเปรย์เพิ่มวอลลุ่ม";
const TYPE_FROM = 4;
const TYPE_TO = 26;
const SWITCH_AT = 30;

export function FilterSheet() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const up = interpolate(frame, [0, 7], [1, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const g = graphemes(QUERY);
  const shown = Math.round(interpolate(frame, [TYPE_FROM, TYPE_TO], [0, g.length], clamp));
  const caret = Math.floor(frame / 6) % 2 === 0 && frame < SWITCH_AT + 6;
  const on = spring({ frame: frame - SWITCH_AT, fps, config: { damping: 12, stiffness: 220, mass: 0.6 } });
  const knobX = interpolate(on, [0, 1], [0, 74]);
  const track = on > 0.5 ? MINT : "#3A4A43";
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1210,
          height: 760,
          backgroundColor: BONE,
          borderRadius: "54px 54px 0 0",
          transform: `translateY(${up * 760}px)`,
          boxShadow: "0 -20px 60px rgba(0,0,0,0.45)",
          padding: "26px 64px",
        }}
      >
        <div style={{ width: 120, height: 10, borderRadius: 5, backgroundColor: "#D5CEC0", margin: "0 auto 26px" }} />
        <div style={{ fontFamily: T.ui, fontWeight: 700, fontSize: 40, color: MUTED, marginBottom: 20 }}>ตัวกรอง · ผู้ชายที่ควรมี</div>
        <div style={{ display: "flex", alignItems: "center", gap: 20, height: 124, borderRadius: 62, backgroundColor: "#ECE5D7", padding: "0 38px" }}>
          <svg width={50} height={50} viewBox="-25 -25 50 50">
            <circle cx={-4} cy={-4} r={14} fill="none" stroke={INK} strokeWidth={6} />
            <path d="M 7 7 L 18 18" stroke={INK} strokeWidth={7} strokeLinecap="round" />
          </svg>
          <span style={{ fontFamily: T.ui, fontWeight: 700, fontSize: 66, color: INK, whiteSpace: "nowrap" }}>
            {g.slice(0, shown).join("")}
            <span style={{ display: "inline-block", width: 5, height: 66, marginLeft: 4, backgroundColor: CORAL, opacity: caret ? 1 : 0, verticalAlign: "middle" }} />
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 34 }}>
          <span style={{ fontFamily: T.ui, fontWeight: 600, fontSize: 54, color: INK }}>ต้องมี</span>
          <div style={{ width: 164, height: 90, borderRadius: 45, backgroundColor: track, position: "relative", boxShadow: on > 0.5 ? `0 0 40px ${MINT}` : "none" }}>
            <div style={{ position: "absolute", top: 8, left: 8 + knobX, width: 74, height: 74, borderRadius: 37, backgroundColor: "#FFFFFF", boxShadow: "0 3px 8px rgba(0,0,0,0.3)" }} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}
