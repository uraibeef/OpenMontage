import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Canvas, clamp, graphemes, usePop } from "../hooks/kit";
import { about, CARD_LINE, CEDAR, CREAM, INK, T, TOMATO } from "./style";

const CARD = { x: 80, y: 150, w: 920, h: 420 } as const;
/** Tiles land out of order: [label, x, rotation, drop delay]. */
const TILES = [
  ["3", 250, -9, 0],
  ["1", 540, 7, 3],
  ["2", 830, -5, 6],
] as const;

/**
 * Beat 1a/1b — a recipe index card drops in with "วิธีใช้ 3 ขั้น"; on "ใช้ผิดขั้นตอน"
 * the numbered step tiles tumble onto it in the wrong order and get tagged ✗.
 */
export function RecipeCardOpen({ tilesAt }: { tilesAt: number }) {
  const frame = useCurrentFrame();
  const drop = usePop(0, 13);
  const sway = interpolate(frame, [0, 14], [-6, 0], { ...clamp, easing: Easing.out(Easing.back(3)) });
  const titleW = interpolate(frame, [4, 14], [0, 1], clamp);
  const tag = usePop(tilesAt + 11, 9);
  const strike = interpolate(frame, [tilesAt + 9, tilesAt + 15], [0, 1], clamp);
  const cardY = interpolate(drop, [0, 1], [-520, 0]);
  const midX = CARD.x + CARD.w / 2;

  return (
    <Canvas>
      <g transform={`translate(0 ${cardY}) ${about(midX, CARD.y, `rotate(${sway})`)}`}>
        <rect x={CARD.x + 12} y={CARD.y + 14} width={CARD.w} height={CARD.h} fill={INK} opacity={0.35} />
        <rect x={CARD.x} y={CARD.y} width={CARD.w} height={CARD.h} fill={CREAM} stroke={INK} strokeWidth={5} />
        <line x1={CARD.x} x2={CARD.x + CARD.w} y1={CARD.y + 128} y2={CARD.y + 128} stroke={TOMATO} strokeWidth={5} />
        {[1, 2, 3].map((i) => (
          <line key={i} x1={CARD.x} x2={CARD.x + CARD.w} y1={CARD.y + 128 + i * 72} y2={CARD.y + 128 + i * 72} stroke={CARD_LINE} strokeWidth={3} />
        ))}
        <line x1={CARD.x + 110} x2={CARD.x + 110} y1={CARD.y} y2={CARD.y + CARD.h} stroke={TOMATO} strokeWidth={2} opacity={0.6} />
        {/* tape */}
        <rect x={midX - 90} y={CARD.y - 26} width={180} height={52} fill="#E9DDB5" opacity={0.85} transform={about(midX, CARD.y, "rotate(-3)")} />
        <clipPath id="sp3-title">
          <rect x={CARD.x} y={CARD.y} width={CARD.w * titleW} height={130} />
        </clipPath>
        <text x={CARD.x + 140} y={CARD.y + 100} fontFamily={T.card} fontWeight={800} fontSize={96} fill={INK} clipPath="url(#sp3-title)">
          วิธีใช้ 3 ขั้น
        </text>
        {TILES.map(([label, x, rot, delay]) => {
          const t = frame - tilesAt - delay;
          const y = interpolate(t, [0, 7], [-700, 0], { ...clamp, easing: Easing.in(Easing.quad) });
          const bounce = t > 7 ? Math.max(0, Math.sin((t - 7) * 0.9) * 14 * Math.exp(-(t - 7) / 5)) : 0;
          const ty = CARD.y + 160 + y - bounce;
          return t >= 0 ? (
            <g key={label} transform={about(x, ty + 100, `rotate(${rot})`)}>
              <rect x={x - 88 + 8} y={ty + 10} width={176} height={200} rx={18} fill={INK} />
              <rect x={x - 88} y={ty} width={176} height={200} rx={18} fill={CEDAR} stroke={INK} strokeWidth={6} />
              <text x={x} y={ty + 162} textAnchor="middle" fontFamily={T.tile} fontWeight={800} fontSize={170} fill={CREAM}>
                {label}
              </text>
            </g>
          ) : null;
        })}
        <path
          d={`M ${CARD.x + 110} ${CARD.y + 300} C ${CARD.x + 380} ${CARD.y + 250}, ${CARD.x + 600} ${CARD.y + 330}, ${CARD.x + CARD.w - 60} ${CARD.y + 270}`}
          stroke={TOMATO}
          strokeWidth={20}
          strokeLinecap="round"
          fill="none"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - strike}
        />
      </g>
      <g transform={about(540, 690, `rotate(-4) scale(${tag})`)}>
        <rect x={250} y={625} width={580} height={130} rx={10} fill={TOMATO} stroke={INK} strokeWidth={6} />
        <text x={540} y={718} textAnchor="middle" fontFamily={T.tile} fontWeight={800} fontSize={84} fill={CREAM}>
          ผิดขั้นตอน
        </text>
      </g>
    </Canvas>
  );
}

/** Beat 1c — "ไม่พอง" is blown up like a balloon, then leaks and sags flat over the flat head. */
export function DeflateWord() {
  const frame = useCurrentFrame();
  const letters = graphemes("ไม่พอง");
  const inflate = usePop(0, 10);
  const leak = interpolate(frame, [12, 30], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  return (
    <AbsoluteFill>
      <Canvas>
        {/* air escaping */}
        {[0, 1, 2].map((i) => {
          const t = interpolate(frame, [9 + i * 3, 22 + i * 3], [0, 1], clamp);
          return (
            <path
              key={i}
              d={`M ${760 + i * 40} ${880 - i * 30} q 40 -30 20 -60 q -20 -30 20 -60`}
              stroke={CREAM}
              strokeWidth={9}
              strokeLinecap="round"
              fill="none"
              opacity={t > 0 && t < 1 ? 1 - t : 0}
              transform={`translate(${t * 90} ${-t * 120})`}
            />
          );
        })}
      </Canvas>
      <div style={{ position: "absolute", left: 0, right: 0, top: 800, display: "flex", justifyContent: "center", alignItems: "flex-end", height: 300 }}>
        {letters.map((g, i) => {
          const sag = interpolate(leak, [i * 0.08, 0.6 + i * 0.08], [0, 1], clamp);
          const sy = interpolate(sag, [0, 1], [1.12, 0.62]) * inflate;
          const sx = interpolate(sag, [0, 1], [1.05, 1.15]) * inflate;
          const droop = sag * (i % 2 ? 6 : -6);
          return (
            <span
              key={i}
              style={{
                fontFamily: T.tile,
                fontWeight: 800,
                fontSize: 230,
                lineHeight: 1,
                color: CREAM,
                WebkitTextStroke: `14px ${INK}`,
                paintOrder: "stroke",
                textShadow: `10px 12px 0 ${INK}`,
                display: "inline-block",
                transformOrigin: "50% 100%",
                transform: `scale(${sx}, ${sy}) rotate(${droop}deg)`,
              }}
            >
              {g}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}
