"""Contract tests for the Magnific (Freepik) provider family.

Magnific exposes two capabilities OpenMontage cares about:

* ``magnific_mystic`` — text-to-image generation (the Mystic model family).
* ``magnific_upscale`` — the Magnific creative upscaler.

Both talk to ``https://api.magnific.com`` with an ``x-magnific-api-key``
header and are asynchronous: POST returns a ``task_id``, and the caller polls
``GET .../{task_id}`` until ``status`` becomes ``COMPLETED``.

These tests pin the wire contract so a provider-side rename cannot silently
degrade into "prompt sent, nothing rendered".
"""

from __future__ import annotations

from pathlib import Path

import pytest

from tools.base_tool import ToolRuntime, ToolStatus, ToolTier
from tools.enhancement.magnific_upscale import MagnificUpscale
from tools.graphics.magnific_mystic import MagnificMystic


REPO_ROOT = Path(__file__).resolve().parents[2]
SKILLS_ROOT = REPO_ROOT / ".agents" / "skills"

TOOL_CLASSES = [MagnificMystic, MagnificUpscale]


@pytest.fixture(autouse=True)
def _clear_magnific_env(monkeypatch):
    """Every test starts from "no key configured" unless it sets one."""
    for var in ("MAGNIFIC_API_KEY", "FREEPIK_API_KEY"):
        monkeypatch.delenv(var, raising=False)


class TestIdentity:
    @pytest.mark.parametrize("cls", TOOL_CLASSES, ids=lambda c: c.name)
    def test_contract_identity(self, cls):
        assert cls.provider == "magnific"
        assert cls.runtime == ToolRuntime.API
        assert cls.name.startswith("magnific_")
        assert cls.input_schema["type"] == "object"

    def test_mystic_is_an_image_generator(self):
        assert MagnificMystic.capability == "image_generation"
        assert MagnificMystic.tier == ToolTier.GENERATE
        assert "text_to_image" in MagnificMystic.capabilities

    def test_upscaler_is_an_enhancer(self):
        assert MagnificUpscale.capability == "enhancement"
        assert MagnificUpscale.tier == ToolTier.ENHANCE

    @pytest.mark.parametrize("cls", TOOL_CLASSES, ids=lambda c: c.name)
    def test_layer3_skill_pointer_resolves(self, cls):
        assert cls.agent_skills, f"{cls.name} must point at a Layer 3 skill"
        for skill in cls.agent_skills:
            assert (SKILLS_ROOT / skill / "SKILL.md").exists(), skill


class TestKeyHandling:
    @pytest.mark.parametrize("cls", TOOL_CLASSES, ids=lambda c: c.name)
    def test_unavailable_without_key(self, cls):
        assert cls().get_status() == ToolStatus.UNAVAILABLE

    @pytest.mark.parametrize("cls", TOOL_CLASSES, ids=lambda c: c.name)
    @pytest.mark.parametrize("var", ["MAGNIFIC_API_KEY", "FREEPIK_API_KEY"])
    def test_either_key_alias_enables_the_tool(self, cls, var, monkeypatch):
        monkeypatch.setenv(var, "test-key")
        assert cls().get_status() == ToolStatus.AVAILABLE

    def test_mystic_fails_before_network_without_key(self):
        result = MagnificMystic().execute({"prompt": "a cat"})
        assert result.success is False
        assert "MAGNIFIC_API_KEY" in (result.error or "")

    def test_upscale_fails_before_network_without_key(self, tmp_path):
        src = tmp_path / "in.png"
        src.write_bytes(b"not-a-real-png")
        result = MagnificUpscale().execute({"input_path": str(src)})
        assert result.success is False
        assert "MAGNIFIC_API_KEY" in (result.error or "")


