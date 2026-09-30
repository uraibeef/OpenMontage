/** Cover (1080x1920) for Usmile ad #1 — all content inside the centre 4:5 crop (y 285–1635). */
import { AbsoluteFill } from "remotion";
import { PaperGrain } from "../../fxkit";
import { Toothpick } from "./Doodles";
import { INK, PAPER, PEN_RED, T } from "./style";

export function UsmileCover01() {
  return (
    <AbsoluteFill style={{ background: PAPER }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        <path d="M430 610 C430 520 560 500 570 600 C582 500 712 520 706 610 C700 700 570 760 570 760 C570 760 430 700 430 610 Z" fill="#F6B9B3" stroke={INK} strokeWidth={9} strokeLinejoin="round" transform="translate(-30 -70)" />
        <path d="M522 470 L560 540 L508 585 L572 640 L536 700" fill="none" stroke={PEN_RED} strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" />
        <g transform="translate(150 1500)">
          <Toothpick x={0} y={0} rot={-8} mood="sad" t={6} scale={1.5} />
        </g>
        
      </svg>
      <div
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          top: 740,
          textAlign: "center",
          fontFamily: T.ink,
          fontWeight: 700,
          fontSize: 190,
          lineHeight: 1.12,
          color: INK,
          transform: "rotate(-2deg)",
        }}
      >
        ไม้จิ้มฟัน
        <br />
        <span style={{ color: PEN_RED }}>ขอเลิก</span>
      </div>
      <PaperGrain id="uc01" opacity={0.2} />
    </AbsoluteFill>
  );
}
