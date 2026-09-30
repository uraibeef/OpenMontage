/** Cover (1080x1920) for Usmile ad #2 — real corn payoff frame + short paper caption, centred in the 4:5 crop. */
import { AbsoluteFill, Img, staticFile } from "remotion";
import { PaperGrain } from "../../fxkit";
import { Toothpick } from "../ad01/Doodles";
import { INK, PAPER, PEN_RED, T } from "../ad01/style";

export function UsmileCover02() {
  return (
    <AbsoluteFill style={{ background: PAPER }}>
      <div style={{ position: "absolute", left: 0, top: 110, width: 1080, height: 1070, overflow: "hidden" }}>
        <Img src={staticFile("usmile02/cover_frame.png")} style={{ position: "absolute", left: 0, top: -0.13 * (1920 - 1070), width: 1080, height: 1920 }} />
      </div>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        <Toothpick x={150} y={1200} rot={-90} mood="sad" t={6} scale={0.9} />
      </svg>
      <div style={{ position: "absolute", left: 60, right: 60, top: 1230, textAlign: "center", fontFamily: T.ink, fontWeight: 700, fontSize: 168, lineHeight: 1.1, color: INK }}>
        ไม้จิ้มฟัน
        <br />
        <span style={{ color: PEN_RED }}>vs น้ำ</span>
      </div>
      <PaperGrain id="uc02" opacity={0.2} />
    </AbsoluteFill>
  );
}
