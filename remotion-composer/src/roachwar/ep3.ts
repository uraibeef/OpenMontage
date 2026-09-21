/**
 * "สงครามแมลงสาบ EP3 — เมืองที่ไม่มีใครเปิดไฟ" — shot list, captions and timing.
 *
 * The payoff of the trilogy, and the only episode where the narrator is wrong
 * about something. He opens with "we won" and spends ninety seconds finding out
 * what he won: a city with nothing in it, because his species never produced
 * anything — it lived on what someone else threw away, for three thousand
 * generations, and then there was no one else.
 *
 * So the colony reinvents everything it was exterminated for hating. It sorts
 * itself by birth order, it invents the word "mine", it builds a wall, and the
 * grandson defends the wall with the exact sentence the humans used about the
 * colony in EP1: outside is dirty. That is the whole trilogy's argument in one
 * line, which is why it gets the longest silence around it.
 *
 * The 03:11 stamp returns once, over the flashback to the corridor outside the
 * crack in EP1. Same two digits, third meaning.
 *
 * Shot durations are cut to the voiceover, not guessed — the narration was
 * transcribed and each shot starts on the beat where its line begins.
 */

import type { Caption, Episode, Shot } from "./constants";

export const VOICEOVER_SRC = "roachwar/vo_ep3.mp3";

/** The one callback to EP1: the minute the light came on, remembered. */
const TIMESTAMP_SHOTS = ["memory-boots"];

const SHOTS: Shot[] = [
  // ── We won ─────────────────────────────────────────────────────────────
  { id: "empty-road", src: "roachwar/t01.png", durationInSeconds: 4.38, zoom: [1.0, 1.07], steady: true },
  { id: "dark-skyline", src: "roachwar/t02.png", durationInSeconds: 3.46, zoom: [1.06, 1.0] },
  { id: "procession", src: "roachwar/t04.png", durationInSeconds: 3.16, zoom: [1.0, 1.08] },

  // ── Three years of eating the leftovers ────────────────────────────────
  { id: "stripped-store", src: "roachwar/t05.png", durationInSeconds: 2.76, zoom: [1.0, 1.07] },
  { id: "bare-cupboard", src: "roachwar/t07.png", durationInSeconds: 2.74, zoom: [1.06, 1.0] },
  { id: "empty-shelf", src: "roachwar/t06.png", durationInSeconds: 3.66, zoom: [1.0, 1.09], driftX: 45 },
  { id: "licked-clean", src: "roachwar/t08.png", durationInSeconds: 2.38, zoom: [1.07, 1.0] },
  { id: "empty-expressway", src: "roachwar/t03.png", durationInSeconds: 3.62, zoom: [1.0, 1.08] },
  { id: "one-crumb", src: "roachwar/t09.png", durationInSeconds: 3.5, zoom: [1.0, 1.1], punchIn: true },

  // ── The colony divides ─────────────────────────────────────────────────
  { id: "the-well", src: "roachwar/t10.png", durationInSeconds: 2.08, zoom: [1.05, 1.0] },
  { id: "wet-floor", src: "roachwar/t11.png", durationInSeconds: 3.26, zoom: [1.0, 1.08] },
  { id: "dry-floor", src: "roachwar/t12.png", durationInSeconds: 2.74, zoom: [1.06, 1.0] },
  { id: "the-census", src: "roachwar/t15.png", durationInSeconds: 3.38, zoom: [1.0, 1.07] },
  { id: "mine", src: "roachwar/t14.png", durationInSeconds: 3.74, zoom: [1.08, 1.0] },

  // ── The wall ───────────────────────────────────────────────────────────
  { id: "barricade", src: "roachwar/t16.png", durationInSeconds: 1.76, zoom: [1.0, 1.06] },
  { id: "wall-surface", src: "roachwar/t17.png", durationInSeconds: 2.28, zoom: [1.07, 1.0] },
  { id: "the-excluded", src: "roachwar/t19.png", durationInSeconds: 2.18, zoom: [1.0, 1.05] },
  { id: "grandson", src: "roachwar/t21.png", durationInSeconds: 2.74, zoom: [1.0, 1.06] },
  // The line that turns the trilogy over: outside is dirty. Held on the guards
  // standing watch, because the sentence is the humans' and now it is theirs.
  { id: "the-guards", src: "roachwar/t18.png", durationInSeconds: 3.24, zoom: [1.0, 1.0] },
  { id: "heard-before", src: "roachwar/t20.png", durationInSeconds: 3.14, zoom: [1.0, 1.06] },

  // ── Remembering EP1 ────────────────────────────────────────────────────
  { id: "memory-crack", src: "roachwar/t22.png", durationInSeconds: 2.38, zoom: [1.05, 1.0] },
  { id: "memory-boots", src: "roachwar/t23.png", durationInSeconds: 4.2, zoom: [1.0, 1.0] },

  // ── We became them ─────────────────────────────────────────────────────
  { id: "alone", src: "roachwar/t24.png", durationInSeconds: 4.12, zoom: [1.0, 1.07] },
  { id: "the-tower", src: "roachwar/t25.png", durationInSeconds: 3.3, zoom: [1.08, 1.0] },

  // ── Something turned a light on ────────────────────────────────────────
  { id: "one-window", src: "roachwar/t26.png", durationInSeconds: 4.2, zoom: [1.0, 1.08], glow: "soft" },
  { id: "looking-up", src: "roachwar/t27.png", durationInSeconds: 2.26, zoom: [1.0, 1.07], driftY: -35 },
  { id: "the-children", src: "roachwar/t28.png", durationInSeconds: 2.7, zoom: [1.06, 1.0] },
  { id: "i-dont-know", src: "roachwar/t29.png", durationInSeconds: 2.34, zoom: [1.0, 1.05] },
  // Dead still on the last line. He is not answering the children, he is
  // remembering what a light coming on used to mean.
  { id: "we-used-to-run", src: "roachwar/t29.png", durationInSeconds: 2.3, zoom: [1.0, 1.0] },
  // 2.5s, tuned so the whole composition lands on 2713 frames. The grain
  // re-seeds on frame % 12, so the final frame index has to be a multiple of
  // 12 to carry the same grain as frame 0 — otherwise the loop cut flickers.
  { id: "loop-slip", src: "roachwar/t01.png", durationInSeconds: 2.5, zoom: [1.0, 1.0], steady: true },
];

