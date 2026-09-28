import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { graphemes } from "../hooks/kit";
import { about, CAM, CEDAR, clamp, FRAME, hash, INK, LEAF, RED, S, WHITE } from "./style";

/**
 * Beat 2 — "ผมแบนแปะหนังหัว หน้าก็ดูกลมไปอีก".
 * A press plate slams "แบน" flat; then the camera's face-shape scan shows
 * how a flat top frames the face round (drawn heads, styling perception only).
 */

const BASE_Y = 1600;

/** A plate slams down and squashes "แบน" flat; "แปะหนังหัว" sticks on below. */
export function FlatPress() {
  const frame = useCurrentFrame();
  const drop = interpolate(frame, [2, 7], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const squash = interpolate(frame, [7, 10], [1, 0.62], { ...clamp, easing: Easing.out(Easing.cubic) });
  const lift = interpolate(frame, [14, 20], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const plateY = interpolate(drop, [0, 1], [150, BASE_Y - 232 + (1 - squash) * 232]) - lift * 260;
  const shake = frame >= 7 && frame < 12 ? (hash(frame) - 0.5) * 18 : 0;
  const sticker = interpolate(frame, [11, 16], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2.2)) });
  const puff = interpolate(frame, [7, 16], [0, 1], clamp);

  return (
    <AbsoluteFill>
      <svg {...FRAME}>
        <g transform={`translate(${shake} 0)`}>
          {/* the squashed word, pivoting on its baseline */}
          <g transform={about(540, BASE_Y, `scale(${1 + (1 - squash) * 0.45} ${squash})`)}>
            <text x={540} y={BASE_Y} textAnchor="middle" fontFamily={S.flat} fontSize={300} fill={WHITE} stroke={INK} strokeWidth={18} strokeLinejoin="round" style={{ paintOrder: "stroke" }}>
              แบน
            </text>
          </g>
          {/* press plate */}
          <g opacity={frame >= 2 ? 1 - lift : 0}>
            <rect x={150} y={plateY - 60} width={780} height={60} rx={8} fill={INK} />
            {Array.from({ length: 13 }, (_, i) => (
              <path key={i} d={`M ${170 + i * 60} ${plateY - 8} l 30 -44`} stroke={CAM} strokeWidth={14} />
            ))}
            <rect x={500} y={plateY - 170} width={80} height={112} fill={INK} />
          </g>
          {/* dust puffs at the impact */}
          {puff > 0 && puff < 1
            ? Array.from({ length: 8 }, (_, i) => {
                const side = i % 2 === 0 ? -1 : 1;
                const x = 540 + side * (260 + puff * (120 + hash(i) * 140));
                const y = BASE_Y - 10 - hash(i * 3) * 70 - puff * 30;
                return <circle key={i} cx={x} cy={y} r={10 + puff * 22} fill="none" stroke={WHITE} strokeWidth={5} opacity={1 - puff} />;
              })
            : null}
        </g>
        <g transform={about(540, 1712, `rotate(-3) scale(${sticker})`)}>
          <rect x={250} y={1650} width={580} height={124} rx={14} fill={CAM} stroke={INK} strokeWidth={6} />
          <text x={540} y={1738} textAnchor="middle" fontFamily={S.flat} fontSize={76} fill={INK}>
            แปะหนังหัว
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
}

interface HeadProps {
  cx: number;
  cy: number;
  /** 0 = flat, 1 = volume. */
  lift: number;
  draw: number;
}

/** A plain drawn head (no one in particular): face, ears, neck, and a hair shape. */
function Head({ cx, cy, lift, draw }: HeadProps) {
  const top = cy - 150 - lift * 110;
  const hair = `M ${cx - 118} ${cy - 40} C ${cx - 130} ${cy - 150}, ${cx - 70} ${top}, ${cx - 10} ${top + lift * 10}
    C ${cx + 60} ${top - lift * 20}, ${cx + 132} ${cy - 150}, ${cx + 118} ${cy - 40}
    C ${cx + 90} ${cy - 110 + lift * 20}, ${cx - 90} ${cy - 110 + lift * 20}, ${cx - 118} ${cy - 40} Z`;
  return (
    <g>
      <path d={`M ${cx - 46} ${cy + 140} V ${cy + 200} M ${cx + 46} ${cy + 140} V ${cy + 200}`} stroke={INK} strokeWidth={8} strokeLinecap="round" pathLength={1} strokeDasharray={`${draw} 1`} />
      <ellipse cx={cx - 118} cy={cy + 10} rx={16} ry={30} fill={WHITE} stroke={INK} strokeWidth={7} opacity={draw} />
      <ellipse cx={cx + 118} cy={cy + 10} rx={16} ry={30} fill={WHITE} stroke={INK} strokeWidth={7} opacity={draw} />
      <path d={`M ${cx - 112} ${cy - 30} C ${cx - 118} ${cy + 90}, ${cx - 60} ${cy + 165}, ${cx} ${cy + 168} C ${cx + 60} ${cy + 165}, ${cx + 118} ${cy + 90}, ${cx + 112} ${cy - 30}`} fill={WHITE} stroke={INK} strokeWidth={8} pathLength={1} strokeDasharray={`${draw} 1`} />
      <circle cx={cx - 40} cy={cy + 30} r={8} fill={INK} opacity={draw} />
      <circle cx={cx + 40} cy={cy + 30} r={8} fill={INK} opacity={draw} />
      <path d={`M ${cx - 26} ${cy + 100} Q ${cx} ${cy + 116} ${cx + 26} ${cy + 100}`} stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" opacity={draw} />
      <path d={hair} fill={INK} opacity={draw} />
    </g>
  );
}

