"""Shopee connectors: Partner API (seller) + public search URL builder / parser."""

from __future__ import annotations

import hashlib
import hmac
import json
import time
from typing import Any
from urllib.parse import urlencode

from opportunity_os.connectors.base import BaseConnector
from opportunity_os.normalize.schema import Marketplace, UnifiedListing


class ShopeePartnerConnector(BaseConnector):
    """Seller-scoped Open Platform v2."""

    source = "shopee"

    def __init__(
        self,
        *,
        partner_id: str | None = None,
        partner_key: str | None = None,
        access_token: str | None = None,
        shop_id: str | None = None,
        base: str | None = None,
        rps: float = 2.0,
    ) -> None:
        super().__init__(rps=rps)
        self.partner_id = int(partner_id or self.env("SHOPEE_PARTNER_ID") or 0)
        self.partner_key = partner_key or self.env("SHOPEE_PARTNER_KEY") or ""
        self.access_token = access_token or self.env("SHOPEE_ACCESS_TOKEN") or ""
        self.shop_id = int(shop_id or self.env("SHOPEE_SHOP_ID") or 0)
        self.base = (base or self.env("SHOPEE_PARTNER_BASE") or "https://partner.shopeemobile.com").rstrip("/")

    def search(self, query: str, *, limit: int = 50) -> list[UnifiedListing]:
        """Search within authorized shop (not marketplace-wide)."""
        if not self._ready():
            raise RuntimeError(
                "Shopee partner credentials missing "
                "(SHOPEE_PARTNER_ID/KEY/ACCESS_TOKEN/SHOP_ID)"
            )
        path = "/api/v2/product/search_item"
        params = {
            "offset": "0",
            "page_size": str(min(limit, 100)),
            "item_name": query,
        }
        data = self._get(path, params)
        ids = (data.get("response") or {}).get("item_id_list") or []
        if not ids:
            return []
        return self.get_item_base_info(ids[:50])

    def get_item_list(self, *, offset: int = 0, page_size: int = 50) -> list[int]:
        path = "/api/v2/product/get_item_list"
        params = {
            "offset": str(offset),
            "page_size": str(page_size),
            "item_status": "NORMAL",
        }
        data = self._get(path, params)
        items = (data.get("response") or {}).get("item") or []
        return [int(x.get("item_id")) for x in items if x.get("item_id") is not None]

    def get_item_base_info(self, item_ids: list[int]) -> list[UnifiedListing]:
        path = "/api/v2/product/get_item_base_info"
        params = {"item_id_list": json.dumps(item_ids)}
        data = self._get(path, params)
        rows = (data.get("response") or {}).get("item_list") or []
        out: list[UnifiedListing] = []
        for it in rows:
            out.append(self._map_item(it))
        return out

    def _map_item(self, it: dict[str, Any]) -> UnifiedListing:
        item_id = str(it.get("item_id") or "")
        name = it.get("item_name") or item_id
        price_info = (it.get("price_info") or [{}])[0] if it.get("price_info") else {}
        price = _f(price_info.get("current_price") or price_info.get("original_price"))
        currency = price_info.get("currency") or "VND"
        images = []
        img = it.get("image") or {}
        for u in img.get("image_url_list") or []:
            images.append(u)
        return UnifiedListing(
            source=Marketplace.SHOPEE,
            source_id=item_id,
            title=name,
            description=it.get("description"),
            price=price,
            currency=currency,
            category_path=[str(it.get("category_id"))] if it.get("category_id") else [],
            images=images,
            shop_id=str(self.shop_id) if self.shop_id else None,
            raw={"partner": True},
        )

    def _ready(self) -> bool:
        return bool(self.partner_id and self.partner_key and self.access_token and self.shop_id)

    def _sign(self, path: str, timestamp: int) -> str:
        base = f"{self.partner_id}{path}{timestamp}{self.access_token}{self.shop_id}"
        return hmac.new(
            self.partner_key.encode("utf-8"),
            base.encode("utf-8"),
            hashlib.sha256,
        ).hexdigest()

    def _get(self, path: str, extra: dict[str, str]) -> dict[str, Any]:
        ts = int(time.time())
        params = {
            "partner_id": str(self.partner_id),
            "timestamp": str(ts),
            "access_token": self.access_token,
            "shop_id": str(self.shop_id),
            "sign": self._sign(path, ts),
            **extra,
        }
        url = f"{self.base}{path}?{urlencode(params)}"
        r = self.get(url)
        r.raise_for_status()
        return r.json()


