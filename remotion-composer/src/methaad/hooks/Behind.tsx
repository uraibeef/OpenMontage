import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { clipScale } from "./Clip";
import { F } from "./fonts";
import { Canvas, clamp, LayeredText, usePop } from "./kit";

type BehindLook = "puffy" | "serif";

interface BehindHookProps {
  /** Clip id whose person matte lives in public/matte/<scene>/NNN.png. */
  scene: string;
  sceneDuration: number;
  /** Frames of matte available — the hook ends there. */
  count: number;
  text: string;
  y: number;
  size: number;
  look: BehindLook;
  /** Small line in front of the head, above the big word. */
  kicker?: string;
}

const LOOKS: Record<
  BehindLook,
  (text: string, y: number, size: number) => React.ReactNode
> = {
  // Ref: bubbly pink letters with a red rim and white keyline.
  puffy: (text, y, size) => (
    <LayeredText
      text={text}
      y={y}
      size={size}
      font={F.display}
      weight={900}
      layers={[
        { stroke: "#9E0B2E", width: size * 0.2, dy: size * 0.06 },
        { stroke: "#FF2E63", width: size * 0.17 },
        { stroke: "#FFFFFF", width: size * 0.06 },
        { fill: "#FFB6CF" },
      ]}
    />
  ),
  // Editorial: giant cream serif with a soft cast shadow on the wall.
  serif: (text, y, size) => (
    <LayeredText
      text={text}
      y={y}
      size={size}
      font={F.serif}
      weight={800}
      letterSpacing={-6}
      layers={[
        {
          fill: "rgba(0,0,0,0.28)",
          dx: 10,
          dy: 14,
          filter: "url(#behind-soft)",
        },
        { fill: "#FFF6E0" },
      ]}
    />
  ),
};

/**
 * Text placed *behind* the speaker: the word sits on the wall and his head,
 * cut out with Apple Vision person segmentation, is re-laid on top of it.
 */
export function BehindHook({
  scene,
  sceneDuration,
  count,
  text,
  y,
  size,
  look,
  kicker,
}: BehindHookProps) {
  const frame = useCurrentFrame();
  if (frame >= count) return null;

  const rise = usePop(2, 12);
  const kick = usePop(8, 14);
  const out = interpolate(frame, [count - 5, count - 1], [1, 0], clamp);
  const lift = interpolate(rise, [0, 1], [size * 0.9, 0]);

  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Canvas>
        <defs>
          <filter id="behind-soft" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation={8} />
          </filter>
          <clipPath id="behind-rise">
            <rect x={0} y={0} width={1080} height={y + size * 0.3} />
          </clipPath>
        </defs>
        <g clipPath="url(#behind-rise)">
          <g transform={`translate(0 ${lift})`}>{LOOKS[look](text, y, size)}</g>
        </g>
      </Canvas>
      <AbsoluteFill style={{ scale: clipScale(frame, sceneDuration) }}>
        <Img
          src={staticFile(
            `matte/${scene}/${String(frame).padStart(3, "0")}.png`,
          )}
          style={{ width: 1080, height: 1920 }}
        />
      </AbsoluteFill>
      {kicker ? (
        <Canvas>
          <g
            transform={`translate(540 ${y - size * 0.95}) scale(${kick}) translate(-540 ${-(y - size * 0.95)})`}
          >
            <LayeredText
              text={kicker}
              y={y - size * 0.95}
              size={size * 0.34}
              font={F.brush}
              weight={400}
              layers={[{ stroke: "#111", width: 14 }, { fill: "#FFFFFF" }]}
            />
          </g>
        </Canvas>
      ) : null}
    </AbsoluteFill>
  );
}
