import { AbsoluteFill, Easing, interpolate, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { PunchIn } from "../../fxkit";
import { graphemes } from "../hooks/kit";
import { BONE, clamp, CORAL, CORAL_DK, INK, MINT, NIGHT, T } from "./style";

/** Where card 3 shrinks to; the three avatars line up here. */
export const AVATARS = [
  { src: "methaspray07/t1a.mp4", x: 230, at: 1 },
  { src: "methaspray07/t2c.mp4", x: 540, at: 4 },
  { src: "methaspray07/t3c.mp4", x: 850, at: 99 }, // arrives as the shrinking card 3
] as const;
export const AVATAR_Y = 860;
export const AVATAR_D = 250;
const HOPS = [8, 13, 18];

function Circle({ src, x, y, d, border }: { src: string; x: number; y: number; d: number; border: string }) {
  return (
    <div style={{ position: "absolute", left: x - d / 2, top: y - d / 2, width: d, height: d, borderRadius: d / 2, overflow: "hidden", border: `8px solid ${border}`, boxShadow: "0 16px 40px rgba(0,0,0,0.5)", backgroundColor: NIGHT }}>
      <OffthreadVideo src={staticFile(src)} muted style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 38%" }} />
    </div>
  );
}

/**
 * Beat E1 — "ถ้ามึงเป็นสักแบบ" (local 0 = 10.37 s). Three avatars in a row;
 * a mint selection ring hops across them and each gets a tick — any one fits.
 * "สักแบบ?" is a hand-marker scrawl with a looping underline.
 */
export function AnyOfThree() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const hop = HOPS.reduce((acc, at, i) => (frame >= at ? i : acc), -1);
  const ringX = hop < 0 ? AVATARS[0].x : AVATARS[hop].x;
  const ringPop = hop < 0 ? 0 : spring({ frame: frame - HOPS[hop], fps, config: { damping: 10, stiffness: 240, mass: 0.5 } });
  const lead = interpolate(frame, [0, 6], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const g = graphemes("สักแบบ?");
  const shown = Math.round(interpolate(frame, [6, 16], [0, g.length], clamp));
  const under = interpolate(frame, [14, 22], [0, 1], clamp);
  return (
    <AbsoluteFill>
      {AVATARS.slice(0, 2).map((a) => {
        const s = spring({ frame: frame - a.at, fps, config: { damping: 11, stiffness: 200, mass: 0.6 } });
        return (
          <div key={a.src} style={{ position: "absolute", inset: 0, transform: `scale(${s})`, transformOrigin: `${a.x}px ${AVATAR_Y}px` }}>
            <Circle src={a.src} x={a.x} y={AVATAR_Y} d={AVATAR_D} border={BONE} />
          </div>
        );
      })}
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        {/* the shrunk card 3 gets the same bone rim as the other two avatars */}
        <circle cx={AVATARS[2].x} cy={AVATAR_Y} r={AVATAR_D / 2 - 2} fill="none" stroke={BONE} strokeWidth={8} opacity={interpolate(frame, [1, 4], [0, 1], clamp)} />
        {hop >= 0 ? (
          <circle cx={ringX} cy={AVATAR_Y} r={(AVATAR_D / 2 + 26) * (0.8 + 0.2 * ringPop)} fill="none" stroke={MINT} strokeWidth={10} strokeDasharray="30 16" transform={`rotate(${frame * 6} ${ringX} ${AVATAR_Y})`} />
        ) : null}
        {AVATARS.map((a, i) =>
          hop >= i ? (
            <g key={a.src} transform={`translate(${a.x + 86} ${AVATAR_Y - 90})`}>
              <circle r={36} fill={MINT} stroke={NIGHT} strokeWidth={6} />
              <path d="M -15 1 L -4 12 L 16 -11" fill="none" stroke={INK} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
            </g>
          ) : null,
        )}
        <path d="M 330 1330 C 480 1352 640 1344 780 1318 C 820 1312 830 1330 800 1336" fill="none" stroke={CORAL} strokeWidth={12} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - under} />
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 470, textAlign: "center", fontFamily: T.ui, fontWeight: 600, fontSize: 64, color: "rgba(246,241,231,0.85)", opacity: lead, transform: `translateY(${(1 - lead) * -30}px)` }}>
        ถ้ามึงเป็น...
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1100, textAlign: "center", fontFamily: T.marker, fontSize: 190, color: BONE, transform: "rotate(-4deg)" }}>
        {g.slice(0, shown).join("")}
      </div>
    </AbsoluteFill>
  );
}

