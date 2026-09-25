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
  shot("the-elder", "s01", 0.0, 3.4),
  shot("the-giant-who-lights-the-sun", "s02", 3.4, 5.74),
  shot("the-giant-who-makes-war", "s03", 5.74, 8.45),

  // ── The world ──────────────────────────────────────────────────────────
  shot("the-house", "s04", 8.45, 11.89),
  shot("sky-and-cliffs", "s05", 11.89, 15.34),
  shot("she-comes-at-dusk", "s06", 15.34, 20.11),
  shot("the-feast", "s07", 20.11, 24.72),
  shot("jao-tee", "s08", 24.72, 29.79),
  shot("the-warning", "s09", 29.79, 36.14),

  // ── The sun goes out ───────────────────────────────────────────────────
  shot("dark-bulb", "s10", 36.14, 40.8),
  shot("three-nights-of-chanting", "s11", 40.8, 44.6),
  shot("they-carry-her-out", "s12", 44.6, 47.27),

  // ── The new giants ─────────────────────────────────────────────────────
  shot("they-arrive", "s13", 47.27, 54.13),
  shot("no-one-lights-it", "s14", 54.13, 57.26),
  shot("dinner", "s15", 57.26, 60.29),
  shot("hang-dam", "s16", 60.29, 65.13),
  shot("i-swear", "s17", 65.13, 67.68),
  shot("it-falls", "s18", 67.68, 71.09),
  shot("the-roar", "s19", 71.09, 72.75),
  shot("she-laughs", "s20", 72.75, 79.42),
  shot("he-looks-up", "s21", 79.42, 84.68),

  // ── Cliffhanger ────────────────────────────────────────────────────────
  shot("honey", "s22", 84.68, 92.01),
  shot("the-elder-remembers", "s23", 92.01, 96.51),
];

const CAPTIONS: Caption[] = [
  { text: "ในตำนานของเผ่าเพดาน", from: 0, to: 1.66 },
  { text: "มียักษ์อยู่สองตน", from: 1.61, to: 3.5 },
  { text: "ตนหนึ่งจุดดวงอาทิตย์ให้เราทุกค่ำ", from: 3.45, to: 5.84 },
  { text: "อีกตน ประกาศสงครามกับเราทั้งเผ่า", from: 5.79, to: 8.48 },
  { text: "บ้านไม้ริมคลองหลังนั้น", from: 8.5, to: 10.06 },
  { text: "คือโลกทั้งใบของเรา", from: 10.01, to: 11.99 },
  { text: "ฝ้าเพดานคือฟ้า", from: 11.94, to: 13.48 },
  { text: "ผนังคือหน้าผา", from: 13.43, to: 15.43 },
  { text: "ทุกหัวค่ำ", from: 15.39, to: 15.93 },
  { text: "ยักษ์ชราจะเดินออกมาที่ระเบียง", from: 15.88, to: 18.2 },
  { text: "แล้วจุดดวงอาทิตย์ดวงเล็ก", from: 18.15, to: 20.21 },
  { text: "แมลงนับพันบินมาหาแสงนั้น", from: 20.16, to: 22.14 },
  { text: "พวกเราไม่เคยต้องอดอยากเลยสักคืน", from: 22.09, to: 24.75 },
  { text: "ยักษ์ชราพูดกับเราทุกคืน", from: 24.77, to: 27.0 },
  { text: "นางเรียกพวกเราว่า เจ้าที่", from: 27.43, to: 29.7 },
  { text: "คืนไหนเราร้องทัก", from: 29.84, to: 31.05 },
  { text: "นางจะหยุดเดิน", from: 31.0, to: 31.93 },
  { text: "แล้วกลับเข้าบ้าน", from: 31.88, to: 33.27 },
  { text: "นางเชื่อเสียงเรา", from: 33.22, to: 34.23 },
  { text: "มากกว่าเสียงยักษ์ด้วยกัน", from: 34.18, to: 35.97 },
  { text: "จนค่ำวันหนึ่ง", from: 36.19, to: 37.22 },
  { text: "ดวงอาทิตย์ไม่ถูกจุด", from: 37.17, to: 39.21 },
  { text: "คืนต่อมาก็ไม่", from: 39.28, to: 40.9 },
  { text: "บ้านเต็มไปด้วยยักษ์ชุดดำ", from: 40.85, to: 42.92 },
  { text: "เสียงสวดดังอยู่สามคืน", from: 42.89, to: 44.7 },
  { text: "แล้วพวกเขาก็หามยักษ์ชราออกไป", from: 44.65, to: 47.1 },
  { text: "ปลายหน้าร้อน", from: 47.32, to: 48.24 },
  { text: "ยักษ์ตนใหม่ย้ายเข้ามา", from: 48.19, to: 50.82 },
  { text: "หลานชายของนาง", from: 50.79, to: 51.68 },
  { text: "กับภรรยาที่ท้องโต", from: 51.63, to: 54.1 },
  { text: "ไม่มีใครจุดดวงอาทิตย์ที่ระเบียงอีกเลย", from: 54.18, to: 57.1 },
  { text: "คืนแรกที่พวกเขากินข้าวใต้ฟ้าของเรา", from: 57.31, to: 60.34 },
  { text: "หางดำ พี่ชายข้า", from: 60.34, to: 61.87 },
  { text: "นักรบที่เก่งที่สุดของเผ่า", from: 61.82, to: 63.99 },
  { text: "ซุ่มอยู่กลางเพดาน", from: 63.94, to: 65.23 },
  { text: "เขาไม่ได้ตั้งใจ", from: 65.18, to: 66.62 },
  { text: "ข้าสาบานได้", from: 66.57, to: 67.78 },
  { text: "แต่ของที่หล่นลงไป", from: 67.73, to: 68.91 },
  { text: "ตกกลางหัวยักษ์พอดี", from: 68.86, to: 71.09 },
  { text: "ยักษ์ตะโกนจนผนังสั่น", from: 71.14, to: 72.85 },
  { text: "ภรรยาของเขาหัวเราะ", from: 72.8, to: 74.47 },
  { text: "บอกว่าโดนขี้ใส่หัว", from: 74.42, to: 75.99 },
  { text: "เดี๋ยวก็โชคดี", from: 75.94, to: 77.22 },
  { text: "แต่ยักษ์ไม่ขำด้วย", from: 77.17, to: 79.52 },
  { text: "คืนนั้น เขามองขึ้นมาที่ฟ้าของเรา", from: 79.47, to: 81.75 },
  { text: "นานกว่ายักษ์ตนไหนเคยมอง", from: 81.7, to: 84.36 },
  { text: "เช้าวันต่อมา", from: 84.73, to: 85.76 },
  { text: "เขากลับมาพร้อมถุงใบใหญ่", from: 85.71, to: 87.92 },
  { text: "ในถุงนั้น มีแผ่นสีเหลือง", from: 87.87, to: 89.64 },
  { text: "ที่เหนียวยิ่งกว่าน้ำผึ้ง", from: 89.59, to: 91.49 },
  { text: "ตอนต่อไป · ทุ่งน้ำผึ้งมรณะ", from: 92.81, to: 96.21 },
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
