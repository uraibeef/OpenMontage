/**
 * "เรื่องเล่าแปลก" ตอนที่ 4 — บัตรคิวศูนย์ศูนย์ศูนย์.
 *
 * Karma mode, with the price paid in the premise's own currency: the card
 * lets you skip everyone's wait, and the time you skip comes out of your own
 * life. The doctor never examines him; he only asks "รีบไปไหนเหรอครับ" —
 * where are you rushing to — and the answer arrives in the mirror.
 *
 * Written after the user's note that the earlier scripts read as a list of
 * beats. So every line here follows from the one before, the narrator has an
 * ordinary reason to be there (social security only covers this hospital),
 * and the aunty is a person, not a device: her banana and her line open the
 * story and close it, and the second time she calls him "คุณลุง".
 *
 * The plants, so a rewatch can find them:
 *   - spoken: the doctor's question, three times
 *   - visual: the first white hair (s09), the mother's worried look (s12)
 *   - spoken: "ป้ารอเป็น" — the one person who knows how to wait keeps her years
 *
 * Shot durations are cut to the transcribed voiceover.
 */

import type { Caption, Episode, Shot } from "../roachwar/constants";

const SHOTS: Shot[] = [
  // ── The rule ───────────────────────────────────────────────────────────
  { id: "kiosk", src: "unusualtales/ep04/s01.png", durationInSeconds: 6.7, zoom: [1.0, 1.07], steady: true, stamp: "000" },
  { id: "corridor", src: "unusualtales/ep04/s06.png", durationInSeconds: 2.73, zoom: [1.0, 1.06] },

  // ── Why he is there ────────────────────────────────────────────────────
  { id: "no-choice", src: "unusualtales/ep04/s03.png", durationInSeconds: 6.83, zoom: [1.0, 1.06] },
  { id: "full-hall", src: "unusualtales/ep04/s02.png", durationInSeconds: 5.44, zoom: [1.06, 1.0], stamp: "312" },
  { id: "banana", src: "unusualtales/ep04/s04.png", durationInSeconds: 6.95, zoom: [1.0, 1.06] },
  { id: "counting", src: "unusualtales/ep04/s03.png", durationInSeconds: 3.45, zoom: [1.08, 1.14] },

  // ── Use one ────────────────────────────────────────────────────────────
  { id: "it-beeps", src: "unusualtales/ep04/s01.png", durationInSeconds: 6.3, zoom: [1.04, 1.12], stamp: "000" },
  { id: "gets-there-first", src: "unusualtales/ep04/s05.png", durationInSeconds: 2.3, zoom: [1.0, 1.05], punchIn: true },
  { id: "room-zero", src: "unusualtales/ep04/s06.png", durationInSeconds: 1.8, zoom: [1.06, 1.12] },
  { id: "the-question", src: "unusualtales/ep04/s07.png", durationInSeconds: 5.6, zoom: [1.0, 1.07] },
  { id: "out-in-ten", src: "unusualtales/ep04/s08.png", durationInSeconds: 3.0, zoom: [1.0, 1.05] },
  // Held still on the first white hair.
  { id: "first-white-hair", src: "unusualtales/ep04/s09.png", durationInSeconds: 3.3, zoom: [1.06, 1.06] },

  // ── Use two ────────────────────────────────────────────────────────────
  { id: "five-am", src: "unusualtales/ep04/s11.png", durationInSeconds: 5.7, zoom: [1.0, 1.06] },
  { id: "same-question", src: "unusualtales/ep04/s07.png", durationInSeconds: 2.2, zoom: [1.08, 1.14] },
  { id: "mother", src: "unusualtales/ep04/s12.png", durationInSeconds: 7.9, zoom: [1.0, 1.07] },

  // ── Use three: her card ────────────────────────────────────────────────
  { id: "late", src: "unusualtales/ep04/s02.png", durationInSeconds: 3.0, zoom: [1.0, 1.05] },
  { id: "her-card", src: "unusualtales/ep04/s14.png", durationInSeconds: 5.8, zoom: [1.0, 1.06], stamp: "000" },
  { id: "the-swap", src: "unusualtales/ep04/s15.png", durationInSeconds: 3.0, zoom: [1.0, 1.08], punchIn: true },
  // "ป้าไม่ได้รีบนี่ ป้ารอเป็น" — on her, as he says it.
  { id: "she-can-wait", src: "unusualtales/ep04/s14.png", durationInSeconds: 2.3, zoom: [1.1, 1.14] },
  { id: "last-time", src: "unusualtales/ep04/s16.png", durationInSeconds: 5.0, zoom: [1.0, 1.08] },

  // ── The price ──────────────────────────────────────────────────────────
  { id: "the-stairs", src: "unusualtales/ep04/s17.png", durationInSeconds: 3.1, zoom: [1.0, 1.05] },
  { id: "the-mirror", src: "unusualtales/ep04/s18.png", durationInSeconds: 8.4, zoom: [1.0, 1.1] },
  { id: "banana-again", src: "unusualtales/ep04/s19.png", durationInSeconds: 5.7, zoom: [1.0, 1.06] },
  { id: "got-there-first", src: "unusualtales/ep04/s06.png", durationInSeconds: 4.9, zoom: [1.0, 1.12] },

  // ── The hand-off and the loop ──────────────────────────────────────────
  { id: "next-hand", src: "unusualtales/ep04/s20.png", durationInSeconds: 3.0, zoom: [1.0, 1.05], stamp: "000" },
  // Tuned so (totalFrames - 1) % 12 === 0: the grain re-seeds on frame % 12,
  // so the last frame matches frame 0 and the loop into "kiosk" is seamless.
  { id: "loop-slip", src: "unusualtales/ep04/s01.png", durationInSeconds: 1.6, zoom: [1.0, 1.0], steady: true },
];

