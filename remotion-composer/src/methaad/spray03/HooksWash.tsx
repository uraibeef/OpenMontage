import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Canvas, clamp, useIn, usePop } from "../hooks/kit";
import { about, CREAM, hash, INK, T, WATER } from "./style";

/** Beat 5a — a doodled shower head rains on the lather; "ตกเย็น / ล้างออก" drips below. */
export function ShowerRain() {
  const frame = useCurrentFrame();
  const head = usePop(0, 12);
  const words = useIn(3, 6);
  return (
    <AbsoluteFill>
      <Canvas>
        <g transform={`translate(20 -30) ${about(860, 200, `scale(${head})`)}`}>
          <path d="M 1100 110 H 960 Q 920 110 920 150 V 170" stroke={INK} strokeWidth={26} fill="none" strokeLinecap="round" />
          <path d="M 1100 110 H 960 Q 920 110 920 150 V 170" stroke="#C9CED3" strokeWidth={14} fill="none" strokeLinecap="round" />
          <path d="M 760 250 Q 870 150 980 250 Z" fill="#C9CED3" stroke={INK} strokeWidth={8} strokeLinejoin="round" transform="rotate(18 870 220)" />
          {[0, 1, 2, 3].map((i) => (
            <circle key={i} cx={800 + i * 40} cy={262 - i * 2} r={6} fill={INK} transform="rotate(18 870 220)" />
          ))}
        </g>
        {Array.from({ length: 14 }, (_, i) => {
          const lane = hash(i + 4);
          const t = ((frame * 30 + hash(i) * 300) % 300) / 300;
          const x0 = 760 + lane * 150;
          const y0 = 290 + t * 180;
          return (
            <line key={i} x1={x0 - t * 90} y1={y0} x2={x0 - t * 90 - 12} y2={y0 + 40} stroke={WATER} strokeWidth={9} strokeLinecap="round" opacity={head > 0.6 ? 0.95 : 0} />
          );
        })}
      </Canvas>
      <div style={{ position: "absolute", left: 70, top: 1480, opacity: words, transform: `translateY(${(1 - words) * 40}px)` }}>
        <div style={{ fontFamily: T.bubble, fontWeight: 700, fontSize: 64, color: CREAM, WebkitTextStroke: `8px ${INK}`, paintOrder: "stroke" }}>ตกเย็น</div>
        <div style={{ fontFamily: T.bubble, fontWeight: 700, fontSize: 150, lineHeight: 1.05, color: WATER, WebkitTextStroke: `12px ${INK}`, paintOrder: "stroke" }}>
          ล้างออก
        </div>
      </div>
      <Canvas>
        {[0, 1, 2].map((i) => {
          const t = ((frame + i * 7) % 18) / 18;
          const x = 150 + i * 190;
          return <path key={i} d={`M ${x} ${1755 + t * 90} q 14 20 0 30 q -14 -10 0 -30 Z`} fill={WATER} stroke={INK} strokeWidth={4} opacity={words * (1 - t)} />;
        })}
      </Canvas>
    </AbsoluteFill>
  );
}

/** [word, x, y, radius] — one soap bubble per word of "สระทีเดียวหลุด". */
const BUBBLES = [
  ["สระ", 250, 1380, 125],
  ["ที", 520, 1330, 95],
  ["เดียว", 790, 1400, 150],
  ["หลุด", 540, 1640, 140],
] as const;

