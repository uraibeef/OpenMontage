import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { about, BRASS, clamp, CREAM, FOREST, LIFT, PINE, T } from "./style";

/**
 * Beats 2-3a — "ขนาดร้อยมิล ถือมือเดียวสบาย" / "เปิดฝามา".
 * A jeweller's spec callout rings the real 100ml print, a technical
 * dimension line measures the bottle in one hand, a line-drawn pump cap
 * lifts off.
 */

/** Ring the printed "100ml", run a leader line up to a spec card that counts to 100. */
export function SpecCallout({ ringX = 520, ringY = 1545 }: { ringX?: number; ringY?: number }) {
  const frame = useCurrentFrame();
  const ring = interpolate(frame, [0, 8], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const lead = interpolate(frame, [6, 13], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const card = interpolate(frame, [10, 17], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const n = Math.round(interpolate(frame, [11, 21], [0, 100], { ...clamp, easing: Easing.out(Easing.quad) }));
  const r = 150;
  const circ = 2 * Math.PI * r;
  const pts = [
    [ringX + r * 0.7, ringY - r * 0.7],
    [760, 1140],
    [1000, 1140],
  ];
  const segLen = Math.hypot(pts[1][0] - pts[0][0], pts[1][1] - pts[0][1]) + 240;
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        <circle
          cx={ringX}
          cy={ringY}
          r={r}
          fill="none"
          stroke={CREAM}
          strokeWidth={3}
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - ring)}
          transform={`rotate(-45 ${ringX} ${ringY})`}
        />
        <circle cx={ringX} cy={ringY} r={r + 14} fill="none" stroke={CREAM} strokeWidth={1} opacity={ring * 0.7} strokeDasharray="4 10" />
        <polyline
          points={pts.map((p) => p.join(",")).join(" ")}
          fill="none"
          stroke={CREAM}
          strokeWidth={2}
          strokeDasharray={segLen}
          strokeDashoffset={segLen * (1 - lead)}
        />
        <circle cx={pts[2][0]} cy={pts[2][1]} r={7} fill={BRASS} opacity={lead >= 1 ? 1 : 0} />
      </svg>
      <div
        style={{
          position: "absolute",
          left: 500,
          top: 560,
          width: 510,
          height: 560,
          background: `${FOREST}E0`,
          border: `1.5px solid ${CREAM}`,
          outline: `1px solid ${CREAM}66`,
          outlineOffset: 10,
          opacity: card,
          transform: `translateY(${(1 - card) * 30}px)`,
          color: CREAM,
          boxSizing: "border-box",
          padding: "34px 40px",
        }}
      >
        <div style={{ fontFamily: T.latin, fontWeight: 500, fontSize: 24, letterSpacing: 9 }}>VOLUME · SIZE</div>
        <div style={{ height: 1, background: `${CREAM}88`, margin: "18px 0 0" }} />
        <div style={{ display: "flex", alignItems: "baseline", marginTop: 6 }}>
          <span style={{ fontFamily: T.didone, fontWeight: 400, fontSize: 250, lineHeight: "280px", letterSpacing: -6 }}>{n}</span>
          <span style={{ fontFamily: T.latinItalic, fontWeight: 300, fontSize: 96, marginLeft: 14 }}>ml</span>
        </div>
        <div style={{ fontFamily: T.spec, fontWeight: 300, fontSize: 60, letterSpacing: 3, marginTop: 4 }}>ขนาดร้อยมิล</div>
      </div>
    </AbsoluteFill>
  );
}

