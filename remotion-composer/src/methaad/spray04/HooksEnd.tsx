import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { graphemes } from "../hooks/kit";
import { about, CAM, CEDAR, clamp, FRAME, hash, INK, LEAF, LIFT, RED, S, WHITE } from "./style";

/**
 * Beats 6-7 — "ทรงผมดี หน้าก็ดูดีขึ้นเอง" / "ตอนนี้ ลดสี่สิบห้าเปอร์เซ็นต์".
 * Best-shot star, a beauty filter that stays OFF (the hair did it), a
 * self-timer that counts to "ตอนนี้", and the shutter that fires "ลด 45%".
 */

/** Gallery "best shot" star bursts; "ทรงผมดี" pins under it like a favourite tag. */
export function BestShot() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const star = spring({ frame, fps, config: { damping: 8, stiffness: 200, mass: 0.6 } });
  const word = interpolate(frame, [4, 10], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const pts = Array.from({ length: 10 }, (_, i) => {
    const r = i % 2 === 0 ? 70 : 30;
    const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
    return `${Math.cos(a) * r},${Math.sin(a) * r}`;
  }).join(" ");

  return (
    <AbsoluteFill>
      <svg {...FRAME}>
        <g transform={`translate(180 1650) scale(${Math.max(0, star)}) rotate(${(1 - star) * -90})`}>
          <polygon points={pts} fill={CAM} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
        </g>
        {Array.from({ length: 8 }, (_, i) => {
          const t = interpolate(frame, [2, 12], [0, 1], clamp);
          const a = (i / 8) * Math.PI * 2;
          return <circle key={i} cx={180 + Math.cos(a) * (80 + t * 70)} cy={1650 + Math.sin(a) * (80 + t * 70)} r={8 * (1 - t)} fill={CAM} />;
        })}
        <g opacity={word} transform={`translate(${(1 - word) * -60} 0)`}>
          <text x={280} y={1710} fontFamily={S.good} fontWeight={700} fontSize={150} fill={WHITE} stroke={INK} strokeWidth={14} strokeLinejoin="round" style={{ paintOrder: "stroke" }}>
            ทรงผมดี
          </text>
          <text x={290} y={1570} fontFamily={S.ui} fontWeight={700} fontSize={36} fill={CAM} letterSpacing={4} stroke={INK} strokeWidth={6} style={{ paintOrder: "stroke" }}>
            BEST SHOT
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
}

/** Beauty-filter toggle gets tapped... and stays OFF: "หน้าก็ดูดีขึ้นเอง". */
export function BeautyOff() {
  const frame = useCurrentFrame();
  const panel = interpolate(frame, [0, 6], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const tap = interpolate(frame, [8, 11, 14], [0, 1, 0], clamp);
  const g = graphemes("หน้าก็ดูดีขึ้นเอง");
  const typed = Math.floor(interpolate(frame, [12, 26], [0, g.length], clamp));

  return (
    <AbsoluteFill>
      <svg {...FRAME}>
        <g transform={`translate(0 ${(1 - panel) * 200})`} opacity={panel}>
          <rect x={90} y={1310} width={900} height={150} rx={30} fill="rgba(11,11,12,0.82)" />
          <text x={140} y={1405} fontFamily={S.filter} fontWeight={700} fontSize={58} fill={WHITE}>
            ฟิลเตอร์หน้าใส
          </text>
          <rect x={740} y={1345} width={200} height={82} rx={41} fill="rgba(255,255,255,0.25)" stroke={WHITE} strokeWidth={4} />
          <circle cx={781} cy={1386} r={33} fill={WHITE} />
          <text x={880} y={1400} textAnchor="middle" fontFamily={S.ui} fontWeight={700} fontSize={34} fill={WHITE}>
            OFF
          </text>
          <circle cx={781} cy={1386} r={40 + tap * 30} fill="none" stroke={CAM} strokeWidth={6} opacity={tap} />
        </g>
        <text x={540} y={1620} textAnchor="middle" fontFamily={S.filter} fontWeight={700} fontSize={112} fill={WHITE} stroke={CEDAR} strokeWidth={12} strokeLinejoin="round" style={{ paintOrder: "stroke" }}>
          {g.slice(0, typed).join("")}
        </text>
        <text x={540} y={1720} textAnchor="middle" fontFamily={S.filter} fontWeight={700} fontSize={50} fill={LEAF} style={{ textShadow: LIFT }} opacity={interpolate(frame, [26, 30], [0, 1], clamp)}>
          ไม่ต้องพึ่งฟิลเตอร์
        </text>
      </svg>
    </AbsoluteFill>
  );
}

/** Self-timer ring counts down 3-2-1 and lands on "ตอนนี้". */
export function TimerNow() {
  const frame = useCurrentFrame();
  const n = 3 - Math.floor(frame / 5);
  const ring = interpolate(frame, [0, 15], [0, 1], clamp);
  const now = frame >= 15;

  return (
    <AbsoluteFill>
      <svg {...FRAME}>
        <circle cx={540} cy={1500} r={150} fill="rgba(11,11,12,0.75)" />
        <circle cx={540} cy={1500} r={150} fill="none" stroke={CAM} strokeWidth={12} pathLength={1} strokeDasharray={`${ring} 1`} transform="rotate(-90 540 1500)" />
        {now ? (
          <text x={540} y={1540} textAnchor="middle" fontFamily={S.ui} fontWeight={700} fontSize={96} fill={CAM}>
            ตอนนี้
          </text>
        ) : (
          <text x={540} y={1560} textAnchor="middle" fontFamily={S.ui} fontWeight={700} fontSize={180} fill={WHITE} transform={about(540, 1500, `scale(${1.3 - (frame % 5) * 0.06})`)}>
            {Math.max(1, n)}
          </text>
        )}
      </svg>
    </AbsoluteFill>
  );
}

/** Shutter fires: button squash, captured thumbnail flies to the corner, "ลด 45%" stamps on. */
export function ShutterDeal() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const press = interpolate(frame, [0, 2, 6], [1, 0.8, 1], clamp);
  const deal = spring({ frame: frame - 3, fps, config: { damping: 9, stiffness: 220, mass: 0.7 } });
  const thumb = interpolate(frame, [2, 12], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const shake = frame >= 5 && frame < 10 ? (hash(frame) - 0.5) * 14 : 0;
  const sub = interpolate(frame, [12, 18], [0, 1], clamp);

  return (
    <AbsoluteFill>
      <svg {...FRAME}>
        {/* captured frame shrinking to the gallery corner */}
        {thumb < 1 ? (
          <rect x={60 + thumb * 20} y={170 + thumb * 1480} width={960 * (1 - thumb) + 110 * thumb} height={1600 * (1 - thumb) + 110 * thumb} rx={12 + thumb * 10} fill="none" stroke={WHITE} strokeWidth={8} opacity={1 - thumb * 0.3} />
        ) : (
          <rect x={80} y={1650} width={110} height={110} rx={22} fill={CEDAR} stroke={WHITE} strokeWidth={6} />
        )}
        {/* shutter button */}
        <g transform={about(540, 1700, `scale(${press})`)}>
          <circle cx={540} cy={1700} r={78} fill="none" stroke={WHITE} strokeWidth={10} />
          <circle cx={540} cy={1700} r={62} fill={WHITE} />
        </g>
        {/* the deal */}
        <g transform={`translate(${540 + shake} 1250) rotate(-6) scale(${Math.max(0, deal)})`}>
          <rect x={-400} y={-190} width={800} height={330} rx={40} fill={RED} stroke={WHITE} strokeWidth={12} />
          <text x={-230} y={-60} textAnchor="middle" fontFamily={S.deal} fontSize={110} fill={WHITE}>
            ลด
          </text>
          <text x={70} y={100} textAnchor="middle" fontFamily={S.deal} fontSize={300} fill={WHITE}>
            45%
          </text>
        </g>
        <g opacity={sub}>
          <rect x={110} y={1460} width={860} height={96} rx={48} fill={WHITE} />
          <text x={540} y={1526} textAnchor="middle" fontFamily={S.portrait} fontWeight={700} fontSize={48} fill={CEDAR}>
            สเปรย์เพิ่มวอลลุ่ม MAKE SENSE
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
}
