/**
 * @methamamao hair-powder ad #1 — "อย่า…แต่ให้…แทน".
 *
 * Footage from the Editor Team library, pre-cut to 1080x1920 by
 * projects/metha-hair-ad-01/cut.py; Logan voice-over from Magnific.
 * One short label per beat in a top band — the band sits where the source
 * clips carry their own burned-in captions, so its opaque plate hides them.
 * No "กดตะกร้า" CTA: the ad ends on the punchline and leaves the cart to TikTok.
 */

import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Kanit";

const { fontFamily } = loadFont("normal", {
  weights: ["600", "800"],
  subsets: ["thai", "latin"],
});

export const HAIR_AD_01_FPS = 30;
const DIR = "methaad01";

type Tone = "bad" | "good" | "plain" | "deal";

type Beat = {
  clip: string;
  from: number; // seconds on the VO timeline
  to: number;
  label: string;
  tone: Tone;
  punch?: boolean; // quick zoom-in on entry
};

// Cut points = phrase starts in projects/metha-hair-ad-01/assets/audio/vo_words.csv
const BEATS: Beat[] = [
  { clip: "b01", from: 0.0, to: 1.96, label: "หัวแบน?", tone: "plain", punch: true },
  { clip: "b02", from: 1.96, to: 4.32, label: "แปะติดหนังหัว", tone: "plain" },
  { clip: "b03", from: 4.32, to: 6.82, label: "อย่า  เจลหนาๆ", tone: "bad" },
  { clip: "b04", from: 6.82, to: 9.99, label: "เหนียว · หนัก · แบนกลับ", tone: "bad" },
  { clip: "b05", from: 9.99, to: 13.8, label: "อย่า  ไดร์ร้อนกดทับ", tone: "bad" },
  { clip: "b06", from: 13.8, to: 15.46, label: "ใช้แป้งเซ็ตผมแทน", tone: "good", punch: true },
  { clip: "b07", from: 15.46, to: 16.6, label: "1  โรยตอนผมแห้ง", tone: "good" },
  { clip: "b08", from: 16.6, to: 17.26, label: "2  ขยำ", tone: "good" },
  { clip: "b09", from: 17.26, to: 18.62, label: "3  จัดทรง  จบ", tone: "good" },
  { clip: "b10", from: 18.62, to: 21.87, label: "พอง · ไม่มัน · ไม่เหนียว", tone: "good" },
  { clip: "b11", from: 21.87, to: 24.11, label: "1 แถม 1  ไม่ถึงร้อย", tone: "deal", punch: true },
  { clip: "b12", from: 24.11, to: 26.8, label: "หัวแบนต่อ ก็แล้วแต่มึง", tone: "plain" },
];

export const HAIR_AD_01_SECONDS = BEATS[BEATS.length - 1].to;

const PLATE: Record<Tone, { bg: string; fg: string }> = {
  plain: { bg: "#111111", fg: "#ffffff" },
  bad: { bg: "#d7263d", fg: "#ffffff" },
  good: { bg: "#ffffff", fg: "#111111" },
  deal: { bg: "#ffd400", fg: "#111111" },
};

const Label: React.FC<{ text: string; tone: Tone }> = ({ text, tone }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 12, stiffness: 220 } });
  const { bg, fg } = PLATE[tone];
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div
        style={{
          position: "absolute",
          top: 286,
          minWidth: 900,
          maxWidth: 1000,
          padding: "22px 40px 28px",
          borderRadius: 28,
          background: bg,
          color: fg,
          fontFamily,
          fontWeight: 800,
          fontSize: 76,
          lineHeight: 1.15,
          textAlign: "center",
          whiteSpace: "pre",
          transform: `scale(${interpolate(pop, [0, 1], [0.6, 1])}) rotate(${tone === "deal" ? -3 : 0}deg)`,
          opacity: pop,
          boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

const Shot: React.FC<{ beat: Beat }> = ({ beat }) => {
  const frame = useCurrentFrame();
  const scale = beat.punch
    ? interpolate(frame, [0, 6], [1.12, 1.0], { extrapolateRight: "clamp" })
    : interpolate(frame, [0, (beat.to - beat.from) * HAIR_AD_01_FPS], [1.0, 1.04]);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <OffthreadVideo
        src={staticFile(`${DIR}/${beat.clip}.mp4`)}
        muted
        style={{ width: 1080, height: 1920, transform: `scale(${scale})` }}
      />
      <Label text={beat.label} tone={beat.tone} />
    </AbsoluteFill>
  );
};

export const HairAd01: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    {BEATS.map((b) => (
      <Sequence
        key={b.clip}
        from={Math.round(b.from * HAIR_AD_01_FPS)}
        durationInFrames={Math.round((b.to - b.from) * HAIR_AD_01_FPS)}
      >
        <Shot beat={b} />
      </Sequence>
    ))}
    <Audio src={staticFile(`${DIR}/vo.mp3`)} />
  </AbsoluteFill>
);
