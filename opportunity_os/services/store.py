"""In-memory / JSONL opportunity store for MVP API."""

from __future__ import annotations

from pathlib import Path
from typing import Any

from opportunity_os.normalize.schema import OpportunityFeatures, UnifiedListing
from opportunity_os.utils.config import load_settings, root_path
from opportunity_os.utils.io import load_json, load_jsonl


class DataStore:
    def __init__(self) -> None:
        self.settings = load_settings()
        self.root = root_path()
        self._opportunities: list[dict[str, Any]] = []
        self._listings: list[dict[str, Any]] = []
        self.reload()

    def reload(self) -> None:
        paths = self.settings.get("paths") or {}
        feat = self.root / paths.get("features", "data/features") / "opportunities.jsonl"
        norm = self.root / paths.get("normalized", "data/normalized") / "listings_enriched.jsonl"
        self._opportunities = load_jsonl(feat) if feat.exists() else []
        self._listings = load_jsonl(norm) if norm.exists() else []

    @property
    def opportunities(self) -> list[dict[str, Any]]:
        return self._opportunities

    @property
    def listings(self) -> list[dict[str, Any]]:
        return self._listings

    def list_opportunities(
        self,
        *,
        min_score: float | None = None,
        recommendation: str | None = None,
        q: str | None = None,
        material: str | None = None,
        limit: int = 50,
    ) -> list[dict[str, Any]]:
        rows = list(self._opportunities)
        if min_score is not None:
            rows = [r for r in rows if float(r.get("opportunity_score") or 0) >= min_score]
        if recommendation:
            rows = [
                r
                for r in rows
                if str(r.get("recommendation", "")).upper() == recommendation.upper()
            ]
        if q:
            ql = q.lower()
            rows = [
                r
                for r in rows
                if ql in str(r.get("product_type", "")).lower()
                or ql in str(r.get("niche", "")).lower()
                or ql in str(r.get("key", "")).lower()
                or any(ql in str(t).lower() for t in (r.get("sample_titles") or []))
            ]
        if material:
            ml = material.lower()
            rows = [
                r
                for r in rows
                if ml in str(r.get("product_type", "")).lower()
                or ml in str(r.get("matched_printway_sku", "")).lower()
            ]
        rows.sort(key=lambda r: float(r.get("opportunity_score") or 0), reverse=True)
        return rows[:limit]

    def get_opportunity(self, key: str) -> dict[str, Any] | None:
        for r in self._opportunities:
            if r.get("key") == key or r.get("key", "").replace("|", "_") == key:
                return r
        # fuzzy by product_type
        for r in self._opportunities:
            if key.lower() in str(r.get("product_type", "")).lower():
                return r
        return None

    def printway_catalog(self) -> list[dict[str, Any]]:
        paths = self.settings.get("paths") or {}
        p = self.root / paths.get("printway_catalog", "data/printway/catalog.json")
        if p.exists():
            return load_json(p)
        return []


_STORE: DataStore | None = None


def get_store() -> DataStore:
    global _STORE
    if _STORE is None:
        _STORE = DataStore()
    return _STORE
