import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { graphemes } from "../hooks/kit";
import { CAM, clamp, FRAME, INK, LIFT, RED, S, WHITE } from "./style";

/**
 * Beat 1 — "เลิกส่องหน้าได้แล้ว มองทรงผมมึงบ้าง".
 * The camera's face-detect box sits on his face; a finger drags the focus
 * box up off the face and onto the hair: "FOCUS: ทรงผม".
 */

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

export const FACE_BOX: Box = { x: 400, y: 620, w: 520, h: 600 };
const HAIR_BOX: Box = { x: 170, y: 270, w: 740, h: 380 };

const lerpBox = (a: Box, b: Box, t: number): Box => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
  w: a.w + (b.w - a.w) * t,
  h: a.h + (b.h - a.h) * t,
});

/** iOS-style focus square: corner ticks + mid ticks, with a sun slider. */
function FocusSquare({ box, color, pulse, label }: { box: Box; color: string; pulse: number; label: string }) {
  const { x, y, w, h } = box;
  const c = 54;
  const corners = `M ${x} ${y + c} V ${y} H ${x + c} M ${x + w - c} ${y} H ${x + w} V ${y + c} M ${x + w} ${y + h - c} V ${y + h} H ${x + w - c} M ${x + c} ${y + h} H ${x} V ${y + h - c}`;
  const mids = `M ${x + w / 2} ${y} v 20 M ${x + w / 2} ${y + h} v -20 M ${x} ${y + h / 2} h 20 M ${x + w} ${y + h / 2} h -20`;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="none" stroke={color} strokeWidth={3} opacity={0.55 * pulse} />
      <path d={corners} fill="none" stroke={color} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
      <path d={mids} stroke={color} strokeWidth={5} />
      <g transform={`translate(${x + w + 34} ${y + h / 2})`}>
        <path d="M 0 -70 V -26 M 0 26 V 70" stroke={color} strokeWidth={4} />
        <circle r={15} fill="none" stroke={color} strokeWidth={5} />
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i / 8) * Math.PI * 2;
          return <path key={i} d={`M ${Math.cos(a) * 21} ${Math.sin(a) * 21} L ${Math.cos(a) * 27} ${Math.sin(a) * 27}`} stroke={color} strokeWidth={4} strokeLinecap="round" />;
        })}
      </g>
      <rect x={x} y={y - 72} width={Math.max(220, label.length * 27 + 44)} height={58} rx={10} fill={color} />
      <text x={x + 22} y={y - 30} fontFamily={S.ui} fontWeight={700} fontSize={36} fill={INK}>
        {label}
      </text>
    </g>
  );
}

/** Face-detect locks on the face; a camera toast says "เลิกส่องหน้า" and gets struck out. */
export function FaceLock() {
  const frame = useCurrentFrame();
  const lock = interpolate(frame, [0, 6], [1.35, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const blink = frame < 10 ? (Math.floor(frame / 2) % 2 === 0 ? 1 : 0.35) : 1;
  const toast = interpolate(frame, [3, 9], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.6)) });
  const strike = interpolate(frame, [20, 27], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const box = { ...FACE_BOX };
  const cx = box.x + box.w / 2;
  const cy = box.y + box.h / 2;

  return (
    <AbsoluteFill>
      <svg {...FRAME}>
        <g transform={`translate(${cx} ${cy}) scale(${lock}) translate(${-cx} ${-cy})`} opacity={blink}>
          <FocusSquare box={box} color={CAM} pulse={1} label="FACE 99%" />
        </g>
        <g transform={`translate(540 1560) scale(${toast}) translate(-540 -1560)`}>
          <rect x={120} y={1470} width={840} height={180} rx={90} fill="rgba(11,11,12,0.78)" />
          <circle cx={215} cy={1560} r={42} fill={CAM} />
          <path d="M 196 1560 h 38 M 215 1541 v 38" stroke={INK} strokeWidth={8} strokeLinecap="round" transform="rotate(45 215 1560)" />
          <text x={600} y={1592} textAnchor="middle" fontFamily={S.toast} fontWeight={800} fontSize={96} fill={WHITE}>
            เลิกส่องหน้า
          </text>
          <path d="M 300 1566 H 900" stroke={RED} strokeWidth={18} strokeLinecap="round" pathLength={1} strokeDasharray={`${strike} 1`} />
        </g>
      </svg>
    </AbsoluteFill>
  );
}

/** A finger drags the focus box from the face up onto the hair: "FOCUS: ทรงผม". */
export function FocusDrag() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const drag = interpolate(frame, [2, 13], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const box = lerpBox(FACE_BOX, HAIR_BOX, drag);
  const landed = frame >= 13;
  const settle = landed ? interpolate(frame, [13, 18], [1.08, 1], { ...clamp, easing: Easing.out(Easing.back(3)) }) : 1;
  const cx = box.x + box.w / 2;
  const cy = box.y + box.h / 2;
  const finger = interpolate(frame, [0, 2, 13, 17], [0, 1, 1, 0], clamp);
  const words = graphemes("มองทรงผม");

  return (
    <AbsoluteFill>
      <svg {...FRAME}>
        <g transform={`translate(${cx} ${cy}) scale(${settle}) translate(${-cx} ${-cy})`}>
          <FocusSquare box={box} color={CAM} pulse={landed ? 1 : 0.4} label={landed ? "FOCUS: ทรงผม" : "FACE"} />
        </g>
        {/* drag trail + fingertip */}
        <path d={`M ${FACE_BOX.x + FACE_BOX.w / 2} ${FACE_BOX.y + FACE_BOX.h / 2} L ${cx} ${cy}`} stroke={CAM} strokeWidth={6} strokeDasharray="4 18" strokeLinecap="round" opacity={finger * 0.9} />
        <circle cx={cx} cy={cy} r={46} fill="rgba(255,255,255,0.35)" stroke={WHITE} strokeWidth={5} opacity={finger} />
      </svg>
      {/* hook: letters drop in from the hair box, like they were pulled down from it */}
      <div style={{ position: "absolute", top: 1330, width: "100%", textAlign: "center", fontFamily: S.look, fontStyle: "italic", fontWeight: 900, fontSize: 170, lineHeight: "210px", whiteSpace: "nowrap" }}>
        {words.map((ch, i) => {
          const s = spring({ frame: frame - 8 - i, fps, config: { damping: 12, stiffness: 220, mass: 0.6 } });
          return (
            <span key={i} style={{ display: "inline-block", transform: `translateY(${(1 - s) * -260}px)`, opacity: s > 0.02 ? 1 : 0, color: CAM, WebkitTextStroke: `12px ${INK}`, paintOrder: "stroke fill", textShadow: LIFT }}>
              {ch}
            </span>
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          top: 1560,
          width: "100%",
          textAlign: "center",
          fontFamily: S.look,
          fontStyle: "italic",
          fontWeight: 900,
          fontSize: 110,
          color: WHITE,
          WebkitTextStroke: `10px ${INK}`,
          paintOrder: "stroke fill",
          opacity: interpolate(frame, [18, 21], [0, 1], clamp),
          transform: `scale(${interpolate(frame, [18, 23], [1.6, 1], { ...clamp, easing: Easing.out(Easing.cubic) })})`,
        }}
      >
        มึงบ้าง
      </div>
    </AbsoluteFill>
  );
}
