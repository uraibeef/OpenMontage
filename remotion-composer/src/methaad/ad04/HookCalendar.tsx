import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { clamp, INK, P, PEN_BLUE, STAMP_RED } from "./style";

/**
 * Beat 7 (14.50–17.01 s): a paper wall calendar. Every morning gets a little
 * scissors mark (a barber visit), red pen crosses the rows out, then an ink
 * seal "ขวดเดียวจบ" lands on the month.
 */

const COLS = 7;
const ROWS = 5;
const CELL = 128;
const GRID_W = CELL * COLS;
const LEFT = (1080 - GRID_W) / 2;
const TOP = 960;
const HEAD = 150;
const WEEK = 56;
const DAYS = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];
const FIRST_COL = 6; // 1 มี.ค. falls on a Saturday
const TOTAL = 31;

interface CalendarProps {
  markFrom: number;
  crossFrom: number;
  crossRow: number;
  stampAt: number;
}

function Scissors({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} stroke={INK} strokeWidth={3.5} fill="none" strokeLinecap="round">
      <circle cx={-12} cy={10} r={7} />
      <circle cx={12} cy={10} r={7} />
      <path d="M -7 5 L 10 -18 M 7 5 L -10 -18" />
    </g>
  );
}

function Cross({ x, y, p }: { x: number; y: number; p: number }) {
  const r = 42;
  return (
    <g stroke={STAMP_RED} strokeWidth={9} strokeLinecap="round" fill="none">
      <path d={`M ${x - r} ${y - r} L ${x + r} ${y + r}`} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.min(1, p * 2)} />
      <path d={`M ${x + r} ${y - r} L ${x - r} ${y + r}`} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.max(0, p * 2 - 1)} />
    </g>
  );
}

