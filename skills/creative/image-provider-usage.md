# Image Provider Usage for OpenMontage

> How to choose between image generation and stock providers, and how to use each effectively.
> Supplements the existing `image-gen-usage.md` (which covers FLUX prompting in depth).

## Provider Landscape

### Generation Providers (AI creates the image)

| Tool | Provider | Cost | Speed | Best For |
|------|----------|------|-------|----------|
| `flux_image` | FLUX 2 Pro via fal.ai | ~$0.03-0.05 | ~5-10s | Photorealism, general purpose, workhorse |
| `magnific_mystic` | Mystic via Magnific/Freepik | ~$0.04-0.10 | 10-90s (by resolution) | Material texture (skin, fabric, food, metal), editorial portraits, product hero shots, native 4K |
| `grok_image` | Grok Imagine Image (xAI) | $0.02/output + $0.002/input edit image | ~5-15s | Image edits, style transfer, multi-image compositing |
| `openai_image` | GPT Image 2 (OpenAI) | ~$0.01-0.21 | ~5-15s | Complex instructions, text in images, multi-element |
| `recraft_image` | Recraft V4 via fal.ai | ~$0.04-0.25 | ~5-10s | Logos, SVG vectors, brand assets, text rendering (see caveat below) |
| `local_diffusion` | Stable Diffusion (local) | Free | ~30s+ | Offline, privacy, free |
| `image_gen` | Multi (legacy, deprecated) | Varies | Varies | **Deprecated** — use `image_selector` or per-provider tools |

### Stock Providers (search and download existing images)

| Tool | Provider | Cost | Speed | Best For |
|------|----------|------|-------|----------|
| `pexels_image` | Pexels | Free | ~2-5s | High-quality photography, color filtering |
| `pixabay_image` | Pixabay | Free | ~2-5s | Large library, category filtering, illustrations |

### Selector

| Tool | Purpose |
|------|---------|
| `image_selector` | Routes to the best available provider based on preference and availability |

## Provider Selection by Scene Type

| Scene Type | Primary Provider | Why | Fallback |
|-----------|-----------------|-----|----------|
| **Real-world photo** (city, nature, people) | `pexels_image` | Real photos > AI for realism | `pixabay_image` → `flux_image` |
| **Technical diagram** | `diagram_gen` | Structured, editable | `flux_image` with diagram prompt |
| **Abstract/conceptual illustration** | `flux_image` | AI excels at custom concepts | `openai_image` |
| **Style transfer / repaint of an existing image** | `grok_image` | Native edit flow, strong promptable transforms | `openai_image` |
| **Multi-image merge / composite** | `grok_image` | Can combine multiple source images into one scene | `openai_image` |
| **Logo or brand asset** | `recraft_image` | SVG support, text accuracy | `openai_image` |
| **Image with text/labels** | `openai_image` | Best text rendering (GPT Image 2) | `recraft_image` |
| **Complex multi-element composition** | `openai_image` | Best instruction following | `flux_image` |
| **Hero image (key visual)** | `flux_image` | Highest visual quality | `openai_image` |
| **Texture-critical subject** (skin, fabric, food, metal, weathered surfaces) | `magnific_mystic` | Detail engine beats prompt-following models on material realism | `flux_image` |
| **Editorial portrait / beauty** | `magnific_mystic` (`model: editorial_portraits`) | Purpose-built model | `flux_image` |
| **Product hero needing print-size output** | `magnific_mystic` (`resolution: 4k`) | Native 4K skips a separate upscale pass | `flux_image` → `magnific_upscale` |
| **Match an existing reference look** | `magnific_mystic` (`style_reference_path`) | Copies aesthetic without prompt reverse-engineering | `grok_image` |
| **Thumbnail** | `flux_image` or `recraft_image` | Needs to be eye-catching | — |
| **Budget/free project** | `pexels_image` or `pixabay_image` | Free, immediate | `local_diffusion` |
| **Offline/air-gapped** | `local_diffusion` | No network needed | — |

