import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { graphemes, usePop } from "../hooks/kit";
import { DimLine, Ink, Node, Plate, Sheet, useDraw } from "./Draft";
import { CAL, clamp, GRAPHITE, LIFT, LINE, SHEET, T } from "./style";

/**
 * Beats 1–3: the teardown opens. Price with its own dimension line, a scan
 * reticle hunting for "what is it", a colour chip, a cap-height dimension and
 * leader-line callouts on the box face.
 */

/** Beat 1 (0–1.72 s): "80 บาท" slammed under a dimension line, then split to 2 units. */
export function HookPrice({ splitAt }: { splitAt: number }) {
  const frame = useCurrentFrame();
  const slam = interpolate(frame, [0, 5], [1.7, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
  const dim = useDraw(4, 7);
  const head = useDraw(1, 6);
  const leadA = useDraw(splitAt, 6);
  const leadB = useDraw(splitAt + 3, 6);
  const plate = useDraw(splitAt + 5, 6);
  return (
    <AbsoluteFill>
      <Sheet>
        <Ink d="M 60 106 H 1020" p={head} width={2} color={CAL} />
        <DimLine x1={170} y1={176} x2={910} y2={176} p={dim} />
        <Ink d="M 170 150 V 210 M 910 150 V 210" p={dim} width={3} />
        <rect x={470} y={150} width={140} height={52} fill={GRAPHITE} opacity={dim} />
        <text x={540} y={188} textAnchor="middle" fontFamily={T.th} fontWeight={700} fontSize={36} fill={LINE} opacity={dim}>
          ราคา
        </text>
        <g transform={`translate(540 470) scale(${slam})`}>
          <text x={-40} y={0} textAnchor="middle" fontFamily={T.disp} fontWeight={700} fontSize={330} fill={LINE} letterSpacing={-8}>
            80
          </text>
          <text x={250} y={-18} textAnchor="middle" fontFamily={T.th} fontWeight={700} fontSize={84} fill={CAL}>
            บาท
          </text>
        </g>
        <Ink d="M 400 500 L 400 560 L 200 800" p={leadA} width={4} />
        <Ink d="M 560 500 L 560 560 L 500 740" p={leadB} width={4} />
        <Node x={200} y={800} p={leadA} />
        <Node x={500} y={740} p={leadB} />
        <text x={200} y={880} textAnchor="middle" fontFamily={T.mono} fontWeight={700} fontSize={34} fill={CAL} opacity={leadA}>
          U-01
        </text>
        <text x={500} y={820} textAnchor="middle" fontFamily={T.mono} fontWeight={700} fontSize={34} fill={CAL} opacity={leadB}>
          U-02
        </text>
      </Sheet>
      <div style={{ position: "absolute", left: 60, top: 60, fontFamily: T.mono, fontSize: 22, letterSpacing: 4, color: LINE, opacity: head, filter: LIFT }}>
        TEARDOWN · SPEC 05
      </div>
      <Plate x={600} y={620} code="QTY 02" p={plate} size={62}>
        ได้ 2 กระปุก
      </Plate>
    </AbsoluteFill>
  );
}

const HUNT: readonly [number, number, number][] = [
  // frame, cx, cy
  [0, 300, 700],
  [9, 760, 1180],
  [18, 360, 1320],
  [27, 620, 880],
  [40, 540, 1000],
];

/** Beat 2 (1.72–3.49 s): a reticle hunts over the product while the question types in. */
export function HookInspect() {
  const frame = useCurrentFrame();
  const xs = HUNT.map((h) => h[0]);
  const ease = { ...clamp, easing: Easing.inOut(Easing.cubic) };
  const cx = interpolate(frame, xs, HUNT.map((h) => h[1]), ease);
  const cy = interpolate(frame, xs, HUNT.map((h) => h[2]), ease);
  const locked = frame >= 40;
  const lockPop = usePop(40, 9);
  const w = locked ? interpolate(lockPop, [0, 1], [340, 440]) : 340;
  const h = w * 1.35;
  const col = locked ? CAL : LINE;
  const corner = (sx: number, sy: number) => {
    const x = cx + (sx * w) / 2;
    const y = cy + (sy * h) / 2;
    return `M ${x} ${y - sy * 70} L ${x} ${y} L ${x - sx * 70} ${y}`;
  };
  const q = "ได้ของแบบไหน";
  const g = graphemes(q);
  const shown = Math.floor(interpolate(frame, [3, 26], [0, g.length], clamp));
  const caret = Math.floor(frame / 5) % 2 === 0 ? 1 : 0;
  const qPop = usePop(27, 8);
  const dots = ".".repeat(1 + (Math.floor(frame / 4) % 3));
  return (
    <AbsoluteFill>
      <Sheet>
        {[corner(-1, -1), corner(1, -1), corner(1, 1), corner(-1, 1)].map((d, i) => (
          <path key={i} d={d} stroke={col} strokeWidth={8} fill="none" strokeLinecap="square" />
        ))}
        <path d={`M ${cx - 26} ${cy} H ${cx + 26} M ${cx} ${cy - 26} V ${cy + 26}`} stroke={col} strokeWidth={3} />
        <text x={cx - w / 2} y={cy + h / 2 + 48} fontFamily={T.mono} fontWeight={700} fontSize={28} fill={col} letterSpacing={3}>
          {locked ? "TARGET LOCKED" : `IDENTIFYING${dots}`}
        </text>
      </Sheet>
      <div
        style={{
          position: "absolute",
          left: 60,
          top: 150,
          right: 60,
          background: "rgba(244,242,235,0.94)",
          padding: "18px 30px 26px",
          boxShadow: "0 16px 40px rgba(0,0,0,0.4)",
        }}
      >
        <div style={{ fontFamily: T.mono, fontSize: 24, letterSpacing: 4, color: "#6B6B70" }}>FIELD 01 — ITEM DESCRIPTION</div>
        <div style={{ display: "flex", alignItems: "baseline", borderBottom: `3px solid ${GRAPHITE}`, paddingBottom: 6 }}>
          <span style={{ fontFamily: T.th, fontWeight: 700, fontSize: 92, color: GRAPHITE, lineHeight: 1.3 }}>
            {g.slice(0, shown).join("")}
          </span>
          <span style={{ width: 6, height: 84, background: CAL, marginLeft: 6, opacity: shown < g.length ? caret : 0 }} />
          <span
            style={{
              fontFamily: T.disp,
              fontWeight: 700,
              fontSize: 130,
              color: CAL,
              marginLeft: 16,
              lineHeight: 1,
              display: "inline-block",
              transform: `scale(${qPop}) rotate(${(1 - qPop) * 40}deg)`,
            }}
          >
            ?
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
}

/** Beat 3a (3.49–4.25 s): a colour-matching chip sampled off the box. */
export function HookSwatch() {
  const frame = useCurrentFrame();
  const slide = interpolate(frame, [2, 9], [560, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const lead = useDraw(0, 5);
  return (
    <AbsoluteFill>
      <Sheet>
        <Node x={520} y={760} p={lead} r={30} />
        <Ink d="M 546 786 L 700 1010" p={lead} width={4} />
      </Sheet>
      <div
        style={{
          position: "absolute",
          left: 640,
          top: 1000,
          width: 380,
          transform: `translateX(${slide}px) rotate(4deg)`,
          background: SHEET,
          boxShadow: "0 24px 50px rgba(0,0,0,0.55)",
          padding: 18,
        }}
      >
        <div style={{ height: 300, background: "linear-gradient(160deg, #1B1C1F 0%, #070708 70%)", position: "relative" }}>
          <div style={{ position: "absolute", left: 16, bottom: 12, fontFamily: T.mono, fontSize: 22, color: "#8A8A90", letterSpacing: 3 }}>
            K-100
          </div>
        </div>
        <div style={{ fontFamily: T.th, fontWeight: 700, fontSize: 84, color: GRAPHITE, lineHeight: 1.35, marginTop: 8 }}>กล่องดำ</div>
        <div style={{ fontFamily: T.mono, fontWeight: 500, fontSize: 22, color: CAL, letterSpacing: 3 }}>MATTE BLACK · BOX</div>
      </div>
    </AbsoluteFill>
  );
}

/** Beat 3b (4.25–5.15 s): cap-height dimension against the giant box type. */
export function HookCapHeight() {
  const frame = useCurrentFrame();
  const ext = useDraw(0, 5);
  const dim = useDraw(3, 7);
  const word = useDraw(6, 6);
  const read = Math.round(interpolate(frame, [3, 12], [0, 100], clamp));
  return (
    <AbsoluteFill>
      <Sheet>
        <Ink d="M 560 560 H 330 M 560 1170 H 330" p={ext} width={3} />
        <DimLine x1={370} y1={560} x2={370} y2={1170} p={dim} color={CAL} width={6} />
        <g transform="translate(250 865) rotate(-90)" opacity={word}>
          <text x={0} y={0} textAnchor="middle" fontFamily={T.disp} fontWeight={700} fontSize={150} fill={LINE}>
            ตัวใหญ่
          </text>
        </g>
        <text x={400} y={1250} fontFamily={T.mono} fontWeight={700} fontSize={36} fill={CAL}>
          {`CAP.H ${read}%`}
        </text>
      </Sheet>
    </AbsoluteFill>
  );
}

/** Beat 3c (5.15–6.97 s): leader-line callouts read the box face. */
export function HookCallouts({ readAt }: { readAt: number }) {
  const frame = useCurrentFrame();
  const frameP = useDraw(0, 10);
  const a = useDraw(readAt, 6);
  const b = useDraw(readAt + 4, 6);
  const net = useDraw(readAt + 12, 6);
  const g = graphemes("วอลลุ่ม พาวเดอร์");
  const gap = g.indexOf(" ");
  const shown = Math.floor(interpolate(frame, [readAt, readAt + 12], [0, g.length], clamp));
  return (
    <AbsoluteFill>
      <Sheet>
        <Ink d="M 200 380 H 860 V 1610 H 200 Z" p={frameP} width={3} dash="16 12" />
        <text x={200} y={360} fontFamily={T.mono} fontWeight={700} fontSize={26} fill={LINE} letterSpacing={4} opacity={frameP}>
          FACE A — FRONT
        </text>
        <Node x={470} y={610} p={a} />
        <Ink d="M 494 610 H 700 L 760 540" p={a} width={4} />
        <Node x={470} y={790} p={b} />
        <Ink d="M 494 790 H 700 L 760 860" p={b} width={4} />
        <Node x={560} y={1540} p={net} r={16} />
        <Ink d="M 560 1560 V 1680 H 640" p={net} width={3} />
      </Sheet>
      <Plate x={760} y={470} code="01" p={a} size={52}>
        VOLUME
      </Plate>
      <Plate x={760} y={800} code="02" p={b} size={52}>
        POWDER
      </Plate>
      <Plate x={640} y={1640} code="NET WT. 0.5 OZ" p={net} />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 130,
          textAlign: "center",
          fontFamily: T.disp,
          fontWeight: 700,
          fontSize: 118,
          color: LINE,
          filter: LIFT,
          letterSpacing: 2,
        }}
      >
        {g.map((c, i) => (
          <span key={i} style={{ opacity: i < shown ? 1 : 0, color: i < gap ? LINE : CAL }}>
            {c}
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
}
