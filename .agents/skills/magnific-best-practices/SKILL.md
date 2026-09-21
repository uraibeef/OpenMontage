---
name: magnific-best-practices
description: Prompting and parameter guidance for the Magnific API — Mystic text-to-image generation and the Magnific creative upscaler. Read before writing prompts for magnific_mystic or choosing knobs for magnific_upscale.
---

# Magnific best practices

Magnific is the platform **formerly branded Freepik** — the site now presents
itself as "Magnific (formerly Freepik)". Consequences that matter when reading
any tutorial older than the rename:

- API base is `https://api.magnific.com`, **not** `api.freepik.com`.
- Docs are at `docs.magnific.com`; `docs.freepik.com` 301s there.
- Auth header is `x-magnific-api-key`.
- Keys are created at `https://www.magnific.com/user/organization/api-keys`.

OpenMontage exposes two tools against it:

| Tool | Endpoint | Job |
|---|---|---|
| `magnific_mystic` | `POST /v1/ai/mystic` | Text-to-image generation |
| `magnific_upscale` | `POST /v1/ai/image-upscaler` | Creative upscale to 16x |

Both need `MAGNIFIC_API_KEY` (or `FREEPIK_API_KEY`, the pre-rename name). Both
are async: the tool submits, polls `GET <path>/{task_id}`, and blocks until
`COMPLETED`.

Other endpoints the API exposes, not yet wrapped as tools:
`GET /v1/ai/mystic` (list all tasks) and `GET /v1/ai/loras` (curated LoRA list
for the `styling.styles` block).

## There is also an official Magnific MCP server

Endpoint `https://mcp.magnific.com`, setup page `https://www.magnific.com/mcp`.
It connects Claude Code, Claude, ChatGPT, Cursor, Codex, VS Code and Gemini to
Magnific over **OAuth — no API key**, and exposes far more than these two tools:
image/video/audio/vector/3D generation, upscale, relight, layer editing, resize,
Creations history, Spaces workflows, LoRA training, and the full model catalog.

**Check whether it is already connected before reaching for the REST tools.**
If tools named `images_generate`, `creations_*`, `spaces_*` or `library_*` are
available in the session, the MCP is live and `MAGNIFIC_API_KEY` is unnecessary
for interactive work.

Choose by surface:

| Situation | Use |
|---|---|
| Interactive generation in a chat, exploring looks, one-off assets | MCP |
| Newest models (Mystic 2.5 and later), Spaces, LoRA training | MCP — the REST tools here wrap Mystic 1.x parameters only |
| Generation inside an OpenMontage pipeline run | these tools |
| Artifacts must land in the project directory under the cost tracker | these tools |
| No interactive OAuth available (CI, headless) | these tools |

The MCP reports live credit balance via its `account_balance` tool. Prefer that
over the unverified estimates below whenever the MCP is connected.

## When to pick Mystic over the other generators

Pick Mystic when the brief rewards **material texture**: skin, fabric, food,
metal, weathered surfaces, editorial portraits, product hero shots. Mystic's
detail engine is its whole reason for existing.

Do **not** pick Mystic for:

- **Text inside the image** — use `openai_image` (GPT Image) or `recraft_image`.
- **Exact pixel dimensions** — Mystic takes a ratio name plus a resolution
  tier, never width/height. Use `flux_image` when a precise canvas matters.
- **High-volume cheap batches** — FLUX dev is roughly half the price.
- **Tight prompt following on surreal briefs** — `fluid` helps, but Seedream
  and FLUX still follow long compositional instructions more literally.

## Mystic model selection

| `model` | Use it for |
|---|---|
| `realism` | Default. Photographic, strong material detail. |
| `super_real` | Maximum photorealism. Slowest; use for a hero frame, not 30 of them. |
| `editorial_portraits` | Faces, magazine lighting, beauty and fashion. |
| `fluid` | Complex or surreal prompts — follows instructions most literally. |
| `zen` | Cleaner and smoother; less micro-texture. Good for calm/minimal art direction. |
| `flexible` | Balanced fallback when the brief is mixed. |

## Engines

`engine` shapes the detail character, on both tools:

- `automatic` — let Magnific choose. Safe default.
- `magnific_sharpy` — crisp, photographic. Best for product and architecture.
- `magnific_sparkle` — balanced, slightly richer. Good general pick for people.
- `magnific_illusio` — softest, painterly. Best for illustration and 2D art.

## Prompting Mystic

Write a **scene description**, not a keyword pile. Mystic responds to material
and light language more than to style tags.

Good:

```
A weathered brass espresso machine on a marble counter, morning window light
raking across the steam wand, condensation beading on the chrome, shallow
depth of field, fine scratches visible in the brass
```

Weak:

```
espresso machine, 8k, hyperrealistic, masterpiece, trending on artstation
```

Notes:

- There is **no `negative_prompt`** and **no numeric seed**. To reproduce a
  look, set `fixed_generation: true` and keep every other parameter identical.
