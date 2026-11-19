"""AliExpress Affiliate API connector."""

from __future__ import annotations

import hashlib
import time
from datetime import datetime, timezone, timedelta
from typing import Any
from urllib.parse import urlencode

from opportunity_os.connectors.base import BaseConnector
from opportunity_os.normalize.schema import Marketplace, UnifiedListing

# China timezone for TOP timestamp
_CST = timezone(timedelta(hours=8))


class AliExpressAffiliateConnector(BaseConnector):
    """
    Env:
      AE_APP_KEY / AE_APP_SECRET
      AE_TRACKING_ID (optional)
      AE_GATEWAY (default https://eco.taobao.com/router/rest)
    """

    source = "aliexpress"

    def __init__(
        self,
        *,
        app_key: str | None = None,
        app_secret: str | None = None,
        tracking_id: str | None = None,
        gateway: str | None = None,
        rps: float = 2.0,
    ) -> None:
        super().__init__(rps=rps)
        self.app_key = app_key or self.env("AE_APP_KEY")
        self.app_secret = app_secret or self.env("AE_APP_SECRET")
        self.tracking_id = tracking_id or self.env("AE_TRACKING_ID")
        self.gateway = gateway or self.env("AE_GATEWAY") or "https://eco.taobao.com/router/rest"

    def _ready(self) -> bool:
        return bool(self.app_key and self.app_secret)

    def search(self, query: str, *, limit: int = 50) -> list[UnifiedListing]:
        if not self._ready():
            raise RuntimeError("Set AE_APP_KEY and AE_APP_SECRET")
        page_size = max(1, min(int(limit), 50))
        params = {
            "keywords": query,
            "page_no": "1",
            "page_size": str(page_size),
            "sort": "LAST_VOLUME_DESC",
            "target_currency": "USD",
            "target_language": "EN",
            "fields": (
                "commission_rate,sale_price,lastest_volume,evaluate_rate,"
                "product_title,product_id,product_main_image_url,"
                "first_level_category_name,second_level_category_name,shop_id,"
                "product_detail_url,original_price"
            ),
        }
        if self.tracking_id:
            params["tracking_id"] = self.tracking_id
        data = self._call("aliexpress.affiliate.product.query", params)
        products = _dig_products(data)
        return [self._map(p, query=query) for p in products]

    def hot_products(self, *, keywords: str | None = None, limit: int = 50) -> list[UnifiedListing]:
        if not self._ready():
            raise RuntimeError("Set AE_APP_KEY and AE_APP_SECRET")
        params = {
            "page_no": "1",
            "page_size": str(max(1, min(limit, 50))),
            "sort": "LAST_VOLUME_DESC",
            "target_currency": "USD",
            "target_language": "EN",
        }
        if keywords:
            params["keywords"] = keywords
        data = self._call("aliexpress.affiliate.hotproduct.query", params)
        products = _dig_products(data)
        return [self._map(p, query=keywords) for p in products]

    def product_detail(self, product_ids: list[str]) -> list[UnifiedListing]:
        if not self._ready():
            raise RuntimeError("Set AE_APP_KEY and AE_APP_SECRET")
        params = {
            "product_ids": ",".join(product_ids[:50]),
            "target_currency": "USD",
            "target_language": "EN",
        }
        if self.tracking_id:
            params["tracking_id"] = self.tracking_id
        data = self._call("aliexpress.affiliate.productdetail.get", params)
        products = _dig_products(data)
        return [self._map(p) for p in products]

    def _map(self, p: dict[str, Any], query: str | None = None) -> UnifiedListing:
        pid = str(p.get("product_id") or p.get("productId") or "")
        title = p.get("product_title") or p.get("productTitle") or pid
        price = _num(p.get("target_sale_price") or p.get("sale_price") or p.get("salePrice"))
        currency = (
            p.get("target_sale_price_currency")
            or p.get("sale_price_currency")
            or "USD"
        )
        volume = _num(p.get("lastest_volume") or p.get("latest_volume"))
        eval_rate = p.get("evaluate_rate") or p.get("evaluateRate")
        rating = None
        if eval_rate is not None:
            s = str(eval_rate).replace("%", "")
            try:
                rating = float(s) / 20.0 if float(s) > 5 else float(s)  # 92.1% -> ~4.6
                if rating > 5:
                    rating = float(s) / 20.0
            except ValueError:
                rating = None
        cats = [
            c
            for c in [
                p.get("first_level_category_name") or p.get("firstLevelCategoryName"),
                p.get("second_level_category_name") or p.get("secondLevelCategoryName"),
            ]
            if c
        ]
        img = p.get("product_main_image_url") or p.get("productMainImageUrl")
        url = p.get("product_detail_url") or p.get("productDetailUrl")
        shop_id = p.get("shop_id") or p.get("shopId")

        return UnifiedListing(
            source=Marketplace.ALIEXPRESS,
            source_id=pid,
            url=url,
            title=title,
            price=price,
            currency=currency,
            sales_estimate=volume,
            monthly_sales=volume,
            rating=rating,
            shop_id=str(shop_id) if shop_id is not None else None,
            category_path=cats,
            images=[img] if img else [],
            query=query,
            is_personalized=bool(
                title and any(w in title.lower() for w in ("custom", "personalized"))
            ),
            raw={"affiliate": True},
        )

    def _call(self, method: str, biz: dict[str, str]) -> dict[str, Any]:
        ts = datetime.now(_CST).strftime("%Y-%m-%d %H:%M:%S")
        params = {
            "method": method,
            "app_key": self.app_key or "",
            "sign_method": "md5",
            "timestamp": ts,
            "format": "json",
            "v": "2.0",
            **biz,
        }
        params["sign"] = _sign_top(params, self.app_secret or "")
        r = self.post(
            self.gateway,
            data=params,
            headers={"Content-Type": "application/x-www-form-urlencoded;charset=utf-8"},
        )
        r.raise_for_status()
        return r.json()


def _sign_top(params: dict[str, str], secret: str) -> str:
    items = sorted((k, v) for k, v in params.items() if k != "sign" and v is not None)
    base = secret + "".join(f"{k}{v}" for k, v in items) + secret
    return hashlib.md5(base.encode("utf-8")).hexdigest().upper()


def _num(v: Any) -> float | None:
    if v is None:
        return None
    try:
        return float(v)
    except (TypeError, ValueError):
        return None


def _dig_products(data: dict[str, Any]) -> list[dict[str, Any]]:
    # Handle nested TOP response shapes
    if not isinstance(data, dict):
        return []
    for key in (
        "aliexpress_affiliate_product_query_response",
        "aliexpress_affiliate_hotproduct_query_response",
        "aliexpress_affiliate_productdetail_get_response",
    ):
        if key in data:
            data = data[key]
            break
    resp = data.get("resp_result") or data.get("result") or data
    result = resp.get("result") if isinstance(resp, dict) else None
    if result is None and isinstance(resp, dict):
        result = resp
    if not isinstance(result, dict):
        return []
    products = result.get("products") or result.get("products") or {}
    if isinstance(products, dict):
        plist = products.get("product") or products.get("products") or []
    else:
        plist = products
    if isinstance(plist, dict):
        plist = [plist]
    return list(plist or [])
