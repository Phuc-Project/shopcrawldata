from __future__ import annotations

from typing import Iterable

import pandas as pd

from .schema import UnifiedListing


def dedupe_listings(listings: Iterable[UnifiedListing]) -> list[UnifiedListing]:
    seen: set[str] = set()
    out: list[UnifiedListing] = []
    for item in listings:
        fp = item.fingerprint()
        if fp in seen:
            continue
        seen.add(fp)
        out.append(item)
    return out


def listings_to_frame(listings: Iterable[UnifiedListing | dict]) -> pd.DataFrame:
    rows = []
    for item in listings:
        if isinstance(item, UnifiedListing):
            rows.append(item.model_dump(mode="json"))
        else:
            rows.append(item)
    if not rows:
        return pd.DataFrame()
    return pd.DataFrame(rows)
