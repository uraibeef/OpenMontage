/**
 * "กลุ่มไลน์หมู่บ้าน EP1 — ข้อความล่าสุด".
 *
 * Scene plan and story are Codex's (projects/village-line-group/artifacts);
 * this file is the edit. Timings are cut to the delivered voiceover, which ran
 * shorter than the planned 72s, so every scene boundary was re-derived from the
 * transcription rather than scaled.
 *
 * The first frame is the hook and is fully formed at frame 0: a dead
 * neighbour's account, typing.
 */

import type { Caption, Episode, Scene } from "./constants";

const DEAD_AUNT = "ป้าสมศรี (เสียชีวิต)";

// Laugh reactions arrive in an accelerating ripple, the way a group chat
// actually piles on.
const LAUGH_RIPPLE = [6.5, 6.75, 6.95, 7.1, 7.22, 7.34, 7.45, 7.55, 7.66, 7.78, 7.9, 8.05, 8.2];

const SCENES: Scene[] = [
  {
    id: "e1-01-typing",
    plate: "villageline/v01.png",
    durationInSeconds: 9.2,
    zoom: [1.0, 1.05],
    overlay: { kind: "notification", sender: DEAD_AUNT, typing: true, appearAt: -1 },
    pings: [6.8],
  },
  { id: "e1-02-guard-post", plate: "villageline/v02.png", durationInSeconds: 1.96, zoom: [1.06, 1.0] },
  {
    id: "e1-03-ordinary",
    plate: "villageline/v03.png",
    durationInSeconds: 6.8,
    zoom: [1.0, 1.04],
    blur: 6,
    overlay: {
      kind: "chat",
      messages: [
        { sender: "ลุงบ้านสาม", text: "ใครเจอหมาสีน้ำตาลหลุดออกมา ฝากดูให้หน่อยครับ", at: 0.3 },
        { sender: "ป้าบ้านแปด", text: "รถเก๋งสีเทาจอดขวางหน้าบ้านอีกแล้วนะคะ", at: 2.0 },
        { sender: "นิติบุคคล", text: "แจ้งชำระค่าส่วนกลาง ภายในวันที่ 5", at: 3.9 },
      ],
    },
  },
  {
    id: "e1-04-warning",
    plate: "villageline/v04.png",
    durationInSeconds: 9.16,
    zoom: [1.0, 1.06],
    blur: 4,
    overlay: {
      kind: "chat",
      messages: [
        {
          sender: "ป้าสมศรี",
          text: "อย่าให้เด็กเสื้อเหลืองออกจากบ้าน ตอนสองทุ่มสิบเจ็ด",
          at: 1.84,
          warning: true,
          laughs: LAUGH_RIPPLE,
        },
      ],
    },
    pings: [1.84],
  },
  { id: "e1-05-ball", plate: "villageline/v05.png", durationInSeconds: 8.16, zoom: [1.0, 1.1], hits: [6.06] },
  {
    id: "e1-06-removed",
    plate: "villageline/v06.png",
    durationInSeconds: 4.84,
    zoom: [1.0, 1.05],
    overlay: { kind: "system", text: "คุณนำ ป้าสมศรี ออกจากกลุ่มแล้ว", appearAt: 1.2 },
  },
  {
    id: "e1-07-invited",
    plate: "villageline/v07.png",
    durationInSeconds: 8.64,
    zoom: [1.0, 1.06],
    overlay: {
      kind: "system",
      text: "ป้าสมศรี (เสียชีวิต) เข้าร่วมกลุ่มโดยคำเชิญของคุณ",
      highlight: "คำเชิญของคุณ",
      appearAt: 0.3,
    },
    pings: [0.3],
    hits: [1.5],
  },
  {
    id: "e1-08-last-message",
    plate: "villageline/v08.png",
    durationInSeconds: 6.24,
    zoom: [1.0, 1.05],
    overlay: { kind: "notification", sender: DEAD_AUNT, body: "พรุ่งนี้ อย่ากดอะไรอีก", appearAt: 2.44, reflected: true, top: 560 },
    pings: [2.44],
    fadeOut: 1.2,
  },
];

const CAPTIONS: Caption[] = [
  { text: "คืนที่มีงานศพของป้าสมศรี", from: 0.0, to: 2.4 },
  { text: "กลุ่มไลน์หมู่บ้านเงียบไปแค่สิบเจ็ดนาที", from: 2.4, to: 4.6 },
  { text: "ก่อนมือถือผมเด้งขึ้นมา…", from: 4.6, to: 6.5 },
  { text: "ป้าสมศรี… กำลังพิมพ์", from: 6.76, to: 9.2 },
  { text: "ผมเป็นแอดมินกลุ่มลูกบ้านพฤกษาสอง", from: 9.2, to: 11.16 },
  { text: "ปกติทั้งวันมีแต่รูปหมา รถกีดขวาง", from: 11.16, to: 14.3 },
  { text: "แล้วก็บิลค่าส่วนกลางที่ไม่มีใครอยากจ่าย", from: 14.3, to: 17.64 },
  { text: "แต่ข้อความของป้าสมศรีบอกว่า…", from: 17.96, to: 19.8 },
  // 19.8–23.9: the warning itself is on screen in the bubble — no caption.
  { text: "ทุกคนกดหัวเราะ… ผมก็ด้วย", from: 24.4, to: 26.72 },
  { text: "สองทุ่มสิบเจ็ด เด็กบ้านสิบสองวิ่งตามลูกบอลออกไปหน้าซอย", from: 27.12, to: 31.08 },
  { text: "รถกระบะเลี้ยวเข้ามาเร็วเกินไป", from: 31.08, to: 33.18 },
  { text: "เราไปถึงไม่ทัน", from: 33.18, to: 34.8 },
  { text: "ผมลบเบอร์ป้าสมศรีออกจากกลุ่มด้วยมือตัวเอง", from: 35.28, to: 38.22 },
  { text: "แล้วหน้าจอก็ขึ้น… สมาชิกใหม่", from: 38.22, to: 41.6 },
  // 41.6–46.08: the system banner carries the line.
  { text: "ผมไม่เคยกดเชิญใคร", from: 46.08, to: 48.12 },
  { text: "ข้อความสุดท้ายของคืนนั้นคือ…", from: 48.76, to: 51.2 },
];

export const EP1: Episode = {
  voiceoverSrc: "villageline/vo_ep1.mp3",
  scenes: SCENES,
  captions: CAPTIONS,
};
