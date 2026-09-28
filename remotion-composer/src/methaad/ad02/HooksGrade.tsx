import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BoilFilter, Canvas, clamp } from "../hooks/kit";
import { about, C, F } from "./theme";

/** Hooks graded by the teacher: red-marker C (wax) and the award rosette A (spray). */

const MARKER = "#E4312B";

/** 0→1 draw progress of a stroke between two frames. */
const useDraw = (from: number, to: number) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [from, to], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
};

/** A path revealed along its length like a pen stroke (pathLength normalised to 1). */
function Stroke({ d, p, width, color = MARKER }: { d: string; p: number; width: number; color?: string }) {
  if (p <= 0) return null;
  return (
    <path
      d={d}
      pathLength={1}
      strokeDasharray="1 1"
      strokeDashoffset={1 - p}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

interface Note {
  text: string;
  at: number;
  x: number;
  y: number;
  rot: number;
  /** Arrow from the note to what it points at. */
  arrow: string;
  head: string;
}

/** Handwritten margin note: the words are written left→right, then the arrow is drawn to the culprit. */
function MarginNote({ note }: { note: Note }) {
  const frame = useCurrentFrame();
  const write = useDraw(note.at, note.at + 12);
  const arrow = useDraw(note.at + 9, note.at + 18);
  const head = useDraw(note.at + 17, note.at + 21);
  if (frame < note.at) return null;
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: note.x,
          top: note.y,
          transform: `rotate(${note.rot}deg)`,
          clipPath: `inset(-40px ${100 - write * 100}% -40px -20px)`,
          fontFamily: F.marker,
          fontSize: 120,
          lineHeight: 1.6,
          color: MARKER,
          whiteSpace: "nowrap",
          WebkitTextStroke: "16px #FFFFFF",
          paintOrder: "stroke fill",
          filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.35))",
        }}
      >
        {note.text}
      </div>
      <Canvas>
        <g filter="url(#note-boil)" style={{ filter: "drop-shadow(0 0 5px rgba(255,255,255,0.85))" }}>
          <Stroke d={note.arrow} p={arrow} width={13} />
          <Stroke d={note.head} p={head} width={13} />
        </g>
      </Canvas>
    </>
  );
}

/**
 * Wax gets a "C": the teacher's pen draws the letter, loops a circle round it,
 * then scribbles margin notes with arrows at the problem.
 */
export function MarkerGrade({ notes }: { notes: readonly Note[] }) {
  const letter = useDraw(1, 11);
  const ring = useDraw(10, 22);
  const cx = 250;
  const cy = 330;
  return (
    <AbsoluteFill>
      <Canvas>
        <defs>
          <BoilFilter id="note-boil" scale={4} />
        </defs>
        <g filter="url(#note-boil)" style={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,0.8))" }}>
          <Stroke d={`M ${cx + 85} ${cy - 95} C ${cx + 20} ${cy - 160}, ${cx - 120} ${cy - 110}, ${cx - 110} ${cy + 5} C ${cx - 100} ${cy + 125}, ${cx + 30} ${cy + 150}, ${cx + 95} ${cy + 80}`} p={letter} width={38} />
          <Stroke
            d={`M ${cx + 150} ${cy - 150} C ${cx + 60} ${cy - 235}, ${cx - 210} ${cy - 200}, ${cx - 205} ${cy + 10} C ${cx - 200} ${cy + 215}, ${cx + 170} ${cy + 230}, ${cx + 205} ${cy + 20} C ${cx + 220} ${cy - 90}, ${cx + 120} ${cy - 190}, ${cx - 30} ${cy - 185}`}
            p={ring}
            width={12}
          />
        </g>
      </Canvas>
      {notes.map((n) => (
        <MarginNote key={n.text} note={n} />
      ))}
    </AbsoluteFill>
  );
}

const PLEATS = 28;

/** Pleated rosette outline: alternating radii give the gathered-ribbon edge. */
const pleatPath = (cx: number, cy: number, r1: number, r2: number) =>
  Array.from({ length: PLEATS * 2 }, (_, i) => {
    const a = (i / (PLEATS * 2)) * Math.PI * 2;
    const r = i % 2 ? r2 : r1;
    return `${i ? "L" : "M"} ${cx + Math.cos(a) * r} ${cy + Math.sin(a) * r}`;
  }).join(" ") + " Z";

