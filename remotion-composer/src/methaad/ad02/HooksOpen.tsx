import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Canvas, clamp, graphemes, LayeredText } from "../hooks/kit";
import { about, C, F, hash } from "./theme";

/** Hooks for the opener (riso poster) and the gel beat (Dymo tape + F stamp). */

/** Grainy ink edge: speckles eaten out of whatever it filters, re-seeded like a boiling print. */
function InkGrain({ id, seed, freq = 0.9, bite = 0.55 }: { id: string; seed: number; freq?: number; bite?: number }) {
  return (
    <filter id={id} x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency={freq} numOctaves={2} seed={seed} result="n" />
      <feColorMatrix in="n" type="matrix" values={`0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -9 ${9 * bite}`} result="m" />
      <feComposite in="SourceGraphic" in2="m" operator="out" />
    </filter>
  );
}

/**
 * Riso poster title: the blue drum and the pink drum each roll the words in
 * from opposite sides and land out of register, overprinting where they meet.
 */
export function PosterTitle({ subAt }: { subAt: number }) {
  const frame = useCurrentFrame();
  const tick = Math.floor(frame / 2);
  const blue = interpolate(frame, [0, 9], [-1100, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const pink = interpolate(frame, [3, 12], [1100, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const thai = spring({ frame: frame - 12, fps: 30, config: { damping: 13, stiffness: 160 } });
  const jitter = (k: number) => (hash(tick * 3 + k) - 0.5) * 4;
  const drum = (color: string, dx: number, dy: number, slide: number) => (
    <g transform={`translate(${slide + dx} ${dy})`} style={{ mixBlendMode: "multiply" }} filter="url(#title-grain)">
      <LayeredText text="TIER LIST" y={290} size={190} font={F.poster} weight={900} letterSpacing={-6} layers={[{ fill: color }]} />
    </g>
  );

  return (
    <AbsoluteFill>
      <Canvas>
        <defs>
          <InkGrain id="title-grain" seed={tick} bite={0.5} />
        </defs>
        <g transform={`translate(0 ${interpolate(frame, [0, 8], [-360, 0], { ...clamp, easing: Easing.out(Easing.cubic) })}) rotate(-1.5 540 230)`}>
          <rect x={48} y={118} width={984} height={220} fill="#F4EFE3" />
        </g>
        {drum(C.blue, -9 + jitter(1), 6 + jitter(2), blue)}
        {drum(C.pink, 9 + jitter(3), -6 + jitter(4), pink)}
        <g transform={about(540, 410, `scale(${thai}) rotate(${-3 * thai})`)} opacity={Math.min(1, thai * 2)}>
          <rect x={250} y={352} width={580} height={128} fill={C.black} />
          <g filter="url(#title-grain)">
            <LayeredText text="ของแต่งผม" y={452} size={104} font={F.poster} weight={900} layers={[{ fill: C.yellow }]} />
          </g>
        </g>
      </Canvas>
      {frame >= subAt ? <SubLine at={subAt} /> : null}
    </AbsoluteFill>
  );
}

/**
 * "ฉบับหัวแบน + ขี้เกียจ" on a yellow ink strip: หัวแบน is printed squashed
 * flat, ขี้เกียจ slumps over letter by letter like someone sinking into a sofa.
 */
function SubLine({ at }: { at: number }) {
  const frame = useCurrentFrame() - at;
  const { fps } = useVideoConfig();
  const strip = interpolate(frame, [0, 7], [0, 100], { ...clamp, easing: Easing.out(Easing.cubic) });
  const flat = spring({ frame: frame - 4, fps, config: { damping: 8, stiffness: 240 } });
  const lazy = graphemes("ขี้เกียจ");
  const word: React.CSSProperties = { fontFamily: F.poster, fontWeight: 900, fontSize: 108, color: C.black, lineHeight: 1.5 };

  return (
    <div
      style={{
        position: "absolute",
        left: 50,
        right: 50,
        top: 1420,
        height: 200,
        transform: "rotate(-4deg)",
        clipPath: `inset(0 ${100 - strip}% 0 0)`,
        background: C.yellow,
        boxShadow: `14px 14px 0 ${C.pink}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 18,
      }}
    >
      <span style={{ ...word, fontSize: 64 }}>ฉบับ</span>
      <span style={{ ...word, display: "inline-block", transform: `scaleY(${interpolate(flat, [0, 1], [1.3, 0.62])}) scaleX(1.12)` }}>
        หัวแบน
      </span>
      <span style={{ ...word, color: C.pink }}>+</span>
      <span style={{ display: "inline-flex", alignItems: "flex-end" }}>
        {lazy.map((ch, i) => {
          const s = interpolate(frame, [10 + i * 4, 22 + i * 4], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
          return (
            <span
              key={i}
              style={{
                ...word,
                color: C.blue,
                display: "inline-block",
                transformOrigin: "80% 85%",
                transform: `rotate(${s * (14 + i * 5)}deg) translateY(${s * i * 3}px)`,
              }}
            >
              {ch}
            </span>
          );
        })}
      </span>
    </div>
  );
}

/** One strip of embossed label tape, punched out one grapheme at a time. */
function DymoStrip({ text, at, x, y, rot, size = 84 }: { text: string; at: number; x: number; y: number; rot: number; size?: number }) {
  const frame = useCurrentFrame() - at;
  if (frame < 0) return null;
  const chars = graphemes(text);
  const perChar = 3;
  const typed = Math.min(chars.length, Math.floor(frame / perChar) + 1);
  const feed = interpolate(frame, [0, chars.length * perChar + 2], [0, 100], clamp);
  const kick = frame < chars.length * perChar + 3 ? Math.sin(frame * 2.3) * 1.5 : 0;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `rotate(${rot}deg) translateX(${kick}px)`,
        transformOrigin: "left center",
        clipPath: `inset(-20px ${100 - feed}% -20px 0)`,
        filter: "drop-shadow(0 10px 8px rgba(0,0,0,0.45))",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "4px 44px",
          height: size * 1.45,
          borderRadius: 8,
          background:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.035) 0 2px, rgba(0,0,0,0) 2px 5px), linear-gradient(180deg, #2B2B2B 0%, #0E0E0E 55%, #1C1C1C 100%)",
          clipPath: "polygon(14px 0, 100% 0, calc(100% - 14px) 50%, 100% 100%, 14px 100%, 0 50%)",
        }}
      >
        {chars.map((ch, i) => {
          const age = frame - i * perChar;
          const press = i < typed ? interpolate(age, [0, 3], [1.25, 1], clamp) : 1;
          return (
            <span
              key={i}
              style={{
                fontFamily: F.tape,
                fontWeight: 700,
                fontSize: size,
                lineHeight: 1.3,
                letterSpacing: 6,
                color: "#F1F1EC",
                opacity: i < typed ? 1 : 0,
                display: "inline-block",
                transform: `scale(${press})`,
                textShadow: "0 -2px 0 rgba(255,255,255,0.55), 0 3px 1px rgba(0,0,0,0.95), 0 0 1px #fff",
              }}
            >
              {ch}
            </span>
          );
        })}
      </div>
    </div>
  );
}

/** A red rubber-stamp "F" slammed onto the frame: squash on impact, ink specks, grainy uneven ink. */
function StampF({ at, cx, cy }: { at: number; cx: number; cy: number }) {
  const frame = useCurrentFrame() - at;
  const { fps } = useVideoConfig();
  if (frame < -4) return null;
  const drop = interpolate(frame, [-4, 0], [2.6, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const squash = frame >= 0 ? 1 + 0.12 * Math.exp(-frame / 3) * Math.cos(frame * 1.6) : 1;
  const inked = frame >= 0 ? 1 : 0.35;
  const specks = spring({ frame, fps, config: { damping: 20, stiffness: 300 } });

  return (
    <AbsoluteFill>
      <Canvas>
        <defs>
          <InkGrain id="stamp-grain" seed={11} freq={0.5} bite={0.32} />
        </defs>
        {frame >= 0
          ? Array.from({ length: 14 }, (_, i) => {
              const a = hash(i + 3) * Math.PI * 2;
              const d = 190 + hash(i + 9) * 90;
              return (
                <circle
                  key={i}
                  cx={cx + Math.cos(a) * d * specks}
                  cy={cy + Math.sin(a) * d * specks}
                  r={3 + hash(i) * 8}
                  fill={C.stamp}
                  opacity={0.85}
                />
              );
            })
          : null}
        <g transform={about(cx, cy, `rotate(-13) scale(${drop * squash} ${drop / squash})`)} opacity={inked} filter="url(#stamp-grain)">
          <rect x={cx - 170} y={cy - 190} width={340} height={380} rx={26} fill="none" stroke={C.stamp} strokeWidth={20} />
          <rect x={cx - 142} y={cy - 162} width={284} height={324} rx={14} fill="none" stroke={C.stamp} strokeWidth={6} />
          <text x={cx} y={cy + 118} textAnchor="middle" fontFamily={F.poster} fontWeight={900} fontSize={330} fill={C.stamp}>
            F
          </text>
        </g>
      </Canvas>
    </AbsoluteFill>
  );
}

/** Gel beat: labelled like a failed exhibit — Dymo strips punch out as the VO names each flaw, then F. */
export function GelLabels({ stampAt, lines }: { stampAt: number; lines: readonly { text: string; at: number }[] }) {
  const layout = [
    { x: 70, y: 1250, rot: -3 },
    { x: 360, y: 1420, rot: 2.5 },
    { x: 90, y: 1570, rot: -1.5 },
    { x: 280, y: 1730, rot: 2 },
  ];
  return (
    <AbsoluteFill>
      {lines.map((l, i) => (
        <DymoStrip key={l.text} text={l.text} at={l.at} {...layout[i % layout.length]} size={i === 0 ? 120 : 96} />
      ))}
      <StampF at={stampAt} cx={820} cy={330} />
    </AbsoluteFill>
  );
}

