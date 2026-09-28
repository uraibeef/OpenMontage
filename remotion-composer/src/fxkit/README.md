# fxkit — reusable punch FX

Frame-driven, deterministic Remotion components for vertical reels. Put each
one inside a `<Sequence>` so its frame 0 is the moment the effect starts.
Preview everything in Studio: composition **FxKitGallery**.

```tsx
import { Riso, RISO, TearReveal, Glitch, Flash, PunchIn, SpeedLines, PaperGrain } from "../fxkit";
```

| Component | What it does | Key props |
|---|---|---|
| `Riso` | Re-prints children (footage or graphics) as a two-drum risograph: grain-dithered ink masks, overprint multiply on paper, misregistered, boiling every 2 frames. | `id` (unique), `inks {dark, mid, paper}`, `grain`, `darkAt`, `midAt`, `offset`, `mix` |
| `RisoFilter` | The bare SVG filter, if you want `filter: url(#id)` on your own element. | same as `Riso` |
| `RISO` | Drum colours: blue, pink, red, yellow, teal, black, paper. | — |
| `TearReveal` | Paper-tear transition. The outgoing frame (a still) rips down a jagged line; halves fly apart showing white fibre. Lay it over the incoming shot. | `src` (public path to still), `dur`, `seed`, `paper` |
| `Glitch` | Scan-slice shear + RGB split + scanlines over the first frames of a shot, then clean. Wraps children. | `id`, `dur`, `amount` |
| `SpeedLines` | Manga speed lines rushing to a focus point; they redraw every 2 frames. | `dur`, `count`, `color`, `cx`, `cy`, `hole` |
| `Flash` | Full-frame colour flash fading out. | `dur`, `color`, `peak` |
| `PunchIn` | Scale snap on a cut (1+amount → 1). Wrap each new shot. | `amount`, `dur` |
| `PaperGrain` | Multiply grain texture over flat graphics. | `id`, `opacity` |

Notes
- Filter `id`s must be unique within a composition. Derive them from the shot key.
- `TearReveal` needs a still of the outgoing shot. Grab it with ffmpeg at the
  exact cut time (see `projects/metha-hair-ad-01/cut_v5.py`).
- Pairs that print well: blue/pink (default), black/red, teal/yellow.
- First used in `src/methaad/HairAd01.tsx` (v5).
