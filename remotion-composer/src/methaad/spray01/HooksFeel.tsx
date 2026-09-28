import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { about, BRASS, clamp, CREAM, FOREST, LIFT, PINE, SAGE, T } from "./style";

/**
 * Beats 5-6 — "จับผมดู ไม่เหนียวเหนอะหนะ" / "ของดีขวดเดียว ตอนนี้ลด 45%".
 * A touch ripples out of the hair, the sticky word stretches goo and snaps
 * clean, a didone "1" frames the one good bottle, and a cream price tag
 * swings down on its string beside the real bottle.
 */

/** "จับผมดู" with touch ripples radiating from the fingertips in the hair. */
export function TouchRipple({ x = 560, y = 840 }: { x?: number; y?: number }) {
  const frame = useCurrentFrame();
  const word = interpolate(frame, [0, 7], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        {[0, 6, 12].map((d) => {
          const p = interpolate(frame, [d, d + 14], [0, 1], clamp);
          if (p <= 0 || p >= 1) return null;
          return <circle key={d} cx={x} cy={y} r={30 + p * 220} fill="none" stroke={CREAM} strokeWidth={3 * (1 - p) + 0.5} opacity={1 - p} />;
        })}
        <circle cx={x} cy={y} r={10} fill={CREAM} opacity={interpolate(frame, [0, 3, 18], [0, 1, 0], clamp)} />
      </svg>
      <div
        style={{
          position: "absolute",
          left: 100,
          top: 160,
          fontFamily: T.touch,
          fontStyle: "italic",
          fontWeight: 200,
          fontSize: 170,
          lineHeight: "240px",
          color: CREAM,
          textShadow: LIFT,
          opacity: word,
          transform: `translateX(${(1 - word) * -40}px)`,
        }}
      >
        จับผมดู
      </div>
      <div
        style={{
          position: "absolute",
          left: 112,
          top: 405,
          fontFamily: T.latinItalic,
          fontWeight: 300,
          fontSize: 42,
          letterSpacing: 5,
          color: CREAM,
          opacity: word,
          borderTop: `2px dotted ${CREAM}`,
          paddingTop: 6,
          textShadow: LIFT,
        }}
      >
        the touch test
      </div>
    </AbsoluteFill>
  );
}

