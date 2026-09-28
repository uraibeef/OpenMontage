import { AbsoluteFill, useCurrentFrame } from "remotion";

/** Two riso ink drums: `dark` prints shadows, `mid` prints midtones and up. */
export interface RisoInks {
  dark: string;
  mid: string;
  paper: string;
}

/** Classic riso drum colours (Federal Blue, Fluorescent Pink, Yellow, Teal…). */
export const RISO = {
  blue: "#0078BF",
  pink: "#FF48B0",
  red: "#FF665E",
  yellow: "#FFE800",
  teal: "#00838A",
  black: "#1A1A1A",
  paper: "#F4EFE3",
} as const;

export const RISO_DEFAULT: RisoInks = { dark: RISO.blue, mid: RISO.pink, paper: RISO.paper };

const hexToRgb = (hex: string): [number, number, number] => {
  const n = parseInt(hex.replace("#", ""), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

interface RisoFilterProps {
  id: string;
  inks?: RisoInks;
  /** Grain dither strength 0..1 — how "stochastic screened" the print looks. */
  grain?: number;
  /** Luminance cut-offs for the two drums (0 black … 1 white). */
  darkAt?: number;
  midAt?: number;
  /** Misregistration between the two drums, px. */
  offset?: number;
  /** Re-seed grain every N frames (riso boil). */
  boilEvery?: number;
}

/**
 * SVG filter that re-prints whatever it is applied to as a two-colour
 * risograph: luminance → grain-dithered hard masks → two ink layers
 * overprinted (multiply) on paper, slightly misregistered and boiling.
 * Render it once, then reference it with `filter: url(#id)` (HTML or SVG).
 */
export function RisoFilter({
  id,
  inks = RISO_DEFAULT,
  grain = 0.35,
  darkAt = 0.36,
  midAt = 0.66,
  offset = 5,
  boilEvery = 2,
}: RisoFilterProps) {
  const frame = useCurrentFrame();
  const tick = Math.floor(frame / boilEvery);
  const seed = 3 + tick * 7;
  const jx = ((tick * 37) % 5) - 2;
  const jy = ((tick * 23) % 5) - 2;
  const S = 40;
  const ink = (hex: string, t: number) => {
    const [r, g, b] = hexToRgb(hex);
    return `0 0 0 0 ${r}  0 0 0 0 ${g}  0 0 0 0 ${b}  ${-S} 0 0 0 ${S * t}`;
  };
  const [pr, pg, pb] = hexToRgb(inks.paper);

  return (
    <svg width={0} height={0} style={{ position: "absolute" }} aria-hidden>
      <defs>
        <filter id={id} x={0} y={0} width={1} height={1} colorInterpolationFilters="sRGB">
          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values="0.3 0.59 0.11 0 0  0.3 0.59 0.11 0 0  0.3 0.59 0.11 0 0  0 0 0 1 0"
            result="lum"
          />
          <feTurbulence type="fractalNoise" baseFrequency={0.85} numOctaves={1} seed={seed} result="noise" />
          <feComposite in="lum" in2="noise" operator="arithmetic" k1={0} k2={1} k3={grain} k4={-grain / 2} result="dith" />
          <feColorMatrix in="dith" type="matrix" values={ink(inks.mid, midAt)} result="midMask" />
          <feOffset in="midMask" dx={offset + jx} dy={-offset / 2 + jy} result="midInk" />
          <feColorMatrix in="dith" type="matrix" values={ink(inks.dark, darkAt)} result="darkMask" />
          <feOffset in="darkMask" dx={-offset / 2 - jx} dy={offset / 2 - jy} result="darkInk" />
          <feFlood floodColor={`rgb(${pr * 255},${pg * 255},${pb * 255})`} result="paper" />
          <feBlend in="midInk" in2="paper" mode="multiply" result="p1" />
          <feBlend in="darkInk" in2="p1" mode="multiply" />
        </filter>
      </defs>
    </svg>
  );
}

interface RisoProps extends Omit<RisoFilterProps, "id"> {
  /** Unique per composition — used as the SVG filter id. */
  id: string;
  children: React.ReactNode;
  /** Fade the print in/out over the untreated source (0 = source, 1 = full riso). */
  mix?: number;
}

/** Wraps any footage/graphics and re-prints it as a boiling two-colour riso. */
export function Riso({ id, children, mix = 1, ...filter }: RisoProps) {
  return (
    <AbsoluteFill>
      <RisoFilter id={id} {...filter} />
      {mix < 1 ? <AbsoluteFill>{children}</AbsoluteFill> : null}
      <AbsoluteFill style={{ filter: `url(#${id})`, opacity: mix }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
}
