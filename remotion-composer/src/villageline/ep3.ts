/**
 * "กลุ่มไลน์หมู่บ้าน EP3 — คนที่หายไป".
 *
 * The confession episode, and the only one that does not fade out. Its last
 * scene sits on the same rain-streaked window that opened EP1, with the same
 * typing state — except now the typing account is his. Played back to back,
 * the trilogy's end reads as the start of the next victim's first night.
 */

import type { Caption, Episode, Scene } from "./constants";

const SCENES: Scene[] = [
  {
    id: "e3-01-rejoin",
    plate: "villageline/v06.png",
    durationInSeconds: 5.16,
    zoom: [1.0, 1.04],
    blur: 4,
    overlay: { kind: "joinButton", pressAt: 0.9 },
  },
  {
    id: "e3-02-her-phone",
    plate: "villageline/v18.png",
    durationInSeconds: 8.76,
    // A slow push toward the lit phone in her hand — the reveal is in the frame
    // before the narration names it.
    zoom: [1.0, 1.22],
    driftY: -40,
    cctv: true,
    overlay: { kind: "cctv", label: "CAM 02 ห้องนั่งเล่น", startClock: "03:09:02", nowClock: "02:52" },
  },
  {
    id: "e3-03-call",
    plate: "villageline/v13.png",
    durationInSeconds: 7.5,
    zoom: [1.0, 1.05],
    blur: 5,
    overlay: { kind: "callWave", dieAt: 5.52 },
    hits: [5.52],
  },
  {
    id: "e3-04-pattern",
    plate: "villageline/v20.png",
    durationInSeconds: 9.5,
    zoom: [1.0, 1.06],
    blur: 3,
    overlay: { kind: "evidenceWall", appearAt: 0.3 },
  },
  {
    id: "e3-05-admins",
    plate: "villageline/v03.png",
    durationInSeconds: 8.84,
    zoom: [1.04, 1.0],
    blur: 6,
    overlay: { kind: "adminHistory", appearAt: 0.3 },
    hits: [1.88],
  },
  {
    id: "e3-06-future-admin",
    plate: "villageline/v22.png",
    durationInSeconds: 10.16,
    zoom: [1.0, 1.07],
    overlay: { kind: "profileCard", name: "สมศรี พฤกษา", message: "ฉันคือแป้ง ลูกสาวนาย", messageAt: 6.16 },
    pings: [0.4, 6.16],
    hits: [6.16],
  },
  {
    id: "e3-07-you-are-typing",
    plate: "villageline/v01.png",
    durationInSeconds: 15.08,
    zoom: [1.05, 1.0],
    overlay: { kind: "finalTyping", postAt: 3.9, laughAt: 8.9, typingAt: 11.5 },
    pings: [8.9],
  },
];

const CAPTIONS: Caption[] = [
  { text: "ผมกลับเข้ากลุ่ม เพราะถ้าไม่มีผมอยู่ในนั้น", from: 0.0, to: 2.88 },
  { text: "พวกเขาจะเลือกใครก็ได้", from: 2.88, to: 4.38 },
  { text: "ในคลิปใหม่ เมียผมกอดลูกอยู่ในบ้าน", from: 5.16, to: 8.24 },
  { text: "แต่ผมเห็นมือของเธอ กำลังถือมือถือ", from: 8.24, to: 11.3 },
  { text: "และในจอนั้น… เปิดกลุ่มเดียวกับผม", from: 11.3, to: 13.92 },
  { text: "ผมโทรหาเธอ เธอบอกว่าไม่ได้ส่งอะไร", from: 13.92, to: 17.04 },
  { text: "แต่ลูกสาวผมพูดขึ้นมาเบาๆว่า…", from: 17.04, to: 19.44 },
  { text: "“แม่บอกให้หนูอย่ากดหัวเราะ”", from: 19.44, to: 21.42 },
  { text: "ผมย้อนดูข้อความเก่า ทุกครั้งที่มีคนหายไป", from: 21.42, to: 25.28 },
  { text: "ป้าสมศรีจะเตือนก่อน", from: 25.28, to: 26.8 },
  { text: "และทุกครั้ง คนในกลุ่มจะกดรีแอ็กชัน", from: 26.8, to: 29.12 },
  { text: "โดยคิดว่าเป็นเรื่องตลก", from: 29.12, to: 30.92 },
  { text: "ผมไม่ใช่แอดมินคนแรก", from: 30.92, to: 32.8 },
  { text: "ผมแค่คนล่าสุด ที่ยังไม่รู้ว่าตัวเองถูกเลือก", from: 32.8, to: 36.0 },
  { text: "ตั้งแต่คืนแรก", from: 36.0, to: 37.4 },
  { text: "บัญชีป้าสมศรีส่งรูปหนึ่งมา", from: 37.4, to: 39.76 },
  { text: "เป็นภาพหน้าจอจากอีกหลายปีข้างหน้า", from: 39.76, to: 42.24 },
  { text: "ชื่อผู้ดูแลระบบเขียนว่า…", from: 42.24, to: 44.2 },
  // 44.2–49.92: the profile card and her message carry both lines.
  { text: "ระบบนี้โตขึ้น ทุกครั้งที่เรากดปุ่มเล็กๆ", from: 49.92, to: 53.4 },
  { text: "ผมพิมพ์ว่า…", from: 53.52, to: 54.9 },
  { text: "แต่มีคนหัวเราะใต้ข้อความผมแล้วหนึ่งคน", from: 56.64, to: 59.6 },
  { text: "แล้วชื่อผมก็ขึ้นว่า…", from: 59.6, to: 61.4 },
];

export const EP3: Episode = {
  voiceoverSrc: "villageline/vo_ep3.mp3",
  scenes: SCENES,
  captions: CAPTIONS,
};
