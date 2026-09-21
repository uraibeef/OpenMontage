/**
 * "สงครามแมลงสาบ EP2 — รุ่นที่ไม่กลัวยา" — shot list, captions and timing.
 *
 * The satire of this episode is the one true thing in it: insecticide does not
 * exterminate a colony, it selects one. Every spray kills the weak and leaves
 * the strong to breed, so the humans in this story are not fighting the enemy,
 * they are manufacturing it. The narration never says that out loud in those
 * words; it just counts generations — three months against twenty-five years —
 * and lets the viewer do the arithmetic.
 *
 * Structurally this is the middle act, so it ends open. Floor fourteen is
 * empty; there are twenty-seven more.
 *
 * Shot durations are cut to the voiceover, not guessed — the narration was
 * transcribed and each shot starts on the beat where its line begins.
 */

import type { Caption, Episode, Shot } from "./constants";

export const VOICEOVER_SRC = "roachwar/vo_ep2.mp3";

/** The floor number is this episode's 03:11: one stencil, two appearances. */
const TIMESTAMP_SHOTS = ["floor-14"];

const SHOTS: Shot[] = [
  // ── Thank you for the poison ───────────────────────────────────────────
  { id: "crossing-residue", src: "roachwar/e01.png", durationInSeconds: 4.18, zoom: [1.0, 1.07], steady: true },
  { id: "footprints", src: "roachwar/e02.png", durationInSeconds: 1.82, zoom: [1.06, 1.0] },
  { id: "walked-past", src: "roachwar/e03.png", durationInSeconds: 3.7, zoom: [1.0, 1.08] },
  { id: "droplets", src: "roachwar/e04.png", durationInSeconds: 1.82, zoom: [1.05, 1.0], glow: "soft" },

  // ── Breeding the survivors ─────────────────────────────────────────────
  { id: "pairing", src: "roachwar/e05.png", durationInSeconds: 1.78, zoom: [1.0, 1.05] },
  { id: "egg-case", src: "roachwar/e06.png", durationInSeconds: 1.92, zoom: [1.06, 1.0], punchIn: true },
  { id: "hatching", src: "roachwar/e07.png", durationInSeconds: 2.18, zoom: [1.0, 1.08] },
  { id: "nymph-crossing", src: "roachwar/e08.png", durationInSeconds: 3.28, zoom: [1.0, 1.07] },

  // ── An arms race with only one side evolving ───────────────────────────
  { id: "new-bottle", src: "roachwar/e09.png", durationInSeconds: 2.84, zoom: [1.08, 1.0] },
  // Five seconds on a row of egg cases while the narration compares breeding
  // cycles. The image is the argument; the line is only the footnote.
  { id: "generations", src: "roachwar/e16.png", durationInSeconds: 4.88, zoom: [1.0, 1.1], driftX: 50 },
  { id: "refusing-bait", src: "roachwar/e10.png", durationInSeconds: 2.7, zoom: [1.0, 1.06] },
  { id: "dusty-bait", src: "roachwar/e11.png", durationInSeconds: 2.9, zoom: [1.07, 1.0] },
  { id: "repeller", src: "roachwar/e12.png", durationInSeconds: 2.6, zoom: [1.0, 1.06], glow: "soft" },
  { id: "other-side", src: "roachwar/e13.png", durationInSeconds: 2.54, zoom: [1.05, 1.0] },
  { id: "detour", src: "roachwar/e14.png", durationInSeconds: 2.36, zoom: [1.0, 1.07] },
  { id: "old-trap", src: "roachwar/e15.png", durationInSeconds: 1.8, zoom: [1.06, 1.0] },

  // ── The humans start leaving ───────────────────────────────────────────
  { id: "suitcase", src: "roachwar/e17.png", durationInSeconds: 2.6, zoom: [1.0, 1.07] },
  { id: "left-sofa", src: "roachwar/e18.png", durationInSeconds: 2.64, zoom: [1.0, 1.08] },
  { id: "dead-fridge", src: "roachwar/e19.png", durationInSeconds: 3.06, zoom: [1.06, 1.0] },
  { id: "removal-truck", src: "roachwar/e20.png", durationInSeconds: 2.84, zoom: [1.0, 1.07] },
  { id: "flicker-corridor", src: "roachwar/e22.png", durationInSeconds: 4.84, zoom: [1.0, 1.09] },
  { id: "noticeboard", src: "roachwar/e21.png", durationInSeconds: 5.14, zoom: [1.08, 1.0] },

  // ── Floor fourteen ─────────────────────────────────────────────────────
  { id: "stairs", src: "roachwar/e23.png", durationInSeconds: 2.08, zoom: [1.0, 1.06] },
  { id: "floor-14", src: "roachwar/e24.png", durationInSeconds: 2.06, zoom: [1.0, 1.0] },
  { id: "green-lamp", src: "roachwar/e25.png", durationInSeconds: 2.5, zoom: [1.0, 1.07] },
  // Five seconds, dead still. For the first time in his life he is not in a
  // hurry, so neither is the camera.
  { id: "standing", src: "roachwar/e26.png", durationInSeconds: 5.14, zoom: [1.0, 1.0] },
  { id: "the-many", src: "roachwar/e27.png", durationInSeconds: 3.1, zoom: [1.0, 1.08] },

  // ── Not yet ────────────────────────────────────────────────────────────
  { id: "the-question", src: "roachwar/e28.png", durationInSeconds: 3.5, zoom: [1.0, 1.05] },
  { id: "not-yet", src: "roachwar/e28.png", durationInSeconds: 2.84, zoom: [1.0, 1.0] },
  { id: "twenty-seven-more", src: "roachwar/e29.png", durationInSeconds: 1.66, zoom: [1.0, 1.09], driftY: -30 },
  // 2.01s, tuned so the whole composition lands on 2677 frames. The grain
  // re-seeds on frame % 12, so the final frame index has to be a multiple of
  // 12 to carry the same grain as frame 0 — otherwise the loop cut flickers.
  { id: "loop-slip", src: "roachwar/e01.png", durationInSeconds: 2.01, zoom: [1.0, 1.0], steady: true },
];

