import { loadFont as loadCaveat } from "@remotion/google-fonts/Caveat";
import { interpolate, useCurrentFrame } from "remotion";
import { F } from "./fonts";
import { BoilFilter, Canvas, clamp, useIn, usePop } from "./kit";

const hand = loadCaveat("normal", {
  weights: ["700"],
  subsets: ["latin"],
}).fontFamily;

const MARK = {
  fill: "none",
  stroke: "#FFFFFF",
  strokeWidth: 9,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;
const SHADOW = "drop-shadow(0 3px 6px rgba(0,0,0,0.55))";

/** Four-point marker sparkles popping around a spot on the footage. */
export function Sparkles({
  points,
  from = 0,
}: {
  points: readonly (readonly [number, number, number])[];
  from?: number;
}) {
  const frame = useCurrentFrame();
  return (
    <Canvas>
      <defs>
        <BoilFilter id="spark-boil" scale={4} />
      </defs>
      <g style={{ filter: SHADOW }}>
        <g filter="url(#spark-boil)">
          {points.map(([x, y, s], i) => {
            const at = from + i * 4;
            const p = interpolate(
              frame,
              [at, at + 5, at + 8],
              [0, 1.25, 1],
              clamp,
            );
            const tw = 1 + Math.sin((frame + i * 7) / 3) * 0.08;
            return (
              <path
                key={`${x}-${y}`}
                d="M 0 -50 Q 6 -6 50 0 Q 6 6 0 50 Q -6 6 -50 0 Q -6 -6 0 -50 Z"
                transform={`translate(${x} ${y}) scale(${(s * p * tw) / 50})`}
                fill="#FFFFFF"
                stroke="#FFFFFF"
                strokeWidth={4}
              />
            );
          })}
        </g>
      </g>
    </Canvas>
  );
}

/** A marker-drawn battery stuck near 30%, the red cell blinking. */
export function LowBattery({
  x = 760,
  y = 560,
  from = 0,
}: {
  x?: number;
  y?: number;
  from?: number;
}) {
  const frame = useCurrentFrame();
  const draw = useIn(from, 8);
  const fill = interpolate(frame, [from + 8, from + 16], [0, 0.3], clamp);
  const blink = frame % 12 < 8 ? 1 : 0.35;
  return (
    <Canvas>
      <defs>
        <BoilFilter id="bat-boil" scale={4} />
      </defs>
      <g style={{ filter: SHADOW }}>
        <g filter="url(#bat-boil)">
          <g transform={`translate(${x} ${y}) rotate(-8) scale(1.3)`}>
            <rect
              x={-110}
              y={-55}
              width={210}
              height={110}
              rx={18}
              {...MARK}
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - draw}
            />
            <path
              d="M 108 -22 L 124 -22 L 124 22 L 108 22"
              {...MARK}
              opacity={draw}
            />
            <rect
              x={-96}
              y={-41}
              width={182 * fill}
              height={82}
              rx={8}
              fill="#FF3B30"
              opacity={blink}
            />
            <text
              x={0}
              y={110}
              textAnchor="middle"
              fontFamily={hand}
              fontWeight={700}
              fontSize={70}
              fill="#FFFFFF"
              opacity={fill > 0.29 ? 1 : 0}
            >
              30%
            </text>
          </g>
        </g>
      </g>
    </Canvas>
  );
}

const MATH = [
  { t: "E = mc²", x: 50, y: 800, r: -8, at: 0 },
  { t: "∂ψ/∂t = Ĥψ", x: 700, y: 760, r: 6, at: 8 },
  { t: "∫ f(x) dx", x: 40, y: 1200, r: 4, at: 16 },
  { t: "λ = h/p", x: 780, y: 1180, r: -5, at: 22 },
  { t: "Σ", x: 930, y: 980, r: 10, at: 28 },
] as const;