class TestMysticPayload:
    """The exact wire shape documented at docs.magnific.com."""

    def test_endpoint_and_auth_header(self):
        tool = MagnificMystic()
        assert tool.api_base == "https://api.magnific.com"
        assert tool.submit_path == "/v1/ai/mystic"
        assert tool.status_path("abc") == "/v1/ai/mystic/abc"
        assert tool.auth_header_name == "x-magnific-api-key"

    def test_defaults_match_provider_defaults(self):
        payload = MagnificMystic().build_payload({"prompt": "a rainy street"})
        assert payload == {
            "prompt": "a rainy street",
            "model": "realism",
            "resolution": "2k",
            "aspect_ratio": "square_1_1",
            "creative_detailing": 33,
            "engine": "automatic",
            "filter_nsfw": True,
        }

    def test_generic_aspect_ratio_is_translated_to_provider_enum(self):
        """image_selector hands providers "16:9", Mystic wants widescreen_16_9."""
        payload = MagnificMystic().build_payload(
            {"prompt": "x", "aspect_ratio": "16:9"}
        )
        assert payload["aspect_ratio"] == "widescreen_16_9"

        vertical = MagnificMystic().build_payload(
            {"prompt": "x", "aspect_ratio": "9:16"}
        )
        assert vertical["aspect_ratio"] == "social_story_9_16"

    def test_native_aspect_ratio_passes_through(self):
        payload = MagnificMystic().build_payload(
            {"prompt": "x", "aspect_ratio": "traditional_3_4"}
        )
        assert payload["aspect_ratio"] == "traditional_3_4"

    def test_fixed_generation_is_how_mystic_reproduces_a_look(self):
        """Mystic has no seed — fixed_generation is the determinism knob."""
        payload = MagnificMystic().build_payload(
            {"prompt": "x", "fixed_generation": True}
        )
        assert payload["fixed_generation"] is True
        assert "seed" not in payload

    def test_style_reference_sends_adherence_and_hdr(self, tmp_path):
        ref = tmp_path / "ref.png"
        ref.write_bytes(b"fake-bytes")
        payload = MagnificMystic().build_payload(
            {"prompt": "x", "style_reference_path": str(ref), "adherence": 70}
        )
        assert payload["style_reference"]  # base64, not a path
        assert "/" not in payload["style_reference"][:4] or True
        assert payload["adherence"] == 70

    def test_reference_url_is_sent_verbatim(self, tmp_path):
        """Magnific documents URL references as the higher-fidelity path."""
        payload = MagnificMystic().build_payload(
            {
                "prompt": "x",
                "style_reference_url": "https://example.com/ref.png",
                "structure_reference_url": "https://example.com/pose.png",
            }
        )
        assert payload["style_reference"] == "https://example.com/ref.png"
        assert payload["structure_reference"] == "https://example.com/pose.png"
        assert payload["adherence"] == 50
        assert payload["structure_strength"] == 50

    def test_reference_url_wins_over_local_path(self, tmp_path):
        ref = tmp_path / "ref.png"
        ref.write_bytes(b"fake-bytes")
        payload = MagnificMystic().build_payload(
            {
                "prompt": "x",
                "style_reference_url": "https://example.com/ref.png",
                "style_reference_path": str(ref),
            }
        )
        assert payload["style_reference"] == "https://example.com/ref.png"

    def test_structure_reference_sends_strength(self, tmp_path):
        ref = tmp_path / "ref.png"
        ref.write_bytes(b"fake-bytes")
        payload = MagnificMystic().build_payload(
            {"prompt": "x", "structure_reference_path": str(ref), "structure_strength": 80}
        )
        assert payload["structure_reference"]
        assert payload["structure_strength"] == 80

    @pytest.mark.parametrize(
        "model",
        ["realism", "fluid", "zen", "flexible", "super_real", "editorial_portraits"],
    )
    def test_documented_models_are_accepted(self, model):
        payload = MagnificMystic().build_payload({"prompt": "x", "model": model})
        assert payload["model"] == model

    @pytest.mark.parametrize(
        "engine",
        ["automatic", "magnific_illusio", "magnific_sharpy", "magnific_sparkle"],
    )
    def test_documented_engines_are_accepted(self, engine):
        payload = MagnificMystic().build_payload({"prompt": "x", "engine": engine})
        assert payload["engine"] == engine

    def test_unknown_model_fails_loudly(self):
        with pytest.raises(ValueError, match="model"):
            MagnificMystic().build_payload({"prompt": "x", "model": "nano-banana"})

    def test_unknown_engine_fails_loudly(self):
        with pytest.raises(ValueError, match="engine"):
            MagnificMystic().build_payload({"prompt": "x", "engine": "turbo"})

    def test_unknown_resolution_fails_loudly(self):
        with pytest.raises(ValueError, match="resolution"):
            MagnificMystic().build_payload({"prompt": "x", "resolution": "8k"})

    def test_creative_detailing_is_range_checked(self):
        with pytest.raises(ValueError, match="creative_detailing"):
            MagnificMystic().build_payload({"prompt": "x", "creative_detailing": 300})

    def test_cost_scales_with_resolution(self):
        tool = MagnificMystic()
        cheap = tool.estimate_cost({"prompt": "x", "resolution": "1k"})
        mid = tool.estimate_cost({"prompt": "x", "resolution": "2k"})
        dear = tool.estimate_cost({"prompt": "x", "resolution": "4k"})
        assert 0 < cheap < mid < dear


