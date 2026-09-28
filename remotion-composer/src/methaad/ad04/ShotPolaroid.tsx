import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { usePop } from "../hooks/kit";
import { Clip } from "../hooks/Clip";
import { clamp, INK, P, STAMP_RED } from "./style";

/**
 * 12.74–14.50 s: the result shot comes back as an instant photo — it drops
 * in tilted, develops from washed-out white, and he captions it by hand.
 */

const FW = 880;
const BORDER = 40;
const WIN_H = 1060;
const BOTTOM = 250;
const FH = BORDER + WIN_H + BOTTOM;
const TOP = 150;

export function ShotPolaroid({ src, dur }: { src: string; dur: number }) {
  const frame = useCurrentFrame();
  const drop = usePop(0, 13);
  const develop = interpolate(frame, [4, 22], [0, 1], { ...clamp, easing: Easing.out(Easing.quad) });
  const write = interpolate(frame, [12, 32], [0, 100], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const check = interpolate(frame, [32, 40], [1, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const rot = interpolate(drop, [0, 1], [-16, -3]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#1B1A1F" }}>
      <AbsoluteFill style={{ filter: "blur(28px) brightness(0.55) saturate(0.8)", transform: "scale(1.15)" }}>
        <Clip src={src} durationInFrames={dur} zoomTo={1.05} />
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: (1080 - FW) / 2,
          top: TOP,
          width: FW,
          height: FH,
          background: "#FAF8F3",
          borderRadius: 6,
          transform: `translateY(${(1 - drop) * -1500}px) rotate(${rot}deg)`,
          boxShadow: "0 40px 60px rgba(0,0,0,0.5), 0 4px 8px rgba(0,0,0,0.3)",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: BORDER,
            top: BORDER,
            width: FW - BORDER * 2,
            height: WIN_H,
            overflow: "hidden",
            background: "#000",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              top: -((1920 * (FW - BORDER * 2)) / 1080 - WIN_H) / 2,
              width: FW - BORDER * 2,
              height: (1920 * (FW - BORDER * 2)) / 1080,
              filter: `brightness(${interpolate(develop, [0, 1], [2.4, 1])}) contrast(${interpolate(develop, [0, 1], [0.35, 1])}) sepia(${0.5 * (1 - develop)})`,
            }}
          >
            <Clip src={src} durationInFrames={dur} zoomTo={1.05} />
          </div>
          <div style={{ position: "absolute", inset: 0, boxShadow: "inset 0 0 0 2px rgba(0,0,0,0.15)" }} />
        </div>
        <div
          style={{
            position: "absolute",
            left: FW / 2 - 110,
            top: -34,
            width: 220,
            height: 70,
            background: "rgba(236,228,200,0.78)",
            transform: "rotate(4deg)",
            clipPath: "polygon(3% 0, 97% 6%, 100% 100%, 0 94%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: BORDER + 20,
            top: BORDER + WIN_H + 58,
            display: "flex",
            alignItems: "center",
            gap: 26,
          }}
        >
          <span
            style={{
              fontFamily: P.hand,
              fontWeight: 600,
              fontSize: 80,
              color: INK,
              transform: "rotate(-2deg)",
              clipPath: `inset(-20% ${100 - write}% -20% 0)`,
              whiteSpace: "nowrap",
            }}
          >
            ทรงเดียวกับที่ร้าน
          </span>
          <svg width={110} height={100} viewBox="0 0 110 100">
            <path
              d="M 8 56 Q 22 64 38 88 Q 58 40 104 8"
              fill="none"
              stroke={STAMP_RED}
              strokeWidth={13}
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={check}
            />
          </svg>
        </div>
      </div>
    </AbsoluteFill>
  );
}
