"""Lazada Open Platform (seller) + public payload parser helpers."""

from __future__ import annotations

import hashlib
import hmac
import json
import time
from typing import Any
from urllib.parse import quote, urlencode

from opportunity_os.connectors.base import BaseConnector
from opportunity_os.normalize.schema import Marketplace, UnifiedListing


class LazadaOpenConnector(BaseConnector):
    """
    Env:
      LAZADA_APP_KEY / LAZADA_APP_SECRET / LAZADA_ACCESS_TOKEN
      LAZADA_BASE (default https://api.lazada.vn/rest)
    """

    source = "lazada"

    def __init__(
        self,
        *,
        app_key: str | None = None,
        app_secret: str | None = None,
        access_token: str | None = None,
        base: str | None = None,
        rps: float = 2.0,
    ) -> None:
        super().__init__(rps=rps)
        self.app_key = app_key or self.env("LAZADA_APP_KEY") or ""
        self.app_secret = app_secret or self.env("LAZADA_APP_SECRET") or ""
        self.access_token = access_token or self.env("LAZADA_ACCESS_TOKEN") or ""
        self.base = (base or self.env("LAZADA_BASE") or "https://api.lazada.vn/rest").rstrip("/")

    def search(self, query: str, *, limit: int = 50) -> list[UnifiedListing]:
        """Seller product search via /products/get — not marketplace-wide."""
        if not self._ready():
            raise RuntimeError("Set LAZADA_APP_KEY, LAZADA_APP_SECRET, LAZADA_ACCESS_TOKEN")
        data = self._call(
            "/products/get",
            {
                "filter": "all",
                "search": query,
                "offset": "0",
                "limit": str(min(limit, 50)),
            },
        )
        products = ((data.get("data") or {}).get("products") or [])
        return [self._map_product(p) for p in products]

    def category_tree(self) -> Any:
        if not self._ready():
            raise RuntimeError("Lazada credentials missing")
        return self._call("/category/tree/get", {})

    def _map_product(self, p: dict[str, Any]) -> UnifiedListing:
        attrs = p.get("attributes") or {}
        name = attrs.get("name") or attrs.get("name_en") or str(p.get("item_id") or "item")
        skus = p.get("skus") or []
        price = None
        currency = "VND"
        if skus:
            price = _f(skus[0].get("price") or skus[0].get("special_price"))
        images = []
        for s in skus[:1]:
            for im in s.get("Images") or s.get("images") or []:
                images.append(im)
        return UnifiedListing(
            source=Marketplace.LAZADA,
            source_id=str(p.get("item_id") or p.get("spu_id") or name),
            title=name,
            price=price,
            currency=currency,
            category_path=[str(p.get("primary_category"))] if p.get("primary_category") else [],
            images=images,
            raw={"open_api": True},
        )

    def _ready(self) -> bool:
        return bool(self.app_key and self.app_secret and self.access_token)

    def _call(self, api_path: str, params: dict[str, str]) -> dict[str, Any]:
        # Lazop sign: uppercase HMAC-SHA256 of secret + sorted system+biz params path
        ts = str(int(time.time() * 1000))
        sys_params = {
            "app_key": self.app_key,
            "timestamp": ts,
            "access_token": self.access_token,
            "sign_method": "sha256",
        }
        all_params = {**sys_params, **params}
        base = api_path + "".join(f"{k}{all_params[k]}" for k in sorted(all_params))
        sign = hmac.new(
            self.app_secret.encode("utf-8"),
            base.encode("utf-8"),
            hashlib.sha256,
        ).hexdigest().upper()
        all_params["sign"] = sign
        url = f"{self.base}{api_path}?{urlencode(all_params)}"
        r = self.get(url)
        r.raise_for_status()
        return r.json()


class LazadaPublicHelper:
    """Parse saved Lazada search JSON (from HAR) into UnifiedListing."""

    @staticmethod
    def parse_search_payload(
        payload: dict[str, Any],
        *,
        query: str | None = None,
        currency: str = "VND",
    ) -> list[UnifiedListing]:
        # Common shapes: mods.listItems / data.products / listItems
        items = (
            ((payload.get("mods") or {}).get("listItems"))
            or ((payload.get("data") or {}).get("products"))
            or payload.get("listItems")
            or []
        )
        out: list[UnifiedListing] = []
        for it in items:
            item_id = str(it.get("itemId") or it.get("nid") or it.get("id") or "")
            name = it.get("name") or it.get("title") or item_id
            if not item_id or not name:
                continue
            price = _f(it.get("price") or it.get("priceShow") or it.get("skuPriceSum"))
            # priceShow sometimes "₫123.000"
            if price is None and isinstance(it.get("priceShow"), str):
                digits = "".join(c for c in it["priceShow"] if c.isdigit() or c == ".")
                price = _f(digits.replace(".", "")) if digits else None
            out.append(
                UnifiedListing(
                    source=Marketplace.LAZADA,
                    source_id=item_id,
                    url=it.get("itemUrl") or it.get("productUrl"),
                    title=name,
                    price=price,
                    currency=currency,
                    reviews=_f(it.get("review") or it.get("itemRating") or it.get("ratingScore")),
                    rating=_f(it.get("ratingScore")),
                    sales_estimate=_f(it.get("itemSoldCntShow") or it.get("sold") or it.get("volume")),
                    shop=it.get("sellerName") or it.get("brandName"),
                    query=query,
                    images=[it.get("image")] if it.get("image") else [],
                    raw={"from": "lazada_search"},
                )
            )
        return out


def _f(v: Any) -> float | None:
    if v is None:
        return None
    if isinstance(v, str):
        v = v.replace(",", "").replace("₫", "").strip()
        # "1.2k sold" etc
        m = None
        try:
            if v.lower().endswith("k"):
                return float(v[:-1]) * 1000
            return float("".join(ch for ch in v if ch.isdigit() or ch == "."))
        except ValueError:
            return None
    try:
        return float(v)
    except (TypeError, ValueError):
        return None
