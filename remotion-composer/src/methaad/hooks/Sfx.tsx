import { Audio } from "@remotion/media";
import { Sequence, staticFile } from "remotion";

export type SfxId = "whoosh" | "pop" | "click" | "scratch" | "thud";

/** One-shot accent sound, synthesized locally (ffmpeg) — no sourcing/licensing. */
export function Sfx({
  id,
  from,
  volume = 1,
}: {
  id: SfxId;
  from: number;
  volume?: number;
}) {
  return (
    <Sequence from={from} durationInFrames={20} layout="none">
      <Audio src={staticFile(`sfx/${id}.wav`)} volume={volume} />
    </Sequence>
  );
}
