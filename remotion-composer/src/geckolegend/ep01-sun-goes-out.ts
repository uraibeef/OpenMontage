/**
 * "ตำนานยักษ์กับจิ้งจก" ตอนที่ 1 — ดวงอาทิตย์ดับ.
 *
 * Told by an old gecko on the roof beam, in the Microlore look: the geckos
 * are people with lizard heads, the humans are giants we never see the face
 * of. The grandmother lit the veranda bulb every evening and called the
 * geckos "เจ้าที่"; she dies, her grandson moves in, and one accidental
 * dropping on his head at dinner starts the war.
 *
 * Every shot is a Kling 2.5 clip whose first frame is the still in `src`.
 * Shot durations are cut to the transcribed voiceover.
 */

import type { Caption, Episode, Shot } from "../roachwar/constants";

const DIR = "geckolegend/ep01";
const clip = (n: string) => `${DIR}/video/${n}.mp4`;
const still = (n: string) => `${DIR}/${n}.png`;

const shot = (
  id: string,
  n: string,
  from: number,
  to: number,
  extra: Partial<Shot> = {},
): Shot => ({
  id,
  src: still(n),
  video: clip(n),
  durationInSeconds: Number((to - from).toFixed(3)),
  zoom: [1.0, 1.0],
  ...extra,
});

const SHOTS: Shot[] = [
  // ── The legend ─────────────────────────────────────────────────────────
  shot("the-elder", "s01", 0, 2.55),
  shot("the-giant-who-lights-the-sun", "s02", 2.55, 4.55),
  shot("the-giant-who-makes-war", "s03", 4.55, 7.45),

  // ── The world ──────────────────────────────────────────────────────────
  shot("the-house", "s04", 7.45, 9.95),
  shot("sky-and-cliffs", "s05", 9.95, 12.5),
  shot("she-comes-at-dusk", "s06", 12.5, 16.95),
  shot("the-feast", "s07", 16.95, 21.2),
  shot("jao-tee", "s08", 21.2, 24.75),
  shot("the-warning", "s09", 24.75, 30.85),

  // ── The sun goes out ───────────────────────────────────────────────────
  shot("dark-bulb", "s10", 30.85, 33.9),
  shot("three-nights-of-chanting", "s11", 33.9, 37.05),
  shot("they-carry-her-out", "s12", 37.05, 39.4),

  // ── The new giants ─────────────────────────────────────────────────────
  shot("they-arrive", "s13", 39.4, 43.85),
  shot("no-one-lights-it", "s14", 43.85, 46.7),
  shot("dinner", "s15", 46.7, 49.1),
  shot("hang-dam", "s16", 49.1, 53.05),
  shot("i-swear", "s17", 53.05, 54.7),
  shot("it-falls", "s18", 54.7, 57.8),
  shot("the-roar", "s19", 57.8, 59.3),
  shot("she-laughs", "s20", 59.3, 63.85),
  shot("he-looks-up", "s21", 63.85, 67.95),

  // ── Cliffhanger ────────────────────────────────────────────────────────
  shot("honey", "s22", 67.95, 74.4),
  shot("the-elder-remembers", "s23", 74.4, 78.9),
];

