/** Cover (1080x1920) for Usmile ad #3 — 3D crumb frame + short dark caption block, centred in the 4:5 crop. */
import { AbsoluteFill, Img, staticFile } from "remotion";
import { AMBER, BLOCK, T, WHITE } from "./style";

export function UsmileCover03() {
  return (
    <AbsoluteFill style={{ background: BLOCK }}>
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        <Img src={staticFile("usmile03/cover_frame.png")} style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transform: "scale(1.34)", transformOrigin: "50% 32%" }} />
      </div>
      <div style={{ position: "absolute", left: 0, top: 900, width: 1080, height: 1020, background: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.75) 100%)" }} />
      <div style={{ position: "absolute", left: 72, width: 936, top: 1000, textAlign: "center", fontFamily: T.cap, fontWeight: 800, fontSize: 150, lineHeight: 1.16, color: WHITE, WebkitTextStroke: "4px rgba(0,0,0,0.85)", paintOrder: "stroke fill", textShadow: "0 5px 0 rgba(0,0,0,0.5)" }}>
        <span style={{ color: AMBER }}>ไม้จิ้มฟัน</span>
        <br />
        เอาเศษออกจริงไหม
      </div>
    </AbsoluteFill>
  );
}
