/**
 * "สงครามแมลงสาบ EP1 — วันที่แสงสว่างมา" — shot list, captions and timing.
 *
 * Same visual engine as the two previous reels: flat 2D ink characters
 * composited into photoreal cinematic Bangkok. What changes every time is the
 * instrument. The beggar reel used rain. The missed-call reel used a phone
 * screen. This one uses the kitchen ceiling light: in a cockroach's world a
 * light switch is an air-raid siren, so every pressure beat here is lit by one
 * and the massacre happens under full white glare.
 *
 * Two more rules specific to this series:
 *   - the camera never leaves the floor, and
 *   - humans are only ever legs, hands, boots and a gas mask.
 * Both exist so the viewer has to stay at two centimetres for eighty seconds.
 *
 * Shot durations are cut to the voiceover, not guessed — the narration was
 * transcribed and each shot starts on the beat where its line begins.
 *
 * The last beat returns to the opening image so the reel loops seamlessly, and
 * on the second pass the opening line stops being a boast and becomes a threat.
 */

import type { Caption, Episode, Shot } from "./constants";

export const VOICEOVER_SRC = "roachwar/vo_ep1.mp3";

/**
 * 03:11 is stamped once, on the microwave clock. It is the only number in the
 * whole episode, which is what makes it land: the narrator remembers the exact
 * minute his species ran out of time.
 */
const TIMESTAMP_SHOTS = ["clock"];

