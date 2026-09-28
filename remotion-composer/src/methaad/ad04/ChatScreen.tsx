import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { graphemes, usePop } from "../hooks/kit";
import { clamp, CORAL, INK, P } from "./style";

/**
 * Beat 4 (6.12–9.22 s): a full-frame, unbranded Thai chat app. He types the
 * question, the barber answers with a photo of a small bottle and one line,
 * and the photo bubble blows up to full frame into the footage.
 */

export interface ChatTimes {
  typeEnd: number;
  send: number;
  read: number;
  dots: number;
  photo: number;
  reply: number;
  expand: number;
  expandDur: number;
}

const QUESTION = "พี่ๆ ใช้อะไรเซ็ตผมอ่ะ";
const BG = "#EFE9E1";
const PHOTO = { x: 36, y: 668, w: 470, h: 700 } as const;

function StatusBar() {
  return (
    <div style={{ display: "flex", alignItems: "center", height: 84, padding: "0 56px", fontFamily: P.ui, fontWeight: 600, fontSize: 32, color: INK }}>
      <span style={{ flex: 1 }}>07:15</span>
      <svg width={150} height={30} viewBox="0 0 150 30">
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={i * 11} y={22 - i * 7} width={7} height={8 + i * 7} rx={2} fill={INK} />
        ))}
        <path d="M 58 12 Q 72 0 86 12 M 63 18 Q 72 10 81 18" stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" />
        <circle cx={72} cy={24} r={4} fill={INK} />
        <rect x={98} y={4} width={44} height={22} rx={7} fill="none" stroke={INK} strokeWidth={3} opacity={0.5} />
        <rect x={102} y={8} width={10} height={14} rx={3} fill="#E5352B" />
        <rect x={144} y={11} width={4} height={8} rx={2} fill={INK} opacity={0.5} />
      </svg>
    </div>
  );
}

function Avatar() {
  return (
    <svg width={92} height={92} viewBox="0 0 92 92">
      <circle cx={46} cy={46} r={46} fill="#2B2B33" />
      <circle cx={46} cy={36} r={16} fill="#F2C9A5" />
      <path d="M 28 34 Q 30 14 48 16 Q 66 16 64 34 Q 58 24 46 25 Q 34 24 28 34 Z" fill="#111" />
      <path d="M 16 84 Q 22 58 46 58 Q 70 58 76 84 Z" fill={CORAL} />
      <path d="M 64 66 l 14 -14 M 64 52 l 14 14" stroke="#fff" strokeWidth={4} strokeLinecap="round" />
    </svg>
  );
}

function Header() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 22,
        padding: "18px 40px 22px 26px",
        background: "#FFFFFF",
        borderBottom: "2px solid rgba(0,0,0,0.07)",
        fontFamily: P.ui,
        color: INK,
      }}
    >
      <svg width={40} height={52} viewBox="0 0 40 52">
        <path d="M 30 6 L 10 26 L 30 46" stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <Avatar />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 42, fontWeight: 700, lineHeight: 1.25 }}>ช่างเอ็ม · ร้านตัดผม</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 28, color: "#1FA35B", fontWeight: 500 }}>
          <span style={{ width: 14, height: 14, borderRadius: 7, background: "#1FA35B" }} />
          ออนไลน์
        </div>
      </div>
      <svg width={120} height={48} viewBox="0 0 120 48">
        <path d="M 10 8 q 6 -4 10 2 l 5 9 q 2 4 -2 7 l -4 3 q 4 9 12 13 l 3 -4 q 3 -4 7 -2 l 9 5 q 6 4 2 10 q -6 7 -14 5 q -30 -8 -36 -38 q -1 -7 8 -10 z" fill={INK} />
        <rect x={70} y={12} width={32} height={26} rx={6} fill={INK} />
        <path d="M 104 20 L 118 12 L 118 38 L 104 30 Z" fill={INK} />
      </svg>
    </div>
  );
}

function DateChip({ label }: { label: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", margin: "26px 0 18px" }}>
      <span style={{ fontFamily: P.ui, fontWeight: 500, fontSize: 26, color: "#6E675E", background: "rgba(255,255,255,0.7)", padding: "6px 22px", borderRadius: 20 }}>
        {label}
      </span>
    </div>
  );
}

function Bubble({ side, children, pop, style }: { side: "in" | "out"; children: React.ReactNode; pop: number; style?: React.CSSProperties }) {
  const out = side === "out";
  return (
    <div
      style={{
        alignSelf: out ? "flex-end" : "flex-start",
        maxWidth: 760,
        padding: "20px 32px 22px",
        borderRadius: out ? "40px 40px 10px 40px" : "40px 40px 40px 10px",
        background: out ? CORAL : "#FFFFFF",
        color: out ? "#fff" : INK,
        fontFamily: P.ui,
        fontWeight: 500,
        fontSize: 44,
        lineHeight: 1.4,
        boxShadow: "0 3px 0 rgba(0,0,0,0.06)",
        transform: `scale(${pop})`,
        transformOrigin: out ? "right bottom" : "left bottom",
        opacity: Math.min(1, pop * 2),
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Ticks({ read }: { read: boolean }) {
  return (
    <svg width={44} height={26} viewBox="0 0 44 26" style={{ marginLeft: 12, verticalAlign: "middle" }}>
      <path d="M 2 14 L 10 22 L 26 4" stroke="#fff" strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {read ? <path d="M 16 20 L 18 22 L 34 4" stroke="#fff" strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" /> : null}
    </svg>
  );
}

function TypingDots() {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", gap: 12, padding: "8px 4px" }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 18,
            height: 18,
            borderRadius: 9,
            background: "#9A938A",
            transform: `translateY(${Math.sin(frame * 0.6 - i * 1.1) * 6}px)`,
          }}
        />
      ))}
    </div>
  );
}

