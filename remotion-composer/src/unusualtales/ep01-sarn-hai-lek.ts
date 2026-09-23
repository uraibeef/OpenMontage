/**
 * "เรื่องเล่าแปลก" ตอนที่ 1 — ศาลให้เลข.
 *
 * The first tale built on the unusual-tales-storytelling skill
 * (.agents/skills/unusual-tales-storytelling). One rule stated in the first
 * line, three uses with the third as the greedy one, two plants, a karmic
 * twist, an aphorism close and a silent hand-off that loops back to frame 0.
 *
 * It runs on the roach-war engine because the treatment is the same — flat ink
 * characters on photoreal Thai plates — but graded almost black-and-white in
 * the manner of 기기괴괴. The only colour the plates are allowed is red: the
 * red soda left for the spirit, the incense embers, the stamps. The price is
 * the only thing in colour.
 *
 * The plants, so a rewatch can find them:
 *   - visual: the family photograph never disappears (s13, s14, s16, s18)
 *   - spoken: "ศาลไม่เคยเอาของที่ผมไม่รัก"
 * Put together: the last thing he loved was himself, so that is what it took.
 *
 * Shot durations are cut to the transcribed voiceover.
 */

import type { Caption, Episode, Shot } from "../roachwar/constants";

const SHOTS: Shot[] = [
  // ── The rule ───────────────────────────────────────────────────────────
  { id: "shrine", src: "unusualtales/s01.png", durationInSeconds: 3.9, zoom: [1.0, 1.06], steady: true },
  { id: "rental-house", src: "unusualtales/s02.png", durationInSeconds: 3.4, zoom: [1.06, 1.0] },
  { id: "moving-in", src: "unusualtales/s03.png", durationInSeconds: 5.84, zoom: [1.0, 1.07] },

  // ── The small cruelty ──────────────────────────────────────────────────
  { id: "debts", src: "unusualtales/s04.png", durationInSeconds: 6.16, zoom: [1.0, 1.06] },
  { id: "mother-calls", src: "unusualtales/s05.png", durationInSeconds: 2.9, zoom: [1.0, 1.05] },
  { id: "dont-call", src: "unusualtales/s04.png", durationInSeconds: 2.98, zoom: [1.06, 1.1], punchIn: true },
  // Held still on her after the line goes dead.
  { id: "hung-up", src: "unusualtales/s05.png", durationInSeconds: 1.62, zoom: [1.05, 1.05] },

  // ── Use one ────────────────────────────────────────────────────────────
  { id: "incense", src: "unusualtales/s06.png", durationInSeconds: 3.69, zoom: [1.0, 1.07] },
  { id: "ash-two", src: "unusualtales/s07.png", durationInSeconds: 3.61, zoom: [1.0, 1.1], stamp: "47" },
  { id: "won", src: "unusualtales/s08.png", durationInSeconds: 2.1, zoom: [1.04, 1.0], punchIn: true },
  { id: "guitar-gone", src: "unusualtales/s09.png", durationInSeconds: 3.36, zoom: [1.0, 1.06] },

  // ── Use two ────────────────────────────────────────────────────────────
  { id: "kneeling", src: "unusualtales/s10.png", durationInSeconds: 2.04, zoom: [1.0, 1.05] },
  { id: "cash", src: "unusualtales/s11.png", durationInSeconds: 2.04, zoom: [1.05, 1.0], stamp: "815" },
  { id: "bike-gone", src: "unusualtales/s12.png", durationInSeconds: 4.16, zoom: [1.0, 1.07] },

  // ── The plant ──────────────────────────────────────────────────────────
  { id: "noticing", src: "unusualtales/s13.png", durationInSeconds: 3.66, zoom: [1.0, 1.05] },
  { id: "the-photo", src: "unusualtales/s14.png", durationInSeconds: 3.96, zoom: [1.0, 1.08] },

  // ── Use three: all in ──────────────────────────────────────────────────
  { id: "all-in", src: "unusualtales/s15.png", durationInSeconds: 4.58, zoom: [1.0, 1.07] },
  { id: "bare-room", src: "unusualtales/s16.png", durationInSeconds: 2.5, zoom: [1.05, 1.0] },
  { id: "ash-six", src: "unusualtales/s17.png", durationInSeconds: 2.7, zoom: [1.0, 1.1], stamp: "290614" },
  { id: "nothing-missing", src: "unusualtales/s18.png", durationInSeconds: 5.68, zoom: [1.0, 1.06] },

  // ── The twist ──────────────────────────────────────────────────────────
  { id: "driving", src: "unusualtales/s19.png", durationInSeconds: 4.5, zoom: [1.0, 1.07] },
  { id: "her-house", src: "unusualtales/s20.png", durationInSeconds: 1.82, zoom: [1.05, 1.0] },
  { id: "door-opens", src: "unusualtales/s21.png", durationInSeconds: 2.68, zoom: [1.0, 1.05] },
  // "มาหาใครคะ" — dead still. No weave, no zoom.
  { id: "who-are-you", src: "unusualtales/s22.png", durationInSeconds: 1.62, zoom: [1.0, 1.0] },
  { id: "photo-without-him", src: "unusualtales/s23.png", durationInSeconds: 6.96, zoom: [1.0, 1.1] },
  { id: "frozen", src: "unusualtales/s24.png", durationInSeconds: 2.84, zoom: [1.04, 1.0] },

  // ── The hand-off ───────────────────────────────────────────────────────
  { id: "next-tenant", src: "unusualtales/s25.png", durationInSeconds: 3.8, zoom: [1.0, 1.05] },
  // 1.73s, tuned so the composition lands on 2905 frames: the grain re-seeds
  // on frame % 12, so the final frame index must be a multiple of 12 to match
  // frame 0 and let the hand-off loop straight back into the opening shot.
  { id: "loop-slip", src: "unusualtales/s01.png", durationInSeconds: 1.73, zoom: [1.0, 1.0], steady: true },
];

