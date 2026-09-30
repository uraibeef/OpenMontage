/** Cover (1080x1920) for Usmile ad #3 — 3D crumb frame + short dark caption block, centred in the 4:5 crop. */
import { AbsoluteFill, Img, staticFile } from "remotion";
import { AMBER, BLOCK, T, WHITE } from "./style";

export function UsmileCover03() {
  return (
    <AbsoluteFill style={{ background: BLOCK }}>
      <div style={{ position: "absolute", left: 0, top: 110, width: 1080, height: 1070, overflow: "hidden" }}>
        <Img src={staticFile("usmile03/cover_frame.png")} style={{ position: "absolute", left: 0, top: -0.13 * (1920 - 1070), width: 1080, height: 1920 }} />
      </div>
      <div style={{ position: "absolute", left: 0, top: 1180, width: 1080, height: 8, background: AMBER }} />
      <div style={{ position: "absolute", left: 72, width: 800, top: 1240, fontFamily: T.cap, fontWeight: 800, fontSize: 132, lineHeight: 1.18, color: WHITE }}>
        <span style={{ color: AMBER }}>ไม้จิ้มฟัน</span>
        <br />
        เอาเศษออกจริงไหม
      </div>
    </AbsoluteFill>
  );
}
