import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Canvas, clamp, graphemes, usePop } from "../hooks/kit";
import { burstPath, cloudPath, InkBoil, Screentone } from "./ComicKit";
import { hash, INK, M, PAPER, RED } from "./style";

/**
 * Beat D (5.16–6.74 s): a thought cloud rises from his head and fills with
 * silence — three dots tick in one by one — then "ไม่เห็นอะไร" is scrawled under it.
 */
export function SilentThought() {
  const frame = useCurrentFrame();
  const grow = usePop(0, 13);
  const dots = [5, 11, 17];
  const note = graphemes("ไม่เห็นอะไร");
  const typed = Math.floor(interpolate(frame, [24, 36], [0, note.length], clamp));

  return (
    <AbsoluteFill>
      <Canvas>
        <defs>
          <InkBoil id="r6-cloud-boil" scale={4} />
        </defs>
        <g filter="url(#r6-cloud-boil)" opacity={Math.min(1, grow * 2)}>
          {[
            [770, 1260, 22],
            [720, 1320, 32],
          ].map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r * grow} fill={PAPER} stroke={INK} strokeWidth={7} />
          ))}
          <g transform={`translate(540 1520) scale(${grow}) translate(-540 -1520)`}>
            <path d={cloudPath(540, 1520, 330, 150, 11)} fill={PAPER} stroke={INK} strokeWidth={9} />
          </g>
        </g>
        {dots.map((at, i) => {
          const p = usePopSafe(frame, at);
          return (
            <circle key={at} cx={400 + i * 140} cy={1530 - p * 14} r={30 * Math.min(1, p)} fill={INK} />
          );
        })}
        <text
          x={540}
          y={1800}
          fontFamily={M.note}
          fontSize={88}
          textAnchor="middle"
          fill={PAPER}
          stroke={INK}
          strokeWidth={14}
          paintOrder="stroke"
          strokeLinejoin="round"
        >
          {note.slice(0, typed).join("")}
        </text>
      </Canvas>
    </AbsoluteFill>
  );
}

/** Tiny bounce without a hook (safe inside map). */
function usePopSafe(frame: number, at: number) {
  return interpolate(frame, [at, at + 4, at + 7], [0, 1.25, 1], clamp);
}

const STAMPS = [
  { at: 0, x: 250, y: 1480, size: 230, rot: -13, seed: 1 },
  { at: 9, x: 830, y: 1250, size: 190, rot: 11, seed: 2 },
  { at: 18, x: 560, y: 1760, size: 270, rot: -4, seed: 3 },
] as const;

/**
 * Beat E (6.74–7.90 s): manga onomatopoeia — "ขยำ" is stamped three times
 * around the hands, each impact shaking with emanata dashes.
 */
export function ScrunchSfx() {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Canvas>
        {STAMPS.map((s) => {
          const t = frame - s.at;
          if (t < 0) return null;
          const k = interpolate(t, [0, 3, 6], [1.7, 0.92, 1], { ...clamp, easing: Easing.out(Easing.quad) });
          const shake = t < 8 ? (hash(s.seed * 13 + t) - 0.5) * 18 : 0;
          return (
            <g key={s.at} transform={`translate(${s.x + shake} ${s.y}) rotate(${s.rot}) scale(${k})`}>
              {[0, 1, 2, 3, 4].map((i) => {
                const a = (i / 5) * Math.PI * 2 + s.seed;
                const r1 = s.size * 0.72;
                const r2 = s.size * (0.95 + hash(s.seed + i) * 0.2);
                return (
                  <line
                    key={i}
                    x1={Math.cos(a) * r1}
                    y1={Math.sin(a) * r1 * 0.55 - s.size * 0.3}
                    x2={Math.cos(a) * r2}
                    y2={Math.sin(a) * r2 * 0.55 - s.size * 0.3}
                    stroke={INK}
                    strokeWidth={10}
                    strokeLinecap="round"
                    opacity={interpolate(t, [2, 4], [0, 1], clamp)}
                  />
                );
              })}
              <text x={10} y={10} fontFamily={M.sfx} fontSize={s.size} textAnchor="middle" fill={RED} stroke={RED} strokeWidth={16} strokeLinejoin="round">
                ขยำ
              </text>
              <text
                x={0}
                y={0}
                fontFamily={M.sfx}
                fontSize={s.size}
                textAnchor="middle"
                fill={PAPER}
                stroke={INK}
                strokeWidth={16}
                paintOrder="stroke"
                strokeLinejoin="round"
              >
                ขยำ
              </text>
            </g>
          );
        })}
      </Canvas>
    </AbsoluteFill>
  );
}

