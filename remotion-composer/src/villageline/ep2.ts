/**
 * "กลุ่มไลน์หมู่บ้าน EP2 — ใครกำลังพิมพ์อยู่".
 *
 * The urgent-countdown episode. Everything that looks like evidence carries a
 * clock, and every clock is twenty minutes ahead of the one the narrator is
 * living in — the burn-in shows both so a muted viewer gets the rule.
 *
 * The guard-post plate from EP1 returns here as CCTV footage on purpose: the
 * same gate, now being watched from the future.
 */

import type { Caption, Episode, Scene } from "./constants";

const DEAD_AUNT = "ป้าสมศรี (เสียชีวิต)";

const SCENES: Scene[] = [
  {
    id: "e2-01-lockdown",
    plate: "villageline/v09.png",
    durationInSeconds: 6.7,
    zoom: [1.0, 1.05],
    blur: 3,
    overlay: { kind: "settings", appearAt: -0.8 },
  },
  {
    id: "e2-02-every-phone",
    plate: "villageline/v10.png",
    durationInSeconds: 5.3,
    zoom: [1.0, 1.07],
    overlay: { kind: "notification", sender: DEAD_AUNT, body: "ส่งวิดีโอ", appearAt: 3.58, top: 620 },
    // Forty-seven phones going off at once: a smear of pings, not a single chime.
    pings: [3.58, 3.64, 3.71, 3.8, 3.9, 4.02],
  },
  { id: "e2-03a-booth", plate: "villageline/v11.png", durationInSeconds: 2.71, zoom: [1.0, 1.06] },
  {
    id: "e2-03b-future-gate",
    plate: "villageline/v02.png",
    durationInSeconds: 3.59,
    zoom: [1.0, 1.0],
    cctv: true,
    overlay: { kind: "cctv", label: "CAM 01 ป้อมยาม", startClock: "03:07:04", nowClock: "02:47", reverseSecondsAt: 1.6 },
    hits: [1.6],
  },
  {
    id: "e2-04-watched",
    plate: "villageline/v12.png",
    durationInSeconds: 7.0,
    zoom: [1.0, 1.08],
    cctv: true,
    overlay: { kind: "cctv", label: "CAM 04 ถนนกลาง", startClock: "03:07:21", nowClock: "02:48" },
  },
  {
    id: "e2-05-vote",
    plate: "villageline/v13.png",
    durationInSeconds: 10.0,
    zoom: [1.0, 1.04],
    blur: 5,
    overlay: { kind: "vote", message: "เลือกเขา หรือระบบจะเลือกแทน", messageAt: 2.1, buttonsAt: 5.5 },
    pings: [2.1],
  },
  {
    id: "e2-06-laughs",
    plate: "villageline/v10.png",
    durationInSeconds: 6.0,
    zoom: [1.04, 1.0],
    blur: 5,
    overlay: {
      kind: "laughCount",
      steps: [
        { at: 0.2, count: "1" },
        { at: 1.9, count: "3" },
        { at: 3.3, count: "ทั้งกลุ่ม" },
      ],
    },
    pings: [0.2, 1.9, 3.3],
  },
  {
    id: "e2-07-gate-locked",
    plate: "villageline/v15.png",
    durationInSeconds: 6.5,
    zoom: [1.0, 1.06],
    overlay: { kind: "locked", appearAt: 4.0 },
    hits: [4.0],
  },
  {
    id: "e2-08-home-camera",
    plate: "villageline/v16.png",
    durationInSeconds: 9.5,
    zoom: [1.0, 1.1],
    cctv: true,
    overlay: { kind: "cctv", label: "CAM หน้าบ้านคุณ", startClock: "03:07:40", nowClock: "02:49" },
    pings: [0.1],
  },
  {
    id: "e2-09-choice",
    plate: "villageline/v16.png",
    durationInSeconds: 7.0,
    zoom: [1.1, 1.14],
    cctv: true,
    overlay: {
      kind: "slowTyping",
      sender: DEAD_AUNT,
      text: "ถ้าไม่โหวต เธอจะเลือกเด็กแทน",
      startAt: 3.0,
      endAt: 5.5,
      cctv: { label: "CAM หน้าบ้านคุณ", startClock: "03:07:49" },
    },
    hits: [5.5],
    fadeOut: 1.2,
  },
];

const CAPTIONS: Caption[] = [
  { text: "เช้าวันต่อมา ผมปิดกลุ่ม เปลี่ยนรหัส", from: 0.0, to: 3.24 },
  { text: "ลบแอดมินทุกคน เหลือแค่ผมคนเดียว", from: 3.24, to: 6.0 },
  { text: "แต่ตอนตีสองสี่สิบเจ็ด มือถือทุกเครื่องในหมู่บ้าน", from: 6.7, to: 10.28 },
  { text: "ดังพร้อมกัน", from: 10.28, to: 11.5 },
  { text: "ป้าสมศรีส่งคลิปจากกล้องหน้าป้อมยาม", from: 12.0, to: 14.71 },
  { text: "เวลาบนคลิป คืออีกยี่สิบนาทีข้างหน้า", from: 14.71, to: 17.7 },
  { text: "ในภาพ ผมยืนอยู่กลางถนนเปียกฝน", from: 18.3, to: 21.1 },
  { text: "แล้วลูกบ้านทุกคน ยืนมองผมจากระเบียงบ้านตัวเอง", from: 21.1, to: 24.8 },
  { text: "ใต้คลิปมีข้อความว่า…", from: 25.3, to: 27.4 },
  // 27.4–30.3: the vote message is on screen.
  { text: "จากนั้นปุ่มรีแอ็กชันห้าปุ่ม", from: 30.8, to: 32.77 },
  { text: "ก็โผล่ขึ้นมาใต้ชื่อผม", from: 32.77, to: 34.8 },
  { text: "ตอนแรกมีคนกดหัวเราะหนึ่งคน", from: 35.3, to: 37.2 },
  { text: "แล้วก็สามคน", from: 37.2, to: 38.6 },
  { text: "แล้วก็ทั้งกลุ่ม", from: 38.6, to: 40.3 },
  { text: "ผมขับรถหนีออกประตูหมู่บ้าน", from: 41.3, to: 43.4 },
  { text: "แต่ยามยกไม้กั้นไม่ขึ้น", from: 43.4, to: 45.31 },
  { text: "เขาบอกว่า ระบบสั่งล็อก", from: 45.31, to: 47.3 },
  { text: "มือถือผมเด้งอีกครั้ง เป็นกล้องหน้าบ้านผม", from: 47.8, to: 50.8 },
  { text: "ในอนาคตยี่สิบนาที", from: 50.8, to: 52.8 },
  { text: "เมียผมอุ้มลูกสาว ยืนร้องไห้อยู่หน้าประตู", from: 53.8, to: 56.8 },
  { text: "ข้อความของป้าสมศรีพิมพ์ช้าๆ…", from: 57.3, to: 59.8 },
];

export const EP2: Episode = {
  voiceoverSrc: "villageline/vo_ep2.mp3",
  scenes: SCENES,
  captions: CAPTIONS,
};
