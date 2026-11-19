"""TikTok Shop \u0026 Kalodata Open Center API connector."""

from __future__ import annotations

from typing import Any, Optional

from opportunity_os.connectors.base import BaseConnector
from opportunity_os.normalize.schema import Marketplace, UnifiedListing


class TikTokShopConnector(BaseConnector):
    """TikTok Shop / Kalodata Open Center API connector.
    
    Docs: https://www.kalodata.com/open-center/docs
    """

    source = "tiktok"

    def __init__(
        self,
        api_key: str | None = None,
        *,
        base_url: str = "https://open.kalodata.com/api/v1",
        rps: float = 5.0,
    ) -> None:
        key = api_key or self.env("TIKTOK_SHOP_KEY") or self.env("KALODATA_API_KEY")
        headers = {
            "Accept": "application/json",
            "User-Agent": "OpportunityOS/0.1 (+https://github.com/opportunity-os)",
        }
        if key:
            headers["X-Kalodata-Key"] = key
            headers["Authorization"] = f"Bearer {key}"
        super().__init__(rps=rps, headers=headers)
        self.base_url = base_url.rstrip("/")
        self.api_key = key

    def search(self, query: str, *, limit: int = 50) -> list[UnifiedListing]:
        limit = max(1, min(limit, 100))
        url = f"{self.base_url}/products/search"
        params = {"keyword": query, "limit": limit}

        if not self.api_key:
            # Fallback mock/offline generator for research & testing when API key is unconfigured
            return self._mock_search(query, limit=limit)

        try:
            res = self.get(url, params=params)
            res.raise_for_status()
            data = res.json()
            items = data.get("data", {}).get("list", [])
            out: list[UnifiedListing] = []
            for item in items[:limit]:
                out.append(
                    UnifiedListing(
                        id=str(item.get("product_id", "")),
                        title=item.get("title", ""),
                        price=float(item.get("price", 0.0)),
                        currency=item.get("currency", "USD"),
                        sales_estimate=int(item.get("sales", 0)),
                        reviews_count=int(item.get("reviews", 0)),
                        rating=float(item.get("rating", 0.0)),
                        url=item.get("url", f"https://www.tiktok.com/view/product/{item.get('product_id')}"),
                        source_marketplace=Marketplace.TIKTOK,
                        shop_name=item.get("shop_name", "TikTok Seller"),
                        raw_data=item,
                    )
                )
            return out
        except Exception as exc:
            print(f"[TikTokShop] API request error: {exc}. Falling back to sample dataset.")
            return self._mock_search(query, limit=limit)

    def _mock_search(self, query: str, *, limit: int = 50) -> list[UnifiedListing]:
        """Offline sample listings matching Printway POD search terms."""
        query_lower = query.lower()
        samples = [
            {
                "id": "tt_pod_01",
                "title": f"Trending Pet Memorial Acrylic Ornament - {query.title()}",
                "price": 18.99,
                "sales": 1420,
                "reviews": 312,
                "rating": 4.9,
                "shop": "PetLossMemories.co",
            },
            {
                "id": "tt_pod_02",
                "title": f"Viral Custom Grandpa Acrylic Ornament Gift - {query.title()}",
                "price": 17.50,
                "sales": 980,
                "reviews": 210,
                "rating": 4.8,
                "shop": "FamilyGiftsShop",
            },
            {
                "id": "tt_pod_03",
                "title": f"Personalized Garden Decor Plaque - {query.title()}",
                "price": 22.00,
                "sales": 410,
                "reviews": 85,
                "rating": 4.6,
                "shop": "GreenGardenVibes",
            },
        ]
        out: list[UnifiedListing] = []
        for s in samples[:limit]:
            out.append(
                UnifiedListing(
                    id=s["id"],
                    title=s["title"],
                    price=s["price"],
                    currency="USD",
                    sales_estimate=s["sales"],
                    reviews_count=s["reviews"],
                    rating=s["rating"],
                    url=f"https://www.tiktok.com/shop/product/{s['id']}",
                    source_marketplace=Marketplace.TIKTOK,
                    shop_name=s["shop"],
                    raw_data=s,
                )
            )
        return out