/** Full-bleed product plate behind the match screen. */
function Plate({ src, dur }: { src: string; dur: number }) {
  const frame = useCurrentFrame();
  const push = interpolate(frame, [0, dur], [1.02, 1.1], clamp);
  return (
    <PunchIn amount={0.06}>
      <AbsoluteFill style={{ scale: push }}>
        <OffthreadVideo src={staticFile(src)} muted style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(1.05) contrast(1.05)" }} />
      </AbsoluteFill>
    </PunchIn>
  );
}

/**
 * Beat E2 — "ขวดนี้ช่วยได้" (local 0 = 11.2 s). The app's match screen:
 * the real bottle spraying behind, "It's a Match!" in script, his avatar
 * and the bottle's avatar slide together with a heart, then "ลด 45%".
 */
export function ItsAMatch({ bgSplit, end }: { bgSplit: number; end: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const title = spring({ frame: frame - 1, fps, config: { damping: 9, stiffness: 180, mass: 0.6 } });
  const meet = interpolate(frame, [0, 8], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.4)) });
  const heart = spring({ frame: frame - 7, fps, config: { damping: 7, stiffness: 260, mass: 0.5 } });
  const words = ["ขวดนี้", "ช่วยได้"];
  const deal = spring({ frame: frame - 13, fps, config: { damping: 9, stiffness: 220, mass: 0.6 } });
  const d = 330;
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={bgSplit}>
        <Plate src="methaspray/p03.mp4" dur={bgSplit} />
      </Sequence>
      <Sequence from={bgSplit} durationInFrames={end - bgSplit}>
        <Plate src="methaspray/p04.mp4" dur={end - bgSplit} />
      </Sequence>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(14,31,25,0.78) 0%, rgba(14,31,25,0.35) 34%, rgba(14,31,25,0.35) 52%, rgba(14,31,25,0.86) 72%, rgba(14,31,25,0.92) 100%)" }} />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 190,
          textAlign: "center",
          fontFamily: T.script,
          fontSize: 172,
          color: MINT,
          transform: `scale(${title}) rotate(-5deg)`,
          textShadow: `0 0 30px ${MINT}99, 0 6px 0 ${INK}`,
        }}
      >
        It&apos;s a Match!
      </div>
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${(1 - meet) * -700}px)` }}>
        <Circle src="methaspray07/t3c.mp4" x={375} y={900} d={d} border={BONE} />
      </div>
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${(1 - meet) * 700}px)` }}>
        <Circle src="methaspray/p06.mp4" x={705} y={900} d={d} border={MINT} />
      </div>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(540 905) scale(${heart})`}>
          <circle r={70} fill={CORAL} stroke={BONE} strokeWidth={8} />
          <path d="M 0 30 C -44 2 -40 -34 -16 -34 C -6 -34 0 -26 0 -20 C 0 -26 6 -34 16 -34 C 40 -34 44 2 0 30 Z" fill={BONE} transform="translate(0 4) scale(0.95)" />
        </g>
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1150, display: "flex", justifyContent: "center", gap: 24 }}>
        {words.map((w, i) => {
          const s = spring({ frame: frame - 2 - i * 5, fps, config: { damping: 10, stiffness: 230, mass: 0.6 } });
          return (
            <span key={w} style={{ fontFamily: T.name, fontWeight: 900, fontSize: 124, color: i === 1 ? MINT : BONE, transform: `translateY(${(1 - s) * 80}px)`, opacity: Math.min(1, s * 1.5), display: "inline-block" }}>
              {w}
            </span>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1350, display: "flex", justifyContent: "center" }}>
        <div
          style={{
            fontFamily: T.name,
            fontWeight: 900,
            fontSize: 96,
            color: BONE,
            background: `linear-gradient(180deg, ${CORAL} 0%, ${CORAL_DK} 100%)`,
            padding: "4px 70px 14px",
            borderRadius: 80,
            transform: `scale(${deal})`,
            boxShadow: `0 14px 36px ${CORAL}88`,
          }}
        >
          ลด 45%
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1560, textAlign: "center", fontFamily: T.ui, fontWeight: 600, fontSize: 38, letterSpacing: 1, color: "rgba(246,241,231,0.9)", opacity: interpolate(frame, [14, 20], [0, 1], clamp) }}>
          MAKE SENSE · สเปรย์ฉีดก่อนจัดแต่งทรงผม
      </div>
    </AbsoluteFill>
  );
}
