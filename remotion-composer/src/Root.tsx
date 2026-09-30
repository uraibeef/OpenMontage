import { HairAd02Retention, HAIR_AD_02R_FRAMES } from "./methaad/ad02/Retention";
import { UsmileStory, STORY_FPS } from "./usmile/story/UsmileStory";
import { SPECS as USMILE_SPECS } from "./usmile/story/specs";
import { UsmileCover03 } from "./usmile/ad03/UsmileCover03";
import { UsmileAd03, USMILE_AD_03_FPS, USMILE_AD_03_SECONDS } from "./usmile/ad03/UsmileAd03";
import { UsmileAd02, USMILE_AD_02_FPS, USMILE_AD_02_SECONDS } from "./usmile/ad02/UsmileAd02";
import { UsmileCover02 } from "./usmile/ad02/UsmileCover02";
import { UsmileCover01 } from "./usmile/ad01/UsmileCover01";
import { UsmileAd01, USMILE_AD_01_FPS, USMILE_AD_01_SECONDS } from "./usmile/ad01/UsmileAd01";
import { SprayAd10, SPRAY_AD_10_FPS, SPRAY_AD_10_SECONDS } from "./methaad/spray10/SprayAd10";
import { SprayAd09, SPRAY_AD_09_FPS, SPRAY_AD_09_SECONDS } from "./methaad/spray09/SprayAd09";
import { SprayAd08, SPRAY_AD_08_FPS, SPRAY_AD_08_SECONDS } from "./methaad/spray08/SprayAd08";
import { SprayAd07, SPRAY_AD_07_FPS, SPRAY_AD_07_SECONDS } from "./methaad/spray07/SprayAd07";
import { SprayAd06, SPRAY_AD_06_FPS, SPRAY_AD_06_SECONDS } from "./methaad/spray06/SprayAd06";
import { SprayAd05, SPRAY_AD_05_FPS, SPRAY_AD_05_SECONDS } from "./methaad/spray05/SprayAd05";
import { SprayAd04, SPRAY_AD_04_FPS, SPRAY_AD_04_SECONDS } from "./methaad/spray04/SprayAd04";
import { SprayAd03, SPRAY_AD_03_FPS, SPRAY_AD_03_SECONDS } from "./methaad/spray03/SprayAd03";
import { SprayAd02, SPRAY_AD_02_FPS, SPRAY_AD_02_SECONDS } from "./methaad/spray02/SprayAd02";
import { SprayAd01, SPRAY_AD_01_FPS, SPRAY_AD_01_SECONDS } from "./methaad/spray01/SprayAd01";
import { HairAd05, HAIR_AD_05_FPS, HAIR_AD_05_SECONDS } from "./methaad/ad05/HairAd05";
import { HairAd06, HAIR_AD_06_FPS, HAIR_AD_06_SECONDS } from "./methaad/ad06/HairAd06";
import { HairAd07, HAIR_AD_07_FPS, HAIR_AD_07_SECONDS } from "./methaad/ad07/HairAd07";
import { HairAd08, HAIR_AD_08_FPS, HAIR_AD_08_SECONDS } from "./methaad/ad08/HairAd08";
import { HairAd09, HAIR_AD_09_FPS, HAIR_AD_09_SECONDS } from "./methaad/ad09/HairAd09";
import { HairAd10, HAIR_AD_10_FPS, HAIR_AD_10_SECONDS } from "./methaad/ad10/HairAd10";
import { HairAd02, HAIR_AD_02_FPS, HAIR_AD_02_SECONDS } from "./methaad/ad02/HairAd02";
import { HairAd03, HAIR_AD_03_FPS, HAIR_AD_03_SECONDS } from "./methaad/ad03/HairAd03";
import { HairAd04, HAIR_AD_04_FPS, HAIR_AD_04_SECONDS } from "./methaad/ad04/HairAd04";
import { FxKitGallery, FX_GALLERY_FRAMES } from "./fxkit/FxKitGallery";
import { Composition, CalculateMetadataFunction } from "remotion";
import { Explainer, ExplainerProps } from "./Explainer";
import {
  CinematicRenderer,
  calculateCinematicMetadata,
} from "./CinematicRenderer";
import { signalFromTomorrowWithMusicFixture } from "./cinematic/fixtures";
import { TalkingHead, TalkingHeadProps } from "./TalkingHead";
import {
  TitledVideo,
  calculateTitledVideoMetadata,
} from "./TitledVideo";
import { EndTag, EndTagProps } from "./components/EndTag";
import { HeroTitle } from "./components/HeroTitle";
import { ProductReveal, ProductRevealProps } from "./components/ProductReveal";
import { CaptionOverlay, WordCaption } from "./components/CaptionOverlay";
import { CollageBurst, CollageBurstProps } from "./CollageBurst";
import { LyricOverlay, LyricOverlayProps } from "./LyricOverlay";
import { BeggarReel } from "./beggar/BeggarReel";
import {
  FPS as BEGGAR_FPS,
  HEIGHT as BEGGAR_HEIGHT,
  TOTAL_FRAMES as BEGGAR_TOTAL_FRAMES,
  WIDTH as BEGGAR_WIDTH,
} from "./beggar/config";
import { MissedCallReel } from "./missedcall/MissedCallReel";
import {
  FPS as MISSED_CALL_FPS,
  HEIGHT as MISSED_CALL_HEIGHT,
  TOTAL_FRAMES as MISSED_CALL_TOTAL_FRAMES,
  WIDTH as MISSED_CALL_WIDTH,
} from "./missedcall/config";
import { Episode as RoachWarEpisode } from "./roachwar/Episode";
import {
  FPS as ROACH_WAR_FPS,
  HEIGHT as ROACH_WAR_HEIGHT,
  WIDTH as ROACH_WAR_WIDTH,
  totalFrames as roachWarTotalFrames,
} from "./roachwar/constants";
import { EP1 } from "./roachwar/ep1";
import { EP2 } from "./roachwar/ep2";
import { EP3 } from "./roachwar/ep3";
import { Episode as VillageLineEpisode } from "./villageline/Episode";
import {
  FPS as VILLAGE_LINE_FPS,
  HEIGHT as VILLAGE_LINE_HEIGHT,
  WIDTH as VILLAGE_LINE_WIDTH,
  totalFrames as villageLineTotalFrames,
} from "./villageline/constants";
import { EP1 as VL_EP1 } from "./villageline/ep1";
import { EP2 as VL_EP2 } from "./villageline/ep2";
import { EP3 as VL_EP3 } from "./villageline/ep3";
import { EP01_SARN_HAI_LEK } from "./unusualtales/ep01-sarn-hai-lek";
import { EP02_MIDNIGHT_ORDER } from "./unusualtales/ep02-midnight-order";
import { EP03_CHAT_RECOVERY } from "./unusualtales/ep03-chat-recovery";
import { EP04_QUEUE_ZERO } from "./unusualtales/ep04-queue-zero";
import { EP05_MOSQUITO_WAR } from "./unusualtales/ep05-mosquito-war";
import { GECKO_LEGEND_EP01 } from "./geckolegend/ep01-sun-goes-out";
import { GECKO_LEGEND_EP02 } from "./geckolegend/ep02-honey-field";
import { GECKO_LEGEND_EP03 } from "./geckolegend/ep03-invisible-lightning";
import { GECKO_LEGEND_EP04 } from "./geckolegend/ep04-hundred-legs";
import { HairAd01, HAIR_AD_01_FPS, HAIR_AD_01_SECONDS } from "./methaad/HairAd01";
import { CHAO_PHRAYA_EP01 } from "./chaophraya/ep01-manna-stops";
import { CHAO_PHRAYA_EP02 } from "./chaophraya/ep02-river-mouth";
import { CHAO_PHRAYA_EP03 } from "./chaophraya/ep03-gods-net";
import { CHAO_PHRAYA_EP04 } from "./chaophraya/ep04-unchosen-invaders";
import { TERMITE_EP01 } from "./termite/ep01-one-knock";
import { TERMITE_EP02 } from "./termite/ep02-fast-army";
import { TERMITE_EP03 } from "./termite/ep03-poison-rain";
import { USMILE_TWENTY_SECONDS } from "./ads/usmile-twenty-seconds";

