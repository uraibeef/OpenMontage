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
  shot("the-elder", "s01", 0.0, 2.96),
  shot("the-giant-who-lights-the-sun", "s02", 2.96, 5.17),
  shot("the-giant-who-makes-war", "s03", 5.17, 7.77),

  // ── The world ──────────────────────────────────────────────────────────
  shot("the-house", "s04", 7.77, 10.68),
  shot("sky-and-cliffs", "s05", 10.68, 13.33),
  shot("she-comes-at-dusk", "s06", 13.33, 17.95),
  shot("the-feast", "s07", 17.95, 22.01),
  shot("jao-tee", "s08", 22.01, 25.99),
  shot("the-warning", "s09", 25.99, 32.18),

  // ── The sun goes out ───────────────────────────────────────────────────
  shot("dark-bulb", "s10", 32.18, 35.92),
  shot("three-nights-of-chanting", "s11", 35.92, 39.59),
  shot("they-carry-her-out", "s12", 39.59, 41.81),

  // ── The new giants ─────────────────────────────────────────────────────
  shot("they-arrive", "s13", 41.81, 47.02),
  shot("no-one-lights-it", "s14", 47.02, 49.52),
  shot("dinner", "s15", 49.52, 51.97),
  shot("hang-dam", "s16", 51.97, 56.69),
  shot("i-swear", "s17", 56.69, 58.69),
  shot("it-falls", "s18", 58.69, 61.34),
  shot("the-roar", "s19", 61.34, 63.07),
  shot("she-laughs", "s20", 63.07, 67.53),
  shot("he-looks-up", "s21", 67.53, 72.19),

  // ── Cliffhanger ────────────────────────────────────────────────────────
  shot("honey", "s22", 72.19, 78.83),
  shot("the-elder-remembers", "s23", 78.83, 83.33),
];

const CAPTIONS: Caption[] = [
  { text: "ในตำนานของเผ่าเพดาน", from: 0.0, to: 1.86 },
  { text: "มียักษ์อยู่สองตน", from: 1.81, to: 3.06 },
  { text: "ตนหนึ่งจุดดวงอาทิตย์ให้เราทุกค่ำ", from: 3.01, to: 5.27 },
  { text: "อีกตน ประกาศสงครามกับเราทั้งเผ่า", from: 5.22, to: 7.87 },
  { text: "บ้านไม้ริมคลองหลังนั้น", from: 7.82, to: 9.48 },
  { text: "คือโลกทั้งใบของเรา", from: 9.43, to: 10.79 },
  { text: "ฝ้าเพดานคือฟ้า", from: 10.73, to: 12.13 },
  { text: "ผนังคือหน้าผา", from: 12.08, to: 13.43 },
  { text: "ทุกหัวค่ำ", from: 13.38, to: 14.42 },
  { text: "ยักษ์ชราจะเดินออกมาที่ระเบียง", from: 14.37, to: 16.52 },
  { text: "แล้วจุดดวงอาทิตย์ดวงเล็ก", from: 16.47, to: 18.05 },
  { text: "แมลงนับพันบินมาหาแสงนั้น", from: 18.0, to: 19.66 },
  { text: "พวกเราไม่เคยอดอยากเลยสักคืน", from: 19.61, to: 22.11 },
  { text: "ยักษ์ชราพูดกับเราทุกคืน", from: 22.06, to: 24.2 },
  { text: "นางเรียกพวกเราว่า เจ้าที่", from: 24.15, to: 26.09 },
  { text: "คืนไหนเราร้องทัก", from: 26.04, to: 27.52 },
  { text: "นางจะหยุดเดิน", from: 27.47, to: 28.63 },
  { text: "แล้วกลับเข้าบ้าน", from: 28.58, to: 29.56 },
  { text: "นางเชื่อเสียงเรา", from: 29.51, to: 30.78 },
  { text: "มากกว่าเสียงยักษ์ด้วยกัน", from: 30.73, to: 32.28 },
  { text: "จนค่ำวันหนึ่ง", from: 32.23, to: 33.75 },
  { text: "ดวงอาทิตย์ไม่ถูกจุด", from: 33.7, to: 34.95 },
  { text: "คืนต่อมาก็ไม่", from: 34.9, to: 36.02 },
  { text: "บ้านเต็มไปด้วยยักษ์ชุดดำ", from: 35.97, to: 37.93 },
  { text: "เสียงสวดดังอยู่สามคืน", from: 37.88, to: 39.69 },
  { text: "แล้วพวกเขาก็หามยักษ์ชราออกไป", from: 39.64, to: 41.91 },
  { text: "ปลายหน้าร้อน", from: 41.86, to: 43.2 },
  { text: "ยักษ์ตนใหม่ย้ายเข้ามา", from: 43.15, to: 44.92 },
  { text: "หลานชายของนาง", from: 44.87, to: 46.02 },
  { text: "กับเมียที่ท้องโต", from: 45.97, to: 47.12 },
  { text: "ไม่มีใครจุดดวงอาทิตย์ที่ระเบียงอีกเลย", from: 47.07, to: 49.62 },
  { text: "คืนแรกที่พวกเขากินข้าวใต้ฟ้าของเรา", from: 49.57, to: 52.07 },
  { text: "หางดำ พี่ชายข้า", from: 52.02, to: 53.35 },
  { text: "นักรบที่เก่งที่สุดของเผ่า", from: 53.3, to: 55.35 },
  { text: "ซุ่มอยู่กลางเพดาน", from: 55.3, to: 56.79 },
  { text: "เขาไม่ได้ตั้งใจ", from: 56.74, to: 57.89 },
  { text: "ข้าสาบานได้", from: 57.84, to: 58.79 },
  { text: "แต่ของที่หล่นลงไป", from: 58.74, to: 60.06 },
  { text: "ตกกลางหัวยักษ์พอดี", from: 60.01, to: 61.44 },
  { text: "ยักษ์ตะโกนจนผนังสั่น", from: 61.39, to: 63.17 },
  { text: "เมียของเขาหัวเราะ", from: 63.12, to: 64.52 },
  { text: "บอกว่าโดนขี้ใส่หัว", from: 64.47, to: 65.58 },
  { text: "เดี๋ยวก็โชคดี", from: 65.53, to: 66.43 },
  { text: "แต่ยักษ์ไม่ขำด้วย", from: 66.38, to: 67.62 },
  { text: "คืนนั้น เขาแหงนมองฟ้าของเรา", from: 67.58, to: 69.8 },
  { text: "นานกว่ายักษ์ตนไหนเคยมอง", from: 69.75, to: 72.29 },
  { text: "เช้าวันต่อมา", from: 72.24, to: 73.15 },
  { text: "เขากลับมาพร้อมถุงใบใหญ่", from: 73.1, to: 75.2 },
  { text: "ในถุงนั้น มีแผ่นสีเหลือง", from: 75.15, to: 76.6 },
  { text: "ที่เหนียวยิ่งกว่าน้ำผึ้ง", from: 76.55, to: 78.29 },
  { text: "ตอนต่อไป · ทุ่งน้ำผึ้งมรณะ", from: 79.63, to: 83.03 },
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
