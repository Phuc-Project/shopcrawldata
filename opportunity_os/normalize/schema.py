from __future__ import annotations

from datetime import datetime, timezone
from enum import Enum
from typing import Any, Optional

from pydantic import BaseModel, Field, HttpUrl, field_validator


class Marketplace(str, Enum):
    ETSY = "etsy"
    AMAZON = "amazon"
    TIKTOK = "tiktok"
    SHOPEE = "shopee"
    LAZADA = "lazada"
    ALIEXPRESS = "aliexpress"
    PRINTWAY = "printway"
    OTHER = "other"


class UnifiedListing(BaseModel):
    """Cross-marketplace product listing normalized for OpportunityOS."""

    source: Marketplace
    source_id: str
    url: Optional[str] = None
    title: str
    description: Optional[str] = None
    price: Optional[float] = None
    currency: Optional[str] = None
    sales_estimate: Optional[float] = None
    monthly_sales: Optional[float] = None
    reviews: Optional[float] = None
    rating: Optional[float] = None
    favorites: Optional[float] = None
    bsr: Optional[float] = None
    shop: Optional[str] = None
    shop_id: Optional[str] = None
    tags: list[str] = Field(default_factory=list)
    category_path: list[str] = Field(default_factory=list)
    images: list[str] = Field(default_factory=list)
    is_personalized: Optional[bool] = None
    ships_from: Optional[str] = None
    query: Optional[str] = None
    scraped_at: str = Field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat()
    )
    raw: dict[str, Any] = Field(default_factory=dict)

    @field_validator("title")
    @classmethod
    def title_not_empty(cls, v: str) -> str:
        v = (v or "").strip()
        if not v:
            raise ValueError("title required")
        return v

    def fingerprint(self) -> str:
        return f"{self.source.value}:{self.source_id}"


class ExtractedProduct(BaseModel):
    object: Optional[str] = None
    occasion: Optional[str] = None
    recipient: Optional[str] = None
    personalized: bool = False
    material_hint: Optional[str] = None
    niche: Optional[str] = None
    product_type: Optional[str] = None
    style_keywords: list[str] = Field(default_factory=list)


class OpportunityFeatures(BaseModel):
    key: str  # product_type|niche or query cluster
    product_type: str
    niche: str
    sources: list[str] = Field(default_factory=list)
    listing_count: int = 0
    shop_count: int = 0
    avg_price: float = 0.0
    median_price: float = 0.0
    avg_rating: float = 0.0
    total_reviews: float = 0.0
    total_favorites: float = 0.0
    total_sales_est: float = 0.0
    personalization_ratio: float = 0.0
    demand: float = 0.0
    growth: float = 50.0
    competition: float = 50.0
    revenue: float = 0.0
    personalization: float = 0.0
    seasonality: float = 50.0
    production_fit: float = 0.0
    opportunity_score: float = 0.0
    recommendation: str = "WATCH"
    reason: str = ""
    matched_printway_sku: Optional[str] = None
    sample_titles: list[str] = Field(default_factory=list)
    sample_urls: list[str] = Field(default_factory=list)


class PrintwayProduct(BaseModel):
    sku: str
    product_type: str
    category: str
    material: str
    difficulty: int = 2
    margin_min: float = 30.0
    margin_max: float = 55.0
    available: bool = True
    keywords: list[str] = Field(default_factory=list)
    blanks: list[str] = Field(default_factory=list)
