"""Magnific creative upscaler via the Magnific API.

Magnific is the platform formerly branded Freepik; the API is api.magnific.com.

This is the hosted counterpart to the local Real-ESRGAN ``upscale`` tool. Where
Real-ESRGAN sharpens what is already there, Magnific's creative mode invents
plausible detail guided by a prompt — the reason it is used on AI stills headed
for print or large-format video frames.

Docs: https://docs.magnific.com/api-reference/image-upscaler-creative/post-image-upscaler
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


SCALE_FACTORS = ("2x", "4x", "8x", "16x")

OPTIMIZED_FOR = (
    "standard",
    "soft_portraits",
    "hard_portraits",
    "art_n_illustration",
    "videogame_assets",
    "nature_n_landscapes",
    "films_n_photography",
    "3d_renders",
    "science_fiction_n_horror",
)

ENGINES = ("automatic", "magnific_illusio", "magnific_sharpy", "magnific_sparkle")

#: Creative knobs, all documented as -10..10 with a default of 0.
CREATIVE_KNOBS = ("creativity", "hdr", "resemblance", "fractality")

#: UNVERIFIED planning estimates in USD, by scale factor, so the cost tracker has
#: monotonic numbers to reason with. Magnific bills in pre-purchased credits and
#: publishes no public per-request rate — its pricing page requires a login, and
#: the old pay-per-usage plan is being discontinued. Confirm live rates at
#: https://www.magnific.com/api/pricing before quoting a production budget.
COST_BY_SCALE = {"2x": 0.08, "4x": 0.15, "8x": 0.30, "16x": 0.60}


class MagnificUpscale(BaseTool):
    name = "magnific_upscale"
    version = "0.1.0"
    tier = ToolTier.ENHANCE
    capability = "enhancement"
    provider = "magnific"
    stability = ToolStability.BETA
    execution_mode = ExecutionMode.SYNC  # async API, but execute() blocks until done
    determinism = Determinism.STOCHASTIC
    runtime = ToolRuntime.API

    api_base = magnific.API_BASE
    submit_path = "/v1/ai/image-upscaler"
    auth_header_name = magnific.AUTH_HEADER_NAME

    dependencies = []  # checked dynamically via env var
    install_instructions = (
        "Set MAGNIFIC_API_KEY to your Magnific API key.\n"
        "  Create one at https://www.magnific.com/user/organization/api-keys\n"
        "  FREEPIK_API_KEY is accepted as an alias (Magnific was branded Freepik)."
    )
    agent_skills = ["magnific-best-practices"]

    capabilities = ["upscale_image", "enhance_image", "creative_upscale"]
    supports = {
        "prompt_guided": True,
        "video": False,  # single images only; use the local upscale tool for video
        "offline": False,
    }
    best_for = [
        "adding real detail to AI stills, not just resolution",
        "print-size output from a 1k generation (up to 16x)",
        "rescuing soft or low-resolution source photography",
    ]
    not_good_for = [
        "video sequences (per-frame cost is prohibitive)",
        "cases where the source must not change at all — use the local upscale tool",
        "offline work",
    ]

    input_schema = {
        "type": "object",
        "required": ["input_path"],
        "properties": {
            "input_path": {
                "type": "string",
                "description": "Local source image. Max 25.3M pixels.",
            },
            "scale_factor": {
                "type": "string",
                "enum": list(SCALE_FACTORS),
                "default": "2x",
                "description": "Bare integers (2, 4, 8, 16) are normalized.",
            },
            "optimized_for": {
                "type": "string",
                "enum": list(OPTIMIZED_FOR),
                "default": "standard",
                "description": "Content preset. Pick the one matching the subject.",
            },
            "prompt": {
                "type": "string",
                "description": (
                    "Guides invented detail. For an AI image, reuse its original "
                    "generation prompt — this measurably improves the result."
                ),
            },
            "creativity": {
                "type": "integer",
                "default": 0,
                "description": "-10..10. Higher invents more; risks drifting from source.",
            },
            "hdr": {
                "type": "integer",
                "default": 0,
                "description": "-10..10. Definition and detail strength.",
            },
            "resemblance": {
                "type": "integer",
                "default": 0,
                "description": "-10..10. Higher stays closer to the original.",
            },
            "fractality": {
                "type": "integer",
                "default": 0,
                "description": "-10..10. Prompt strength and intricacy per square pixel.",
            },
            "engine": {
                "type": "string",
                "enum": list(ENGINES),
                "default": "automatic",
            },
            "filter_nsfw": {"type": "boolean", "default": False},
            "webhook_url": {"type": "string"},
            "output_path": {"type": "string", "default": "magnific_upscaled.png"},
            "poll_timeout_seconds": {"type": "integer", "default": 600},
        },
    }

    resource_profile = ResourceProfile(
        cpu_cores=1, ram_mb=512, vram_mb=0, disk_mb=500, network_required=True
    )
    retry_policy = RetryPolicy(max_retries=2, retryable_errors=["rate_limit", "timeout"])
    idempotency_key_fields = [
        "input_path",
        "scale_factor",
        "optimized_for",
        "prompt",
        "creativity",
        "hdr",
        "resemblance",
        "fractality",
        "engine",
    ]
    side_effects = ["writes image file to output_path", "calls Magnific API"]
    user_visible_verification = [
        "Compare against the source at 100% — creative mode can rewrite faces and text",
        "Confirm the output resolution matches the requested scale factor",
    ]

    def get_status(self) -> ToolStatus:
        return ToolStatus.AVAILABLE if magnific.api_key() else ToolStatus.UNAVAILABLE

    def status_path(self, task_id: str) -> str:
        return f"{self.submit_path}/{task_id}"

    def estimate_cost(self, inputs: dict[str, Any]) -> float:
        return COST_BY_SCALE.get(self._normalize_scale(inputs.get("scale_factor", "2x")), 0.08)

    @staticmethod
    def _normalize_scale(value: Any) -> str:
        """Accept 4 and "4x" alike; validation happens in build_payload."""
        text = str(value).strip().lower()
        return text if text.endswith("x") else f"{text}x"

    def build_payload(self, inputs: dict[str, Any]) -> dict[str, Any]:
        """Translate tool inputs into the documented upscaler request body."""
        payload: dict[str, Any] = {
            "image": magnific.encode_image(inputs["input_path"]),
            "scale_factor": magnific.require_enum(
                "scale_factor",
                self._normalize_scale(inputs.get("scale_factor", "2x")),
                SCALE_FACTORS,
            ),
            "optimized_for": magnific.require_enum(
                "optimized_for", inputs.get("optimized_for", "standard"), OPTIMIZED_FOR
            ),
            "engine": magnific.require_enum(
                "engine", inputs.get("engine", "automatic"), ENGINES
            ),
            "filter_nsfw": bool(inputs.get("filter_nsfw", False)),
        }

        for knob in CREATIVE_KNOBS:
            payload[knob] = magnific.require_range(knob, inputs.get(knob, 0), -10, 10)

        if inputs.get("prompt"):
            payload["prompt"] = inputs["prompt"]
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
        except FileNotFoundError as exc:
            return ToolResult(success=False, error=str(exc))
        except ValueError as exc:
            return ToolResult(success=False, error=f"Invalid upscale request: {exc}")

        output_path = Path(inputs.get("output_path", "magnific_upscaled.png"))
        try:
            task_id = magnific.submit_task(f"{self.api_base}{self.submit_path}", key, payload)
            urls = magnific.poll_task(
                f"{self.api_base}{self.status_path(task_id)}",
                key,
                timeout_seconds=inputs.get("poll_timeout_seconds", 600),
            )
            magnific.download(urls[0], output_path)
        except magnific.MagnificError as exc:
            return ToolResult(success=False, error=str(exc))
        except Exception as exc:  # network, HTTP, disk
            return ToolResult(success=False, error=f"Magnific upscale failed: {exc}")

        return ToolResult(
            success=True,
            data={
                "provider": "magnific",
                "scale_factor": payload["scale_factor"],
                "optimized_for": payload["optimized_for"],
                "engine": payload["engine"],
                "task_id": task_id,
                "input": str(inputs["input_path"]),
                "output": str(output_path),
                "source_url": urls[0],
            },
            artifacts=[str(output_path)],
            cost_usd=self.estimate_cost(inputs),
            duration_seconds=round(time.time() - start, 2),
            model=f"magnific/image-upscaler:{payload['scale_factor']}",
        )