const CAPTIONS: Caption[] = [
  { text: "โรงพยาบาลรัฐแถวบ้านผม มีบัตรคิวอยู่ใบหนึ่ง เลขศูนย์ศูนย์ศูนย์", from: 0.0, to: 4.3 },
  { text: "ตู้กดบัตรจะปล่อยมันออกมาวันละใบ", from: 4.3, to: 6.7 },
  { text: "ใครได้ไป ได้เข้าห้องตรวจก่อนทุกคน", from: 6.7, to: 9.43 },
  { text: "ผมรู้เรื่องนี้ วันที่ต้องไปตรวจความดันครั้งแรก", from: 9.43, to: 12.3 },
  { text: "ประกันสังคมผมใช้ได้แค่ที่นี่ที่เดียว ผมเลยไม่มีทางเลือก", from: 12.3, to: 16.26 },
  { text: "เจ็ดโมงเช้า คนนั่งรอเต็มห้องโถง", from: 16.26, to: 19.6 },
  { text: "บัตรในมือผม เลขสามร้อยสิบสอง", from: 19.6, to: 21.7 },
  { text: "ป้าที่นั่งข้างๆ ยื่นกล้วยมาให้ลูกหนึ่ง", from: 21.7, to: 24.3 },
  { text: "บอกว่า กินรองท้องไว้ก่อนนะหนู กว่าจะถึงคิวก็บ่ายโน่น", from: 24.3, to: 27.8 },
  { text: "ผมไม่ได้รับ", from: 27.8, to: 28.65 },
  { text: "ผมนั่งคิดว่าเวลาที่เสียไปครึ่งวัน คิดเป็นตังค์ได้เท่าไหร่", from: 28.65, to: 32.1 },
  { text: "แล้วตู้กดบัตรก็ส่งเสียงขึ้นมาเอง ทั้งที่ไม่มีใครกด", from: 32.1, to: 35.35 },
  { text: "บัตรใบหนึ่งไหลออกมา เลขศูนย์ศูนย์ศูนย์", from: 35.35, to: 38.4 },
  { text: "ป้ากำลังจะลุก แต่ผมเดินไปถึงก่อน", from: 38.4, to: 40.7 },
  { text: "ห้องตรวจศูนย์อยู่สุดทางเดิน", from: 40.7, to: 42.5 },
  { text: "หมอแก่ๆ คนหนึ่ง ไม่ถามอาการผมสักคำ", from: 42.5, to: 44.8 },
  { text: "แค่มองหน้าผมอยู่นาน แล้วถามว่า…", from: 44.8, to: 46.9 },
  { text: "“รีบไปไหนเหรอครับ”", from: 46.9, to: 48.1 },
  { text: "สิบนาทีต่อมา ผมก็เดินออกจากโรงพยาบาล", from: 48.1, to: 51.1 },
  { text: "คืนนั้นตอนแปรงฟัน ผมเจอผมหงอกเส้นแรกที่ขมับ", from: 51.1, to: 54.4 },
  { text: "เดือนต่อมา ผมไปนั่งเฝ้าตู้ตั้งแต่ตีห้า", from: 54.4, to: 57.37 },
  { text: "พอบัตรใบนั้นไหลออกมา ผมคว้าไว้ทันที", from: 57.37, to: 60.1 },
  { text: "หมอคนเดิม ถามคำถามเดิม", from: 60.1, to: 62.3 },
  { text: "กลับถึงบ้าน แม่มองหน้าผมแล้วถามว่า", from: 62.3, to: 64.95 },
  { text: "“ช่วงนี้เหนื่อยเหรอลูก หน้าดูแก่ลงเยอะเลย”", from: 64.95, to: 67.46 },
  { text: "ผมคิดว่าคนเหนื่อย ก็แก่เร็วเป็นธรรมดา", from: 67.46, to: 70.2 },
  { text: "เดือนที่สาม ผมตื่นสาย ไปถึงเก้าโมง", from: 70.2, to: 73.2 },
  { text: "บัตรศูนย์ศูนย์ศูนย์ อยู่ในมือป้าคนเดิมแล้ว", from: 73.2, to: 76.1 },
  { text: "ป้าบอกว่า ป้ารอใบนี้มาทั้งปีเลยนะหนู", from: 76.1, to: 79.0 },
  { text: "ผมยัดบัตรของผมใส่มือป้า แล้วดึงใบนั้นมา", from: 79.0, to: 82.0 },
  { text: "“ป้าไม่ได้รีบนี่ ป้ารอเป็น”", from: 82.0, to: 84.3 },
  { text: "หมอมองบัตร มองหน้าผม", from: 84.3, to: 86.25 },
  { text: "แล้วถามคำถามเดิมเป็นครั้งสุดท้าย", from: 86.25, to: 88.3 },
  { text: "“รีบไปไหนเหรอครับ”", from: 88.3, to: 89.3 },
  { text: "ตอนเดินออกมา ขาผมหนักจนต้องจับราวบันได", from: 89.3, to: 92.45 },
  { text: "ในกระจกหน้าลิฟต์ มีชายแก่ผมขาวทั้งหัว ยืนมองผมอยู่", from: 92.45, to: 96.0 },
  { text: "ข้างหลังเขา ป้าคนเดิมยังนั่งรอคิวอย่างใจเย็น", from: 96.0, to: 99.2 },
  { text: "ดูอ่อนกว่าผมเป็นสิบปี", from: 99.2, to: 100.85 },
  { text: "ป้าหันมายิ้ม ยื่นกล้วยมาให้ลูกหนึ่ง", from: 100.85, to: 103.2 },
  { text: "“กินรองท้องไว้ก่อนนะคะคุณลุง กว่าจะถึงคิวก็บ่ายโน่น”", from: 103.2, to: 106.5 },
  { text: "ทั้งชีวิต ผมไม่เคยยอมรอใคร", from: 106.5, to: 108.75 },
  // Ends before the hand-off so the last shot and the loop frame stay clean.
  { text: "สุดท้าย ผมก็ไปถึงก่อนทุกคนจริงๆ", from: 108.75, to: 111.4 },
];

export const EP04_QUEUE_ZERO: Episode = {
  voiceoverSrc: "unusualtales/ep04/vo.mp3",
  shots: SHOTS,
  captions: CAPTIONS,
  timestampShots: [],
  timestampLabel: "",
  stampTone: "red",
};
