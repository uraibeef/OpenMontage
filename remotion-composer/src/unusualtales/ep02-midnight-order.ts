/**
 * "เรื่องเล่าแปลก" ตอนที่ 2 — ออเดอร์เที่ยงคืน.
 *
 * Built on the unusual-tales-storytelling skill, deliberately unlike ep01:
 * grace mode instead of karma (the rider is sympathetic), and a dead-all-along
 * twist that folds into a loop instead of a karmic one.
 *
 * The order he takes every midnight is the rice his rider friends order for
 * him, as an offering, at the lamp post where he crashed delivering that same
 * order the first time. He has been delivering his own offerings ever since.
 *
 * The plants, so a rewatch can find them:
 *   - visual: his half helmet carries the same jagged crack in every shot
 *     (the helmet hanging under the garland in s17 is that helmet)
 *   - visual: the garland on the lamp post is fresh every night (s11)
 *   - spoken: "หมาหน้าบ้านหอนยาว ตอนผมจอดรถ", twice — Thai viewers know why
 *     a dog howls at someone
 *
 * Shared world: the abandoned house at the end of the soi is the rental house
 * from ep01, the one nobody stays in for more than three months; the red soda
 * in the bag is the same offering.
 *
 * The phone in the last shot lights up with the same order and the reel loops
 * to frame 0: he will take it again tonight. Shot durations are cut to the
 * transcribed voiceover.
 */

import type { Caption, Episode, Shot } from "../roachwar/constants";

const SHOTS: Shot[] = [
  // ── The rule ───────────────────────────────────────────────────────────
  { id: "order", src: "unusualtales/ep02/s01.png", durationInSeconds: 2.95, zoom: [1.0, 1.06], steady: true, stamp: "00:00" },
  { id: "dead-end", src: "unusualtales/ep02/s02.png", durationInSeconds: 4.35, zoom: [1.06, 1.0] },

  // ── The wound ──────────────────────────────────────────────────────────
  { id: "red-light", src: "unusualtales/ep02/s03.png", durationInSeconds: 2.89, zoom: [1.0, 1.06] },
  { id: "mother", src: "unusualtales/ep02/s05.png", durationInSeconds: 2.91, zoom: [1.0, 1.05] },
  { id: "one-more-year", src: "unusualtales/ep02/s04.png", durationInSeconds: 3.1, zoom: [1.0, 1.06] },

  // ── Night one ──────────────────────────────────────────────────────────
  { id: "arrive", src: "unusualtales/ep02/s06.png", durationInSeconds: 3.53, zoom: [1.0, 1.07] },
  { id: "hang-bag", src: "unusualtales/ep02/s07.png", durationInSeconds: 1.57, zoom: [1.04, 1.0] },
  { id: "tip", src: "unusualtales/ep02/s08.png", durationInSeconds: 2.5, zoom: [1.0, 1.08], stamp: "+500" },
  { id: "howl", src: "unusualtales/ep02/s09.png", durationInSeconds: 2.96, zoom: [1.0, 1.06] },
  { id: "shrug", src: "unusualtales/ep02/s10.png", durationInSeconds: 2.04, zoom: [1.05, 1.0] },

  // ── Night two ──────────────────────────────────────────────────────────
  { id: "order-again", src: "unusualtales/ep02/s01.png", durationInSeconds: 4.0, zoom: [1.06, 1.12], stamp: "00:00" },
  { id: "garland", src: "unusualtales/ep02/s11.png", durationInSeconds: 3.89, zoom: [1.0, 1.08] },
  { id: "howl-again", src: "unusualtales/ep02/s09.png", durationInSeconds: 2.51, zoom: [1.08, 1.12] },
  // No clock stamp here: his helmet sits exactly where the stamp would go.
  { id: "waiting", src: "unusualtales/ep02/s12.png", durationInSeconds: 3.25, zoom: [1.0, 1.05] },

  // ── Night three ────────────────────────────────────────────────────────
  { id: "heavy-bag", src: "unusualtales/ep02/s13.png", durationInSeconds: 4.15, zoom: [1.0, 1.07] },
  { id: "open", src: "unusualtales/ep02/s14.png", durationInSeconds: 1.08, zoom: [1.04, 1.08], punchIn: true },
  { id: "offerings", src: "unusualtales/ep02/s15.png", durationInSeconds: 6.32, zoom: [1.0, 1.12] },

  // ── The twist ──────────────────────────────────────────────────────────
  { id: "frozen", src: "unusualtales/ep02/s16.png", durationInSeconds: 1.83, zoom: [1.0, 1.0] },
  { id: "helmet-on-post", src: "unusualtales/ep02/s17.png", durationInSeconds: 2.55, zoom: [1.0, 1.08] },
  // "ใบเดียวกับที่ผมใส่อยู่" — held still on the crack.
  { id: "same-crack", src: "unusualtales/ep02/s18.png", durationInSeconds: 1.9, zoom: [1.06, 1.06] },
  { id: "friends", src: "unusualtales/ep02/s19.png", durationInSeconds: 2.47, zoom: [1.0, 1.05] },
  { id: "skid", src: "unusualtales/ep02/s20.png", durationInSeconds: 3.45, zoom: [1.0, 1.07] },

  // ── The close and the loop ─────────────────────────────────────────────
  { id: "alone", src: "unusualtales/ep02/s21.png", durationInSeconds: 4.6, zoom: [1.0, 1.06] },
  { id: "it-rings-again", src: "unusualtales/ep02/s22.png", durationInSeconds: 2.5, zoom: [1.0, 1.05], stamp: "00:00" },
  // Tuned so (totalFrames - 1) % 12 === 0: the grain re-seeds on frame % 12,
  // so the last frame matches frame 0 and the loop into "order" is seamless.
  { id: "loop-slip", src: "unusualtales/ep02/s01.png", durationInSeconds: 1.433, zoom: [1.0, 1.0], steady: true },
];

