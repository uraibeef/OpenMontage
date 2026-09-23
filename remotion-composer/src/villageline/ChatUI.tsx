import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { PALETTE, WIDTH } from "./constants";
import { UI_FONT } from "./fonts";

/**
 * Chat-interface primitives: the notification banner, message bubbles, the
 * system pill, typing dots and laugh reactions.
 *
 * Everything here is timed in scene-relative seconds so an episode file can
 * say "the warning lands at 1.8s" without doing frame arithmetic.
 */

export const UI_WIDTH = WIDTH * 0.84;
export const UI_LEFT = (WIDTH - UI_WIDTH) / 2;

export function useSceneSeconds(): number {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
}

/** 0→1 over a short spring once `at` has passed. Compositor-only motion. */
export function useArrival(at: number, stiffness = 170): number {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - at * fps, fps, config: { damping: 18, stiffness } });
}

const DOT_CYCLE_FRAMES = 12;

/**
 * Three dots pulsing on a 12-frame cycle. The cycle length is not arbitrary:
 * it matches the film-grain re-seed so the series' final frame and its first
 * frame land on the same dot phase and the trilogy loops cleanly.
 */
export const TypingDots: React.FC<{ color?: string; size?: number }> = ({
  color = PALETTE.typingGreen,
  size = 14,
}) => {
  const frame = useCurrentFrame();
  return (
    <span style={{ display: "inline-flex", gap: size * 0.55, alignItems: "center" }}>
      {[0, 1, 2].map((dot) => {
        const phase = ((frame + dot * 4) % DOT_CYCLE_FRAMES) / DOT_CYCLE_FRAMES;
        const lift = Math.sin(phase * Math.PI * 2);
        return (
          <span
            key={dot}
            style={{
              width: size,
              height: size,
              borderRadius: "50%",
              background: color,
              opacity: 0.45 + 0.55 * Math.max(0, lift),
              transform: `translateY(${-Math.max(0, lift) * size * 0.35}px)`,
              boxShadow: `0 0 ${size}px ${color}`,
            }}
          />
        );
      })}
    </span>
  );
};

/** A plain avatar: initials in a disc. No faces anywhere in the UI. */
export const Avatar: React.FC<{ name: string; size?: number; tint?: string }> = ({
  name,
  size = 64,
  tint = PALETTE.bubbleGrey,
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: tint,
      color: PALETTE.white,
      fontFamily: UI_FONT,
      fontSize: size * 0.42,
      fontWeight: 600,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}
  >
    {name.replace(/^ป้า/, "").slice(0, 1)}
  </div>
);

/**
 * Push banner as it arrives on a lock screen.
 *
 * `reflected` adds the signature device: beneath the banner, the same banner
 * again as a reflection on wet glass — flipped, skewed and bled. The readable
 * copy carries the words; the ghost carries the dread.
 */
export const NotificationBanner: React.FC<{
  sender: string;
  body?: string;
  typing?: boolean;
  appearAt?: number;
  reflected?: boolean;
  top?: number;
}> = ({ sender, body, typing, appearAt = 0, reflected, top = 720 }) => {
  const arrive = useArrival(appearAt);
  const drop = interpolate(arrive, [0, 1], [-60, 0]);
  const banner = <BannerBody sender={sender} body={body} typing={typing} />;

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: UI_LEFT,
          top,
          width: UI_WIDTH,
          opacity: arrive,
          transform: `translateY(${drop}px)`,
        }}
      >
        {banner}
      </div>
      {reflected ? (
        <div
          style={{
            position: "absolute",
            left: UI_LEFT,
            top: top + 380,
            width: UI_WIDTH,
            opacity: arrive * 0.42,
            transform: "scaleY(-1) skewX(-5deg)",
            filter: "blur(3px)",
            mixBlendMode: "screen",
            maskImage: "linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0))",
          }}
        >
          {banner}
        </div>
      ) : null}
    </>
  );
};

const BannerBody: React.FC<{ sender: string; body?: string; typing?: boolean }> = ({ sender, body, typing }) => (
  <div
    style={{
      display: "flex",
      gap: 26,
      alignItems: "center",
      padding: "30px 34px",
      borderRadius: 38,
      background: "rgba(22, 26, 32, 0.82)",
      backdropFilter: "blur(18px)",
      border: "1px solid rgba(246, 247, 248, 0.12)",
      boxShadow: "0 30px 80px rgba(0,0,0,0.55)",
      fontFamily: UI_FONT,
      color: PALETTE.white,
    }}
  >
    <div
      style={{
        width: 76,
        height: 76,
        borderRadius: 20,
        background: PALETTE.rainBlue,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <ChatGlyph />
    </div>
    <div style={{ minWidth: 0, flex: 1 }}>
      <div style={{ fontSize: 26, color: PALETTE.mutedText, marginBottom: 6 }}>ลูกบ้านพฤกษา 2 · ตอนนี้</div>
      <div style={{ fontSize: 38, fontWeight: 600, marginBottom: 8 }}>{sender}</div>
      {typing ? (
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 32, color: PALETTE.typingGreen }}>
          กำลังพิมพ์ <TypingDots size={11} />
        </div>
      ) : (
        <div style={{ fontSize: 34, lineHeight: 1.35 }}>{body}</div>
      )}
    </div>
  </div>
);

