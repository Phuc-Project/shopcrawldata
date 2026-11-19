"""Product Research Report generator (PW1 actionable output)."""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Any


def generate_research_report(opp: dict[str, Any]) -> str:
    product = opp.get("product_type") or "Unknown Product"
    niche = opp.get("niche") or "General"
    score = opp.get("opportunity_score", 0)
    rec = opp.get("recommendation", "WATCH")
    sku = opp.get("matched_printway_sku") or "N/A"
    price = opp.get("avg_price") or opp.get("median_price")
    currency_note = ""
    if price and float(price) > 1000:
        currency_note = " (raw marketplace currency — normalize in UI)"

    def bar(v: float) -> str:
        n = int(round(float(v) / 10))
        return "█" * n + "░" * (10 - n)

    lines = [
        "# PRODUCT RESEARCH REPORT",
        "",
        f"**Generated:** {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')}",
        "",
        f"## Product",
        f"**{product}**",
        f"- Niche: **{niche}**",
        f"- Opportunity key: `{opp.get('key')}`",
        "",
        f"## Decision",
        f"### {rec}",
        f"**Opportunity Score: {score} / 100**",
        "",
        "## Score breakdown",
        "",
        f"| Feature | Score | |",
        f"|---|---:|---|",
        f"| Demand | {opp.get('demand')} | {bar(opp.get('demand') or 0)} |",
        f"| Growth | {opp.get('growth')} | {bar(opp.get('growth') or 0)} |",
        f"| Competition (opportunity) | {opp.get('competition')} | {bar(opp.get('competition') or 0)} |",
        f"| Revenue Potential | {opp.get('revenue')} | {bar(opp.get('revenue') or 0)} |",
        f"| Personalization | {opp.get('personalization')} | {bar(opp.get('personalization') or 0)} |",
        f"| Seasonality | {opp.get('seasonality')} | {bar(opp.get('seasonality') or 0)} |",
        f"| Production Fit | {opp.get('production_fit')} | {bar(opp.get('production_fit') or 0)} |",
        "",
        "## Why this score",
        "",
        opp.get("reason") or "See feature breakdown.",
        "",
        "## Market evidence",
        "",
        f"- Sources: {', '.join(opp.get('sources') or [])}",
        f"- Listings analysed: **{opp.get('listing_count')}**",
        f"- Distinct shops: **{opp.get('shop_count')}**",
        f"- Avg price: **{price}**{currency_note}",
        f"- Median price: **{opp.get('median_price')}**",
        f"- Avg rating: **{opp.get('avg_rating')}**",
        f"- Total reviews (proxy): **{opp.get('total_reviews')}**",
        f"- Total favorites (proxy): **{opp.get('total_favorites')}**",
        f"- Sales estimate sum: **{opp.get('total_sales_est')}**",
        f"- Personalization ratio: **{opp.get('personalization_ratio')}**",
        "",
        "## Printway production",
        "",
        f"- Matched SKU: `{sku}`",
        f"- Production fit: **{opp.get('production_fit')}/100**",
        "",
        "## Sample marketplace titles",
        "",
    ]
    for t in opp.get("sample_titles") or []:
        lines.append(f"- {t}")
    lines += [
        "",
        "## Recommended niches",
        "",
        f"- Primary: **{niche}**",
        "- Expand via related personalized occasions (Christmas, memorial, family gifts)",
        "",
        "## Design insights (heuristic)",
        "",
        "- Emphasize personalization fields: name, photo, year, short quote",
        "- POD-friendly: high-contrast typography, simple icon motifs",
        "- Test 3–5 quote variants if memorial / gift niche",
        "",
        "## Recommended action plan",
        "",
    ]
    if rec == "BUILD":
        lines += [
            "1. Confirm blank + material with Printway production (matched SKU).",
            "2. Create **15 initial designs** focused on top niche keywords.",
            "3. Price band: test median ± 15%.",
            "4. Launch window: align with seasonality score (Q4 if seasonal high).",
            "5. Validate CTR on ads / marketplace thumbnails in 14 days.",
        ]
    elif rec == "WATCH":
        lines += [
            "1. Track keyword + sales velocity weekly.",
            "2. Prepare 5 designs but delay full launch.",
            "3. Re-score when demand or production fit improves.",
        ]
    else:
        lines += [
            "1. Do **not** allocate production capacity now.",
            "2. Log niche for monthly re-check.",
            "3. If demand high but fit low — evaluate new blank / material.",
        ]
    lines += [
        "",
        "## Risk",
        "",
        "- Competition may rise as niche becomes visible cross-market.",
        "- HAR/sample data may under-represent true sales — refresh live API feeds.",
        "",
        "## Next action",
        "",
        f"**{rec}** `{product}` × niche `{niche}` → SKU `{sku}`",
        "",
    ]
    return "\n".join(lines)


def generate_compare_report(rows: list[dict[str, Any]]) -> str:
    lines = [
        "# NICHE COMPARE REPORT",
        "",
        "| Product | Niche | Score | Growth | Competition | Fit | Decision |",
        "|---|---|---:|---:|---:|---:|---|",
    ]
    for r in rows:
        lines.append(
            f"| {r.get('product_type')} | {r.get('niche')} | {r.get('opportunity_score')} | "
            f"{r.get('growth')} | {r.get('competition')} | {r.get('production_fit')} | "
            f"**{r.get('recommendation')}** |"
        )
    if rows:
        winner = max(rows, key=lambda x: float(x.get("opportunity_score") or 0))
        lines += [
            "",
            f"## Winner: {winner.get('product_type')} — {winner.get('niche')}",
            "",
            winner.get("reason") or "",
            f"Score **{winner.get('opportunity_score')}** → **{winner.get('recommendation')}**",
        ]
    return "\n".join(lines)
