import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { PaperFilter, WobbleFilter, WriteOn } from "./paper";
import { about, BIC, clamp, D, hash, INK, PAPER, RULE } from "./style";

/**
 * Day 3. A ballpoint note on a torn notebook strip with a doodled arrow that
 * hunts down to the hair root; then "ขยำ" is written on a scrap that gets
 * crumpled in the fist, in time with the scrunch.
 */

interface RootArrowProps {
  /** Beat-local frame of the second shot: the note gets underlined twice. */
  underlineAt: number;
}

export function RootArrow({ underlineAt }: RootArrowProps) {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [7, 19], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const head = interpolate(frame, [18, 22], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2.5)) });
  const strip = interpolate(frame, [0, 4], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const u1 = interpolate(frame, [underlineAt, underlineAt + 4], [0, 1], clamp);
  const u2 = interpolate(frame, [underlineAt + 3, underlineAt + 7], [0, 1], clamp);
  const x = 60;
  const y = 1440;
  const w = 620;
  const h = 170;
  const torn = Array.from({ length: 21 }, (_, i) => `${x + (i * w) / 20},${y + h + (hash(i * 13) - 0.5) * 14}`).join(" ");

  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <PaperFilter id="d7-strip-grain" seed={21} />
          <WobbleFilter id="d7-arrow-wobble" scale={5} seed={31} />
        </defs>
        <g transform={about(x, y + h, `rotate(3) scale(1 ${strip})`)}>
          <polygon points={`${x},${y} ${x + w},${y} ${torn.split(" ").reverse().join(" ")}`} fill="rgba(0,0,0,0.3)" transform="translate(8 10)" />
          <polygon points={`${x},${y} ${x + w},${y} ${torn.split(" ").reverse().join(" ")}`} fill={PAPER} filter="url(#d7-strip-grain)" />
          {[62, 122].map((dy) => (
            <line key={dy} x1={x} x2={x + w} y1={y + dy} y2={y + dy} stroke={RULE} strokeWidth={3} />
          ))}
          <line x1={x + 70} x2={x + 70} y1={y} y2={y + h} stroke="#E88A8A" strokeWidth={3} />
          <WriteOn id="d7-strip-pen" x={x + 80} y={y} w={w - 90} h={h} from={2} dur={9}>
            <text x={x + 96} y={y + 112} fontFamily={D.pen} fontSize={100} fill={BIC}>
              โรยที่โคน
            </text>
          </WriteOn>
          <g stroke={BIC} strokeWidth={7} fill="none" strokeLinecap="round" filter="url(#d7-arrow-wobble)">
            <path d={`M ${x + 96} ${y + 138} L ${x + 96 + 440 * u1} ${y + 132}`} />
            <path d={`M ${x + 110} ${y + 152} L ${x + 110 + 420 * u2} ${y + 148}`} />
          </g>
        </g>
        <g stroke={BIC} strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" filter="url(#d7-arrow-wobble)">
          <path
            d="M 150 1430 C 40 1250, 50 960, 180 830 C 260 750, 350 720, 440 715"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - draw}
          />
          {head > 0 ? <path d="M 392 672 L 450 715 L 396 762" transform={about(450, 715, `scale(${head})`)} /> : null}
        </g>
      </svg>
    </AbsoluteFill>
  );
}

/** "ขยำ" on a scrap of paper that crumples in pulses with the scrunch. */
export function CrumpleWord() {
  const frame = useCurrentFrame();
  const c = interpolate(frame, [4, 12, 16, 24], [0, 0.55, 0.45, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const enter = interpolate(frame, [0, 4], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
  const cx = 540;
  const cy = 1500;
  const w = 540;
  const h = 290;
  const n = 14;
  const corner = (i: number, bx: number, by: number) => {
    const j = c * 34;
    return `${bx + (hash(i * 5.1) - 0.5) * j},${by + (hash(i * 3.7) - 0.5) * j}`;
  };
  const top = Array.from({ length: n + 1 }, (_, i) => corner(i, cx - w / 2 + (i * w) / n, cy - h / 2));
  const right = Array.from({ length: 5 }, (_, i) => corner(40 + i, cx + w / 2, cy - h / 2 + (i * h) / 4));
  const bottom = Array.from({ length: n + 1 }, (_, i) => corner(80 + i, cx + w / 2 - (i * w) / n, cy + h / 2));
  const left = Array.from({ length: 5 }, (_, i) => corner(120 + i, cx - w / 2, cy + h / 2 - (i * h) / 4));
  const outline = [...top, ...right, ...bottom, ...left].join(" ");
  const squeeze = 1 - c * 0.24;
  const creases = Array.from({ length: 9 }, (_, i) => {
    const x1 = cx - w / 2 + hash(i * 9) * w;
    const y1 = cy - h / 2 + hash(i * 4) * h;
    const x2 = x1 + (hash(i * 6) - 0.5) * 260;
    const y2 = y1 + (hash(i * 8) - 0.5) * 200;
    return <path key={i} d={`M ${x1} ${y1} L ${(x1 + x2) / 2 + 18} ${(y1 + y2) / 2 - 12} L ${x2} ${y2}`} />;
  });

  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <PaperFilter id="d7-scrap-grain" seed={41} strength={0.18} />
          <filter id="d7-scrap-crush" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves={2} seed={5} result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale={c * 30} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
        <g transform={about(cx, cy, `rotate(${-5 + c * 9}) scale(${enter * squeeze} ${enter * (1 - c * 0.1)})`)} filter="url(#d7-scrap-crush)">
          <polygon points={outline} fill="rgba(0,0,0,0.35)" transform="translate(10 14)" />
          <polygon points={outline} fill="#F4EFE2" filter="url(#d7-scrap-grain)" />
          <g stroke="rgba(27,27,34,0.3)" strokeWidth={2.5} fill="none" opacity={c}>
            {creases}
          </g>
          <text x={cx} y={cy + 72} textAnchor="middle" fontFamily={D.scrap} fontWeight={700} fontSize={210} fill={INK}>
            ขยำ
          </text>
          <g opacity={c * 0.55}>
            {creases.map((cr, i) => (
              <g key={i} transform="translate(3 3)" stroke="rgba(255,255,255,0.8)" strokeWidth={2} fill="none">
                {cr}
              </g>
            ))}
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
}
