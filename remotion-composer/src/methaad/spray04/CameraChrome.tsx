import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { CAM, clamp, f, FRAME, INK, S, WHITE } from "./style";

/**
 * The front-camera app frame that rides the whole ad: black status bar on
 * top (flash, zoom pill, flip), black mode strip at the bottom. The mode
 * strip slides SELFIE -> PORTRAIT when the spray arrives and -> PHOTO for
 * the deal. The opaque bars also keep creator watermarks out of view.
 */

const TOP_H = 150;
const BOT_Y = 1796;
const MODES = ["VIDEO", "SELFIE", "PORTRAIT", "PHOTO"] as const;
const SLOT = 250;

interface ChromeProps {
  /** VO seconds where the mode strip switches to PORTRAIT and PHOTO. */
  portraitAt: number;
  photoAt: number;
}

function modePos(frame: number, portraitAt: number, photoAt: number) {
  const ease = { ...clamp, easing: Easing.inOut(Easing.cubic) };
  const toPortrait = interpolate(frame, [f(portraitAt), f(portraitAt) + 7], [0, 1], ease);
  const toPhoto = interpolate(frame, [f(photoAt), f(photoAt) + 7], [0, 1], ease);
  return 1 + toPortrait + toPhoto;
}

function Bolt() {
  return (
    <g transform="translate(92 88)">
      <circle r={40} fill="rgba(255,255,255,0.12)" />
      <path d="M 6 -26 L -14 4 H 2 L -6 26 L 16 -6 H 0 Z" fill={WHITE} />
    </g>
  );
}

function Flip() {
  return (
    <g transform="translate(988 88)" fill="none" stroke={WHITE} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round">
      <circle r={40} fill="rgba(255,255,255,0.12)" stroke="none" />
      <path d="M -20 -4 A 20 20 0 0 1 16 -12 M 16 -12 L 18 -24 M 16 -12 L 4 -14" />
      <path d="M 20 4 A 20 20 0 0 1 -16 12 M -16 12 L -18 24 M -16 12 L -4 14" />
    </g>
  );
}

export function CameraChrome({ portraitAt, photoAt }: ChromeProps) {
  const frame = useCurrentFrame();
  const pos = modePos(frame, portraitAt, photoAt);
  const active = Math.round(pos);
  const isPortrait = active === 2;

  return (
    <AbsoluteFill>
      <svg {...FRAME}>
        <rect x={0} y={0} width={1080} height={TOP_H} fill={INK} />
        <Bolt />
        <rect x={470} y={62} width={140} height={54} rx={27} fill="rgba(255,255,255,0.12)" />
        <text x={540} y={100} textAnchor="middle" fontFamily={S.ui} fontWeight={700} fontSize={32} fill={isPortrait ? CAM : WHITE}>
          {isPortrait ? "f/1.8" : "1x"}
        </text>
        <Flip />

        <rect x={0} y={BOT_Y} width={1080} height={1920 - BOT_Y} fill={INK} />
        {MODES.map((m, i) => {
          const x = 540 + (i - pos) * SLOT;
          const on = i === active;
          return (
            <text key={m} x={x} y={BOT_Y + 74} textAnchor="middle" fontFamily={S.ui} fontWeight={on ? 700 : 600} fontSize={on ? 40 : 34} letterSpacing={3} fill={on ? CAM : "rgba(255,255,255,0.55)"}>
              {m}
            </text>
          );
        })}
        <circle cx={540} cy={BOT_Y + 100} r={5} fill={CAM} />
      </svg>
    </AbsoluteFill>
  );
}