const CAPTIONS: Caption[] = [
  { text: "ในตำนานของเผ่าเพดาน", from: 0.0, to: 1.5 },
  { text: "มียักษ์อยู่สองตน", from: 1.5, to: 2.6 },
  { text: "ตนหนึ่งจุดดวงอาทิตย์ให้เราทุกค่ำ", from: 2.6, to: 4.6 },
  { text: "อีกตน ประกาศสงครามกับเราทั้งเผ่า", from: 4.6, to: 7.3 },
  { text: "บ้านไม้ริมคลองหลังนั้น", from: 7.5, to: 8.78 },
  { text: "คือโลกทั้งใบของเรา", from: 8.78, to: 10.15 },
  { text: "ฝ้าเพดานคือฟ้า", from: 10.15, to: 11.2 },
  { text: "ผนังคือหน้าผา", from: 11.2, to: 12.4 },
  { text: "ทุกหัวค่ำ", from: 12.55, to: 13.35 },
  { text: "ยักษ์ชราจะเดินออกมาที่ระเบียง", from: 13.35, to: 15.45 },
  { text: "แล้วจุดดวงอาทิตย์ดวงเล็ก", from: 15.45, to: 17.0 },
  { text: "แมลงนับพันบินมาหาแสงนั้น", from: 17.0, to: 18.65 },
  { text: "พวกเราไม่เคยอดอยากเลยสักคืน", from: 18.65, to: 21.0 },
  { text: "ยักษ์ชราพูดกับเราทุกคืน", from: 21.25, to: 23.05 },
  { text: "นางเรียกพวกเราว่า เจ้าที่", from: 23.05, to: 24.78 },
  { text: "คืนไหนเราร้องทัก", from: 24.78, to: 26.02 },
  { text: "นางจะหยุดเดิน", from: 26.02, to: 27.05 },
  { text: "แล้วกลับเข้าบ้าน", from: 27.05, to: 28.08 },
  { text: "นางเชื่อเสียงเรา", from: 28.08, to: 29.07 },
  { text: "มากกว่าเสียงยักษ์ด้วยกัน", from: 29.07, to: 30.6 },
  { text: "จนค่ำวันหนึ่ง", from: 30.9, to: 31.74 },
  { text: "ดวงอาทิตย์ไม่ถูกจุด", from: 31.74, to: 33.07 },
  { text: "คืนต่อมาก็ไม่", from: 33.07, to: 33.9 },
  { text: "บ้านเต็มไปด้วยยักษ์ชุดดำ", from: 33.9, to: 35.5 },
  { text: "เสียงสวดดังอยู่สามคืน", from: 35.5, to: 37.1 },
  { text: "แล้วพวกเขาก็หามยักษ์ชราออกไป", from: 37.1, to: 39.1 },
  { text: "ปลายหน้าร้อน", from: 39.42, to: 40.22 },
  { text: "ยักษ์ตนใหม่ย้ายเข้ามา", from: 40.22, to: 41.85 },
  { text: "หลานชายของนาง", from: 41.85, to: 42.86 },
  { text: "กับเมียที่ท้องโต", from: 42.86, to: 43.9 },
  { text: "ไม่มีใครจุดดวงอาทิตย์ที่ระเบียงอีกเลย", from: 43.9, to: 46.4 },
  { text: "คืนแรกที่พวกเขากินข้าวใต้ฟ้าของเรา", from: 46.74, to: 49.14 },
  { text: "หางดำ พี่ชายข้า", from: 49.14, to: 50.23 },
  { text: "นักรบที่เก่งที่สุดของเผ่า", from: 50.23, to: 51.9 },
  { text: "ซุ่มอยู่กลางเพดาน", from: 51.9, to: 53.1 },
  { text: "เขาไม่ได้ตั้งใจ", from: 53.1, to: 54.03 },
  { text: "ข้าสาบานได้", from: 54.03, to: 54.75 },
  { text: "แต่ของที่หล่นลงไป", from: 54.75, to: 55.93 },
  { text: "ตกกลางหัวยักษ์พอดี", from: 55.93, to: 57.6 },
  { text: "ยักษ์ตะโกนจนผนังสั่น", from: 57.83, to: 59.34 },
  { text: "เมียของเขาหัวเราะ", from: 59.34, to: 60.65 },
  { text: "บอกว่าโดนขี้ใส่หัว", from: 60.65, to: 61.9 },
  { text: "เดี๋ยวก็โชคดี", from: 61.9, to: 62.76 },
  { text: "แต่ยักษ์ไม่ขำด้วย", from: 62.76, to: 63.9 },
  { text: "คืนนั้น เขาแหงนมองฟ้าของเรา", from: 63.9, to: 65.86 },
  { text: "นานกว่ายักษ์ตนไหนเคยมอง", from: 65.86, to: 67.8 },
  { text: "เช้าวันต่อมา", from: 68.06, to: 68.81 },
  { text: "เขากลับมาพร้อมถุงใบใหญ่", from: 68.81, to: 70.48 },
  { text: "ในถุงนั้น มีแผ่นสีเหลือง", from: 70.48, to: 71.96 },
  { text: "ที่เหนียวยิ่งกว่าน้ำผึ้ง", from: 71.96, to: 74.2 },
  { text: "ตอนต่อไป · ทุ่งน้ำผึ้งมรณะ", from: 75.2, to: 78.6 },
];

export const GECKO_LEGEND_EP01: Episode = {
  voiceoverSrc: `${DIR}/vo.mp3`,
  musicSrc: `${DIR}/music.mp3`,
  musicVolume: 0.22,
  shots: SHOTS,
  captions: CAPTIONS,
  timestampShots: [],
  timestampLabel: "",
  captionStyle: "legend",
  cleanLook: true,
};