function Seal({ at }: { at: number }) {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const t = interpolate(frame, [at, at + 4], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const cx = 540;
  const cy = TOP + HEAD + WEEK + (CELL * ROWS) / 2 - 10;
  return (
    <g transform={`translate(${cx} ${cy}) rotate(-9) scale(${interpolate(t, [0, 1], [2.1, 1])})`} opacity={interpolate(t, [0, 0.5, 1], [0, 0.7, 0.95])}>
      <rect x={-440} y={-150} width={880} height={300} rx={20} fill="#FBF8F0" />
      <g filter="url(#r4-seal-ink)">
        <rect x={-440} y={-150} width={880} height={300} rx={20} fill="none" stroke={PEN_BLUE} strokeWidth={16} />
        <rect x={-414} y={-124} width={828} height={248} rx={8} fill="none" stroke={PEN_BLUE} strokeWidth={5} strokeDasharray="22 10" />
        <text x={0} y={52} textAnchor="middle" fontFamily={P.sticker} fontWeight={900} fontSize={150} fill={PEN_BLUE}>
          ขวดเดียวจบ
        </text>
      </g>
    </g>
  );
}

export function HookCalendar({ markFrom, crossFrom, crossRow, stampAt }: CalendarProps) {
  const frame = useCurrentFrame();
  const hang = interpolate(frame, [0, 8], [1, 0], { ...clamp, easing: Easing.out(Easing.back(1.4)) });
  const hit = interpolate(frame, [stampAt + 3, stampAt + 5, stampAt + 11], [0, 1, 0], clamp);
  const H = HEAD + WEEK + CELL * ROWS + 30;

  return (
    <AbsoluteFill>
      <svg
        width={1080}
        height={1920}
        viewBox="0 0 1080 1920"
        style={{ position: "absolute", inset: 0, overflow: "visible", transform: `translate(${hit * 6}px, ${hang * 1000 + hit * 12}px) rotate(${1.5 - hit * 0.6}deg)` }}
      >
        <defs>
          <filter id="r4-seal-ink" x="-10%" y="-20%" width="120%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.08" numOctaves={3} seed={23} result="n" />
            <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -3 2.9" result="pits" />
            <feComposite in="SourceGraphic" in2="pits" operator="in" />
          </filter>
          <filter id="r4-cal-paper">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={5} result="g" />
            <feColorMatrix in="g" type="matrix" values="0 0 0 0 0.3  0 0 0 0 0.28  0 0 0 0 0.24  0 0 0 0.12 0" result="tint" />
            <feComposite in="tint" in2="SourceGraphic" operator="in" result="grain" />
            <feMerge>
              <feMergeNode in="SourceGraphic" />
              <feMergeNode in="grain" />
            </feMerge>
          </filter>
        </defs>
        <rect x={LEFT - 24} y={TOP - 18} width={GRID_W + 48} height={H} rx={10} fill="rgba(0,0,0,0.35)" transform="translate(12 18)" />
        <rect x={LEFT - 24} y={TOP - 18} width={GRID_W + 48} height={H} rx={10} fill="#FBF8F0" filter="url(#r4-cal-paper)" />
        <rect x={LEFT - 24} y={TOP - 18} width={GRID_W + 48} height={HEAD} rx={10} fill={STAMP_RED} />
        {Array.from({ length: 12 }, (_, i) => (
          <g key={i}>
            <circle cx={LEFT + 20 + i * 76} cy={TOP + 8} r={9} fill="#2A0C0C" />
            <path d={`M ${LEFT + 20 + i * 76} ${TOP + 8} q -6 -30 6 -40`} stroke="#9A9AA2" strokeWidth={6} fill="none" strokeLinecap="round" />
          </g>
        ))}
        <text x={LEFT + 10} y={TOP + 108} fontFamily={P.print} fontWeight={700} fontSize={70} fill="#fff">
          มีนาคม
        </text>
        <text x={LEFT + GRID_W - 10} y={TOP + 106} textAnchor="end" fontFamily={P.print} fontWeight={500} fontSize={40} fill="rgba(255,255,255,0.8)">
          จ้างช่างเซ็ตทุกเช้า
        </text>
        {DAYS.map((d, c) => (
          <text key={d} x={LEFT + c * CELL + CELL / 2} y={TOP + HEAD + 26} textAnchor="middle" fontFamily={P.print} fontWeight={700} fontSize={32} fill={c === 0 ? STAMP_RED : INK}>
            {d}
          </text>
        ))}
        {Array.from({ length: ROWS + 1 }, (_, r) => (
          <line key={r} x1={LEFT} x2={LEFT + GRID_W} y1={TOP + HEAD + WEEK + r * CELL} y2={TOP + HEAD + WEEK + r * CELL} stroke="rgba(23,23,27,0.18)" strokeWidth={2} />
        ))}
        {Array.from({ length: TOTAL }, (_, i) => {
          const slot = (FIRST_COL + i) % (COLS * ROWS);
          const col = slot % COLS;
          const row = Math.floor(slot / COLS);
          const x = LEFT + col * CELL;
          const y = TOP + HEAD + WEEK + row * CELL;
          const m = interpolate(frame, [markFrom + i * 0.35, markFrom + i * 0.35 + 3], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
          const crossAt = crossFrom + row * crossRow + col * 0.6;
          const p = interpolate(frame, [crossAt, crossAt + 4], [0, 1], clamp);
          return (
            <g key={i}>
              <text x={x + 14} y={y + 40} fontFamily={P.print} fontWeight={700} fontSize={32} fill={col === 0 ? STAMP_RED : INK}>
                {i + 1}
              </text>
              {m > 0 ? <Scissors x={x + CELL / 2 + 16} y={y + CELL / 2 + 22} s={m * 1.15} /> : null}
              {p > 0 ? <Cross x={x + CELL / 2} y={y + CELL / 2} p={p} /> : null}
            </g>
          );
        })}
        <Seal at={stampAt} />
      </svg>
    </AbsoluteFill>
  );
}
