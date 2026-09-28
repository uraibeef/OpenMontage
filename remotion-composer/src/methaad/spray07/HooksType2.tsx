import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BONE, CEDAR, clamp, INK, MINT, SKY, T } from "./style";

/**
 * Card 2 — "แบบที่สอง หน้ากลม อยากได้ทรงผมมีมิติ" (card-local, 0 = 4.45 s,
 * front at 10). Tags are raised blocks that pop out of the card with a hard
 * offset side; the hook "มีมิติ" is an extruded block word that swings
 * round in perspective so you see its depth.
 */
const CHIPS = [
  { text: "หน้ากลม", at: 25 },
  { text: "ผมตรง", at: 38 },
  { text: "อยากได้ทรง", at: 48 },
] as const;
const DEPTH_AT = 58;
const LAYERS = 14;

function BlockChip({ text, at }: { text: string; at: number }) {
  const frame = useCurrentFrame();
  const lift = interpolate(frame, [at, at + 6], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
  if (frame < at) return null;
  const d = 10 * lift;
  return (
    <div
      style={{
        fontFamily: T.depth,
        fontWeight: 600,
        fontSize: 44,
        color: INK,
        backgroundColor: BONE,
        padding: "10px 30px 14px",
        borderRadius: 14,
        border: `4px solid ${INK}`,
        boxShadow: `${d}px ${d}px 0 ${MINT}, ${d}px ${d}px 0 4px ${INK}`,
        transform: `translate(${-d}px, ${-d}px)`,
        opacity: Math.min(1, lift * 2),
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
}

function DepthWord() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - DEPTH_AT, fps, config: { damping: 12, stiffness: 120, mass: 0.8 } });
  if (frame < DEPTH_AT) return null;
  // the extrusion swings from pointing left-up to right-down: you watch the word gain depth
  const ang = interpolate(s, [0, 1], [-2.4, 0.75]);
  const depth = interpolate(frame, [DEPTH_AT, DEPTH_AT + 9], [0, 1], clamp);
  const step = 2.4 * depth;
  const rise = interpolate(s, [0, 1], [0.6, 1]);
  return (
    <div style={{ position: "absolute", left: 60, top: 990, transform: `scale(${rise}) skewX(-6deg)`, transformOrigin: "0% 100%" }}>
      {Array.from({ length: LAYERS }, (_, i) => {
        const k = LAYERS - 1 - i; // back to front
        const face = k === 0;
        return (
          <div
            key={i}
            style={{
              position: face ? "relative" : "absolute",
              left: 0,
              top: 0,
              fontFamily: T.depth,
              fontWeight: 700,
              fontSize: 176,
              lineHeight: 1.15,
              whiteSpace: "nowrap",
              color: face ? MINT : k < 4 ? "#3F7A5C" : CEDAR,
              WebkitTextStroke: face ? `3px ${INK}` : k === LAYERS - 1 ? `3px ${INK}` : undefined,
              transform: `translate(${Math.cos(ang) * step * k}px, ${Math.sin(ang) * step * k + step * k * 0.6}px)`,
            }}
          >
            มีมิติ
          </div>
        );
      })}
    </div>
  );
}

export function PanelType2() {
  const frame = useCurrentFrame();
  const name = interpolate(frame, [10, 17], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <>
      <div style={{ position: "absolute", left: 56, top: 866, opacity: name, transform: `translateY(${(1 - name) * 30}px)` }}>
        <span style={{ fontFamily: T.name, fontWeight: 800, fontSize: 84, color: BONE }}>แบบที่สอง</span>
        <span style={{ fontFamily: T.ui, fontWeight: 600, fontSize: 38, color: "rgba(246,241,231,0.75)", marginLeft: 22 }}>ห่าง 2 กม.</span>
      </div>
      <DepthWord />
      <div style={{ position: "absolute", left: 66, top: 1236, display: "flex", gap: 30 }}>
        {CHIPS.map((c) => (
          <BlockChip key={c.text} {...c} />
        ))}
      </div>
    </>
  );
}

/** Exit stamp for card 2: a sky-blue star badge as the card is super-liked up. */
export function StampSuper() {
  const frame = useCurrentFrame();
  const s = interpolate(frame, [0, 4], [0.3, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
  const spin = interpolate(frame, [0, 10], [-40, 0], clamp);
  return (
    <div style={{ position: "absolute", left: 290, top: 420, width: 400, height: 400, transform: `scale(${s}) rotate(${spin}deg)` }}>
      <svg width={400} height={400} viewBox="-200 -200 400 400">
        <path
          d="M 0 -180 L 48 -62 L 176 -58 L 76 22 L 110 150 L 0 76 L -110 150 L -76 22 L -176 -58 L -48 -62 Z"
          fill={SKY}
          stroke={BONE}
          strokeWidth={10}
          strokeLinejoin="round"
        />
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", fontFamily: T.name, fontWeight: 900, fontSize: 64, color: BONE, textShadow: "0 3px 0 rgba(0,0,0,0.25)" }}>
        ต้องมี
      </div>
    </div>
  );
}
