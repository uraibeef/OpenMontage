/**
 * "เรื่องเล่าแปลก" ตอนที่ 3 — ร้านกู้แชต.
 *
 * Built on the unusual-tales-storytelling skill. Twist type: inverted truth,
 * told through an unreliable narrator. No ghost, no curse beyond the premise:
 * the repair booth can recover every deleted message, even the ones typed and
 * never sent. The husband narrates like a wronged man and the viewer sides
 * with him — until the unsent draft reframes every line he has said.
 *
 * The plants, so a rewatch can find them:
 *   - visual: she wears long sleeves in every shot, even in forty-degree heat
 *   - visual: the family-photo breakfast — his hand on her shoulder, her eyes
 *     on the plate, the child not looking up (s04)
 *   - spoken: "ผู้ชายที่รักครอบครัว ก็ต้องทำแบบนี้" and "ผมเลยต้องถามแรงขึ้น"
 *   - on screen: her recovered "หนูกลัวค่ะ", which he reads as guilt
 *
 * The chats are rendered, not generated, so the Thai is exact. Lines the chat
 * already shows are left out of the captions.
 *
 * The close hands the booth to the next man sliding a woman's phone across
 * the counter, then loops to frame 0. The hotline caption over that shot is
 * deliberate: this one is about something real.
 */

import type { Caption, Episode, Shot } from "../roachwar/constants";

const SHOTS: Shot[] = [
  // ── The rule ───────────────────────────────────────────────────────────
  { id: "booth", src: "unusualtales/ep03/s01.png", durationInSeconds: 4.2, zoom: [1.0, 1.06], steady: true },
  { id: "recovery", src: "unusualtales/ep03/s02.png", durationInSeconds: 2.9, zoom: [1.05, 1.0] },

  // ── The narrator ───────────────────────────────────────────────────────
  { id: "checking", src: "unusualtales/ep03/s03.png", durationInSeconds: 4.1, zoom: [1.0, 1.06] },
  // "ผู้ชายที่รักครอบครัว ก็ต้องทำแบบนี้" — held still on the family photo.
  { id: "family-photo", src: "unusualtales/ep03/s04.png", durationInSeconds: 2.8, zoom: [1.04, 1.04] },

  // ── Use one ────────────────────────────────────────────────────────────
  { id: "while-asleep", src: "unusualtales/ep03/s05.png", durationInSeconds: 3.2, zoom: [1.0, 1.06] },
  {
    id: "chat-one",
    src: "unusualtales/ep03/s06.png",
    durationInSeconds: 4.1,
    zoom: [1.0, 1.0],
    chat: {
      name: "พี่ต้น",
      avatar: "ต",
      messages: [
        { side: "out", text: "หนูกลัวค่ะ", at: 0.3, recovered: true },
        { side: "in", text: "พรุ่งนี้บ่ายสองนะครับ ไม่ต้องกลัว", at: 1.6, recovered: true },
      ],
    },
  },

  // ── Use two ────────────────────────────────────────────────────────────
  { id: "his-face", src: "unusualtales/ep03/s06.png", durationInSeconds: 2.1, zoom: [1.0, 1.05] },
  {
    id: "chat-two",
    src: "unusualtales/ep03/s05.png",
    durationInSeconds: 2.55,
    zoom: [1.0, 1.0],
    chat: {
      name: "พี่ต้น",
      avatar: "ต",
      messages: [
        { side: "out", text: "หนูเก็บกระเป๋าไว้แล้ว จะเอาลูกไปด้วย", at: 0.1, recovered: true },
        { side: "in", text: "เอาสูติบัตรน้องมาด้วยนะครับ", at: 1.5, recovered: true },
      ],
    },
  },
  { id: "long-sleeves", src: "unusualtales/ep03/s07.png", durationInSeconds: 5.85, zoom: [1.0, 1.08] },
  { id: "asking", src: "unusualtales/ep03/s08.png", durationInSeconds: 3.3, zoom: [1.0, 1.05] },
  // "ผมเลยต้องถามแรงขึ้น" — we never see it. Only the child's door.
  { id: "her-door", src: "unusualtales/ep03/s09.png", durationInSeconds: 2.9, zoom: [1.0, 1.04] },

  // ── Use three: the draft ───────────────────────────────────────────────
  { id: "pays-more", src: "unusualtales/ep03/s10.png", durationInSeconds: 5.2, zoom: [1.0, 1.06] },
  { id: "reading", src: "unusualtales/ep03/s11.png", durationInSeconds: 1.4, zoom: [1.04, 1.04] },
  {
    id: "the-draft",
    src: "unusualtales/ep03/s11.png",
    durationInSeconds: 4.7,
    zoom: [1.0, 1.0],
    chat: {
      name: "พี่ต้น",
      avatar: "ต",
      detail: "เจ้าหน้าที่บ้านพักฉุกเฉิน",
      revealDetailAt: 3.6,
      messages: [
        { side: "in", text: "ห้องพักเตรียมไว้ให้แล้วครับ ที่นั่นปลอดภัย", at: 0.0, recovered: true },
        {
          side: "out",
          text: "ถ้าคืนนี้เขาเจอข้อความนี้ อย่าให้ลูกกลับบ้าน",
          at: 0.2,
          draft: true,
          typeSeconds: 3.1,
        },
      ],
    },
  },

  // ── After ──────────────────────────────────────────────────────────────
  { id: "empty-room", src: "unusualtales/ep03/s15.png", durationInSeconds: 2.0, zoom: [1.0, 1.04] },
  { id: "empty-wardrobe", src: "unusualtales/ep03/s16.png", durationInSeconds: 2.1, zoom: [1.0, 1.04] },
  { id: "alone", src: "unusualtales/ep03/s12.png", durationInSeconds: 5.2, zoom: [1.0, 1.07] },

  // ── The hand-off and the loop ──────────────────────────────────────────
  { id: "next-phone", src: "unusualtales/ep03/s13.png", durationInSeconds: 4.0, zoom: [1.0, 1.05] },
  // Tuned so (totalFrames - 1) % 12 === 0: the grain re-seeds on frame % 12,
  // so the last frame matches frame 0 and the loop into "booth" is seamless.
  { id: "loop-slip", src: "unusualtales/ep03/s01.png", durationInSeconds: 1.4, zoom: [1.0, 1.0], steady: true },
];

