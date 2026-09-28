import { AbsoluteFill, Sequence } from "remotion";
import { Clip } from "../methaad/hooks/Clip";
import { Flash, Glitch, PunchIn, Riso, RISO, SpeedLines, TearReveal } from "./index";

/**
 * Studio preview of every fxkit effect, 45 frames each, on sample footage
 * from public/methaad01. Composition id: FxKitGallery.
 */
const SEG = 45;
const clip = (name: string) => <Clip src={`methaad01/${name}.mp4`} durationInFrames={SEG} zoomTo={1.05} />;

const DEMOS: { name: string; node: React.ReactNode }[] = [
  { name: "riso blue/pink", node: <Riso id="g-riso-1">{clip("b07")}</Riso> },
  {
    name: "riso black/red",
    node: (
      <Riso id="g-riso-2" inks={{ dark: RISO.black, mid: RISO.red, paper: RISO.paper }} grain={0.45}>
        {clip("s10a")}
      </Riso>
    ),
  },
  {
    name: "tear",
    node: (
      <>
        {clip("b06")}
        <TearReveal src="methaad01/tear_from.jpg" />
      </>
    ),
  },
  { name: "glitch", node: <Glitch id="g-glitch" dur={12}>{clip("s05d")}</Glitch> },
  {
    name: "speed lines",
    node: (
      <>
        {clip("s10b")}
        <SpeedLines dur={SEG} />
      </>
    ),
  },
  {
    name: "flash + punch",
    node: (
      <>
        <PunchIn>{clip("b11")}</PunchIn>
        <Flash />
      </>
    ),
  },
];

export const FX_GALLERY_FRAMES = SEG * DEMOS.length;

export function FxKitGallery() {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {DEMOS.map((d, i) => (
        <Sequence key={d.name} name={d.name} from={i * SEG} durationInFrames={SEG}>
          {d.node}
        </Sequence>
      ))}
    </AbsoluteFill>
  );
}
