import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { usePop } from "../hooks/kit";
import { clamp, CLASS, G, HOT, NAVY, WHITE } from "./style";

/**
 * Class 3 "สายเส้นเล็ก" (10.49–12.55 s).
 * HairScan: a target-lock reticle locks onto the hair and
 * the readout "ผมเส้นเล็ก" pops above it with a hairline-thin gauge.
 * VolumeRadar: the class's hexagon stat chart — the ความพอง axis caves in and
 * the status "หัวลีบง่าย" stamps below.
 */

const C = CLASS.fine;

/** Hair mass in g04 sits around (540, 640). */
const TX = 540;
const TY = 640;

export function HairScan() {
  const frame = useCurrentFrame();
  const lock = interpolate(frame, [0, 9], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const r = interpolate(lock, [0, 1], [420, 230]);
  const spin = (1 - lock) * 120 + frame * 1.5;
  const label = usePop(5, 12);
  const sweep = (frame * 22) % 460;
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <g transform={`translate(${TX} ${TY}) rotate(${spin})`}>
          <circle r={r} fill="none" stroke={C.main} strokeWidth={8} strokeDasharray="60 28" />
          <circle r={r - 40} fill="none" stroke={WHITE} strokeWidth={3} opacity={0.7} />
          {[0, 90, 180, 270].map((a) => (
            <line key={a} x1={0} y1={-r - 40} x2={0} y2={-r + 30} stroke={WHITE} strokeWidth={8} transform={`rotate(${a})`} />
          ))}
        </g>
        {lock > 0.95 ? <rect x={TX - 200} y={TY - 230 + sweep} width={400} height={6} fill={C.main} opacity={0.6} /> : null}
      </svg>
      <div style={{ position: "absolute", left: 90, top: 70, transform: `scale(${label})`, transformOrigin: "left top", background: "rgba(22,0,40,0.86)", border: `5px solid ${C.main}`, padding: "18px 34px 26px" }}>
        <div style={{ fontFamily: G.hud, fontWeight: 500, fontSize: 36, letterSpacing: 8, color: C.main }}>SCAN · เส้นผม</div>
        <div style={{ fontFamily: G.hud, fontWeight: 700, fontSize: 110, lineHeight: 1.15, color: WHITE }}>ผมเส้นเล็ก</div>
        <svg width={560} height={60}>
          <line x1={0} y1={14} x2={560} y2={14} stroke={WHITE} strokeWidth={22} opacity={0.25} />
          <line x1={0} y1={46} x2={560 * Math.min(1, label)} y2={46} stroke={C.main} strokeWidth={3} />
        </svg>
      </div>
    </AbsoluteFill>
  );
}

const AXES = ["ความพอง", "ทรงอยู่", "หนา", "จัดง่าย", "ยืด", "เงา"];
const R0 = 230;
const CXR = 540;
const CYR = 1440;

function hexPoints(vals: number[]) {
  return vals
    .map((v, i) => {
      const a = (-90 + i * 60) * (Math.PI / 180);
      return `${CXR + Math.cos(a) * R0 * v},${CYR + Math.sin(a) * R0 * v}`;
    })
    .join(" ");
}

export function VolumeRadar() {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [0, 7], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const cave = interpolate(frame, [10, 16], [0.85, 0.12], { ...clamp, easing: Easing.in(Easing.quad) });
  const vals = [cave, 0.55, 0.3, 0.6, 0.5, 0.45].map((v) => v * draw);
  const stamp = usePop(15, 9);
  const hurt = frame > 15 && frame < 24 && Math.floor(frame / 2) % 2 === 0;
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <polygon points={hexPoints([1.25, 1.25, 1.25, 1.25, 1.25, 1.25])} fill="rgba(22,0,40,0.82)" />
        {[1, 0.66, 0.33].map((s) => (
          <polygon key={s} points={hexPoints(Array(6).fill(s))} fill="none" stroke={WHITE} strokeWidth={2} opacity={0.35} />
        ))}
        <polygon points={hexPoints(vals)} fill={C.main} fillOpacity={0.55} stroke={hurt ? HOT : C.main} strokeWidth={6} strokeLinejoin="round" />
        {AXES.map((a, i) => {
          const ang = (-90 + i * 60) * (Math.PI / 180);
          const x = CXR + Math.cos(ang) * (R0 + 58);
          const y = CYR + Math.sin(ang) * (R0 + 58) + 14;
          const key = i === 0;
          return (
            <text key={a} x={x} y={y} textAnchor="middle" fontFamily={G.hud} fontWeight={700} fontSize={key ? 46 : 32} fill={key ? (hurt ? HOT : WHITE) : WHITE} opacity={key ? 1 : 0.7}>
              {a}
            </text>
          );
        })}
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1690, display: "flex", justifyContent: "center" }}>
        <div style={{ transform: `scale(${interpolate(stamp, [0, 1], [2.2, 1])}) rotate(-3deg)`, opacity: Math.min(1, stamp * 3), background: HOT, color: WHITE, fontFamily: G.hud, fontWeight: 700, fontSize: 100, lineHeight: 1.2, padding: "0 40px", border: `7px solid ${NAVY}`, boxShadow: `10px 10px 0 ${NAVY}` }}>
          หัวลีบง่าย
        </div>
      </div>
    </AbsoluteFill>
  );
}
