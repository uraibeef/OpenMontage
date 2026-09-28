import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { usePop } from "../hooks/kit";
import { clamp, P } from "./style";

/**
 * Beat 2 (2.81–4.31 s): the phone's lock screen laid over the top of the
 * morning shot — the minute ticks over, then a notification drops in.
 */

function SignalBars() {
  return (
    <svg width={46} height={30} viewBox="0 0 46 30">
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={i * 12} y={22 - i * 7} width={8} height={8 + i * 7} rx={2} fill="#fff" opacity={i === 3 ? 0.4 : 1} />
      ))}
    </svg>
  );
}

function Battery({ level }: { level: number }) {
  return (
    <svg width={62} height={30} viewBox="0 0 62 30">
      <rect x={2} y={2} width={52} height={26} rx={8} fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth={3} />
      <rect x={56} y={10} width={4} height={10} rx={2} fill="rgba(255,255,255,0.6)" />
      <rect x={6} y={6} width={44 * level} height={18} rx={5} fill="#fff" />
    </svg>
  );
}

function AlarmIcon() {
  return (
    <svg width={76} height={76} viewBox="0 0 76 76">
      <rect width={76} height={76} rx={18} fill="#FF8A1F" />
      <circle cx={38} cy={41} r={20} fill="none" stroke="#fff" strokeWidth={5} />
      <path d="M 38 30 L 38 42 L 46 47" stroke="#fff" strokeWidth={5} strokeLinecap="round" fill="none" />
      <path d="M 16 22 L 24 14 M 60 22 L 52 14" stroke="#fff" strokeWidth={5} strokeLinecap="round" />
    </svg>
  );
}

/** "07:11" rolls to "07:12": the last digit slides up like a counter. */
function Clock({ tickAt }: { tickAt: number }) {
  const frame = useCurrentFrame();
  const roll = interpolate(frame, [tickAt, tickAt + 6], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.6)) });
  const H = 210;
  const digit = { height: H, lineHeight: `${H}px`, display: "block" } as const;
  return (
    <div
      style={{
        fontFamily: P.ui,
        fontWeight: 600,
        fontSize: 210,
        color: "#fff",
        letterSpacing: -6,
        display: "flex",
        justifyContent: "center",
        textShadow: "0 4px 30px rgba(0,0,0,0.25)",
        lineHeight: `${H}px`,
      }}
    >
      <span>07:1</span>
      <span style={{ height: H, overflow: "hidden", display: "inline-block" }}>
        <span style={{ display: "block", transform: `translateY(${-roll * H}px)` }}>
          <span style={digit}>1</span>
          <span style={digit}>2</span>
        </span>
      </span>
    </div>
  );
}

export function HookLock({ noteAt }: { noteAt: number }) {
  const frame = useCurrentFrame();
  const wake = interpolate(frame, [0, 5], [0, 1], clamp);
  const drop = usePop(noteAt, 13);

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          inset: 0,
          height: 640,
          backdropFilter: "blur(14px) brightness(0.8)",
          background: "linear-gradient(180deg, rgba(20,26,44,0.5) 0%, rgba(20,26,44,0.25) 70%, rgba(20,26,44,0) 100%)",
          WebkitMaskImage: "linear-gradient(180deg, #000 72%, transparent 100%)",
          maskImage: "linear-gradient(180deg, #000 72%, transparent 100%)",
          opacity: wake,
        }}
      />
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, opacity: wake, color: "#fff", fontFamily: P.ui }}>
        <div style={{ display: "flex", alignItems: "center", padding: "34px 56px 0", fontSize: 30, fontWeight: 600 }}>
          <span style={{ flex: 1 }}>TRUE-H 5G</span>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <SignalBars />
            <span>23%</span>
            <Battery level={0.23} />
          </div>
        </div>
        <svg width={40} height={52} viewBox="0 0 40 52" style={{ display: "block", margin: "22px auto 0" }}>
          <path d="M 10 24 V 16 a 10 10 0 0 1 20 0 V 24" stroke="#fff" strokeWidth={4.5} fill="none" />
          <rect x={4} y={24} width={32} height={26} rx={6} fill="#fff" />
        </svg>
        <div style={{ textAlign: "center", fontSize: 40, fontWeight: 500, marginTop: 10, opacity: 0.92 }}>วันพุธที่ 12 มีนาคม</div>
        <Clock tickAt={3} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 44,
          right: 44,
          top: 436,
          transform: `translateY(${(1 - drop) * -150}px) scale(${0.9 + 0.1 * drop})`,
          opacity: Math.min(1, drop * 2),
          display: "flex",
          alignItems: "center",
          gap: 24,
          padding: "20px 28px",
          borderRadius: 40,
          background: "rgba(246,246,250,0.8)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 16px 40px rgba(0,0,0,0.25)",
          fontFamily: P.ui,
          color: "#15151A",
        }}
      >
        <AlarmIcon />
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", fontSize: 28, fontWeight: 500, opacity: 0.6 }}>
            <span style={{ flex: 1 }}>นาฬิกาปลุก</span>
            <span>ตอนนี้</span>
          </div>
          <div style={{ fontSize: 50, fontWeight: 700, lineHeight: 1.3 }}>เช้าวันถัดมา</div>
        </div>
      </div>
    </AbsoluteFill>
  );
}
