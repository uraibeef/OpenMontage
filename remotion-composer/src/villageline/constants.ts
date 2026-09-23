/**
 * Shared vocabulary for "กลุ่มไลน์หมู่บ้าน" — a three-part Thai suburban
 * techno-horror.
 *
 * The art direction (projects/village-line-group/art-direction.md) is the
 * contract here: photoreal estate plates, a chat interface that knows more than
 * the residents do, and CCTV that shows the future. The palette is fixed and
 * the green is rationed — it only ever means "someone is typing" or "someone
 * has read this", so it is never used decoratively.
 *
 * The chat UI is deliberately LINE-like rather than LINE: no logo, no brand
 * green, no trademarked shapes. Thai viewers recognise the grammar of a
 * group chat instantly; they do not need the real app to feel it.
 */

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

export const PALETTE = {
  amber: "#DF8D36",
  rainBlue: "#163A59",
  black: "#07090B",
  white: "#F6F7F8",
  typingGreen: "#7DFF8A",
  bubbleGrey: "#2A2F36",
  mutedText: "#9AA3AD",
  danger: "#FF5A4E",
} as const;

export type OverlaySpec =
  | { kind: "notification"; sender: string; body?: string; typing?: boolean; appearAt?: number; reflected?: boolean; top?: number }
  | { kind: "chat"; messages: ChatMessage[] }
  | { kind: "system"; text: string; highlight?: string; appearAt: number }
  | { kind: "settings"; appearAt: number }
  | { kind: "cctv"; label: string; startClock: string; reverseSecondsAt?: number; nowClock?: string }
  | { kind: "vote"; message: string; messageAt: number; buttonsAt: number }
  | { kind: "laughCount"; steps: { at: number; count: string }[] }
  | { kind: "locked"; appearAt: number }
  | { kind: "slowTyping"; sender: string; text: string; startAt: number; endAt: number; cctv?: { label: string; startClock: string } }
  | { kind: "joinButton"; pressAt: number }
  | { kind: "callWave"; dieAt: number }
  | { kind: "evidenceWall"; appearAt: number }
  | { kind: "adminHistory"; appearAt: number }
  | { kind: "profileCard"; name: string; message: string; messageAt: number }
  | { kind: "finalTyping"; postAt: number; laughAt: number; typingAt: number };

export interface ChatMessage {
  sender: string;
  text: string;
  at: number;
  /** Laugh reactions that pile onto this message, each with its arrival time. */
  laughs?: number[];
  warning?: boolean;
}

export interface Scene {
  id: string;
  plate: string;
  durationInSeconds: number;
  zoom: [from: number, to: number];
  driftY?: number;
  /** Soften the plate so a UI overlay reads on top of it. */
  blur?: number;
  /** Treat the plate itself as security-camera footage. */
  cctv?: boolean;
  overlay?: OverlaySpec;
  /** Seconds (scene-relative) at which to fire the notification ping. */
  pings?: number[];
  /** Seconds (scene-relative) at which to hit the low impact. */
  hits?: number[];
  /** Fade the whole frame to black over this many seconds at the end. */
  fadeOut?: number;
}

export interface Caption {
  text: string;
  from: number;
  to: number;
}

export interface Episode {
  voiceoverSrc: string;
  scenes: Scene[];
  captions: Caption[];
}

export function sceneFrames(scene: Scene): number {
  return Math.round(scene.durationInSeconds * FPS);
}

export function totalFrames(scenes: Scene[]): number {
  return scenes.reduce((sum, scene) => sum + sceneFrames(scene), 0);
}

export function sceneStarts(scenes: Scene[]): number[] {
  return scenes.reduce<number[]>((starts, _scene, index) => {
    starts.push(index === 0 ? 0 : starts[index - 1] + sceneFrames(scenes[index - 1]));
    return starts;
  }, []);
}