function InputBar({ text, caret }: { text: string; caret: boolean }) {
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 200, background: "#fff", display: "flex", alignItems: "flex-start", gap: 22, padding: "30px 32px 0" }}>
      <svg width={64} height={76} viewBox="0 0 64 76">
        <path d="M 32 18 V 58 M 12 38 H 52" stroke={INK} strokeWidth={6} strokeLinecap="round" />
      </svg>
      <div
        style={{
          flex: 1,
          height: 84,
          borderRadius: 42,
          background: "#F1EEEA",
          display: "flex",
          alignItems: "center",
          padding: "0 34px",
          fontFamily: P.ui,
          fontSize: 40,
          color: text ? INK : "#A09A92",
          whiteSpace: "nowrap",
          overflow: "hidden",
        }}
      >
        {text || "พิมพ์ข้อความ"}
        {caret ? <span style={{ width: 4, height: 50, background: CORAL, marginLeft: 4 }} /> : null}
      </div>
      <svg width={84} height={84} viewBox="0 0 84 84">
        <circle cx={42} cy={42} r={42} fill={text ? CORAL : "#D9D4CD"} />
        <path d="M 24 42 L 60 26 L 50 60 L 42 46 Z" fill="#fff" />
      </svg>
      <div style={{ position: "absolute", bottom: 20, left: 390, width: 300, height: 10, borderRadius: 5, background: INK }} />
    </div>
  );
}

export function ChatScreen({ t }: { t: ChatTimes }) {
  const frame = useCurrentFrame();
  const glyphs = graphemes(QUESTION);
  const typed = frame >= t.send ? "" : glyphs.slice(0, Math.round(interpolate(frame, [1, t.typeEnd], [0, glyphs.length], clamp))).join("");
  const sentPop = usePop(t.send, 14);
  const dotsPop = usePop(t.dots, 14);
  const photoPop = usePop(t.photo, 18);
  const replyPop = usePop(t.reply, 14);
  const ex = interpolate(frame, [t.expand, t.expand + t.expandDur], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const push = interpolate(frame, [0, t.expand], [1, 1.035], clamp);

  // The bubble's rect after the chat's slow push (origin matches the container's 30% 55%).
  const [ox, oy] = [324, 1056];
  const px = interpolate(ex, [0, 1], [ox + (PHOTO.x - ox) * push, 0]);
  const py = interpolate(ex, [0, 1], [oy + (PHOTO.y - oy) * push, 0]);
  const pw = interpolate(ex, [0, 1], [PHOTO.w * push, 1080]);
  const ph = interpolate(ex, [0, 1], [PHOTO.h * push, 1920]);

  return (
    <AbsoluteFill style={{ background: BG }}>
      <AbsoluteFill style={{ transform: `scale(${push * (1 + ex * 0.08)})`, transformOrigin: "30% 55%", opacity: 1 - ex * 0.6 }}>
        <div style={{ background: "#fff" }}>
          <StatusBar />
          <Header />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, padding: "0 36px" }}>
          <DateChip label="เมื่อวาน" />
          <Bubble side="in" pop={1}>
            ขอบคุณที่ใช้บริการครับ
          </Bubble>
          <DateChip label="วันนี้" />
          <div style={{ alignSelf: "flex-end", display: "flex", alignItems: "flex-end", gap: 14, height: 110 }}>
            {frame >= t.read ? (
              <span style={{ fontFamily: P.ui, fontSize: 24, color: "#8A837A", lineHeight: 1.3, textAlign: "right" }}>
                อ่านแล้ว
                <br />
                07:15
              </span>
            ) : null}
            {frame >= t.send ? (
              <Bubble side="out" pop={sentPop}>
                {QUESTION}
                <Ticks read={frame >= t.read} />
              </Bubble>
            ) : null}
          </div>
          <div style={{ height: PHOTO.h, position: "relative" }}>
            {frame >= t.dots && frame < t.photo ? (
              <Bubble side="in" pop={dotsPop}>
                <TypingDots />
              </Bubble>
            ) : null}
          </div>
          {frame >= t.reply ? (
            <Bubble side="in" pop={replyPop} style={{ marginTop: 10 }}>
              อันนี้ขวดเดียวพอ
            </Bubble>
          ) : null}
        </div>
        <InputBar text={typed} caret={frame < t.send && Math.floor(frame / 4) % 2 === 0} />
      </AbsoluteFill>
      {frame >= t.photo ? (
        <div
          style={{
            position: "absolute",
            left: px,
            top: py,
            width: pw,
            height: ph,
            borderRadius: 36 * (1 - ex),
            overflow: "hidden",
            transform: `scale(${ex > 0 ? 1 : photoPop})`,
            transformOrigin: "left top",
            boxShadow: ex < 1 ? "0 6px 18px rgba(0,0,0,0.18)" : "none",
            border: `${8 * (1 - ex)}px solid #fff`,
          }}
        >
          <Img src={staticFile("methaad04/bottle.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <span
            style={{
              position: "absolute",
              right: 18,
              bottom: 14,
              fontFamily: P.ui,
              fontSize: 24,
              color: "#fff",
              background: "rgba(0,0,0,0.45)",
              padding: "2px 12px",
              borderRadius: 12,
              opacity: 1 - ex,
            }}
          >
            07:16
          </span>
        </div>
      ) : null}
    </AbsoluteFill>
  );
}
