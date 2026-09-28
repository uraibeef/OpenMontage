import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { about, ALERT, AMBER, clamp, GO, INK, PAPER, R } from "./style";

/**
 * Beats 10-11: the finish. A drawn bus pulls in and a conductor's punch
 * clips the ticket "ทันรถพอดี"; he breaks the finish tape "หัวไม่แบน";
 * an office key card beeps green "เข้าออฟฟิศ"; the deal lands as a sticker.
 */

function Bus({ x }: { x: number }) {
  return (
    <g transform={`translate(${x} 0)`}>
      <rect x={60} y={760} width={980} height={440} rx={40} fill="#1F6F8B" stroke={INK} strokeWidth={8} />
      <rect x={60} y={1030} width={980} height={46} fill={AMBER} />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={250 + i * 190} y={810} width={160} height={180} rx={14} fill="#10222C" stroke="#9FD3E6" strokeWidth={4} />
      ))}
      <rect x={96} y={810} width={120} height={330} rx={10} fill="#0D1C24" stroke="#9FD3E6" strokeWidth={4} />
      <line x1={156} y1={810} x2={156} y2={1140} stroke="#9FD3E6" strokeWidth={4} />
      <rect x={80} y={700} width={300} height={70} rx={10} fill={INK} />
      <text x={230} y={752} textAnchor="middle" fontFamily={R.hud} fontWeight={700} fontSize={46} fill={AMBER}>
        สาย 8
      </text>
      {[270, 860].map((wx) => (
        <g key={wx}>
          <circle cx={wx} cy={1200} r={78} fill={INK} />
          <circle cx={wx} cy={1200} r={34} fill="#9AA3AF" />
        </g>
      ))}
    </g>
  );
}

/** Drawn shot: the bus brakes into the stop, the ticket gets punched. */
export function BusShot() {
  const frame = useCurrentFrame();
  const arrive = interpolate(frame, [0, 9], [1150, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const rock = frame >= 9 ? Math.sin((frame - 9) * 0.9) * 5 * Math.exp(-(frame - 9) / 6) : 0;
  const ticket = interpolate(frame, [6, 12], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.8)) });
  const punch = interpolate(frame, [14, 16, 19], [0, 1, 0], clamp);
  const holed = frame >= 16;
  const tx = 150;
  const ty = 1380;

  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg,#F7C98B 0%,#F2E4C8 45%,#CFD6DC 100%)" }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <mask id="r10-ticket-hole">
            <rect x={0} y={0} width={1080} height={1920} fill="#FFFFFF" />
            {holed ? <circle cx={tx + 690} cy={ty + 150} r={30} fill="#000000" /> : null}
          </mask>
        </defs>
        {/* skyline */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect key={i} x={i * 190 - 20} y={420 + (i % 3) * 90} width={170} height={900} fill={i % 2 ? "#E3C9A4" : "#D7BC98"} />
        ))}
        <rect x={0} y={1260} width={1080} height={660} fill="#8D96A0" />
        <rect x={0} y={1260} width={1080} height={26} fill="#E9ECEF" />
        {/* bus stop pole */}
        <rect x={960} y={560} width={16} height={720} fill="#4B525C" />
        <rect x={900} y={520} width={136} height={110} rx={14} fill="#1467B3" stroke="#FFFFFF" strokeWidth={5} />
        <text x={968} y={594} textAnchor="middle" fontFamily={R.hud} fontWeight={700} fontSize={42} fill="#FFFFFF">
          ป้าย
        </text>
        <g transform={about(540, 1280, `rotate(${rock})`)}>
          <Bus x={arrive} />
        </g>
        {/* ticket */}
        <g transform={about(tx + 380, ty + 150, `rotate(-5) scale(${ticket})`)} mask="url(#r10-ticket-hole)">
          <rect x={tx + 12} y={ty + 16} width={760} height={300} rx={8} fill="rgba(0,0,0,0.3)" />
          <rect x={tx} y={ty} width={760} height={300} rx={8} fill={PAPER} stroke={INK} strokeWidth={4} />
          <line x1={tx + 600} y1={ty + 16} x2={tx + 600} y2={ty + 284} stroke={INK} strokeWidth={4} strokeDasharray="10 10" />
          <text x={tx + 36} y={ty + 72} fontFamily={R.print} fontWeight={500} fontSize={38} fill="#5A6270" letterSpacing={3}>
            ตั๋วรถเมล์ · สาย 8
          </text>
          <text x={tx + 300} y={ty + 210} textAnchor="middle" fontFamily={R.print} fontWeight={700} fontSize={112} fill={INK}>
            ทันรถพอดี
          </text>
          <text x={tx + 690} y={ty + 260} textAnchor="middle" fontFamily={R.hud} fontWeight={700} fontSize={34} fill={GO}>
            00:03
          </text>
        </g>
        {/* conductor's punch */}
        {punch > 0 ? (
          <g transform={`translate(${tx + 690 + 30} ${ty + 150 - 20}) rotate(-5)`}>
            <path d={`M -40 ${-150 + punch * 70} L 90 ${-190 + punch * 70} L 110 -60 L -10 -40 Z`} fill="#6E7682" stroke={INK} strokeWidth={5} />
            <path d={`M -40 ${150 - punch * 70} L 90 ${190 - punch * 70} L 110 60 L -10 40 Z`} fill="#6E7682" stroke={INK} strokeWidth={5} />
          </g>
        ) : null}
        {holed && frame < 24 ? (
          <circle cx={tx + 690} cy={ty + 150} r={30 + (frame - 16) * 10} fill="none" stroke={GO} strokeWidth={6} opacity={1 - (frame - 16) / 8} />
        ) : null}
      </svg>
    </AbsoluteFill>
  );
}

