import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { usePop } from "../hooks/kit";
import { clamp, INK, P, PAPER, PEN_BLUE, STAMP_RED } from "./style";

/**
 * Beat 1 (0–2.81 s): a "POV" label, then the barbershop's thermal receipt
 * printing up into frame. "จ่ายแล้ว" is rubber-stamped onto it on the VO cue.
 */

const W = 560;

function PovTag() {
  const pop = usePop(1, 12);
  const frame = useCurrentFrame();
  const blink = Math.floor(frame / 8) % 2 === 0 ? 1 : 0.25;
  return (
    <div
      style={{
        position: "absolute",
        left: 56,
        top: 96,
        display: "flex",
        alignItems: "center",
        gap: 18,
        padding: "10px 30px 14px 24px",
        borderRadius: 20,
        background: "rgba(14,14,18,0.78)",
        transform: `scale(${pop})`,
        transformOrigin: "left center",
        boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
      }}
    >
      <div style={{ width: 20, height: 20, borderRadius: 10, background: "#FF3B30", opacity: blink }} />
      <span style={{ fontFamily: P.ui, fontWeight: 700, fontSize: 64, color: "#fff", letterSpacing: 4, lineHeight: 1 }}>
        POV
      </span>
    </div>
  );
}

/** A row that "prints" in: revealed by a hard wipe from the top. */
function PrintRow({ at, children, style }: { at: number; children: React.ReactNode; style?: React.CSSProperties }) {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 3], [0, 100], clamp);
  return <div style={{ clipPath: `inset(0 0 ${100 - p}% 0)`, ...style }}>{children}</div>;
}

function Dashes() {
  return <div style={{ borderTop: `4px dashed rgba(23,23,27,0.55)`, margin: "18px 0" }} />;
}

function BarberPole() {
  return (
    <svg width={44} height={92} viewBox="0 0 44 92">
      <defs>
        <clipPath id="r4-pole">
          <rect x={8} y={14} width={28} height={64} rx={6} />
        </clipPath>
      </defs>
      <rect x={4} y={2} width={36} height={14} rx={6} fill={INK} />
      <rect x={4} y={76} width={36} height={14} rx={6} fill={INK} />
      <g clipPath="url(#r4-pole)">
        <rect x={8} y={14} width={28} height={64} fill="#fff" />
        {[0, 1, 2, 3, 4].map((i) => (
          <path key={i} d={`M 0 ${4 + i * 20} L 44 ${-16 + i * 20} L 44 ${-6 + i * 20} L 0 ${14 + i * 20} Z`} fill={i % 2 ? PEN_BLUE : STAMP_RED} />
        ))}
      </g>
      <rect x={8} y={14} width={28} height={64} rx={6} fill="none" stroke={INK} strokeWidth={4} />
    </svg>
  );
}

