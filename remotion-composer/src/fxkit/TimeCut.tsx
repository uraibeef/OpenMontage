import { AbsoluteFill, interpolate, Sequence, useCurrentFrame } from "remotion";

/** [from, to) frame ranges of the SOURCE composition to keep, in order. */
export type KeepRanges = readonly (readonly [number, number])[];

/** Output length in frames after cutting. */
export const cutLength = (keep: KeepRanges) => keep.reduce((n, [a, b]) => n + b - a, 0);

/** Map a source frame to its output frame (for placing overlays on the cut timeline). */
export function mapFrame(keep: KeepRanges, src: number): number {
  let out = 0;
  for (const [a, b] of keep) {
    if (src < a) return out;
    if (src < b) return out + src - a;
    out += b - a;
  }
  return out;
}

/** Output frames where a jump cut lands (segment starts after the first). */
export function cutPoints(keep: KeepRanges): number[] {
  const pts: number[] = [];
  let out = 0;
  keep.forEach(([a, b], i) => {
    if (i > 0) pts.push(out);
    out += b - a;
  });
  return pts;
}

interface TimeCutProps {
  keep: KeepRanges;
  children: React.ReactNode;
  /** Alternate punch zoom per segment (jump-cut feel). 0 disables. */
  zoom?: number;
  /** Also toggle the zoom inside long segments every N frames, so the picture changes ~this often. */
  maxHold?: number;
}

function Punch({ scale, children }: { scale: number; children: React.ReactNode }) {
  const frame = useCurrentFrame();
  const snap = interpolate(frame, [0, 3], [scale + 0.025, scale], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ transform: `scale(${snap})` }}>{children}</AbsoluteFill>;
}

/**
 * Re-times a whole composition: plays only the kept source ranges back to back
 * (picture AND sound cut together), turning every removed VO gap into a jump
 * cut. Pair with projects/_ads/tools/gapcut.py to build `keep` from the VO.
 */
export function TimeCut({ keep, children, zoom = 0.07, maxHold = 26 }: TimeCutProps) {
  let out = 0;
  let parity = 0;
  const parts: React.ReactNode[] = [];
  keep.forEach(([a, b]) => {
    for (let s = a; s < b; s += maxHold) {
      const e = Math.min(b, s + maxHold);
      const len = e - s;
      if (len <= 0) continue;
      const scale = 1 + (parity % 2) * zoom;
      parts.push(
        <Sequence key={`${s}`} from={out} durationInFrames={len}>
          <Punch scale={scale}>
            <Sequence from={-s}>{children}</Sequence>
          </Punch>
        </Sequence>,
      );
      out += len;
      parity += 1;
    }
  });
  return <AbsoluteFill>{parts}</AbsoluteFill>;
}