const CAPTIONS: Caption[] = [
  { text: "ศาลพระภูมิหลังบ้านเช่าผม ให้เลขถูกทุกครั้ง", from: 0.0, to: 3.9 },
  { text: "แลกกับของในบ้าน ครั้งละหนึ่งชิ้น", from: 3.9, to: 7.3 },
  { text: "ผมเช่าบ้านหลังนี้เพราะมันถูก", from: 7.3, to: 9.9 },
  { text: "ถูกเพราะไม่มีใครอยู่ได้เกินสามเดือน", from: 9.9, to: 13.14 },
  { text: "ตอนนั้นผมติดหนี้พนันสองแสน", from: 13.14, to: 15.6 },
  { text: "ยืมเงินแม่มาสามปี ไม่เคยคืนสักบาท", from: 15.6, to: 19.3 },
  { text: "แม่โทรมาถามว่ากินข้าวหรือยัง", from: 19.3, to: 22.2 },
  { text: "ผมบอกว่า ถ้าไม่มีเงินให้ ก็ไม่ต้องโทรมา", from: 22.2, to: 25.18 },
  { text: "แล้วกดวาง", from: 25.18, to: 26.8 },
  { text: "คืนนั้นผมจุดธูปที่ศาล ขอเลขเล่นๆ", from: 26.8, to: 30.49 },
  { text: "เช้ามา ขี้เถ้าธูปขดเป็นเลขสองตัว", from: 30.49, to: 34.1 },
  { text: "ผมถูก", from: 34.1, to: 35.4 },
  { text: "แล้วกีตาร์ที่ผมเล่นมาตั้งแต่ ม.3 ก็หายไปจากห้อง", from: 35.4, to: 39.56 },
  { text: "ครั้งต่อมา ผมขอเลขสามตัว ถูกอีก", from: 39.56, to: 43.64 },
  { text: "มอเตอร์ไซค์คันแรกที่ผมผ่อนเอง หายไปจากหน้าบ้าน", from: 43.64, to: 47.8 },
  { text: "ผมเริ่มสังเกตว่า ศาลไม่เคยเอาของที่ผมไม่รัก", from: 47.8, to: 51.46 },
  { text: "รูปครอบครัวบนผนัง ยังแขวนอยู่ที่เดิมทุกครั้ง", from: 51.46, to: 55.42 },
  { text: "ครั้งที่สาม ผมเอาทุกอย่างที่มี ไปซื้อหวยชุดใหญ่", from: 55.42, to: 60.0 },
  { text: "ในบ้านเหลือแค่ที่นอน กับรูปใบนั้น", from: 60.0, to: 62.5 },
  { text: "เช้ามา ธูปขึ้นเลขหกตัว", from: 62.5, to: 65.2 },
  { text: "แต่ในบ้าน ไม่มีอะไรหายเลย", from: 65.2, to: 67.76 },
  { text: "ผมถูกที่หนึ่ง หกล้านบาท", from: 67.76, to: 70.88 },
  { text: "ผมขับรถไปบ้านแม่ ครั้งแรกในรอบสามปี", from: 70.88, to: 73.8 },
  { text: "ถือเงินสดไปคืนทั้งหมด", from: 73.8, to: 75.38 },
  { text: "แม่เปิดประตู มองหน้าผมอยู่นาน", from: 75.38, to: 78.2 },
  { text: "แล้วถามว่า…", from: 78.2, to: 79.88 },
  { text: "“มาหาใครคะ”", from: 79.88, to: 81.5 },
  { text: "บนผนังข้างหลังแม่ มีรูปครอบครัวใบเดียวกัน", from: 81.5, to: 85.84 },
  { text: "แต่ในรูป เหลือแม่ยืนอยู่คนเดียว", from: 85.84, to: 88.46 },
  { text: "ศาลไม่เคยเอาของที่ผมไม่รัก", from: 88.46, to: 91.3 },
  // Ends before the final frame on purpose, so the loop frame stays clean.
  { text: "คืนนั้นผมเพิ่งรู้… ว่าผมรักใครที่สุด", from: 91.3, to: 94.88 },
];

export const EP01_SARN_HAI_LEK: Episode = {
  voiceoverSrc: "unusualtales/vo_ep01.mp3",
  shots: SHOTS,
  captions: CAPTIONS,
  timestampShots: [],
  timestampLabel: "",
  stampTone: "red",
};
