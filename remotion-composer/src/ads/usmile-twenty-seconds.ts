/**
 * usmile P10 — "ยี่สิบวินาที". A soft-sell spot, not a tie-in.
 *
 * An office worker who has brushed for twenty seconds, twice a day, all his
 * life — phone in the other hand — until a molar picks the quarterly sales
 * presentation to fail. The dentist does not ask how often he brushes; she
 * asks how long. The toothbrush arrives only after that, bought for the most
 * human reason there is: he does not want to lie back in that chair again.
 * The spot makes no product claims at all.
 *
 * It borrows the "เรื่องเล่าแปลก" look (flat ink characters on photoreal
 * Thai plates, graded grey) with one change: the only colour in the film is
 * the pastel blue of the toothbrush, and it does not appear until the story
 * has earned it.
 *
 * The threads: twenty seconds opens and closes the story; the sweet iced
 * coffee returns on the dentist's bill; the phone he brushed with ends up on
 * a shelf outside the bathroom. Shot durations are cut to the transcribed
 * voiceover.
 */

import type { Caption, Episode, Shot } from "../roachwar/constants";

const SHOTS: Shot[] = [
  // ── Twenty seconds ─────────────────────────────────────────────────────
  { id: "the-sink", src: "ads/usmile/s01.png", durationInSeconds: 5.46, zoom: [1.0, 1.06], steady: true },
  { id: "snooze", src: "ads/usmile/s03.png", durationInSeconds: 3.84, zoom: [1.0, 1.05] },
  { id: "brush-and-scroll", src: "ads/usmile/s04.png", durationInSeconds: 3.5, zoom: [1.0, 1.06] },
  { id: "the-train", src: "ads/usmile/s05.png", durationInSeconds: 4.9, zoom: [1.0, 1.06] },

  // ── The day ────────────────────────────────────────────────────────────
  { id: "the-desk", src: "ads/usmile/s06b.png", durationInSeconds: 2.75, zoom: [1.0, 1.05] },
  { id: "bubble-tea", src: "ads/usmile/s06.png", durationInSeconds: 4.05, zoom: [1.0, 1.05] },
  { id: "asleep-in-his-shirt", src: "ads/usmile/s07.png", durationInSeconds: 6.5, zoom: [1.0, 1.07] },

  // ── Wednesday ──────────────────────────────────────────────────────────
  { id: "the-presentation", src: "ads/usmile/s08.png", durationInSeconds: 7.5, zoom: [1.0, 1.06] },
  { id: "the-tooth", src: "ads/usmile/s09.png", durationInSeconds: 4.8, zoom: [1.02, 1.1], punchIn: true },

  // ── The dentist ────────────────────────────────────────────────────────
  { id: "open-wide", src: "ads/usmile/s10.png", durationInSeconds: 4.5, zoom: [1.0, 1.06] },
  // "หมอถามว่า แต่ละครั้งแปรงนานแค่ไหน" — held on the question.
  { id: "how-long", src: "ads/usmile/s11.png", durationInSeconds: 4.9, zoom: [1.04, 1.04] },
  { id: "the-x-ray", src: "ads/usmile/s11b.png", durationInSeconds: 3.4, zoom: [1.0, 1.08] },
  { id: "the-bill", src: "ads/usmile/s12.png", durationInSeconds: 2.9, zoom: [1.0, 1.05] },

  // ── The brush ──────────────────────────────────────────────────────────
  { id: "the-brush", src: "ads/usmile/s13.png", durationInSeconds: 2.75, zoom: [1.0, 1.05] },
  { id: "that-chair", src: "ads/usmile/s17.png", durationInSeconds: 4.55, zoom: [1.0, 1.06] },
  { id: "still-late", src: "ads/usmile/s15.png", durationInSeconds: 3.8, zoom: [1.0, 1.05] },
  { id: "no-phone", src: "ads/usmile/s16.png", durationInSeconds: 6.15, zoom: [1.0, 1.06] },
  { id: "twenty-seconds-saved", src: "ads/usmile/s01.png", durationInSeconds: 3.35, zoom: [1.06, 1.14] },
  { id: "paid-back", src: "ads/usmile/s17.png", durationInSeconds: 3.9, zoom: [1.06, 1.14] },

  // ── End card and loop ──────────────────────────────────────────────────
  { id: "end-card", src: "ads/usmile/s18.png", durationInSeconds: 3.6, zoom: [1.0, 1.04], stamp: "usmile P10" },
  // Tuned so (totalFrames - 1) % 12 === 0: the grain re-seeds on frame % 12,
  // so the last frame matches frame 0 and the loop into "the-sink" is seamless.
  { id: "loop-slip", src: "ads/usmile/s01.png", durationInSeconds: 1.633, zoom: [1.0, 1.0], steady: true },
];

