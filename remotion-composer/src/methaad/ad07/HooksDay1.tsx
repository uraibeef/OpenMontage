import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { PaperFilter, WobbleFilter, WriteOn } from "./paper";
import { about, clamp, D, hash, INK, PAD_RED, POSTIT } from "./style";

/**
 * Day 1. A strip of masking tape marks the whole thing as a fictional POV,
 * then a sticky note logs the first mistake: too much powder, white patches.
 */

/** "POV: 7 วันแรก" on masking tape, torn off the roll and slapped on top. */
export function TapeLabel() {
  const frame = useCurrentFrame();
  const pull = interpolate(frame, [1, 8], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const x = 150;
  const y = 120;
  const w = 780;
  const h = 104;
  const edge = (side: number) =>
    Array.from({ length: 9 }, (_, i) => `${side + (hash(i * 3 + side) - 0.5) * 16},${y + (i * h) / 8}`).join(" ");
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <PaperFilter id="d7-tape-grain" seed={9} strength={0.22} />
          <clipPath id="d7-tape-pull">
            <rect x={x - 20} y={y - 20} width={(w + 40) * pull} height={h + 40} />
          </clipPath>
        </defs>
        <g clipPath="url(#d7-tape-pull)" transform={about(540, y + h / 2, "rotate(-3)")}>
          <polygon points={`${edge(x)} ${edge(x + w).split(" ").reverse().join(" ")}`} fill="rgba(0,0,0,0.28)" transform="translate(6 8)" />
          <polygon points={`${edge(x)} ${edge(x + w).split(" ").reverse().join(" ")}`} fill="#E9DDB8" opacity={0.95} filter="url(#d7-tape-grain)" />
          <text x={540} y={y + 74} textAnchor="middle" fontFamily={D.tape} fontWeight={700} fontSize={62} fill={INK} letterSpacing={2}>
            POV: 7 วันแรก
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
}

interface StickyProps {
  /** Beat-local frame the second (red) line lands. */
  secondAt: number;
}

/** Powder patches doodled around the red line. */
function Patches({ at }: { at: number }) {
  const frame = useCurrentFrame();
  return (
    <>
      {Array.from({ length: 14 }, (_, i) => {
        const t = at + 6 + i * 0.6;
        const s = interpolate(frame, [t, t + 3], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2.4)) });
        const cx = 60 + hash(i * 7) * 460;
        const cy = 230 + hash(i * 11) * 190;
        const r = 7 + hash(i * 5) * 13;
        return <circle key={i} cx={cx} cy={cy} r={r * s} fill="#FFFFFF" stroke="rgba(27,27,34,0.5)" strokeWidth={2.5} />;
      })}
    </>
  );
}

export function StickyNote({ secondAt }: StickyProps) {
  const frame = useCurrentFrame();
  const slap = interpolate(frame, [0, 5], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.8)) });
  const scale = interpolate(slap, [0, 1], [1.25, 1]);
  const rot = interpolate(slap, [0, 1], [-12, -4]);
  const x = 70;
  const y = 1250;
  const w = 580;
  const h = 470;
  const nudge = interpolate(frame, [secondAt, secondAt + 2, secondAt + 6], [0, 1, 0], clamp);

  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <PaperFilter id="d7-note-grain" seed={4} strength={0.1} />
          <WobbleFilter id="d7-note-wobble" scale={3} />
          <linearGradient id="d7-note-curl" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0.75" stopColor={POSTIT} />
            <stop offset="1" stopColor="#E7C93A" />
          </linearGradient>
        </defs>
        <g
          transform={`translate(${x} ${y}) ${about(w / 2, 0, `rotate(${rot + nudge * 2}) scale(${scale})`)}`}
          opacity={slap > 0 ? 1 : 0}
        >
          <path d={`M 10 18 L ${w + 8} 22 L ${w + 2} ${h + 26} Q ${w / 2} ${h + 6} 14 ${h + 22} Z`} fill="rgba(0,0,0,0.32)" />
          <path d={`M 0 0 L ${w} 0 L ${w} ${h - 30} Q ${w - 20} ${h - 4} ${w - 60} ${h} L 0 ${h} Z`} fill="url(#d7-note-curl)" filter="url(#d7-note-grain)" />
          <rect x={0} y={0} width={w} height={58} fill="rgba(0,0,0,0.05)" />
          <WriteOn id="d7-note-l1" x={20} y={70} w={w - 30} h={140} from={2} dur={10}>
            <text x={34} y={170} fontFamily={D.marker} fontSize={86} fill={INK}>
              ยังโรยเยอะไป
            </text>
          </WriteOn>
          {frame >= secondAt ? <Patches at={secondAt} /> : null}
          <WriteOn id="d7-note-l2" x={20} y={230} w={w - 30} h={170} from={secondAt} dur={10}>
            <text x={34} y={352} fontFamily={D.marker} fontSize={70} fill={PAD_RED}>
              ผมขาวเป็นหย่อม
            </text>
            <path
              d={`M 34 382 Q 160 370 280 386 T ${w - 40} 378`}
              stroke={PAD_RED}
              strokeWidth={8}
              fill="none"
              strokeLinecap="round"
              filter="url(#d7-note-wobble)"
            />
          </WriteOn>
        </g>
      </svg>
    </AbsoluteFill>
  );
}
