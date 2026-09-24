import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { UI_FONT } from "../villageline/fonts";
import { PhraseWrapped } from "./Captions";
import type { ChatMessage, ChatSpec } from "./constants";
import { HEIGHT, WIDTH } from "./constants";

/**
 * A full-frame phone chat, rendered rather than generated.
 *
 * Image models cannot be trusted with Thai text, and in a story where the
 * twist is a sentence on a screen the sentence has to be pixel-sharp. So the
 * chat is drawn here: the shot's plate sits blurred far behind it, the UI is
 * an ordinary dark messaging app, and the only colour is the red the series
 * reserves for the price — here, what the recovery tool dug back up.
 */

const INK = "#e9e9ea";
const MUTED = "#8b8f94";
const SCREEN = "#0c0e10";
const BUBBLE_IN = "#23262a";
const BUBBLE_OUT = "#3a3e43";
const RED = "#ff4a3d";

const MESSAGE_FADE_FRAMES = 6;
const CARET_BLINK_FRAMES = 16;

export const ChatScreen: React.FC<{ chat: ChatSpec; backdrop: string }> = ({
  chat,
  backdrop,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const seconds = frame / fps;
  const showDetail =
    chat.detail !== undefined && seconds >= (chat.revealDetailAt ?? 0);

  return (
    <AbsoluteFill style={{ backgroundColor: SCREEN }}>
      <Img
        src={staticFile(backdrop)}
        style={{
          position: "absolute",
          width: WIDTH,
          height: HEIGHT,
          objectFit: "cover",
          opacity: 0.16,
          filter: "blur(26px) grayscale(1)",
          transform: "scale(1.1)",
        }}
      />

      <Header
        name={chat.name}
        avatar={chat.avatar ?? chat.name.slice(0, 1)}
        status={chat.status ?? "ข้อความที่กู้คืน"}
        detail={showDetail ? chat.detail : undefined}
      />

      <div
        style={{
          position: "absolute",
          top: HEIGHT * 0.19,
          left: WIDTH * 0.06,
          width: WIDTH * 0.88,
          display: "flex",
          flexDirection: "column",
          gap: 40,
        }}
      >
        {chat.messages.map((message, index) => (
          <Message key={index} message={message} seconds={seconds} fps={fps} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

const Header: React.FC<{ name: string; avatar: string; status: string; detail?: string }> = ({
  name,
  avatar,
  status,
  detail,
}) => (
  <div
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: WIDTH,
      height: HEIGHT * 0.14,
      paddingTop: HEIGHT * 0.055,
      paddingLeft: WIDTH * 0.06,
      boxSizing: "border-box",
      display: "flex",
      alignItems: "center",
      gap: 26,
      borderBottom: "1px solid rgba(255,255,255,0.08)",
      background: "rgba(12,14,16,0.92)",
      fontFamily: UI_FONT,
    }}
  >
    <div style={{ color: MUTED, fontSize: 52, lineHeight: 1 }}>‹</div>
    <div
      style={{
        width: 100,
        height: 100,
        borderRadius: 50,
        background: "#4a4e54",
        color: INK,
        fontSize: 48,
        fontWeight: 600,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {avatar}
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ color: INK, fontSize: 54, fontWeight: 600 }}>{name}</div>
      <div style={{ color: detail ? RED : MUTED, fontSize: 36, fontWeight: 500 }}>
        {detail ?? status}
      </div>
    </div>
  </div>
);

const Message: React.FC<{ message: ChatMessage; seconds: number; fps: number }> = ({
  message,
  seconds,
  fps,
}) => {
  if (seconds < message.at) return null;

  const localFrame = (seconds - message.at) * fps;
  const opacity = interpolate(localFrame, [0, MESSAGE_FADE_FRAMES], [0, 1], {
    extrapolateRight: "clamp",
  });
  const rise = interpolate(localFrame, [0, MESSAGE_FADE_FRAMES], [14, 0], {
    extrapolateRight: "clamp",
  });

  const isOut = message.side === "out";
  const text = message.draft ? typedText(message, seconds) : message.text;
  const isTyping = message.draft && text.length < message.text.length;
  const caretOn = Math.floor(localFrame / CARET_BLINK_FRAMES) % 2 === 0;

  return (
    <div
      style={{
        alignSelf: isOut ? "flex-end" : "flex-start",
        maxWidth: "88%",
        opacity,
        transform: `translateY(${rise}px)`,
        fontFamily: UI_FONT,
        display: "flex",
        flexDirection: "column",
        alignItems: isOut ? "flex-end" : "flex-start",
        gap: 10,
      }}
    >
      {message.recovered || message.draft ? (
        <div style={{ color: RED, fontSize: 34, fontWeight: 600, letterSpacing: 0.5 }}>
          {message.draft ? "● ร่าง · ยังไม่ได้ส่ง" : "● ถูกลบ · กู้คืนแล้ว"}
        </div>
      ) : null}
      <div
        style={{
          padding: "26px 36px",
          borderRadius: 40,
          background: isOut ? BUBBLE_OUT : BUBBLE_IN,
          border: message.draft
            ? `3px dashed ${RED}`
            : message.recovered
              ? "2px solid rgba(255,74,61,0.45)"
              : "none",
          color: INK,
          fontSize: 60,
          lineHeight: 1.38,
          ...({ textWrap: "balance" } as React.CSSProperties),
          fontWeight: 400,
        }}
      >
        <PhraseWrapped text={text} />
        {isTyping || (message.draft && caretOn) ? (
          <span style={{ color: RED, marginLeft: 2 }}>|</span>
        ) : null}
      </div>
    </div>
  );
};

/**
 * Reveal a draft a cluster at a time. Splitting on code points would tear
 * Thai above/below vowels and tone marks off their consonants mid-type.
 */
function typedText(message: ChatMessage, seconds: number): string {
  const duration = message.typeSeconds ?? 2;
  const progress = Math.min(1, Math.max(0, (seconds - message.at) / duration));
  const clusters = thaiClusters(message.text);
  return clusters.slice(0, Math.round(clusters.length * progress)).join("");
}

// Mai han-akat, the above/below vowels, and the tone and other marks.
const THAI_COMBINING = /[ัิ-ฺ็-๎]/;

function thaiClusters(text: string): string[] {
  return [...text].reduce<string[]>((clusters, char) => {
    if (THAI_COMBINING.test(char) && clusters.length > 0) {
      return [...clusters.slice(0, -1), clusters[clusters.length - 1] + char];
    }
    return [...clusters, char];
  }, []);
}