// ---------------------------------------------------------------------------
// Theme System — prevents every video from looking like dark fintech
// ---------------------------------------------------------------------------

export interface ThemeConfig {
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  surfaceColor: string;
  textColor: string;
  mutedTextColor: string;
  headingFont: string;
  bodyFont: string;
  monoFont: string;
  chartColors: string[];
  springConfig: { damping: number; stiffness: number; mass: number };
  transitionDuration: number;
  captionHighlightColor: string;
  captionBackgroundColor: string;
}

export const THEMES: Record<string, ThemeConfig> = {
  "clean-professional": {
    primaryColor: "#2563EB",
    accentColor: "#F59E0B",
    backgroundColor: "#FFFFFF",
    surfaceColor: "#F9FAFB",
    textColor: "#1F2937",
    mutedTextColor: "#6B7280",
    headingFont: "Inter",
    bodyFont: "Inter",
    monoFont: "JetBrains Mono",
    chartColors: ["#2563EB", "#F59E0B", "#10B981", "#8B5CF6", "#EC4899", "#06B6D4"],
    springConfig: { damping: 20, stiffness: 120, mass: 1 },
    transitionDuration: 0.4,
    captionHighlightColor: "#2563EB",
    captionBackgroundColor: "rgba(255, 255, 255, 0.85)",
  },
  "flat-motion-graphics": {
    primaryColor: "#7C3AED",
    accentColor: "#EC4899",
    backgroundColor: "#0F172A",
    surfaceColor: "#1E293B",
    textColor: "#F8FAFC",
    mutedTextColor: "#94A3B8",
    headingFont: "Space Grotesk",
    bodyFont: "Space Grotesk",
    monoFont: "Fira Code",
    chartColors: ["#7C3AED", "#EC4899", "#06B6D4", "#F59E0B", "#10B981", "#EF4444"],
    springConfig: { damping: 12, stiffness: 80, mass: 1 },
    transitionDuration: 0.3,
    captionHighlightColor: "#22D3EE",
    captionBackgroundColor: "rgba(15, 23, 42, 0.75)",
  },
  "minimalist-diagram": {
    primaryColor: "#1A1A2E",
    accentColor: "#E94560",
    backgroundColor: "#FAFAFA",
    surfaceColor: "#FFFFFF",
    textColor: "#1A1A2E",
    mutedTextColor: "#6B7280",
    headingFont: "IBM Plex Sans",
    bodyFont: "IBM Plex Sans",
    monoFont: "IBM Plex Mono",
    chartColors: ["#E94560", "#1A1A2E", "#0F3460", "#9CA3AF"],
    springConfig: { damping: 25, stiffness: 150, mass: 1 },
    transitionDuration: 0.5,
    captionHighlightColor: "#E94560",
    captionBackgroundColor: "rgba(250, 250, 250, 0.9)",
  },
  "anime-ghibli": {
    primaryColor: "#2D5016",
    accentColor: "#FFB347",
    backgroundColor: "#0A0A1A",
    surfaceColor: "#1A2332",
    textColor: "#F0E6D3",
    mutedTextColor: "#A8957E",
    headingFont: "Noto Serif JP",
    bodyFont: "Noto Sans",
    monoFont: "Fira Code",
    chartColors: ["#FFB347", "#2D5016", "#FF6B9D", "#A8E6CF", "#6B4C8A", "#E8927C"],
    springConfig: { damping: 18, stiffness: 60, mass: 1 },
    transitionDuration: 1.0,
    captionHighlightColor: "#FFB347",
    captionBackgroundColor: "rgba(10, 10, 26, 0.8)",
  },
};

