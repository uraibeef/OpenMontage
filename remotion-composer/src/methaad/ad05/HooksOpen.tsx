import { AbsoluteFill, Easing, interpolate, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import { usePop } from "../hooks/kit";
import { DimLine, Ink, Node, Plate, Sheet, useDraw } from "./Draft";
import { CAL, clamp, GRAPHITE, LIFT, LINE, SHEET, T } from "./style";

/**
 * Beats 4–6: the bottle is opened and inspected — protractor on the cap,
 * a specimen tag on the powder, a loupe on the sifter, a caliper against the palm.
 */

const rad = (deg: number) => (deg * Math.PI) / 180;

/** Beat 4 (6.97–7.88 s): protractor sweeps with the flip cap. */
export function HookProtractor() {
  const frame = useCurrentFrame();
  const cx = 600;
  const cy = 700;
  const R = 330;
  const base = useDraw(0, 6);
  const deg = interpolate(frame, [3, 20], [0, 110], { ...clamp, easing: Easing.out(Easing.cubic) });
  const ticks = Array.from({ length: 19 }, (_, i) => i * 10);
  const end = { x: cx + R * Math.cos(rad(-deg)), y: cy + R * Math.sin(rad(-deg)) };
  const arc = `M ${cx + R} ${cy} A ${R} ${R} 0 0 0 ${end.x} ${end.y}`;
  const word = usePop(10, 10);
  return (
    <AbsoluteFill>
      <Sheet>
        <g opacity={base * 0.9}>
          <path d={`M ${cx - R - 40} ${cy} H ${cx + R + 40}`} stroke={LINE} strokeWidth={3} />
          {ticks.map((t) => {
            const long = t % 30 === 0;
            const r1 = R + 6;
            const r2 = R + (long ? 44 : 24);
            const a = rad(-t);
            return (
              <line
                key={t}
                x1={cx + r1 * Math.cos(a)}
                y1={cy + r1 * Math.sin(a)}
                x2={cx + r2 * Math.cos(a)}
                y2={cy + r2 * Math.sin(a)}
                stroke={LINE}
                strokeWidth={long ? 4 : 2}
                opacity={t <= 180 * base ? 1 : 0}
              />
            );
          })}
        </g>
        <path d={`M ${cx} ${cy} L ${cx + R} ${cy} ${arc.slice(arc.indexOf("A"))} Z`} fill={CAL} opacity={0.22} />
        <path d={arc} stroke={CAL} strokeWidth={8} fill="none" />
        <line x1={cx} y1={cy} x2={end.x} y2={end.y} stroke={CAL} strokeWidth={5} />
        <circle cx={cx} cy={cy} r={12} fill={LINE} />
        <text x={cx + R * 0.55 * Math.cos(rad(-deg / 2))} y={cy + R * 0.55 * Math.sin(rad(-deg / 2)) + 20} textAnchor="middle" fontFamily={T.mono} fontWeight={700} fontSize={52} fill={LINE}>
          {`${Math.round(deg)}°`}
        </text>
      </Sheet>
      <div
        style={{
          position: "absolute",
          left: 60,
          top: 150,
          fontFamily: T.disp,
          fontWeight: 700,
          fontSize: 170,
          color: LINE,
          lineHeight: 1,
          filter: LIFT,
          transformOrigin: "left bottom",
          transform: `rotate(${(1 - word) * -18}deg) scale(${0.6 + word * 0.4})`,
          opacity: Math.min(1, word * 2),
        }}
      >
        เปิดฝา
      </div>
    </AbsoluteFill>
  );
}

/** Beat 5a (7.88–8.90 s): a specimen tag strung onto the powder. */
export function HookSpecimen() {
  const frame = useCurrentFrame();
  const ring = useDraw(0, 7);
  const str = useDraw(4, 7);
  const swing = Math.sin(frame / 4) * interpolate(frame, [8, 30], [7, 1.5], clamp);
  const drop = interpolate(frame, [7, 13], [-80, 0], { ...clamp, easing: Easing.out(Easing.back(2)) });
  return (
    <AbsoluteFill>
      <Sheet>
        <circle cx={636} cy={940} r={170} stroke={LINE} strokeWidth={4} fill="none" strokeDasharray="1 0" pathLength={1} style={{ strokeDasharray: `${ring} 1` }} />
        <Ink d="M 500 1040 C 420 1160, 300 1180, 240 1300" p={str} width={3} />
      </Sheet>
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 1290,
          width: 440,
          transformOrigin: "150px 0px",
          transform: `translateY(${drop}px) rotate(${-6 + swing}deg)`,
          opacity: str > 0.6 ? 1 : 0,
          filter: "drop-shadow(0 18px 30px rgba(0,0,0,0.5))",
        }}
      >
        <div
          style={{
            background: SHEET,
            padding: "40px 34px 30px 34px",
            clipPath: "polygon(22% 0, 100% 0, 100% 100%, 0 100%, 0 22%)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginLeft: 70 }}>
            <div style={{ width: 34, height: 34, borderRadius: 17, background: "#FFFFFF", border: `3px solid ${GRAPHITE}` }} />
            <div style={{ fontFamily: T.mono, fontSize: 22, letterSpacing: 3, color: CAL, fontWeight: 700 }}>SAMPLE A</div>
          </div>
          <div style={{ fontFamily: T.th, fontWeight: 700, fontSize: 100, color: GRAPHITE, lineHeight: 1.3 }}>แป้งขาว</div>
          <div style={{ borderTop: `2px solid ${GRAPHITE}`, fontFamily: T.mono, fontSize: 20, color: "#5A5A60", paddingTop: 8, letterSpacing: 2 }}>
            COLOR: WHITE · FORM: POWDER
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}

/** Beat 5b (8.90–10.00 s): loupe over the sifter, magnified live footage inside. */
export function HookLoupe({ src, dur }: { src: string; dur: number }) {
  const frame = useCurrentFrame();
  const open = usePop(2, 12);
  const cone = useDraw(0, 6);
  const text = useDraw(8, 10);
  const MAG = 2.6;
  const fx = 610; // sampled point on the sifter
  const fy = 720;
  const lx = 600; // loupe centre
  const ly = 1400;
  const r = 300 * open;
  const push = interpolate(frame, [0, dur], [1, 1.05], clamp);
  return (
    <AbsoluteFill>
      <Sheet>
        <circle cx={fx} cy={fy} r={80} fill="none" stroke={LINE} strokeWidth={4} opacity={cone} />
        <Ink d={`M ${fx - 78} ${fy + 20} L ${lx - 296} ${ly - 40}`} p={cone} width={2} />
        <Ink d={`M ${fx + 78} ${fy + 20} L ${lx + 296} ${ly - 40}`} p={cone} width={2} />
      </Sheet>
      <div
        style={{
          position: "absolute",
          left: lx - r,
          top: ly - r,
          width: r * 2,
          height: r * 2,
          borderRadius: "50%",
          overflow: "hidden",
          border: `14px solid ${GRAPHITE}`,
          boxShadow: `0 0 0 4px ${CAL}, 0 30px 60px rgba(0,0,0,0.6)`,
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 1080,
            height: 1920,
            left: r - fx,
            top: r - fy,
            transformOrigin: `${fx}px ${fy}px`,
            transform: `scale(${MAG * push})`,
          }}
        >
          <OffthreadVideo src={staticFile(src)} muted style={{ width: 1080, height: 1920, objectFit: "cover" }} />
        </div>
        <svg width={r * 2} height={r * 2} style={{ position: "absolute", inset: 0 }}>
          <path d={`M ${r} ${r - 40} V ${r + 40} M ${r - 40} ${r} H ${r + 40}`} stroke={CAL} strokeWidth={3} />
        </svg>
      </div>
      <Sheet>
        <defs>
          <path id="a5-loupe-rim" d={`M ${lx - 350} ${ly} A 350 350 0 0 1 ${lx + 350} ${ly}`} />
        </defs>
        <text fontFamily={T.th} fontWeight={700} fontSize={84} fill={LINE} opacity={text}>
          <textPath href="#a5-loupe-rim" startOffset="50%" textAnchor="middle">
            เนื้อละเอียดมาก
          </textPath>
        </text>
        <text x={lx + 250} y={ly + 330} fontFamily={T.mono} fontWeight={700} fontSize={48} fill={CAL} opacity={open}>
          ×2.6
        </text>
      </Sheet>
    </AbsoluteFill>
  );
}

/** Beat 6 (10.00–11.50 s): vernier caliper closes on the bottle, reads "1 palm". */
export function HookCaliper() {
  const frame = useCurrentFrame();
  const inP = interpolate(frame, [0, 7], [1, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const jaw = interpolate(frame, [6, 22], [1820, 1500], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const readP = usePop(22, 10);
  const X = 860;
  const top = 280;
  const ticks = Array.from({ length: 46 }, (_, i) => top + 40 + i * 32);
  return (
    <AbsoluteFill style={{ transform: `translateX(${inP * 360}px)` }}>
      <Sheet>
        {/* beam */}
        <rect x={X} y={top} width={64} height={1600} fill="#C9CCD0" stroke={GRAPHITE} strokeWidth={3} />
        {ticks.map((y, i) => (
          <line key={y} x1={X} y1={y} x2={X + (i % 5 === 0 ? 30 : 16)} y2={y} stroke={GRAPHITE} strokeWidth={2} />
        ))}
        {/* fixed jaw */}
        <path d={`M ${X + 64} ${top} H ${X - 170} V ${top + 38} H ${X} V ${top + 90} H ${X + 64} Z`} fill="#DADDE1" stroke={GRAPHITE} strokeWidth={3} />
        {/* sliding jaw + readout */}
        <g transform={`translate(0 ${jaw - 1500})`}>
          <path d={`M ${X + 64} 1500 H ${X - 170} V 1462 H ${X} V 1400 H ${X + 80} V 1560 H ${X + 64} Z`} fill="#DADDE1" stroke={GRAPHITE} strokeWidth={3} />
          <rect x={X - 6} y={1560} width={96} height={170} rx={10} fill={GRAPHITE} />
          <rect x={X + 6} y={1576} width={72} height={120} rx={4} fill="#1F3A2A" />
        </g>
      </Sheet>
      <Sheet>
        <DimLine x1={X - 110} y1={top + 40} x2={X - 110} y2={jaw - 40} p={readP} color={CAL} width={5} />
      </Sheet>
      <div
        style={{
          position: "absolute",
          left: 60,
          top: 90,
          display: "flex",
          alignItems: "baseline",
          gap: 20,
          transform: `scale(${readP})`,
          transformOrigin: "left center",
          filter: LIFT,
        }}
      >
        <span style={{ fontFamily: T.mono, fontWeight: 700, fontSize: 34, color: CAL, letterSpacing: 4 }}>SIZE</span>
        <span style={{ fontFamily: T.disp, fontWeight: 700, fontSize: 124, color: LINE, lineHeight: 1.2 }}>เท่าฝ่ามือ</span>
      </div>
    </AbsoluteFill>
  );
}