## Provider-Specific Caveats

### Mystic via Magnific/Freepik
- **No `negative_prompt` and no numeric seed.** To reproduce a look, set `fixed_generation: true` and keep every other parameter identical.
- **No exact pixel dimensions.** Mystic takes a named ratio (`widescreen_16_9`, `social_story_9_16`, …) plus a resolution tier (`1k`/`2k`/`4k`). Generic forms like `"16:9"` are translated automatically. When a precise canvas matters, use `flux_image`.
- **Weak at text inside the image.** Route text scenes to `openai_image` or Remotion `text_card`.
- **`creative_detailing` above ~50 hallucinates skin artifacts on faces.** Keep it low for people, raise it for inanimate texture.
- Read `.agents/skills/magnific-best-practices/SKILL.md` before writing Mystic prompts.

### Recraft V4 via fal.ai
- **`style` parameter causes 422 errors** (as of 2026-04). The `style` enum values (`digital_illustration`, `realistic_image`, etc.) are rejected by fal.ai's Recraft V4 endpoint. **Workaround:** encode style direction in the prompt text instead (e.g. "digital illustration of a tooth cross-section" rather than `style="digital_illustration"`). The `image_size` and `colors` parameters work fine.
- **Text rendering is unreliable for exact business names.** Recraft (like all AI image models) may hallucinate wrong text. For any scene where text must be verbatim (CTA screens, business names, phone numbers), use Remotion `text_card` instead of generating an image with text.

## Cost-Quality Tradeoff

```

PRODUCTION PATH: Premium
├── Hero images: flux_image ($0.05/img)
├── Supporting visuals: flux_image ($0.03/img)
├── Text overlays: openai_image ($0.05/img medium)
├── B-roll stills: pexels_image ($0.00)
└── Total for 10 images: ~$0.35

PRODUCTION PATH: Standard
├── All generated: flux_image ($0.03/img)
├── B-roll stills: pexels_image ($0.00)
└── Total for 10 images: ~$0.25

PRODUCTION PATH: Budget
├── All stock: pexels_image + pixabay_image ($0.00)
├── Diagrams: diagram_gen ($0.00)
└── Total: $0.00

PRODUCTION PATH: Offline
├── All generated: local_diffusion ($0.00)
├── Diagrams: diagram_gen ($0.00)
└── Total: $0.00 (but slower, lower quality)
```

Use `generation_mode="edit"` when the task starts from an existing image and should route only to edit-capable providers.

## Using the Image Selector

For most cases, use `image_selector` and let it route:

```python
# The selector finds the best available provider
result = image_selector.execute({
    "prompt": "aerial view of a modern data center",
    "preferred_provider": "auto",  # or "flux", "pexels", etc.
    "output_path": "assets/images/scene-3.png"
})
```

Override with `preferred_provider` when you know which provider is best for the scene type.
Use `allowed_providers` to restrict to free or local options:

```python
# Budget mode: only free providers
result = image_selector.execute({
    "prompt": "server room interior",
    "allowed_providers": ["pexels", "pixabay", "local_diffusion"],
    "output_path": "assets/images/scene-3.jpg"
})
```

## Consistency Across Mixed Sources

When mixing stock and generated images in the same video, visual consistency is the challenge.

### Strategy: Color Grade Everything
Apply the playbook's color grading LUT to both stock and generated images in the compose stage.
This unifies the look. The `color_grade` enhancement tool handles this.

### Strategy: Match The Visual Identity, Not A Copied Prefix
When generating images, adapt the playbook's mood, palette, texture, and medium
into a short scene-specific anchor. When searching stock, filter for the same
emotional and visual qualities: color, lighting, environment, composition, era,
and texture. Use the playbook as a consistency source, not a script to paste.

### Strategy: Avoid Mixing Styles Within a Scene
Don't use a stock photo for one element and an AI illustration for another in the same scene.
Keep each scene internally consistent — all stock or all generated.
