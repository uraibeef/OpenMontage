import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { about, clamp, FRAME, GRAPHITE, hash, RED, S, WHITE, WOOD } from "./style";

/**
 * Beat 5: dazed ("งง"), the facepalm punch ("ทำไมไม่ลอง") and the long
 * stretch of time he waited ("ตั้งนาน") with the deal.
 */

const ORBIT = { x: 560, y: 470, rx: 440, ry: 130 };

/** Question marks orbit his head like cartoon stars; "งง" wobbles below. */
export function DizzyOrbit() {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 5], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
  const marks = Array.from({ length: 5 }, (_, i) => {
    const a = frame / 6 + (i / 5) * Math.PI * 2;
    return { i, a, depth: Math.sin(a) };
  }).sort((p, q) => p.depth - q.depth);

  return (
    <AbsoluteFill>
      <svg {...FRAME}>
        <g transform={about(ORBIT.x, ORBIT.y, "rotate(-8)")} opacity={enter}>
          <ellipse cx={ORBIT.x} cy={ORBIT.y} rx={ORBIT.rx} ry={ORBIT.ry} fill="none" stroke={WHITE} strokeWidth={5} strokeDasharray="6 20" opacity={0.8} />
          {marks.map(({ i, a, depth }) => {
            const x = ORBIT.x + Math.cos(a) * ORBIT.rx;
            const y = ORBIT.y + Math.sin(a) * ORBIT.ry;
            const s = 0.75 + 0.35 * depth;
            return (
              <g key={i} transform={about(x, y, `scale(${s * enter}) rotate(${Math.cos(a) * 20})`)} opacity={0.55 + 0.45 * (depth + 1) / 2}>
                <text x={x} y={y + 40} textAnchor="middle" fontFamily={S.dizzy} fontSize={230} fill={i % 2 ? WHITE : "#FFD84A"} stroke={GRAPHITE} strokeWidth={12} style={{ paintOrder: "stroke" }}>
                  ?
                </text>
              </g>
            );
          })}
        </g>
        <g transform={about(540, 1680, `rotate(${Math.sin(frame / 2.4) * 9}) scale(${enter})`)}>
          <text x={540} y={1760} textAnchor="middle" fontFamily={S.dizzy} fontSize={230} fill={WHITE} stroke={GRAPHITE} strokeWidth={18} style={{ paintOrder: "stroke" }}>
            งง
          </text>
          <path d="M 340 1610 c 30 -40, 70 -40, 70 0 s -50 40, -40 0" stroke={WHITE} strokeWidth={7} fill="none" />
          <path d="M 700 1610 c 30 -40, 70 -40, 70 0 s -50 40, -40 0" stroke={WHITE} strokeWidth={7} fill="none" />
        </g>
      </svg>
    </AbsoluteFill>
  );
}

const IMPACT = 5;

