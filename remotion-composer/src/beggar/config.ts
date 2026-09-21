/**
 * "เกมของคนฉลาด" — shot list, captions and timing.
 *
 * Every shot duration below is cut to the voiceover, not guessed: the narration
 * was transcribed and each shot starts on the beat where its line begins.
 *
 * The visual language is a deliberate clash — the two characters are flat 2D
 * ink drawings, the Bangkok behind them is photographic. Motion therefore stays
 * on the background (slow push, drift) so the drawings read as cut-outs pinned
 * to a moving world.
 *
 * The final beat returns to the opening image at the opening zoom, so the reel
 * loops without a visible seam and the hook becomes the answer on second watch.
 */

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

export const VOICEOVER_SRC = "beggar/vo.mp3";

/** Emphasis marks that pop above a character, comic-book style. */
export type MarkKind = "question" | "exclaim" | "sweat" | "spark";

export interface Shot {
  id: string;
  /** File under public/beggar/shots/. */
  src: string;
  durationInSeconds: number;
  /** Background zoom at the first and last frame of the shot. */
  zoom: [from: number, to: number];
  /** Horizontal drift in pixels across the shot. */
  driftX?: number;
  /** Vertical drift in pixels across the shot. */
  driftY?: number;
  /** Weather layer over the still. Omit for the dead-still beats. */
  atmosphere?: "rain-light" | "rain-heavy";
  marks?: { kind: MarkKind; at: number; x: number; y: number }[];
  /** Punch in hard on the first frames so the cut lands like a hit. */
  punchIn?: boolean;
}

/**
 * Rain is a story instrument here, not weather: it starts light while the rich
 * man controls the game, turns heavy as he loses control, and stops dead on the
 * twist. Shots 13, 28 and 29 carry no atmosphere at all — the silence is the
 * effect.
 */
