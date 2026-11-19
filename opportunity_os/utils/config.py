from __future__ import annotations

from pathlib import Path
from typing import Any

import yaml


ROOT = Path(__file__).resolve().parents[2]
DEFAULT_SETTINGS = ROOT / "configs" / "settings.yaml"


def load_settings(path: str | Path | None = None) -> dict[str, Any]:
    p = Path(path) if path else DEFAULT_SETTINGS
    with p.open("r", encoding="utf-8") as f:
        data = yaml.safe_load(f) or {}
    data["_root"] = str(ROOT)
    return data


def root_path() -> Path:
    return ROOT
