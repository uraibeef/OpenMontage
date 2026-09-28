import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp, graphemes } from "../hooks/kit";
import { C, F, hash } from "./theme";

/** Powder beat: full-bleed kinetic type — rank climbs to 1, a giant S, then one ink slab per action word. */

const slabText: React.CSSProperties = { fontFamily: F.slab, fontWeight: 700, lineHeight: 1.35, whiteSpace: "nowrap" };

/** "อันดับ" label rides up on a pink block while the numeral 1 climbs the podium from below the frame. */
function RankOne() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const climb = spring({ frame: frame - 3, fps, config: { damping: 12, stiffness: 120, mass: 0.9 } });
  const label = interpolate(frame, [0, 6], [0, 100], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1535, height: 385, background: C.black }} />
      <div
        style={{
          position: "absolute",
          left: 70,
          top: 1330,
          padding: "0 34px",
          background: C.pink,
          clipPath: `inset(0 ${100 - label}% 0 0)`,
          ...slabText,
          fontSize: 130,
          color: C.black,
          transform: "rotate(-3deg)",
        }}
      >
        อันดับ
      </div>
      <div
        style={{
          position: "absolute",
          right: 90,
          top: 1010,
          ...slabText,
          fontSize: 760,
          lineHeight: 1,
          color: C.yellow,
          WebkitTextStroke: `14px ${C.black}`,
          paintOrder: "stroke fill",
          textShadow: `18px 18px 0 ${C.blue}`,
          transform: `translateY(${(1 - climb) * 900}px)`,
        }}
      >
        1
      </div>
    </AbsoluteFill>
  );
}

/** A giant misregistered S punched in at the frame centre (speed lines rush in behind it). */
function GiantS() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const hit = spring({ frame, fps, config: { damping: 9, stiffness: 260 } });
  const scale = interpolate(hit, [0, 1], [3, 1]);
  const shake = frame < 8 ? (hash(frame) - 0.5) * 18 : 0;
  const glyph = (color: string, dx: number, dy: number, stroke = false) => (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        transform: `translate(${dx + shake}px, ${dy + 360}px) scale(${scale})`,
        fontFamily: F.poster,
        fontWeight: 900,
        fontSize: 980,
        lineHeight: 1,
        color,
        WebkitTextStroke: stroke ? `12px ${C.black}` : undefined,
        paintOrder: "stroke fill",
      }}
    >
      S
    </div>
  );
  return (
    <AbsoluteFill style={{ opacity: Math.min(1, hit * 4) }}>
      {glyph(C.blue, 34, 30)}
      {glyph(C.pink, -26, 16)}
      <AbsoluteFill style={{ filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.4))" }}>
        {glyph(C.yellow, 0, 0, true)}
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

type Act = "sprinkle" | "scrunch" | "slam";

/** One ink slab per action word; the word performs its own verb. */
function WordSlab({ word, bg, ink, act }: { word: string; bg: string; ink: string; act: Act }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const wipe = interpolate(frame, [0, 4], [0, 100], { ...clamp, easing: Easing.out(Easing.cubic) });
  const chars = graphemes(word);
  const squeeze = act === "scrunch" ? interpolate(frame, [4, 10, 13, 18], [1, 0.62, 0.7, 0.66], clamp) : 1;
  const wobble = act === "scrunch" && frame > 4 && frame < 14 ? Math.sin(frame * 2.1) * 4 : 0;
  const slam = act === "slam" ? spring({ frame, fps, config: { damping: 13, stiffness: 500 } }) : 1;
  const dot = act === "slam" ? spring({ frame: frame - 6, fps, config: { damping: 8, stiffness: 300 } }) : 0;

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: -40,
          right: -40,
          top: 1330,
          height: 470,
          background: bg,
          transform: `rotate(${act === "slam" ? 0 : act === "scrunch" ? 3 : -3}deg) translateY(${act === "slam" ? (1 - slam) * -500 : 0}px)`,
          clipPath: act === "slam" ? undefined : `inset(0 ${100 - wipe}% 0 0)`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0 18px 0 rgba(0,0,0,0.35)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", transform: `scale(${squeeze}, ${1 / Math.sqrt(squeeze)}) rotate(${wobble}deg)` }}>
          {chars.map((ch, i) => {
            const fall = act === "sprinkle" ? spring({ frame: frame - 1 - i * 2, fps, config: { damping: 11, stiffness: 320 } }) : 1;
            return (
              <span
                key={i}
                style={{
                  ...slabText,
                  fontSize: 330,
                  color: ink,
                  display: "inline-block",
                  opacity: fall > 0.02 ? 1 : 0,
                  transform: `translateY(${(1 - fall) * -700}px) rotate(${(1 - fall) * (i % 2 ? 30 : -25)}deg)`,
                }}
              >
                {ch}
              </span>
            );
          })}
          {act === "slam" ? (
            <span style={{ width: 90, height: 90, borderRadius: 45, background: ink, marginLeft: 26, marginTop: 120, transform: `scale(${dot})` }} />
          ) : null}
        </div>
        {act === "sprinkle"
          ? Array.from({ length: 40 }, (_, i) => {
              const t = frame - (i % 10) * 1.2;
              const y = -300 + t * (40 + hash(i) * 30);
              return (
                <span
                  key={i}
                  style={{
                    position: "absolute",
                    left: 120 + hash(i + 50) * 900,
                    top: y,
                    width: 10 + hash(i + 7) * 12,
                    height: 10 + hash(i + 7) * 12,
                    borderRadius: 99,
                    background: ink,
                    opacity: y > 460 ? 0 : 0.8,
                  }}
                />
              );
            })
          : null}
      </div>
    </AbsoluteFill>
  );
}

export const PowderHooks = { RankOne, GiantS, WordSlab };
