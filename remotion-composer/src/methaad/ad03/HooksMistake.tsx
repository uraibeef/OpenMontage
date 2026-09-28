import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Canvas, clamp, useIn, usePop } from "../hooks/kit";
import { about, AMBER, INK, OK, PAPER, SIGNAL, T } from "./style";

/** Hooks laid over the three "mistake" footage shots: road sign, proof edit, meter. */

/** Mistake 1 — a diamond road sign springs up on its post; the "ผมเปียก" plate drips. */
export function WetSignHook() {
  const frame = useCurrentFrame();
  const rise = usePop(0, 10);
  const wobble = 7 * Math.exp(-frame / 9) * Math.sin(frame / 2.2);
  const cx = 540;
  const cy = 1370;
  const r = 240;
  const plateY = 1655;
  const drops = [
    { x: 330, at: 10 },
    { x: 610, at: 15 },
    { x: 470, at: 21 },
    { x: 720, at: 26 },
  ];
  return (
    <AbsoluteFill>
      <Canvas>
        <g transform={`translate(0 ${interpolate(rise, [0, 1], [700, 0])}) ${about(cx, 1920, `rotate(${wobble})`)}`}>
          <rect x={cx - 16} y={cy} width={32} height={700} fill="#8D9096" stroke={INK} strokeWidth={4} />
          <path d={`M ${cx} ${cy - r - 14} L ${cx + r + 14} ${cy} L ${cx} ${cy + r + 14} L ${cx - r - 14} ${cy} Z`} fill="rgba(0,0,0,0.45)" transform="translate(12 16)" />
          <path d={`M ${cx} ${cy - r - 14} L ${cx + r + 14} ${cy} L ${cx} ${cy + r + 14} L ${cx - r - 14} ${cy} Z`} fill={AMBER} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
          <path d={`M ${cx} ${cy - r + 16} L ${cx + r - 16} ${cy} L ${cx} ${cy + r - 16} L ${cx - r + 16} ${cy} Z`} fill="none" stroke={INK} strokeWidth={14} strokeLinejoin="round" />
          <text x={cx} y={cy + 105} textAnchor="middle" fontFamily={T.sign} fontWeight={800} fontSize={300} fill={INK}>
            1
          </text>
          <rect x={cx - 280} y={plateY} width={560} height={140} rx={10} fill={AMBER} stroke={INK} strokeWidth={5} />
          <rect x={cx - 266} y={plateY + 14} width={532} height={112} rx={6} fill="none" stroke={INK} strokeWidth={6} />
          <text x={cx} y={plateY + 102} textAnchor="middle" fontFamily={T.sign} fontWeight={800} fontSize={88} fill={INK}>
            ผมเปียก
          </text>
        </g>
        {drops.map((d, k) => {
          const t = frame - d.at;
          if (t < 0) return null;
          const grow = interpolate(t, [0, 6], [0, 1], clamp);
          const fall = t > 6 ? 0.9 * (t - 6) ** 2 : 0;
          const y = plateY + 140 + fall;
          return (
            <path
              key={k}
              d={`M ${d.x} ${y - 4} q 16 ${24 * grow + 10} 0 ${30 * grow + 12} q -16 ${-6} 0 ${-30 * grow - 12} Z`}
              fill="#7FD4FF"
              stroke={INK}
              strokeWidth={3}
              opacity={interpolate(t, [0, 2, 24, 30], [0, 1, 1, 0], clamp)}
            />
          );
        })}
      </Canvas>
    </AbsoluteFill>
  );
}

