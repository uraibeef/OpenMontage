import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Code, Reveal, StampSlam, Svg } from "./labkit";
import { about, clamp, FAIL, INK, L, PASS, PAPER } from "./style";

/**
 * TEST 01 — oil. A blotting-paper strip is pressed to the hair and peeled
 * back clean ("ไม่มัน"), the tech ticks "ผมดูธรรมชาติ"; then a gloss meter
 * pins in the red on the wet look and drops to matte for "ไม่วาว" + PASS.
 */

const BLOT = "#EFE3C8";

/** Blotting paper pressed on, peeled off, read. */
export function BlotStrip({ noteAt }: { noteAt: number }) {
  const frame = useCurrentFrame();
  const down = interpolate(frame, [0, 4], [-700, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const press = interpolate(frame, [4, 6, 9], [0, 1, 0], clamp);
  const peel = interpolate(frame, [9, 14], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const x = 640;
  const y = 170;
  const w = 330;
  const h = 520;
  const tilt = interpolate(peel, [0, 1], [0, 8]);
  return (
    <AbsoluteFill>
      <Svg>
        <g transform={`translate(0 ${down}) ${about(x + w / 2, y, `rotate(${tilt}) scale(${1 + press * 0.05} ${1 - press * 0.08})`)}`}>
          <rect x={x + 10} y={y + 14} width={w} height={h} rx={6} fill="rgba(0,0,0,0.3)" />
          <rect x={x} y={y} width={w} height={h} rx={6} fill={BLOT} />
          <rect x={x} y={y} width={w} height={64} rx={6} fill={INK} />
          <Code x={x + w / 2} y={y + 44} text="BLOT · T01" size={30} fill={PAPER} anchor="middle" />
          <circle cx={x + w / 2} cy={y + 220} r={110} fill="none" stroke="#B9A987" strokeWidth={4} strokeDasharray="10 10" />
          <Code x={x + w / 2} y={y + 232} text="OIL 0" size={40} fill="#8B7B5A" anchor="middle" />
          <g opacity={peel}>
            <text x={x + w / 2} y={y + 440} textAnchor="middle" fontFamily={L.label} fontWeight={700} fontSize={98} fill={INK}>
              ไม่มัน
            </text>
          </g>
        </g>
        <Note at={noteAt} />
      </Svg>
    </AbsoluteFill>
  );
}

/** The tech's ballpoint tick + note for "ผมดูธรรมชาติ". */
function Note({ at }: { at: number }) {
  const frame = useCurrentFrame();
  const tick = interpolate(frame, [at, at + 5], [0, 1], { ...clamp, easing: Easing.out(Easing.quad) });
  if (frame < at) return null;
  const x = 90;
  const y = 1460;
  return (
    <g>
      <rect x={x - 20} y={y - 110} width={690} height={170} rx={16} fill="rgba(244,241,232,0.94)" transform={about(x, y, "rotate(-3)")} />
      <path
        d={`M ${x} ${y - 40} l 30 34 l 58 -86`}
        fill="none"
        stroke={PASS}
        strokeWidth={14}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={200}
        strokeDashoffset={200 * (1 - tick)}
      />
      <Reveal id="d8-note1" x={x + 100} y={y - 130} w={600} h={200} from={at + 3} dur={9}>
        <text x={x + 110} y={y + 10} fontFamily={L.note} fontWeight={700} fontSize={70} fill="#1D2F7A" transform={about(x, y, "rotate(-3)")}>
          ผมดูธรรมชาติ
        </text>
      </Reveal>
    </g>
  );
}

const CX = 540;
const CY = 1840;
const R = 200;

function arc(a0: number, a1: number, r: number) {
  const p = (a: number) => [CX + r * Math.cos(a), CY + r * Math.sin(a)];
  const [x0, y0] = p(a0);
  const [x1, y1] = p(a1);
  return `M ${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1}`;
}

/** Gloss meter: swings into "วาว" on the wet look, then drops to matte at `dropAt`. */
export function GlossMeter({ dropAt }: { dropAt: number }) {
  const frame = useCurrentFrame();
  const inP = interpolate(frame, [0, 6], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.5)) });
  const up = interpolate(frame, [2, 10], [0, 0.93], { ...clamp, easing: Easing.out(Easing.back(2.5)) });
  const drop = interpolate(frame, [dropAt, dropAt + 8], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.8)) });
  const jitter = frame < dropAt ? Math.sin(frame * 2.3) * 0.015 : 0;
  const v = up - drop * 0.83 + jitter;
  const ang = Math.PI + v * Math.PI;
  const matte = frame >= dropAt;
  return (
    <AbsoluteFill>
      <Svg>
        <g transform={about(CX, CY, `scale(${inP})`)}>
          <path d={`${arc(Math.PI, 2 * Math.PI, R + 50)} L ${CX + R + 50} ${CY + 40} L ${CX - R - 50} ${CY + 40} Z`} fill="rgba(13,20,34,0.86)" />
          <path d={arc(Math.PI, Math.PI * 1.4, R)} stroke={PASS} strokeWidth={34} fill="none" />
          <path d={arc(Math.PI * 1.42, Math.PI * 1.62, R)} stroke="#E8C547" strokeWidth={34} fill="none" />
          <path d={arc(Math.PI * 1.64, Math.PI * 2, R)} stroke={FAIL} strokeWidth={34} fill="none" />
          {Array.from({ length: 21 }, (_, i) => {
            const a = Math.PI + (i / 20) * Math.PI;
            const r0 = i % 5 === 0 ? R - 60 : R - 40;
            return <line key={i} x1={CX + r0 * Math.cos(a)} y1={CY + r0 * Math.sin(a)} x2={CX + (R - 22) * Math.cos(a)} y2={CY + (R - 22) * Math.sin(a)} stroke={PAPER} strokeWidth={4} />;
          })}
          <text x={CX - R + 10} y={CY - 10} fontFamily={L.label} fontWeight={700} fontSize={40} fill={PASS} textAnchor="start">
            ด้าน
          </text>
          <text x={CX + R - 10} y={CY - 10} fontFamily={L.label} fontWeight={700} fontSize={40} fill={FAIL} textAnchor="end">
            วาว
          </text>
          <line x1={CX} y1={CY} x2={CX + (R - 30) * Math.cos(ang)} y2={CY + (R - 30) * Math.sin(ang)} stroke={PAPER} strokeWidth={10} strokeLinecap="round" />
          <circle cx={CX} cy={CY} r={22} fill={PAPER} />
          <Code x={CX} y={CY - R - 64} text="GLOSS METER · T01" size={26} fill="#9FE3D8" anchor="middle" />
        </g>
        {!matte ? (
          <text x={CX} y={250} textAnchor="middle" fontFamily={L.report} fontWeight={800} fontSize={84} fill={PAPER} stroke={FAIL} strokeWidth={12} paintOrder="stroke" opacity={inP}>
            วาวเหมือนเพิ่งสระ
          </text>
        ) : (
          <text x={CX} y={CY - R - 120} textAnchor="middle" fontFamily={L.readout} fontWeight={700} fontSize={130} fill={PAPER} stroke={INK} strokeWidth={14} paintOrder="stroke">
            ไม่วาว
          </text>
        )}
        <StampSlam id="d8-pass1" at={dropAt + 7} x={860} y={1160} rot={-14} back={<circle r={136} fill={PAPER} opacity={0.82} />}>
          <circle r={130} fill="none" stroke="currentColor" strokeWidth={12} />
          <circle r={104} fill="none" stroke="currentColor" strokeWidth={4} />
          <text y={22} textAnchor="middle" fontFamily={L.readout} fontWeight={700} fontSize={74} fill="currentColor" letterSpacing={4}>
            PASS
          </text>
          <text y={-50} textAnchor="middle" fontFamily={L.readout} fontWeight={700} fontSize={24} fill="currentColor" letterSpacing={6}>
            T01 · OIL
          </text>
          <text y={78} textAnchor="middle" fontFamily={L.readout} fontWeight={700} fontSize={24} fill="currentColor" letterSpacing={6}>
            HX-08
          </text>
        </StampSlam>
      </Svg>
    </AbsoluteFill>
  );
}
