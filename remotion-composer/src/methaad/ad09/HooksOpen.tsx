import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { FitClip } from "../ad02/FitClip";
import { graphemes, usePop } from "../hooks/kit";
import { clamp, CLASS, G, GOLD, NAVY, NAVY_2, WHITE } from "./style";

/**
 * Opening beats. 0–1.0 s: the CHARACTER SELECT screen — the arcade title
 * "ผู้ชาย 3 แบบ" slams down letter by letter while the cursor hops across three
 * locked slots. 1.0–2.95 s: an RPG quest dialogue box types the objective.
 */

const SLOTS = [
  { clip: "methaad02/a03", secs: 1.8, color: CLASS.lazy.main, x: 60 },
  { clip: "methaad09/g02", secs: 1.5, color: CLASS.rider.main, x: 390 },
  { clip: "methaad09/g05", secs: 1.6, color: CLASS.fine.main, x: 720 },
] as const;
const SLOT_W = 300;
const SLOT_H = 540;
const SLOT_Y = 860;

function TitleSlam() {
  const frame = useCurrentFrame();
  const parts = graphemes("ผู้ชาย 3 แบบ");
  return (
    <div style={{ position: "absolute", top: 470, left: 0, right: 0, textAlign: "center", fontFamily: G.title, fontWeight: 900, fontStyle: "italic", fontSize: 150, lineHeight: 1.1 }}>
      {parts.map((g, i) => {
        const t0 = i * 0.8 - 2;
        const slam = interpolate(frame, [t0, t0 + 4], [2.6, 1], { ...clamp, easing: Easing.in(Easing.quad) });
        const fade = interpolate(frame, [t0, t0 + 2], [0, 1], clamp);
        const squash = interpolate(frame, [t0 + 4, t0 + 6, t0 + 9], [0.75, 1.1, 1], clamp);
        const isNum = g === "3";
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              whiteSpace: "pre",
              opacity: fade,
              transform: `scale(${slam}) scaleY(${squash})`,
              transformOrigin: "center bottom",
              color: isNum ? GOLD : WHITE,
              fontSize: isNum ? 210 : undefined,
              WebkitTextStroke: `12px ${NAVY}`,
              paintOrder: "stroke fill",
              textShadow: `0 12px 0 ${isNum ? "#B8560F" : "#5B6590"}, 0 20px 0 ${NAVY}`,
            }}
          >
            {g}
          </span>
        );
      })}
    </div>
  );
}

function LockedSlot({ i }: { i: number }) {
  const frame = useCurrentFrame();
  const s = SLOTS[i];
  const pop = usePop(i * 2 - 3, 12);
  const hot = Math.floor(frame / 8) % 3 === i && frame > 6;
  return (
    <div
      style={{
        position: "absolute",
        left: s.x,
        top: SLOT_Y,
        width: SLOT_W,
        height: SLOT_H,
        borderRadius: 20,
        overflow: "hidden",
        border: `8px solid ${hot ? GOLD : s.color}`,
        transform: `translateY(${(1 - pop) * 500}px) rotate(${(i - 1) * 3}deg) scale(${hot ? 1.06 : 1})`,
        boxShadow: hot ? `0 0 60px ${GOLD}` : "0 20px 40px rgba(0,0,0,0.6)",
      }}
    >
      <div style={{ position: "absolute", inset: 0, filter: "grayscale(1) brightness(0.35) contrast(1.3)" }}>
        <FitClip src={`${s.clip}.mp4`} durationInFrames={30} srcSeconds={s.secs} zoomTo={1.1} />
      </div>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: G.hud, fontWeight: 700, fontSize: 200, color: s.color, textShadow: `0 0 30px ${s.color}` }}>
        ?
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 64, background: s.color, color: NAVY, fontFamily: G.hud, fontWeight: 700, fontSize: 38, textAlign: "center", lineHeight: "64px" }}>
        {`0${i + 1}`}
      </div>
    </div>
  );
}

export function SelectScreen() {
  const frame = useCurrentFrame();
  const scan = (frame * 14) % 1920;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${NAVY} 0%, ${NAVY_2} 60%, ${NAVY} 100%)` }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: 12 }, (_, i) => (
          <line key={i} x1={540} y1={1500} x2={-600 + i * 205} y2={1920} stroke={GOLD} strokeWidth={2} opacity={0.35} />
        ))}
        {Array.from({ length: 6 }, (_, i) => (
          <line key={`h${i}`} x1={0} y1={1520 + i * i * 14} x2={1080} y2={1520 + i * i * 14} stroke={GOLD} strokeWidth={2} opacity={0.3} />
        ))}
        <rect x={0} y={scan} width={1080} height={6} fill={WHITE} opacity={0.08} />
      </svg>
      <div style={{ position: "absolute", top: 330, left: 0, right: 0, textAlign: "center", fontFamily: G.hud, fontWeight: 700, fontSize: 46, letterSpacing: 18, color: GOLD, opacity: Math.floor(frame / 4) % 2 === 0 ? 1 : 0.6 }}>
        CHARACTER SELECT
      </div>
      <TitleSlam />
      {SLOTS.map((_, i) => (
        <LockedSlot key={i} i={i} />
      ))}
    </AbsoluteFill>
  );
}

/** RPG quest dialogue box over footage (bottom of frame, below faces). */
export function QuestDialog({ line2At }: { line2At: number }) {
  const frame = useCurrentFrame();
  const open = interpolate(frame, [0, 5], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.6)) });
  const l1 = graphemes("ของที่ควรมีติดบ้าน");
  const l2 = graphemes("แป้งเซ็ตผม");
  const shown1 = Math.floor(interpolate(frame, [4, 22], [0, l1.length], clamp));
  const shown2 = Math.floor(interpolate(frame, [line2At, line2At + 10], [0, l2.length], clamp));
  const caret = Math.floor(frame / 6) % 2 === 0;
  const slotPulse = 1 + 0.06 * Math.sin(frame * 0.6);
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 50,
          right: 50,
          top: 1400,
          height: 380,
          background: "rgba(11,14,31,0.92)",
          border: `8px solid ${WHITE}`,
          outline: `6px solid ${NAVY}`,
          borderRadius: 16,
          transform: `scaleY(${open})`,
          transformOrigin: "bottom",
        }}
      >
        <div style={{ position: "absolute", top: -46, left: 36, background: GOLD, color: NAVY, fontFamily: G.talk, fontWeight: 700, fontSize: 48, padding: "0 28px", border: `6px solid ${NAVY}`, borderRadius: 10 }}>
          ภารกิจ
        </div>
        <div style={{ position: "absolute", left: 50, top: 60, fontFamily: G.talk, fontWeight: 700, fontSize: 70, color: WHITE, lineHeight: 1.3 }}>
          {l1.slice(0, shown1).join("")}
        </div>
        <div style={{ position: "absolute", left: 50, top: 190, fontFamily: G.talk, fontWeight: 700, fontSize: 96, color: GOLD, lineHeight: 1.3 }}>
          {l2.slice(0, shown2).join("")}
        </div>
        <div style={{ position: "absolute", right: 40, top: 70, width: 170, height: 170, border: `6px dashed ${GOLD}`, borderRadius: 14, transform: `scale(${slotPulse})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: G.hud, fontWeight: 700, fontSize: 120, color: GOLD }}>
          ?
        </div>
        {caret ? (
          <svg width={50} height={40} style={{ position: "absolute", right: 50, bottom: 22 }}>
            <polygon points="0,0 50,0 25,34" fill={WHITE} />
          </svg>
        ) : null}
      </div>
    </AbsoluteFill>
  );
}
