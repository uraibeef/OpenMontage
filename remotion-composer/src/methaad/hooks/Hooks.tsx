import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { F } from "./fonts";
import { Canvas, clamp, graphemes, LayeredText, useIn, usePop } from "./kit";

const DARK_SHADOW = "0 6px 24px rgba(0,0,0,0.45), 0 2px 4px rgba(0,0,0,0.5)";

/** Scale about a point, for SVG groups. */
const about = (x: number, y: number, s: number) =>
  `translate(${x} ${y}) scale(${s}) translate(${-x} ${-y})`;

/* ---------------------------------------------------------------------------
 * Glow — white italic slab with a red rim and red bloom, small subtitle under.
 * ------------------------------------------------------------------------- */
export function GlowHook({
  title,
  sub,
  y = 330,
  size = 150,
}: {
  title: string;
  sub?: string;
  y?: number;
  size?: number;
}) {
  const frame = useCurrentFrame();
  const s = interpolate(frame, [0, 5], [1.35, 1], clamp);
  const flick = frame < 6 ? (frame % 2 === 0 ? 1 : 0.55) : 1;
  const subIn = useIn(7, 6);
  return (
    <Canvas>
      <defs>
        <filter id="glow-bloom" x="-20%" y="-60%" width="140%" height="220%">
          <feGaussianBlur stdDeviation={16} />
        </filter>
      </defs>
      <g transform={about(540, y - size / 3, s)} opacity={flick}>
        <LayeredText
          text={title}
          y={y}
          size={size}
          font={F.display}
          italic
          layers={[
            { stroke: "#FF1E1E", width: 34, filter: "url(#glow-bloom)" },
            { stroke: "#B80012", width: 22, dy: 6 },
            { stroke: "#FF2A2A", width: 18 },
            { fill: "#FFFFFF" },
          ]}
        />
      </g>
      {sub ? (
        <g opacity={subIn} transform={`translate(0 ${(1 - subIn) * 16})`}>
          <LayeredText
            text={sub}
            y={y + size * 0.66}
            size={size * 0.4}
            font={F.display}
            weight={800}
            layers={[{ stroke: "#000", width: 10 }, { fill: "#FFFFFF" }]}
          />
        </g>
      ) : null}
    </Canvas>
  );
}

/* ---------------------------------------------------------------------------
 * Arc — brush words bent over a curve, big straight slam line beneath.
 * ------------------------------------------------------------------------- */
export function ArcHook({
  arc,
  big,
  y = 360,
}: {
  arc: string;
  big: string;
  y?: number;
}) {
  const frame = useCurrentFrame();
  const chars = graphemes(arc);
  const slam = usePop(10, 10);
  return (
    <Canvas>
      <defs>
        <path
          id="arc-path"
          d={`M 110 ${y + 40} Q 540 ${y - 250} 970 ${y + 40}`}
        />
        <filter id="arc-shadow" x="-10%" y="-30%" width="120%" height="160%">
          <feDropShadow
            dx={0}
            dy={6}
            stdDeviation={6}
            floodColor="#000"
            floodOpacity={0.5}
          />
        </filter>
      </defs>
      <text
        fontFamily={F.brush}
        fontSize={96}
        fill="#FFFFFF"
        filter="url(#arc-shadow)"
      >
        <textPath href="#arc-path" startOffset="50%" textAnchor="middle">
          {chars.map((c, i) => (
            <tspan
              key={i}
              opacity={interpolate(
                frame,
                [i * 0.8, i * 0.8 + 3],
                [0, 1],
                clamp,
              )}
            >
              {c}
            </tspan>
          ))}
        </textPath>
      </text>
      <g
        transform={about(540, y + 120, 0.4 + slam * 0.6)}
        opacity={Math.min(1, slam * 3)}
      >
        <LayeredText
          text={big}
          y={y + 175}
          size={170}
          font={F.display}
          italic
          layers={[
            { fill: "rgba(0,0,0,0.45)", dy: 10, filter: "url(#arc-shadow)" },
            { fill: "#FFFFFF" },
          ]}
        />
      </g>
    </Canvas>
  );
}

/* ---------------------------------------------------------------------------
 * Pill — yellow bold word, then a black pill that unrolls from its centre.
 * ------------------------------------------------------------------------- */