const CAPTIONS: Caption[] = [
  { text: "พวกมันฉีดยา เราขอบคุณ", from: 0.0, to: 2.3 },
  { text: "เพราะทุกครั้งที่ฉีด", from: 2.3, to: 4.18 },
  { text: "ตัวที่อ่อนแอตาย", from: 4.18, to: 6.0 },
  { text: "เหลือแต่ตัวที่ทน", from: 6.0, to: 7.8 },
  { text: "พวกมันไม่ได้กำจัดเรา", from: 7.8, to: 9.7 },
  { text: "พวกมันคัดเลือกเรา", from: 9.7, to: 11.52 },
  { text: "ผมรอดมาคนเดียว", from: 11.52, to: 13.3 },
  { text: "แล้วผมก็มีลูกสี่สิบตัว", from: 13.3, to: 15.22 },
  { text: "ลูกผมไม่กลัวกลิ่นยา", from: 15.22, to: 17.4 },
  { text: "ลูกผมเดินข้ามคราบยา เหมือนเดินข้ามฝุ่น", from: 17.4, to: 20.68 },
  { text: "พวกมันเปลี่ยนสูตร เราเปลี่ยนรุ่น", from: 20.68, to: 23.52 },
  { text: "รุ่นเราใช้เวลาสามเดือน", from: 23.52, to: 25.9 },
  { text: "รุ่นพวกมันใช้เวลายี่สิบห้าปี", from: 25.9, to: 28.4 },
  { text: "พวกมันเอาเหยื่อเจลมาวาง", from: 28.4, to: 31.1 },
  { text: "รุ่นที่ห้าของผม ไม่กินของหวาน", from: 31.1, to: 34.0 },
  { text: "พวกมันเอาเครื่องไล่คลื่นเสียงมาเสียบ", from: 34.0, to: 36.6 },
  { text: "เราย้ายไปอยู่อีกฝั่งของผนัง", from: 36.6, to: 39.14 },
  { text: "พวกมันเอากับดักกาวมาวาง", from: 39.14, to: 41.5 },
  { text: "เราเดินอ้อม", from: 41.5, to: 43.3 },
  { text: "ห้องหนึ่งสี่ศูนย์สอง ย้ายออกก่อน", from: 43.3, to: 45.9 },
  { text: "ทิ้งตู้เย็นไว้ ทิ้งโซฟาไว้", from: 45.9, to: 48.54 },
  { text: "แล้วห้องข้างๆก็ย้าย แล้วทั้งชั้นก็ย้าย", from: 48.54, to: 51.6 },
  { text: "ตอนแรกพวกมันเรียกเราว่าปัญหา", from: 51.6, to: 54.44 },
  { text: "ต่อมาเรียกว่าค่าส่วนกลาง", from: 54.44, to: 56.9 },
  { text: "สุดท้ายไม่เรียกอะไรเลย", from: 56.9, to: 59.28 },
  { text: "นิติบุคคลติดประกาศไว้หน้าลิฟต์", from: 59.28, to: 61.8 },
  { text: "ไม่มีใครอ่าน เพราะไม่มีใครอยู่แล้ว", from: 61.8, to: 64.42 },
  { text: "ผมเดินขึ้นบันไดหนีไฟ", from: 64.42, to: 66.5 },
  { text: "ชั้นสิบสี่ ว่างทั้งชั้น", from: 66.5, to: 68.56 },
  { text: "ไฟฉุกเฉินเหลือติดอยู่ดวงเดียว", from: 68.56, to: 71.06 },
  { text: "ผมยืนอยู่กลางทางเดิน", from: 71.06, to: 73.3 },
  { text: "ไม่มีใครเปิดไฟ ไม่มีใครถือรองเท้า", from: 73.3, to: 76.2 },
  { text: "เป็นครั้งแรกในชีวิต ที่ผมไม่ต้องรีบ", from: 76.2, to: 79.3 },
  { text: "ลูกหลานผมถามว่า นี่คือชัยชนะใช่ไหม", from: 79.3, to: 82.8 },
  { text: "ผมบอกว่า… ยัง", from: 82.8, to: 85.64 },
  { text: "ชั้นสิบสี่ว่างแล้ว", from: 85.64, to: 87.3 },
  // Ends before the final frame on purpose, so the loop frame stays clean.
  { text: "เหลืออีกยี่สิบเจ็ดชั้น", from: 87.3, to: 89.04 },
];

export const EP2: Episode = {
  voiceoverSrc: VOICEOVER_SRC,
  shots: SHOTS,
  captions: CAPTIONS,
  timestampShots: TIMESTAMP_SHOTS,
  timestampLabel: "ชั้น 14",
};
