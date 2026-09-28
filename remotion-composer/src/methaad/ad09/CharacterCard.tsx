import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { FitClip } from "../ad02/FitClip";
import { graphemes, usePop } from "../hooks/kit";
import { clamp, G, GOLD, NAVY, WHITE } from "./style";

/**
 * A character-select trading card: footage portrait, class name, player tab,
 * class emblem, and the selection cursor that snaps around it. Each of the
 * three cards enters differently (flip / slash / deal) and wears its own
 * colour, emblem and backdrop pattern, so no card repeats another.
 */

export type Entrance = "flip" | "slash" | "deal";
export type Emblem = "moon" | "wheel" | "strand";

interface CardProps {
  clip: string;
  clipSeconds: number;
  dur: number;
  tab: string; // "แบบแรก"
  cls: string; // class name
  color: { main: string; dark: string };
  entrance: Entrance;
  emblem: Emblem;
  rank: number; // filled pips out of 5
}

const CW = 780;
const CH = 1160;
const CX = 540 - CW / 2;
const CY = 330;

function EmblemArt({ kind, color }: { kind: Emblem; color: string }) {
  if (kind === "moon") {
    return (
      <g>
        <path d="M 62 22 A 40 40 0 1 0 98 78 A 32 32 0 1 1 62 22 Z" fill={color} />
        <polyline points="86,20 104,20 86,40 104,40" fill="none" stroke={WHITE} strokeWidth={5} strokeLinejoin="round" />
        <polyline points="108,48 118,48 108,60 118,60" fill="none" stroke={WHITE} strokeWidth={4} strokeLinejoin="round" />
      </g>
    );
  }
  if (kind === "wheel") {
    return (
      <g>
        <circle cx={70} cy={60} r={36} fill="none" stroke={color} strokeWidth={9} />
        <circle cx={70} cy={60} r={8} fill={WHITE} />
        {[0, 60, 120].map((a) => (
          <line
            key={a}
            x1={70 + Math.cos((a * Math.PI) / 180) * 30}
            y1={60 + Math.sin((a * Math.PI) / 180) * 30}
            x2={70 - Math.cos((a * Math.PI) / 180) * 30}
            y2={60 - Math.sin((a * Math.PI) / 180) * 30}
            stroke={WHITE}
            strokeWidth={4}
          />
        ))}
        {[34, 60, 86].map((y, i) => (
          <line key={y} x1={4 + i * 6} y1={y} x2={26 + i * 4} y2={y} stroke={color} strokeWidth={5} strokeLinecap="round" />
        ))}
      </g>
    );
  }
  return (
    <g fill="none" strokeLinecap="round">
      <path d="M 40 16 C 44 50 30 70 44 104" stroke={color} strokeWidth={3} />
      <path d="M 66 12 C 72 48 58 76 70 106" stroke={WHITE} strokeWidth={2} />
      <path d="M 92 18 C 96 52 84 72 96 102" stroke={color} strokeWidth={3} />
    </g>
  );
}

function enterStyle(kind: Entrance, frame: number, pop: number): React.CSSProperties {
  if (kind === "flip") {
    const r = interpolate(pop, [0, 1], [100, 0]);
    return { transform: `perspective(1800px) rotateY(${r}deg) scale(${0.8 + 0.2 * pop})` };
  }
  if (kind === "slash") {
    const x = interpolate(frame, [0, 7], [1100, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
    const skew = interpolate(frame, [0, 7, 11], [-18, 4, 0], clamp);
    return { transform: `translateX(${x}px) skewX(${skew}deg)` };
  }
  const y = interpolate(pop, [0, 1], [1300, 0]);
  const rot = interpolate(pop, [0, 1], [-38, -2]);
  return { transform: `translateY(${y}px) rotate(${rot}deg)` };
}

/** Backdrop pattern: a different select-screen floor per class. */
function Backdrop({ kind, color }: { kind: Entrance; color: string }) {
  const frame = useCurrentFrame();
  const drift = frame * 3;
  if (kind === "flip") {
    return (
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: 16 }, (_, i) => (
          <rect key={i} x={-600 + i * 140 + (drift % 140)} y={-200} width={46} height={2400} fill={color} opacity={0.12} transform="rotate(24 540 960)" />
        ))}
      </svg>
    );
  }
  if (kind === "slash") {
    return (
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: 14 }, (_, i) => (
          <line key={i} x1={0} y1={i * 150 + (drift % 150)} x2={1080} y2={i * 150 + (drift % 150) - 260} stroke={color} strokeWidth={3} opacity={0.3} />
        ))}
      </svg>
    );
  }
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      {Array.from({ length: 9 * 15 }, (_, i) => {
        const cx = (i % 9) * 130 + 25;
        const cy = Math.floor(i / 9) * 130 + 40 - (drift % 130);
        return <polygon key={i} points={`${cx},${cy - 18} ${cx + 18},${cy} ${cx},${cy + 18} ${cx - 18},${cy}`} fill={color} opacity={0.14} />;
      })}
    </svg>
  );
}