export function PillHook({
  word,
  pill,
  top = 300,
}: {
  word: string;
  pill: string;
  top?: number;
}) {
  const w = usePop(0, 12);
  const open = useIn(6, 9);
  const textIn = useIn(11, 5);
  const inset = (1 - open) * 50;
  return (
    <AbsoluteFill style={{ alignItems: "center", top, height: "auto", gap: 6 }}>
      <div
        style={{
          fontFamily: F.display,
          fontWeight: 900,
          fontSize: 132,
          lineHeight: 1.1,
          color: "#FFD21F",
          textShadow: DARK_SHADOW,
          scale: String(0.6 + w * 0.4),
          opacity: Math.min(1, w * 2),
        }}
      >
        {word}
      </div>
      <div
        style={{
          background: "#0B0B0B",
          borderRadius: 44,
          padding: "14px 54px 22px",
          clipPath: `inset(0 ${inset}% 0 ${inset}% round 44px)`,
          boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
        }}
      >
        <span
          style={{
            fontFamily: F.display,
            fontWeight: 800,
            fontSize: 104,
            color: "#FFFFFF",
            opacity: textIn,
          }}
        >
          {pill}
        </span>
      </div>
    </AbsoluteFill>
  );
}

/* ---------------------------------------------------------------------------
 * Mirror — yellow display word, its serif echo flipped underneath, and
 * hand-drawn arrows pointing down at the speaker.
 * ------------------------------------------------------------------------- */
export function MirrorHook({
  word,
  echo,
  y = 300,
}: {
  word: string;
  echo: string;
  y?: number;
}) {
  const frame = useCurrentFrame();
  const pop = usePop(0, 12);
  const flip = useIn(6, 10);
  const draw = useIn(12, 10);
  const seed = Math.floor(frame / 3);
  const wob = (i: number) => Math.sin(seed * 1.7 + i) * 3;
  const arrows = [
    `M ${400 + wob(1)} ${y + 300} Q ${370 + wob(2)} ${y + 380} ${330} ${y + 450}`,
    `M ${540 + wob(3)} ${y + 300} L ${540 + wob(4)} ${y + 470}`,
    `M ${680 + wob(5)} ${y + 300} Q ${710 + wob(6)} ${y + 380} ${750} ${y + 450}`,
  ];
  const heads = [
    [330, y + 450, -30],
    [540, y + 470, 0],
    [750, y + 450, 30],
  ] as const;
  return (
    <Canvas>
      <defs>
        <filter id="mirror-shadow" x="-10%" y="-30%" width="120%" height="160%">
          <feDropShadow
            dx={0}
            dy={5}
            stdDeviation={6}
            floodColor="#000"
            floodOpacity={0.45}
          />
        </filter>
      </defs>
      <g
        transform={about(540, y - 40, 0.5 + pop * 0.5)}
        opacity={Math.min(1, pop * 2)}
        filter="url(#mirror-shadow)"
      >
        <LayeredText
          text={word}
          y={y}
          size={150}
          font={F.display}
          weight={900}
          layers={[{ fill: "#FFC928" }]}
        />
      </g>
      <g
        transform={`translate(0 ${y + 125}) scale(1 ${-flip}) translate(0 ${-(y + 125)})`}
        filter="url(#mirror-shadow)"
      >
        <LayeredText
          text={echo}
          y={y + 170}
          size={130}
          font={F.serif}
          weight={800}
          italic
          layers={[{ fill: "#FFC928" }]}
        />
      </g>
      <g
        stroke="#FFFFFF"
        strokeWidth={9}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#mirror-shadow)"
      >
        {arrows.map((d, i) => (
          <path
            key={d.slice(0, 12) + i}
            d={d}
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - draw}
          />
        ))}
        {draw > 0.95
          ? heads.map(([x, hy, r]) => (
              <path
                key={x}
                d="M -26 -30 L 0 0 L 26 -30"
                transform={`translate(${x} ${hy}) rotate(${r})`}
              />
            ))
          : null}
      </g>
    </Canvas>
  );
}

/* ---------------------------------------------------------------------------
 * Serif — quiet editorial lines, word by word, pale yellow + italic subtitle.
 * ------------------------------------------------------------------------- */
export function SerifHook({
  title,
  sub,
  top = 1050,
  stagger = 4,
}: {
  title: string;
  sub?: string;
  top?: number;
  stagger?: number;
}) {
  const frame = useCurrentFrame();
  const words = title.split(" ");
  const subIn = useIn(words.length * stagger + 4, 8);
  return (
    <AbsoluteFill
      style={{ top, height: "auto", alignItems: "center", padding: "0 70px" }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          columnGap: 26,
        }}
      >
        {words.map((w, i) => {
          const p = interpolate(
            frame,
            [i * stagger, i * stagger + 8],
            [0, 1],
            clamp,
          );
          return (
            <span
              key={w + i}
              style={{
                fontFamily: F.serif,
                fontWeight: 600,
                fontSize: 128,
                lineHeight: 1.15,
                color: "#FFF1A8",
                opacity: p,
                translate: `0 ${(1 - p) * 30}px`,
                filter: `blur(${(1 - p) * 8}px)`,
                textShadow: "0 4px 30px rgba(0,0,0,0.55)",
              }}
            >
              {w}
            </span>
          );
        })}
      </div>
      {sub ? (
        <div
          style={{
            fontFamily: F.serif,
            fontStyle: "italic",
            fontWeight: 500,
            fontSize: 58,
            color: "#FFFFFF",
            opacity: subIn,
            textShadow: DARK_SHADOW,
            marginTop: 10,
          }}
        >
          {sub}
        </div>
      ) : null}
    </AbsoluteFill>
  );
}

