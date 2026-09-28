import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { graphemes } from "../hooks/kit";
import { about, CEDAR, clamp, FRAME, hash, LEAF, MINT, RED, S, WHITE } from "./style";

/**
 * Beat 3-4 (reality): styled, roots lifted, thicker, and the touch test.
 */

/** A to-do card gets ticked in red pen: "จัดเสร็จ". */
export function TodoTick() {
  const frame = useCurrentFrame();
  const card = interpolate(frame, [0, 5], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.8)) });
  const tick = interpolate(frame, [5, 11], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const y = 250;

  return (
    <AbsoluteFill>
      <svg {...FRAME}>
        <g transform={about(540, y + 90, `rotate(${-3 + 3 * card}) scale(${card})`)}>
          <rect x={196} y={y + 12} width={700} height={190} rx={14} fill="rgba(0,0,0,0.3)" />
          <rect x={186} y={y} width={700} height={190} rx={14} fill={WHITE} />
          <path d={`M 186 ${y + 150} H 886`} stroke="#9CC3E6" strokeWidth={4} />
          <path d={`M 290 ${y} V ${y + 190}`} stroke="#F0A0A0" strokeWidth={4} />
          <rect x={210} y={y + 58} width={62} height={62} rx={8} fill="none" stroke="#333" strokeWidth={6} />
          <text x={330} y={y + 128} fontFamily={S.todo} fontWeight={600} fontSize={104} fill="#222">
            จัดเสร็จ
          </text>
          <path d={`M 205 ${y + 82} L 240 ${y + 124} L 305 ${y + 20}`} stroke={RED} strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" fill="none" pathLength={1} strokeDasharray={`${tick} 1`} />
        </g>
      </svg>
    </AbsoluteFill>
  );
}

const SHOOTS = [330, 540, 750];

/** Arrows shoot up from the roots; "ตั้งจากโคน" grows out of the ground letter by letter. */
export function SproutWord() {
  const frame = useCurrentFrame();
  const g = graphemes("ตั้งจากโคน");
  const baseY = 1760;

  return (
    <AbsoluteFill>
      <svg {...FRAME}>
        {SHOOTS.map((x, i) => {
          const p = interpolate(frame, [i * 2, i * 2 + 9], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
          const top = 720 - 380 * p;
          return (
            <g key={x} opacity={p > 0 ? 1 : 0}>
              <path d={`M ${x} 720 V ${top}`} stroke={WHITE} strokeWidth={12} strokeLinecap="round" strokeDasharray="2 26" />
              <path d={`M ${x - 36} ${top + 40} L ${x} ${top} L ${x + 36} ${top + 40}`} stroke={LEAF} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </g>
          );
        })}
        <path d={`M 90 ${baseY + 22} H 990`} stroke={MINT} strokeWidth={6} strokeLinecap="round" opacity={interpolate(frame, [0, 4], [0, 1], clamp)} />
        {Array.from({ length: 10 }, (_, i) => (
          <path key={i} d={`M ${130 + i * 92} ${baseY + 24} q ${(hash(i) - 0.5) * 30} 30 ${(hash(i * 2) - 0.5) * 20} 56`} stroke={MINT} strokeWidth={4} fill="none" opacity={interpolate(frame, [2, 7], [0, 0.8], clamp)} />
        ))}
      </svg>
      <div style={{ position: "absolute", top: baseY - 190, width: "100%", textAlign: "center", fontFamily: S.sprout, fontWeight: 700, fontSize: 150, lineHeight: "220px", whiteSpace: "nowrap" }}>
        {g.map((ch, i) => {
          const p = interpolate(frame, [3 + i * 1.3, 8 + i * 1.3], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2.2)) });
          return (
            <span key={i} style={{ display: "inline-block", transform: `scaleY(${p})`, transformOrigin: "50% 90%", color: WHITE, WebkitTextStroke: `12px ${CEDAR}`, paintOrder: "stroke fill" }}>
              {ch}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}

/** "หนาขึ้น" gains depth: its extrusion thickens layer by layer. */
export function ThickWord() {
  const frame = useCurrentFrame();
  const depth = Math.round(interpolate(frame, [3, 18], [0, 24], { ...clamp, easing: Easing.out(Easing.cubic) }));
  const enter = interpolate(frame, [0, 4], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
  const x = 600;
  const y = 420;

  return (
    <AbsoluteFill>
      <svg {...FRAME}>
        <g transform={about(x, y - 60, `scale(${enter})`)}>
          {Array.from({ length: depth }, (_, i) => depth - i).map((k) => (
            <text key={k} x={x + k * 1.4} y={y + k * 1.6} textAnchor="middle" fontFamily={S.thick} fontWeight={900} fontSize={180} fill={k === depth ? "#0B2419" : CEDAR} stroke={k === depth ? "#0B2419" : "none"} strokeWidth={6}>
              หนาขึ้น
            </text>
          ))}
          <text x={x} y={y} textAnchor="middle" fontFamily={S.thick} fontWeight={900} fontSize={180} fill={WHITE}>
            หนาขึ้น
          </text>
        </g>
        {/* depth gauge ticks */}
        <g opacity={enter}>
          {Array.from({ length: 6 }, (_, i) => (
            <rect key={i} x={950} y={y + 40 - i * 34} width={60} height={20} rx={4} fill={i < depth / 4 ? LEAF : "rgba(255,255,255,0.35)"} />
          ))}
        </g>
      </svg>
    </AbsoluteFill>
  );
}

const TOUCH = { x: 640, y: 560 };

/** Fingertip lands: fingerprint whorl + ripples, "จับ" squishes like it was pressed. */
export function TouchRipple() {
  const frame = useCurrentFrame();
  const press = interpolate(frame, [3, 5, 9], [0, 1, 0], clamp);
  const pop = interpolate(frame, [0, 4], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2.6)) });

  return (
    <AbsoluteFill>
      <svg {...FRAME}>
        {[0, 1, 2].map((k) => {
          const t = interpolate(frame, [3 + k * 4, 15 + k * 4], [0, 1], clamp);
          if (t <= 0 || t >= 1) return null;
          return <ellipse key={k} cx={TOUCH.x} cy={TOUCH.y} rx={40 + t * 260} ry={20 + t * 120} fill="none" stroke={WHITE} strokeWidth={8 * (1 - t) + 2} opacity={1 - t} />;
        })}
        <g opacity={interpolate(frame, [3, 6], [0, 0.9], clamp)}>
          {[0, 1, 2, 3, 4].map((k) => (
            <path key={k} d={`M ${TOUCH.x - 16 - k * 12} ${TOUCH.y + 4} a ${16 + k * 12} ${20 + k * 13} 0 1 1 ${32 + k * 24} 0`} stroke={MINT} strokeWidth={4} fill="none" />
          ))}
        </g>
        <g transform={about(270, 420, `scale(${pop * (1 + 0.18 * press)} ${pop * (1 - 0.28 * press)})`)}>
          <text x={270} y={450} textAnchor="middle" fontFamily={S.touch} fontWeight={700} fontSize={200} fill={WHITE} stroke={CEDAR} strokeWidth={18} strokeLinejoin="round" style={{ paintOrder: "stroke" }}>
            จับ
          </text>
        </g>
        <path d={`M 380 380 Q ${TOUCH.x - 120} ${TOUCH.y - 150} ${TOUCH.x - 50} ${TOUCH.y - 30}`} stroke={WHITE} strokeWidth={6} strokeDasharray="10 12" fill="none" opacity={pop} />
      </svg>
    </AbsoluteFill>
  );
}