function Palm({ x, y, rot, scale }: { x: number; y: number; rot: number; scale: number }) {
  const fingers = [
    [-78, -150, 150],
    [-26, -175, 175],
    [26, -168, 168],
    [78, -140, 140],
  ] as const;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${scale})`} stroke={GRAPHITE} strokeWidth={9} strokeLinejoin="round">
      {fingers.map(([fx, fy, h], i) => (
        <rect key={i} x={fx - 24} y={fy} width={48} height={h} rx={24} fill="#F3C9A1" />
      ))}
      <rect x={-110} y={-40} width={220} height={190} rx={60} fill="#F3C9A1" />
      <rect x={-190} y={-10} width={130} height={52} rx={26} fill="#F3C9A1" transform="rotate(-35 -110 20)" />
      <path d="M -60 40 q 60 30 120 0" fill="none" strokeWidth={6} />
    </g>
  );
}

/** A drawn palm slaps down on "ทำไมไม่ลอง" — the facepalm punch. */
export function PalmSlap() {
  const frame = useCurrentFrame();
  const fall = interpolate(frame, [0, IMPACT], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const after = frame >= IMPACT;
  const squash = after ? interpolate(frame, [IMPACT, IMPACT + 6], [0.62, 1], { ...clamp, easing: Easing.out(Easing.back(3)) }) : 1;
  const shake = after && frame < IMPACT + 5 ? (hash(frame) - 0.5) * 30 : 0;
  const burst = interpolate(frame, [IMPACT, IMPACT + 8], [0, 1], clamp);
  const wordY = 560;

  return (
    <AbsoluteFill>
      <svg {...FRAME}>
        {burst > 0 && burst < 1
          ? Array.from({ length: 14 }, (_, i) => {
              const a = (i / 14) * Math.PI * 2;
              const r0 = 300 + burst * 80;
              const r1 = r0 + 90 * (1 - burst);
              return <path key={i} d={`M ${540 + Math.cos(a) * r0} ${wordY - 60 + Math.sin(a) * r0 * 0.45} L ${540 + Math.cos(a) * r1} ${wordY - 60 + Math.sin(a) * r1 * 0.45}`} stroke={RED} strokeWidth={14} strokeLinecap="round" />;
            })
          : null}
        <g transform={`translate(${shake} 0) ${about(540, wordY, `scale(${2 - squash} ${squash})`)}`}>
          <text x={540} y={wordY} textAnchor="middle" fontFamily={S.slap} fontStyle="italic" fontWeight={900} fontSize={150} fill={RED} stroke={WHITE} strokeWidth={16} strokeLinejoin="round" style={{ paintOrder: "stroke" }}>
            ทำไมไม่ลอง
          </text>
        </g>
        <Palm x={after ? 880 + shake : 1300 - 420 * fall} y={after ? wordY - 260 : -300 + (wordY + 40) * fall} rot={after ? -28 : -80 + 52 * fall} scale={1.6} />
      </svg>
    </AbsoluteFill>
  );
}

/** "ตั้งนาน" stretches out like dragged-out time; a price tag swings in with the deal. */
export function LongWord() {
  const frame = useCurrentFrame();
  const stretch = interpolate(frame, [0, 14], [0.7, 1.45], { ...clamp, easing: Easing.out(Easing.elastic(1)) });
  const line = interpolate(frame, [0, 14], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const tag = interpolate(frame, [6, 14], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
  const swing = Math.sin(frame / 3) * 10 * (1 - Math.min(1, frame / 26));
  const y = 1760;

  return (
    <AbsoluteFill>
      <svg {...FRAME}>
        <rect x={0} y={y - 170} width={1080} height={300} fill="rgba(14,16,18,0.55)" />
        <g transform={about(540, y - 60, `scale(${stretch} 1)`)}>
          <text x={540} y={y} textAnchor="middle" fontFamily={S.long} fontWeight={800} fontSize={170} fill={WHITE} stroke={GRAPHITE} strokeWidth={16} strokeLinejoin="round" style={{ paintOrder: "stroke" }}>
            ตั้งนาน
          </text>
        </g>
        <g opacity={line}>
          <path d={`M ${540 - 480 * line} ${y + 70} H ${540 + 480 * line}`} stroke={WHITE} strokeWidth={8} strokeLinecap="round" />
          {Array.from({ length: 13 }, (_, i) => {
            const x = 540 + (i - 6) * 80 * line;
            return <path key={i} d={`M ${x} ${y + 52} V ${y + 88}`} stroke={WHITE} strokeWidth={6} strokeLinecap="round" />;
          })}
          <path d={`M ${540 + 480 * line - 26} ${y + 50} L ${540 + 480 * line + 4} ${y + 70} L ${540 + 480 * line - 26} ${y + 90}`} stroke={WHITE} strokeWidth={8} fill="none" strokeLinecap="round" />
        </g>
        {/* price tag on a string */}
        <g transform={about(800, 180, `rotate(${swing}) scale(${tag})`)}>
          <path d="M 800 180 V 300" stroke={WHITE} strokeWidth={5} />
          <path d="M 700 300 H 900 L 950 370 V 560 H 650 V 370 Z" fill={RED} stroke={WHITE} strokeWidth={8} strokeLinejoin="round" />
          <circle cx={800} cy={340} r={16} fill={WOOD} stroke={WHITE} strokeWidth={5} />
          <text x={800} y={450} textAnchor="middle" fontFamily={S.stamp} fontWeight={700} fontSize={74} fill={WHITE}>ลด</text>
          <text x={800} y={535} textAnchor="middle" fontFamily={S.stamp} fontWeight={700} fontSize={96} fill={WHITE}>45%</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
}
