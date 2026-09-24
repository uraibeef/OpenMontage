/**
 * "เรื่องเล่าแปลก" ตอนที่ 5 — สงครามของผมกับยุง.
 *
 * The anthology's genre break: no curse, no ghost. An orderly accountant
 * wages total war on the one mosquito that comes to his ear at two every
 * morning, and the war quietly costs him the lamp Mint gave him, then Mint.
 * When he finally wins, the silence is worse than the whine, so he opens the
 * window and lets the next one in. The enemy was the last thing still coming
 * to see him.
 *
 * The threads, so a rewatch can follow them:
 *   - the lamp Mint gave him breaks on night one (s04, s05) and its bare base
 *     is still on the bedside table at the end (s16)
 *   - "ไว้เธอชนะแล้ว ค่อยโทรมานะ" — he wins, calls, and her message is waiting
 *   - 02:00 on the clock every night, including the night nothing comes
 *
 * Red is blood, the coil embers and the clock. Shot durations are cut to the
 * transcribed voiceover.
 */

import type { Caption, Episode, Shot } from "../roachwar/constants";

const SHOTS: Shot[] = [
  // ── The enemy ──────────────────────────────────────────────────────────
  { id: "two-am", src: "unusualtales/ep05/s01.png", durationInSeconds: 7.2, zoom: [1.0, 1.07], steady: true, stamp: "02:00" },
  { id: "orderly", src: "unusualtales/ep05/s03.png", durationInSeconds: 5.4, zoom: [1.0, 1.05] },

  // ── Night one: the racket ──────────────────────────────────────────────
  { id: "the-swing", src: "unusualtales/ep05/s04.png", durationInSeconds: 6.9, zoom: [1.0, 1.08], punchIn: true },
  { id: "the-lamp", src: "unusualtales/ep05/s05b.png", durationInSeconds: 2.9, zoom: [1.04, 1.0] },
  { id: "mint-laughs", src: "unusualtales/ep05/s05.png", durationInSeconds: 5.5, zoom: [1.0, 1.06] },

  // ── Night two: the gas ─────────────────────────────────────────────────
  { id: "the-haze", src: "unusualtales/ep05/s06.png", durationInSeconds: 5.9, zoom: [1.0, 1.07] },
  { id: "mint-coughs", src: "unusualtales/ep05/s06.png", durationInSeconds: 3.8, zoom: [1.1, 1.16], driftX: 40 },
  { id: "call-me-when-you-win", src: "unusualtales/ep05/s07.png", durationInSeconds: 4.5, zoom: [1.0, 1.06] },

  // ── Night three: the siege ─────────────────────────────────────────────
  { id: "it-comes-back", src: "unusualtales/ep05/s01.png", durationInSeconds: 2.65, zoom: [1.06, 1.12], stamp: "02:00" },
  { id: "the-tape", src: "unusualtales/ep05/s08.png", durationInSeconds: 6.15, zoom: [1.0, 1.06] },
  { id: "the-net", src: "unusualtales/ep05/s09.png", durationInSeconds: 8.7, zoom: [1.0, 1.08] },

  // ── Victory ────────────────────────────────────────────────────────────
  { id: "it-lands", src: "unusualtales/ep05/s10.png", durationInSeconds: 3.4, zoom: [1.0, 1.08], stamp: "02:00" },
  { id: "my-own-blood", src: "unusualtales/ep05/s11.png", durationInSeconds: 4.7, zoom: [1.04, 1.1] },
  { id: "i-won", src: "unusualtales/ep05/s12.png", durationInSeconds: 3.8, zoom: [1.0, 1.05] },
  {
    id: "her-message",
    src: "unusualtales/ep05/s12.png",
    durationInSeconds: 4.9,
    zoom: [1.0, 1.0],
    chat: {
      name: "มิ้นท์",
      status: "ใช้งานล่าสุดเมื่อวาน",
      messages: [
        { side: "in", text: "ไว้เธอชนะแล้ว ค่อยโทรมานะ", at: 0.0 },
        { side: "in", text: "เราว่า เราพอแค่นี้นะ", at: 2.7 },
      ],
    },
  },

  // ── Silence ────────────────────────────────────────────────────────────
  { id: "awake", src: "unusualtales/ep05/s13.png", durationInSeconds: 4.6, zoom: [1.0, 1.06], stamp: "02:00" },
  { id: "the-window", src: "unusualtales/ep05/s14.png", durationInSeconds: 3.3, zoom: [1.0, 1.05] },
  { id: "sleep", src: "unusualtales/ep05/s15.png", durationInSeconds: 3.4, zoom: [1.0, 1.04] },
  { id: "the-only-one", src: "unusualtales/ep05/s16.png", durationInSeconds: 6.1, zoom: [1.0, 1.08] },

  // ── The loop ───────────────────────────────────────────────────────────
  { id: "it-comes-in", src: "unusualtales/ep05/s17.png", durationInSeconds: 3.0, zoom: [1.0, 1.05], stamp: "02:00" },
  // Tuned so (totalFrames - 1) % 12 === 0: the grain re-seeds on frame % 12,
  // so the last frame matches frame 0 and the loop into "two-am" is seamless.
  { id: "loop-slip", src: "unusualtales/ep05/s01.png", durationInSeconds: 1.6, zoom: [1.0, 1.0], steady: true },
];