/** A technical dimension line measures the bottle; "ถือมือเดียว" on a cream capsule. */
export function HandSpan() {
  const frame = useCurrentFrame();
  const grow = interpolate(frame, [0, 12], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const pill = interpolate(frame, [4, 12], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.6)) });
  const easy = interpolate(frame, [14, 22], [0, 1], clamp);
  const x = 120;
  const y0 = 1640;
  const y1 = 700;
  const y = y0 - (y0 - y1) * grow;
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        <g stroke={CREAM} strokeWidth={2.5} fill="none" style={{ filter: "drop-shadow(0 0 6px rgba(10,24,14,0.6))" }}>
          <line x1={x - 26} y1={y0} x2={x + 26} y2={y0} />
          <line x1={x} y1={y0} x2={x} y2={y} />
          <path d={`M ${x - 14} ${y + 22} L ${x} ${y} L ${x + 14} ${y + 22}`} />
          {grow >= 1 ? <line x1={x - 26} y1={y1} x2={x + 26} y2={y1} /> : null}
          {Array.from({ length: 12 }, (_, i) => {
            const ty = y0 - ((y0 - y1) / 12) * (i + 0.5);
            return ty > y ? <line key={i} x1={x} y1={ty} x2={x + (i % 3 === 1 ? 20 : 10)} y2={ty} strokeWidth={1.5} /> : null;
          })}
        </g>
        <text
          x={x - 30}
          y={(y0 + y1) / 2}
          transform={`rotate(-90 ${x - 30} ${(y0 + y1) / 2})`}
          textAnchor="middle"
          fontFamily={T.latinItalic}
          fontSize={34}
          fill={CREAM}
          opacity={grow}
          letterSpacing={3}
        >
          one hand
        </text>
      </svg>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 250,
          textAlign: "center",
          transform: `scale(${pill})`,
        }}
      >
        <span
          style={{
            display: "inline-block",
            background: CREAM,
            color: FOREST,
            fontFamily: T.dim,
            fontWeight: 500,
            fontSize: 96,
            lineHeight: "150px",
            padding: "0 64px",
            borderRadius: 999,
            boxShadow: `0 0 0 3px ${FOREST}, 0 0 0 5px ${CREAM}`,
          }}
        >
          ถือมือเดียว
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 430,
          textAlign: "center",
          fontFamily: T.dim,
          fontWeight: 200,
          fontSize: 86,
          color: CREAM,
          textShadow: LIFT,
          opacity: easy,
          letterSpacing: interpolate(easy, [0, 1], [30, 6]),
        }}
      >
        สบาย
      </div>
    </AbsoluteFill>
  );
}

/** The pump cap, drawn in hairline, lifts off along a dotted arc — "เปิดฝา". */
export function CapLift() {
  const frame = useCurrentFrame();
  const lift = interpolate(frame, [2, 13], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.4)) });
  const word = interpolate(frame, [3, 11], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const cx = 830;
  const cy = 560;
  const capY = cy - lift * 170;
  const rot = lift * -16;
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        <g fill="none" stroke={CREAM} strokeWidth={3} style={{ filter: "drop-shadow(0 0 8px rgba(10,24,14,0.7))" }}>
          {/* neck left behind */}
          <rect x={cx - 42} y={cy + 20} width={84} height={70} rx={6} />
          <path d={`M ${cx - 110} ${cy + 150} Q ${cx - 110} ${cy + 90} ${cx - 42} ${cy + 90} L ${cx + 42} ${cy + 90} Q ${cx + 110} ${cy + 90} ${cx + 110} ${cy + 150}`} />
          {/* cap flying up */}
          <g transform={about(cx, capY, `rotate(${rot})`)}>
            <rect x={cx - 58} y={capY - 60} width={116} height={96} rx={10} fill={PINE} fillOpacity={0.55} />
            <rect x={cx - 22} y={capY - 96} width={44} height={36} rx={5} />
            <path d={`M ${cx + 22} ${capY - 84} L ${cx + 70} ${capY - 84}`} />
          </g>
          <path
            d={`M ${cx + 70} ${cy} Q ${cx + 110} ${cy - 90} ${cx + 30} ${cy - 190}`}
            strokeDasharray="3 12"
            strokeWidth={3}
            opacity={lift}
          />
        </g>
      </svg>
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 330,
          fontFamily: T.ornate,
          fontWeight: 700,
          fontSize: 150,
          lineHeight: "200px",
          color: CREAM,
          textShadow: LIFT,
          opacity: word,
          transform: `translateY(${(1 - word) * 50}px)`,
        }}
      >
        เปิดฝา
      </div>
      <div
        style={{
          position: "absolute",
          left: 100,
          top: 545,
          width: 380 * word,
          height: 2,
          background: BRASS,
        }}
      />
    </AbsoluteFill>
  );
}
