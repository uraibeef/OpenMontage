import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Captions } from "./Captions";
import { Shot } from "./Shot";
import { FPS, SHOTS, SHOT_STARTS, VOICEOVER_SRC } from "./config";

/**
 * "เกมของคนฉลาด" — the finished reel.
 *
 * Hard cuts throughout, no dissolves. A dissolve reads as slideshow; a cut
 * reads as edited, and every cut here lands on a beat in the narration.
 *
 * The last shot is the first image again at its opening zoom, so playback loops
 * without a seam — and on the second pass the opening shot is no longer a
 * question, it is the answer.
 */
export const BeggarReel: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Audio src={staticFile(VOICEOVER_SRC)} />

      {SHOTS.map((shot, index) => {
        const durationInFrames = Math.round(shot.durationInSeconds * FPS);
        return (
          <Sequence
            key={`${shot.id}-${index}`}
            from={SHOT_STARTS[index]}
            durationInFrames={durationInFrames}
            name={shot.id}
          >
            <Shot shot={shot} durationInFrames={durationInFrames} />
          </Sequence>
        );
      })}

      <Captions />
    </AbsoluteFill>
  );
};