export const SHOTS: Shot[] = [
  // ── Hook: the ending, shown first ──────────────────────────────────────
  { id: "hook-slip", src: "beggar/shots/s01.png", durationInSeconds: 2.4, zoom: [1.0, 1.08] },
  { id: "hook-wall", src: "beggar/shots/s02.png", durationInSeconds: 2.1, zoom: [1.06, 1.0], punchIn: true },

  // ── Setup ──────────────────────────────────────────────────────────────
  { id: "walk-past", src: "beggar/shots/s03.png", durationInSeconds: 3.5, zoom: [1.02, 1.1], driftX: 70, atmosphere: "rain-light" },
  { id: "stall", src: "beggar/shots/s04.png", durationInSeconds: 3.0, zoom: [1.0, 1.07], atmosphere: "rain-light" },
  { id: "stops", src: "beggar/shots/s05.png", durationInSeconds: 2.0, zoom: [1.04, 1.1], atmosphere: "rain-light" },
  { id: "looks-up", src: "beggar/shots/s06.png", durationInSeconds: 1.5, zoom: [1.0, 1.05], atmosphere: "rain-light" },

  // ── The rules ──────────────────────────────────────────────────────────
  { id: "crouch", src: "beggar/shots/s07.png", durationInSeconds: 1.8, zoom: [1.06, 1.0], atmosphere: "rain-light" },
  { id: "two-shot", src: "beggar/shots/s08.png", durationInSeconds: 4.5, zoom: [1.0, 1.09], atmosphere: "rain-light" },
  { id: "low-angle", src: "beggar/shots/s09.png", durationInSeconds: 4.5, zoom: [1.0, 1.1], driftY: -40, atmosphere: "rain-light" },
  { id: "watch", src: "beggar/shots/s10.png", durationInSeconds: 2.7, zoom: [1.0, 1.12], atmosphere: "rain-light", marks: [{ kind: "spark", at: 0.3, x: 0.62, y: 0.18 }] },
  { id: "nods", src: "beggar/shots/s11.png", durationInSeconds: 2.5, zoom: [1.03, 1.0], atmosphere: "rain-light" },

  // ── First punch ────────────────────────────────────────────────────────
  { id: "asks", src: "beggar/shots/s12.png", durationInSeconds: 3.9, zoom: [1.0, 1.08], atmosphere: "rain-light" },
  { id: "still", src: "beggar/shots/s13.png", durationInSeconds: 2.3, zoom: [1.0, 1.0] }, // dead still, no rain
  { id: "reaches", src: "beggar/shots/s14.png", durationInSeconds: 2.8, zoom: [1.0, 1.09], atmosphere: "rain-light" },
  { id: "pays-100", src: "beggar/shots/s15.png", durationInSeconds: 2.3, zoom: [1.06, 1.0], atmosphere: "rain-light" },
  { id: "laughs", src: "beggar/shots/s16.png", durationInSeconds: 3.7, zoom: [1.0, 1.1], atmosphere: "rain-light", marks: [{ kind: "exclaim", at: 0.4, x: 0.24, y: 0.2 }] },

  // ── The turn ───────────────────────────────────────────────────────────
  { id: "my-turn", src: "beggar/shots/s17.png", durationInSeconds: 3.9, zoom: [1.0, 1.05], atmosphere: "rain-heavy" },
  { id: "riddle", src: "beggar/shots/s18.png", durationInSeconds: 3.6, zoom: [1.02, 1.09], atmosphere: "rain-heavy" },
  { id: "frown", src: "beggar/shots/s19.png", durationInSeconds: 3.0, zoom: [1.0, 1.1], atmosphere: "rain-heavy", marks: [{ kind: "question", at: 0.5, x: 0.66, y: 0.14 }] },
  { id: "searching", src: "beggar/shots/s20.png", durationInSeconds: 5.6, zoom: [1.0, 1.12], atmosphere: "rain-heavy" },
  { id: "sweating", src: "beggar/shots/s21.png", durationInSeconds: 2.9, zoom: [1.04, 1.12], atmosphere: "rain-heavy", marks: [{ kind: "sweat", at: 0.3, x: 0.7, y: 0.22 }] },
  { id: "time-passes", src: "beggar/shots/s22.png", durationInSeconds: 3.5, zoom: [1.1, 1.0], atmosphere: "rain-heavy" },

  // ── Surrender ──────────────────────────────────────────────────────────
  { id: "gives-up", src: "beggar/shots/s23.png", durationInSeconds: 2.5, zoom: [1.0, 1.06], atmosphere: "rain-heavy" },
  { id: "pays-10000", src: "beggar/shots/s24.png", durationInSeconds: 1.9, zoom: [1.08, 1.0], atmosphere: "rain-heavy", punchIn: true },
  { id: "pockets", src: "beggar/shots/s25.png", durationInSeconds: 4.6, zoom: [1.0, 1.07], atmosphere: "rain-heavy" },
  { id: "sleeps", src: "beggar/shots/s26.png", durationInSeconds: 4.6, zoom: [1.08, 1.0], atmosphere: "rain-heavy" },

  // ── The twist ──────────────────────────────────────────────────────────
  { id: "demands", src: "beggar/shots/s27.png", durationInSeconds: 4.4, zoom: [1.0, 1.08], punchIn: true },
  { id: "one-eye", src: "beggar/shots/s28.png", durationInSeconds: 4.5, zoom: [1.0, 1.0] }, // rain has stopped
  { id: "returns-100", src: "beggar/shots/s29.png", durationInSeconds: 5.8, zoom: [1.0, 1.0] }, // dead still

  // ── Close, then back to the first frame ────────────────────────────────
  { id: "final-wall", src: "beggar/shots/s30.png", durationInSeconds: 9.7, zoom: [1.1, 1.0] },
  { id: "loop-slip", src: "beggar/shots/s01.png", durationInSeconds: 1.84, zoom: [1.0, 1.0] },
];

export interface Caption {
  text: string;
  /** Seconds from the start of the reel. */
  from: number;
  to: number;
}

/**
 * Burned-in Thai captions, cut from the voiceover transcript.
 *
 * Most of this audience watches muted on a commute, so the reel has to work
 * with no sound at all — the captions are the fallback, not decoration.
 */
