"""Opportunity feature engine + score (PW1 weights)."""

from __future__ import annotations

import math
import re
from collections import defaultdict
from pathlib import Path
from typing import Any, Iterable

import numpy as np

from opportunity_os.normalize.extract import extract_product_signals, enrich_listings
from opportunity_os.normalize.schema import (
    OpportunityFeatures,
    PrintwayProduct,
    UnifiedListing,
)
from opportunity_os.utils.io import load_json


SEASONAL_KW = re.compile(
    r"\b(christmas|xmas|halloween|valentine|mother'?s?\s*day|father'?s?\s*day|"
    r"easter|thanksgiving|back to school|wedding|graduation|new year)\b",
    re.I,
)


def load_printway_catalog(path: str | Path) -> list[PrintwayProduct]:
    raw = load_json(path)
    return [PrintwayProduct.model_validate(x) for x in raw]


def _percentile_rank(values: list[float], x: float) -> float:
    if not values:
        return 50.0
    arr = np.asarray(values, dtype=float)
    return float((arr <= x).mean() * 100.0)


def _safe_mean(vals: list[float]) -> float:
    return float(np.mean(vals)) if vals else 0.0


def _safe_median(vals: list[float]) -> float:
    return float(np.median(vals)) if vals else 0.0


def match_printway(
    product_type: str,
    material: str | None,
    title_blob: str,
    catalog: list[PrintwayProduct],
) -> tuple[PrintwayProduct | None, float]:
    """Return best Printway product + fit score 0-100."""
    if not catalog:
        return None, 0.0
    blob = f"{product_type} {material or ''} {title_blob}".lower()
    best: PrintwayProduct | None = None
    best_score = -1.0
    for p in catalog:
        if not p.available:
            score = 5.0
        else:
            score = 20.0
        # keyword hits
        hits = sum(1 for k in p.keywords if k.lower() in blob)
        score += min(50.0, hits * 12.0)
        if p.material and p.material.lower() in blob:
            score += 15.0
        if p.product_type.lower() in blob or any(
            t in blob for t in p.product_type.lower().split() if len(t) > 3
        ):
            score += 15.0
        # difficulty penalty
        score -= max(0, p.difficulty - 2) * 4
        score = max(0.0, min(100.0, score))
        if score > best_score:
            best_score = score
            best = p
    return best, float(best_score)


