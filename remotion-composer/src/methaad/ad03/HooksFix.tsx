import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Canvas, clamp, graphemes, useIn, usePop } from "../hooks/kit";
import { about, AMBER, INK, OK, PAPER, SIGNAL, T } from "./style";

/** The fix (clipboard checklist + stopwatch) and the deal (store status widget). */

const ROWS = [
  { text: "ผมแห้ง", at: 30 },
  { text: "โรยโคน", at: 53 },
  { text: "ขยำ", at: 77 },
  { text: "จัดทรง", at: 91 },
] as const;

const CARD_X = 150;
const CARD_Y = 1335;
const ROW_Y = 1545;
const ROW_H = 82;

/** Marker check with a lead-in hook, drawn in one stroke. */
function MarkerCheck({ x, y, p }: { x: number; y: number; p: number }) {
  const len = 140;
  return (
    <path
      d={`M ${x - 26} ${y - 2} Q ${x - 18} ${y - 6} ${x - 8} ${y + 18} Q ${x + 10} ${y - 20} ${x + 42} ${y - 44}`}
      stroke={OK}
      strokeWidth={13}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      strokeDasharray={len}
      strokeDashoffset={len * (1 - p)}
    />
  );
}

function ChecklistCard({ exitAt }: { exitAt: number }) {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 9], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.4)) });
  const exit = interpolate(frame, [exitAt, exitAt + 6], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const done = ROWS.filter((r) => frame >= r.at).length;
  const dy = interpolate(enter, [0, 1], [640, 0]) + exit * 700;
  const rot = interpolate(enter, [0, 1], [5, -1.5]) + exit * 6;
  return (
    <g transform={`translate(0 ${dy}) ${about(540, 1600, `rotate(${rot})`)}`}>
      <rect x={CARD_X + 14} y={CARD_Y + 18} width={780} height={520} rx={16} fill="rgba(0,0,0,0.45)" />
      <rect x={CARD_X} y={CARD_Y} width={780} height={520} rx={16} fill="#9B7247" stroke={INK} strokeWidth={4} />
      <rect x={CARD_X + 26} y={CARD_Y + 40} width={728} height={462} fill={PAPER} stroke={INK} strokeWidth={3} />
      {/* spring clip */}
      <rect x={430} y={CARD_Y - 26} width={220} height={74} rx={14} fill="#B9BCC2" stroke={INK} strokeWidth={5} />
      <rect x={480} y={CARD_Y - 8} width={120} height={20} rx={10} fill="#6E7178" />
      <text x={CARD_X + 60} y={CARD_Y + 118} fontFamily={T.manual} fontWeight={700} fontSize={58} fill={INK}>
        วิธีที่ถูก
      </text>
      <text x={CARD_X + 720} y={CARD_Y + 118} textAnchor="end" fontFamily={T.sign} fontWeight={800} fontSize={58} fill={done === 4 ? OK : SIGNAL}>
        {`${done}/4`}
      </text>
      <line x1={CARD_X + 50} x2={CARD_X + 730} y1={CARD_Y + 142} y2={CARD_Y + 142} stroke={INK} strokeWidth={3} />
      {ROWS.map((r, i) => {
        const y = ROW_Y + i * ROW_H;
        const p = interpolate(frame, [r.at, r.at + 6], [0, 1], clamp);
        const hl = interpolate(frame, [r.at + 1, r.at + 7], [0, 1], { ...clamp, easing: Easing.out(Easing.quad) });
        const bump = r.at <= frame ? interpolate(frame - r.at, [0, 3, 8], [1, 1.12, 1], clamp) : 1;
        return (
          <g key={r.text} transform={about(CARD_X + 120, y, `scale(${bump})`)}>
            <rect x={CARD_X + 180} y={y - 48} width={300 * hl} height={58} fill={AMBER} opacity={0.75} />
            <rect x={CARD_X + 72} y={y - 50} width={58} height={58} fill="#FFFFFF" stroke={INK} strokeWidth={5} />
            <text x={CARD_X + 190} y={y + 4} fontFamily={T.hand} fontWeight={700} fontSize={60} fill={p > 0 ? INK : "#A9A499"}>
              {r.text}
            </text>
            <MarkerCheck x={CARD_X + 104} y={y - 18} p={p} />
          </g>
        );
      })}
    </g>
  );
}