// Default theme when none is specified — uses the existing dark style for backwards compatibility
export const DEFAULT_THEME = THEMES["flat-motion-graphics"];

export function resolveTheme(props: Record<string, unknown>): ThemeConfig {
  const themeName = (props.theme as string) || (props.playbook as string);
  if (themeName && THEMES[themeName]) {
    return THEMES[themeName];
  }
  // Allow custom theme passed as full object
  if (props.themeConfig && typeof props.themeConfig === "object") {
    return { ...DEFAULT_THEME, ...(props.themeConfig as Partial<ThemeConfig>) };
  }
  return DEFAULT_THEME;
}

const calculateMetadata: CalculateMetadataFunction<ExplainerProps> = async ({
  props,
}) => {
  const cuts = props.cuts || [];
  if (cuts.length === 0) {
    return { durationInFrames: 30 * 60 };
  }
  const lastEnd = Math.max(...cuts.map((c) => c.out_seconds || 0));
  // Add 1 second padding for final fade
  return { durationInFrames: Math.ceil((lastEnd + 1) * 30) };
};

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="Explainer"
        component={Explainer}
        durationInFrames={30 * 60}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          cuts: [],
          overlays: [],
          captions: [],
          audio: {},
        }}
        calculateMetadata={calculateMetadata}
      />
      <Composition
        id="CinematicRenderer"
        component={CinematicRenderer}
        durationInFrames={30 * 30}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          scenes: [],
          titleFontSize: 78,
          titleWidth: 1320,
          signalLineCount: 18,
        }}
        calculateMetadata={calculateCinematicMetadata}
      />
      <Composition
        id="SignalFromTomorrowWithMusic"
        component={CinematicRenderer}
        durationInFrames={30 * 30}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={signalFromTomorrowWithMusicFixture}
        calculateMetadata={calculateCinematicMetadata}
      />
      <Composition
        id="TalkingHead"
        component={TalkingHead}
        durationInFrames={30 * 300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          videoSrc: "",
          captions: [],
          overlays: [],
          wordsPerPage: 4,
          fontSize: 52,
          highlightColor: "#22D3EE",
        }}
      />
      <Composition
        id="TitledVideo"
        component={TitledVideo}
        durationInFrames={30 * 60}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          videoSrc: "",
          tagline: "home is a verb.",
          taglineInSeconds: 53.5,
          taglineOutSeconds: undefined,
          topPx: 150,
          fontSize: 148,
          accentColor: "#F5C470",
        }}
        calculateMetadata={calculateTitledVideoMetadata}
      />
      <Composition
        id="HeroTitle"
        component={HeroTitle}
        durationInFrames={30 * 17}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: "THE CALIBRATORS",
          subtitle: "The People Who Define Reality",
        }}
      />
      <Composition
        id="ProductReveal"
        component={ProductReveal}
        durationInFrames={30 * 8}
        fps={30}
        width={1280}
        height={720}
        defaultProps={{
          productImage: "airnothing/product.png",
          productName: "AirNothing Pro Max Ultra",
          price: "Starting at $999",
          tagline: "Nothing included.",
          closer: "Less is nothing.",
          accentColor: "#00D4FF",
        } as ProductRevealProps}
      />
      <Composition
        id="ProductRevealVertical"
        component={ProductReveal}
        durationInFrames={30 * 8}
        fps={30}
        width={720}
        height={1280}
        defaultProps={{
          productImage: "airnothing/product.png",
          productName: "AirNothing Pro Max Ultra",
          price: "Starting at $999",
          tagline: "Nothing included.",
          closer: "Less is nothing.",
          accentColor: "#00D4FF",
        } as ProductRevealProps}
      />
      <Composition
        id="CaptionOverlayOnly"
        component={CaptionOverlay}
        durationInFrames={30 * 300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          words: [] as WordCaption[],
          wordsPerPage: 3,
          fontSize: 58,
          highlightColor: "#FACC15",
          backgroundColor: "rgba(15, 23, 42, 0.75)",
        }}
      />
      <Composition
        id="CollageBurst"
        component={CollageBurst}
        durationInFrames={30 * 30}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          backgroundSrc: "",
          backgroundInSeconds: 0,
          curtainStartSeconds: 1.5,
          curtainEndSeconds: 3.0,
          clips: [],
        } as CollageBurstProps}
      />
      <Composition
        id="LyricOverlay"
        component={LyricOverlay}
        durationInFrames={30 * 28}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          videoSrc: "",
          lyrics: [],
          bottomY: 0.88,
        } as LyricOverlayProps}
      />
      <Composition
        id="EndTag"
        component={EndTag}
        // 5.5s at 30fps = 165 frames. Render CLI can override via --props.
        durationInFrames={165}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          text: "THE CITY KEEPS ITS OWN VIGIL.",
          palette: "cool_offwhite_on_black",
          fadeInSeconds: 0.6,
          holdSeconds: 4.3,
          fadeOutSeconds: 0.6,
        } as EndTagProps}
      />
      <Composition
        id="EndTagOverlay"
        component={EndTag}
        // 8.19s at 30fps = 246 frames. Render CLI can override via --props.
        // Intended to be composited on top of body footage, not concat'd.
        durationInFrames={246}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          text: "EARN THE LIGHT.",
          palette: "cool_offwhite_on_black",
          fadeInSeconds: 1.0,
          holdSeconds: 5.69,
          fadeOutSeconds: 1.5,
          overlay: true,
        } as EndTagProps}
      />

      <Composition
        id="BeggarReel"
        component={BeggarReel}
        durationInFrames={BEGGAR_TOTAL_FRAMES}
        fps={BEGGAR_FPS}
        width={BEGGAR_WIDTH}
        height={BEGGAR_HEIGHT}
      />

      <Composition
        id="MissedCallReel"
        component={MissedCallReel}
        durationInFrames={MISSED_CALL_TOTAL_FRAMES}
        fps={MISSED_CALL_FPS}
        width={MISSED_CALL_WIDTH}
        height={MISSED_CALL_HEIGHT}
      />

      <Composition
        id="RoachWarEp1"
        component={RoachWarEpisode}
        durationInFrames={roachWarTotalFrames(EP1.shots)}
        fps={ROACH_WAR_FPS}
        width={ROACH_WAR_WIDTH}
        height={ROACH_WAR_HEIGHT}
        defaultProps={{ episode: EP1 }}
      />

      <Composition
        id="RoachWarEp2"
        component={RoachWarEpisode}
        durationInFrames={roachWarTotalFrames(EP2.shots)}
        fps={ROACH_WAR_FPS}
        width={ROACH_WAR_WIDTH}
        height={ROACH_WAR_HEIGHT}
        defaultProps={{ episode: EP2 }}
      />

      <Composition
        id="RoachWarEp3"
        component={RoachWarEpisode}
        durationInFrames={roachWarTotalFrames(EP3.shots)}
        fps={ROACH_WAR_FPS}
        width={ROACH_WAR_WIDTH}
        height={ROACH_WAR_HEIGHT}
        defaultProps={{ episode: EP3 }}
      />

      <Composition
        id="VillageLineEp1"
        component={VillageLineEpisode}
        durationInFrames={villageLineTotalFrames(VL_EP1.scenes)}
        fps={VILLAGE_LINE_FPS}
        width={VILLAGE_LINE_WIDTH}
        height={VILLAGE_LINE_HEIGHT}
        defaultProps={{ episode: VL_EP1 }}
      />

      <Composition
        id="VillageLineEp2"
        component={VillageLineEpisode}
        durationInFrames={villageLineTotalFrames(VL_EP2.scenes)}
        fps={VILLAGE_LINE_FPS}
        width={VILLAGE_LINE_WIDTH}
        height={VILLAGE_LINE_HEIGHT}
        defaultProps={{ episode: VL_EP2 }}
      />

      <Composition
        id="VillageLineEp3"
        component={VillageLineEpisode}
        durationInFrames={villageLineTotalFrames(VL_EP3.scenes)}
        fps={VILLAGE_LINE_FPS}
        width={VILLAGE_LINE_WIDTH}
        height={VILLAGE_LINE_HEIGHT}
        defaultProps={{ episode: VL_EP3 }}
      />

      <Composition
        id="UnusualTalesEp01"
        component={RoachWarEpisode}
        durationInFrames={roachWarTotalFrames(EP01_SARN_HAI_LEK.shots)}
        fps={ROACH_WAR_FPS}
        width={ROACH_WAR_WIDTH}
        height={ROACH_WAR_HEIGHT}
        defaultProps={{ episode: EP01_SARN_HAI_LEK }}
      />

      <Composition
        id="UnusualTalesEp02"
        component={RoachWarEpisode}
        durationInFrames={roachWarTotalFrames(EP02_MIDNIGHT_ORDER.shots)}
        fps={ROACH_WAR_FPS}
        width={ROACH_WAR_WIDTH}
        height={ROACH_WAR_HEIGHT}
        defaultProps={{ episode: EP02_MIDNIGHT_ORDER }}
      />

      <Composition
        id="UnusualTalesEp03"
        component={RoachWarEpisode}
        durationInFrames={roachWarTotalFrames(EP03_CHAT_RECOVERY.shots)}
        fps={ROACH_WAR_FPS}
        width={ROACH_WAR_WIDTH}
        height={ROACH_WAR_HEIGHT}
        defaultProps={{ episode: EP03_CHAT_RECOVERY }}
      />

      <Composition
        id="UnusualTalesEp04"
        component={RoachWarEpisode}
        durationInFrames={roachWarTotalFrames(EP04_QUEUE_ZERO.shots)}
        fps={ROACH_WAR_FPS}
        width={ROACH_WAR_WIDTH}
        height={ROACH_WAR_HEIGHT}
        defaultProps={{ episode: EP04_QUEUE_ZERO }}
      />

      <Composition
        id="UnusualTalesEp05"
        component={RoachWarEpisode}
        durationInFrames={roachWarTotalFrames(EP05_MOSQUITO_WAR.shots)}
        fps={ROACH_WAR_FPS}
        width={ROACH_WAR_WIDTH}
        height={ROACH_WAR_HEIGHT}
        defaultProps={{ episode: EP05_MOSQUITO_WAR }}
      />

      <Composition
        id="GeckoLegendEp01"
        component={RoachWarEpisode}
        durationInFrames={roachWarTotalFrames(GECKO_LEGEND_EP01.shots)}
        fps={ROACH_WAR_FPS}
        width={ROACH_WAR_WIDTH}
        height={ROACH_WAR_HEIGHT}
        defaultProps={{ episode: GECKO_LEGEND_EP01 }}
      />

      <Composition
        id="GeckoLegendEp02"
        component={RoachWarEpisode}
        durationInFrames={roachWarTotalFrames(GECKO_LEGEND_EP02.shots)}
        fps={ROACH_WAR_FPS}
        width={ROACH_WAR_WIDTH}
        height={ROACH_WAR_HEIGHT}
        defaultProps={{ episode: GECKO_LEGEND_EP02 }}
      />

      <Composition
        id="GeckoLegendEp03"
        component={RoachWarEpisode}
        durationInFrames={roachWarTotalFrames(GECKO_LEGEND_EP03.shots)}
        fps={ROACH_WAR_FPS}
        width={ROACH_WAR_WIDTH}
        height={ROACH_WAR_HEIGHT}
        defaultProps={{ episode: GECKO_LEGEND_EP03 }}
      />

      <Composition
        id="GeckoLegendEp04"
        component={RoachWarEpisode}
        durationInFrames={roachWarTotalFrames(GECKO_LEGEND_EP04.shots)}
        fps={ROACH_WAR_FPS}
        width={ROACH_WAR_WIDTH}
        height={ROACH_WAR_HEIGHT}
        defaultProps={{ episode: GECKO_LEGEND_EP04 }}
      />

      <Composition
        id="MethaHairAd01"
        component={HairAd01}
        durationInFrames={Math.round(HAIR_AD_01_SECONDS * HAIR_AD_01_FPS)}
        fps={HAIR_AD_01_FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="MethaHairAd02"
        component={HairAd02}
        durationInFrames={Math.round(HAIR_AD_02_SECONDS * HAIR_AD_02_FPS)}
        fps={HAIR_AD_02_FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="MethaHairAd02R"
        component={HairAd02Retention}
        durationInFrames={HAIR_AD_02R_FRAMES}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ bed: false }}
      />
      <Composition
        id="MethaHairAd02RB"
        component={HairAd02Retention}
        durationInFrames={HAIR_AD_02R_FRAMES}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ bed: true }}
      />
      <Composition
        id="MethaHairAd03"
        component={HairAd03}
        durationInFrames={Math.round(HAIR_AD_03_SECONDS * HAIR_AD_03_FPS)}
        fps={HAIR_AD_03_FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="MethaHairAd04"
        component={HairAd04}
        durationInFrames={Math.round(HAIR_AD_04_SECONDS * HAIR_AD_04_FPS)}
        fps={HAIR_AD_04_FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="MethaHairAd05"
        component={HairAd05}
        durationInFrames={Math.round(HAIR_AD_05_SECONDS * HAIR_AD_05_FPS)}
        fps={HAIR_AD_05_FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="MethaHairAd06"
        component={HairAd06}
        durationInFrames={Math.round(HAIR_AD_06_SECONDS * HAIR_AD_06_FPS)}
        fps={HAIR_AD_06_FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="MethaHairAd07"
        component={HairAd07}
        durationInFrames={Math.round(HAIR_AD_07_SECONDS * HAIR_AD_07_FPS)}
        fps={HAIR_AD_07_FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="MethaHairAd08"
        component={HairAd08}
        durationInFrames={Math.round(HAIR_AD_08_SECONDS * HAIR_AD_08_FPS)}
        fps={HAIR_AD_08_FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="MethaHairAd09"
        component={HairAd09}
        durationInFrames={Math.round(HAIR_AD_09_SECONDS * HAIR_AD_09_FPS)}
        fps={HAIR_AD_09_FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="MethaHairAd10"
        component={HairAd10}
        durationInFrames={Math.round(HAIR_AD_10_SECONDS * HAIR_AD_10_FPS)}
        fps={HAIR_AD_10_FPS}
        width={1080}
        height={1920}
      />
      <Composition id="UsmileCover01" component={UsmileCover01} durationInFrames={1} fps={30} width={1080} height={1920} />
      <Composition id="UsmileAd02" component={UsmileAd02} durationInFrames={Math.round(USMILE_AD_02_SECONDS * USMILE_AD_02_FPS)} fps={USMILE_AD_02_FPS} width={1080} height={1920} />
      <Composition id="UsmileCover02" component={UsmileCover02} durationInFrames={1} fps={30} width={1080} height={1920} />
      <Composition id="UsmileAd03" component={UsmileAd03} durationInFrames={Math.round(USMILE_AD_03_SECONDS * USMILE_AD_03_FPS)} fps={USMILE_AD_03_FPS} width={1080} height={1920} />
      <Composition id="UsmileCover03" component={UsmileCover03} durationInFrames={1} fps={30} width={1080} height={1920} />
      {USMILE_SPECS.map((sp) => (
        <Composition key={sp.id} id={sp.id} component={UsmileStory} defaultProps={{ spec: sp }} durationInFrames={Math.round(sp.seconds * STORY_FPS)} fps={STORY_FPS} width={1080} height={1920} />
      ))}
      <Composition
        id="UsmileAd01"
        component={UsmileAd01}
        durationInFrames={Math.round(USMILE_AD_01_SECONDS * USMILE_AD_01_FPS)}
        fps={USMILE_AD_01_FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="MethaSprayAd10"
        component={SprayAd10}
        durationInFrames={Math.round(SPRAY_AD_10_SECONDS * SPRAY_AD_10_FPS)}
        fps={SPRAY_AD_10_FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="MethaSprayAd09"
        component={SprayAd09}
        durationInFrames={Math.round(SPRAY_AD_09_SECONDS * SPRAY_AD_09_FPS)}
        fps={SPRAY_AD_09_FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="MethaSprayAd08"
        component={SprayAd08}
        durationInFrames={Math.round(SPRAY_AD_08_SECONDS * SPRAY_AD_08_FPS)}
        fps={SPRAY_AD_08_FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="MethaSprayAd07"
        component={SprayAd07}
        durationInFrames={Math.round(SPRAY_AD_07_SECONDS * SPRAY_AD_07_FPS)}
        fps={SPRAY_AD_07_FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="MethaSprayAd06"
        component={SprayAd06}
        durationInFrames={Math.round(SPRAY_AD_06_SECONDS * SPRAY_AD_06_FPS)}
        fps={SPRAY_AD_06_FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="MethaSprayAd05"
        component={SprayAd05}
        durationInFrames={Math.round(SPRAY_AD_05_SECONDS * SPRAY_AD_05_FPS)}
        fps={SPRAY_AD_05_FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="MethaSprayAd04"
        component={SprayAd04}
        durationInFrames={Math.round(SPRAY_AD_04_SECONDS * SPRAY_AD_04_FPS)}
        fps={SPRAY_AD_04_FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="MethaSprayAd03"
        component={SprayAd03}
        durationInFrames={Math.round(SPRAY_AD_03_SECONDS * SPRAY_AD_03_FPS)}
        fps={SPRAY_AD_03_FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="MethaSprayAd02"
        component={SprayAd02}
        durationInFrames={Math.round(SPRAY_AD_02_SECONDS * SPRAY_AD_02_FPS)}
        fps={SPRAY_AD_02_FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="MethaSprayAd01"
        component={SprayAd01}
        durationInFrames={Math.round(SPRAY_AD_01_SECONDS * SPRAY_AD_01_FPS)}
        fps={SPRAY_AD_01_FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="FxKitGallery"
        component={FxKitGallery}
        durationInFrames={FX_GALLERY_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />

      <Composition
        id="ChaoPhrayaEp01"
        component={RoachWarEpisode}
        durationInFrames={roachWarTotalFrames(CHAO_PHRAYA_EP01.shots)}
        fps={ROACH_WAR_FPS}
        width={ROACH_WAR_WIDTH}
        height={ROACH_WAR_HEIGHT}
        defaultProps={{ episode: CHAO_PHRAYA_EP01 }}
      />

      <Composition
        id="ChaoPhrayaEp02"
        component={RoachWarEpisode}
        durationInFrames={roachWarTotalFrames(CHAO_PHRAYA_EP02.shots)}
        fps={ROACH_WAR_FPS}
        width={ROACH_WAR_WIDTH}
        height={ROACH_WAR_HEIGHT}
        defaultProps={{ episode: CHAO_PHRAYA_EP02 }}
      />

      <Composition
        id="ChaoPhrayaEp03"
        component={RoachWarEpisode}
        durationInFrames={roachWarTotalFrames(CHAO_PHRAYA_EP03.shots)}
        fps={ROACH_WAR_FPS}
        width={ROACH_WAR_WIDTH}
        height={ROACH_WAR_HEIGHT}
        defaultProps={{ episode: CHAO_PHRAYA_EP03 }}
      />

      <Composition
        id="TermiteEp03"
        component={RoachWarEpisode}
        durationInFrames={roachWarTotalFrames(TERMITE_EP03.shots)}
        fps={ROACH_WAR_FPS}
        width={ROACH_WAR_WIDTH}
        height={ROACH_WAR_HEIGHT}
        defaultProps={{ episode: TERMITE_EP03 }}
      />

      <Composition
        id="TermiteEp02"
        component={RoachWarEpisode}
        durationInFrames={roachWarTotalFrames(TERMITE_EP02.shots)}
        fps={ROACH_WAR_FPS}
        width={ROACH_WAR_WIDTH}
        height={ROACH_WAR_HEIGHT}
        defaultProps={{ episode: TERMITE_EP02 }}
      />

      <Composition
        id="TermiteEp01"
        component={RoachWarEpisode}
        durationInFrames={roachWarTotalFrames(TERMITE_EP01.shots)}
        fps={ROACH_WAR_FPS}
        width={ROACH_WAR_WIDTH}
        height={ROACH_WAR_HEIGHT}
        defaultProps={{ episode: TERMITE_EP01 }}
      />

      <Composition
        id="ChaoPhrayaEp04"
        component={RoachWarEpisode}
        durationInFrames={roachWarTotalFrames(CHAO_PHRAYA_EP04.shots)}
        fps={ROACH_WAR_FPS}
        width={ROACH_WAR_WIDTH}
        height={ROACH_WAR_HEIGHT}
        defaultProps={{ episode: CHAO_PHRAYA_EP04 }}
      />

      <Composition
        id="UsmileTwentySeconds"
        component={RoachWarEpisode}
        durationInFrames={roachWarTotalFrames(USMILE_TWENTY_SECONDS.shots)}
        fps={ROACH_WAR_FPS}
        width={ROACH_WAR_WIDTH}
        height={ROACH_WAR_HEIGHT}
        defaultProps={{ episode: USMILE_TWENTY_SECONDS }}
      />
    </>
  );
};
