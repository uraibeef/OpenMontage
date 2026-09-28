import { AbsoluteFill, interpolate, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import { PaperGrain } from "../../fxkit";
import { clipScale } from "../hooks/Clip";
import { clamp, INK, PAPER, PAPER_DK, RUST, SEPIA, T } from "./style";

const FPS = 30;

export type Grade = "product" | "plate" | "raw";

interface ShotProps {
  src: string;
  durationInFrames: number;
  /** Source seconds available from `start`; a short source is slowed to fill. */
  srcSeconds: number;
  start?: number;
  grade: Grade;
  zoomTo?: number;
}

/**
 * One footage shot. "plate" = creator/library clips re-graded as an old
 * field-guide photogravure: desaturated, warm sepia cast, paper multiply,
 * grain. "product" = the user's own bottle shots, only a warm lift.
 * "raw" = untouched (re-printed by an fxkit filter on top).
 */
export function Shot({ src, durationInFrames, srcSeconds, start = 0, grade, zoomTo = 1.05 }: ShotProps) {
  const frame = useCurrentFrame();
  const usable = srcSeconds - start - 0.05;
  const rate = Math.min(1, usable / (durationInFrames / FPS));
  const filter =
    grade === "plate"
      ? "saturate(0.55) sepia(0.28) contrast(1.08) brightness(0.98)"
      : grade === "product"
        ? "saturate(0.92) sepia(0.08) contrast(1.04) brightness(1.02)"
        : "none";
  return (
    <AbsoluteFill>
      <div style={{ width: "100%", height: "100%", overflow: "hidden", scale: clipScale(frame, durationInFrames, zoomTo) }}>
        <OffthreadVideo
          src={staticFile(src)}
          muted
          startFrom={Math.round(start * FPS)}
          playbackRate={rate}
          style={{ width: "100%", height: "100%", objectFit: "cover", filter }}
        />
      </div>
      {grade === "plate" ? (
        <>
          <AbsoluteFill style={{ backgroundColor: PAPER, mixBlendMode: "multiply", opacity: 0.35 }} />
          <PaperGrain id={`sp06-grain-${src.replace(/\W/g, "")}`} opacity={0.16} />
        </>
      ) : null}
    </AbsoluteFill>
  );
}

/**
 * Persistent field-guide chrome: a thin ruled header with the guide title,
 * crop-mark corners and a folio. Quiet, sepia on paper-tone hairlines.
 */
export function Chrome() {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 10], [0, 0.9], clamp);
  const m = 38;
  const mark = (x: number, y: number, sx: number, sy: number) => (
    <g stroke={PAPER} strokeWidth={2} opacity={0.9}>
      <line x1={x} y1={y} x2={x + sx * 46} y2={y} />
      <line x1={x} y1={y} x2={x} y2={y + sy * 46} />
      <circle cx={x + sx * 14} cy={y + sy * 14} r={4} fill="none" />
    </g>
  );
  return (
    <AbsoluteFill style={{ opacity: o, pointerEvents: "none" }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        {mark(m, m + 50, 1, 1)}
        {mark(1080 - m, m + 50, -1, 1)}
        {mark(m, 1920 - m, 1, -1)}
        {mark(1080 - m, 1920 - m, -1, -1)}
        <text x={540} y={m + 70} textAnchor="middle" fontFamily={T.fellSC} fontSize={30} letterSpacing={6} fill={PAPER}
          style={{ paintOrder: "stroke" }} stroke="rgba(30,20,10,0.55)" strokeWidth={5}>
          Field Guide · Make Sense
        </text>
        <text x={540} y={1920 - m - 8} textAnchor="middle" fontFamily={T.fellItalic} fontSize={28} fill={PAPER}
          style={{ paintOrder: "stroke" }} stroke="rgba(30,20,10,0.55)" strokeWidth={5}>
          — Nº 06 —
        </text>
      </svg>
    </AbsoluteFill>
  );
}

/** An ink stroke that draws itself (p 0..1). */
export function Draw({ d, p, w = 3, color = INK, fill = "none", dash }: { d: string; p: number; w?: number; color?: string; fill?: string; dash?: string }) {
  if (dash) return <path d={d} fill={fill} stroke={color} strokeWidth={w} strokeDasharray={dash} opacity={p} strokeLinecap="round" />;
  return (
    <path d={d} fill={fill} stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"
      pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
  );
}

interface PlateSheetProps {
  roman: string;
  latin: string;
  thai: string;
  children: React.ReactNode;
  id: string;
}

/**
 * A full-frame field-guide plate: aged paper, double rule border, plate
 * number head, a latin binomial + Thai name at the foot and a scale bar.
 * The illustration (children, a 1080x1920 SVG group) draws in the middle.
 */
export function PlateSheet({ roman, latin, thai, children, id }: PlateSheetProps) {
  const frame = useCurrentFrame();
  const head = interpolate(frame, [0, 7], [0, 1], clamp);
  const foot = interpolate(frame, [6, 14], [0, 1], clamp);
  const settle = interpolate(frame, [0, 10], [1.05, 1], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: PAPER }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 45%, ${PAPER} 55%, ${PAPER_DK} 100%)` }} />
      <AbsoluteFill style={{ transform: `scale(${settle})` }}>
        <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
          <rect x={70} y={170} width={940} height={1600} fill="none" stroke={SEPIA} strokeWidth={3} />
          <rect x={84} y={184} width={912} height={1572} fill="none" stroke={SEPIA} strokeWidth={1} />
          <text x={540} y={290} textAnchor="middle" fontFamily={T.fellSC} fontSize={46} letterSpacing={10} fill={SEPIA} opacity={head}>
            {`Plate ${roman}.`}
          </text>
          <line x1={380} x2={700} y1={318} y2={318} stroke={SEPIA} strokeWidth={1.5} opacity={head} />
          {children}
          <g opacity={foot}>
            <line x1={160} x2={400} y1={1560} y2={1560} stroke={INK} strokeWidth={3} />
            {[0, 1, 2, 3, 4].map((i) => (
              <line key={i} x1={160 + i * 60} x2={160 + i * 60} y1={1548} y2={i % 2 ? 1560 : 1572} stroke={INK} strokeWidth={2} />
            ))}
            <text x={160} y={1606} fontFamily={T.type} fontSize={24} fill={SEPIA}>0 · 1 · 2 cm</text>
            <text x={930} y={1600} textAnchor="end" fontFamily={T.type} fontSize={26} fill={RUST}>{`fig. ${roman}`}</text>
          </g>
        </svg>
        <div style={{ position: "absolute", left: 0, right: 0, top: 1360, textAlign: "center", opacity: foot, transform: `translateY(${(1 - foot) * 16}px)` }}>
          <div style={{ fontFamily: T.fellItalic, fontSize: 60, color: INK }}>{latin}</div>
          <div style={{ fontFamily: T.rise, fontWeight: 300, fontSize: 64, color: SEPIA, lineHeight: "96px" }}>{thai}</div>
        </div>
      </AbsoluteFill>
      <PaperGrain id={`sp06-plate-${id}`} opacity={0.22} />
    </AbsoluteFill>
  );
}
