import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { usePop } from "../hooks/kit";
import { clamp, LIME, P, STAMP_RED, SUN } from "./style";

/**
 * Beat 3 (4.31–6.12 s): a game HUD over his head — the "ทรงผม" bar drains
 * segment by segment, then the status debuff "แบน" slams in.
 */

const SEGS = 10;
const HUD_LEFT = 70;
const BAR_W = 700;

function segColor(level: number) {
  if (level > 0.6) return LIME;
  if (level > 0.3) return SUN;
  return STAMP_RED;
}

function TuftIcon() {
  return (
    <svg width={130} height={130} viewBox="0 0 130 130">
      <polygon points="65,4 121,34 121,96 65,126 9,96 9,34" fill="#101216" stroke="#fff" strokeWidth={6} />
      <path d="M 34 84 Q 36 44 64 40 Q 92 42 96 84" fill="none" stroke="#fff" strokeWidth={7} strokeLinecap="round" />
      <path d="M 46 50 Q 52 26 66 22 M 62 40 Q 70 20 84 22 M 78 44 Q 90 30 100 34" stroke={LIME} strokeWidth={6} strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function HookHairBar({ drainFrom, drainTo }: { drainFrom: number; drainTo: number }) {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 6], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const level = interpolate(frame, [drainFrom, drainTo], [1, 0], { ...clamp, easing: Easing.in(Easing.quad) });
  const alive = Math.ceil(level * SEGS - 0.001);
  const shake = frame > drainFrom && frame < drainTo + 4 ? Math.sin(frame * 3.1) * 6 : 0;
  const slam = usePop(drainTo + 1, 9);
  const flash = frame > drainTo && frame < drainTo + 12 && Math.floor(frame / 2) % 2 === 0;
  const hurt = frame > drainFrom ? interpolate(frame % 6, [0, 5], [1, 0]) : 0;

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: HUD_LEFT,
          top: 150,
          display: "flex",
          alignItems: "center",
          gap: 22,
          transform: `translate(${(1 - enter) * -500 + shake}px, 0)`,
        }}
      >
        <TuftIcon />
        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16, fontFamily: P.hud, fontWeight: 700, color: "#fff" }}>
            <span style={{ fontSize: 52, textShadow: "3px 3px 0 #000" }}>ทรงผม</span>
            <span style={{ fontSize: 34, opacity: 0.85, textShadow: "2px 2px 0 #000" }}>HP {Math.round(level * 100)}/100</span>
          </div>
          <div
            style={{
              marginTop: 8,
              width: BAR_W,
              height: 70,
              padding: 8,
              display: "flex",
              gap: 6,
              background: "#0C0D10",
              border: "5px solid #fff",
              transform: "skewX(-14deg)",
              boxShadow: "6px 6px 0 rgba(0,0,0,0.6)",
            }}
          >
            {Array.from({ length: SEGS }, (_, i) => {
              const on = i < alive;
              const dying = i === alive - 1 && frame > drainFrom;
              return (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    background: on ? segColor(level) : "#26282E",
                    opacity: on && dying ? 0.55 + 0.45 * hurt : 1,
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
      {frame > drainTo ? (
        <div
          style={{
            position: "absolute",
            left: HUD_LEFT + 152,
            top: 340,
            display: "flex",
            alignItems: "center",
            gap: 24,
            transform: `scale(${interpolate(slam, [0, 1], [2.4, 1])}) rotate(-4deg)`,
            transformOrigin: "left center",
            opacity: Math.min(1, slam * 3),
          }}
        >
          <span
            style={{
              fontFamily: P.hud,
              fontWeight: 700,
              fontSize: 38,
              color: "#fff",
              background: "#0C0D10",
              padding: "6px 16px",
              border: "4px solid #fff",
            }}
          >
            สถานะ
          </span>
          <span
            style={{
              fontFamily: P.hud,
              fontWeight: 700,
              fontSize: 190,
              lineHeight: 1,
              color: flash ? "#fff" : STAMP_RED,
              WebkitTextStroke: "10px #0C0D10",
              paintOrder: "stroke fill",
              textShadow: "10px 10px 0 #0C0D10",
            }}
          >
            แบน
          </span>
        </div>
      ) : null}
    </AbsoluteFill>
  );
}