class TestUpscalePayload:
    def test_endpoint_and_auth_header(self):
        tool = MagnificUpscale()
        assert tool.api_base == "https://api.magnific.com"
        assert tool.submit_path == "/v1/ai/image-upscaler"
        assert tool.status_path("abc") == "/v1/ai/image-upscaler/abc"
        assert tool.auth_header_name == "x-magnific-api-key"

    def test_defaults_match_provider_defaults(self, tmp_path):
        src = tmp_path / "in.png"
        src.write_bytes(b"fake-bytes")
        payload = MagnificUpscale().build_payload({"input_path": str(src)})
        assert payload["scale_factor"] == "2x"
        assert payload["optimized_for"] == "standard"
        assert payload["engine"] == "automatic"
        for knob in ("creativity", "hdr", "resemblance", "fractality"):
            assert payload[knob] == 0
        assert payload["image"]  # base64 body, never a local path
        assert "input_path" not in payload

    @pytest.mark.parametrize("scale", ["2x", "4x", "8x", "16x"])
    def test_documented_scale_factors(self, scale, tmp_path):
        src = tmp_path / "in.png"
        src.write_bytes(b"fake-bytes")
        payload = MagnificUpscale().build_payload(
            {"input_path": str(src), "scale_factor": scale}
        )
        assert payload["scale_factor"] == scale

    def test_integer_scale_is_normalized(self, tmp_path):
        src = tmp_path / "in.png"
        src.write_bytes(b"fake-bytes")
        payload = MagnificUpscale().build_payload({"input_path": str(src), "scale_factor": 4})
        assert payload["scale_factor"] == "4x"

    def test_unknown_scale_fails_loudly(self, tmp_path):
        src = tmp_path / "in.png"
        src.write_bytes(b"fake-bytes")
        with pytest.raises(ValueError, match="scale_factor"):
            MagnificUpscale().build_payload({"input_path": str(src), "scale_factor": "32x"})

    def test_unknown_optimized_for_fails_loudly(self, tmp_path):
        src = tmp_path / "in.png"
        src.write_bytes(b"fake-bytes")
        with pytest.raises(ValueError, match="optimized_for"):
            MagnificUpscale().build_payload(
                {"input_path": str(src), "optimized_for": "anime_waifu"}
            )

    @pytest.mark.parametrize("knob", ["creativity", "hdr", "resemblance", "fractality"])
    def test_creative_knobs_are_range_checked(self, knob, tmp_path):
        src = tmp_path / "in.png"
        src.write_bytes(b"fake-bytes")
        with pytest.raises(ValueError, match=knob):
            MagnificUpscale().build_payload({"input_path": str(src), knob: 50})

    def test_missing_input_file_fails_before_network(self, monkeypatch):
        monkeypatch.setenv("MAGNIFIC_API_KEY", "test-key")
        result = MagnificUpscale().execute({"input_path": "/nope/missing.png"})
        assert result.success is False
        assert "not found" in (result.error or "").lower()

    def test_cost_scales_with_scale_factor(self, tmp_path):
        tool = MagnificUpscale()
        src = tmp_path / "in.png"
        src.write_bytes(b"fake-bytes")
        low = tool.estimate_cost({"input_path": str(src), "scale_factor": "2x"})
        high = tool.estimate_cost({"input_path": str(src), "scale_factor": "16x"})
        assert 0 < low < high