const CAPTIONS: Caption[] = [
  { text: "ห้องผมมียุงอยู่ตัวเดียว", from: 0.0, to: 1.7 },
  { text: "มันมาทุกคืน ตีสองตรง บินมาร้องหวี่อยู่ข้างหูผม", from: 1.7, to: 5.6 },
  { text: "ผมทำบัญชีมาสิบปี ทุกอย่างในชีวิตผมต้องลงตัว", from: 7.2, to: 10.5 },
  { text: "ยกเว้นมัน", from: 10.5, to: 11.8 },
  { text: "คืนแรก ผมซื้อไม้ตียุงมาจากเซเว่น", from: 12.6, to: 15.0 },
  { text: "เหวี่ยงไปในความมืดเต็มแรง", from: 15.0, to: 16.8 },
  { text: "โดนโคมไฟที่มิ้นท์ซื้อให้ตอนผมย้ายเข้ามา", from: 16.8, to: 19.5 },
  { text: "แตกกระจาย", from: 19.5, to: 20.4 },
  { text: "ยุงไม่เป็นอะไรเลย", from: 20.4, to: 22.1 },
  { text: "มิ้นท์มองเศษโคมไฟแล้วหัวเราะ บอกว่า", from: 22.4, to: 24.8 },
  { text: "“ปล่อยมันไปเถอะ มันกินเลือดเธอนิดเดียวเอง”", from: 24.8, to: 27.5 },
  { text: "แต่ผมปล่อยไม่ได้", from: 27.9, to: 29.2 },
  { text: "คืนต่อมา ผมจุดยากันยุงสามขด ฉีดสเปรย์จนห้องขาวไปหมด", from: 29.2, to: 33.7 },
  { text: "มิ้นท์ไอทั้งคืน", from: 33.7, to: 35.1 },
  { text: "เช้ามาเธอเก็บของ กลับไปนอนห้องตัวเอง", from: 35.1, to: 37.6 },
  { text: "ก่อนออกไป เธอบอกว่า", from: 37.6, to: 39.3 },
  { text: "“ไว้เธอชนะแล้ว ค่อยโทรมานะ”", from: 39.3, to: 41.6 },
  { text: "ตีสองคืนนั้น เสียงหวี่ก็มาเหมือนเดิม", from: 42.1, to: 44.75 },
  { text: "ผมเลยทำสิ่งที่คนปกติไม่ทำ", from: 44.75, to: 46.9 },
  { text: "เอาเทปปิดทุกร่องประตู ทุกรูหน้าต่าง", from: 46.9, to: 49.7 },
  { text: "ลาป่วยสามวัน", from: 49.7, to: 50.95 },
  { text: "นั่งรอมันในมุ้ง เปิดไฟฉายค้างไว้ทั้งคืน", from: 50.95, to: 53.9 },
  { text: "มิ้นท์โทรมาหลายสาย ผมไม่ได้รับ", from: 53.9, to: 56.3 },
  { text: "ผมกลัวมันจะหนีไป ตอนผมเผลอ", from: 56.3, to: 58.9 },
  { text: "คืนที่สาม ตีสองตรง มันมาเกาะแขนผม", from: 59.6, to: 62.95 },
  { text: "ผมตบ", from: 62.95, to: 63.7 },
  { text: "บนฝ่ามือ มีรอยเลือดแดงเส้นเดียว", from: 63.7, to: 66.3 },
  { text: "เลือดของผมเอง", from: 66.3, to: 67.7 },
  { text: "ผมชนะแล้ว", from: 67.7, to: 69.5 },
  { text: "ผมหยิบโทรศัพท์จะโทรหามิ้นท์", from: 69.5, to: 71.5 },
  { text: "มีข้อความของเธอค้างอยู่ตั้งแต่เมื่อวาน", from: 71.5, to: 74.2 },
  { text: "เธอขอพอแค่นี้", from: 74.2, to: 76.3 },
  { text: "คืนนั้น ห้องผมไม่มีเสียงอะไรเลย", from: 76.4, to: 79.0 },
  { text: "ผมนอนลืมตาอยู่จนตีสอง", from: 79.0, to: 81.0 },
  { text: "แล้วผมก็ลุกไปแกะเทปที่หน้าต่างออก เปิดมันทิ้งไว้", from: 81.0, to: 84.25 },
  { text: "พอได้ยินเสียงหวี่ข้างหูอีกครั้ง ผมถึงหลับลงได้", from: 84.25, to: 87.6 },
  { text: "ผมไม่รู้ว่าผมรบกับมันมาเพื่ออะไร", from: 87.7, to: 89.9 },
  // Ends before the loop shot so the last frame and frame 0 stay clean.
  { text: "รู้แค่ว่าตอนนี้ มันเป็นตัวเดียว ที่ยังมาหาผมทุกคืน", from: 89.9, to: 93.8 },
];

export const EP05_MOSQUITO_WAR: Episode = {
  voiceoverSrc: "unusualtales/ep05/vo.mp3",
  shots: SHOTS,
  captions: CAPTIONS,
  timestampShots: [],
  timestampLabel: "",
  stampTone: "red",
};
