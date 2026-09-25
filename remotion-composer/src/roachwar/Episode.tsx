import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Captions } from "./Captions";
import { Shot } from "./Shot";
import { FPS, shotStarts } from "./constants";
import type { Episode as EpisodeConfig } from "./constants";

/**
 * One episode of "สงครามแมลงสาบ".
 *
 * Hard cuts throughout, every one landing on a beat in the narration.
 *
 * Each episode opens and closes on the same frame, so playback loops without a
 * seam and the opening line reads differently on the second pass — that reveal
 * is the reason the loop exists, not a side effect of it.
 */
export const Episode: React.FC<{ episode: EpisodeConfig }> = ({ episode }) => {
  const starts = shotStarts(episode.shots);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Audio src={staticFile(episode.voiceoverSrc)} />
      {episode.musicSrc ? (
        <Audio
          src={staticFile(episode.musicSrc)}
          volume={episode.musicVolume ?? 0.18}
        />
      ) : null}

      {episode.shots.map((shot, index) => {
        const durationInFrames = Math.round(shot.durationInSeconds * FPS);
        return (
          <Sequence
            key={`${shot.id}-${index}`}
            from={starts[index]}
            durationInFrames={durationInFrames}
            name={shot.id}
          >
            <Shot
              shot={shot}
              durationInFrames={durationInFrames}
              stamp={
                shot.stamp ??
                (episode.timestampShots.includes(shot.id)
                  ? episode.timestampLabel
                  : undefined)
              }
              stampTone={episode.stampTone}
              cleanLook={episode.cleanLook}
            />
          </Sequence>
        );
      })}

      <Captions captions={episode.captions} variant={episode.captionStyle} />
    </AbsoluteFill>
  );
};