/** Chalk-hand equations writing themselves around the speaker's head. */
export function MathHalo() {
  const frame = useCurrentFrame();
  return (
    <Canvas>
      <defs>
        <BoilFilter id="math-boil" scale={3} />
      </defs>
      <g style={{ filter: SHADOW }}>
        <g filter="url(#math-boil)">
          {MATH.map((m) => {
            const w = interpolate(frame, [m.at, m.at + 10], [0, 1], clamp);
            return (
              <g key={m.t} transform={`rotate(${m.r} ${m.x} ${m.y})`}>
                <clipPath id={`mc-${m.at}`}>
                  <rect
                    x={m.x - 10}
                    y={m.y - 90}
                    width={560 * w}
                    height={130}
                  />
                </clipPath>
                <text
                  x={m.x}
                  y={m.y}
                  fontFamily={hand}
                  fontWeight={700}
                  fontSize={m.t.length < 3 ? 130 : 78}
                  fill="#FFFFFF"
                  clipPath={`url(#mc-${m.at})`}
                >
                  {m.t}
                </text>
              </g>
            );
          })}
        </g>
      </g>
    </Canvas>
  );
}

interface Thumb {
  label: string;
  bg: string;
  draw: React.ReactNode;
}

const THUMBS: readonly Thumb[] = [
  {
    label: "PODCAST",
    bg: "#FF6B4A",
    draw: (
      <g fill="none" stroke="#FFF4E6" strokeWidth={7} strokeLinecap="round">
        <rect x={-26} y={-70} width={52} height={86} rx={26} fill="#FFF4E6" />
        <path d="M -44 -6 Q -44 44 0 44 Q 44 44 44 -6 M 0 44 L 0 72 M -26 72 L 26 72" />
      </g>
    ),
  },
  {
    label: "LECTURE",
    bg: "#2E5B4A",
    draw: (
      <g fill="none" stroke="#F4F1E6" strokeWidth={5} strokeLinecap="round">
        <path d="M -70 -40 Q -50 -70 -30 -40 T 10 -40 T 50 -40" />
        <path d="M -70 10 L 60 10 M -70 40 L 20 40" />
        <circle cx={62} cy={40} r={10} />
      </g>
    ),
  },
  {
    label: "EXPLAINER",
    bg: "#3A57E8",
    draw: (
      <g>
        <circle r={56} fill="#FFFFFF" />
        <path d="M -16 -28 L 30 0 L -16 28 Z" fill="#3A57E8" />
      </g>
    ),
  },
];

/** Floating mini "reel" thumbnails above the head — the sharp explainers. */
export function ThumbStrip({ y = 260 }: { y?: number }) {
  const frame = useCurrentFrame();
  return (
    <Canvas>
      {THUMBS.map((t, i) => {
        const p = usePopAt(i * 4);
        const x = 250 + i * 290;
        const r = [-7, 3, 8][i];
        const bob = Math.sin((frame + i * 11) / 9) * 6;
        return (
          <g
            key={t.label}
            transform={`translate(${x} ${y + 150 + bob}) rotate(${r}) scale(${p})`}
            style={{ filter: "drop-shadow(0 12px 18px rgba(0,0,0,0.45))" }}
          >
            <rect
              x={-110}
              y={-150}
              width={220}
              height={300}
              rx={14}
              fill="#FFFFFF"
            />
            <rect
              x={-98}
              y={-138}
              width={196}
              height={220}
              rx={8}
              fill={t.bg}
            />
            <g transform="translate(0 -28)">{t.draw}</g>
            <text
              x={0}
              y={122}
              textAnchor="middle"
              fontFamily={F.tech}
              fontWeight={700}
              fontSize={30}
              fill="#111"
            >
              {t.label}
            </text>
          </g>
        );
      })}
    </Canvas>
  );
}

function usePopAt(from: number) {
  return usePop(from, 12);
}

/** Scribbled marker underline, for a closing line. */
export function Scribble({
  x1 = 220,
  x2 = 860,
  y = 1320,
  from = 0,
}: {
  x1?: number;
  x2?: number;
  y?: number;
  from?: number;
}) {
  const draw = useIn(from, 10);
  const d = `M ${x1} ${y} C ${x1 + 200} ${y - 20}, ${x2 - 200} ${y + 16}, ${x2} ${y - 6} M ${x1 + 60} ${y + 26} C ${x1 + 260} ${y + 8}, ${x2 - 160} ${y + 34}, ${x2 - 40} ${y + 18}`;
  return (
    <Canvas>
      <defs>
        <BoilFilter id="scrib-boil" scale={4} />
      </defs>
      <g style={{ filter: SHADOW }}>
        <path
          d={d}
          {...MARK}
          stroke="#FFD21F"
          strokeWidth={12}
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - draw}
          filter="url(#scrib-boil)"
        />
      </g>
    </Canvas>
  );
}