/** Beat 5b — "สระทีเดียวหลุด" floats up in soap bubbles; the "หลุด" bubble bursts and the word flies off. */
export function SoapBubbles({ popAt }: { popAt: number }) {
  const frame = useCurrentFrame();
  return (
    <Canvas>
      {BUBBLES.map(([word, bx, by, r], i) => {
        const born = i * 3;
        const grow = interpolate(frame, [born, born + 6], [0, 1], clamp);
        const x = bx + Math.sin(frame / 5 + i * 2) * 10;
        const y = by - (frame - born) * 2.5;
        const isLast = i === BUBBLES.length - 1;
        const popT = frame - popAt;
        const popped = isLast && popT > 0;
        const ring = popped ? interpolate(popT, [0, 5], [0, 1], clamp) : 0;
        return (
          <g key={word} opacity={grow > 0 ? 1 : 0}>
            {!popped ? (
              <>
                <circle cx={x} cy={y} r={r * grow} fill="rgba(255,255,255,0.3)" stroke={CREAM} strokeWidth={7} />
                <circle cx={x} cy={y} r={r * grow} fill="none" stroke={WATER} strokeWidth={3} opacity={0.8} />
                <path d={`M ${x - r * 0.6} ${y - r * 0.3} a ${r * 0.7} ${r * 0.7} 0 0 1 ${r * 0.4} ${-r * 0.4}`} stroke="#FFFFFF" strokeWidth={9} fill="none" strokeLinecap="round" opacity={grow} />
              </>
            ) : (
              <g stroke={CREAM} strokeWidth={8} strokeLinecap="round" opacity={1 - ring}>
                {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
                  const rad = (a * Math.PI) / 180;
                  const r0 = r * (0.9 + ring * 0.4);
                  return <line key={a} x1={x + Math.cos(rad) * r0} y1={y + Math.sin(rad) * r0} x2={x + Math.cos(rad) * (r0 + 40)} y2={y + Math.sin(rad) * (r0 + 40)} />;
                })}
              </g>
            )}
            <text
              x={x}
              y={y + r * 0.28 - ring * 80}
              textAnchor="middle"
              fontFamily={T.bubble}
              fontWeight={700}
              fontSize={r * 0.72 * grow}
              fill={INK}
              stroke={CREAM}
              strokeWidth={10}
              paintOrder="stroke"
              transform={popped ? about(x, y, `rotate(${ring * -10})`) : undefined}
            >
              {word}
            </text>
          </g>
        );
      })}
    </Canvas>
  );
}

const STAINS = [
  [210, 250, 46],
  [380, 300, 34],
  [520, 220, 52],
  [700, 290, 40],
  [860, 235, 48],
] as const;

/** Beat 5c — a squeegee wipes a smudged glass pane clean, revealing "ไม่ทิ้งคราบ". */
export function SqueegeeClean({ wipeAt }: { wipeAt: number }) {
  const frame = useCurrentFrame();
  const panel = usePop(0, 12);
  const wipe = interpolate(frame, [wipeAt, wipeAt + 10], [0, 1], clamp);
  const bladeX = 70 + wipe * 950;
  const shine = interpolate(frame, [wipeAt + 11, wipeAt + 17], [0, 1], clamp);
  return (
    <Canvas>
      <g transform={about(540, 270, `scale(${panel})`)}>
        <rect x={82} y={148} width={920} height={250} rx={24} fill={INK} opacity={0.35} />
        <rect x={70} y={136} width={920} height={250} rx={24} fill="rgba(246,238,220,0.94)" stroke={INK} strokeWidth={6} />
        <clipPath id="sp3-clean">
          <rect x={70} y={136} width={Math.max(0, bladeX - 70)} height={250} />
        </clipPath>
        <clipPath id="sp3-dirty">
          <rect x={bladeX} y={136} width={1000} height={250} />
        </clipPath>
        <g clipPath="url(#sp3-dirty)">
          {STAINS.map(([x, y, r], i) => (
            <path key={i} d={`M ${x - r} ${y} q ${r * 0.4} ${-r} ${r} ${-r * 0.7} q ${r} ${r * 0.2} ${r * 0.8} ${r} q ${-r * 0.2} ${r} ${-r * 1.1} ${r * 0.8} q ${-r} ${-r * 0.3} ${-r * 0.7} ${-r * 1.1} Z`} fill="#9A8F7A" opacity={0.75} />
          ))}
        </g>
        <text x={530} y={300} textAnchor="middle" fontFamily={T.bubble} fontWeight={700} fontSize={112} fill={INK} clipPath="url(#sp3-clean)">
          ไม่ทิ้งคราบ
        </text>
        {wipe > 0 && wipe < 1 ? (
          <g>
            <rect x={bladeX - 12} y={120} width={24} height={282} rx={8} fill={INK} />
            <rect x={bladeX - 4} y={120} width={8} height={282} fill={WATER} />
            <rect x={bladeX + 10} y={240} width={120} height={40} rx={12} fill={INK} transform={`rotate(-12 ${bladeX} 260)`} />
          </g>
        ) : null}
        <g stroke={INK} strokeWidth={8} strokeLinecap="round" opacity={shine > 0 && shine < 1 ? 1 : 0}>
          {[
            [980, 150],
            [110, 380],
          ].map(([x, y]) => (
            <g key={x} transform={about(x, y, `scale(${0.5 + shine})`)}>
              <line x1={x} y1={y - 34} x2={x} y2={y + 34} />
              <line x1={x - 34} y1={y} x2={x + 34} y2={y} />
            </g>
          ))}
        </g>
      </g>
    </Canvas>
  );
}
