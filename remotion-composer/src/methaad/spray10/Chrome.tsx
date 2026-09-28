import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { PaperGrain } from "../../fxkit";
import { BAR, BLUSH, clamp, CREAM, f, INK, ROSE, S } from "./style";

/** Warm rom-com grade applied to every shot. */
export const GRADE = "sepia(0.14) saturate(1.1) contrast(1.05) brightness(1.03) hue-rotate(-6deg)";

/**
 * The film frame: letterbox bars slide in on frame 0 and film grain
 * rides on top, and at `closeAt` (THE END) the bars close in a
 * little further. Absolute composition time.
 */
export function Letterbox({ closeAt }: { closeAt: number }) {
  const frame = useCurrentFrame();
  const open = interpolate(frame, [0, 8], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const close = interpolate(frame, [f(closeAt), f(closeAt) + 10], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const bar = BAR * open + 110 * close;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <PaperGrain id="s10-grain" opacity={0.1} />
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: bar, background: INK }} />
      <div style={{ position: "absolute", left: 0, bottom: 0, width: 1080, height: bar, background: INK }} />
    </AbsoluteFill>
  );
}

/** "POV: เดตแรก" slate that lives inside the top bar for the first beat. */
export function PovSlate() {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [4, 12], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const rec = frame % 16 < 10;
  return (
    <div
      style={{
        position: "absolute",
        top: 40,
        left: 0,
        width: 1080,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 22,
        opacity: t,
        transform: `translateY(${(1 - t) * -30}px)`,
      }}
    >
      <div style={{ width: 22, height: 22, borderRadius: 11, background: rec ? ROSE : "transparent", border: `3px solid ${ROSE}` }} />
      <div style={{ fontFamily: S.chrome, fontWeight: 700, fontSize: 54, color: CREAM, letterSpacing: 6, lineHeight: "80px" }}>
        POV: <span style={{ color: BLUSH }}>เดตแรก</span>
      </div>
    </div>
  );
}