class ShopeePublicSearchHelper:
    """
    Build / parse Shopee buyer search_items payloads.

    Live calls often need browser cookies + anti-bot. Use:
      - build_search_url() for HAR capture instructions
      - parse_search_items_payload() on saved JSON
    """

    @staticmethod
    def build_search_url(
        keyword: str,
        *,
        region_host: str = "shopee.vn",
        limit: int = 60,
        newest: int = 0,
        by: str = "relevancy",
        order: str = "desc",
    ) -> str:
        q = urlencode(
            {
                "by": by,
                "keyword": keyword,
                "limit": str(limit),
                "newest": str(newest),
                "order": order,
                "page_type": "search",
                "scenario": "PAGE_GLOBAL_SEARCH",
                "version": "2",
            }
        )
        return f"https://{region_host}/api/v4/search/search_items?{q}"

    @staticmethod
    def parse_search_items_payload(
        payload: dict[str, Any],
        *,
        query: str | None = None,
        currency: str = "VND",
    ) -> list[UnifiedListing]:
        items = payload.get("items") or (payload.get("data") or {}).get("items") or []
        out: list[UnifiedListing] = []
        for row in items:
            basic = row.get("item_basic") or row.get("item_basic") or row
            if "item_basic" in row:
                basic = row["item_basic"]
            item_id = str(basic.get("itemid") or basic.get("item_id") or "")
            if not item_id:
                continue
            name = basic.get("name") or item_id
            price = basic.get("price")
            if price is not None:
                # Shopee often stores price * 100000
                try:
                    pf = float(price)
                    if pf > 100000:
                        pf = pf / 100000.0
                    price = pf
                except (TypeError, ValueError):
                    price = None
            rating = None
            ir = basic.get("item_rating") or {}
            if isinstance(ir, dict):
                rating = _f(ir.get("rating_star"))
                rcount = ir.get("rating_count")
                if isinstance(rcount, list) and rcount:
                    reviews = _f(rcount[0])
                else:
                    reviews = _f(basic.get("cmt_count"))
            else:
                reviews = _f(basic.get("cmt_count"))
            shopid = basic.get("shopid") or basic.get("shop_id")
            out.append(
                UnifiedListing(
                    source=Marketplace.SHOPEE,
                    source_id=item_id,
                    url=f"https://shopee.vn/product/{shopid}/{item_id}" if shopid else None,
                    title=name,
                    price=float(price) if price is not None else None,
                    currency=currency,
                    sales_estimate=_f(basic.get("historical_sold")),
                    monthly_sales=_f(basic.get("sold")),
                    favorites=_f(basic.get("liked_count")),
                    reviews=reviews,
                    rating=rating,
                    shop_id=str(shopid) if shopid is not None else None,
                    query=query,
                    images=_shopee_images(basic),
                    raw={"from": "search_items"},
                )
            )
        return out


def _f(v: Any) -> float | None:
    if v is None:
        return None
    try:
        return float(v)
    except (TypeError, ValueError):
        return None


def _shopee_images(basic: dict[str, Any]) -> list[str]:
    imgs = []
    image = basic.get("image")
    if image:
        imgs.append(f"https://down-vn.img.susercontent.com/file/{image}")
    for im in basic.get("images") or []:
        imgs.append(f"https://down-vn.img.susercontent.com/file/{im}")
    return imgs[:8]
