"""Shared wire helpers for the Magnific API.

Magnific is the platform formerly branded Freepik — the site now presents
itself as "Magnific (formerly Freepik)", the API lives at ``api.magnific.com``,
and the docs moved to ``docs.magnific.com``. Older ``api.freepik.com`` snippets
found in tutorials are stale. Two endpoints matter to OpenMontage:

* ``POST /v1/ai/mystic`` — Mystic text-to-image generation.
* ``POST /v1/ai/image-upscaler`` — the creative (Magnific) upscaler.

Both are asynchronous with the same envelope: the POST returns
``{"data": {"task_id": ..., "status": "CREATED"}}`` and the caller polls
``GET <submit_path>/<task_id>`` until ``status`` reaches ``COMPLETED``, at
which point ``data.generated`` holds the result URLs.

Docs: https://docs.magnific.com/api-reference/mystic/post-mystic
"""

from __future__ import annotations

import base64
import os
import time
from pathlib import Path
from typing import Any, Iterable


API_BASE = "https://api.magnific.com"
AUTH_HEADER_NAME = "x-magnific-api-key"

#: Key aliases, in precedence order. MAGNIFIC_API_KEY is the current name;
#: FREEPIK_API_KEY is accepted because the platform was branded Freepik until
#: the rename, so existing setups and older tutorials still use it.
#: Create a key at https://www.magnific.com/user/organization/api-keys
KEY_ENV_VARS = ("MAGNIFIC_API_KEY", "FREEPIK_API_KEY")

TERMINAL_OK = "COMPLETED"
TERMINAL_FAIL = "FAILED"

DEFAULT_POLL_TIMEOUT_SECONDS = 300
DEFAULT_POLL_INTERVAL_SECONDS = 3


class MagnificError(RuntimeError):
    """Raised when the Magnific API reports a task failure or times out."""


def api_key() -> str | None:
    """First configured Magnific/Freepik key, or None."""
    for var in KEY_ENV_VARS:
        value = os.environ.get(var)
        if value:
            return value
    return None


def auth_headers(key: str) -> dict[str, str]:
    return {AUTH_HEADER_NAME: key, "Content-Type": "application/json"}


def encode_image(path: str | Path) -> str:
    """Read a local image and return the base64 body Magnific expects."""
    resolved = Path(path)
    if not resolved.exists():
        raise FileNotFoundError(f"Image not found: {resolved}")
    return base64.b64encode(resolved.read_bytes()).decode("ascii")


def require_enum(field: str, value: Any, allowed: Iterable[str]) -> str:
    """Validate an enum field, naming the field in the error for the caller."""
    allowed = list(allowed)
    if value not in allowed:
        raise ValueError(
            f"Invalid {field}={value!r}. Magnific accepts: {', '.join(allowed)}"
        )
    return str(value)


def require_range(field: str, value: Any, low: int, high: int) -> int:
    """Validate an integer knob, naming the field in the error for the caller."""
    try:
        number = int(value)
    except (TypeError, ValueError) as exc:
        raise ValueError(f"Invalid {field}={value!r}: expected an integer") from exc
    if not low <= number <= high:
        raise ValueError(f"Invalid {field}={value!r}: expected {low}..{high}")
    return number


def submit_task(url: str, key: str, payload: dict[str, Any], timeout: int = 120) -> str:
    """POST a job and return its task_id."""
    import requests

    response = requests.post(url, headers=auth_headers(key), json=payload, timeout=timeout)
    response.raise_for_status()
    data = (response.json() or {}).get("data") or {}
    task_id = data.get("task_id")
    if not task_id:
        raise MagnificError(f"Magnific accepted the request but returned no task_id: {data}")
    return str(task_id)


def poll_task(
    url: str,
    key: str,
    *,
    timeout_seconds: int = DEFAULT_POLL_TIMEOUT_SECONDS,
    interval_seconds: int = DEFAULT_POLL_INTERVAL_SECONDS,
) -> list[str]:
    """Poll a task until it completes and return the generated asset URLs.

    A zero or negative ``timeout_seconds`` still performs one poll, so a caller
    can probe a task without committing to a wait.
    """
    import requests

    deadline = time.time() + max(timeout_seconds, 0)
    last_status = "UNKNOWN"

    while True:
        response = requests.get(url, headers=auth_headers(key), timeout=60)
        response.raise_for_status()
        data = (response.json() or {}).get("data") or {}
        last_status = data.get("status", "UNKNOWN")

        if last_status == TERMINAL_OK:
            generated = [u for u in (data.get("generated") or []) if u]
            if not generated:
                raise MagnificError("Magnific reported COMPLETED but returned no assets")
            return generated
        if last_status == TERMINAL_FAIL:
            raise MagnificError(f"Magnific task {last_status}: {data}")
        if time.time() >= deadline:
            raise MagnificError(
                f"Magnific task timed out after {timeout_seconds}s (last status: {last_status})"
            )

        time.sleep(interval_seconds)


def download(url: str, output_path: str | Path) -> Path:
    """Fetch a generated asset to disk."""
    import requests

    response = requests.get(url, timeout=120)
    response.raise_for_status()
    resolved = Path(output_path)
    resolved.parent.mkdir(parents=True, exist_ok=True)
    resolved.write_bytes(response.content)
    return resolved