/* ---------------------------------------------------------------------------
 * Type — tech readout typed grapheme by grapheme with a block caret.
 * ------------------------------------------------------------------------- */
export function TypeHook({
  lines,
  top = 330,
  rate = 1.3,
}: {
  lines: readonly string[];
  top?: number;
  rate?: number;
}) {
  const frame = useCurrentFrame();
  let budget = Math.floor(frame / rate);
  return (
    <AbsoluteFill style={{ top, height: "auto", left: 90, right: 90 }}>
      {lines.map((line, li) => {
        const g = graphemes(line);
        const shown = Math.max(0, Math.min(g.length, budget));
        const typing = budget >= 0 && budget <= g.length;
        budget -= g.length + 4;
        return (
          <div
            key={line}
            style={{
              fontFamily: F.tech,
              fontWeight: 700,
              fontSize: li === 0 ? 76 : 136,
              lineHeight: 1.2,
              color: li === 0 ? "#B6FF3B" : "#FFFFFF",
              textShadow: DARK_SHADOW,
              minHeight: li === 0 ? 92 : 165,
            }}
          >
            {g.slice(0, shown).join("")}
            {typing && frame % 10 < 6 ? (
              <span
                style={{
                  display: "inline-block",
                  width: li === 0 ? 30 : 48,
                  height: li === 0 ? 64 : 116,
                  background: "#B6FF3B",
                  marginLeft: 6,
                  verticalAlign: "middle",
                }}
              />
            ) : null}
          </div>
        );
      })}
    </AbsoluteFill>
  );
}

/* ---------------------------------------------------------------------------
 * Sticker — die-cut label slapped on at an angle.
 * ------------------------------------------------------------------------- */
export function StickerHook({
  text,
  top = 330,
  rotate = -6,
  color = "#C6FF3D",
  ink = "#111",
}: {
  text: string;
  top?: number;
  rotate?: number;
  color?: string;
  ink?: string;
}) {
  const frame = useCurrentFrame();
  const slap = interpolate(frame, [0, 4, 7], [1.9, 0.94, 1], clamp);
  const r = interpolate(frame, [0, 5], [rotate + 14, rotate], clamp);
  const shine = interpolate(frame, [8, 20], [-40, 140], clamp);
  return (
    <AbsoluteFill style={{ top, height: "auto", alignItems: "center" }}>
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          background: color,
          border: "12px solid #FFFFFF",
          borderRadius: 34,
          padding: "10px 46px 22px",
          rotate: `${r}deg`,
          scale: String(slap),
          boxShadow: "0 18px 30px rgba(0,0,0,0.4)",
        }}
      >
        <span
          style={{
            fontFamily: F.display,
            fontWeight: 900,
            fontSize: 124,
            color: ink,
            lineHeight: 1.15,
          }}
        >
          {text}
        </span>
        <div
          style={{
            position: "absolute",
            top: -40,
            bottom: -40,
            width: 70,
            left: `${shine}%`,
            rotate: "20deg",
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)",
          }}
        />
      </div>
    </AbsoluteFill>
  );
}

/* ---------------------------------------------------------------------------
 * Slam stack — words hit one at a time, stacking downward.
 * ------------------------------------------------------------------------- */
export interface SlamWord {
  text: string;
  at: number;
  color?: string;
  size?: number;
}

export function SlamStack({
  words,
  y = 300,
}: {
  words: readonly SlamWord[];
  y?: number;
}) {
  const frame = useCurrentFrame();
  let cursor = y;
  return (
    <Canvas>
      {words.map((w) => {
        const size = w.size ?? 150;
        cursor += size * 1.05;
        const local = frame - w.at;
        if (local < 0) return null;
        const s = interpolate(local, [0, 3, 6], [2.1, 0.92, 1], clamp);
        const shake = local < 4 ? ((local % 2) * 2 - 1) * 8 : 0;
        const yy = cursor;
        return (
          <g
            key={w.text}
            transform={`translate(${shake} 0) ${about(540, yy - size / 3, s)}`}
          >
            <LayeredText
              text={w.text}
              y={yy}
              size={size}
              font={F.display}
              italic
              layers={[
                { stroke: "#000", width: 26, dy: 8 },
                { stroke: "#000", width: 20 },
                { fill: w.color ?? "#FFFFFF" },
              ]}
            />
          </g>
        );
      })}
    </Canvas>
  );
}

