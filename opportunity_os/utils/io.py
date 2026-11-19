from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Iterable

import orjson


def ensure_dir(path: str | Path) -> Path:
    p = Path(path)
    p.mkdir(parents=True, exist_ok=True)
    return p


def load_json(path: str | Path) -> Any:
    data = Path(path).read_bytes()
    return orjson.loads(data)


def save_json(path: str | Path, obj: Any, pretty: bool = True) -> Path:
    p = Path(path)
    ensure_dir(p.parent)
    option = orjson.OPT_INDENT_2 if pretty else 0
    p.write_bytes(orjson.dumps(obj, option=option | orjson.OPT_SERIALIZE_NUMPY))
    return p


def _jsonable(obj: Any) -> Any:
    if hasattr(obj, "model_dump"):
        return obj.model_dump(mode="json")
    if isinstance(obj, dict):
        return {str(k): _jsonable(v) for k, v in obj.items()}
    if isinstance(obj, (list, tuple)):
        return [_jsonable(v) for v in obj]
    if isinstance(obj, float):
        return float(obj)
    if isinstance(obj, int) and not isinstance(obj, bool):
        return int(obj)
    # numpy scalars
    t = type(obj).__name__
    if t in ("float32", "float64", "float16"):
        return float(obj)
    if t in ("int32", "int64", "int16", "int8", "uint8"):
        return int(obj)
    return obj


def save_jsonl(path: str | Path, rows: Iterable[Any]) -> Path:
    p = Path(path)
    ensure_dir(p.parent)
    with p.open("wb") as f:
        for row in rows:
            f.write(orjson.dumps(_jsonable(row), option=orjson.OPT_SERIALIZE_NUMPY))
            f.write(b"\n")
    return p


def load_jsonl(path: str | Path) -> list[Any]:
    p = Path(path)
    if not p.exists():
        return []
    out: list[Any] = []
    with p.open("rb") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            out.append(orjson.loads(line))
    return out


def dump_text(path: str | Path, text: str) -> Path:
    p = Path(path)
    ensure_dir(p.parent)
    p.write_text(text, encoding="utf-8")
    return p
