import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Canvas, clamp, usePop } from "../hooks/kit";
import { about, DUSK_PINK, INK, MAP_BLUE, T, WHITE } from "./style";

const ROUTE = "M 150 1650 C 260 1650 280 1540 400 1540 S 560 1640 680 1600 S 820 1520 900 1530";

/**
 * Dusk map widget: drawn streets, the route line racing from "you" to a pin
 * that drops in with a hand-written note "ไปต่อกับเพื่อน".
 */
export function MapCard({ pinAt }: { pinAt: number }) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const pop = usePop(0, 13);
  const route = interpolate(frame, [3, pinAt], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const drop = spring({ frame: frame - pinAt, fps, config: { damping: 8, stiffness: 220, mass: 0.6 } });
  const note = interpolate(frame, [pinAt + 4, pinAt + 10], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
  const out = interpolate(frame, [durationInFrames - 5, durationInFrames], [0, 1], clamp);
  const you = 1 + Math.sin(frame * 0.5) * 0.18;
  return (
    <Canvas>
      <defs>
        <clipPath id="sp9-map">
          <rect x={52} y={1450} width={976} height={270} rx={46} />
        </clipPath>
      </defs>
      <g transform={about(540, 1585, `scale(${pop * (1 - out * 0.12)})`)} opacity={1 - out}>
        <rect x={52} y={1462} width={976} height={270} rx={46} fill="#000" opacity={0.25} />
        <g clipPath="url(#sp9-map)">
          <rect x={52} y={1450} width={976} height={270} fill="#232447" />
          {/* blocks + streets */}
          {[
            [90, 1470, 170, 70],
            [300, 1470, 220, 50],
            [560, 1470, 160, 90],
            [760, 1560, 200, 60],
            [90, 1690, 260, 60],
            [430, 1650, 200, 70],
          ].map(([x, y, w, h], i) => (
            <rect key={i} x={x} y={y} width={w} height={h} rx={10} fill="#2E3060" />
          ))}
          <path d="M 52 1600 L 1028 1580" stroke="#3B3E78" strokeWidth={26} />
          <path d="M 360 1450 L 380 1720" stroke="#3B3E78" strokeWidth={20} />
          <path d="M 740 1450 L 720 1720" stroke="#3B3E78" strokeWidth={20} />
          <path d={ROUTE} stroke={MAP_BLUE} strokeWidth={22} fill="none" strokeLinecap="round" opacity={0.35} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - route} />
          <path d={ROUTE} stroke="#7FB2FF" strokeWidth={10} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - route} />
        </g>
        {/* you-are-here dot */}
        <circle cx={150} cy={1650} r={30 * you} fill={MAP_BLUE} opacity={0.3} />
        <circle cx={150} cy={1650} r={17} fill={MAP_BLUE} stroke={WHITE} strokeWidth={6} />
        {/* the pin */}
        {frame >= pinAt ? (
          <g transform={`translate(900 ${1530 - (1 - drop) * 180})`}>
            <ellipse cx={0} cy={4} rx={20 * drop} ry={7 * drop} fill="#000" opacity={0.35} />
            <path d="M 0 0 C -12 -26 -40 -44 -40 -74 A 40 40 0 1 1 40 -74 C 40 -44 12 -26 0 0 Z" fill={DUSK_PINK} stroke={WHITE} strokeWidth={6} />
            <circle cx={0} cy={-74} r={15} fill={WHITE} />
          </g>
        ) : null}
        {/* hand-written note bubble */}
        <g transform={about(560, 1500, `scale(${note}) rotate(-3)`)} opacity={note > 0 ? 1 : 0}>
          <rect x={300} y={1432} width={530} height={120} rx={26} fill={WHITE} />
          <path d="M 790 1540 L 850 1520 L 800 1500 Z" fill={WHITE} />
          <text x={565} y={1518} textAnchor="middle" fontFamily={T.note} fontSize={70} fill={INK}>
            ไปต่อกับเพื่อน
          </text>
        </g>
      </g>
    </Canvas>
  );
}

/**
 * "ทรงยังไม่แบน": a drawn flat-iron slab slams down and squashes the word —
 * it springs straight back up and bounces the slab off frame.
 */
export function NotFlat({ slamAt }: { slamAt: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inPop = usePop(0, 11);
  const fall = interpolate(frame, [slamAt - 5, slamAt], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const back = spring({ frame: frame - slamAt - 3, fps, config: { damping: 6, stiffness: 240, mass: 0.5 } });
  const squash = frame < slamAt ? 1 : frame < slamAt + 3 ? 0.42 : 0.42 + back * 0.58;
  const slabY = frame < slamAt ? -380 + fall * 530 : frame < slamAt + 3 ? 150 : 150 - back * 1050;
  const slabR = frame < slamAt + 3 ? 0 : -back * 25;
  const TOP = 560;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 0, width: 1080, top: TOP - 112, textAlign: "center", fontFamily: T.ui, fontWeight: 700, fontSize: 52, color: WHITE, textShadow: "0 3px 12px rgba(0,0,0,0.55)", opacity: inPop }}>
        ทรงยัง
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          width: 1080,
          top: TOP,
          height: 200,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          transformOrigin: "50% 100%",
          transform: `scale(${inPop * (1 + (1 - squash) * 0.35)}, ${inPop * squash})`,
        }}
      >
        <span style={{ fontFamily: T.spring, fontSize: 190, lineHeight: "200px", color: DUSK_PINK, WebkitTextStroke: `4px ${WHITE}`, textShadow: `0 10px 0 ${INK}` }}>ไม่แบน</span>
      </div>
      <Canvas>
        {frame >= slamAt - 5 && slabY > -850 ? (
          <g transform={`translate(0 ${slabY + TOP - 1548}) ${about(540, 1470, `rotate(${slabR})`)}`}>
            <rect x={250} y={1440} width={580} height={62} rx={14} fill="#3A3F4B" stroke={WHITE} strokeWidth={5} />
            <rect x={470} y={1372} width={140} height={74} rx={16} fill="#2A2E38" stroke={WHITE} strokeWidth={5} />
            <path d="M 280 1458 L 520 1458" stroke={WHITE} strokeOpacity={0.35} strokeWidth={8} strokeLinecap="round" />
          </g>
        ) : null}
      </Canvas>
    </AbsoluteFill>
  );
}