/** "เหนอะหนะ" is dragged down on gooey strands — they snap, the word hangs clean. */
export function SnapStrands({ snapAt = 13 }: { snapAt?: number }) {
  const frame = useCurrentFrame();
  const top = interpolate(frame, [0, 6], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const pull = interpolate(frame, [2, snapAt], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const snapped = frame >= snapAt;
  const recoil = interpolate(frame, [snapAt, snapAt + 8], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
  const drop = snapped ? 110 - recoil * 30 : pull * 110;
  const check = interpolate(frame, [snapAt + 2, snapAt + 12], [0, 1], clamp);
  const y1 = 360;
  const y2 = 420 + drop;
  const xs = [180, 300, 430, 560, 690, 800];
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        {xs.map((x, i) => {
          if (snapped) {
            const r = 1 - recoil;
            const len = (y2 - y1) * 0.35 * r;
            return (
              <g key={x} stroke={CREAM} strokeWidth={2} fill="none" opacity={r}>
                <path d={`M ${x} ${y1} q ${6} ${len * 0.6} ${-4} ${len}`} />
                <path d={`M ${x + 12} ${y2} q ${-6} ${-len * 0.6} ${4} ${-len}`} />
              </g>
            );
          }
          const sag = Math.sin(i * 1.7) * 18 * pull;
          const w = 5 - pull * 3.5;
          return (
            <path
              key={x}
              d={`M ${x - 10} ${y1} Q ${x + sag} ${(y1 + y2) / 2} ${x + 2} ${y2} L ${x + 22} ${y2} Q ${x + 12 + sag} ${(y1 + y2) / 2} ${x + 10} ${y1} Z`}
              fill={CREAM}
              opacity={0.75 * top}
              transform={`translate(${w} 0)`}
            />
          );
        })}
        <g opacity={check} stroke={SAGE} fill="none" strokeWidth={4} strokeLinecap="round">
          <circle cx={930} cy={y2 + 70} r={56} stroke={CREAM} strokeWidth={2} />
          <path d={`M 902 ${y2 + 72} L 922 ${y2 + 94} L 960 ${y2 + 48}`} stroke={CREAM} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - check} />
        </g>
      </svg>
      <div
        style={{
          position: "absolute",
          left: 100,
          top: 170,
          fontFamily: T.clean,
          fontWeight: 500,
          fontSize: 150,
          lineHeight: "200px",
          color: CREAM,
          textShadow: LIFT,
          opacity: top,
        }}
      >
        ไม่เหนียว
      </div>
      <div
        style={{
          position: "absolute",
          left: 110,
          top: y2 - 20,
          fontFamily: T.clean,
          fontWeight: 500,
          fontSize: 110,
          lineHeight: "170px",
          color: CREAM,
          textShadow: LIFT,
          opacity: top,
          transform: `scaleY(${snapped ? 1 : 1 + pull * 0.18})`,
          transformOrigin: "top left",
        }}
      >
        เหนอะหนะ
      </div>
    </AbsoluteFill>
  );
}

/** A giant didone "1" draws behind "ของดี / ขวดเดียว". */
export function OneBottle() {
  const frame = useCurrentFrame();
  const one = interpolate(frame, [0, 10], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const fill = interpolate(frame, [8, 16], [0, 1], clamp);
  const line = interpolate(frame, [6, 16], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        <g transform={about(830, 500, `scale(${1.2 - one * 0.2})`)} opacity={one}>
          <text x={830} y={760} textAnchor="middle" fontFamily={T.didone} fontWeight={400} fontSize={820} fill={CREAM} fillOpacity={fill * 0.18} stroke={CREAM} strokeWidth={3}>
            1
          </text>
        </g>
        <line x1={100} y1={485} x2={100 + 520 * line} y2={485} stroke={BRASS} strokeWidth={2} />
      </svg>
      <div
        style={{
          position: "absolute",
          left: 96,
          top: 230,
          fontFamily: T.ledger,
          fontWeight: 400,
          fontSize: 150,
          lineHeight: "220px",
          color: CREAM,
          textShadow: LIFT,
          opacity: one,
        }}
      >
        ของดี
      </div>
      <div
        style={{
          position: "absolute",
          left: 104,
          top: 505,
          fontFamily: T.ledger,
          fontWeight: 200,
          fontSize: 76,
          letterSpacing: interpolate(line, [0, 1], [30, 12]),
          color: CREAM,
          textShadow: LIFT,
          opacity: line,
        }}
      >
        ขวดเดียว
      </div>
    </AbsoluteFill>
  );
}

/** A cream price tag swings down on its string; "45%" is stamped on the number. */
export function PriceTag({ numberAt = 23 }: { numberAt?: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const drop = spring({ frame, fps, config: { damping: 14, stiffness: 120, mass: 0.8 } });
  const swing = Math.sin(frame * 0.32) * 9 * Math.exp(-frame / 16);
  const stamp = spring({ frame: frame - numberAt, fps, config: { damping: 9, stiffness: 220, mass: 0.6 } });
  const hx = 830;
  const hy = 330;
  const top = interpolate(drop, [0, 1], [-700, 0]);
  const W = 360;
  const H = 560;
  const x0 = hx - W / 2;
  const tag = `M ${x0 + 60} ${hy - 50} L ${x0 + W - 60} ${hy - 50} L ${x0 + W} ${hy + 10} L ${x0 + W} ${hy + H} L ${x0} ${hy + H} L ${x0} ${hy + 10} Z`;
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <g transform={`translate(0 ${top}) ${about(hx, hy, `rotate(${swing})`)}`}>
          <path d={`M ${hx} ${hy} C ${hx - 20} ${hy - 150}, ${hx + 30} ${hy - 260}, ${hx + 10} ${-40}`} stroke={CREAM} strokeWidth={2.5} fill="none" />
          <path d={tag} fill={CREAM} style={{ filter: "drop-shadow(0 18px 30px rgba(6,18,10,0.45))" }} />
          <path d={tag} fill="none" stroke={FOREST} strokeWidth={1.5} transform={about(hx, hy + H / 2, "scale(0.93)")} />
          <circle cx={hx} cy={hy} r={16} fill={PINE} />
          <circle cx={hx} cy={hy} r={16} fill="none" stroke={BRASS} strokeWidth={3} />
          {/* a small sprig on the tag corner */}
          <g fill="none" stroke={PINE} strokeWidth={2} strokeLinecap="round" transform={`translate(${x0 + W - 70} ${hy + H - 70})`}>
            <path d="M 0 0 C -10 -30, -30 -50, -60 -60" />
            <path d="M -22 -26 C -40 -30, -48 -14, -30 -8 C -24 -12, -20 -18, -22 -26 Z" />
            <path d="M -40 -46 C -44 -66, -26 -72, -22 -56 C -26 -52, -32 -48, -40 -46 Z" />
          </g>
          <text x={hx} y={hy + 90} textAnchor="middle" fontFamily={T.engraved} fontWeight={300} fontSize={46} fill={PINE} letterSpacing={6}>
            ตอนนี้
          </text>
          <text x={hx} y={hy + 210} textAnchor="middle" fontFamily={T.engraved} fontWeight={600} fontSize={120} fill={FOREST}>
            ลด
          </text>
          <line x1={x0 + 50} y1={hy + 250} x2={x0 + W - 50} y2={hy + 250} stroke={BRASS} strokeWidth={2} />
          <g transform={about(hx, hy + 380, `scale(${stamp})`)} opacity={Math.min(1, stamp * 2)}>
            <text x={hx - 18} y={hy + 440} textAnchor="middle" fontFamily={T.didone} fontWeight={600} fontSize={190} fill={FOREST} letterSpacing={-4}>
              45
            </text>
            <text x={hx + 130} y={hy + 400} textAnchor="middle" fontFamily={T.didoneItalic} fontSize={90} fill={BRASS}>
              %
            </text>
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
}
