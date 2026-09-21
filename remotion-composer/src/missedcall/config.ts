/**
 * "สายที่ไม่ได้รับ" — shot list, captions and timing.
 *
 * Same visual engine as the beggar reel: flat 2D ink characters composited into
 * photoreal cinematic Bangkok. What changes is the instrument. That reel used
 * rain as its pressure gauge; this one uses a phone screen. Every beat of the
 * suspicion is lit by one, and the twist is a screen going dark.
 *
 * Shot durations are cut to the voiceover, not guessed — the narration was
 * transcribed and each shot starts on the beat where its line begins.
 *
 * The last beat returns to the opening image, so the reel loops without a seam
 * and the opening shot stops being a question on the second pass.
 */

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

export const VOICEOVER_SRC = "missedcall/vo.mp3";

export type MarkKind = "question" | "exclaim" | "sweat" | "spark";

export interface Shot {
  id: string;
  src: string;
  durationInSeconds: number;
  zoom: [from: number, to: number];
  driftX?: number;
  driftY?: number;
  /**
   * Screen-light pulse over the shot — the glow of a phone waking up.
   * Omitted on the beats that must sit dead still.
   */
  glow?: "soft" | "hard";
  marks?: { kind: MarkKind; at: number; x: number; y: number }[];
  punchIn?: boolean;
}

/**
 * 02:47 is stamped on four shots. Three of them are her calls; the fourth is
 * the one he lets ring. Same timestamp, opposite meaning — that is the whole
 * story in two digits.
 */
export const TIMESTAMP_SHOTS = new Set(["screen-wakes", "his-screen", "loop-slip"]);

export const SHOTS: Shot[] = [
  // ── Hook: the ending, shown first ──────────────────────────────────────
  { id: "corridor", src: "missedcall/s01.png", durationInSeconds: 2.4, zoom: [1.0, 1.07] },
  { id: "missed-call", src: "missedcall/s02.png", durationInSeconds: 2.3, zoom: [1.06, 1.0], glow: "soft" },

  // ── Setup ──────────────────────────────────────────────────────────────
  { id: "waiting", src: "missedcall/s03.png", durationInSeconds: 2.6, zoom: [1.0, 1.08] },
  { id: "she-returns", src: "missedcall/s04.png", durationInSeconds: 2.7, zoom: [1.04, 1.1] },
  { id: "face-down", src: "missedcall/s05.png", durationInSeconds: 2.3, zoom: [1.08, 1.0] },
  { id: "backs-turned", src: "missedcall/s06.png", durationInSeconds: 3.8, zoom: [1.0, 1.07] },

  // ── Suspicion ──────────────────────────────────────────────────────────
  { id: "screen-wakes", src: "missedcall/s07.png", durationInSeconds: 2.2, zoom: [1.0, 1.1], glow: "hard" },
  { id: "she-leaves", src: "missedcall/s08.png", durationInSeconds: 2.3, zoom: [1.02, 1.09] },
  { id: "under-door", src: "missedcall/s09.png", durationInSeconds: 2.8, zoom: [1.0, 1.06], glow: "soft" },
  { id: "pretending", src: "missedcall/s10.png", durationInSeconds: 2.4, zoom: [1.05, 1.0] },
  { id: "writes-number", src: "missedcall/s11.png", durationInSeconds: 2.5, zoom: [1.0, 1.1], glow: "soft" },

  // ── Building a case ────────────────────────────────────────────────────
  { id: "receipt", src: "missedcall/s12.png", durationInSeconds: 2.4, zoom: [1.0, 1.08] },
  { id: "sanitiser", src: "missedcall/s13.png", durationInSeconds: 2.3, zoom: [1.06, 1.0] },
  { id: "friend", src: "missedcall/s14.png", durationInSeconds: 2.9, zoom: [1.0, 1.07] },
  { id: "skytrain", src: "missedcall/s15.png", durationInSeconds: 2.6, zoom: [1.0, 1.09], driftX: 60 },

  // ── That night ─────────────────────────────────────────────────────────
  { id: "empty-bed", src: "missedcall/s16.png", durationInSeconds: 2.7, zoom: [1.0, 1.06] },
  // The pivot. No glow pulse, no drift — his own phone is calling and the reel
  // stops breathing for two and a half seconds.
  { id: "his-screen", src: "missedcall/s17.png", durationInSeconds: 2.6, zoom: [1.0, 1.0], punchIn: true },
  { id: "lit-face", src: "missedcall/s18.png", durationInSeconds: 2.1, zoom: [1.0, 1.0] },
  { id: "turns-it-over", src: "missedcall/s19.png", durationInSeconds: 2.3, zoom: [1.04, 1.0] },

  // ── Following her ──────────────────────────────────────────────────────
  { id: "her-taxi", src: "missedcall/s20.png", durationInSeconds: 2.6, zoom: [1.0, 1.08] },
  { id: "his-taxi", src: "missedcall/s21.png", durationInSeconds: 2.5, zoom: [1.02, 1.09] },
  { id: "traffic", src: "missedcall/s22.png", durationInSeconds: 3.4, zoom: [1.1, 1.0] },
  { id: "arrives", src: "missedcall/s23.png", durationInSeconds: 2.3, zoom: [1.0, 1.07] },

  // ── The twist ──────────────────────────────────────────────────────────
  { id: "facade", src: "missedcall/s24.png", durationInSeconds: 2.4, zoom: [1.06, 1.0], punchIn: true },
  { id: "she-enters", src: "missedcall/s25.png", durationInSeconds: 2.1, zoom: [1.0, 1.08] },
  { id: "nurse-knows", src: "missedcall/s26.png", durationInSeconds: 3.0, zoom: [1.0, 1.07] },
  { id: "schedule", src: "missedcall/s27.png", durationInSeconds: 4.2, zoom: [1.0, 1.1], driftY: -40 },
  { id: "alone-in-ward", src: "missedcall/s28.png", durationInSeconds: 2.4, zoom: [1.06, 1.0] },

  // ── He does not go in ──────────────────────────────────────────────────
  { id: "behind-glass", src: "missedcall/s29.png", durationInSeconds: 4.3, zoom: [1.0, 1.0] },
  { id: "final-corridor", src: "missedcall/s30.png", durationInSeconds: 4.4, zoom: [1.08, 1.0] },
  { id: "loop-slip", src: "missedcall/s01.png", durationInSeconds: 1.56, zoom: [1.0, 1.0] },
];

