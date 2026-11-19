#!/usr/bin/env python3
"""Run PW1 pipeline from repo root."""

from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from opportunity_os.pipeline.run import run_pipeline  # noqa: E402
from rich import print as rprint  # noqa: E402


def main() -> None:
    har = ROOT / "www.etsy.com.har"
    summary = run_pipeline(har_path=har if har.exists() else None, use_live_etsy=False)
    rprint(summary)


if __name__ == "__main__":
    main()
