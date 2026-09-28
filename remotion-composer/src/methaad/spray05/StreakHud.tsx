import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Canvas, clamp } from "../hooks/kit";
import { about, arc, CHALK, FLAME, FLAME_CORE, FLAME_MID, flamePath, LIME, PANEL, RING_OFF, T } from "./style";

const X = 40;
const Y = 64;
const W = 520;
const H = 196;
const FLAME_X = 112;
const FLAME_BASE = 206;
const RING_Y = 222;
const RING_X0 = 214;
const RING_GAP = 42;
const RING_R = 14;

interface StreakHudProps {
  /** Local frames where the streak jumps to day 3, 5 and 7. */
  dayAt: readonly [number, number, number];
}

const DAYS = [1, 3, 5, 7] as const;

/**
 * The app's streak widget, pinned top-left for the whole story: a drawn flame
 * that grows each day, a flip counter 1 → 3 → 5 → 7, and seven day-rings that
 * close as the days pass.
 */
export function StreakHud({ dayAt }: StreakHudProps) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 13, stiffness: 210, mass: 0.6 } });
  const exit = interpolate(frame, [durationInFrames - 6, durationInFrames], [1, 0], clamp);
  const starts = [0, ...dayAt];
  const idx = starts.filter((f) => frame >= f).length - 1;
  const changedAt = starts[idx];
  const since = frame - changedAt;
  const flip = spring({ frame: since, fps, config: { damping: 10, stiffness: 240, mass: 0.5 } });
  const flare = idx > 0 ? interpolate(since, [0, 4, 14], [1, 1.45, 1], clamp) : 1;
  const flameK = (0.62 + idx * 0.14) * flare;
  const wob = Math.sin(frame / 2.3) * 9 + Math.sin(frame / 1.1) * 4;
  const closedAfter = DAYS[idx];

  return (
    <Canvas>
      <g transform={about(X, Y, `scale(${enter * exit})`)}>
        <rect x={X + 8} y={Y + 10} width={W} height={H} rx={34} fill="#000" opacity={0.35} />
        <rect x={X} y={Y} width={W} height={H} rx={34} fill={PANEL} stroke="rgba(243,246,238,0.14)" strokeWidth={2} />
        {/* flame */}
        <g transform={about(FLAME_X, FLAME_BASE, `scale(${1 + Math.sin(frame / 1.7) * 0.03})`)}>
          <path d={flamePath(FLAME_X, FLAME_BASE - 10, flameK, wob)} fill={FLAME} />
          <path d={flamePath(FLAME_X, FLAME_BASE - 14, flameK * 0.66, wob * 0.6)} fill={FLAME_MID} />
          <path d={flamePath(FLAME_X, FLAME_BASE - 18, flameK * 0.34, wob * 0.3)} fill={FLAME_CORE} />
        </g>
        {/* flip counter */}
        <clipPath id="sp5-hud-num">
          <rect x={X + 150} y={Y + 4} width={130} height={132} />
        </clipPath>
        <g clipPath="url(#sp5-hud-num)">
          {idx > 0 ? (
            <text x={X + 214} y={Y + 118 - flip * 130} textAnchor="middle" fontFamily={T.hud} fontWeight={900} fontSize={124} fill={CHALK} opacity={1 - flip}>
              {DAYS[idx - 1]}
            </text>
          ) : null}
          <text x={X + 214} y={Y + 118 + (1 - flip) * 130} textAnchor="middle" fontFamily={T.hud} fontWeight={900} fontSize={124} fill={idx === 3 ? LIME : CHALK}>
            {DAYS[idx]}
          </text>
        </g>
        <text x={X + 292} y={Y + 70} fontFamily={T.hudUp} fontWeight={600} fontSize={40} fill="rgba(243,246,238,0.7)">
          วันติด
        </text>
        <text x={X + 292} y={Y + 122} fontFamily={T.hud} fontWeight={800} fontSize={52} fill={CHALK}>
          /7
        </text>
        {/* day rings */}
        {Array.from({ length: 7 }, (_, i) => {
          const cx = RING_X0 + i * RING_GAP;
          const closeAt = i === 0 ? 4 : starts[Math.ceil(i / 2)] + (i % 2 === 0 ? 5 : 0);
          const p = i < closedAfter ? interpolate(frame, [closeAt, closeAt + 7], [0, 1], clamp) : 0;
          return (
            <g key={i}>
              <circle cx={cx} cy={RING_Y} r={RING_R} fill="none" stroke={RING_OFF} strokeWidth={7} />
              {p > 0.01 ? (
                <path d={arc(cx, RING_Y, RING_R, 0, Math.min(359.9, p * 360))} fill="none" stroke={LIME} strokeWidth={7} strokeLinecap="round" />
              ) : null}
              {p >= 1 ? <circle cx={cx} cy={RING_Y} r={5} fill={LIME} /> : null}
            </g>
          );
        })}
      </g>
    </Canvas>
  );
}
