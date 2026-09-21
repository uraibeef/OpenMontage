"""Mystic image generation via the Magnific API.

Mystic is Magnific's exclusive text-to-image model family — the same detail
engine that made the upscaler well known, run as a generator rather than an
enhancer. It is the right pick when the brief asks for texture and skin/material
realism rather than prompt gymnastics. Native 1K/2K/4K output means a hero frame
usually needs no separate upscale pass.

Magnific is the platform formerly branded Freepik; the API is api.magnific.com.

Docs: https://docs.magnific.com/api-reference/mystic/post-mystic
"""

from __future__ import annotations

import time
from pathlib import Path
from typing import Any

from tools import magnific_client as magnific
from tools.base_tool import (
    BaseTool,
    Determinism,
    ExecutionMode,
    ResourceProfile,
    RetryPolicy,
    ToolResult,
    ToolRuntime,
    ToolStability,
    ToolStatus,
    ToolTier,
)


MODELS = {
    "realism": "Photographic default — skin, fabric, and material detail",
    "fluid": "Follows complex prompts most literally; best for surreal briefs",
    "zen": "Cleaner, smoother output; less micro-texture",
    "flexible": "Balanced general-purpose model",
    "super_real": "Maximum photorealism; slowest of the family",
    "editorial_portraits": "Tuned for magazine-style portraits",
}

ENGINES = ("automatic", "magnific_illusio", "magnific_sharpy", "magnific_sparkle")
RESOLUTIONS = ("1k", "2k", "4k")

#: Mystic's native aspect-ratio vocabulary (13 documented values).
ASPECT_RATIOS = (
    "square_1_1",
    "classic_4_3",
    "traditional_3_4",
    "widescreen_16_9",
    "social_story_9_16",
    "smartphone_horizontal_20_9",
    "smartphone_vertical_9_20",
    "standard_3_2",
    "portrait_2_3",
    "horizontal_2_1",
    "vertical_1_2",
    "social_5_4",
    "social_post_4_5",
)

#: image_selector and the pipeline manifests speak "16:9"; Mystic does not.
ASPECT_ALIASES = {
    "1:1": "square_1_1",
    "4:3": "classic_4_3",
    "3:4": "traditional_3_4",
    "16:9": "widescreen_16_9",
    "9:16": "social_story_9_16",
    "20:9": "smartphone_horizontal_20_9",
    "9:20": "smartphone_vertical_9_20",
    "3:2": "standard_3_2",
    "2:3": "portrait_2_3",
    "2:1": "horizontal_2_1",
    "1:2": "vertical_1_2",
    "5:4": "social_5_4",
    "4:5": "social_post_4_5",
}

#: UNVERIFIED planning estimates in USD, by resolution tier, so the cost tracker
#: has monotonic numbers to reason with. Magnific bills in pre-purchased credits
#: and publishes no public per-request rate — its pricing page requires a login,
#: and the old pay-per-usage plan is being discontinued. Confirm live rates at
#: https://www.magnific.com/api/pricing before quoting a production budget.
COST_BY_RESOLUTION = {"1k": 0.04, "2k": 0.06, "4k": 0.10}


