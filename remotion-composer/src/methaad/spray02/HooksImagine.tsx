import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BoilFilter, graphemes } from "../hooks/kit";
import { about, CEDAR, clamp, FRAME, GRAPHITE, hash, HONEY, HONEY_DK, NOTE, RED, S, WHITE } from "./style";

/**
 * Beat 1: the POV stamp, the spray's name, and what he imagines —
 * a pencil thought bubble and a honey-gloop helmet.
 */

const STAMP = { x: 540, y: 430 };
const CHIP = { x: 196, y: 118, scale: 0.4 };

/** Red rubber stamp "POV: ครั้งแรก" slams on, then docks top-left for the whole ad. */
export function PovStamp() {
  const frame = useCurrentFrame();
  const slam = interpolate(frame, [0, 5], [2.3, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const shake = frame >= 5 && frame < 10 ? (hash(frame) - 0.5) * 14 : 0;
  const dock = interpolate(frame, [24, 33], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const x = STAMP.x + (CHIP.x - STAMP.x) * dock + shake;
  const y = STAMP.y + (CHIP.y - STAMP.y) * dock;
  const scale = slam * (1 + (CHIP.scale - 1) * dock);
  const rot = -7 + 4 * dock;
  const splat = interpolate(frame, [5, 9, 20], [0, 1, 0], clamp);

  return (
    <AbsoluteFill>
      <svg {...FRAME}>
        <defs>
          <BoilFilter id="s02-stamp-rough" scale={4} />
        </defs>
        <g filter="url(#s02-stamp-rough)">
          <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${scale})`} opacity={interpolate(frame, [0, 2], [0, 1], clamp)}>
            <rect x={-380} y={-100} width={760} height={200} rx={18} fill={dock > 0.5 ? RED : "rgba(255,255,255,0.9)"} stroke={RED} strokeWidth={14} />
            <rect x={-356} y={-76} width={712} height={152} rx={10} fill="none" stroke={dock > 0.5 ? WHITE : RED} strokeWidth={5} />
            <text x={0} y={44} textAnchor="middle" fontFamily={S.stamp} fontWeight={700} fontSize={122} fill={dock > 0.5 ? WHITE : RED} letterSpacing={2}>
              POV: ครั้งแรก
            </text>
          </g>
        </g>
        {splat > 0
          ? Array.from({ length: 12 }, (_, i) => {
              const a = hash(i * 4.1) * Math.PI * 2;
              const d = 400 + hash(i * 7.3) * 120;
              return <circle key={i} cx={STAMP.x + Math.cos(a) * d * 0.95} cy={STAMP.y + Math.sin(a) * d * 0.32} r={4 + hash(i) * 9} fill={RED} opacity={splat} />;
            })
          : null}
      </svg>
    </AbsoluteFill>
  );
}

/** "วอลลุ่ม" letters inflate one by one like balloons being pumped. */
export function VolumeWord() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const g = graphemes("วอลลุ่ม");
  const tag = interpolate(frame, [0, 5], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });

  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 560, width: "100%", textAlign: "center" }}>
        <span style={{ display: "inline-block", fontFamily: S.volume, fontWeight: 700, fontSize: 64, color: WHITE, background: CEDAR, padding: "6px 34px 12px", borderRadius: 999, transform: `scale(${tag})`, boxShadow: "0 8px 0 rgba(0,0,0,0.25)" }}>
          สเปรย์เพิ่ม
        </span>
      </div>
      <div style={{ position: "absolute", top: 680, width: "100%", textAlign: "center", fontFamily: S.volume, fontWeight: 700, fontSize: 200, lineHeight: "280px", whiteSpace: "nowrap" }}>
        {g.map((ch, i) => {
          const s = spring({ frame: frame - 1 - i * 1.2, fps, config: { damping: 7, stiffness: 160, mass: 0.6 } });
          const breathe = 1 + 0.05 * Math.sin((frame - i * 3) / 3.2) * Math.min(1, s);
          return (
            <span key={i} style={{ display: "inline-block", transform: `scale(${Math.max(0, s) * breathe})`, transformOrigin: "50% 85%", color: WHITE, WebkitTextStroke: `14px ${CEDAR}`, paintOrder: "stroke fill", textShadow: `0 14px 0 ${CEDAR}` }}>
              {ch}
            </span>
          );
        })}
      </div>
      <svg {...FRAME}>
        {Array.from({ length: 6 }, (_, i) => {
          const born = 6 + i * 3;
          const t = interpolate(frame, [born, born + 8], [0, 1], clamp);
          if (t <= 0 || t >= 1) return null;
          const x = 170 + hash(i * 3.3) * 740;
          const y = 700 + (hash(i * 5.1) > 0.5 ? -40 : 300) - t * 60;
          return (
            <g key={i} opacity={1 - t} transform={about(x, y, `scale(${0.6 + t})`)}>
              <path d={`M ${x - 18} ${y} H ${x + 18} M ${x} ${y - 18} V ${y + 18}`} stroke={WHITE} strokeWidth={8} strokeLinecap="round" />
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
}

const CLOUD = [
  [600, 250, 92],
  [700, 190, 110],
  [830, 200, 104],
  [930, 270, 86],
  [880, 360, 92],
  [740, 380, 100],
  [610, 350, 84],
] as const;

/** Pencil thought bubble puffs out of his head: "นึกว่า..." */
export function ThoughtBubble() {
  const frame = useCurrentFrame();
  const dots = [
    [470, 520, 16],
    [520, 470, 24],
    [575, 420, 32],
  ] as const;
  const text = interpolate(frame, [9, 15], [0, 1], clamp);
  const dotsShown = graphemes("นึกว่า...").slice(0, Math.floor(text * 7 + 0.001));

  return (
    <AbsoluteFill>
      <svg {...FRAME}>
        <defs>
          <BoilFilter id="s02-cloud-boil" scale={6} />
        </defs>
        <g filter="url(#s02-cloud-boil)">
          {dots.map(([x, y, r], i) => {
            const p = interpolate(frame, [i * 2, i * 2 + 4], [0, 1], { ...clamp, easing: Easing.out(Easing.back(3)) });
            return <circle key={i} cx={x} cy={y} r={r * p} fill={NOTE} stroke={GRAPHITE} strokeWidth={6} />;
          })}
          {CLOUD.map(([x, y, r], i) => {
            const p = interpolate(frame, [5 + i, 10 + i], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2.4)) });
            return <circle key={`o${i}`} cx={x} cy={y} r={r * p} fill={NOTE} stroke={GRAPHITE} strokeWidth={7} />;
          })}
          {CLOUD.map(([x, y, r], i) => {
            const p = interpolate(frame, [5 + i, 10 + i], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2.4)) });
            return <circle key={`i${i}`} cx={x} cy={y} r={Math.max(0, r * p - 7)} fill={NOTE} />;
          })}
          {/* pencil hatching inside the cloud */}
          {Array.from({ length: 7 }, (_, i) => (
            <path key={`h${i}`} d={`M ${640 + i * 36} ${400} l 36 -46`} stroke={GRAPHITE} strokeWidth={3} opacity={0.35 * text} />
          ))}
        </g>
        <text x={770} y={320} textAnchor="middle" fontFamily={S.pencil} fontSize={124} fill={GRAPHITE} transform={about(770, 290, "rotate(-4)")}>
          {dotsShown.join("")}
        </text>
      </svg>
    </AbsoluteFill>
  );
}

const DRIPS = [
  [250, 0.9, 150],
  [410, 1.0, 230],
  [540, 0.8, 120],
  [690, 1.1, 260],
  [850, 0.7, 170],
] as const;

/** "เหนียวหัว" in honey that drips, over a gloopy helmet doodle on his hair. */
export function GooWord() {
  const frame = useCurrentFrame();
  const helmet = interpolate(frame, [2, 12], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const word = interpolate(frame, [0, 6], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.6)) });
  const baseY = 1560;
  const wobble = Math.sin(frame / 2.5) * 0.02;

  return (
    <AbsoluteFill>
      <svg {...FRAME}>
        <defs>
          <BoilFilter id="s02-goo-boil" scale={5} />
        </defs>
        {/* helmet gloop sitting on the hair, drips creeping down */}
        <g filter="url(#s02-goo-boil)" opacity={helmet}>
          <g transform="translate(0 -360)">
          <path
            d={`M 250 ${1010} C 240 ${760 - 90 * helmet}, 460 ${600 - 60 * helmet}, 620 ${610 - 60 * helmet} C 800 ${615 - 60 * helmet}, 960 ${720}, 950 ${1010}
               C 900 ${1040}, 880 ${1040 + 90 * helmet}, 850 ${1040} C 800 ${1030}, 720 ${1050}, 700 ${1050 + 60 * helmet}
               C 690 ${1060 + 60 * helmet}, 660 ${1060}, 640 ${1040} C 560 ${1030}, 470 ${1050}, 440 ${1060 + 110 * helmet}
               C 430 ${1080 + 110 * helmet}, 400 ${1070}, 395 ${1045} C 330 ${1030}, 280 ${1040}, 250 ${1010} Z`}
            fill="rgba(230,169,46,0.55)"
            stroke={HONEY_DK}
            strokeWidth={9}
            strokeLinejoin="round"
          />
          <path d="M 360 820 C 400 730, 480 690, 560 680" stroke="rgba(255,255,255,0.85)" strokeWidth={16} strokeLinecap="round" fill="none" />
          </g>
        </g>
        {/* dripping word */}
        <g transform={about(540, baseY - 60, `scale(${word * (1 + wobble)} ${word * (1 - wobble)})`)}>
          {DRIPS.map(([x, speed, max], i) => {
            const len = Math.min(max, Math.max(0, (frame - 3) * 14 * speed));
            const r = 14 + len / 22;
            return (
              <g key={i}>
                <rect x={x - 11} y={baseY - 20} width={22} height={len + 20} rx={11} fill={HONEY} stroke={GRAPHITE} strokeWidth={6} />
                <circle cx={x} cy={baseY + len} r={r} fill={HONEY} stroke={GRAPHITE} strokeWidth={6} />
                <circle cx={x - r * 0.35} cy={baseY + len - r * 0.35} r={r * 0.25} fill="rgba(255,255,255,0.8)" />
              </g>
            );
          })}
          <text x={540} y={baseY} textAnchor="middle" fontFamily={S.goo} fontSize={150} fill={HONEY} stroke={GRAPHITE} strokeWidth={18} strokeLinejoin="round" style={{ paintOrder: "stroke" }}>
            เหนียวหัว
          </text>
          <text x={532} y={baseY - 8} textAnchor="middle" fontFamily={S.goo} fontSize={150} fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth={3}>
            เหนียวหัว
          </text>
        </g>
        <text x={780} y={250} textAnchor="middle" fontFamily={S.pencil} fontSize={66} fill={GRAPHITE} opacity={interpolate(frame, [4, 8], [0, 1], clamp)}>
          (ในหัวมึง)
        </text>
      </svg>
    </AbsoluteFill>
  );
}