/** The camera's face-shape scan: flat top -> round guide; lifted top -> longer guide. */
export function FaceShape() {
  const frame = useCurrentFrame();
  const card = interpolate(frame, [0, 6], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.4)) });
  const left = interpolate(frame, [3, 10], [0, 1], clamp);
  const ring = interpolate(frame, [9, 17], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const stamp = interpolate(frame, [15, 20], [1.8, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const right = interpolate(frame, [21, 27], [0, 1], clamp);
  const oval = interpolate(frame, [25, 33], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const scan = interpolate(frame, [4, 20], [560, 1300], clamp);
  const title = graphemes("หน้าก็ดูกลม");

  return (
    <AbsoluteFill>
      <svg {...FRAME}>
        <g transform={about(540, 960, `scale(${card})`)}>
          <rect x={70} y={330} width={940} height={1280} rx={36} fill={WHITE} />
          <rect x={70} y={330} width={940} height={96} rx={36} fill={INK} />
          <rect x={70} y={380} width={940} height={46} fill={INK} />
          <circle cx={130} cy={378} r={12} fill={RED} opacity={Math.floor(frame / 4) % 2 ? 1 : 0.3} />
          <text x={160} y={392} fontFamily={S.ui} fontWeight={700} fontSize={40} fill={CAM} letterSpacing={3}>
            FACE SHAPE SCAN
          </text>

          {/* LEFT: flat hair */}
          <Head cx={300} cy={820} lift={0} draw={left} />
          <circle cx={300} cy={840} r={235} fill="none" stroke={RED} strokeWidth={9} strokeDasharray="22 16" pathLength={1000} strokeDashoffset={0} opacity={ring} transform={about(300, 840, `rotate(${-90 + ring * 90})`)} />
          <text x={300} y={1180} textAnchor="middle" fontFamily={S.shape} fontWeight={700} fontSize={54} fill={INK} opacity={left}>
            ผมแบน
          </text>
          <g transform={about(300, 1260, `scale(${stamp})`)} opacity={frame >= 15 ? 1 : 0}>
            <rect x={160} y={1205} width={280} height={96} rx={48} fill={RED} />
            <text x={300} y={1272} textAnchor="middle" fontFamily={S.shape} fontWeight={700} fontSize={58} fill={WHITE}>
              ดูกลม
            </text>
          </g>

          {/* RIGHT: lifted hair, smaller, arrives second */}
          <g opacity={right}>
            <Head cx={790} cy={840} lift={1} draw={right} />
            <ellipse cx={790} cy={800} rx={190} ry={290} fill="none" stroke={CEDAR} strokeWidth={9} strokeDasharray="22 16" opacity={oval} />
            <text x={790} y={1180} textAnchor="middle" fontFamily={S.shape} fontWeight={700} fontSize={54} fill={INK}>
              ผมตั้ง
            </text>
            <rect x={640} y={1205} width={300} height={96} rx={48} fill={LEAF} opacity={oval} />
            <text x={790} y={1272} textAnchor="middle" fontFamily={S.shape} fontWeight={700} fontSize={58} fill={INK} opacity={oval}>
              ดูเรียว
            </text>
          </g>

          {/* scan line sweeping the left head */}
          {frame < 21 ? <rect x={80} y={scan} width={450} height={6} fill={CAM} opacity={0.9} /> : null}

          {/* title */}
          <text x={540} y={1490} textAnchor="middle" fontFamily={S.shape} fontWeight={700} fontSize={104} fill={INK}>
            {title.slice(0, Math.max(0, Math.floor((frame - 2) / 1.2))).join("")}
          </text>
          <path d="M 250 1530 Q 540 1560 830 1530" stroke={RED} strokeWidth={10} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${ring} 1`} />
        </g>
      </svg>
    </AbsoluteFill>
  );
}
