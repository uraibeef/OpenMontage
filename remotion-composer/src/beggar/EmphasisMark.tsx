import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { MarkKind } from "./config";
import { HEIGHT, WIDTH } from "./config";

/**
 * Comic emphasis marks — the `?`, `!`, sweat drop and impact star that pop
 * above a character's head. They carry the beat when nobody is speaking, which
 * is most of a silent reel.
 */

const INK = "#16110d";
const PAPER = "#fffdf7";

const Glyph: React.FC<{ kind: MarkKind }> = ({ kind }) => {
  if (kind === "sweat") {
    return (
      <svg width={70} height={96} viewBox="0 0 70 96">
        <path
          d="M35 4 C 52 34, 66 48, 66 64 A 31 31 0 0 1 4 64 C 4 48, 18 34, 35 4 Z"
          fill="#8fd3f4"
          stroke={INK}
          strokeWidth={5}
        />
        <ellipse cx={26} cy={62} rx={7} ry={11} fill={PAPER} opacity={0.75} />
      </svg>
    );
  }

  if (kind === "spark") {
    return (
      <svg width={96} height={96} viewBox="0 0 96 96">
        <path
          d="M48 2 L59 35 L94 36 L65 56 L76 90 L48 69 L20 90 L31 56 L2 36 L37 35 Z"
          fill="#ffd23f"
          stroke={INK}
          strokeWidth={5}
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  const character = kind === "question" ? "?" : "!";
  return (
    <div
      style={{
        fontSize: 118,
        fontWeight: 900,
        color: PAPER,
        WebkitTextStroke: `7px ${INK}`,
        lineHeight: 1,
        fontFamily: "Georgia, serif",
      }}
    >
      {character}
    </div>
  );
};

export const EmphasisMark: React.FC<{
  kind: MarkKind;
  at: number;
  x: number;
  y: number;
}> = ({ kind, at, x, y }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const local = frame - Math.round(at * fps);
  if (local < 0) return null;

  const pop = spring({
    frame: local,
    fps,
    config: { damping: 9, stiffness: 220, mass: 0.5 },
  });

  // Pop in hard, hold, then drift up and fade — never just disappear.
  const scale = interpolate(pop, [0, 1], [0.2, 1]);
  const rise = interpolate(local, [0, 45], [0, -46], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(local, [0, 3, 34, 48], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const tilt = Math.sin(local / 7) * 5;

  return (
    <div
      style={{
        position: "absolute",
        left: WIDTH * x,
        top: HEIGHT * y + rise,
        transform: `scale(${scale}) rotate(${tilt}deg)`,
        transformOrigin: "center bottom",
        opacity,
      }}
    >
      <Glyph kind={kind} />
    </div>
  );
};