export interface Caption {
  text: string;
  from: number;
  to: number;
}

export const CAPTIONS: Caption[] = [
  { text: "ผมตามเบอร์นี้มาสามเดือน", from: 0.0, to: 2.3 },
  { text: "กว่าจะรู้ว่าปลายสายคือใคร", from: 2.3, to: 4.4 },
  { text: "สามเดือนก่อน เธอเริ่มกลับดึก", from: 4.7, to: 7.2 },
  { text: "กลับมาก็บอกว่าไม่หิว", from: 7.2, to: 9.4 },
  { text: "มือถือคว่ำตลอด ทุกครั้ง", from: 9.4, to: 11.6 },
  { text: "เราอยู่ห้องเดียวกัน แต่ไกลกันขึ้นทุกวัน", from: 11.6, to: 14.0 },
  { text: "ตีสองสี่สิบเจ็ด สายเข้าทุกคืน", from: 14.2, to: 16.4 },
  { text: "เธอไม่เคยรับตรงนั้น", from: 16.4, to: 18.4 },
  { text: "เธอเข้าไปรับในห้องน้ำ ทุกคืน", from: 18.7, to: 21.3 },
  { text: "ส่วนผมก็แกล้งหลับ ทุกคืน", from: 21.3, to: 23.9 },
  { text: "แล้วผมก็จำเบอร์นั้นไว้", from: 24.3, to: 26.3 },
  { text: "ใบเสร็จที่เธอไม่เคยบอกว่าไปไหนมา", from: 26.3, to: 28.8 },
  { text: "กลิ่นแอลกอฮอล์ติดมือเธอทุกวัน", from: 29.0, to: 31.1 },
  { text: "เพื่อนบอกว่าอย่าทนเลย", from: 31.3, to: 33.5 },
  { text: "แต่ผมทนมาสามเดือน เพราะอยากจับให้ได้คาตา", from: 33.5, to: 36.9 },
  { text: "คืนนั้นเธอเข้าห้องน้ำอีกครั้ง", from: 37.2, to: 39.6 },
  { text: "แต่คืนนั้น… คนที่โทรมา คือเธอ", from: 39.8, to: 42.6 },
  { text: "ผมมองจอนั้นอยู่นาน", from: 43.0, to: 44.9 },
  { text: "แล้วผมก็พลิกคว่ำมันลง", from: 44.9, to: 46.6 },
  { text: "เช้าวันรุ่งขึ้น ผมตามเธอไป", from: 46.9, to: 49.2 },
  { text: "บอกคนขับว่าตามคันนั้นไป", from: 49.2, to: 51.7 },
  { text: "รถติดทั้งเส้น", from: 52.0, to: 53.6 },
  { text: "ผมเตรียมประโยคไว้ในหัวตลอดทาง", from: 53.6, to: 55.5 },
  { text: "แล้วรถก็จอด", from: 55.8, to: 57.4 },
  { text: "ที่นั่นไม่ใช่คอนโดใคร ไม่ใช่โรงแรม", from: 57.4, to: 60.2 },
  { text: "โรงพยาบาล", from: 60.5, to: 61.8 },
  { text: "พยาบาลเรียกชื่อเธอ โดยไม่ต้องถาม", from: 62.1, to: 64.8 },
  { text: "ตารางนัดยาวเป็นหน้า", from: 65.1, to: 67.0 },
  { text: "เธอมาที่นี่ทุกสัปดาห์ สามเดือนแล้ว", from: 67.0, to: 69.4 },
  { text: "มาคนเดียว ทุกครั้ง", from: 69.6, to: 71.6 },
  { text: "ผมยืนอยู่หลังกระจกบานนั้น", from: 72.0, to: 74.0 },
  { text: "แล้วไม่ได้เปิดประตูเข้าไป", from: 74.0, to: 76.0 },
  { text: "เธอไม่ได้โกหกเพื่อจะทิ้งผม", from: 76.3, to: 78.4 },
  { text: "เธอโกหกเพื่อไม่ให้ผมต้องเลือก", from: 78.8, to: 80.9 },
  { text: "แต่คืนนั้น… ผมเลือกไปแล้ว", from: 81.2, to: 83.4 },
];

export const TOTAL_FRAMES = Math.round(
  SHOTS.reduce((sum, shot) => sum + shot.durationInSeconds, 0) * FPS,
);

export const SHOT_STARTS = SHOTS.reduce<number[]>((starts, shot, index) => {
  const previousStart = index === 0 ? 0 : starts[index - 1];
  const previousLength =
    index === 0 ? 0 : Math.round(SHOTS[index - 1].durationInSeconds * FPS);
  starts.push(previousStart + previousLength);
  return starts;
}, []);
