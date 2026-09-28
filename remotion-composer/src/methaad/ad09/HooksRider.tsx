import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { graphemes, usePop } from "../hooks/kit";
import { clamp, CLASS, G, GOLD, HOT, NAVY, WHITE } from "./style";

/**
 * Class 2 "สายซิ่ง" (6.62–9.59 s).
 * EquipSlot: the helmet snaps into the HEAD equipment slot (flat side-view icon).
 * HelmetOff: a glossy front-view helmet lifts off his head and flies out of frame.
 * CritDamage: RPG damage numbers — "100%" crit over a flattened head.
 */

const C = CLASS.rider;

function HelmetIcon() {
  return (
    <svg width={190} height={170} viewBox="0 0 190 170">
      <path d="M 20 118 C 14 50 70 16 118 22 C 160 28 180 70 176 118 Z" fill={C.main} stroke={NAVY} strokeWidth={8} strokeLinejoin="round" />
      <path d="M 104 62 L 178 70 L 176 104 L 110 100 Z" fill={NAVY} />
      <path d="M 40 60 C 60 36 90 30 110 32" fill="none" stroke={WHITE} strokeWidth={8} strokeLinecap="round" opacity={0.8} />
      <rect x={16} y={116} width={164} height={20} rx={8} fill={NAVY} />
    </svg>
  );
}

export function EquipSlot() {
  const frame = useCurrentFrame();
  const panel = interpolate(frame, [0, 5], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const drop = usePop(5, 10);
  const locked = frame > 13;
  const label = graphemes("หมวกกันน็อก");
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 60, top: 1330, width: 960, height: 330, transform: `scaleX(${panel})`, transformOrigin: "left", background: "rgba(0,28,36,0.88)", border: `6px solid ${C.main}`, borderRadius: 8 }}>
        <div style={{ position: "absolute", left: 30, top: 18, fontFamily: G.hud, fontWeight: 700, fontSize: 38, letterSpacing: 8, color: C.main }}>
          EQUIP / ศีรษะ
        </div>
        <div style={{ position: "absolute", left: 30, top: 76, width: 230, height: 220, border: `6px solid ${locked ? GOLD : WHITE}`, background: "#062A33", boxShadow: locked ? `0 0 40px ${GOLD}` : "none", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
          <div style={{ transform: `translateY(${(1 - drop) * -260}px) rotate(${(1 - drop) * -30}deg)` }}>
            <HelmetIcon />
          </div>
        </div>
        <div style={{ position: "absolute", left: 300, top: 110, fontFamily: G.hud, fontWeight: 700, fontSize: 104, color: WHITE, lineHeight: 1.2, whiteSpace: "nowrap" }}>
          {label.map((g, i) => (
            <span key={i} style={{ opacity: frame > 7 + i ? 1 : 0, color: frame > 7 + i && frame < 10 + i ? C.main : WHITE }}>
              {g}
            </span>
          ))}
        </div>
        {locked ? (
          <div style={{ position: "absolute", left: 300, top: 250, fontFamily: G.hud, fontWeight: 500, fontSize: 34, color: GOLD }}>ใส่ทุกวัน · DEF +5</div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
}

/** Head in g03 sits at x≈600, crown y≈80, brow y≈520. */
const HX = 600;
const HY = 250;

export function HelmetOff({ liftAt }: { liftAt: number }) {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [liftAt, liftAt + 12], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const y = HY - t * 1100;
  const rot = t * -28;
  const wobble = frame < liftAt ? Math.sin(frame * 2.2) * 4 : 0;
  const prompt = usePop(0, 12);
  const pressed = frame >= liftAt && frame < liftAt + 4;
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <defs>
          <linearGradient id="r9-shell" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#8EF3FF" />
            <stop offset="0.45" stopColor={C.main} />
            <stop offset="1" stopColor="#006070" />
          </linearGradient>
        </defs>
        {t > 0.05 && t < 1 ? (
          <g opacity={0.5}>
            {[-160, -60, 60, 160].map((dx) => (
              <line key={dx} x1={HX + dx} y1={y + 330} x2={HX + dx} y2={y + 330 + 260 * t} stroke={WHITE} strokeWidth={10} strokeLinecap="round" />
            ))}
          </g>
        ) : null}
        <g transform={`translate(${HX + wobble} ${y}) rotate(${rot})`}>
          <path d="M -300 190 C -320 -120 -160 -300 0 -300 C 160 -300 320 -120 300 190 L 250 250 L -250 250 Z" fill="url(#r9-shell)" stroke={NAVY} strokeWidth={14} strokeLinejoin="round" />
          <path d="M -40 -296 L 40 -296 L 30 240 L -30 240 Z" fill={WHITE} opacity={0.9} />
          <path d="M -210 -170 C -150 -250 -80 -270 -40 -272" fill="none" stroke={WHITE} strokeWidth={22} strokeLinecap="round" opacity={0.7} />
          <path d="M -270 150 L 270 150 L 250 250 L -250 250 Z" fill={NAVY} />
          <path d="M -250 250 C -250 330 -200 360 -170 360 M 250 250 C 250 330 200 360 170 360" fill="none" stroke={NAVY} strokeWidth={12} />
        </g>
      </svg>
      <div style={{ position: "absolute", left: 70, top: 1540, display: "flex", alignItems: "center", gap: 26, transform: `scale(${prompt})`, transformOrigin: "left center" }}>
        <div style={{ width: 130, height: 130, borderRadius: 65, background: pressed ? GOLD : NAVY, border: `8px solid ${WHITE}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: G.hud, fontWeight: 700, fontSize: 80, color: pressed ? NAVY : GOLD, transform: `translateY(${pressed ? 8 : 0}px)` }}>
          B
        </div>
        <div style={{ fontFamily: G.hud, fontWeight: 700, fontSize: 96, color: WHITE, textShadow: `6px 6px 0 ${NAVY}` }}>ถอดหมวก</div>
      </div>
    </AbsoluteFill>
  );
}

export function CritDamage() {
  const frame = useCurrentFrame();
  const hit = usePop(0, 8);
  const rise = interpolate(frame, [4, 30], [0, -90], clamp);
  const num = Math.round(interpolate(frame, [0, 7], [0, 100], clamp));
  const shake = frame < 8 ? Math.sin(frame * 4) * 14 : 0;
  const tag = usePop(6, 12);
  return (
    <AbsoluteFill style={{ transform: `translateX(${shake}px)` }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1040 + rise, textAlign: "center", transform: `scale(${interpolate(hit, [0, 1], [3, 1])}) rotate(-6deg)`, opacity: Math.min(1, hit * 2) }}>
        <div style={{ fontFamily: G.hud, fontWeight: 700, fontSize: 64, letterSpacing: 12, color: GOLD, textShadow: `4px 4px 0 ${NAVY}` }}>CRITICAL!</div>
        <div style={{ fontFamily: G.title, fontWeight: 900, fontStyle: "italic", fontSize: 300, lineHeight: 1, color: HOT, WebkitTextStroke: `14px ${WHITE}`, paintOrder: "stroke fill", textShadow: `12px 14px 0 ${NAVY}` }}>
          {`${num}%`}
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1500, display: "flex", justifyContent: "center", opacity: tag, transform: `translateY(${(1 - tag) * 60}px)` }}>
        <div style={{ background: WHITE, color: NAVY, fontFamily: G.hud, fontWeight: 700, fontSize: 70, padding: "6px 36px", borderLeft: `18px solid ${HOT}`, whiteSpace: "nowrap" }}>
          หัวแบนหลังถอดหมวก
        </div>
      </div>
    </AbsoluteFill>
  );
}
