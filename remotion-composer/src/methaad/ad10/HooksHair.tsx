import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { graphemes } from "../hooks/kit";
import { about, AMBER, clamp, hash, INK, PAPER, R } from "./style";

/**
 * Beats 6-9: the hair. "หัวแบนแปะ" gets flattened by a press, "โรยที่โคน"
 * settles out of falling powder, "ขยำ" is squeezed in pulses, and
 * "จัดทรงนิดหน่อย" rides a swoop of hair behind a gliding comb.
 */

/** A steel press slams down and flattens the word against the head. */
export function SquashWord() {
  const frame = useCurrentFrame();
  const slam = interpolate(frame, [6, 10], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const settle = interpolate(frame, [10, 14], [0, 1], { ...clamp, easing: Easing.out(Easing.back(3)) });
  const enter = interpolate(frame, [0, 4], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const sy = frame < 10 ? 1.2 : 1.2 - 0.55 * settle;
  const sx = frame < 10 ? 0.92 : 0.92 + 0.2 * settle;
  const base = 470;
  const capH = 158; // glyph height above the baseline at scale 1
  const plateY = frame < 10 ? interpolate(slam, [0, 1], [-300, base - capH * 1.2 - 60]) : base - capH * sy - 60;
  const puff = interpolate(frame, [10, 22], [0, 1], clamp);

  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        <g opacity={enter} transform={about(560, base, `scale(${sx} ${sy})`)}>
          <text x={560} y={base} textAnchor="middle" fontFamily={R.flat} fontWeight={900} fontSize={150} fill={PAPER} stroke={INK} strokeWidth={14} strokeLinejoin="round" style={{ paintOrder: "stroke" }}>
            หัวแบนแปะ
          </text>
        </g>
        {/* the press */}
        <g transform={`translate(0 ${plateY})`}>
          <rect x={530} y={-900} width={60} height={900} fill="#5C636E" />
          <rect x={150} y={-10} width={820} height={70} rx={10} fill="#8E97A4" stroke={INK} strokeWidth={6} />
          <rect x={150} y={44} width={820} height={16} fill="#5C636E" />
        </g>
        {puff > 0 && puff < 1
          ? Array.from({ length: 8 }, (_, i) => {
              const side = i % 2 ? 1 : -1;
              const x = 560 + side * (360 + puff * (80 + hash(i) * 120));
              const y = base - 20 - hash(i * 3) * 60 - puff * 30;
              return <circle key={i} cx={x} cy={y} r={14 + puff * 26} fill="rgba(240,240,240,0.7)" opacity={1 - puff} />;
            })
          : null}
      </svg>
    </AbsoluteFill>
  );
}

/** Marker word whose letters condense out of falling powder grains. */
export function SprinkleWord() {
  const frame = useCurrentFrame();
  const g = graphemes("โรยที่โคน");
  const x0 = 70;
  const y = 560;
  const arrow = interpolate(frame, [14, 22], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });

  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: 70 }, (_, i) => {
          const born = Math.floor(hash(i * 2.3) * 14);
          const t = frame - born;
          if (t < 0 || t > 8) return null;
          const gx = x0 + hash(i * 9.1) * 560;
          const gy = y - 260 + t * 34 + hash(i) * 40;
          return <rect key={i} x={gx} y={gy} width={7} height={7} fill="#FFFFFF" opacity={1 - t / 9} />;
        })}
        <path
          d={`M ${x0 + 300} ${y + 40} C ${x0 + 420} ${y + 130}, ${x0 + 470} ${y + 170}, ${x0 + 560} ${y + 180}`}
          stroke={AMBER}
          strokeWidth={9}
          fill="none"
          strokeLinecap="round"
          strokeDasharray="4 18"
          pathLength={1}
          opacity={arrow}
        />
        {arrow >= 1 ? <circle cx={x0 + 570} cy={y + 180} r={18} fill="none" stroke={AMBER} strokeWidth={7} /> : null}
      </svg>
      <div style={{ position: "absolute", left: x0, top: y - 150, fontFamily: R.marker, fontSize: 138, lineHeight: "200px", color: "#FFFFFF", whiteSpace: "nowrap", textShadow: `5px 6px 0 ${INK}, 0 0 18px rgba(0,0,0,0.55)` }}>
        {g.map((ch, i) => {
          const p = interpolate(frame, [2 + i * 1.5, 7 + i * 1.5], [0, 1], clamp);
          return (
            <span key={i} style={{ display: "inline-block", opacity: p, filter: `blur(${(1 - p) * 10}px)`, transform: `translateY(${(1 - p) * -40}px)` }}>
              {ch}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}

/** "ขยำ" squeezed in pulses between compression brackets. */
export function ScrunchWord() {
  const frame = useCurrentFrame();
  const pulse = Math.abs(Math.sin((frame / 17) * Math.PI * 3));
  const enter = interpolate(frame, [0, 3], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
  const sx = 1.05 - pulse * 0.4;
  const sy = 0.95 + pulse * 0.22;
  const y = 1620;
  const gap = 250 * sx + 40;

  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        <g transform={about(540, y - 70, `scale(${enter})`)}>
          {[0, 1, 2].map((i) => (
            <g key={i} stroke={AMBER} strokeWidth={10} fill="none" strokeLinecap="round" opacity={1 - i * 0.28}>
              <path d={`M ${540 - gap - i * 34} ${y - 170} Q ${540 - gap - 40 - i * 34} ${y - 70} ${540 - gap - i * 34} ${y + 30}`} />
              <path d={`M ${540 + gap + i * 34} ${y - 170} Q ${540 + gap + 40 + i * 34} ${y - 70} ${540 + gap + i * 34} ${y + 30}`} />
            </g>
          ))}
          <g transform={about(540, y - 70, `scale(${sx} ${sy}) rotate(${(pulse - 0.5) * 6})`)}>
            <text x={540} y={y} textAnchor="middle" fontFamily={R.scrunch} fontSize={250} fill={AMBER} stroke={INK} strokeWidth={16} strokeLinejoin="round" style={{ paintOrder: "stroke" }}>
              ขยำ
            </text>
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
}

const P0 = [50, 1660];
const P1 = [330, 1500];
const P2 = [700, 1500];
const P3 = [1040, 1600];

function bez(t: number) {
  const u = 1 - t;
  const pt = (i: 0 | 1) => u * u * u * P0[i] + 3 * u * u * t * P1[i] + 3 * u * t * t * P2[i] + t * t * t * P3[i];
  const d = (i: 0 | 1) => 3 * u * u * (P1[i] - P0[i]) + 6 * u * t * (P2[i] - P1[i]) + 3 * t * t * (P3[i] - P2[i]);
  return { x: pt(0), y: pt(1), a: (Math.atan2(d(1), d(0)) * 180) / Math.PI };
}

/** Text rides a hair swoop, revealed behind a comb gliding along it. */
export function SwoopWord() {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [2, 20], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const c = bez(Math.min(t, 1));
  const path = `M ${P0.join(" ")} C ${P1.join(" ")}, ${P2.join(" ")}, ${P3.join(" ")}`;
  const combOut = interpolate(frame, [20, 26], [1, 0], clamp);

  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <path id="r10-swoop" d={path} />
          <clipPath id="r10-swoop-clip">
            <rect x={0} y={1100} width={c.x + 20} height={800} />
          </clipPath>
        </defs>
        <g clipPath="url(#r10-swoop-clip)">
          {[0, 1, 2].map((i) => (
            <path key={i} d={path} transform={`translate(0 ${30 + i * 16})`} stroke="rgba(255,255,255,0.7)" strokeWidth={4 - i} fill="none" strokeLinecap="round" />
          ))}
          <text fontFamily={R.swoop} fontSize={116} fill="#FFFFFF" stroke={INK} strokeWidth={12} strokeLinejoin="round" style={{ paintOrder: "stroke" }}>
            <textPath href="#r10-swoop" startOffset="1%">
              จัดทรงนิดหน่อย
            </textPath>
          </text>
        </g>
        <g transform={`translate(${c.x} ${c.y + 40}) rotate(${c.a}) scale(${combOut})`}>
          <rect x={-70} y={-16} width={140} height={34} rx={10} fill={AMBER} stroke={INK} strokeWidth={4} />
          {Array.from({ length: 11 }, (_, i) => (
            <rect key={i} x={-64 + i * 12.4} y={16} width={6} height={36} rx={3} fill={AMBER} stroke={INK} strokeWidth={2} />
          ))}
        </g>
      </svg>
    </AbsoluteFill>
  );
}
