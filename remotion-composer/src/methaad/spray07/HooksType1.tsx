import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BONE, clamp, CORAL, CORAL_DK, T } from "./style";

/**
 * Card 1 — "แบบแรก หัวมันง่าย ตกบ่ายผมแปะ" (card-local frames, 0 = 2.71 s).
 * Tags are glossy oil-slick chips that sweat a drop; the hook "ผมแปะ" is a
 * greasy chrome italic that slumps flat against the chips — like the hair.
 */
const CHIPS = [
  { text: "หัวมันง่าย", at: 15 },
  { text: "ผมลีบ", at: 23 },
  { text: "ตกบ่าย", at: 31 },
] as const;
const WORD_AT = 31;
const SLUMP_AT = 42;

function OilChip({ text, at }: { text: string; at: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: { damping: 10, stiffness: 210, mass: 0.6 } });
  const drip = interpolate(frame, [at + 6, at + 30], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  if (frame < at) return null;
  return (
    <div style={{ position: "relative", transform: `scale(${s})`, transformOrigin: "50% 100%" }}>
      <div
        style={{
          fontFamily: T.ui,
          fontWeight: 700,
          fontSize: 44,
          color: "#FFF6D8",
          padding: "12px 34px 16px",
          borderRadius: 40,
          background: "linear-gradient(180deg, #8C7A2E 0%, #5A4D17 55%, #3B320D 100%)",
          boxShadow: "inset 0 3px 0 rgba(255,245,190,0.75), inset 0 -6px 10px rgba(0,0,0,0.35), 0 6px 16px rgba(0,0,0,0.4)",
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </div>
      {/* the chip sweats one oily drop */}
      <svg width={40} height={90} viewBox="-20 0 40 90" style={{ position: "absolute", left: "72%", top: 58, overflow: "visible" }}>
        <path
          d={`M 0 0 C 6 ${12 + drip * 30} 9 ${20 + drip * 38} 0 ${26 + drip * 40} C -9 ${20 + drip * 38} -6 ${12 + drip * 30} 0 0 Z`}
          fill="#7A6A24"
          opacity={1 - drip * 0.4}
        />
        <circle cx={-2} cy={16 + drip * 36} r={3} fill="#FFF3B0" opacity={0.8} />
      </svg>
    </div>
  );
}

export function PanelType1() {
  const frame = useCurrentFrame();
  const name = interpolate(frame, [0, 7], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const word = interpolate(frame, [WORD_AT, WORD_AT + 5], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.8)) });
  const slump = interpolate(frame, [SLUMP_AT, SLUMP_AT + 7], [0, 1], { ...clamp, easing: Easing.out(Easing.bounce) });
  const shine = interpolate(frame, [WORD_AT, WORD_AT + 22], [-60, 160], clamp);
  return (
    <>
      <div style={{ position: "absolute", left: 56, top: 850, opacity: name, transform: `translateX(${(1 - name) * -40}px)` }}>
        <span style={{ fontFamily: T.name, fontWeight: 800, fontSize: 84, color: BONE }}>แบบแรก</span>
        <span style={{ fontFamily: T.name, fontWeight: 600, fontSize: 64, color: "rgba(246,241,231,0.8)" }}>, 26</span>
        <div style={{ fontFamily: T.bio, fontSize: 40, color: "rgba(246,241,231,0.85)", marginTop: -8 }}>นัดตอนบ่ายได้นะ แต่ผมไม่รับปาก</div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 44,
          top: 990,
          fontFamily: T.nameItalic,
          fontStyle: "italic",
          fontWeight: 900,
          fontSize: 190,
          lineHeight: 1.1,
          padding: "0 20px",
          backgroundImage: `linear-gradient(100deg, #6B5A1C 0%, #D9C36A ${shine - 30}%, #FFF8D0 ${shine}%, #B89A3A ${shine + 20}%, #5C4C14 100%)`,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          filter: "drop-shadow(0 8px 10px rgba(0,0,0,0.55))",
          transform: `scale(${word * (1 + slump * 0.16)}, ${word * (1 - slump * 0.46)}) skewX(${-slump * 8}deg)`,
          transformOrigin: "0% 88%",
        }}
      >
        ผมแปะ
      </div>
      <div style={{ position: "absolute", left: 56, top: 1226, display: "flex", gap: 18 }}>
        {CHIPS.map((c) => (
          <OilChip key={c.text} {...c} />
        ))}
      </div>
    </>
  );
}

/** Exit stamp for card 1: a coral rubber stamp "ใช่เลย" thumped on the photo. */
export function StampYes() {
  const frame = useCurrentFrame();
  const s = interpolate(frame, [0, 4], [1.7, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        top: 130,
        transform: `rotate(-16deg) scale(${s})`,
        border: `10px solid ${CORAL}`,
        outline: `3px solid ${CORAL_DK}`,
        outlineOffset: 6,
        borderRadius: 18,
        padding: "0 34px 10px",
        fontFamily: T.name,
        fontWeight: 900,
        fontSize: 120,
        color: CORAL,
        backgroundColor: "rgba(255,92,77,0.08)",
      }}
    >
      ใช่เลย
    </div>
  );
}