- `creative_detailing` (0-100, default 33) controls invented micro-detail.
  Raise it to ~60 for texture-heavy subjects; keep it low for faces, where high
  values hallucinate skin artifacts.
- `@character_name` and `@character_name::strength` reference saved characters.

## Reference images

- **Style reference** copies an aesthetic. Pair it with `adherence` (0-100, how
  closely to follow) and `hdr` (0-100, detail strength). Both only apply when a
  style reference is present.
- **Structure reference** keeps composition and shape. Pair it with
  `structure_strength` (0-100). Use this for storyboard-to-final continuity.

**Pass references by URL when you have one.** Magnific documents a measurable
quality hierarchy for how the reference arrives:

| How the reference is sent | Quality |
|---|---|
| URL of the original image | ✅ maximum |
| base64 of the original file, read directly | ✅ maximum |
| `canvas.toDataURL('image/jpeg')` | ❌ ~8% loss |
| `canvas.toDataURL('image/jpeg', 0.8)` | ❌ ~20% loss |
| resized before sending | ❌ significant loss |
| PNG converted to JPEG before sending | ❌ loss |

So: use `style_reference_url` / `structure_reference_url` for anything already
online, and `style_reference_path` / `structure_reference_path` for local files —
the tool base64-encodes the original bytes and never resizes or re-encodes. Do
not pre-process a reference to "help"; every transform costs fidelity.

## LoRA styles and characters

`styling` carries three optional blocks:

- `styles` — max 1 item, `{name, strength}` with strength 0-200 (default 100).
  Names come from `GET /v1/ai/loras`; ask for that list rather than guessing.
- `characters` — max 1 item, `{id, strength}`, strength 0-200. Prompts can also
  reference a saved character inline as `@character_name::strength`.
- `colors` — 1-5 items, `{color: "#RRGGBB", weight: 0.05-1}`.

## Resolution and timing

| `resolution` | Typical time | Planning estimate (unverified) |
|---|---|---|
| `1k` | 10-20s | ~$0.04 |
| `2k` | 20-40s | ~$0.06 |
| `4k` | 40-90s | ~$0.10 |

The times are documented. **The dollar figures are not** — see Cost discipline.

Generating at `4k` is usually cheaper and cleaner than generating at `1k` and
running a separate upscale pass. Reach for `magnific_upscale` when the source
already exists, not as a routine finishing step on fresh Mystic output.

## Aspect ratios

Mystic uses named ratios, not `W:H`. The tool translates the common generic
forms automatically, so `"16:9"` and `"widescreen_16_9"` both work. Native
names: `square_1_1`, `classic_4_3`, `traditional_3_4`, `widescreen_16_9`,
`social_story_9_16`, `smartphone_horizontal_20_9`, `smartphone_vertical_9_20`,
`standard_3_2`, `portrait_2_3`, `horizontal_2_1`, `vertical_1_2`, `social_5_4`,
`social_post_4_5`.

For vertical video work, `social_story_9_16` is the one you want.

## The creative upscaler

`magnific_upscale` **invents** detail. That is the point, and also the risk.

Rules that matter:

1. **Always pass the original prompt** when upscaling an AI image. It is the
   single biggest quality lever the API has.
2. **Set `optimized_for` to match the subject.** `soft_portraits`,
   `hard_portraits`, `art_n_illustration`, `videogame_assets`,
   `nature_n_landscapes`, `films_n_photography`, `3d_renders`,
   `science_fiction_n_horror`, or `standard`.
3. **Knobs are -10..10, default 0** — `creativity`, `hdr`, `resemblance`,
   `fractality`. Move one at a time.
   - Faces or a client deliverable: `creativity: -2`, `resemblance: 4`.
   - Texture-hungry art or print: `creativity: 4`, `fractality: 3`.
4. **Check faces, hands, and any text at 100%.** Creative mode rewrites them.
   If the source must stay untouched, use the local `upscale` tool
   (Real-ESRGAN) instead — it sharpens without inventing.
5. **Never run this per video frame.** At ~$0.08-0.60 per image, a 5-second
   clip costs more than the rest of the production. Upscale stills only.

Source cap: 25.3 million pixels. Scale factors: `2x`, `4x`, `8x`, `16x`.

## Cost discipline

**The USD figures in this document are unverified estimates.** Magnific bills in
pre-purchased credits and does not publish a public per-request rate — the
pricing page at `https://www.magnific.com/api/pricing` requires a login, and it
warns that the legacy pay-per-usage API plan is being discontinued in favour of
credit plans.

The numbers exist so the cost tracker has monotonic values to reason with
(4k > 2k > 1k; 16x > 8x > 4x > 2x), which is enough for provider ranking and for
refusing absurd plans like per-frame upscaling. They are **not** a quote.

Before telling the user what a production will cost, check their actual credit
balance and rate in their Magnific account and say plainly that the tracker
figures are estimates.