/** Mistake 2 — typed "ปลายผม" gets a red hand strike; "โคน" is written in above it. */
export function ProofHook() {
  const frame = useCurrentFrame();
  const slide = useIn(0, 8);
  const typed = interpolate(frame, [4, 15], [0, 1], clamp);
  const typedStep = Math.floor(typed * 6) / 6;
  const ring = useIn(4, 10);
  const strike = interpolate(frame, [20, 26], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const write = interpolate(frame, [26, 36], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const caret = useIn(24, 5);
  const top = 1395;
  return (
    <AbsoluteFill>
      <Canvas>
        <defs>
          <clipPath id="proof-type">
            <rect x={300} y={top} width={620 * typedStep} height={400} />
          </clipPath>
          <clipPath id="proof-write">
            <rect x={420} y={top} width={360 * write} height={180} />
          </clipPath>
        </defs>
        <g transform={`translate(0 ${interpolate(slide, [0, 1], [520, 0])}) ${about(540, top + 200, "rotate(-2.5)")}`}>
          <rect x={60} y={top + 14} width={1000} height={390} fill="rgba(0,0,0,0.4)" transform="translate(10 12)" />
          <rect x={60} y={top} width={1000} height={400} fill="#FBF8EF" stroke={INK} strokeWidth={3} />
          {[0, 1, 2].map((k) => (
            <line key={k} x1={60} x2={1060} y1={top + 190 + k * 100} y2={top + 190 + k * 100} stroke="#A9C7E8" strokeWidth={3} />
          ))}
          <line x1={250} x2={250} y1={top} y2={top + 400} stroke="#E8A2A2" strokeWidth={4} />
          {/* margin mark: circled 2 */}
          <text x={165} y={top + 305} textAnchor="middle" fontFamily={T.hand} fontWeight={700} fontSize={130} fill={SIGNAL}>
            2
          </text>
          <circle
            cx={165}
            cy={top + 258}
            r={72}
            fill="none"
            stroke={SIGNAL}
            strokeWidth={7}
            strokeDasharray={460}
            strokeDashoffset={460 * (1 - ring)}
            transform={about(165, top + 258, "rotate(-100)")}
          />
          <g clipPath="url(#proof-type)">
            <text x={320} y={top + 330} fontFamily={T.ui} fontWeight={700} fontSize={150} fill={INK}>
              ปลายผม
            </text>
          </g>
          {/* hand strike, two wobbly passes */}
          <path
            d={`M 300 ${top + 282} C 450 ${top + 262}, 640 ${top + 300}, 900 ${top + 268}`}
            stroke={SIGNAL}
            strokeWidth={16}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={640}
            strokeDashoffset={640 * (1 - strike)}
          />
          <path
            d={`M 890 ${top + 292} C 700 ${top + 312}, 480 ${top + 280}, 320 ${top + 306}`}
            stroke={SIGNAL}
            strokeWidth={10}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={640}
            strokeDashoffset={640 * (1 - interpolate(frame, [24, 29], [0, 1], clamp))}
          />
          {/* caret + correction written above */}
          <path d={`M 560 ${top + 205} L 600 ${top + 160} L 640 ${top + 205}`} stroke={SIGNAL} strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={caret} />
          <g clipPath="url(#proof-write)">
            <text x={600} y={top + 140} textAnchor="middle" fontFamily={T.hand} fontWeight={700} fontSize={128} fill={SIGNAL} transform={about(600, top + 100, "rotate(-4)")}>
              โคน
            </text>
          </g>
        </g>
      </Canvas>
    </AbsoluteFill>
  );
}

const CX = 540;
const CY = 505;
const R = 285;
const A0 = -150;
const A1 = -30;
const pt = (deg: number, r: number) => {
  const a = (deg * Math.PI) / 180;
  return [CX + r * Math.cos(a), CY + r * Math.sin(a)] as const;
};
const arc = (d0: number, d1: number, r: number) => {
  const [x0, y0] = pt(d0, r);
  const [x1, y1] = pt(d1, r);
  return `M ${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1}`;
};

/** Mistake 3 — a panel meter labelled "ปริมาณ"; the needle slams into the red "เยอะ" zone and pins there. */
export function DoseMeterHook() {
  const frame = useCurrentFrame();
  const enter = usePop(0, 12);
  const swing = interpolate(frame, [6, 16], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const bounce = frame > 16 ? 5 * Math.exp(-(frame - 16) / 5) * Math.sin((frame - 16) * 1.8) : 0;
  const tremble = frame > 16 ? 1.4 * Math.sin(frame * 4.3) : 0;
  const needle = A0 + (A1 + 6 - A0) * swing - Math.abs(bounce) + tremble;
  const hot = frame > 15;
  const blink = hot && Math.floor(frame / 3) % 2 === 0;
  const [nx, ny] = pt(needle, R - 20);
  const [lx, ly] = pt(-128, 205);
  const [hx, hy] = pt(-50, 205);
  return (
    <AbsoluteFill>
      <Canvas>
        <g transform={about(CX, 380, `scale(${enter})`)}>
          <rect x={150} y={130} width={780} height={500} rx={40} fill="rgba(0,0,0,0.45)" transform="translate(12 16)" />
          <rect x={150} y={130} width={780} height={500} rx={40} fill="#232327" stroke={INK} strokeWidth={4} />
          {[
            [190, 170],
            [890, 170],
            [190, 590],
            [890, 590],
          ].map(([x, y], k) => (
            <g key={k}>
              <circle cx={x} cy={y} r={14} fill="#77777E" />
              <line x1={x - 9} y1={y - 5} x2={x + 9} y2={y + 5} stroke="#2A2A2E" strokeWidth={4} />
            </g>
          ))}
          <rect x={210} y={165} width={660} height={430} rx={18} fill={PAPER} />
          <path d={arc(A0, -75, R)} stroke={OK} strokeWidth={34} fill="none" />
          <path d={arc(-75, -62, R)} stroke={AMBER} strokeWidth={34} fill="none" />
          <path d={arc(-62, A1, R)} stroke={SIGNAL} strokeWidth={34} fill="none" opacity={blink ? 1 : 0.75} />
          {Array.from({ length: 13 }, (_, i) => {
            const d = A0 + (i * (A1 - A0)) / 12;
            const [x0, y0] = pt(d, R - 22);
            const [x1, y1] = pt(d, R - (i % 3 === 0 ? 62 : 44));
            return <line key={i} x1={x0} y1={y0} x2={x1} y2={y1} stroke={INK} strokeWidth={i % 3 === 0 ? 6 : 3} />;
          })}
          <text x={lx} y={ly + 20} textAnchor="middle" fontFamily={T.manual} fontWeight={700} fontSize={48} fill={OK}>
            พอดี
          </text>
          <g transform={about(hx, hy, `scale(${hot ? 1.35 : 1})`)}>
            <text x={hx} y={hy + 20} textAnchor="middle" fontFamily={T.manual} fontWeight={700} fontSize={58} fill={SIGNAL}>
              เยอะ
            </text>
          </g>
          <text x={CX} y={590} textAnchor="middle" fontFamily={T.manual} fontWeight={700} fontSize={50} fill={INK} letterSpacing={2}>
            ปริมาณ
          </text>
          <line x1={CX} y1={CY} x2={nx} y2={ny} stroke={INK} strokeWidth={9} strokeLinecap="round" />
          <circle cx={CX} cy={CY} r={22} fill={INK} />
          <circle cx={CX} cy={CY} r={8} fill={SIGNAL} />
          {/* channel badge */}
          <rect x={112} y={96} width={140} height={140} fill={SIGNAL} stroke={INK} strokeWidth={5} transform={about(182, 166, "rotate(-6)")} />
          <text x={182} y={218} textAnchor="middle" fontFamily={T.sign} fontWeight={800} fontSize={140} fill="#FFFFFF" transform={about(182, 166, "rotate(-6)")}>
            3
          </text>
        </g>
      </Canvas>
    </AbsoluteFill>
  );
}