function PaidStamp({ at }: { at: number }) {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const t = interpolate(frame, [at, at + 4], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const scale = interpolate(t, [0, 1], [2.3, 1]);
  return (
    <svg
      width={430}
      height={200}
      viewBox="0 0 430 200"
      style={{
        position: "absolute",
        left: 50,
        top: 330,
        transform: `rotate(-13deg) scale(${scale})`,
        opacity: interpolate(t, [0, 0.4, 1], [0, 0.7, 0.95]),
      }}
    >
      <defs>
        <filter id="r4-paid-ink" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves={3} seed={11} result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -3 2.9" result="pits" />
          <feComposite in="SourceGraphic" in2="pits" operator="in" />
        </filter>
      </defs>
      <g filter="url(#r4-paid-ink)" fill="none" stroke={STAMP_RED}>
        <rect x={10} y={10} width={410} height={180} rx={26} strokeWidth={12} fill="rgba(251,247,238,0.88)" />
        <rect x={30} y={30} width={370} height={140} rx={14} strokeWidth={4} />
        <text x={215} y={120} textAnchor="middle" fontFamily={P.sticker} fontWeight={900} fontSize={80} fill={STAMP_RED} stroke="none">
          จ่ายแล้ว
        </text>
        <text x={215} y={160} textAnchor="middle" fontFamily={P.print} fontWeight={700} fontSize={22} letterSpacing={6} fill={STAMP_RED} stroke="none">
          PAID · 300.-
        </text>
      </g>
    </svg>
  );
}

export function HookReceipt({ stampAt }: { stampAt: number }) {
  const frame = useCurrentFrame();
  const rise = interpolate(frame, [4, 16], [760, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const hit = interpolate(frame, [stampAt + 3, stampAt + 5, stampAt + 10], [0, 1, 0], clamp);
  const drift = interpolate(frame, [16, 84], [0, -22], clamp);

  return (
    <AbsoluteFill>
      <PovTag />
      <div
        style={{
          position: "absolute",
          left: 440,
          top: 1110,
          width: W,
          transform: `translate(${hit * 5}px, ${rise + drift + hit * 10}px) rotate(${-4 + hit * 0.8}deg)`,
          filter: "drop-shadow(0 22px 26px rgba(0,0,0,0.45))",
        }}
      >
        <div
          style={{
            position: "relative",
            background: `linear-gradient(180deg, ${PAPER} 0%, #F1EBDD 100%)`,
            padding: "70px 44px 60px",
            color: INK,
            clipPath:
              "polygon(0 14px, 5% 0, 10% 14px, 15% 0, 20% 14px, 25% 0, 30% 14px, 35% 0, 40% 14px, 45% 0, 50% 14px, 55% 0, 60% 14px, 65% 0, 70% 14px, 75% 0, 80% 14px, 85% 0, 90% 14px, 95% 0, 100% 14px, 100% 100%, 0 100%)",
            WebkitMaskImage: "radial-gradient(circle at 50% 44px, transparent 15px, #000 16px)",
            maskImage: "radial-gradient(circle at 50% 44px, transparent 15px, #000 16px)",
          }}
        >
          <PrintRow at={6} style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <BarberPole />
            <div>
              <div style={{ fontFamily: P.shop, fontWeight: 700, fontSize: 46, lineHeight: 1.3 }}>ร้านตัดผมช่างเอ็ม</div>
              <div style={{ fontFamily: P.print, fontWeight: 500, fontSize: 24, opacity: 0.7 }}>ใบเสร็จ #0412 · 18:40 น.</div>
            </div>
          </PrintRow>
          <PrintRow at={9}>
            <Dashes />
          </PrintRow>
          <PrintRow at={11} style={{ display: "flex", alignItems: "baseline", fontFamily: P.print, fontWeight: 700, fontSize: 42 }}>
            <span>ตัด + เซ็ต</span>
            <span style={{ flex: 1, borderBottom: "5px dotted rgba(23,23,27,0.6)", margin: "0 12px 8px" }} />
            <span>300.-</span>
          </PrintRow>
          <PrintRow at={13} style={{ display: "flex", fontFamily: P.print, fontWeight: 500, fontSize: 28, opacity: 0.65, marginTop: 6 }}>
            <span style={{ flex: 1 }}>ผ้าคลุม / สระ</span>
            <span>0.-</span>
          </PrintRow>
          <PrintRow at={15}>
            <Dashes />
          </PrintRow>
          <PrintRow at={17} style={{ display: "flex", fontFamily: P.print, fontWeight: 700, fontSize: 52 }}>
            <span style={{ flex: 1 }}>รวม</span>
            <span>300.-</span>
          </PrintRow>
          <PrintRow at={19} style={{ display: "flex", gap: 4, height: 54, marginTop: 26, alignItems: "stretch" }}>
            {Array.from({ length: 38 }, (_, i) => (
              <div key={i} style={{ width: [3, 6, 2, 8, 4][(i * 7) % 5], background: INK, opacity: i % 6 === 5 ? 0 : 1 }} />
            ))}
          </PrintRow>
          <PaidStamp at={stampAt} />
        </div>
      </div>
    </AbsoluteFill>
  );
}
