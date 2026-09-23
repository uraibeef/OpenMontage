import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { Avatar, LaughChip, TypingDots, UI_LEFT, UI_WIDTH, useArrival, useSceneSeconds } from "./ChatUI";
import { PALETTE, WIDTH } from "./constants";
import { MONO_FONT, UI_FONT } from "./fonts";

/**
 * Evidence surfaces: CCTV burn-in, the group's settings, the reaction vote,
 * the locked gate, the forensic wall, the admin history and the future profile.
 *
 * These are the objects the story is told through. Each one is ordinary
 * interface furniture until the moment it contradicts itself — a clock that
 * runs backward, a count that will not stop, a list where every name left at
 * the same minute.
 */

// ── CCTV ─────────────────────────────────────────────────────────────────

function clockAt(start: string, secondsElapsed: number): string {
  const [h, m, s] = start.split(":").map(Number);
  const total = Math.max(0, h * 3600 + m * 60 + s + Math.floor(secondsElapsed));
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${pad(Math.floor(total / 3600) % 24)}:${pad(Math.floor(total / 60) % 60)}:${pad(total % 60)}`;
}

/**
 * Security-camera burn-in over a plate. `reverseSecondsAt` makes the clock tick
 * backward for two seconds — the first proof the footage is not a recording.
 */
export const CctvFrame: React.FC<{
  label: string;
  startClock: string;
  reverseSecondsAt?: number;
  nowClock?: string;
}> = ({ label, startClock, reverseSecondsAt, nowClock }) => {
  const frame = useCurrentFrame();
  const seconds = useSceneSeconds();
  const reversing = reverseSecondsAt !== undefined && seconds >= reverseSecondsAt && seconds < reverseSecondsAt + 2;
  const elapsed = reversing ? reverseSecondsAt! - (seconds - reverseSecondsAt!) * 2 : seconds;
  const recOn = frame % 30 < 18;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* scanlines + a faint green-grey cast */}
      <AbsoluteFill
        style={{
          background:
            "repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0px, rgba(0,0,0,0.18) 2px, rgba(0,0,0,0) 2px, rgba(0,0,0,0) 5px)",
          mixBlendMode: "multiply",
        }}
      />
      <AbsoluteFill style={{ background: "rgba(40, 60, 50, 0.16)", mixBlendMode: "color" }} />
      <div style={burnIn({ top: 150, left: 70 })}>
        <span style={{ color: recOn ? PALETTE.danger : "transparent" }}>●</span> REC
      </div>
      <div style={burnIn({ top: 150, right: 70 })}>{label}</div>
      <div
        style={{
          ...burnIn({ bottom: 470, left: 70 }),
          fontSize: 50,
          color: reversing ? PALETTE.typingGreen : PALETTE.white,
        }}
      >
        {clockAt(startClock, elapsed)}
      </div>
      {nowClock ? (
        <div style={{ ...burnIn({ bottom: 420, left: 70 }), fontSize: 28, color: PALETTE.mutedText }}>
          เวลาปัจจุบัน {nowClock}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

function burnIn(position: React.CSSProperties): React.CSSProperties {
  return {
    position: "absolute",
    ...position,
    fontFamily: MONO_FONT,
    fontSize: 34,
    letterSpacing: 2,
    color: PALETTE.white,
    textShadow: "0 0 6px rgba(0,0,0,0.9)",
  };
}

// ── Group settings lockdown (EP2 open) ───────────────────────────────────

const SETTINGS_ROWS = ["ปิดรับสมาชิกใหม่", "เปลี่ยนรหัสเข้ากลุ่ม", "ลบแอดมินทั้งหมด"];

export const SettingsPanel: React.FC<{ appearAt: number }> = ({ appearAt }) => {
  const seconds = useSceneSeconds();
  const frame = useCurrentFrame();
  const panel = useArrival(appearAt);
  // Each toggle flips a beat after the last; the member count flickers after each.
  const flips = SETTINGS_ROWS.map((_, index) => seconds >= appearAt + 0.8 + index * 1.4);
  const lastFlip = flips.lastIndexOf(true);
  const flicker = lastFlip >= 0 && seconds - (appearAt + 0.8 + lastFlip * 1.4) < 0.5 && frame % 4 < 2;

  return (
    <Card top={600} opacity={panel}>
      <div style={{ fontSize: 30, color: PALETTE.mutedText, marginBottom: 26 }}>ตั้งค่ากลุ่ม · ลูกบ้านพฤกษา 2</div>
      {SETTINGS_ROWS.map((row, index) => (
        <div key={row} style={rowStyle}>
          <span>{row}</span>
          <Toggle on={flips[index]} />
        </div>
      ))}
      <div style={{ ...rowStyle, borderBottom: "none", color: flicker ? PALETTE.typingGreen : PALETTE.mutedText }}>
        <span>สมาชิก</span>
        <span style={{ fontFamily: MONO_FONT }}>{flicker ? "48" : "47"}</span>
      </div>
    </Card>
  );
};

const rowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "22px 0",
  borderBottom: "1px solid rgba(246,247,248,0.08)",
  fontSize: 36,
};

const Toggle: React.FC<{ on: boolean }> = ({ on }) => (
  <span
    style={{
      width: 92,
      height: 52,
      borderRadius: 999,
      background: on ? PALETTE.rainBlue : "rgba(246,247,248,0.16)",
      position: "relative",
      display: "inline-block",
    }}
  >
    <span
      style={{
        position: "absolute",
        top: 6,
        left: 6,
        width: 40,
        height: 40,
        borderRadius: "50%",
        background: PALETTE.white,
        transform: `translateX(${on ? 40 : 0}px)`,
      }}
    />
  </span>
);

/** Frosted card that every UI surface sits on, so they read as one app. */
export const Card: React.FC<{ top: number; opacity?: number; children: React.ReactNode }> = ({
  top,
  opacity = 1,
  children,
}) => (
  <div
    style={{
      position: "absolute",
      left: UI_LEFT,
      top,
      width: UI_WIDTH,
      padding: "34px 40px",
      borderRadius: 40,
      background: "rgba(12, 15, 19, 0.84)",
      border: "1px solid rgba(246,247,248,0.1)",
      backdropFilter: "blur(16px)",
      fontFamily: UI_FONT,
      color: PALETTE.white,
      opacity,
      transform: `translateY(${interpolate(opacity, [0, 1], [30, 0])}px)`,
      boxShadow: "0 40px 100px rgba(0,0,0,0.6)",
    }}
  >
    {children}
  </div>
);

// ── The vote ─────────────────────────────────────────────────────────────

const REACTIONS = ["👍", "❤️", "😂", "😮", "😢"];

export const VoteConsole: React.FC<{ message: string; messageAt: number; buttonsAt: number }> = ({
  message,
  messageAt,
  buttonsAt,
}) => {
  const card = useArrival(messageAt);
  const seconds = useSceneSeconds();

  return (
    <Card top={560} opacity={card}>
      <div style={{ fontSize: 26, color: PALETTE.mutedText, marginBottom: 12 }}>ป้าสมศรี (เสียชีวิต)</div>
      <div style={{ fontSize: 44, fontWeight: 600, lineHeight: 1.35, marginBottom: 40 }}>{message}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 22, marginBottom: 28 }}>
        <Avatar name="ผม" size={70} tint={PALETTE.rainBlue} />
        <div style={{ fontSize: 34 }}>คุณ (แอดมิน)</div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {REACTIONS.map((emoji, index) => {
          const shown = interpolate(seconds, [buttonsAt + index * 0.35, buttonsAt + index * 0.35 + 0.3], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          // Each target emits a slow pulse once it exists — a button waiting to be pressed.
          const pulse = 1 + Math.sin((seconds - buttonsAt) * 3 + index) * 0.04 * shown;
          return (
            <div
              key={emoji}
              style={{
                width: 118,
                height: 118,
                borderRadius: 30,
                background: "rgba(246,247,248,0.08)",
                border: "1px solid rgba(246,247,248,0.14)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 60,
                opacity: shown,
                transform: `scale(${pulse * interpolate(shown, [0, 1], [0.7, 1])})`,
              }}
            >
              {emoji}
            </div>
          );
        })}
      </div>
    </Card>
  );
};

/** The laugh count. Faceless dots, so the guilt belongs to everyone. */
export const LaughCount: React.FC<{ steps: { at: number; count: string }[] }> = ({ steps }) => {
  const seconds = useSceneSeconds();
  const current = [...steps].reverse().find((step) => seconds >= step.at);
  const card = useArrival(steps[0].at);
  const everyone = current?.count === "ทั้งกลุ่ม";
  const dots = everyone ? 47 : Number(current?.count ?? 0);

  return (
    <Card top={640} opacity={card}>
      <div style={{ fontSize: 28, color: PALETTE.mutedText, marginBottom: 20 }}>รีแอ็กชันใต้ชื่อคุณ</div>
      <LaughChip count={current?.count ?? ""} large />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 34 }}>
        {Array.from({ length: 47 }).map((_, index) => (
          <span
            key={index}
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              background: index < dots ? "rgba(246,247,248,0.85)" : "rgba(246,247,248,0.08)",
            }}
          />
        ))}
      </div>
    </Card>
  );
};

// ── Locked gate ──────────────────────────────────────────────────────────

export const LockedBadge: React.FC<{ appearAt: number }> = ({ appearAt }) => {
  const arrive = useArrival(appearAt, 220);
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        top: 520,
        left: 0,
        width: WIDTH,
        display: "flex",
        justifyContent: "center",
        opacity: arrive * (frame % 20 < 14 ? 1 : 0.55),
      }}
    >
      <div
        style={{
          fontFamily: MONO_FONT,
          fontSize: 60,
          letterSpacing: 10,
          color: PALETTE.danger,
          padding: "18px 44px",
          border: `3px solid ${PALETTE.danger}`,
          background: "rgba(7,9,11,0.7)",
          textShadow: `0 0 20px ${PALETTE.danger}`,
        }}
      >
        LOCKED
      </div>
    </div>
  );
};

// ── A message typed one character at a time ──────────────────────────────

export const SlowTyping: React.FC<{ sender: string; text: string; startAt: number; endAt: number }> = ({
  sender,
  text,
  startAt,
  endAt,
}) => {
  const seconds = useSceneSeconds();
  const chars = Array.from(text);
  const shown = Math.floor(
    interpolate(seconds, [startAt, endAt], [0, chars.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );
  const card = useArrival(startAt - 0.4);
  const done = shown >= chars.length;

  return (
    <Card top={1060} opacity={card}>
      <div style={{ fontSize: 26, color: PALETTE.mutedText, marginBottom: 12 }}>{sender}</div>
      <div style={{ fontSize: 44, fontWeight: 600, lineHeight: 1.4, minHeight: 62 }}>
        {chars.slice(0, shown).join("")}
        {!done ? <span style={{ color: PALETTE.typingGreen }}>▍</span> : null}
      </div>
      {!done ? (
        <div style={{ marginTop: 16 }}>
          <TypingDots size={10} />
        </div>
      ) : null}
    </Card>
  );
};

// ── EP3 surfaces ─────────────────────────────────────────────────────────

/** The join button as a physical switch; the online dot turns into a warning. */
export const JoinButton: React.FC<{ pressAt: number }> = ({ pressAt }) => {
  const seconds = useSceneSeconds();
  // Already on screen at frame 0: this is EP3's first frame, and it has to hook.
  const card = useArrival(-1);
  const pressed = seconds >= pressAt;
  const depth = interpolate(seconds, [pressAt, pressAt + 0.12, pressAt + 0.4], [0, 1, 0.6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const warning = interpolate(seconds, [pressAt + 0.6, pressAt + 1.4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Card top={760} opacity={card}>
      <div style={{ display: "flex", alignItems: "center", gap: 22, marginBottom: 34 }}>
        <Avatar name="ลูกบ้าน" size={84} tint={PALETTE.rainBlue} />
        <div>
          <div style={{ fontSize: 40, fontWeight: 600 }}>ลูกบ้านพฤกษา 2</div>
          <div style={{ fontSize: 28, color: PALETTE.mutedText }}>สมาชิก 47 คน</div>
        </div>
      </div>
      <div
        style={{
          textAlign: "center",
          fontSize: 38,
          fontWeight: 600,
          padding: "26px 0",
          borderRadius: 24,
          background: pressed ? "rgba(246,247,248,0.12)" : PALETTE.rainBlue,
          transform: `translateY(${depth * 8}px) scale(${1 - depth * 0.03})`,
          boxShadow: `0 ${10 - depth * 8}px 0 rgba(0,0,0,0.5)`,
        }}
      >
        {pressed ? "เข้าร่วมแล้ว" : "เข้าร่วมกลุ่ม"}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 26, fontSize: 28 }}>
        <span
          style={{
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: warning > 0.5 ? PALETTE.danger : PALETTE.typingGreen,
            boxShadow: `0 0 16px ${warning > 0.5 ? PALETTE.danger : PALETTE.typingGreen}`,
          }}
        />
        <span style={{ color: PALETTE.mutedText }}>{warning > 0.5 ? "มีคนกำลังดูคุณอยู่" : "ออนไลน์"}</span>
      </div>
    </Card>
  );
};

/** A phone call waveform that dies into a single typing cursor. */
export const CallWave: React.FC<{ dieAt: number }> = ({ dieAt }) => {
  const seconds = useSceneSeconds();
  const frame = useCurrentFrame();
  const card = useArrival(0.2);
  const life = interpolate(seconds, [dieAt - 0.6, dieAt + 0.4], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bars = 34;

  return (
    <Card top={720} opacity={card}>
      <div style={{ fontSize: 28, color: PALETTE.mutedText, marginBottom: 8 }}>กำลังโทร</div>
      <div style={{ fontSize: 42, fontWeight: 600, marginBottom: 36 }}>เมีย</div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, height: 140 }}>
        {life > 0.02 ? (
          Array.from({ length: bars }).map((_, index) => {
            const amplitude = 0.25 + random(`wave-${index}-${Math.floor(frame / 3)}`) * 0.75;
            return (
              <span
                key={index}
                style={{
                  width: 14,
                  height: 140 * amplitude * life + 6,
                  borderRadius: 7,
                  background: PALETTE.white,
                  opacity: 0.85,
                }}
              />
            );
          })
        ) : (
          <span style={{ fontSize: 80, color: PALETTE.typingGreen, opacity: frame % 20 < 12 ? 1 : 0 }}>▍</span>
        )}
      </div>
    </Card>
  );
};

/**
 * Three warnings, three reaction bursts, three missing-person notices, lined up
 * in columns so the pattern reads before the narration names it.
 */
export const EvidenceWall: React.FC<{ appearAt: number }> = ({ appearAt }) => {
  const seconds = useSceneSeconds();
  const rows = [
    { warning: "“อย่าให้เด็กเสื้อเหลือง…”", laughs: 31 },
    { warning: "“ลุงบ้านเก้าอย่าออกไปเดินตอนเช้า”", laughs: 26 },
    { warning: "“ใครขับรถสีเทา อย่าจอดหน้าบ้าน”", laughs: 40 },
  ];

  return (
    <Card top={470} opacity={useArrival(appearAt)}>
      <div style={{ fontSize: 28, color: PALETTE.mutedText, marginBottom: 24 }}>ข้อความเก่า · ย้อนหลัง</div>
      {rows.map((row, index) => {
        const at = appearAt + 0.6 + index * 1.3;
        const shown = interpolate(seconds, [at, at + 0.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const redact = interpolate(seconds, [at + 0.7, at + 1.1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div key={row.warning} style={{ opacity: shown, marginBottom: 30, paddingBottom: 26, borderBottom: "1px solid rgba(246,247,248,0.08)" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>ป้าสมศรี: {row.warning}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <LaughChip count={row.laughs} />
              <span style={{ fontSize: 28, color: PALETTE.danger, marginTop: 10 }}>
                ประกาศคนหาย{" "}
                <span style={{ background: PALETTE.white, color: PALETTE.white, opacity: redact, borderRadius: 4 }}>
                  ██████████
                </span>
              </span>
            </div>
          </div>
        );
      })}
    </Card>
  );
};

/** Every former admin left at 02:47. The narrator is simply next on the list. */
export const AdminHistory: React.FC<{ appearAt: number }> = ({ appearAt }) => {
  const seconds = useSceneSeconds();
  const admins = ["วิชัย", "สุนทร", "ประยูร", "มาลี", "อำนาจ", "คุณ"];
  const scroll = interpolate(seconds, [appearAt, appearAt + 5], [260, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Card top={560} opacity={useArrival(appearAt)}>
      <div style={{ fontSize: 28, color: PALETTE.mutedText, marginBottom: 20 }}>ประวัติผู้ดูแลกลุ่ม</div>
      <div style={{ height: 620, overflow: "hidden" }}>
        <div style={{ transform: `translateY(${-scroll}px)` }}>
          {admins.map((name, index) => {
            const isYou = index === admins.length - 1;
            return (
              <div key={name} style={{ ...rowStyle, color: isYou ? PALETTE.typingGreen : PALETTE.white }}>
                <span>{name}</span>
                <span style={{ fontFamily: MONO_FONT, fontSize: 28, color: isYou ? PALETTE.typingGreen : PALETTE.mutedText }}>
                  {isYou ? "แอดมินปัจจุบัน" : "ออกจากกลุ่ม 02:47"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

/** The future admin profile, then her message underneath it. */
export const ProfileCard: React.FC<{ name: string; message: string; messageAt: number }> = ({
  name,
  message,
  messageAt,
}) => {
  const card = useArrival(0.3);
  const note = useArrival(messageAt, 90);

  return (
    <>
      <Card top={420} opacity={card}>
        <div style={{ fontSize: 26, color: PALETTE.mutedText, marginBottom: 20 }}>ผู้ดูแลระบบ · อีก 14 ปีข้างหน้า</div>
        <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
          <Avatar name="สมศรี" size={110} tint="#2b3a2f" />
          <div>
            <div style={{ fontSize: 50, fontWeight: 600 }}>{name}</div>
            <div style={{ fontSize: 28, color: PALETTE.typingGreen, marginTop: 6 }}>ออนไลน์</div>
          </div>
        </div>
      </Card>
      <div
        style={{
          position: "absolute",
          top: 820,
          left: UI_LEFT,
          width: UI_WIDTH,
          opacity: note,
          transform: `translateY(${interpolate(note, [0, 1], [24, 0])}px)`,
          fontFamily: UI_FONT,
          fontSize: 58,
          fontWeight: 600,
          lineHeight: 1.35,
          color: PALETTE.white,
          textAlign: "center",
          textShadow: "0 4px 30px rgba(0,0,0,0.9)",
        }}
      >
        {message}
      </div>
    </>
  );
};

/**
 * The last beat of the trilogy: his warning posts, one laugh lands under it,
 * and his own status turns into the typing state that opened EP1.
 */
export const FinalTyping: React.FC<{ postAt: number; laughAt: number; typingAt: number }> = ({
  postAt,
  laughAt,
  typingAt,
}) => {
  const seconds = useSceneSeconds();
  const post = useArrival(postAt);
  const status = useArrival(typingAt, 90);

  return (
    <>
      <Card top={640} opacity={post}>
        <div style={{ fontSize: 26, color: PALETTE.mutedText, marginBottom: 12 }}>คุณ (แอดมิน)</div>
        <div style={{ fontSize: 48, fontWeight: 600 }}>ห้ามกดรีแอ็กชัน ไม่ว่าเห็นอะไร</div>
        {seconds >= laughAt ? <LaughChip count={1} /> : null}
      </Card>
      <div
        style={{
          position: "absolute",
          top: 1040,
          left: 0,
          width: WIDTH,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 22,
          opacity: status,
          fontFamily: UI_FONT,
          fontSize: 44,
          color: PALETTE.typingGreen,
          textShadow: `0 0 24px ${PALETTE.typingGreen}`,
        }}
      >
        คุณกำลังพิมพ์ <TypingDots size={14} />
      </div>
    </>
  );
};

