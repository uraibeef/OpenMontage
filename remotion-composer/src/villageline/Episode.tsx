import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Scene } from "./Scene";
import type { Caption, Episode as EpisodeConfig } from "./constants";
import { FPS, HEIGHT, PALETTE, sceneFrames, sceneStarts, WIDTH } from "./constants";
import { CAPTION_FONT } from "./fonts";
import { PhraseWrapped } from "../roachwar/Captions";

/**
 * One episode of "กลุ่มไลน์หมู่บ้าน".
 *
 * Sound is part of the story here, not decoration. Rain sits under every
 * frame at a low level because the estate is never dry; the notification ping
 * fires only on the scripted beats, so a viewer learns to dread it; the low
 * impact is reserved for the moments the rules of the world break.
 */

const RAIN_SRC = "villageline/sfx_rain.mp3";
const PING_SRC = "villageline/sfx_ping.mp3";
const HIT_SRC = "villageline/sfx_hit.mp3";

const RAIN_VOLUME = 0.22;
const PING_VOLUME = 0.7;
const HIT_VOLUME = 0.55;

export const Episode: React.FC<{ episode: EpisodeConfig }> = ({ episode }) => {
  const starts = sceneStarts(episode.scenes);

  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.black }}>
      <Audio src={staticFile(RAIN_SRC)} volume={RAIN_VOLUME} loop />
      <Audio src={staticFile(episode.voiceoverSrc)} />

      {episode.scenes.map((scene, index) => {
        const durationInFrames = sceneFrames(scene);
        return (
          <Sequence key={scene.id} from={starts[index]} durationInFrames={durationInFrames} name={scene.id}>
            <Scene scene={scene} durationInFrames={durationInFrames} />
            {(scene.pings ?? []).map((at) => (
              <Sequence key={`ping-${at}`} from={Math.round(at * FPS)} durationInFrames={FPS}>
                <Audio src={staticFile(PING_SRC)} volume={PING_VOLUME} />
              </Sequence>
            ))}
            {(scene.hits ?? []).map((at) => (
              <Sequence key={`hit-${at}`} from={Math.round(at * FPS)} durationInFrames={FPS * 3}>
                <Audio src={staticFile(HIT_SRC)} volume={HIT_VOLUME} />
              </Sequence>
            ))}
          </Sequence>
        );
      })}

      <Captions captions={episode.captions} />
    </AbsoluteFill>
  );
};

const FADE_FRAMES = 5;

/**
 * Burned-in captions for muted viewing. Lines that the interface already
 * shows on screen are left out of the caption track on purpose — the art
 * direction forbids duplicating evidence text, and the UI reading it is the
 * scarier version anyway.
 */
const Captions: React.FC<{ captions: Caption[] }> = ({ captions }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const seconds = frame / fps;
  const active = captions.find((caption) => seconds >= caption.from && seconds < caption.to);
  if (!active) return null;

  const fromFrame = active.from * fps;
  const toFrame = active.to * fps;
  const opacity = interpolate(frame, [fromFrame, fromFrame + FADE_FRAMES, toFrame - FADE_FRAMES, toFrame], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: WIDTH * 0.07,
        width: WIDTH * 0.86,
        bottom: HEIGHT * 0.14,
        display: "flex",
        justifyContent: "center",
        opacity,
      }}
    >
      <span
        style={{
          fontFamily: CAPTION_FONT,
          fontSize: 46,
          lineHeight: 1.32,
          fontWeight: 500,
          color: PALETTE.white,
          textAlign: "center",
          padding: "12px 26px",
          borderRadius: 18,
          background: "rgba(7, 9, 11, 0.62)",
          textShadow: "0 2px 10px rgba(0,0,0,0.85)",
          // Thai has no spaces, so Chrome breaks lines by dictionary and will
          // happily strand one syllable on its own line ("ตัว / เอง").
          // Balancing keeps both lines a similar length instead.
          ...({ textWrap: "balance" } as React.CSSProperties),
        }}
      >
        <PhraseWrapped text={active.text} />
      </span>
    </div>
  );
};