/** Upward "rising" motion marks beside the head. */
function RiseMarks({ x, from }: { x: number; from: number }) {
  const frame = useCurrentFrame();
  const t = frame - from;
  if (t < 0) return null;
  return (
    <g>
      {[0, 1, 2].map((i) => {
        const cycle = ((t + i * 6) % 18) / 18;
        const y = 860 - cycle * 260;
        const o = interpolate(cycle, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
        return (
          <g key={i} opacity={o} transform={`translate(${x + (i - 1) * 46} ${y})`}>
            <line x1={0} y1={0} x2={0} y2={-110} stroke={PAPER} strokeWidth={22} strokeLinecap="round" />
            <line x1={0} y1={0} x2={0} y2={-110} stroke={INK} strokeWidth={9} strokeLinecap="round" />
          </g>
        );
      })}
    </g>
  );
}

/**
 * Beat F (7.90–9.89 s): the wow panel — a jagged surprise burst slams in at
 * the top with "ฟู!!", rise marks stream up beside the head, and a narration
 * strip adds "ขึ้นมาเอง".
 */
export function RiseBurst({ subAt }: { subAt: number }) {
  const frame = useCurrentFrame();
  const pop = usePop(1, 8);
  const sub = usePop(subAt, 12);
  const jitter = frame < 14 ? (hash(frame) - 0.5) * 14 : Math.sin(frame / 3) * 2;
  const seed = Math.floor(frame / 3);

  return (
    <AbsoluteFill>
      <Canvas>
        <defs>
          <Screentone id="r6-burst-tone" gap={13} r={3.6} color={INK} />
        </defs>
        <RiseMarks x={250} from={4} />
        <RiseMarks x={830} from={8} />
        <g transform={`translate(${540 + jitter} 330) scale(${pop}) rotate(-3)`}>
          <path d={burstPath(0, 0, 470, 270, 16, seed)} fill={INK} transform="translate(16 18)" />
          <path d={burstPath(0, 0, 470, 270, 16, seed)} fill={PAPER} stroke={INK} strokeWidth={10} strokeLinejoin="round" />
          <path d={burstPath(0, 0, 340, 185, 12, seed + 40, 0.2)} fill="url(#r6-burst-tone)" opacity={0.35} />
          <text
            x={0}
            y={70}
            fontFamily={M.shout}
            fontSize={220}
            textAnchor="middle"
            fill={RED}
            stroke={INK}
            strokeWidth={12}
            paintOrder="stroke"
            strokeLinejoin="round"
          >
            ฟู!!
          </text>
        </g>
      </Canvas>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 600,
          display: "flex",
          justifyContent: "center",
          opacity: Math.min(1, sub * 2),
          transform: `translateY(${(1 - sub) * -40}px) rotate(2deg)`,
        }}
      >
        <div
          style={{
            background: INK,
            color: PAPER,
            fontFamily: M.box,
            fontWeight: 700,
            fontSize: 70,
            padding: "2px 34px 12px",
            border: `6px solid ${PAPER}`,
          }}
        >
          ขึ้นมาเอง
        </div>
      </div>
    </AbsoluteFill>
  );
}