class MagnificMystic(BaseTool):
    name = "magnific_mystic"
    version = "0.1.0"
    tier = ToolTier.GENERATE
    capability = "image_generation"
    provider = "magnific"
    stability = ToolStability.BETA
    execution_mode = ExecutionMode.SYNC  # async API, but execute() blocks until done
    determinism = Determinism.SEEDED  # via fixed_generation, not a numeric seed
    runtime = ToolRuntime.API

    api_base = magnific.API_BASE
    submit_path = "/v1/ai/mystic"
    auth_header_name = magnific.AUTH_HEADER_NAME

    dependencies = []  # checked dynamically via env var
    install_instructions = (
        "Set MAGNIFIC_API_KEY to your Magnific API key.\n"
        "  Create one at https://www.magnific.com/user/organization/api-keys\n"
        "  FREEPIK_API_KEY is accepted as an alias (Magnific was branded Freepik)."
    )
    agent_skills = ["magnific-best-practices"]

    capabilities = ["generate_image", "text_to_image", "generate_illustration"]
    supports = {
        "negative_prompt": False,
        "seed": False,
        "fixed_generation": True,
        "style_reference": True,
        "structure_reference": True,
        "custom_size": False,  # ratio + resolution tier, not width/height
    }
    best_for = [
        "photorealistic images with heavy micro-texture (skin, fabric, food)",
        "editorial portraits and product hero shots",
        "4K stills that skip a separate upscale pass",
        "matching a reference look via style_reference",
    ]
    not_good_for = [
        "text rendering inside the image",
        "exact pixel dimensions (ratio tiers only)",
        "offline generation",
        "cheap high-volume batches",
    ]

    input_schema = {
        "type": "object",
        "required": ["prompt"],
        "properties": {
            "prompt": {
                "type": "string",
                "description": (
                    "Image description. Supports @character_name and "
                    "@character_name::strength references."
                ),
            },
            "model": {
                "type": "string",
                "enum": list(MODELS),
                "default": "realism",
                "description": "; ".join(f"{k}: {v}" for k, v in MODELS.items()),
            },
            "resolution": {
                "type": "string",
                "enum": list(RESOLUTIONS),
                "default": "2k",
                "description": "1k ~10-20s, 2k ~20-40s, 4k ~40-90s",
            },
            "aspect_ratio": {
                "type": "string",
                "default": "square_1_1",
                "description": (
                    "Mystic ratio name (e.g. widescreen_16_9). Generic forms "
                    "like '16:9' are translated automatically."
                ),
            },
            "engine": {
                "type": "string",
                "enum": list(ENGINES),
                "default": "automatic",
                "description": (
                    "Detail engine. illusio=softest/illustration, "
                    "sharpy=crisp/photographic, sparkle=balanced."
                ),
            },
            "creative_detailing": {
                "type": "integer",
                "default": 33,
                "description": "0-100. Higher invents more micro-detail.",
            },
            "fixed_generation": {
                "type": "boolean",
                "default": False,
                "description": "Reproduce the same output for identical settings.",
            },
            "filter_nsfw": {"type": "boolean", "default": True},
            "style_reference_url": {
                "type": "string",
                "description": (
                    "URL of an image whose aesthetic should be copied. Preferred "
                    "over style_reference_path — Magnific recommends URLs."
                ),
            },
            "style_reference_path": {
                "type": "string",
                "description": (
                    "Local image whose aesthetic should be copied. Sent as base64 "
                    "of the original bytes; never resized or re-encoded."
                ),
            },
            "adherence": {
                "type": "integer",
                "default": 50,
                "description": "0-100. How closely to follow style_reference.",
            },
            "hdr": {
                "type": "integer",
                "default": 50,
                "description": "0-100. Detail strength when a style_reference is set.",
            },
            "structure_reference_url": {
                "type": "string",
                "description": (
                    "URL of an image whose composition/shape should be kept. "
                    "Preferred over structure_reference_path."
                ),
            },
            "structure_reference_path": {
                "type": "string",
                "description": (
                    "Local image whose composition/shape should be kept. Sent as "
                    "base64 of the original bytes; never resized or re-encoded."
                ),
            },
            "structure_strength": {
                "type": "integer",
                "default": 50,
                "description": "0-100. How rigidly to follow structure_reference.",
            },
            "styling": {
                "type": "object",
                "description": "Optional {styles, characters, colors} styling block.",
            },
            "webhook_url": {"type": "string"},
            "output_path": {"type": "string", "default": "magnific_mystic.png"},
            "poll_timeout_seconds": {"type": "integer", "default": 300},
        },
    }

    resource_profile = ResourceProfile(
        cpu_cores=1, ram_mb=512, vram_mb=0, disk_mb=200, network_required=True
    )
    retry_policy = RetryPolicy(max_retries=2, retryable_errors=["rate_limit", "timeout"])
    idempotency_key_fields = [
        "prompt",
        "model",
        "resolution",
        "aspect_ratio",
        "engine",
        "creative_detailing",
        "fixed_generation",
    ]
    side_effects = ["writes image file to output_path", "calls Magnific API"]
    user_visible_verification = [
        "Inspect the image for prompt relevance",
        "Check faces and hands at 100% — creative_detailing can hallucinate texture",
    ]

    def get_status(self) -> ToolStatus:
        return ToolStatus.AVAILABLE if magnific.api_key() else ToolStatus.UNAVAILABLE

    def status_path(self, task_id: str) -> str:
        return f"{self.submit_path}/{task_id}"

    def estimate_cost(self, inputs: dict[str, Any]) -> float:
        return COST_BY_RESOLUTION.get(inputs.get("resolution", "2k"), 0.06)

    def _resolve_aspect_ratio(self, value: Any) -> str:
        if value is None:
            return "square_1_1"
        text = str(value)
        if text in ASPECT_ALIASES:
            return ASPECT_ALIASES[text]
        return magnific.require_enum("aspect_ratio", text, ASPECT_RATIOS)

    def build_payload(self, inputs: dict[str, Any]) -> dict[str, Any]:
        """Translate tool inputs into the documented Mystic request body."""
        payload: dict[str, Any] = {
            "prompt": inputs["prompt"],
            "model": magnific.require_enum("model", inputs.get("model", "realism"), MODELS),
            "resolution": magnific.require_enum(
                "resolution", inputs.get("resolution", "2k"), RESOLUTIONS
            ),
            "aspect_ratio": self._resolve_aspect_ratio(inputs.get("aspect_ratio")),
            "creative_detailing": magnific.require_range(
                "creative_detailing", inputs.get("creative_detailing", 33), 0, 100
            ),
            "engine": magnific.require_enum(
                "engine", inputs.get("engine", "automatic"), ENGINES
            ),
            "filter_nsfw": bool(inputs.get("filter_nsfw", True)),
        }

        if inputs.get("fixed_generation"):
            payload["fixed_generation"] = True

        # Magnific accepts a URL or base64 for either reference, and documents the
        # URL as the higher-fidelity path. Prefer it when the caller supplies one.
        style_reference = inputs.get("style_reference_url") or (
            magnific.encode_image(inputs["style_reference_path"])
            if inputs.get("style_reference_path")
            else None
        )
        if style_reference:
            payload["style_reference"] = style_reference
            payload["adherence"] = magnific.require_range(
                "adherence", inputs.get("adherence", 50), 0, 100
            )
            payload["hdr"] = magnific.require_range("hdr", inputs.get("hdr", 50), 0, 100)

        structure_reference = inputs.get("structure_reference_url") or (
            magnific.encode_image(inputs["structure_reference_path"])
            if inputs.get("structure_reference_path")
            else None
        )
        if structure_reference:
            payload["structure_reference"] = structure_reference
            payload["structure_strength"] = magnific.require_range(
                "structure_strength", inputs.get("structure_strength", 50), 0, 100
            )

        if inputs.get("styling"):
            payload["styling"] = inputs["styling"]
        if inputs.get("webhook_url"):
            payload["webhook_url"] = inputs["webhook_url"]

        return payload

    def execute(self, inputs: dict[str, Any]) -> ToolResult:
        key = magnific.api_key()
        if not key:
            return ToolResult(success=False, error="No MAGNIFIC_API_KEY found. " + self.install_instructions)

        start = time.time()
        try:
            payload = self.build_payload(inputs)
        except (ValueError, FileNotFoundError) as exc:
            return ToolResult(success=False, error=f"Invalid Mystic request: {exc}")

        output_path = Path(inputs.get("output_path", "magnific_mystic.png"))
        try:
            task_id = magnific.submit_task(f"{self.api_base}{self.submit_path}", key, payload)
            urls = magnific.poll_task(
                f"{self.api_base}{self.status_path(task_id)}",
                key,
                timeout_seconds=inputs.get("poll_timeout_seconds", 300),
            )
            magnific.download(urls[0], output_path)
        except magnific.MagnificError as exc:
            return ToolResult(success=False, error=str(exc))
        except Exception as exc:  # network, HTTP, disk
            return ToolResult(success=False, error=f"Mystic generation failed: {exc}")

        return ToolResult(
            success=True,
            data={
                "provider": "magnific",
                "model": payload["model"],
                "engine": payload["engine"],
                "resolution": payload["resolution"],
                "aspect_ratio": payload["aspect_ratio"],
                "prompt": payload["prompt"],
                "task_id": task_id,
                "output": str(output_path),
                "source_url": urls[0],
            },
            artifacts=[str(output_path)],
            cost_usd=self.estimate_cost(inputs),
            duration_seconds=round(time.time() - start, 2),
            model=f"magnific/mystic:{payload['model']}",
        )