const SHOTS: Shot[] = [
  // ── Hook: we were here first ───────────────────────────────────────────
  { id: "counter", src: "roachwar/s01.png", durationInSeconds: 2.74, zoom: [1.0, 1.07], steady: true },
  { id: "street", src: "roachwar/s02.png", durationInSeconds: 2.62, zoom: [1.08, 1.0] },
  { id: "under-chair", src: "roachwar/s03.png", durationInSeconds: 2.72, zoom: [1.0, 1.06] },

  // ── They stacked boxes and called it home ──────────────────────────────
  { id: "tower", src: "roachwar/s04.png", durationInSeconds: 3.36, zoom: [1.0, 1.1], driftY: -40 },
  { id: "three-windows", src: "roachwar/s05.png", durationInSeconds: 4.0, zoom: [1.06, 1.0] },

  // ── The colony ─────────────────────────────────────────────────────────
  { id: "crawlspace", src: "roachwar/s06.png", durationInSeconds: 2.0, zoom: [1.0, 1.08] },
  { id: "nest", src: "roachwar/s07.png", durationInSeconds: 1.66, zoom: [1.05, 1.0] },
  { id: "old-canal", src: "roachwar/s08.png", durationInSeconds: 1.7, zoom: [1.0, 1.06] },

  // ── We only ever asked for what they threw away ────────────────────────
  { id: "feeding", src: "roachwar/s09.png", durationInSeconds: 3.92, zoom: [1.0, 1.09] },
  { id: "sandal", src: "roachwar/s11.png", durationInSeconds: 1.84, zoom: [1.1, 1.0], punchIn: true },
  { id: "garbage", src: "roachwar/s10.png", durationInSeconds: 2.88, zoom: [1.0, 1.08] },
  { id: "crumb-line", src: "roachwar/s12.png", durationInSeconds: 3.2, zoom: [1.06, 1.0] },

  // ── The light ──────────────────────────────────────────────────────────
  // The pivot of the episode. Hard glow, hard punch-in: the switch is thrown.
  { id: "light-on", src: "roachwar/s13.png", durationInSeconds: 2.48, zoom: [1.0, 1.05], glow: "hard", punchIn: true },
  { id: "clock", src: "roachwar/s14.png", durationInSeconds: 2.56, zoom: [1.0, 1.0] },
  // Same frame again, now dead still and unlit — the line explains what we saw.
  { id: "light-on-again", src: "roachwar/s13.png", durationInSeconds: 2.48, zoom: [1.0, 1.0] },

  // ── They came ──────────────────────────────────────────────────────────
  { id: "doorway", src: "roachwar/s15.png", durationInSeconds: 2.4, zoom: [1.0, 1.08] },
  { id: "exterminator", src: "roachwar/s16.png", durationInSeconds: 2.8, zoom: [1.0, 1.09], driftY: -30 },
  { id: "boots-again", src: "roachwar/s15.png", durationInSeconds: 1.6, zoom: [1.06, 1.0] },
  { id: "mask", src: "roachwar/s17.png", durationInSeconds: 1.44, zoom: [1.0, 1.06], punchIn: true },
  { id: "nozzle", src: "roachwar/s18.png", durationInSeconds: 1.44, zoom: [1.08, 1.0] },
  { id: "fog", src: "roachwar/s19.png", durationInSeconds: 1.6, zoom: [1.0, 1.12], glow: "soft" },

  // ── The dead ───────────────────────────────────────────────────────────
  // Five seconds, no zoom, no weave. She did not run and neither does the shot.
  { id: "mother", src: "roachwar/s20.png", durationInSeconds: 4.96, zoom: [1.0, 1.0] },
  { id: "brother", src: "roachwar/s21.png", durationInSeconds: 4.48, zoom: [1.0, 1.05] },
  { id: "battlefield", src: "roachwar/s22.png", durationInSeconds: 3.12, zoom: [1.06, 1.0] },

  // ── The survivor ───────────────────────────────────────────────────────
  { id: "crack", src: "roachwar/s23.png", durationInSeconds: 4.16, zoom: [1.0, 1.07] },
  { id: "from-inside", src: "roachwar/s24.png", durationInSeconds: 4.24, zoom: [1.05, 1.0] },
  { id: "light-off", src: "roachwar/s25.png", durationInSeconds: 1.84, zoom: [1.0, 1.0] },

  // ── Morning ────────────────────────────────────────────────────────────
  { id: "empty-floor", src: "roachwar/s26.png", durationInSeconds: 3.52, zoom: [1.0, 1.08] },
  { id: "walking-out", src: "roachwar/s27.png", durationInSeconds: 1.92, zoom: [1.06, 1.0] },

  // ── What they did not know ─────────────────────────────────────────────
  { id: "broken-antenna", src: "roachwar/s28.png", durationInSeconds: 2.56, zoom: [1.0, 1.06], punchIn: true },
  { id: "same-bottle", src: "roachwar/s29.png", durationInSeconds: 4.56, zoom: [1.08, 1.0] },
  // 2.8s, tuned so the whole composition lands on 2689 frames. The grain
  // re-seeds on frame % 12, so the final frame index has to be a multiple of
  // 12 to carry the same grain as frame 0 — otherwise the loop cut flickers.
  { id: "loop-slip", src: "roachwar/s01.png", durationInSeconds: 2.8, zoom: [1.0, 1.0], steady: true },
];

