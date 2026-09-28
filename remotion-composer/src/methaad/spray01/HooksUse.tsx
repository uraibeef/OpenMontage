import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Mist } from "./Frame";
import { BRASS, clamp, CREAM, FOREST, LIFT, PINE, T } from "./style";

/**
 * Beats 3b-4 — "หอมแบบผู้ชาย" / "กดทีเดียว ฉีดก่อนจัดทรง แล้วค่อยเซ็ตตามใจ".
 * Scent wisps rise off an ink-printed portrait, one pump press fires a real
 * mist, a two-step order card lights up, and "ตามใจ" is signed by hand.
 */

/** Over the riso-printed man: "หอม" in heavy forest serif, scent wisps curling up. */
export function ManWisp() {
  const frame = useCurrentFrame();
  const word = interpolate(frame, [0, 8], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const sub = interpolate(frame, [7, 15], [0, 1], clamp);
  const wisp = (x: number, delay: number, amp: number) => {
    const p = interpolate(frame, [delay, delay + 22], [0, 1], clamp);
    const d = `M ${x} 640 C ${x + amp} 560, ${x - amp} 500, ${x} 430 S ${x + amp} 300, ${x - amp * 0.4} 200`;
    return <path key={x} d={d} fill="none" stroke={FOREST} strokeWidth={3} strokeLinecap="round" pathLength={1} strokeDasharray="0.45 1" strokeDashoffset={1 - p * 1.45} />;
  };
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        {wisp(820, 0, 40)}
        {wisp(890, 5, -34)}
        {wisp(955, 9, 28)}
      </svg>
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 150,
          fontFamily: T.mistUp,
          fontWeight: 700,
          fontSize: 230,
          lineHeight: "300px",
          color: FOREST,
          opacity: word,
          transform: `translateY(${(1 - word) * 60}px)`,
        }}
      >
        หอม
      </div>
      <div
        style={{
          position: "absolute",
          left: 100,
          top: 470,
          fontFamily: T.mistUp,
          fontWeight: 200,
          fontSize: 76,
          letterSpacing: interpolate(sub, [0, 1], [26, 8]),
          color: FOREST,
          opacity: sub,
          borderTop: `2px solid ${FOREST}`,
          paddingTop: 8,
        }}
      >
        แบบผู้ชาย
      </div>
    </AbsoluteFill>
  );
}

/** One press: a hairline pump presses once, "×1", and a real mist fires from the nozzle. */
export function PumpPress({ nozzleX = 310, nozzleY = 560 }: { nozzleX?: number; nozzleY?: number }) {
  const frame = useCurrentFrame();
  const press = interpolate(frame, [2, 5, 9], [0, 1, 0], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const word = interpolate(frame, [3, 10], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const ix = 860;
  const iy = 300;
  return (
    <AbsoluteFill>
      <Mist seed={7} count={110} x={nozzleX} y={nozzleY} angle={-0.3} spread={0.6} reach={720} from={4} life={20} color={PINE} />
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        <g fill="none" stroke={CREAM} strokeWidth={3} style={{ filter: "drop-shadow(0 0 6px rgba(10,24,14,0.7))" }}>
          <rect x={ix - 44} y={iy + 40} width={88} height={120} rx={10} />
          <g transform={`translate(0 ${press * 18})`}>
            <rect x={ix - 20} y={iy} width={40} height={34} rx={5} />
            <path d={`M ${ix + 20} ${iy + 12} L ${ix + 58} ${iy + 12}`} />
          </g>
          <path d={`M ${ix} ${iy - 80 + press * 24} L ${ix} ${iy - 24 + press * 24} M ${ix - 14} ${iy - 40 + press * 24} L ${ix} ${iy - 24 + press * 24} L ${ix + 14} ${iy - 40 + press * 24}`} />
        </g>
        <text x={ix} y={iy + 240} textAnchor="middle" fontFamily={T.didoneItalic} fontSize={80} fill={CREAM} opacity={word}>
          ×1
        </text>
      </svg>
      <div
        style={{
          position: "absolute",
          right: 70,
          top: 1180,
          textAlign: "right",
          fontFamily: T.thin,
          fontWeight: 300,
          fontSize: 150,
          lineHeight: "190px",
          color: FOREST,
          textShadow: "0 0 24px rgba(243,236,220,0.9)",
          opacity: word,
          clipPath: `inset(0 0 0 ${(1 - word) * 100}%)`,
        }}
      >
        กดทีเดียว
      </div>
    </AbsoluteFill>
  );
}

/** Two numbered steps; the arrow draws and step 02 lights on "จัดทรง". */
export function OrderSteps({ lightAt = 13 }: { lightAt?: number }) {
  const frame = useCurrentFrame();
  const a = interpolate(frame, [0, 6], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const arrow = interpolate(frame, [lightAt - 6, lightAt], [0, 1], clamp);
  const b = interpolate(frame, [lightAt, lightAt + 6], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const step = (x: number, n: string, th: string, on: number, lit: boolean) => (
    <div style={{ position: "absolute", left: x, top: 190, width: 400, opacity: 0.35 + on * 0.65 }}>
      <div style={{ fontFamily: T.latinItalic, fontWeight: 300, fontSize: 70, color: lit ? BRASS : CREAM, lineHeight: "80px" }}>{n}</div>
      <div
        style={{
          display: "inline-block",
          marginTop: 10,
          fontFamily: T.engraved,
          fontWeight: 600,
          fontSize: 92,
          lineHeight: "130px",
          padding: "0 30px",
          color: lit ? FOREST : CREAM,
          background: lit ? CREAM : "transparent",
          border: `2px solid ${CREAM}`,
          transform: `scale(${0.9 + on * 0.1})`,
          transformOrigin: "left center",
        }}
      >
        {th}
      </div>
    </div>
  );
  return (
    <AbsoluteFill style={{ textShadow: LIFT }}>
      {step(90, "01", "ฉีดก่อน", a, frame < lightAt)}
      {step(590, "02", "จัดทรง", b, frame >= lightAt)}
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        <path
          d="M 470 395 L 560 395 M 540 380 L 560 395 L 540 410"
          fill="none"
          stroke={CREAM}
          strokeWidth={3}
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - arrow}
        />
      </svg>
    </AbsoluteFill>
  );
}

/** "ตามใจ" signed by hand, left to right, finished with a drawn swash. */
export function SignedFree() {
  const frame = useCurrentFrame();
  const pre = interpolate(frame, [0, 6], [0, 1], clamp);
  const sign = interpolate(frame, [4, 20], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const swash = interpolate(frame, [16, 26], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 110,
          top: 130,
          fontFamily: T.script,
          fontWeight: 400,
          fontSize: 70,
          color: CREAM,
          opacity: pre,
          textShadow: LIFT,
        }}
      >
        แล้วค่อยเซ็ต
      </div>
      <div
        style={{
          position: "absolute",
          left: 160,
          top: 250,
          fontFamily: T.script,
          fontWeight: 700,
          fontSize: 230,
          lineHeight: "320px",
          color: CREAM,
          textShadow: LIFT,
          clipPath: `inset(-20% ${(1 - sign) * 100}% -20% 0)`,
          transform: "rotate(-4deg)",
        }}
      >
        ตามใจ
      </div>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        <path
          d="M 180 600 C 360 640, 620 580, 820 540 C 900 526, 960 540, 930 570 C 905 595, 860 570, 900 545"
          fill="none"
          stroke={BRASS}
          strokeWidth={5}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - swash}
          style={{ filter: `drop-shadow(0 0 4px ${PINE})` }}
        />
      </svg>
    </AbsoluteFill>
  );
}