/** Award rosette "A" pinned on with a spin; a banner unfurls across its tails for the second line. */
export function RosetteAward({ cx, cy, banner, bannerAt }: { cx: number; cy: number; banner: string; bannerAt: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pin = spring({ frame, fps, config: { damping: 10, stiffness: 150, mass: 0.8 } });
  const tails = spring({ frame: frame - 5, fps, config: { damping: 12, stiffness: 120 } });
  const unfurl = interpolate(frame, [bannerAt, bannerAt + 10], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.4)) });
  const shine = interpolate(frame % 45, [0, 18], [-260, 260], clamp);
  const by = cy + 330;

  return (
    <AbsoluteFill>
      <Canvas>
        <defs>
          <clipPath id="rosette-core">
            <circle cx={cx} cy={cy} r={120} />
          </clipPath>
          <path id="rosette-ring" d={`M ${cx - 152} ${cy} A 152 152 0 1 1 ${cx + 152} ${cy}`} />
        </defs>
        <g transform={about(cx, cy - 40, `rotate(${tails * 0}) scale(1 ${tails})`)}>
          <path d={`M ${cx - 40} ${cy} L ${cx - 150} ${cy + 360} L ${cx - 95} ${cy + 320} L ${cx - 70} ${cy + 385} L ${cx + 30} ${cy + 30} Z`} fill={C.pink} stroke={C.black} strokeWidth={6} />
          <path d={`M ${cx + 40} ${cy} L ${cx + 150} ${cy + 360} L ${cx + 95} ${cy + 320} L ${cx + 70} ${cy + 385} L ${cx - 30} ${cy + 30} Z`} fill={C.blue} stroke={C.black} strokeWidth={6} />
        </g>
        <g transform={about(cx, cy, `rotate(${(1 - pin) * -200}) scale(${pin})`)}>
          <path d={pleatPath(cx + 8, cy + 10, 205, 180)} fill="rgba(0,0,0,0.35)" />
          <path d={pleatPath(cx, cy, 205, 180)} fill={C.blue} stroke={C.black} strokeWidth={6} strokeLinejoin="round" />
          <circle cx={cx} cy={cy} r={172} fill={C.paper} stroke={C.black} strokeWidth={5} />
          <text fontFamily={F.award} fontWeight={800} fontSize={34} letterSpacing={4} fill={C.black}>
            <textPath href="#rosette-ring" startOffset="50%" textAnchor="middle">
              อยู่ทรงสุด · อยู่ทรงสุด
            </textPath>
          </text>
          <circle cx={cx} cy={cy} r={122} fill={C.yellow} stroke={C.black} strokeWidth={6} />
          <g clipPath="url(#rosette-core)">
            <rect x={cx + shine - 30} y={cy - 150} width={40} height={300} fill="#FFFFFF" opacity={0.45} transform={about(cx, cy, "rotate(25)")} />
          </g>
          <text x={cx + 6} y={cy + 76} textAnchor="middle" fontFamily={F.award} fontWeight={900} fontSize={230} fill={C.pink} opacity={0.9}>
            A
          </text>
          <text x={cx - 3} y={cy + 70} textAnchor="middle" fontFamily={F.award} fontWeight={900} fontSize={230} fill={C.black}>
            A
          </text>
        </g>
        {unfurl > 0 ? (
          <g transform={about(cx + 140, by, `scale(${unfurl} 1)`)}>
            <path d={`M ${cx - 175} ${by - 40} L ${cx - 230} ${by - 90} L ${cx - 120} ${by - 90} Z`} fill="#9E1F1A" />
            <path d={`M ${cx + 455} ${by - 40} L ${cx + 510} ${by - 90} L ${cx + 400} ${by - 90} Z`} fill="#9E1F1A" />
            <path
              d={`M ${cx - 240} ${by - 90} L ${cx + 520} ${by - 90} L ${cx + 490} ${by + 5} L ${cx + 520} ${by + 100} L ${cx - 240} ${by + 100} L ${cx - 210} ${by + 5} Z`}
              fill={C.stamp}
              stroke={C.black}
              strokeWidth={6}
            />
            <text x={cx + 140} y={by + 38} textAnchor="middle" fontFamily={F.award} fontWeight={900} fontSize={110} fill={C.paper}>
              {banner}
            </text>
          </g>
        ) : null}
      </Canvas>
    </AbsoluteFill>
  );
}