const CAPTIONS: Caption[] = [
  { text: "ผมอยู่ที่นี่ก่อนพวกมัน สองร้อยล้านปี", from: 0.0, to: 2.74 },
  { text: "ตอนพวกมันมาถึง", from: 2.74, to: 4.04 },
  { text: "ผมไม่ได้คิดอะไรเลย", from: 4.04, to: 5.36 },
  { text: "แค่สัตว์อีกชนิดที่หากินกลางคืนไม่เป็น", from: 5.36, to: 8.08 },
  { text: "พวกมันเอากล่องมาวางซ้อนกัน", from: 8.08, to: 10.04 },
  { text: "แล้วเรียกมันว่าบ้าน", from: 10.04, to: 11.44 },
  { text: "ยี่สิบแปดชั้น กล่องละสามชีวิต", from: 11.44, to: 13.72 },
  { text: "ไม่มีใครรู้จักใคร", from: 13.72, to: 15.44 },
  { text: "รังของเราอยู่ใต้กล่องพวกนั้น", from: 15.44, to: 17.44 },
  { text: "สามพันรุ่น ตั้งแต่ตรงนี้ยังเป็นคลอง", from: 17.44, to: 20.8 },
  { text: "เราไม่เคยขออะไรจากพวกมัน", from: 20.8, to: 22.72 },
  { text: "เราขอแค่สิ่งที่พวกมันทิ้ง", from: 22.72, to: 24.72 },
  { text: "พวกมันเรียกเราว่าสกปรก", from: 24.72, to: 26.56 },
  { text: "แต่ขยะทั้งหมดในตึกนี้ ไม่ใช่ของเรา", from: 26.56, to: 29.44 },
  { text: "เราคือคนเก็บกวาดที่ไม่เคยมีใครขอบคุณ", from: 29.44, to: 32.64 },
  { text: "จนคืนหนึ่ง… ไฟติด", from: 32.64, to: 35.12 },
  { text: "ตีสาม สิบเอ็ดนาที", from: 35.12, to: 37.68 },
  { text: "ไฟในครัวไม่เคยติดตอนตีสาม", from: 37.68, to: 40.16 },
  { text: "แล้ววันรุ่งขึ้น พวกมันก็มา", from: 40.16, to: 42.56 },
  { text: "ชุดขาว หน้ากาก ถังบนหลัง", from: 42.56, to: 45.36 },
  { text: "ผมเห็นแค่รองเท้า", from: 45.36, to: 46.96 },
  { text: "ผมไม่เคยเห็นหน้ามนุษย์เลยสักครั้ง", from: 46.96, to: 49.84 },
  { text: "แล้วหมอกก็มา", from: 49.84, to: 51.44 },
  { text: "แม่ผมอยู่ชั้นล่างสุดของรัง", from: 51.44, to: 53.52 },
  { text: "แม่ไม่ได้วิ่ง แม่แก่เกินจะวิ่ง", from: 53.52, to: 56.4 },
  { text: "พี่ชายผมตายตรงรอยต่อกระเบื้อง", from: 56.4, to: 58.8 },
  { text: "ห่างจากรูแค่สองก้าว", from: 58.8, to: 60.88 },
  { text: "สามพันรุ่น จบในสิบเจ็ดนาที", from: 60.88, to: 64.0 },
  { text: "ผมหลบอยู่หลังตู้เย็น", from: 64.0, to: 65.52 },
  { text: "ในรอยแตกที่กว้างเท่าตัวผมพอดี", from: 65.52, to: 68.16 },
  { text: "ผมได้ยินพวกมันคุยกัน", from: 68.16, to: 70.0 },
  { text: "พวกมันบอกว่า เรียบร้อยแล้วครับ", from: 70.0, to: 72.4 },
  { text: "แล้วไฟก็ดับ", from: 72.4, to: 74.24 },
  { text: "เช้ารุ่งขึ้น ผมเดินออกมา", from: 74.24, to: 76.32 },
  { text: "ไม่มีใครเหลือ", from: 76.32, to: 77.76 },
  { text: "พวกมันคิดว่าชนะแล้ว", from: 77.76, to: 79.68 },
  { text: "แต่มีเรื่องหนึ่งที่พวกมันไม่รู้", from: 79.68, to: 82.24 },
  { text: "ยาที่พวกมันฉีดคืนนั้น", from: 82.24, to: 84.08 },
  { text: "เป็นขวดเดียวกับที่ฉีดเมื่อสามปีก่อน", from: 84.08, to: 86.8 },
  // Ends a beat early on purpose: the last caption must be fully gone before
  // the final frame, or it will not match the opening frame and the loop seams.
  { text: "และรุ่นผม… กินมันมาตั้งแต่เกิด", from: 86.8, to: 89.1 },
];

export const EP1: Episode = {
  voiceoverSrc: VOICEOVER_SRC,
  shots: SHOTS,
  captions: CAPTIONS,
  timestampShots: TIMESTAMP_SHOTS,
  timestampLabel: "03:11",
};
