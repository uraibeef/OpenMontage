import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Captions } from "./Captions";
import { Shot } from "./Shot";
import { FPS, SHOTS, SHOT_STARTS, VOICEOVER_SRC } from "./config";

/**
 * "สายที่ไม่ได้รับ" — the finished reel.
 *
 * Hard cuts throughout, every one landing on a beat in the narration.
 *
 * The reel opens on its ending — a man alone in a hospital corridor looking at
 * a missed call — and spends eighty seconds explaining it. The final beat is
 * that same image again at the same zoom, so playback loops without a seam and
 * the opening shot stops being a question on the second pass.
 */
export const MissedCallReel: React.FC = () => {
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
