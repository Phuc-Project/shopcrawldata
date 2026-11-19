"""Etsy Open API v3 connector + HAR-backed offline search."""

from __future__ import annotations

from pathlib import Path
from typing import Any, Optional

from opportunity_os.connectors.base import BaseConnector
from opportunity_os.connectors.etsy_har import parse_etsy_har
from opportunity_os.normalize.schema import Marketplace, UnifiedListing


class EtsyOpenAPIConnector(BaseConnector):
    """Official Etsy Open API v3 (requires ETSY_API_KEY)."""

    source = "etsy"

    def __init__(
        self,
        api_key: str | None = None,
        *,
        base_url: str = "https://api.etsy.com/v3",
        rps: float = 5.0,
        access_token: str | None = None,
    ) -> None:
        # Docs: https://developers.etsy.com/documentation/essentials/authentication
        # x-api-key: <keystring>:<shared_secret> on EVERY request
        key = api_key or self.env("ETSY_API_KEY") or self.env("ETSY_KEYSTRING")
        token = access_token or self.env("ETSY_ACCESS_TOKEN")
        headers = {
            "Accept": "application/json",
            "User-Agent": "OpportunityOS/0.1",
        }
        if key:
            headers["x-api-key"] = key
        if token:
            headers["Authorization"] = f"Bearer {token}"
        super().__init__(rps=rps, headers=headers)
        self.base_url = base_url.rstrip("/")
        self.api_key = key
        self.access_token = token

    def _require_key(self) -> None:
        if not self.api_key:
            raise RuntimeError(
                "ETSY_API_KEY not set. Export ETSY_API_KEY=keystring:shared_secret "
                "(see https://developers.etsy.com/documentation/essentials/authentication)"
            )

    def ping(self) -> dict[str, Any]:
        """GET /application/openapi-ping — public, validates API key."""
        self._require_key()
        url = f"{self.base_url}/application/openapi-ping"
        r = self.get(url)
        r.raise_for_status()
        return r.json()

    def search(self, query: str, *, limit: int = 50) -> list[UnifiedListing]:
        self._require_key()
        limit = max(1, min(limit, 100))
        url = f"{self.base_url}/application/listings/active"
        params = {
            "keywords": query,
            "limit": limit,
            "offset": 0,
            "sort_on": "score",
            "sort_order": "desc",
        }
        r = self.get(url, params=params)
        r.raise_for_status()
        data = r.json()
        return [self._map_listing(x, query=query) for x in data.get("results") or []]

    def get_listing(self, listing_id: str | int) -> UnifiedListing | None:
        self._require_key()
        url = f"{self.base_url}/application/listings/{listing_id}"
        r = self.get(url, params={"includes": "Images,Shop"})
        if r.status_code == 404:
            return None
        r.raise_for_status()
        return self._map_listing(r.json())

    def seller_taxonomy(self) -> list[dict[str, Any]]:
        self._require_key()
        url = f"{self.base_url}/application/seller-taxonomy/nodes"
        r = self.get(url)
        r.raise_for_status()
        return (r.json() or {}).get("results") or []

    @staticmethod
    def _map_listing(item: dict[str, Any], query: str | None = None) -> UnifiedListing:
        price = None
        currency = None
        p = item.get("price") or {}
        if isinstance(p, dict) and p.get("amount") is not None and p.get("divisor"):
            try:
                price = float(p["amount"]) / float(p["divisor"])
                currency = p.get("currency_code")
            except (TypeError, ValueError, ZeroDivisionError):
                price = None

        shop = None
        shop_id = None
        shop_obj = item.get("shop") or {}
        if isinstance(shop_obj, dict):
            shop = shop_obj.get("shop_name")
            shop_id = str(shop_obj.get("shop_id") or "") or None

        images: list[str] = []
        for im in item.get("images") or []:
            if isinstance(im, dict):
                u = im.get("url_570xN") or im.get("url_fullxfull") or im.get("url_75x75")
                if u:
                    images.append(u)

        taxonomy = item.get("taxonomy_path") or []
        if isinstance(taxonomy, str):
            taxonomy = [taxonomy]

        lid = str(item.get("listing_id") or item.get("listingId") or "")
        title = item.get("title") or "Untitled"
        url = item.get("url") or (f"https://www.etsy.com/listing/{lid}" if lid else None)

        return UnifiedListing(
            source=Marketplace.ETSY,
            source_id=lid,
            url=url,
            title=title,
            description=item.get("description"),
            price=price,
            currency=currency,
            favorites=_f(item.get("num_favorers")),
            reviews=_f(item.get("num_favorers")),  # fallback proxy if no reviews field
            shop=shop,
            shop_id=shop_id,
            tags=list(item.get("tags") or []),
            category_path=list(taxonomy) if isinstance(taxonomy, list) else [],
            images=images,
            is_personalized=bool(
                item.get("is_personalizable") or item.get("is_customizable")
            ),
            query=query,
            raw={"openapi": True, "state": item.get("state")},
        )


def _f(v: Any) -> float | None:
    if v is None:
        return None
    try:
        return float(v)
    except (TypeError, ValueError):
        return None


class EtsyHARConnector(BaseConnector):
    """Offline connector: search returns listings parsed from a HAR file."""

    source = "etsy"

    def __init__(self, har_path: str | Path, **kwargs: Any) -> None:
        super().__init__(**kwargs)
        self.har_path = Path(har_path)
        self._cache: dict[str, Any] | None = None

    def load(self) -> dict[str, Any]:
        if self._cache is None:
            self._cache = parse_etsy_har(self.har_path)
        return self._cache

    def search(self, query: str, *, limit: int = 50) -> list[UnifiedListing]:
        data = self.load()
        listings: list[UnifiedListing] = list(data.get("listings") or [])
        q = (query or "").strip().lower()
        if q:
            filtered = [
                x
                for x in listings
                if q in (x.title or "").lower()
                or q in (x.query or "").lower()
                or any(q in t.lower() for t in (x.tags or []))
            ]
            # if filter empty (HAR was different query), return all
            if filtered:
                listings = filtered
        for x in listings:
            if not x.query:
                x.query = query
        return listings[:limit]

    def trending(self) -> list[dict[str, Any]]:
        return list(self.load().get("trending") or [])

    def related_queries(self) -> list[str]:
        return list(self.load().get("related_queries") or [])

    def stats(self) -> dict[str, Any]:
        return dict(self.load().get("stats") or {})