function Cursor({ color, at }: { color: string; at: number }) {
  const frame = useCurrentFrame();
  const p = usePop(at, 12);
  if (frame < at) return null;
  const gap = interpolate(p, [0, 1], [90, 0]) + Math.sin(frame * 0.5) * 6;
  const L = 90;
  const box = { x: CX - 26 - gap, y: CY - 26 - gap, w: CW + 52 + gap * 2, h: CH + 52 + gap * 2 };
  const corners = [
    [box.x, box.y, 1, 1],
    [box.x + box.w, box.y, -1, 1],
    [box.x, box.y + box.h, 1, -1],
    [box.x + box.w, box.y + box.h, -1, -1],
  ] as const;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      {corners.map(([x, y, sx, sy], i) => (
        <polyline key={i} points={`${x},${y + sy * L} ${x},${y} ${x + sx * L},${y}`} fill="none" stroke={GOLD} strokeWidth={14} strokeLinejoin="miter" />
      ))}
      <polygon points={`540,${box.y - 30} 506,${box.y - 84} 574,${box.y - 84}`} fill={color} stroke={NAVY} strokeWidth={6} />
    </svg>
  );
}

export function CharacterCard({ clip, clipSeconds, dur, tab, cls, color, entrance, emblem, rank }: CardProps) {
  const frame = useCurrentFrame();
  const pop = usePop(0, entrance === "deal" ? 14 : 11);
  const nameIn = 6;
  const letters = graphemes(cls);

  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 45%, ${color.dark} 0%, ${NAVY} 70%)` }}>
      <Backdrop kind={entrance} color={color.main} />
      <div style={{ position: "absolute", left: CX, top: CY, width: CW, height: CH, ...enterStyle(entrance, frame, pop) }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 34,
            background: `linear-gradient(160deg, ${color.main} 0%, ${color.dark} 100%)`,
            boxShadow: `0 40px 80px rgba(0,0,0,0.6), 0 0 0 8px ${NAVY}, 0 0 0 14px ${color.main}`,
          }}
        />
        <div style={{ position: "absolute", left: 30, top: 96, width: CW - 60, height: 700, overflow: "hidden", borderRadius: 18, border: `6px solid ${NAVY}` }}>
          <FitClip src={`${clip}.mp4`} durationInFrames={dur} srcSeconds={clipSeconds} zoomTo={1.08} />
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(115deg, transparent 40%, rgba(255,255,255,${0.25 * Math.max(0, Math.sin(frame * 0.12))}) 50%, transparent 60%)` }} />
        </div>
        <div style={{ position: "absolute", left: 34, top: 22, display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontFamily: G.hud, fontWeight: 700, fontSize: 44, color: NAVY, background: GOLD, padding: "0 20px", transform: "skewX(-12deg)" }}>{tab}</span>
          <span style={{ fontFamily: G.hud, fontWeight: 500, fontSize: 32, color: NAVY, letterSpacing: 4 }}>CLASS</span>
        </div>
        <svg width={130} height={120} style={{ position: "absolute", right: 26, top: 8 }}>
          <circle cx={66} cy={60} r={56} fill={NAVY} />
          <EmblemArt kind={emblem} color={color.main} />
        </svg>
        <div style={{ position: "absolute", left: 0, right: 0, top: 800, textAlign: "center", fontFamily: G.cls, fontSize: 150, lineHeight: 1.25, color: WHITE, textShadow: `6px 6px 0 ${NAVY}` }}>
          {letters.map((g, i) => {
            const t = interpolate(frame, [nameIn + i * 1.2, nameIn + i * 1.2 + 6], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
            return (
              <span key={i} style={{ display: "inline-block", opacity: t, transform: `translateY(${(1 - t) * 60}px) scale(${0.6 + 0.4 * t})` }}>
                {g}
              </span>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 1060, display: "flex", justifyContent: "center", gap: 18 }}>
          {Array.from({ length: 5 }, (_, i) => {
            const on = i < rank && frame > 12 + i * 2;
            return <div key={i} style={{ width: 44, height: 44, transform: "rotate(45deg)", background: on ? GOLD : "transparent", border: `5px solid ${on ? NAVY : WHITE}` }} />;
          })}
        </div>
      </div>
      <Cursor color={color.main} at={9} />
    </AbsoluteFill>
  );
}
