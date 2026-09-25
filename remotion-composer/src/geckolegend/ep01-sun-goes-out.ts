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
  shot("the-elder", "s01", 0.0, 2.9),
  shot("the-giant-who-lights-the-sun", "s02", 2.9, 5.27),
  shot("the-giant-who-makes-war", "s03", 5.27, 7.46),

  // ── The world ──────────────────────────────────────────────────────────
  shot("the-house", "s04", 7.46, 10.24),
  shot("sky-and-cliffs", "s05", 10.24, 12.56),
  shot("she-comes-at-dusk", "s06", 12.56, 16.88),
  shot("the-feast", "s07", 16.88, 21.08),
  shot("jao-tee", "s08", 21.08, 25.03),
  shot("the-warning", "s09", 25.03, 30.9),

  // ── The sun goes out ───────────────────────────────────────────────────
  shot("dark-bulb", "s10", 30.9, 33.91),
  shot("three-nights-of-chanting", "s11", 33.91, 37.07),
  shot("they-carry-her-out", "s12", 37.07, 39.38),

  // ── The new giants ─────────────────────────────────────────────────────
  shot("they-arrive", "s13", 39.38, 43.86),
  shot("no-one-lights-it", "s14", 43.86, 46.7),
  shot("dinner", "s15", 46.7, 48.86),
  shot("hang-dam", "s16", 48.86, 52.75),
  shot("i-swear", "s17", 52.75, 54.91),
  shot("it-falls", "s18", 54.91, 57.7),
  shot("the-roar", "s19", 57.7, 58.99),
  shot("she-laughs", "s20", 58.99, 63.51),
  shot("he-looks-up", "s21", 63.51, 67.32),

  // ── Cliffhanger ────────────────────────────────────────────────────────
  shot("honey", "s22", 67.32, 74.4),
  shot("the-elder-remembers", "s23", 74.4, 78.9),
];

const CAPTIONS: Caption[] = [
  { text: "ในตำนานของเผ่าเพดาน", from: 0, to: 1.77 },
  { text: "มียักษ์อยู่สองตน", from: 1.72, to: 3.0 },
  { text: "ตนหนึ่งจุดดวงอาทิตย์ให้เราทุกค่ำ", from: 2.95, to: 5.37 },
  { text: "อีกตน ประกาศสงครามกับเราทั้งเผ่า", from: 5.32, to: 7.56 },
  { text: "บ้านไม้ริมคลองหลังนั้น", from: 7.51, to: 8.95 },
  { text: "คือโลกทั้งใบของเรา", from: 8.9, to: 10.34 },
  { text: "ฝ้าเพดานคือฟ้า", from: 10.29, to: 11.26 },
  { text: "ผนังคือหน้าผา", from: 11.21, to: 12.66 },
  { text: "ทุกหัวค่ำ", from: 12.61, to: 13.43 },
  { text: "ยักษ์ชราจะเดินออกมาที่ระเบียง", from: 13.38, to: 15.23 },
  { text: "แล้วจุดดวงอาทิตย์ดวงเล็ก", from: 15.18, to: 16.98 },
  { text: "แมลงนับพันบินมาหาแสงนั้น", from: 16.93, to: 18.57 },
  { text: "พวกเราไม่เคยอดอยากเลยสักคืน", from: 18.52, to: 21.18 },
  { text: "ยักษ์ชราพูดกับเราทุกคืน", from: 21.13, to: 23.52 },
  { text: "นางเรียกพวกเราว่า เจ้าที่", from: 23.47, to: 25.13 },
  { text: "คืนไหนเราร้องทัก", from: 25.08, to: 26.2 },
  { text: "นางจะหยุดเดิน", from: 26.15, to: 27.15 },
  { text: "แล้วกลับเข้าบ้าน", from: 27.1, to: 27.96 },
  { text: "นางเชื่อเสียงเรา", from: 27.91, to: 29.31 },
  { text: "มากกว่าเสียงยักษ์ด้วยกัน", from: 29.26, to: 31.0 },
  { text: "จนค่ำวันหนึ่ง", from: 30.95, to: 31.81 },
  { text: "ดวงอาทิตย์ไม่ถูกจุด", from: 31.76, to: 33.19 },
  { text: "คืนต่อมาก็ไม่", from: 33.14, to: 34.01 },
  { text: "บ้านเต็มไปด้วยยักษ์ชุดดำ", from: 33.96, to: 35.56 },
  { text: "เสียงสวดดังอยู่สามคืน", from: 35.51, to: 37.17 },
  { text: "แล้วพวกเขาก็หามยักษ์ชราออกไป", from: 37.12, to: 39.48 },
  { text: "ปลายหน้าร้อน", from: 39.43, to: 40.21 },
  { text: "ยักษ์ตนใหม่ย้ายเข้ามา", from: 40.16, to: 42.0 },
  { text: "หลานชายของนาง", from: 41.95, to: 42.98 },
  { text: "กับเมียที่ท้องโต", from: 42.93, to: 43.96 },
  { text: "ไม่มีใครจุดดวงอาทิตย์ที่ระเบียงอีกเลย", from: 43.91, to: 46.8 },
  { text: "คืนแรกที่พวกเขากินข้าวใต้ฟ้าของเรา", from: 46.75, to: 48.96 },
  { text: "หางดำ พี่ชายข้า", from: 48.91, to: 49.92 },
  { text: "นักรบที่เก่งที่สุดของเผ่า", from: 49.87, to: 51.64 },
  { text: "ซุ่มอยู่กลางเพดาน", from: 51.59, to: 52.85 },
  { text: "เขาไม่ได้ตั้งใจ", from: 52.8, to: 53.98 },
  { text: "ข้าสาบานได้", from: 53.93, to: 55.01 },
  { text: "แต่ของที่หล่นลงไป", from: 54.96, to: 56.36 },
  { text: "ตกกลางหัวยักษ์พอดี", from: 56.31, to: 57.8 },
  { text: "ยักษ์ตะโกนจนผนังสั่น", from: 57.75, to: 59.09 },
  { text: "เมียของเขาหัวเราะ", from: 59.04, to: 60.28 },
  { text: "บอกว่าโดนขี้ใส่หัว", from: 60.23, to: 61.42 },
  { text: "เดี๋ยวก็โชคดี", from: 61.37, to: 62.33 },
  { text: "แต่ยักษ์ไม่ขำด้วย", from: 62.28, to: 63.61 },
  { text: "คืนนั้น เขาแหงนมองฟ้าของเรา", from: 63.56, to: 65.8 },
  { text: "นานกว่ายักษ์ตนไหนเคยมอง", from: 65.75, to: 67.42 },
  { text: "เช้าวันต่อมา", from: 67.37, to: 68.46 },
  { text: "เขากลับมาพร้อมถุงใบใหญ่", from: 68.41, to: 70.75 },
  { text: "ในถุงนั้น มีแผ่นสีเหลือง", from: 70.7, to: 72.06 },
  { text: "ที่เหนียวยิ่งกว่าน้ำผึ้ง", from: 72.01, to: 73.83 },
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