const CAPTIONS: Caption[] = [
  { text: "ร้านซ่อมมือถือชั้นสามในห้าง กู้ข้อความที่ลบไปแล้วได้ทั้งหมด", from: 0.0, to: 4.2 },
  { text: "รวมถึงข้อความที่พิมพ์แล้ว ยังไม่ได้ส่ง", from: 4.2, to: 7.0 },
  { text: "แฟนผมลบข้อความทุกคืน", from: 7.1, to: 9.0 },
  { text: "ผมเลยต้องตรวจมือถือเธอทุกเช้า", from: 9.0, to: 11.1 },
  { text: "ผู้ชายที่รักครอบครัว ก็ต้องทำแบบนี้", from: 11.2, to: 13.9 },
  { text: "ครั้งแรก ผมเอามือถือเธอไปกู้ ตอนเธอหลับ", from: 14.0, to: 17.1 },
  { text: "เจอผู้ชายชื่อพี่ต้น", from: 17.2, to: 18.8 },
  // 18.8–21.3 and 23.4–25.9: the chat shows the words.
  { text: "ครั้งที่สอง ผมกู้อีก", from: 21.3, to: 23.3 },
  { text: "เย็นนั้นเธอกลับบ้าน ใส่เสื้อแขนยาวเหมือนทุกวัน", from: 25.95, to: 29.4 },
  { text: "ทั้งที่ข้างนอก ร้อนสี่สิบองศา", from: 29.4, to: 31.8 },
  { text: "ผมถามเธอดีๆ ว่าพี่ต้นคือใคร", from: 31.8, to: 34.2 },
  { text: "เธอไม่ตอบ", from: 34.2, to: 35.1 },
  { text: "ผมเลยต้องถามแรงขึ้น", from: 35.1, to: 37.2 },
  { text: "ครั้งที่สาม ผมจ่ายเพิ่ม", from: 38.0, to: 39.2 },
  { text: "ให้ร้านกู้ข้อความที่เธอพิมพ์ค้างไว้เมื่อคืน", from: 39.2, to: 43.2 },
  // 44.6–49.3: the draft types itself on screen.
  { text: "คืนนั้น ลูกไม่กลับบ้าน", from: 49.3, to: 51.3 },
  { text: "เธอก็ไม่กลับ", from: 51.3, to: 53.2 },
  { text: "ผมกู้ได้ทุกข้อความของเธอ", from: 53.4, to: 55.5 },
  { text: "ยกเว้นข้อความที่เธอพยายามบอกผมมาตลอด", from: 55.5, to: 58.6 },
  // Ends before the loop-slip so frame 0 and the last frame stay clean.
  { text: "ถ้าคุณหรือคนใกล้ตัวไม่ปลอดภัย โทร 1300 ฟรี ตลอด 24 ชั่วโมง", from: 58.8, to: 62.4 },
];

export const EP03_CHAT_RECOVERY: Episode = {
  voiceoverSrc: "unusualtales/ep03/vo.mp3",
  shots: SHOTS,
  captions: CAPTIONS,
  timestampShots: [],
  timestampLabel: "",
  stampTone: "red",
};
