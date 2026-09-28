import { AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame } from "remotion";
import { Canvas, clamp, usePop } from "../hooks/kit";
import { Footage, InkBoil, PanelFrame, Screentone } from "./ComicKit";
import { INK, M, NARR, PAPER, RED } from "./style";

/**
 * Beat G (9.89–10.89 s): manga focus brackets snap around his head, ripples
 * ring out from the fingertips and a hand-lettered "แตะ แตะ" ticks beside them.
 */
export function TapFocus({ hx, hy }: { hx: number; hy: number }) {
  const frame = useCurrentFrame();
  const snap = interpolate(frame, [0, 6], [1.35, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
  const o = interpolate(frame, [0, 3], [0, 1], clamp);
  const box = { x: 220, y: 560, w: 680, h: 700 };
  const L = 90;
  const corners = [
    [box.x, box.y, 1, 1],
    [box.x + box.w, box.y, -1, 1],
    [box.x, box.y + box.h, 1, -1],
    [box.x + box.w, box.y + box.h, -1, -1],
  ] as const;
  const cx = box.x + box.w / 2;
  const cy = box.y + box.h / 2;

  return (
    <AbsoluteFill>
      <Canvas>
        <g opacity={o} transform={`translate(${cx} ${cy}) scale(${snap}) translate(${-cx} ${-cy})`}>
          {corners.map(([x, y, sx, sy], i) => (
            <path
              key={i}
              d={`M ${x} ${y + sy * L} L ${x} ${y} L ${x + sx * L} ${y}`}
              fill="none"
              stroke={PAPER}
              strokeWidth={14}
              strokeLinecap="square"
            />
          ))}
        </g>
        {[3, 11, 19].map((at) => {
          const t = frame - at;
          if (t < 0) return null;
          const r = interpolate(t, [0, 12], [20, 150], { ...clamp, easing: Easing.out(Easing.quad) });
          return (
            <ellipse
              key={at}
              cx={hx}
              cy={hy}
              rx={r}
              ry={r * 0.6}
              fill="none"
              stroke={PAPER}
              strokeWidth={10}
              opacity={interpolate(t, [0, 12], [1, 0], clamp)}
            />
          );
        })}
        {[
          { at: 4, x: hx - 40, y: hy - 190, rot: -12 },
          { at: 13, x: hx + 130, y: hy - 250, rot: 8 },
        ].map((w) => {
          const p = usePopLocal(frame, w.at);
          return (
            <text
              key={w.at}
              x={w.x}
              y={w.y}
              fontFamily={M.hand}
              fontSize={96}
              textAnchor="middle"
              fill={INK}
              stroke={PAPER}
              strokeWidth={14}
              paintOrder="stroke"
              strokeLinejoin="round"
              opacity={Math.min(1, p)}
              transform={`rotate(${w.rot} ${w.x} ${w.y}) translate(0 ${(1 - p) * 30})`}
            >
              แตะ
            </text>
          );
        })}
      </Canvas>
    </AbsoluteFill>
  );
}

function usePopLocal(frame: number, at: number) {
  return interpolate(frame, [at, at + 4, at + 7], [0, 1.15, 1], clamp);
}

/** A 4-point shine glint. */
const glint = (x: number, y: number, r: number) =>
  `M ${x} ${y - r} Q ${x} ${y} ${x + r} ${y} Q ${x} ${y} ${x} ${y + r} Q ${x} ${y} ${x - r} ${y} Q ${x} ${y} ${x} ${y - r} Z`;

/** "ไม่เหนียว": the word is pulled tall by goo strings that snap, letting it settle. */
function NotSticky() {
  const frame = useCurrentFrame();
  const stretch = interpolate(frame, [2, 10, 14], [1.7, 1.7, 1], { ...clamp, easing: Easing.out(Easing.back(2.4)) });
  const strings = interpolate(frame, [9, 12], [1, 0], clamp);
  const o = interpolate(frame, [1, 4], [0, 1], clamp);
  return (
    <g opacity={o}>
      {[120, 240, 360, 470].map((x, i) =>
        strings > 0 ? (
          <path
            key={x}
            d={`M ${x} 830 Q ${x + 8} ${830 + 70 * strings} ${x - 4} ${830 + 120 * strings}`}
            stroke={PAPER}
            strokeWidth={12 - i}
            fill="none"
            strokeLinecap="round"
          />
        ) : null,
      )}
      <g transform={`translate(70 830) scale(1 ${stretch})`}>
        <text x={0} y={0} fontFamily={M.shout} fontSize={128} fill={PAPER} stroke={INK} strokeWidth={14} paintOrder="stroke" strokeLinejoin="round">
          ไม่เหนียว
        </text>
      </g>
    </g>
  );
}

/** "ไม่มัน": a shine glint pops, then a red ink cross cancels it. */
function NotGreasy() {
  const frame = useCurrentFrame();
  const word = usePop(0, 12);
  const shine = usePop(3, 9);
  const cross = interpolate(frame, [9, 14], [1, 0], clamp);
  return (
    <g>
      <g transform={`translate(80 1820) scale(${word})`}>
        <text x={0} y={0} fontFamily={M.shout} fontSize={140} fill={NARR} stroke={INK} strokeWidth={14} paintOrder="stroke" strokeLinejoin="round">
          ไม่มัน
        </text>
      </g>
      <g transform={`translate(560 1760) scale(${shine}) translate(-560 -1760)`}>
        <path d={glint(560, 1760, 70)} fill={PAPER} stroke={INK} strokeWidth={7} />
        {[
          "M 500 1700 L 620 1820",
          "M 620 1700 L 500 1820",
        ].map((d) => (
          <path key={d} d={d} stroke={RED} strokeWidth={20} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={cross} />
        ))}
      </g>
    </g>
  );
}

/**
 * Beat H (10.89–12.13 s): the frame becomes a two-panel manga page — the top
 * panel says "ไม่เหนียว", the second panel slides in on "ไม่มัน".
 */
export function ClaimPage({ second, dur }: { second: number; dur: number }) {
  const frame = useCurrentFrame();
  const slide = interpolate(frame, [second - 2, second + 4], [1150, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ background: PAPER }}>
      <PanelFrame x={30} y={34} w={1020} h={900} tilt={-0.8}>
        <Footage src="methaad03/c03.mp4" dur={dur} srcSeconds={2.1} position="50% 18%" zoomTo={1.06} />
      </PanelFrame>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <Screentone id="r6-page-tone" gap={16} r={4} color="#CFCBD4" />
        </defs>
        <rect x={30} y={968} width={1020} height={918} fill="url(#r6-page-tone)" stroke={INK} strokeWidth={9} />
      </svg>
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${slide}px)` }}>
        <PanelFrame x={30} y={968} w={1020} h={918} tilt={0.6}>
          <Footage src="methaad06/e10.mp4" dur={dur - second} srcSeconds={1.3} position="50% 58%" zoomTo={1.06} />
        </PanelFrame>
      </div>
      <Canvas>
        <NotSticky />
      </Canvas>
      {frame >= second ? (
        <Sequence from={second} layout="none">
          <Canvas>
            <NotGreasy />
          </Canvas>
        </Sequence>
      ) : null}
    </AbsoluteFill>
  );
}

/**
 * Beat I (12.13–13.22 s): a hand-lettered speech balloon bounces up with
 * "ไม่เหมือนแว็กซ์" while a red "≠" is stamped on its corner.
 */
export function NotWaxBalloon() {
  const frame = useCurrentFrame();
  const up = usePop(0, 11);
  const neq = usePop(8, 9);
  return (
    <AbsoluteFill>
      <Canvas>
        <defs>
          <InkBoil id="r6-balloon-boil" scale={3} />
        </defs>
        <g transform={`translate(0 ${(1 - up) * 500})`}>
          <g filter="url(#r6-balloon-boil)">
            <path d="M 470 1400 L 610 1250 L 560 1420 Z" fill={PAPER} stroke={INK} strokeWidth={9} strokeLinejoin="round" />
            <ellipse cx={500} cy={1540} rx={440} ry={160} fill={PAPER} stroke={INK} strokeWidth={9} />
            <path d="M 480 1395 L 600 1262 L 555 1430 Z" fill={PAPER} />
          </g>
          <text x={500} y={1575} fontFamily={M.hand} fontSize={100} textAnchor="middle" fill={INK}>
            ไม่เหมือนแว็กซ์
          </text>
        </g>
        <g transform={`translate(120 1390) scale(${neq * 1}) rotate(${-14 + Math.sin(frame / 4) * 3})`}>
          <circle r={82} fill={RED} stroke={INK} strokeWidth={8} />
          <path d="M -44 -18 L 44 -18 M -44 18 L 44 18 M 26 -56 L -26 56" stroke={PAPER} strokeWidth={15} strokeLinecap="round" />
        </g>
      </Canvas>
    </AbsoluteFill>
  );
}

/** 8-point seal = two overlapping squares. */
function Seal({ r }: { r: number }) {
  return (
    <g>
      <rect x={-r} y={-r} width={r * 2} height={r * 2} fill={RED} stroke={INK} strokeWidth={8} />
      <rect x={-r} y={-r} width={r * 2} height={r * 2} fill={RED} stroke={INK} strokeWidth={8} transform="rotate(45)" />
      <rect x={-r + 6} y={-r + 6} width={r * 2 - 12} height={r * 2 - 12} fill={RED} />
    </g>
  );
}

/**
 * Beat J (13.22–16.15 s): "เลิกงง" — the "งง" is slashed out in red ink and a
 * question mark tumbles away; then a manga title panel stamps "เริ่มติด",
 * and a red seal lands with the offer.
 */
export function EndPanel({ quitAt, stampAt, tagAt }: { quitAt: number; stampAt: number; tagAt: number }) {
  const frame = useCurrentFrame();
  const quit = usePop(quitAt, 12);
  const slash = interpolate(frame, [quitAt + 10, quitAt + 16], [1, 0], clamp);
  const fall = Math.max(0, frame - quitAt - 14);
  const out = interpolate(frame, [stampAt - 4, stampAt], [0, 1], clamp);
  const stamp = interpolate(frame, [stampAt, stampAt + 3, stampAt + 6], [1.8, 0.94, 1], { ...clamp, easing: Easing.out(Easing.quad) });
  const seal = usePop(tagAt, 10);

  return (
    <AbsoluteFill>
      <Canvas>
        <defs>
          <Screentone id="r6-title-tone" gap={12} r={3} color="#3A3640" />
        </defs>
        {out < 1 && frame >= quitAt ? (
          <g opacity={1 - out} transform={`translate(${(1 - quit) * -600} 0)`}>
            <text x={540} y={1640} fontFamily={M.shout} fontSize={180} textAnchor="middle" fill={PAPER} stroke={INK} strokeWidth={16} paintOrder="stroke" strokeLinejoin="round">
              เลิกงง
            </text>
            <path d="M 560 1600 C 650 1560, 760 1540, 880 1500" stroke={RED} strokeWidth={30} strokeLinecap="round" fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={slash} />
            <text
              x={940 + fall * 4}
              y={1440 + fall * fall * 1.1}
              fontFamily={M.shout}
              fontSize={150}
              fill={NARR}
              stroke={INK}
              strokeWidth={10}
              paintOrder="stroke"
              transform={`rotate(${fall * 9} ${940 + fall * 4} ${1440 + fall * fall * 1.1})`}
              opacity={interpolate(frame, [quitAt + 4, quitAt + 7], [0, 1], clamp)}
            >
              ?
            </text>
          </g>
        ) : null}
        {frame >= stampAt ? (
          <g transform={`translate(540 250) scale(${stamp}) rotate(-2)`}>
            <rect x={-400} y={-130} width={800} height={250} fill={INK} transform="translate(16 16)" />
            <rect x={-400} y={-130} width={800} height={250} fill={PAPER} stroke={INK} strokeWidth={12} />
            <rect x={-388} y={-118} width={776} height={226} fill="url(#r6-title-tone)" opacity={0.3} />
            <text x={0} y={52} fontFamily={M.shout} fontSize={150} textAnchor="middle" fill={RED} stroke={INK} strokeWidth={8} paintOrder="stroke" strokeLinejoin="round">
              เริ่มติด
            </text>
          </g>
        ) : null}
        {frame >= tagAt ? (
          <g transform={`translate(860 1640) scale(${seal}) rotate(${-10 + Math.sin(frame / 5) * 2})`}>
            <Seal r={135} />
            <text x={0} y={-8} fontFamily={M.box} fontWeight={700} fontSize={64} textAnchor="middle" fill={PAPER}>
              1 แถม 1
            </text>
            <text x={0} y={80} fontFamily={M.box} fontWeight={700} fontSize={70} textAnchor="middle" fill={NARR}>
              80.-
            </text>
          </g>
        ) : null}
      </Canvas>
    </AbsoluteFill>
  );
}