/* ---------------------------------------------------------------------------
 * Marker — highlighter swipe wipes on, then the words land on top of it.
 * ------------------------------------------------------------------------- */
export function MarkerHook({
  text,
  top = 330,
  color = "#D7FF3A",
  size = 96,
  rotate = -2,
}: {
  text: string;
  top?: number;
  color?: string;
  size?: number;
  rotate?: number;
}) {
  const swipe = useIn(0, 9);
  const t = useIn(5, 6);
  return (
    <AbsoluteFill style={{ top, height: "auto", alignItems: "center" }}>
      <div
        style={{
          position: "relative",
          padding: "6px 40px 16px",
          rotate: `${rotate}deg`,
        }}
      >
        <svg
          viewBox="0 0 100 20"
          preserveAspectRatio="none"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            transformOrigin: "left",
            scale: `${swipe} 1`,
          }}
        >
          <path
            d="M1 4 Q 3 1 8 2 L 92 1.5 Q 98 2 99 5 L 98.5 16 Q 97 19 90 18.5 L 6 19 Q 1 18.5 1.5 15 Z"
            fill={color}
          />
        </svg>
        <span
          style={{
            position: "relative",
            fontFamily: F.round,
            fontWeight: 600,
            fontSize: size,
            color: "#111",
            opacity: t,
            lineHeight: 1.25,
          }}
        >
          {text}
        </span>
      </div>
    </AbsoluteFill>
  );
}

/* ---------------------------------------------------------------------------
 * Puffy (in front) — bubble letters, bouncy scale.
 * ------------------------------------------------------------------------- */
export function PuffyHook({
  text,
  y = 400,
  size = 170,
  fill = "#FFE45C",
  rim = "#FF7A00",
  deep = "#A63A00",
}: {
  text: string;
  y?: number;
  size?: number;
  fill?: string;
  rim?: string;
  deep?: string;
}) {
  const frame = useCurrentFrame();
  const p = usePop(0, 8);
  const bob = Math.sin(frame / 5) * 4;
  return (
    <Canvas>
      <g
        transform={`translate(0 ${bob}) ${about(540, y - size / 3, p)} rotate(${-3 + (1 - p) * 10} 540 ${y})`}
      >
        <LayeredText
          text={text}
          y={y}
          size={size}
          font={F.display}
          weight={900}
          layers={[
            { stroke: deep, width: size * 0.2, dy: size * 0.07 },
            { stroke: rim, width: size * 0.17 },
            { stroke: "#FFFFFF", width: size * 0.06 },
            { fill },
          ]}
        />
      </g>
    </Canvas>
  );
}

/* ---------------------------------------------------------------------------
 * Echo — a solid word with hollow outline copies stepping up behind it.
 * ------------------------------------------------------------------------- */
export function EchoHook({
  text,
  y = 420,
  size = 170,
  color = "#FFFFFF",
}: {
  text: string;
  y?: number;
  size?: number;
  color?: string;
}) {
  const frame = useCurrentFrame();
  const pop = usePop(0, 12);
  const echoes = [3, 2, 1];
  return (
    <Canvas>
      <defs>
        <filter id="echo-shadow" x="-10%" y="-30%" width="120%" height="160%">
          <feDropShadow
            dx={0}
            dy={6}
            stdDeviation={8}
            floodColor="#000"
            floodOpacity={0.5}
          />
        </filter>
      </defs>
      {echoes.map((k) => {
        const p = interpolate(
          frame,
          [4 + (3 - k) * 3, 10 + (3 - k) * 3],
          [0, 1],
          clamp,
        );
        return (
          <g
            key={k}
            opacity={p * (1 - k * 0.22)}
            transform={`translate(0 ${-k * size * 0.42 * p})`}
          >
            <LayeredText
              text={text}
              y={y}
              size={size}
              font={F.display}
              italic
              layers={[{ stroke: color, width: 4 }]}
            />
          </g>
        );
      })}
      <g
        transform={about(540, y - size / 3, 0.6 + pop * 0.4)}
        opacity={Math.min(1, pop * 2)}
        filter="url(#echo-shadow)"
      >
        <LayeredText
          text={text}
          y={y}
          size={size}
          font={F.display}
          italic
          layers={[{ fill: color }]}
        />
      </g>
    </Canvas>
  );
}