/** Checkered finish tape snaps; "หัวไม่แบน" rises with lift ticks. */
export function FinishTape() {
  const frame = useCurrentFrame();
  const snap = interpolate(frame, [5, 12], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const word = interpolate(frame, [6, 11], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2.2)) });
  const y = 1560;
  const checks = (x0: number, w: number) =>
    Array.from({ length: Math.ceil(w / 36) * 2 }, (_, i) => {
      const col = Math.floor(i / 2);
      const row = i % 2;
      return (col + row) % 2 ? <rect key={i} x={x0 + col * 36} y={y - 36 + row * 36} width={36} height={36} fill={INK} /> : null;
    });

  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        <g transform={about(0, y, `rotate(${snap * 38}) translate(${-snap * 260} 0)`)} opacity={1 - snap * 0.8}>
          <rect x={-20} y={y - 36} width={560} height={72} fill="#FFFFFF" />
          {checks(-20, 560)}
        </g>
        <g transform={about(1080, y, `rotate(${-snap * 38}) translate(${snap * 260} 0)`)} opacity={1 - snap * 0.8}>
          <rect x={540} y={y - 36} width={560} height={72} fill="#FFFFFF" />
          {checks(540, 560)}
        </g>
        <g transform={about(540, y + 60, `scale(${word}) translate(0 ${(1 - word) * 60})`)}>
          {[-300, -150, 0, 150, 300].map((dx, i) => {
            const lift = interpolate(frame, [9 + i, 15 + i], [0, 1], clamp);
            return <line key={dx} x1={540 + dx} y1={y - 60 - lift * 20} x2={540 + dx} y2={y - 110 - lift * 40} stroke={GO} strokeWidth={10} strokeLinecap="round" opacity={lift} />;
          })}
          <text x={540} y={y + 80} textAnchor="middle" fontFamily={R.hud} fontWeight={700} fontSize={170} fill="#FFFFFF" stroke={INK} strokeWidth={14} strokeLinejoin="round" style={{ paintOrder: "stroke" }}>
            หัวไม่แบน
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
}

/** An office key card taps a reader: red → green, "เข้าออฟฟิศ". */
export function KeyCard() {
  const frame = useCurrentFrame();
  const tap = interpolate(frame, [0, 6], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.6)) });
  const ok = frame >= 7;
  const beep = interpolate(frame, [7, 15], [0, 1], clamp);
  const x = 540;
  const y = 1560;

  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        {/* reader */}
        <rect x={x + 150} y={y - 170} width={220} height={320} rx={26} fill="#1B1F26" stroke="#5B6472" strokeWidth={5} />
        <circle cx={x + 260} cy={y - 100} r={22} fill={ok ? GO : ALERT} />
        {ok ? <circle cx={x + 260} cy={y - 100} r={22 + beep * 50} fill="none" stroke={GO} strokeWidth={6} opacity={1 - beep} /> : null}
        {/* card */}
        <g transform={`translate(${interpolate(tap, [0, 1], [-700, 0])} 0) rotate(${-8 + tap * 4} ${x} ${y})`}>
          <rect x={x - 440} y={y - 140} width={600} height={300} rx={26} fill="rgba(0,0,0,0.35)" transform="translate(12 14)" />
          <rect x={x - 440} y={y - 140} width={600} height={300} rx={26} fill={PAPER} stroke={INK} strokeWidth={5} />
          <rect x={x - 440} y={y - 140} width={600} height={70} rx={26} fill={ok ? GO : "#3B4452"} />
          <rect x={x - 440} y={y - 100} width={600} height={30} fill={ok ? GO : "#3B4452"} />
          <text x={x - 140} y={y + 70} textAnchor="middle" fontFamily={R.hud} fontWeight={700} fontSize={96} fill={INK}>
            เข้าออฟฟิศ
          </text>
          {ok ? (
            <path d={`M ${x - 180} ${y - 108} l 16 16 l 30 -30`} stroke="#FFFFFF" strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          ) : null}
        </g>
      </svg>
    </AbsoluteFill>
  );
}

/** Round deal sticker slapped onto the product shot. */
export function DealSticker() {
  const frame = useCurrentFrame();
  const slap = interpolate(frame, [2, 7], [2.2, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const op = interpolate(frame, [2, 4], [0, 1], clamp);
  const cx = 250;
  const cy = 430;
  const teeth = Array.from({ length: 48 }, (_, i) => {
    const a = (i / 48) * Math.PI * 2;
    const r = i % 2 ? 190 : 172;
    return `${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`;
  }).join(" ");

  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        <g opacity={op} transform={about(cx, cy, `scale(${slap}) rotate(-10)`)}>
          <polygon points={teeth} fill="rgba(0,0,0,0.35)" transform="translate(10 14)" />
          <polygon points={teeth} fill={AMBER} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
          <circle cx={cx} cy={cy} r={146} fill="none" stroke={INK} strokeWidth={3} strokeDasharray="6 8" />
          <text x={cx} y={cy - 8} textAnchor="middle" fontFamily={R.alert} fontStyle="italic" fontWeight={900} fontSize={88} fill={INK}>
            1 แถม 1
          </text>
          <text x={cx} y={cy + 88} textAnchor="middle" fontFamily={R.hud} fontWeight={700} fontSize={80} fill={ALERT}>
            ฿80
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
}
