import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { EmphasisMark } from "../beggar/EmphasisMark";
import { FilmLook, gateWeave } from "../beggar/FilmLook";
import { KitchenLight } from "./KitchenLight";
import { Timestamp } from "./Timestamp";
import { ChatScreen } from "./ChatScreen";
import type { Shot as ShotConfig, StampTone } from "./constants";
import { HEIGHT, WIDTH } from "./constants";

/**
 * One shot: a still under a slow move, with the ceiling-light flare, the
 * episode's clock stamp and film look on top.
 *
 * The grain, vignette and gate weave are shared with the two earlier reels —
 * they are what fuse the flat drawing and the photograph into a single
 * exposure, and that job does not change per production.
 */

const SAFE_OVERSCAN = 1.06;
const PUNCH_SCALE = 1.05;
const PUNCH_FRAMES = 6;

export const Shot: React.FC<{
  shot: ShotConfig;
  durationInFrames: number;
  /** The on-screen clock label, when this shot is one that carries it. */
  stamp?: string;
  stampTone?: StampTone;
  /** Skip grain and gate weave; the generated clips carry their own. */
  cleanLook?: boolean;
}> = ({ shot, durationInFrames, stamp, stampTone, cleanLook }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = durationInFrames <= 1 ? 0 : frame / (durationInFrames - 1);

  const [zoomFrom, zoomTo] = shot.zoom;
  const baseZoom = interpolate(progress, [0, 1], [zoomFrom, zoomTo]);

  const punch = shot.punchIn
    ? interpolate(frame, [0, PUNCH_FRAMES], [PUNCH_SCALE, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  const driftX = interpolate(progress, [0, 1], [0, shot.driftX ?? 0]);
  const driftY = interpolate(progress, [0, 1], [0, shot.driftY ?? 0]);

  // A shot with no zoom and no glow is a held breath: kill the weave too.
  // `steady` kills it on the two loop ends regardless of their movement.
  const isHeld = zoomFrom === zoomTo && !shot.glow;
  const weave =
    isHeld || shot.steady || cleanLook ? { x: 0, y: 0 } : gateWeave(frame);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          transform: [
            `translate(${driftX + weave.x}px, ${driftY + weave.y}px)`,
            `scale(${baseZoom * punch * SAFE_OVERSCAN})`,
          ].join(" "),
        }}
      >
        {shot.video ? (
          <OffthreadVideo
            src={staticFile(shot.video)}
            startFrom={Math.round((shot.videoStartFrom ?? 0) * fps)}
            muted
            style={{ width: WIDTH, height: HEIGHT, objectFit: "cover" }}
          />
        ) : (
          <Img
            src={staticFile(shot.src)}
            style={{ width: WIDTH, height: HEIGHT, objectFit: "cover" }}
          />
        )}
      </AbsoluteFill>

      {shot.chat ? <ChatScreen chat={shot.chat} backdrop={shot.src} /> : null}

      {shot.glow ? (
        <KitchenLight kind={shot.glow} durationInFrames={durationInFrames} />
      ) : null}

      {shot.marks?.map((mark, index) => (
        <EmphasisMark key={index} {...mark} />
      ))}

      {cleanLook ? null : <FilmLook />}

      {stamp ? (
        <Timestamp label={stamp} tone={stampTone} durationInFrames={durationInFrames} />
      ) : null}
    </AbsoluteFill>
  );
};
