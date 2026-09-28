import { AbsoluteFill, Easing, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Glitch, PunchIn, Riso, RISO } from "../../fxkit";
import { CARD, CARD_SHADOW, clamp, NIGHT } from "./style";

const FPS = 30;

export interface CardShot {
  src: string; // public path incl. .mp4
  from: number; // card-local frame the shot starts
  srcSeconds: number; // usable source length from `start`
  start?: number;
  /** objectPosition y in %: 50 = centred crop, higher shows lower source (face moves up). */
  pos?: number;
  riso?: boolean;
  glitch?: boolean;
}

export type Exit = { at: number; dur: number; kind: "right" | "up" | "shrink"; to?: { x: number; y: number; d: number } };

interface ProfileCardProps {
  shots: readonly CardShot[];
  /** Card-local frame it becomes the front card (it waits in the deck before). */
  frontAt: number;
  end: number; // card-local frame footage ends
  exit?: Exit;
  panel: React.ReactNode; // card-local 980x1330 overlay (info panel)
  stamp?: React.ReactNode; // shown while exiting, card-local coords
  id: string;
}

/** One footage shot that fills its slot inside the card photo well. */
function Photo({ shot, dur, id }: { shot: CardShot; dur: number; id: string }) {
  const frame = useCurrentFrame();
  const start = shot.start ?? 0;
  const rate = Math.min(1, (shot.srcSeconds - start - 0.05) / (dur / FPS));
  const push = interpolate(frame, [0, dur], [1, 1.06], clamp);
  const video = (
    <AbsoluteFill style={{ scale: push }}>
      <OffthreadVideo
        src={staticFile(shot.src)}
        muted
        startFrom={Math.round(start * FPS)}
        playbackRate={rate}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: `50% ${shot.pos ?? 50}%`,
          filter: "saturate(1.08) contrast(1.07) brightness(1.02)",
        }}
      />
      {/* cedar tint: pulls every creator clip into the app's colour world */}
      <AbsoluteFill style={{ backgroundColor: "#2F5A43", mixBlendMode: "soft-light", opacity: 0.35 }} />
    </AbsoluteFill>
  );
  const printed = shot.riso ? (
    <Riso id={`sp07-riso-${id}`} inks={{ dark: RISO.black, mid: "#2E8B57", paper: "#F3EEDD" }} grain={0.3} darkAt={0.3} midAt={0.62}>
      {video}
    </Riso>
  ) : shot.glitch ? (
    <Glitch id={`sp07-glitch-${id}`} dur={7} amount={60}>
      {video}
    </Glitch>
  ) : (
    video
  );
  return <PunchIn amount={0.06}>{printed}</PunchIn>;
}

/** Photo-count bars along the top of the card, one per shot (dating-app gallery). */
function GalleryBars({ shots, frame }: { shots: readonly CardShot[]; frame: number }) {
  const active = shots.reduce((acc, s, i) => (frame >= s.from ? i : acc), 0);
  const gap = 10;
  const w = (CARD.w - 60 - gap * (shots.length - 1)) / shots.length;
  return (
    <div style={{ position: "absolute", left: 30, top: 22, display: "flex", gap }}>
      {shots.map((s, i) => (
        <div key={s.src} style={{ width: w, height: 9, borderRadius: 5, backgroundColor: i === active ? "#FFFFFF" : "rgba(255,255,255,0.38)", boxShadow: "0 1px 4px rgba(0,0,0,0.4)" }} />
      ))}
    </div>
  );
}

function exitTransform(exit: Exit | undefined, frame: number) {
  if (!exit) return { transform: "", clip: "none" };
  const t = interpolate(frame, [exit.at, exit.at + exit.dur], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  if (exit.kind === "right") return { transform: `translateX(${t * 1350}px) translateY(${t * 120}px) rotate(${t * 24}deg)`, clip: "none" };
  if (exit.kind === "up") return { transform: `translateY(${-t * 2100}px) scale(${1 - t * 0.2})`, clip: "none" };
  const to = exit.to ?? { x: 540, y: 900, d: 260 };
  const e = interpolate(frame, [exit.at, exit.at + exit.dur], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const cx = CARD.x + CARD.w / 2;
  const cy = CARD.y + CARD.h / 2;
  const s = 1 + ((to.d / CARD.w) - 1) * e;
  const r = interpolate(e, [0, 0.6, 1], [1000, CARD.w / 2 + 40, CARD.w / 2]);
  return {
    transform: `translate(${(to.x - cx) * e}px, ${(to.y - cy) * e}px) scale(${s})`,
    clip: `circle(${r}px at 50% 50%)`,
  };
}

/**
 * A swipeable profile card: rounded photo well playing its shots, gallery
 * bars, a dark foot scrim for the info panel, a deck state before it is
 * the front card, and a swipe (right / up) or shrink-to-avatar exit.
 */
export function ProfileCard({ shots, frontAt, end, exit, panel, stamp, id }: ProfileCardProps) {
  const frame = useCurrentFrame();
  const rise = interpolate(frame, [frontAt - 9, frontAt], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const deckScale = 0.92 + 0.08 * rise;
  const deckY = (1 - rise) * 46;
  const dim = 0.55 + 0.45 * rise;
  const { transform, clip } = exitTransform(exit, frame);
  // a shrinking card sheds its info panel, scrim and bars on the way to an avatar
  const shed = exit?.kind === "shrink" ? interpolate(frame, [exit.at, exit.at + 4], [1, 0], clamp) : 1;
  return (
    <div
      style={{
        position: "absolute",
        left: CARD.x,
        top: CARD.y,
        width: CARD.w,
        height: CARD.h,
        transform: `${transform} translateY(${deckY}px) scale(${deckScale})`,
        transformOrigin: "50% 50%",
        clipPath: clip,
      }}
    >
      <div style={{ position: "absolute", inset: 0, borderRadius: CARD.r * shed, overflow: "hidden", boxShadow: CARD_SHADOW, backgroundColor: NIGHT, filter: `brightness(${dim})` }}>
        {shots.map((s, i) => {
          const to = i + 1 < shots.length ? shots[i + 1].from : end;
          return (
            <Sequence key={s.src} from={s.from} durationInFrames={to - s.from}>
              <Photo shot={s} dur={to - s.from} id={`${id}-${i}`} />
            </Sequence>
          );
        })}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 560, opacity: shed, background: "linear-gradient(180deg, rgba(8,16,12,0) 0%, rgba(8,16,12,0.72) 45%, rgba(8,16,12,0.94) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, opacity: shed }}>
          <GalleryBars shots={shots} frame={frame} />
          {frame >= frontAt - 2 ? panel : null}
        </div>
        {exit && stamp ? (
          <Sequence from={exit.at} layout="none">
            {stamp}
          </Sequence>
        ) : null}
      </div>
    </div>
  );
}