const ChatGlyph: React.FC = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden>
    <path
      d="M22 6C12.6 6 5 12.3 5 20c0 4.4 2.5 8.3 6.3 10.9L10 38l7.6-4.4c1.4.3 2.9.4 4.4.4 9.4 0 17-6.3 17-14S31.4 6 22 6z"
      fill={PALETTE.white}
    />
  </svg>
);

/** One message bubble, sliding up into place at `at`. */
export const Bubble: React.FC<{
  sender: string;
  text: string;
  at: number;
  warning?: boolean;
  laughs?: number[];
}> = ({ sender, text, at, warning, laughs = [] }) => {
  const arrive = useArrival(at);
  const seconds = useSceneSeconds();
  const landedLaughs = laughs.filter((time) => seconds >= time).length;

  return (
    <div
      style={{
        display: "flex",
        gap: 20,
        alignItems: "flex-start",
        opacity: arrive,
        transform: `translateY(${interpolate(arrive, [0, 1], [40, 0])}px)`,
        marginBottom: 30,
      }}
    >
      <Avatar name={sender} size={60} tint={warning ? "#3a2a2a" : PALETTE.bubbleGrey} />
      <div style={{ maxWidth: UI_WIDTH - 90 }}>
        <div style={{ fontFamily: UI_FONT, fontSize: 25, color: PALETTE.mutedText, marginBottom: 8 }}>
          {sender}
        </div>
        <div
          style={{
            fontFamily: UI_FONT,
            fontSize: 34,
            lineHeight: 1.4,
            color: PALETTE.white,
            background: warning ? "rgba(58, 30, 30, 0.92)" : "rgba(42, 47, 54, 0.92)",
            border: warning ? `1px solid ${PALETTE.danger}55` : "1px solid rgba(255,255,255,0.06)",
            padding: "20px 26px",
            borderRadius: "8px 28px 28px 28px",
          }}
        >
          {text}
        </div>
        {landedLaughs > 0 ? <LaughChip count={landedLaughs} /> : null}
      </div>
    </div>
  );
};

/** The laugh reaction tally. It ticks, it never animates politely. */
export const LaughChip: React.FC<{ count: number | string; large?: boolean }> = ({ count, large }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      marginTop: 10,
      padding: large ? "14px 26px" : "6px 16px",
      borderRadius: 999,
      background: "rgba(246, 247, 248, 0.1)",
      border: "1px solid rgba(246, 247, 248, 0.16)",
      fontFamily: UI_FONT,
      fontSize: large ? 52 : 28,
      color: PALETTE.white,
    }}
  >
    <span>😂</span>
    <span style={{ fontWeight: 600 }}>{count}</span>
  </div>
);

/**
 * A centred system message. `highlight` is the phrase that turns typing-green
 * once the pill has settled — in EP1 that is "คำเชิญของคุณ", the moment the
 * narrator realises the invitation came from his own account.
 */
export const SystemPill: React.FC<{ text: string; highlight?: string; appearAt: number; top?: number }> = ({
  text,
  highlight,
  appearAt,
  top = 820,
}) => {
  const arrive = useArrival(appearAt, 120);
  const seconds = useSceneSeconds();
  const glow = interpolate(seconds, [appearAt + 1.2, appearAt + 2.2], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const [before, after] = highlight ? text.split(highlight) : [text, ""];

  return (
    <div
      style={{
        position: "absolute",
        left: UI_LEFT,
        top,
        width: UI_WIDTH,
        display: "flex",
        justifyContent: "center",
        opacity: arrive,
        transform: `scale(${interpolate(arrive, [0, 1], [0.94, 1])})`,
      }}
    >
      <div
        style={{
          fontFamily: UI_FONT,
          fontSize: 34,
          lineHeight: 1.45,
          textAlign: "center",
          color: PALETTE.white,
          padding: "22px 36px",
          borderRadius: 30,
          background: "rgba(10, 13, 17, 0.8)",
          border: "1px solid rgba(246,247,248,0.1)",
          backdropFilter: "blur(12px)",
        }}
      >
        {before}
        {highlight ? (
          <span
            style={{
              color: interpolateColor(glow),
              textShadow: glow > 0 ? `0 0 ${18 * glow}px ${PALETTE.typingGreen}` : undefined,
              fontWeight: 600,
            }}
          >
            {highlight}
          </span>
        ) : null}
        {after}
      </div>
    </div>
  );
};

function interpolateColor(progress: number): string {
  // white → typing green, done by hand so no colour library is pulled in.
  const from = [246, 247, 248];
  const to = [125, 255, 138];
  const mix = from.map((channel, index) => Math.round(channel + (to[index] - channel) * progress));
  return `rgb(${mix.join(",")})`;
}