export const CAPTIONS: Caption[] = [
  { text: "คนที่เพิ่งได้เงินมาหมื่นนึง…", from: 0.0, to: 2.3 },
  { text: "ทำไมถึงโอนคืนไปร้อยนึง", from: 2.3, to: 4.4 },
  { text: "ทุกเย็น เสี่ยคนนี้เดินผ่านแผงหวยเจ้าเดิม", from: 4.5, to: 8.0 },
  { text: "ลุงคนขายนั่งตรงนั้นมาสิบปี", from: 8.5, to: 11.0 },
  { text: "วันนี้เสี่ยหยุดเดิน แล้วนั่งยองลงข้างๆ", from: 11.0, to: 14.2 },
  { text: "เล่นเกมกันไหมลุง", from: 14.5, to: 16.1 },
  { text: "ผมถามลุงหนึ่งข้อ ถ้าลุงตอบไม่ได้ ลุงจ่ายผมร้อยนึง", from: 16.3, to: 20.7 },
  { text: "แล้วลุงถามผมหนึ่งข้อ ถ้าผมตอบไม่ได้ ผมจ่ายลุงหมื่นนึง", from: 20.8, to: 25.3 },
  { text: "ร้อยแลกหมื่น หนึ่งต่อร้อย", from: 25.3, to: 28.0 },
  { text: "ลุงเงียบไปพักนึง แล้วพยักหน้าครั้งเดียว", from: 28.0, to: 31.5 },
  { text: "เสี่ยยิ้มอย่างมั่นใจ แล้วถามว่า", from: 31.5, to: 34.3 },
  { text: "ประเทศไทยมีทั้งหมดกี่เกาะ", from: 34.4, to: 36.6 },
  { text: "ลุงไม่คิดเลยสักวินาที หยิบมือถือขึ้นมา", from: 36.7, to: 39.4 },
  { text: "โอนร้อยนึงให้ทันที", from: 39.4, to: 41.6 },
  { text: "เสี่ยหัวเราะ ง่ายกว่าที่คิดอีก", from: 41.8, to: 45.3 },
  { text: "ทีนี้ตาผมถามบ้าง ลุงพูดเรียบๆ ไม่ยิ้มเลย", from: 45.4, to: 49.2 },
  { text: "สัตว์อะไร ขึ้นเขาสามขา แต่ลงเขาสี่ขา", from: 49.4, to: 53.0 },
  { text: "รอยยิ้มบนหน้าเสี่ยหายไป", from: 53.0, to: 55.9 },
  { text: "เขาคิด เขาค้น เขากดหาในมือถือ", from: 56.0, to: 58.8 },
  { text: "จนจอสว่างใส่หน้าตัวเอง", from: 58.8, to: 61.5 },
  { text: "ฝนตกหนักขึ้น รถวิ่งผ่านไปไม่รู้กี่คัน", from: 61.8, to: 65.4 },
  { text: "เวลาผ่านไปเงียบๆ", from: 65.6, to: 68.0 },
  { text: "สุดท้ายเสี่ยถอนหายใจ ผมยอมแพ้", from: 68.0, to: 70.4 },
  { text: "แล้วโอนหมื่นนึงให้ลุง", from: 70.5, to: 72.3 },
  { text: "ลุงเก็บมือถือใส่กระเป๋าเสื้อ ไม่ยิ้ม ไม่ดีใจ", from: 72.4, to: 76.9 },
  { text: "เหมือนรู้อยู่แล้วว่าต้องจบแบบนี้ แล้วเอนหลังพิงเสา หลับตา", from: 77.0, to: 81.0 },
  { text: "เดี๋ยวก่อนลุง แล้วคำตอบมันคืออะไร", from: 81.6, to: 85.6 },
  { text: "ลุงลืมตาขึ้นแวบเดียว ไม่พูดอะไรสักคำ", from: 86.0, to: 89.5 },
  { text: "หยิบมือถือขึ้นมา โอนคืนไปร้อยนึง แล้วหลับตาต่อ", from: 89.6, to: 93.5 },
  { text: "เพราะลุงเองก็ไม่รู้คำตอบเหมือนกัน", from: 93.5, to: 96.3 },
  { text: "ลุงจ่ายร้อยนึง เพื่อซื้อสิทธิ์ถามคำถาม", from: 96.5, to: 99.2 },
  { text: "แล้วได้กลับมาหมื่นนึง", from: 99.2, to: 101.2 },
  { text: "บางที คนที่ชนะ ไม่ใช่คนที่รู้ทุกคำตอบ", from: 101.4, to: 104.6 },
  { text: "แต่เป็นคนที่รู้ว่าเกมนี้เล่นยังไง", from: 104.6, to: 107.8 },
];

export const TOTAL_FRAMES = Math.round(
  SHOTS.reduce((sum, shot) => sum + shot.durationInSeconds, 0) * FPS,
);

/** Frame index where each shot begins, in the same order as SHOTS. */
export const SHOT_STARTS = SHOTS.reduce<number[]>((starts, shot, index) => {
  const previousStart = index === 0 ? 0 : starts[index - 1];
  const previousLength =
    index === 0 ? 0 : Math.round(SHOTS[index - 1].durationInSeconds * FPS);
  starts.push(previousStart + previousLength);
  return starts;
}, []);
