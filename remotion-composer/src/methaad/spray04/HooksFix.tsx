import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { graphemes } from "../hooks/kit";
import { about, CAM, CEDAR, clamp, FRAME, INK, LEAF, LIFT, S, WHITE } from "./style";

/**
 * Beat 4 — "ลองสเปรย์เพิ่มวอลลุ่ม ฉีดก่อนจัดทรง ผมตั้งจากโคน".
 * The fix arrives as a PORTRAIT-mode upgrade (aperture iris opens, depth
 * blur on the edges), then a two-step order chip, then the camera's level
 * guide at the roots with the word rising off it.
 */

/** Aperture iris opens, "PORTRAIT" badge, "สเปรย์เพิ่มวอลลุ่ม" slides in on a lens-blur edge. */
export function PortraitUpgrade() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const iris = interpolate(frame, [0, 9], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const badge = spring({ frame: frame - 6, fps, config: { damping: 10, stiffness: 200, mass: 0.6 } });
  const words = graphemes("สเปรย์เพิ่มวอลลุ่ม");
  const blades = 7;

  return (
    <AbsoluteFill>
      {/* depth-of-field: soft blur ring around the subject, no darkening */}
      <AbsoluteFill
        style={{
          backdropFilter: `blur(${10 * iris}px)`,
          WebkitMaskImage: "radial-gradient(ellipse 46% 36% at 50% 44%, transparent 62%, black 100%)",
          maskImage: "radial-gradient(ellipse 46% 36% at 50% 44%, transparent 62%, black 100%)",
        }}
      />
      <svg {...FRAME}>
        {/* iris blades opening outward from the centre */}
        {iris < 1
          ? Array.from({ length: blades }, (_, i) => {
              const a = (i / blades) * 360 + iris * 60;
              const r = 200 + iris * 1100;
              return (
                <g key={i} transform={`translate(540 860) rotate(${a})`}>
                  <path d={`M ${r * 0.2} ${-r} L ${r * 1.6} ${-r * 0.3} L ${r * 1.2} ${r * 0.9} L ${r * 0.05} ${-r * 0.1} Z`} fill={INK} stroke={CAM} strokeWidth={4} opacity={1 - iris * 0.6} />
                </g>
              );
            })
          : null}
        <g transform={about(540, 250, `scale(${Math.max(0, badge)})`)}>
          <rect x={330} y={196} width={420} height={96} rx={48} fill={CAM} />
          <circle cx={392} cy={244} r={24} fill="none" stroke={INK} strokeWidth={6} />
          <circle cx={392} cy={244} r={9} fill={INK} />
          <text x={574} y={262} textAnchor="middle" fontFamily={S.ui} fontWeight={700} fontSize={48} fill={INK} letterSpacing={4}>
            PORTRAIT
          </text>
        </g>
      </svg>
      <div style={{ position: "absolute", top: 1440, width: "100%", textAlign: "center", fontFamily: S.portrait, fontWeight: 700, fontSize: 64, color: WHITE, textShadow: LIFT, opacity: interpolate(frame, [8, 12], [0, 1], clamp) }}>
        ลองนี่
      </div>
      <div style={{ position: "absolute", top: 1520, width: "100%", textAlign: "center", fontFamily: S.portrait, fontWeight: 700, fontSize: 116, lineHeight: "170px", whiteSpace: "nowrap" }}>
        {words.map((ch, i) => {
          const t = interpolate(frame, [10 + i * 0.8, 16 + i * 0.8], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
          return (
            <span key={i} style={{ display: "inline-block", opacity: t, filter: `blur(${(1 - t) * 14}px)`, transform: `translateX(${(1 - t) * 60}px)`, color: WHITE, WebkitTextStroke: `10px ${CEDAR}`, paintOrder: "stroke fill" }}>
              {ch}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}

/** Two-step order chip: "1 ฉีด" lights first, an arrow runs, then "2 จัดทรง". */
export function OrderSteps() {
  const frame = useCurrentFrame();
  const inA = interpolate(frame, [0, 5], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.8)) });
  const run = interpolate(frame, [7, 13], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const inB = interpolate(frame, [12, 17], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.8)) });
  const y = 1580;

  const chip = (x: number, n: string, word: string, on: number, lit: boolean) => (
    <g transform={about(x + 180, y + 80, `scale(${on})`)}>
      <rect x={x} y={y} width={360} height={160} rx={30} fill={lit ? LEAF : "rgba(11,11,12,0.8)"} stroke={lit ? INK : WHITE} strokeWidth={6} />
      <circle cx={x + 70} cy={y + 80} r={44} fill={lit ? INK : WHITE} />
      <text x={x + 70} y={y + 102} textAnchor="middle" fontFamily={S.step} fontWeight={700} fontSize={62} fill={lit ? LEAF : INK}>
        {n}
      </text>
      <text x={x + 230} y={y + 106} textAnchor="middle" fontFamily={S.step} fontWeight={700} fontSize={80} fill={lit ? INK : WHITE}>
        {word}
      </text>
    </g>
  );

  return (
    <AbsoluteFill>
      <svg {...FRAME}>
        <text x={540} y={1550} textAnchor="middle" fontFamily={S.step} fontWeight={700} fontSize={48} fill={CAM} stroke={INK} strokeWidth={8} style={{ paintOrder: "stroke" }} opacity={run}>
          ก่อน
        </text>
        {chip(60, "1", "ฉีด", inA, frame < 13)}
        <path d={`M 440 ${y + 80} H ${440 + 180 * run}`} stroke={CAM} strokeWidth={14} strokeLinecap="round" />
        <path d={`M ${440 + 180 * run - 26} ${y + 56} l 26 24 l -26 24`} stroke={CAM} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={run} />
        {chip(660, "2", "จัดทรง", inB, frame >= 13)}
      </svg>
    </AbsoluteFill>
  );
}

const LEVEL_Y = 800;

/** Camera level guide snaps onto the roots; "ตั้งจากโคน" rises letter by letter off it. */
export function RootLevel() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const line = interpolate(frame, [0, 6], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const g = graphemes("ตั้งจากโคน");
  const deg = interpolate(frame, [0, 10], [-8, 0], { ...clamp, easing: Easing.out(Easing.back(2)) });

  return (
    <AbsoluteFill>
      <svg {...FRAME}>
        <g transform={about(540, LEVEL_Y, `rotate(${deg})`)}>
          <path d={`M ${540 - 470 * line} ${LEVEL_Y} H ${540 - 60}`} stroke={CAM} strokeWidth={6} />
          <path d={`M ${540 + 60} ${LEVEL_Y} H ${540 + 470 * line}`} stroke={CAM} strokeWidth={6} />
          <path d={`M 480 ${LEVEL_Y} H 600`} stroke={frame >= 10 ? CAM : WHITE} strokeWidth={10} strokeLinecap="round" />
          <text x={80} y={LEVEL_Y - 18} fontFamily={S.ui} fontWeight={700} fontSize={30} fill={CAM} opacity={line}>
            ROOT 0°
          </text>
        </g>
        {[250, 420, 660, 830].map((x, i) => {
          const p = interpolate(frame, [6 + i * 2, 16 + i * 2], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
          const top = LEVEL_Y - 60 - 330 * p;
          return (
            <g key={x} opacity={p > 0 ? 1 : 0}>
              <path d={`M ${x} ${LEVEL_Y - 20} V ${top}`} stroke={WHITE} strokeWidth={8} strokeLinecap="round" />
              <path d={`M ${x - 26} ${top + 30} L ${x} ${top} L ${x + 26} ${top + 30}`} stroke={WHITE} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </g>
          );
        })}
      </svg>
      <div style={{ position: "absolute", top: 1420, width: "100%", textAlign: "center", fontFamily: S.root, fontWeight: 900, fontSize: 190, lineHeight: "260px", whiteSpace: "nowrap" }}>
        {g.map((ch, i) => {
          const s = spring({ frame: frame - 4 - i * 1.5, fps, config: { damping: 9, stiffness: 180, mass: 0.6 } });
          return (
            <span key={i} style={{ display: "inline-block", transform: `translateY(${(1 - s) * 180}px) scaleY(${0.4 + 0.6 * Math.max(0, s)})`, transformOrigin: "50% 100%", opacity: s > 0.02 ? 1 : 0, color: CAM, WebkitTextStroke: `14px ${INK}`, paintOrder: "stroke fill" }}>
              {ch}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}
