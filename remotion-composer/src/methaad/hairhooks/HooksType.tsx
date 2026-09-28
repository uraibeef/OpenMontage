import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp, graphemes, useIn, usePop } from "../hooks/kit";
import { CREAM, H, INK, RED } from "./style";

/** Per-letter HTML hooks (the browser lays out Thai grapheme widths for us). */

const outlined = (size: number, stroke: number): React.CSSProperties => ({
  fontSize: size,
  color: CREAM,
  WebkitTextStroke: `${stroke}px ${INK}`,
  paintOrder: "stroke fill",
  lineHeight: 1.45,
});

/** Letters sprinkled in like powder: each grapheme drops from above and settles askew. */
export function SprinkleHook({ badge, text, top }: { badge: string; text: string; top: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const badgePop = usePop(0, 10);
  const chars = graphemes(text);

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 104,
            height: 104,
            borderRadius: 52,
            background: CREAM,
            border: `6px solid ${INK}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: H.bold,
            fontWeight: 900,
            fontSize: 50,
            color: RED,
            marginRight: 18,
            transform: `scale(${badgePop})`,
          }}
        >
          {badge}
        </div>
        {chars.map((ch, i) => {
          const s = spring({ frame: frame - 2 - i * 1.3, fps, config: { damping: 9, stiffness: 220, mass: 0.6 } });
          const tumble = ((i * 53) % 50) - 25;
          const rest = ((i * 29) % 9) - 4;
          return (
            <span
              key={i}
              style={{
                ...outlined(104, 14),
                display: "inline-block",
                fontFamily: H.hand,
                opacity: s > 0.01 ? 1 : 0,
                transform: `translateY(${(1 - s) * -520}px) rotate(${interpolate(s, [0, 1], [tumble, rest])}deg)`,
                textShadow: "0 10px 0 rgba(0,0,0,0.35)",
              }}
            >
              {ch}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}

const POOL = graphemes("กขคงจฉชซดตถทนบปผพฟมยรลวสหอฮ");

interface FlapProps {
  lead: string;
  word: string;
  /** Last N graphemes of the word settle in red. */
  redTail: number;
  top: number;
  at: number;
}

/** Train-station split-flap board: tiles rattle through letters and land one by one. */
export function FlapHook({ lead, word, redTail, top, at }: FlapProps) {
  const frame = useCurrentFrame();
  const leadIn = useIn(0, 8);
  const board = useIn(at - 4, 5);
  const chars = graphemes(word);

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 26,
        }}
      >
        <div
          style={{
            fontFamily: H.bold,
            fontWeight: 800,
            fontSize: 64,
            color: INK,
            background: CREAM,
            padding: "4px 26px 10px",
            borderRadius: 6,
            opacity: leadIn,
            transform: `translateY(${(1 - leadIn) * -40}px)`,
          }}
        >
          {lead}
        </div>
        <div
          style={{
            display: "flex",
            gap: 10,
            padding: 16,
            background: "#0E0E0E",
            borderRadius: 18,
            boxShadow: "0 18px 40px rgba(0,0,0,0.5)",
            opacity: board,
            transform: `scaleY(${interpolate(board, [0, 1], [0.4, 1])})`,
          }}
        >
          {chars.map((ch, i) => {
            const settle = at + 4 + i * 3;
            const spinning = frame < settle;
            const shown = spinning ? POOL[(frame * 7 + i * 13) % POOL.length] : ch;
            const land = interpolate(frame, [settle, settle + 3], [0.75, 1], clamp);
            const color = spinning ? "#8A8A8A" : i >= chars.length - redTail ? RED : CREAM;
            return (
              <div
                key={i}
                style={{
                  position: "relative",
                  width: 104,
                  height: 156,
                  borderRadius: 10,
                  background: "linear-gradient(#262626 0 49%, #121212 51% 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                <span
                  style={{
                    fontFamily: H.bold,
                    fontWeight: 900,
                    fontSize: 100,
                    lineHeight: 1,
                    color,
                    transform: `scaleY(${spinning ? (frame % 2 ? 0.72 : 1) : land})`,
                  }}
                >
                  {shown}
                </span>
                <div style={{ position: "absolute", left: 0, right: 0, top: 77, height: 3, background: "#000" }} />
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
}