const CAPTIONS: Caption[] = [
  { text: "ทุกคืนเที่ยงคืนตรง แอปจะเด้งออเดอร์เดิมให้ผม", from: 0.0, to: 2.95 },
  { text: "ข้าวหนึ่งกล่อง ส่งบ้านร้างท้ายซอย ทิปห้าร้อย", from: 2.95, to: 7.3 },
  { text: "ผมขี่ส่งของมาสองปี วันละสิบหกชั่วโมง", from: 7.3, to: 10.19 },
  { text: "แม่โทรมาถามว่า สงกรานต์นี้กลับบ้านไหม", from: 10.19, to: 13.1 },
  { text: "ผมบอกว่า ขอเก็บตังค์อีกปีนะแม่", from: 13.1, to: 15.9 },
  { text: "คืนแรก บ้านหลังนั้นมืดสนิท ประตูรั้วล่ามโซ่", from: 16.2, to: 19.73 },
  { text: "ผมแขวนถุงไว้ที่รั้ว", from: 19.73, to: 21.3 },
  { text: "ทิปห้าร้อยเด้งเข้ามาทันที", from: 21.3, to: 23.8 },
  { text: "หมาหน้าบ้านหอนยาว ตอนผมจอดรถ", from: 23.8, to: 26.76 },
  { text: "สงสัยมันไม่ชอบไรเดอร์", from: 26.76, to: 28.8 },
  { text: "คืนที่สอง ออเดอร์เดิม เวลาเดิม ที่เดิม", from: 28.8, to: 32.8 },
  { text: "เสาไฟหน้าบ้าน มีมาลัยผูกไว้ สดใหม่ทุกคืน", from: 32.8, to: 36.69 },
  { text: "หมาตัวเดิม ก็ยังหอนใส่ผม", from: 36.69, to: 39.2 },
  { text: "ผมเลิกรับออเดอร์อื่น นั่งรอแค่เที่ยงคืน", from: 39.2, to: 42.45 },
  { text: "คืนที่สาม ถุงหนักกว่าทุกครั้ง มีกลิ่นธูปลอยออกมา", from: 42.45, to: 46.6 },
  { text: "ผมแกะดู", from: 46.6, to: 47.68 },
  { text: "ข้างในมีมาลัย ข้าวกล่องปักธูปสามดอก น้ำแดงหนึ่งขวด", from: 47.68, to: 51.6 },
  { text: "กับรูปของผม ในกรอบสีดำ", from: 51.6, to: 54.0 },
  { text: "ผมหันไปที่เสาไฟ", from: 54.0, to: 55.83 },
  { text: "มีหมวกกันน็อกแตก แขวนอยู่ใต้มาลัย", from: 55.83, to: 58.38 },
  { text: "ใบเดียวกับที่ผมใส่อยู่", from: 58.38, to: 60.28 },
  { text: "เพื่อนไรเดอร์นั่งพนมมืออยู่ตรงนั้น", from: 60.28, to: 62.75 },
  { text: "ตรงที่รถผมคว่ำ ตอนมาส่งออเดอร์นี้ครั้งแรก", from: 62.75, to: 66.2 },
  // Ends before the phone lights up, so the last shot and the loop frame
  // stay clean.
  { text: "ผมส่งของถึงทุกบ้าน… ยกเว้นบ้านตัวเอง", from: 66.2, to: 70.6 },
];

export const EP02_MIDNIGHT_ORDER: Episode = {
  voiceoverSrc: "unusualtales/ep02/vo.mp3",
  shots: SHOTS,
  captions: CAPTIONS,
  timestampShots: [],
  timestampLabel: "",
  stampTone: "red",
};