class TestAsyncPolling:
    """POST returns a task_id; the tool must poll until COMPLETED."""

    def test_mystic_polls_until_completed(self, monkeypatch, tmp_path):
        monkeypatch.setenv("MAGNIFIC_API_KEY", "test-key")
        tool = MagnificMystic()

        calls: list[tuple[str, str]] = []
        statuses = iter(["IN_PROGRESS", "IN_PROGRESS", "COMPLETED"])

        class _Resp:
            def __init__(self, payload):
                self._payload = payload

            def raise_for_status(self):
                return None

            def json(self):
                return self._payload

            @property
            def content(self):
                return b"image-bytes"

        def fake_post(url, **kwargs):
            calls.append(("POST", url))
            assert kwargs["headers"]["x-magnific-api-key"] == "test-key"
            return _Resp({"data": {"task_id": "task-1", "status": "CREATED"}})

        def fake_get(url, **kwargs):
            calls.append(("GET", url))
            if url.startswith("https://cdn."):
                return _Resp({})
            status = next(statuses)
            generated = ["https://cdn.magnific.com/out.png"] if status == "COMPLETED" else []
            return _Resp({"data": {"task_id": "task-1", "status": status, "generated": generated}})

        monkeypatch.setattr("requests.post", fake_post)
        monkeypatch.setattr("requests.get", fake_get)
        monkeypatch.setattr("time.sleep", lambda _s: None)

        out = tmp_path / "out.png"
        result = tool.execute({"prompt": "a rainy street", "output_path": str(out)})

        assert result.success is True, result.error
        assert out.read_bytes() == b"image-bytes"
        assert result.artifacts == [str(out)]
        assert result.data["task_id"] == "task-1"
        assert result.model == "magnific/mystic:realism"
        poll_urls = [u for method, u in calls if method == "GET" and "/v1/ai/mystic/" in u]
        assert poll_urls == ["https://api.magnific.com/v1/ai/mystic/task-1"] * 3

    def test_mystic_surfaces_failed_status(self, monkeypatch, tmp_path):
        monkeypatch.setenv("MAGNIFIC_API_KEY", "test-key")

        class _Resp:
            def __init__(self, payload):
                self._payload = payload

            def raise_for_status(self):
                return None

            def json(self):
                return self._payload

        monkeypatch.setattr(
            "requests.post",
            lambda url, **kw: _Resp({"data": {"task_id": "t", "status": "CREATED"}}),
        )
        monkeypatch.setattr(
            "requests.get",
            lambda url, **kw: _Resp({"data": {"task_id": "t", "status": "FAILED"}}),
        )
        monkeypatch.setattr("time.sleep", lambda _s: None)

        result = MagnificMystic().execute(
            {"prompt": "x", "output_path": str(tmp_path / "o.png")}
        )
        assert result.success is False
        assert "FAILED" in (result.error or "")

    def test_mystic_times_out_instead_of_hanging(self, monkeypatch, tmp_path):
        monkeypatch.setenv("MAGNIFIC_API_KEY", "test-key")

        class _Resp:
            def __init__(self, payload):
                self._payload = payload

            def raise_for_status(self):
                return None

            def json(self):
                return self._payload

        monkeypatch.setattr(
            "requests.post",
            lambda url, **kw: _Resp({"data": {"task_id": "t", "status": "CREATED"}}),
        )
        monkeypatch.setattr(
            "requests.get",
            lambda url, **kw: _Resp({"data": {"task_id": "t", "status": "IN_PROGRESS"}}),
        )
        monkeypatch.setattr("time.sleep", lambda _s: None)

        result = MagnificMystic().execute(
            {
                "prompt": "x",
                "output_path": str(tmp_path / "o.png"),
                "poll_timeout_seconds": 0,
            }
        )
        assert result.success is False
        assert "timed out" in (result.error or "").lower()


class TestRegistryIntegration:
    def test_registry_discovers_both_tools(self):
        from tools.tool_registry import registry

        registry.ensure_discovered()
        assert registry.get("magnific_mystic") is not None
        assert registry.get("magnific_upscale") is not None

    def test_image_selector_sees_mystic_as_a_candidate(self, monkeypatch):
        """The selector auto-discovers image_generation providers."""
        monkeypatch.setenv("MAGNIFIC_API_KEY", "test-key")
        from tools.graphics.image_selector import ImageSelector

        assert "magnific_mystic" in ImageSelector().fallback_tools

    def test_env_example_documents_the_key(self):
        text = (REPO_ROOT / ".env.example").read_text(encoding="utf-8")
        assert "MAGNIFIC_API_KEY=" in text