const CAPTIONS: Caption[] = [
  { text: "ผมแปรงฟันเช้าเย็นมาตลอดชีวิต", from: 0.0, to: 1.95 },
  { text: "ครั้งละประมาณยี่สิบวินาที", from: 1.95, to: 4.2 },
  { text: "เช้าวันทำการ ผมตื่นหลังกดเลื่อนนาฬิกาปลุกไปสามรอบ", from: 5.46, to: 9.3 },
  { text: "มือขวาแปรงฟัน มืออีกข้างไถมือถืออ่านอีเมล", from: 9.3, to: 12.8 },
  { text: "ถูๆ ให้มีฟอง บ้วนน้ำ แล้ววิ่งไปขึ้นรถไฟฟ้า", from: 12.8, to: 16.6 },
  { text: "ระหว่างวัน ผมมีกาแฟเย็นหวานสามปั๊ม", from: 17.7, to: 20.45 },
  { text: "บ่ายสามมีชานมไข่มุก ที่คนในแผนกสั่งมาหารกัน", from: 20.45, to: 24.3 },
  { text: "คืนไหนเลิกดึก ผมก็หลับไปทั้งเสื้อเชิ้ต", from: 24.5, to: 26.95 },
  { text: "แปรงฟันเหรอ ไว้พรุ่งนี้ค่อยแปรงชดเชยสองรอบ", from: 26.95, to: 30.1 },
  { text: "แล้ววันพุธนั้นก็มาถึง", from: 31.0, to: 32.7 },
  { text: "ผมกำลังพรีเซนต์ยอดขายต่อหน้าผู้บริหาร", from: 32.7, to: 35.4 },
  { text: "แอร์ในห้องประชุมเย็นเฉียบ ผมจิบน้ำเย็นไปหนึ่งอึก", from: 35.4, to: 38.5 },
  { text: "ฟันกรามซี่ในสุดก็ปวดจี๊ดขึ้นมาถึงขมับ", from: 38.5, to: 41.3 },
  { text: "ผมพูดตัวเลขผิดไปสามหน้าติด", from: 41.3, to: 43.3 },
  { text: "หมอฟันส่องไฟดูอยู่นาน", from: 43.3, to: 45.3 },
  { text: "หมอไม่ได้ถามว่าผมแปรงฟันบ่อยแค่ไหน", from: 45.3, to: 47.8 },
  { text: "หมอถามว่า แต่ละครั้งแปรงนานแค่ไหน", from: 47.8, to: 50.7 },
  { text: "ผมตอบไม่ได้ เพราะไม่เคยนับ", from: 50.7, to: 52.7 },
  { text: "ฟันผุสามซี่ หนึ่งซี่ต้องรักษารากฟัน", from: 52.9, to: 56.1 },
  { text: "ค่ารักษาแพงกว่ากาแฟที่ผมกินมาทั้งปี", from: 56.1, to: 59.0 },
  { text: "คืนนั้น ผมซื้อแปรงไฟฟ้ามาหนึ่งด้าม", from: 59.0, to: 61.75 },
  { text: "ไม่ได้อยากเป็นคนใหม่อะไรหรอก", from: 61.75, to: 63.3 },
  { text: "แค่ไม่อยากกลับไปนอนอ้าปากบนเก้าอี้ตัวนั้นอีก", from: 63.3, to: 66.3 },
  { text: "ทุกวันนี้ผมยังตื่นสาย ยังกินกาแฟเหมือนเดิม", from: 66.4, to: 70.05 },
  { text: "แต่ตอนแปรงฟัน ผมวางมือถือไว้นอกห้องน้ำ", from: 70.05, to: 73.2 },
  { text: "ผมเคยคิดว่าตัวเองไม่มีเวลาแปรงฟันดีๆ", from: 73.4, to: 76.2 },
  { text: "จนได้รู้ว่า ยี่สิบวินาทีที่ประหยัดไปทุกเช้า", from: 76.2, to: 79.6 },
  // Ends before the end card so the product name has the frame to itself.
  { text: "สุดท้ายต้องมาจ่ายคืนบนเก้าอี้หมอฟัน ทีเดียวทั้งหมด", from: 79.6, to: 83.5 },
];

export const USMILE_TWENTY_SECONDS: Episode = {
  voiceoverSrc: "ads/usmile/vo.mp3",
  shots: SHOTS,
  captions: CAPTIONS,
  timestampShots: [],
  timestampLabel: "",
  stampTone: "ice",
};
