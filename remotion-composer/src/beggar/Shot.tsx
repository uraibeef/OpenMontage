import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Atmosphere } from "./Atmosphere";
import { EmphasisMark } from "./EmphasisMark";
import { FilmLook, gateWeave } from "./FilmLook";
import type { Shot as ShotConfig } from "./config";
import { HEIGHT, WIDTH } from "./config";

/**
 * One shot: a still under a slow move, with weather, marks and grain on top.
 *
 * Everything animates on `transform` and `opacity` only, so the whole reel
 * stays on the compositor and renders fast.
 */

/** Extra scale so a drift never exposes the edge of the plate. */
const SAFE_OVERSCAN = 1.06;
/** How hard a punch-in shot slams on its first frames. */
const PUNCH_SCALE = 1.06;
const PUNCH_FRAMES = 7;

export const Shot: React.FC<{
  shot: ShotConfig;
  durationInFrames: number;
}> = ({ shot, durationInFrames }) => {
  const frame = useCurrentFrame();
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

  // The dead-still beats get no weave either — on the twist, absolute stillness
  // after a minute of rain is the loudest thing the reel can do.
  const weave = shot.atmosphere ? gateWeave(frame) : { x: 0, y: 0 };

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
        <Img
          src={staticFile(shot.src)}
          style={{ width: WIDTH, height: HEIGHT, objectFit: "cover" }}
        />
      </AbsoluteFill>

      {shot.atmosphere ? (
        <Atmosphere
          kind={shot.atmosphere}
          durationInFrames={durationInFrames}
        />
      ) : null}

      {shot.marks?.map((mark, index) => (
        <EmphasisMark key={index} {...mark} />
      ))}

      <FilmLook />
    </AbsoluteFill>
  );
};
