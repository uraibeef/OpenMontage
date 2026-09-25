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
  shot("the-elder", "s01", 0.0, 4.0),
  shot("the-giant-who-lights-the-sun", "s02", 4.0, 6.79),
  shot("the-giant-who-makes-war", "s03", 6.79, 9.78),

  // ── The world ──────────────────────────────────────────────────────────
  shot("the-house", "s04", 9.78, 13.25),
  shot("sky-and-cliffs", "s05", 13.25, 17.08),
  shot("she-comes-at-dusk", "s06", 17.08, 22.51),
  shot("the-feast", "s07", 22.51, 28.85),
  shot("jao-tee", "s08", 28.85, 33.99),
  shot("the-warning", "s09", 33.99, 42.5),

  // ── The sun goes out ───────────────────────────────────────────────────
  shot("dark-bulb", "s10", 42.5, 48.12),
  shot("three-nights-of-chanting", "s11", 48.12, 53.26),
  shot("they-carry-her-out", "s12", 53.26, 56.11),

  // ── The new giants ─────────────────────────────────────────────────────
  shot("they-arrive", "s13", 56.11, 62.32),
  shot("no-one-lights-it", "s14", 62.32, 65.93),
  shot("dinner", "s15", 65.93, 68.92),
  shot("hang-dam", "s16", 68.92, 74.43),
  shot("i-swear", "s17", 74.43, 77.22),
  shot("it-falls", "s18", 77.22, 81.18),
  shot("the-roar", "s19", 81.18, 83.18),
  shot("she-laughs", "s20", 83.18, 90.34),
  shot("he-looks-up", "s21", 90.34, 95.22),

  // ── Cliffhanger ────────────────────────────────────────────────────────
  shot("honey", "s22", 95.22, 104.26),
  shot("the-elder-remembers", "s23", 104.26, 108.76),
];

const CAPTIONS: Caption[] = [
  { text: "ในตำนานของเผ่าเพดาน", from: 0.01, to: 2.09 },
  { text: "มียักษ์อยู่สองตน", from: 2.04, to: 4.1 },
  { text: "ตนหนึ่งจุดดวงอาทิตย์ให้เราทุกค่ำ", from: 4.05, to: 6.89 },
  { text: "อีกตน ประกาศสงครามกับเราทั้งเผ่า", from: 6.84, to: 9.77 },
  { text: "บ้านไม้ริมคลองหลังนั้น", from: 9.83, to: 11.86 },
  { text: "คือโลกทั้งใบของเรา", from: 11.81, to: 13.35 },
  { text: "ฝ้าเพดานคือฟ้า", from: 13.3, to: 15.21 },
  { text: "ผนังคือหน้าผา", from: 15.16, to: 17.15 },
  { text: "ทุกหัวค่ำ", from: 17.13, to: 18.05 },
  { text: "ยักษ์ชราจะเดินออกมาที่ระเบียง", from: 18.0, to: 20.66 },
  { text: "แล้วจุดดวงอาทิตย์ดวงเล็ก", from: 20.61, to: 22.61 },
  { text: "แมลงนับพันบินมาหาแสงนั้น", from: 22.56, to: 25.41 },
  { text: "พวกเราไม่เคยต้องอดอยากเลยสักคืน", from: 25.36, to: 28.85 },
  { text: "ยักษ์ชราพูดกับเราทุกคืน", from: 28.9, to: 31.46 },
  { text: "นางเรียกพวกเราว่า เจ้าที่", from: 31.52, to: 34.08 },
  { text: "คืนไหนเราร้องทัก", from: 34.04, to: 35.87 },
  { text: "นางจะหยุดเดิน", from: 35.94, to: 37.2 },
  { text: "แล้วกลับเข้าบ้าน", from: 37.15, to: 38.82 },
  { text: "นางเชื่อเสียงเรา", from: 38.98, to: 40.23 },
  { text: "มากกว่าเสียงยักษ์ด้วยกัน", from: 40.18, to: 42.28 },
  { text: "จนค่ำวันหนึ่ง", from: 42.55, to: 44.07 },
  { text: "ดวงอาทิตย์ไม่ถูกจุด", from: 44.02, to: 45.68 },
  { text: "คืนต่อมาก็ไม่", from: 45.63, to: 48.22 },
  { text: "บ้านเต็มไปด้วยยักษ์ชุดดำ", from: 48.17, to: 51.16 },
  { text: "เสียงสวดดังอยู่สามคืน", from: 51.11, to: 53.36 },
  { text: "แล้วพวกเขาก็หามยักษ์ชราออกไป", from: 53.31, to: 56.02 },
  { text: "ปลายหน้าร้อน", from: 56.16, to: 57.32 },
  { text: "ยักษ์ตนใหม่ย้ายเข้ามา", from: 57.27, to: 59.44 },
  { text: "หลานชายของนาง", from: 59.39, to: 60.94 },
  { text: "กับเมียที่ท้องโต", from: 60.89, to: 62.42 },
  { text: "ไม่มีใครจุดดวงอาทิตย์ที่ระเบียงอีกเลย", from: 62.37, to: 65.74 },
  { text: "คืนแรกที่พวกเขากินข้าวใต้ฟ้าของเรา", from: 65.98, to: 69.02 },
  { text: "หางดำ พี่ชายข้า", from: 68.97, to: 70.91 },
  { text: "นักรบที่เก่งที่สุดของเผ่า", from: 70.86, to: 73.14 },
  { text: "ซุ่มอยู่กลางเพดาน", from: 73.09, to: 74.53 },
  { text: "เขาไม่ได้ตั้งใจ", from: 74.48, to: 76.21 },
  { text: "ข้าสาบานได้", from: 76.16, to: 77.32 },
  { text: "แต่ของที่หล่นลงไป", from: 77.27, to: 78.88 },
  { text: "ตกกลางหัวยักษ์พอดี", from: 78.83, to: 81.16 },
  { text: "ยักษ์ตะโกนจนผนังสั่น", from: 81.23, to: 83.28 },
  { text: "เมียของเขาหัวเราะ", from: 83.23, to: 85.28 },
  { text: "บอกว่าโดนขี้ใส่หัว", from: 85.23, to: 86.96 },
  { text: "เดี๋ยวก็โชคดี", from: 86.91, to: 88.29 },
  { text: "แต่ยักษ์ไม่ขำด้วย", from: 88.24, to: 90.44 },
  { text: "คืนนั้น เขาแหงนมองฟ้าของเรา", from: 90.39, to: 92.27 },
  { text: "นานกว่ายักษ์ตนไหนเคยมอง", from: 92.22, to: 94.88 },
  { text: "เช้าวันต่อมา", from: 95.27, to: 96.71 },
  { text: "เขากลับมาพร้อมถุงใบใหญ่", from: 96.66, to: 98.82 },
  { text: "ในถุงนั้น มีแผ่นสีเหลือง", from: 98.77, to: 101.37 },
  { text: "ที่เหนียวยิ่งกว่าน้ำผึ้ง", from: 101.32, to: 103.71 },
  { text: "ตอนต่อไป · ทุ่งน้ำผึ้งมรณะ", from: 105.06, to: 108.46 },
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
