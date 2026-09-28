import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Canvas, clamp } from "../hooks/kit";
import { about, CARBON, CHALK, hash, PANEL, T, WATER } from "./style";

const DX = 230;
const DY = 1640;

/** Water-drop outline centred on (DX, DY), height ~330. */
const DROP = `M ${DX} ${DY - 190} C ${DX + 40} ${DY - 110}, ${DX + 140} ${DY - 20}, ${DX + 140} ${DY + 60} A 140 140 0 0 1 ${DX - 140} ${DY + 60} C ${DX - 140} ${DY - 20}, ${DX - 40} ${DY - 110}, ${DX} ${DY - 190} Z`;

/** [x, y, r] residue blobs stuck to the drop before the wash. */
const GUNK = [
  [DX - 60, DY + 30, 30],
  [DX + 48, DY + 70, 36],
  [DX - 10, DY + 130, 26],
  [DX + 70, DY - 10, 20],
] as const;

/**
 * Day 7 — "สระทีเดียวหลุด ไม่มีคราบ": a water-drop badge fills with clean water;
 * at "หลุด" the residue blobs slide off and drip away; at "ไม่มีคราบ" the drop
 * shines and the line flips to the clean verdict.
 */
export function DropBadge({ offAt, cleanAt }: { offAt: number; cleanAt: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 11, stiffness: 210, mass: 0.6 } });
  const fill = interpolate(frame, [2, 16], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const wave = Math.sin(frame / 3) * 10;
  const levelY = DY + 200 - fill * 330;
  const shine = interpolate(frame, [cleanAt, cleanAt + 6], [0, 1], clamp);
  const verdict = spring({ frame: frame - cleanAt, fps, config: { damping: 10, stiffness: 240, mass: 0.5 } });
  const offWord = spring({ frame: frame - offAt, fps, config: { damping: 9, stiffness: 220, mass: 0.6 } });

  return (
    <Canvas>
      <clipPath id="sp5-drop">
        <path d={DROP} />
      </clipPath>
      <rect x={40} y={1400} width={1000} height={440} rx={60} fill={PANEL} opacity={enter} />
      <g transform={about(DX, DY, `scale(${enter})`)}>
        <path d={DROP} fill="rgba(91,200,255,0.18)" />
        <g clipPath="url(#sp5-drop)">
          <path d={`M ${DX - 200} ${levelY} Q ${DX - 100} ${levelY - 24 + wave} ${DX} ${levelY} T ${DX + 200} ${levelY} V ${DY + 260} H ${DX - 200} Z`} fill={WATER} />
          {GUNK.map(([x, y, r], i) => {
            const t = frame - offAt - i * 1.5;
            const slide = t > 0 ? interpolate(t, [0, 12], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) }) : 0;
            return <ellipse key={i} cx={x + slide * 20} cy={y + slide * 320} rx={r} ry={r * (1 + slide * 0.6)} fill="#8C7B55" opacity={1 - slide} />;
          })}
        </g>
        <path d={DROP} fill="none" stroke={CHALK} strokeWidth={12} strokeLinejoin="round" />
        <path d={`M ${DX - 80} ${DY + 40} Q ${DX - 84} ${DY - 30} ${DX - 36} ${DY - 90}`} stroke="#FFFFFF" strokeWidth={16} fill="none" strokeLinecap="round" opacity={0.4 + shine * 0.6} />
        {shine > 0 && shine < 1
          ? [0, 1, 2, 3].map((i) => {
              const a = (i / 4) * Math.PI * 2 + 0.4;
              const d = 170 + shine * 60;
              return <line key={i} x1={DX + Math.cos(a) * d} y1={DY + 20 + Math.sin(a) * d} x2={DX + Math.cos(a) * (d + 40)} y2={DY + 20 + Math.sin(a) * (d + 40)} stroke={WATER} strokeWidth={10} strokeLinecap="round" />;
            })
          : null}
      </g>
      {/* falling gunk drips below the badge */}
      {GUNK.map(([x], i) => {
        const t = frame - offAt - 8 - i * 1.5;
        if (t < 0 || t > 14) return null;
        return <circle key={i} cx={x + 20} cy={DY + 230 + t * 9 + hash(i) * 10} r={10} fill="#8C7B55" opacity={1 - t / 14} />;
      })}
      <text x={420} y={1540} fontFamily={T.water} fontWeight={700} fontSize={70} fill={CHALK} opacity={enter}>
        สระทีเดียว
      </text>
      {verdict < 0.5 ? (
        <g transform={`translate(${offWord * 30} ${offWord * 16}) ${about(420, 1700, `rotate(${offWord * 7})`)}`}>
          <text x={420} y={1700} fontFamily={T.water} fontWeight={700} fontSize={150} fill={WATER} stroke={CARBON} strokeWidth={10} paintOrder="stroke" opacity={Math.min(enter, 1 - verdict * 2)}>
            หลุด
          </text>
        </g>
      ) : (
        <g transform={about(420, 1690, `scale(${verdict})`)}>
          <text x={420} y={1700} fontFamily={T.water} fontWeight={700} fontSize={112} fill={CHALK} stroke={CARBON} strokeWidth={10} paintOrder="stroke">
            ไม่มีคราบ
          </text>
          <line x1={424} y1={1740} x2={424 + verdict * 520} y2={1740} stroke={WATER} strokeWidth={12} strokeLinecap="round" />
        </g>
      )}
    </Canvas>
  );
}
