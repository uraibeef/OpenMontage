import { AbsoluteFill } from "remotion";
import { CEDAR, FRAME, GOLD, GOLD_DK, LEAF } from "./style";

/**
 * Corner colours round the edge of every footage shot: gold rope for the
 * gel side, green rope for the spray side — you always know whose corner
 * the shot belongs to. Chrome, like the tally strip, not a hook.
 */
export function CornerFrame({ corner }: { corner: "gold" | "green" }) {
  const main = corner === "gold" ? GOLD : LEAF;
  const dark = corner === "gold" ? GOLD_DK : CEDAR;
  const pad = 22;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg {...FRAME}>
        <rect x={pad} y={pad} width={1080 - pad * 2} height={1920 - pad * 2} fill="none" stroke={dark} strokeWidth={16} />
        <rect x={pad} y={pad} width={1080 - pad * 2} height={1920 - pad * 2} fill="none" stroke={main} strokeWidth={8} strokeDasharray="40 14" />
        {[
          [pad, pad],
          [1080 - pad, pad],
          [pad, 1920 - pad],
          [1080 - pad, 1920 - pad],
        ].map(([x, y]) => (
          <rect key={`${x}-${y}`} x={x - 26} y={y - 26} width={52} height={52} rx={10} fill={main} stroke={dark} strokeWidth={6} />
        ))}
      </svg>
    </AbsoluteFill>
  );
}