def aggregate_opportunities(
    listings: Iterable[UnifiedListing],
    *,
    catalog: list[PrintwayProduct],
    weights: dict[str, float] | None = None,
    rules: dict[str, float] | None = None,
    prior_sales: dict[str, float] | None = None,
) -> list[OpportunityFeatures]:
    """
    Group listings by product_type|niche, compute feature scores, recommend.
    prior_sales: optional previous snapshot totals per key for growth.
    """
    weights = weights or {
        "demand": 0.20,
        "growth": 0.20,
        "competition": 0.15,
        "revenue": 0.15,
        "personalization": 0.10,
        "seasonality": 0.10,
        "production_fit": 0.10,
    }
    rules = rules or {
        "build_min_score": 80,
        "build_min_production_fit": 75,
        "watch_min_score": 60,
    }
    prior_sales = prior_sales or {}

    groups: dict[str, list[tuple[UnifiedListing, Any]]] = defaultdict(list)
    for lst in listings:
        sig = extract_product_signals(lst)
        key = f"{sig.product_type}|{sig.niche}"
        groups[key].append((lst, sig))

    # global pools for percentile ranks
    demand_raws: list[float] = []
    rev_raws: list[float] = []
    count_raws: list[float] = []
    group_stats: dict[str, dict[str, Any]] = {}

    for key, rows in groups.items():
        prices = [float(r.price) for r, _ in rows if r.price is not None]
        reviews = [float(r.reviews or 0) for r, _ in rows]
        favs = [float(r.favorites or 0) for r, _ in rows]
        sales = [
            float(r.sales_estimate or r.monthly_sales or 0) for r, _ in rows
        ]
        ratings = [float(r.rating) for r, _ in rows if r.rating is not None]
        shops = {r.shop or r.shop_id for r, _ in rows if (r.shop or r.shop_id)}
        perso = sum(1 for r, s in rows if s.personalized or r.is_personalized) / max(
            1, len(rows)
        )
        seasonal_hits = sum(
            1
            for r, _ in rows
            if SEASONAL_KW.search(r.title or "")
            or any(SEASONAL_KW.search(t or "") for t in (r.tags or []))
        )
        seasonal_ratio = seasonal_hits / max(1, len(rows))

        # When HAR lacks sales/favorites, use listing density + price presence + personalization
        demand_proxy = (
            sum(sales) * 2.0
            + sum(favs) * 0.5
            + sum(reviews) * 1.0
            + len(rows) * 8.0
            + perso * 20.0
            + (sum(1 for r, _ in rows if r.price) * 2.0)
        )
        # Normalize extreme locale prices (e.g. VND) for revenue proxy stability
        def _norm_price(p: float, cur: str | None) -> float:
            if cur and cur.upper() in {"VND", "IDR", "KRW"}:
                return p / 25000.0  # rough USD-ish scale
            return p

        revenue_proxy = sum(
            _norm_price(float(r.price), r.currency)
            * float(r.sales_estimate or r.monthly_sales or r.favorites or max(1.0, perso * 5))
            for r, _ in rows
            if r.price
        )

        demand_raws.append(demand_proxy)
        rev_raws.append(revenue_proxy)
        count_raws.append(float(len(rows)))

        titles = [r.title for r, _ in rows[:5]]
        urls = [r.url for r, _ in rows if r.url][:5]
        sources = sorted({r.source.value for r, _ in rows})
        product_type = rows[0][1].product_type or "Unknown"
        niche = rows[0][1].niche or "General"
        material = rows[0][1].material_hint
        blob = " ".join(titles)
        pw, fit = match_printway(product_type, material, blob, catalog)

        group_stats[key] = {
            "product_type": product_type,
            "niche": niche,
            "sources": sources,
            "listing_count": len(rows),
            "shop_count": len(shops),
            "avg_price": _safe_mean(prices),
            "median_price": _safe_median(prices),
            "avg_rating": _safe_mean(ratings),
            "total_reviews": float(sum(reviews)),
            "total_favorites": float(sum(favs)),
            "total_sales_est": float(sum(sales)),
            "personalization_ratio": perso,
            "seasonal_ratio": seasonal_ratio,
            "demand_proxy": demand_proxy,
            "revenue_proxy": revenue_proxy,
            "sample_titles": titles,
            "sample_urls": [u for u in urls if u],
            "printway": pw,
            "production_fit": fit,
            "material": material,
        }

    out: list[OpportunityFeatures] = []
    for key, st in group_stats.items():
        demand = _percentile_rank(demand_raws, st["demand_proxy"])
        revenue = _percentile_rank(rev_raws, st["revenue_proxy"])
        # competition: fewer listings + fewer shops => higher opportunity
        # invert density percentile
        density = st["listing_count"] + st["shop_count"] * 2
        dens_pct = _percentile_rank(count_raws, float(st["listing_count"]))
        competition = max(0.0, min(100.0, 100.0 - dens_pct * 0.7 - min(30, st["shop_count"])))
        # if market concentration high (few shops many listings) slightly better
        if st["listing_count"] > 0 and st["shop_count"] > 0:
            conc = st["listing_count"] / st["shop_count"]
            if conc >= 3:
                competition = min(100.0, competition + 5)

        # growth from prior snapshot or neutral + seasonal boost
        prev = prior_sales.get(key)
        cur_sales = st["total_sales_est"] + st["total_favorites"] + st["total_reviews"]
        if prev and prev > 0:
            g = (cur_sales - prev) / prev
            growth = max(0.0, min(100.0, 50.0 + g * 100.0))
        else:
            # proxy: personalization + reviews density
            growth = 45.0 + st["personalization_ratio"] * 25.0 + st["seasonal_ratio"] * 15.0
            growth = max(0.0, min(100.0, growth))

        personalization = st["personalization_ratio"] * 100.0
        seasonality = 40.0 + st["seasonal_ratio"] * 60.0
        production_fit = float(st["production_fit"])

        score = (
            demand * weights["demand"]
            + growth * weights["growth"]
            + competition * weights["competition"]
            + revenue * weights["revenue"]
            + personalization * weights["personalization"]
            + seasonality * weights["seasonality"]
            + production_fit * weights["production_fit"]
        )
        score = float(max(0.0, min(100.0, score)))

        rec = "WATCH"
        reason_parts = []
        if score >= float(rules["build_min_score"]) and production_fit >= float(
            rules["build_min_production_fit"]
        ):
            rec = "BUILD"
            reason_parts.append("Score cao và Printway sản xuất được.")
        elif score >= float(rules["watch_min_score"]):
            rec = "WATCH"
            reason_parts.append("Có tín hiệu nhưng chưa đủ mạnh hoặc fit trung bình.")
        else:
            rec = "SKIP"
            reason_parts.append("Demand/fit thấp.")

        if demand >= 70 and competition >= 65:
            reason_parts.append("Demand tăng trong khi cạnh tranh còn cửa.")
        if personalization >= 60:
            reason_parts.append("Niche personalization mạnh (POD-friendly).")
        if production_fit < 50:
            reason_parts.append("Production fit thấp — cân nhắc SKIP dù market tốt.")
            if rec == "BUILD":
                rec = "WATCH"

        pw = st["printway"]
        out.append(
            OpportunityFeatures(
                key=key,
                product_type=st["product_type"],
                niche=st["niche"],
                sources=st["sources"],
                listing_count=st["listing_count"],
                shop_count=st["shop_count"],
                avg_price=round(st["avg_price"], 2),
                median_price=round(st["median_price"], 2),
                avg_rating=round(st["avg_rating"], 2),
                total_reviews=st["total_reviews"],
                total_favorites=st["total_favorites"],
                total_sales_est=st["total_sales_est"],
                personalization_ratio=round(st["personalization_ratio"], 3),
                demand=round(demand, 1),
                growth=round(growth, 1),
                competition=round(competition, 1),
                revenue=round(revenue, 1),
                personalization=round(personalization, 1),
                seasonality=round(seasonality, 1),
                production_fit=round(production_fit, 1),
                opportunity_score=round(score, 1),
                recommendation=rec,
                reason=" ".join(reason_parts),
                matched_printway_sku=pw.sku if pw else None,
                sample_titles=st["sample_titles"],
                sample_urls=st["sample_urls"],
            )
        )

    out.sort(key=lambda x: x.opportunity_score, reverse=True)
    return out