/** Stopwatch that snaps into frame on "สิบวิจบ": hand whips round and stops at the 10 s mark. */
function Stopwatch({ at }: { at: number }) {
  const frame = useCurrentFrame();
  const snap = usePop(at, 9);
  if (frame < at) return null;
  const t = frame - at;
  const hand = interpolate(t, [0, 6], [-300, 60], { ...clamp, easing: Easing.out(Easing.cubic) });
  const press = t >= 6 && t < 9 ? 10 : 0;
  const cx = 540;
  const cy = 470;
  const r = 190;
  return (
    <g transform={about(cx, cy, `scale(${snap}) rotate(${interpolate(t, [6, 8, 11], [0, -4, 0], clamp)})`)}>
      <circle cx={cx + 14} cy={cy + 18} r={r + 20} fill="rgba(0,0,0,0.45)" />
      <rect x={cx - 36} y={cy - r - 70 + press} width={72} height={50} rx={8} fill="#B9BCC2" stroke={INK} strokeWidth={5} />
      <rect x={cx - 18} y={cy - r - 26} width={36} height={30} fill="#8C8F96" stroke={INK} strokeWidth={4} />
      <circle cx={cx} cy={cy} r={r + 20} fill={SIGNAL} stroke={INK} strokeWidth={6} />
      <circle cx={cx} cy={cy} r={r - 6} fill="#FFFFFF" stroke={INK} strokeWidth={5} />
      <path
        d={`M ${cx} ${cy} L ${cx} ${cy - r + 26} A ${r - 26} ${r - 26} 0 0 1 ${cx + (r - 26) * Math.sin(Math.PI / 3)} ${cy - (r - 26) * Math.cos(Math.PI / 3)} Z`}
        fill={AMBER}
        opacity={t >= 6 ? 0.8 : 0}
      />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return (
          <line
            key={i}
            x1={cx + Math.sin(a) * (r - 22)}
            y1={cy - Math.cos(a) * (r - 22)}
            x2={cx + Math.sin(a) * (r - (i % 3 === 0 ? 52 : 38))}
            y2={cy - Math.cos(a) * (r - (i % 3 === 0 ? 52 : 38))}
            stroke={INK}
            strokeWidth={i % 3 === 0 ? 7 : 4}
          />
        );
      })}
      <text x={cx} y={cy + 110} textAnchor="middle" fontFamily={T.sign} fontWeight={800} fontSize={84} fill={INK}>
        10 วิ
      </text>
      <line
        x1={cx}
        y1={cy}
        x2={cx + Math.sin((hand * Math.PI) / 180) * (r - 40)}
        y2={cy - Math.cos((hand * Math.PI) / 180) * (r - 40)}
        stroke={INK}
        strokeWidth={10}
        strokeLinecap="round"
      />
      <circle cx={cx} cy={cy} r={16} fill={INK} />
    </g>
  );
}

export function FixChecklistHook({ stopAt }: { stopAt: number }) {
  return (
    <AbsoluteFill>
      <Canvas>
        <ChecklistCard exitAt={stopAt} />
        <Stopwatch at={stopAt} />
      </Canvas>
    </AbsoluteFill>
  );
}

/** Deal: "ใครยังไม่มี" types in a chip, then a live store-status pill grows out of its green dot. */
export function DealStatusHook({ liveAt }: { liveAt: number }) {
  const frame = useCurrentFrame();
  const chip = useIn(0, 6);
  const lead = graphemes("ใครยังไม่มี");
  const typed = Math.min(lead.length, Math.floor(interpolate(frame, [2, 14], [0, lead.length], clamp)));
  const cursor = Math.floor(frame / 8) % 2 === 0;
  const grow = interpolate(frame, [liveAt, liveAt + 9], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.3)) });
  const textIn = useIn(liveAt + 5, 6);
  const blink = 0.35 + 0.65 * (0.5 + 0.5 * Math.cos((frame - liveAt) / 3.2));
  const ring = ((frame - liveAt) % 24) / 24;
  const checking = frame >= liveAt + 8 && frame < liveAt + 17;
  const statusIn = usePop(liveAt + 17, 10);
  const pillW = 160 + 700 * grow;
  const px = 540 - pillW / 2;
  const py = 1520;
  return (
    <AbsoluteFill>
      <Canvas>
        <g opacity={chip} transform={`translate(0 ${interpolate(chip, [0, 1], [30, 0])})`}>
          <rect x={120} y={1380} width={470} height={96} rx={14} fill="rgba(18,18,22,0.88)" />
          <text x={150} y={1446} fontFamily={T.ui} fontWeight={500} fontSize={58} fill="#FFFFFF">
            {lead.slice(0, typed).join("")}
            {cursor ? "|" : ""}
          </text>
        </g>
        {frame >= liveAt ? (
          <g>
            <rect x={px + 10} y={py + 14} width={pillW} height={160} rx={80} fill="rgba(0,0,0,0.4)" />
            <rect x={px} y={py} width={pillW} height={160} rx={80} fill="#111114" stroke="#FFFFFF" strokeWidth={4} />
            <circle cx={px + 80} cy={py + 80} r={24 + ring * 34} fill="none" stroke="#3BE37F" strokeWidth={5} opacity={1 - ring} />
            <circle cx={px + 80} cy={py + 80} r={24} fill="#3BE37F" opacity={blink} />
            <g opacity={textIn}>
              <text x={px + 140} y={py + 112} fontFamily={T.ui} fontWeight={700} fontSize={96} fill="#FFFFFF">
                โปร 1 แถม 1
              </text>
            </g>
          </g>
        ) : null}
        {checking ? (
          <g>
            <rect x={300} y={1720} width={480} height={100} rx={50} fill="#FFFFFF" stroke={INK} strokeWidth={4} />
            <text x={540} y={1788} textAnchor="middle" fontFamily={T.ui} fontWeight={500} fontSize={48} fill="#77736B">
              {`กำลังเช็ค${".".repeat(1 + (Math.floor(frame / 3) % 3))}`}
            </text>
          </g>
        ) : null}
        {frame >= liveAt + 17 ? (
          <g transform={about(540, 1770, `scale(${statusIn})`)}>
            <rect x={270} y={1712} width={540} height={116} rx={58} fill="#FFFFFF" stroke={OK} strokeWidth={7} />
            <text x={330} y={1792} fontFamily={T.ui} fontWeight={500} fontSize={52} fill="#55524B">
              สถานะ
            </text>
            <text x={490} y={1796} fontFamily={T.ui} fontWeight={700} fontSize={70} fill={OK}>
              ยังอยู่
            </text>
          </g>
        ) : null}
      </Canvas>
    </AbsoluteFill>
  );
}
