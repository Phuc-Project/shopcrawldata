"""Amazon Creators API connector (SearchItems / GetItems)."""

from __future__ import annotations

import hashlib
import hmac
import json
from datetime import datetime, timezone
from typing import Any
from urllib.parse import quote

from opportunity_os.connectors.base import BaseConnector
from opportunity_os.normalize.schema import Marketplace, UnifiedListing


class AmazonCreatorsConnector(BaseConnector):
    """
    Amazon Creators API (successor to PA-API 5).

    Env:
      AMAZON_ACCESS_KEY / AMAZON_SECRET_KEY / AMAZON_PARTNER_TAG
      AMAZON_MARKETPLACE (default www.amazon.com)
      AMAZON_HOST (default webservices.amazon.com) — PA-API style host still common
      AMAZON_REGION (default us-east-1)
    """

    source = "amazon"

    def __init__(
        self,
        *,
        access_key: str | None = None,
        secret_key: str | None = None,
        partner_tag: str | None = None,
        marketplace: str | None = None,
        host: str | None = None,
        region: str | None = None,
        rps: float = 1.0,
    ) -> None:
        super().__init__(rps=rps)
        self.access_key = access_key or self.env("AMAZON_ACCESS_KEY")
        self.secret_key = secret_key or self.env("AMAZON_SECRET_KEY")
        self.partner_tag = partner_tag or self.env("AMAZON_PARTNER_TAG")
        self.marketplace = marketplace or self.env("AMAZON_MARKETPLACE") or "www.amazon.com"
        self.host = host or self.env("AMAZON_HOST") or "webservices.amazon.com"
        self.region = region or self.env("AMAZON_REGION") or "us-east-1"
        self.service = "ProductAdvertisingAPI"

    def _ready(self) -> bool:
        return bool(self.access_key and self.secret_key and self.partner_tag)

    def search(self, query: str, *, limit: int = 10) -> list[UnifiedListing]:
        if not self._ready():
            raise RuntimeError(
                "Amazon credentials missing. Set AMAZON_ACCESS_KEY, "
                "AMAZON_SECRET_KEY, AMAZON_PARTNER_TAG"
            )
        item_count = max(1, min(int(limit), 10))
        payload = {
            "Keywords": query,
            "Marketplace": self.marketplace,
            "PartnerTag": self.partner_tag,
            "PartnerType": "Associates",
            "ItemCount": item_count,
            "Resources": [
                "Images.Primary.Large",
                "ItemInfo.Title",
                "ItemInfo.Features",
                "ItemInfo.ByLineInfo",
                "ItemInfo.Classifications",
                "Offers.Listings.Price",
                "CustomerReviews.Count",
                "CustomerReviews.StarRating",
                "BrowseNodeInfo.BrowseNodes",
            ],
            "SearchIndex": "All",
        }
        data = self._signed_post("SearchItems", payload)
        items = ((data.get("SearchResult") or data.get("searchResult") or {}).get("Items")
                 or (data.get("SearchResult") or {}).get("items")
                 or [])
        # normalize key case
        if not items:
            sr = data.get("SearchResult") or data.get("searchResult") or {}
            items = sr.get("Items") or sr.get("items") or []
        return [self._map_item(it, query=query) for it in items]

    def get_items(self, asins: list[str]) -> list[UnifiedListing]:
        if not self._ready():
            raise RuntimeError("Amazon credentials missing")
        payload = {
            "ItemIds": asins[:10],
            "Marketplace": self.marketplace,
            "PartnerTag": self.partner_tag,
            "PartnerType": "Associates",
            "Resources": [
                "Images.Primary.Large",
                "ItemInfo.Title",
                "ItemInfo.Features",
                "Offers.Listings.Price",
                "CustomerReviews.Count",
                "CustomerReviews.StarRating",
            ],
        }
        data = self._signed_post("GetItems", payload)
        items = ((data.get("ItemsResult") or {}).get("Items") or [])
        return [self._map_item(it) for it in items]

    def _map_item(self, item: dict[str, Any], query: str | None = None) -> UnifiedListing:
        asin = str(item.get("ASIN") or item.get("asin") or "")
        info = item.get("ItemInfo") or item.get("itemInfo") or {}
        title_obj = info.get("Title") or info.get("title") or {}
        title = title_obj.get("DisplayValue") or title_obj.get("displayValue") or asin

        offers = item.get("Offers") or item.get("offers") or {}
        listings = offers.get("Listings") or offers.get("listings") or []
        price = None
        currency = None
        if listings:
            p = (listings[0].get("Price") or listings[0].get("price") or {})
            price = p.get("Amount") if "Amount" in p else p.get("amount")
            currency = p.get("Currency") or p.get("currency")

        reviews = item.get("CustomerReviews") or item.get("customerReviews") or {}
        rev_count = reviews.get("Count") or reviews.get("count")
        rating = reviews.get("StarRating") or reviews.get("starRating")
        if isinstance(rating, dict):
            rating = rating.get("Value") or rating.get("value")

        images = item.get("Images") or item.get("images") or {}
        primary = images.get("Primary") or images.get("primary") or {}
        large = primary.get("Large") or primary.get("large") or {}
        img = large.get("URL") or large.get("url")

        url = item.get("DetailPageURL") or item.get("detailPageURL")
        features = (info.get("Features") or info.get("features") or {}).get(
            "DisplayValues"
        ) or []

        return UnifiedListing(
            source=Marketplace.AMAZON,
            source_id=asin,
            url=url,
            title=title,
            description=" | ".join(features[:8]) if features else None,
            price=float(price) if price is not None else None,
            currency=currency,
            reviews=float(rev_count) if rev_count is not None else None,
            rating=float(rating) if rating is not None else None,
            images=[img] if img else [],
            query=query,
            is_personalized=bool(
                title and any(w in title.lower() for w in ("custom", "personalized"))
            ),
            raw={"asin": asin},
        )

    def _signed_post(self, operation: str, payload: dict[str, Any]) -> dict[str, Any]:
        # PA-API 5 style AWS SigV4 (Creators API SDKs wrap this; keep compatible)
        amz_date = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
        date_stamp = amz_date[:8]
        content = json.dumps(payload)
        target = f"com.amazon.paapi5.v1.ProductAdvertisingAPIv1.{operation}"
        headers = {
            "content-encoding": "amz-1.0",
            "content-type": "application/json; charset=utf-8",
            "host": self.host,
            "x-amz-date": amz_date,
            "x-amz-target": target,
        }
        canonical_headers = (
            f"content-encoding:amz-1.0\n"
            f"content-type:application/json; charset=utf-8\n"
            f"host:{self.host}\n"
            f"x-amz-date:{amz_date}\n"
            f"x-amz-target:{target}\n"
        )
        signed_headers = "content-encoding;content-type;host;x-amz-date;x-amz-target"
        payload_hash = hashlib.sha256(content.encode("utf-8")).hexdigest()
        canonical_request = (
            f"POST\n/paapi5/{operation.lower()}\n\n{canonical_headers}\n"
            f"{signed_headers}\n{payload_hash}"
        )
        algorithm = "AWS4-HMAC-SHA256"
        credential_scope = f"{date_stamp}/{self.region}/{self.service}/aws4_request"
        string_to_sign = (
            f"{algorithm}\n{amz_date}\n{credential_scope}\n"
            f"{hashlib.sha256(canonical_request.encode()).hexdigest()}"
        )
        signing_key = _sign_key(self.secret_key or "", date_stamp, self.region, self.service)
        signature = hmac.new(
            signing_key, string_to_sign.encode("utf-8"), hashlib.sha256
        ).hexdigest()
        headers["Authorization"] = (
            f"{algorithm} Credential={self.access_key}/{credential_scope}, "
            f"SignedHeaders={signed_headers}, Signature={signature}"
        )
        url = f"https://{self.host}/paapi5/{operation.lower()}"
        r = self.post(url, content=content.encode("utf-8"), headers=headers)
        r.raise_for_status()
        return r.json()


def _sign(key: bytes, msg: str) -> bytes:
    return hmac.new(key, msg.encode("utf-8"), hashlib.sha256).digest()


def _sign_key(secret: str, date_stamp: str, region: str, service: str) -> bytes:
    k_date = _sign(("AWS4" + secret).encode("utf-8"), date_stamp)
    k_region = _sign(k_date, region)
    k_service = _sign(k_region, service)
    return _sign(k_service, "aws4_request")