const CAPTIONS: Caption[] = [
  { text: "เราชนะ", from: 0.0, to: 1.6 },
  { text: "กรุงเทพเป็นของเรา", from: 1.6, to: 3.12 },
  { text: "ไม่มีไฟเปิด ไม่มีรองเท้า ไม่มีหมอก", from: 4.38, to: 7.8 },
  { text: "เราเดินกลางถนนได้ทั้งวัน", from: 7.84, to: 9.84 },
  { text: "ปีแรก เรากินของที่พวกมันทิ้งไว้", from: 11.0, to: 13.76 },
  { text: "ปีที่สอง ของในตู้เริ่มหมด", from: 14.16, to: 16.5 },
  { text: "ปีที่สาม ไม่มีอะไรเหลือให้เก็บกวาดแล้ว", from: 17.24, to: 20.16 },
  { text: "เพราะเราไม่เคยผลิตอะไรเลย", from: 20.42, to: 22.3 },
  { text: "เราเก็บของเหลือของคนอื่นมาตลอดสามพันรุ่น", from: 22.54, to: 25.66 },
  { text: "แล้วคนอื่น ก็ไม่มีแล้ว", from: 26.16, to: 28.5 },
  { text: "รังเริ่มแบ่งกัน", from: 29.66, to: 31.2 },
  { text: "ตัวที่แข็งแรงยึดชั้นล่าง ที่ยังมีน้ำ", from: 31.74, to: 34.58 },
  { text: "ตัวที่เหลือ ขึ้นไปอยู่ชั้นบน", from: 35.0, to: 37.32 },
  { text: "เราเริ่มนับว่าใครเกิดก่อน ใครเกิดหลัง", from: 37.74, to: 40.66 },
  { text: "เราเริ่มมีคำว่า… ของฉัน", from: 41.12, to: 43.32 },
  { text: "หลานผมสร้างกำแพง", from: 44.86, to: 46.5 },
  { text: "กั้นทางเดินไว้ครึ่งหนึ่ง", from: 46.62, to: 48.82 },
  { text: "อีกครึ่งหนึ่ง เป็นของพวกที่เข้าไม่ได้", from: 48.9, to: 50.54 },
  { text: "ผมถามหลานว่า ทำไมต้องกั้น", from: 51.08, to: 53.28 },
  { text: "หลานบอกว่า เพราะข้างนอกมันสกปรก", from: 53.82, to: 56.44 },
  { text: "คำนั้น ผมเคยได้ยินมาก่อน", from: 57.06, to: 59.36 },
  { text: "ผมเคยได้ยินตอนอยู่ใต้พื้นครัว", from: 60.2, to: 62.32 },
  { text: "ตอนที่ยังมีคนพูดว่า เรียบร้อยแล้วครับ", from: 62.58, to: 65.16 },
  { text: "สามพันรุ่น เราสู้กับมนุษย์", from: 66.78, to: 68.9 },
  { text: "แล้วเราก็ชนะ", from: 68.9, to: 70.4 },
  { text: "แล้วเราก็กลายเป็นมนุษย์", from: 70.9, to: 72.48 },
  { text: "เมื่อคืน มีแสงดวงหนึ่งเปิดขึ้นที่ชั้นยี่สิบแปด", from: 74.2, to: 77.78 },
  { text: "ไม่มีใครรู้ว่าใครเปิด", from: 78.4, to: 79.9 },
  { text: "เด็กๆถามว่า นั่นอะไร", from: 80.66, to: 82.58 },
  { text: "ผมบอกว่า… ไม่รู้สิ", from: 83.36, to: 85.02 },
  // Ends before the final frame on purpose, so the loop frame stays clean.
  { text: "แต่ตอนที่ไฟติด… เราเคยวิ่ง", from: 85.7, to: 88.0 },
];

export const EP3: Episode = {
  voiceoverSrc: VOICEOVER_SRC,
  shots: SHOTS,
  captions: CAPTIONS,
  timestampShots: TIMESTAMP_SHOTS,
  timestampLabel: "03:11",
};
