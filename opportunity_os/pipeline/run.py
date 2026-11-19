"""End-to-end PW1 pipeline: ingest → normalize → score → train."""

from __future__ import annotations

from pathlib import Path
from typing import Any

from opportunity_os.connectors.etsy import EtsyHARConnector, EtsyOpenAPIConnector
from opportunity_os.connectors.registry import list_apis, registry_summary
from opportunity_os.features.engine import aggregate_opportunities, load_printway_catalog
from opportunity_os.normalize.extract import enrich_listings
from opportunity_os.normalize.normalize import dedupe_listings
from opportunity_os.normalize.schema import UnifiedListing
from opportunity_os.training.train import predict_batch, train_models
from opportunity_os.utils.config import load_settings, root_path
from opportunity_os.utils.io import ensure_dir, save_json, save_jsonl


def run_pipeline(
    *,
    har_path: str | Path | None = None,
    use_live_etsy: bool = False,
    settings_path: str | Path | None = None,
) -> dict[str, Any]:
    settings = load_settings(settings_path)
    root = root_path()
    paths = settings.get("paths") or {}

    har = Path(har_path) if har_path else root / paths.get("har_etsy", "www.etsy.com.har")
    raw_dir = ensure_dir(root / paths.get("raw", "data/raw") / "etsy")
    norm_dir = ensure_dir(root / paths.get("normalized", "data/normalized"))
    feat_dir = ensure_dir(root / paths.get("features", "data/features"))
    model_dir = ensure_dir(root / paths.get("models", "data/models"))
    catalog_path = root / paths.get("printway_catalog", "data/printway/catalog.json")

    listings: list[UnifiedListing] = []
    side: dict[str, Any] = {}

    # 1) HAR ingest (always if present)
    if har.exists():
        conn = EtsyHARConnector(har)
        data = conn.load()
        listings.extend(data.get("listings") or [])
        side = {
            "query": data.get("query"),
            "trending": data.get("trending"),
            "related_queries": data.get("related_queries"),
            "api_hits": data.get("api_hits"),
            "stats": data.get("stats"),
        }
        save_json(raw_dir / "har_meta.json", {
            "source_har": str(har),
            "stats": side.get("stats"),
            "query": side.get("query"),
            "related_queries": side.get("related_queries"),
            "trending": side.get("trending"),
            "api_hits": side.get("api_hits"),
        })

    # 2) Optional live Etsy Open API
    live_error = None
    if use_live_etsy:
        try:
            api = EtsyOpenAPIConnector(
                base_url=(settings.get("connectors") or {}).get("etsy", {}).get(
                    "openapi_base", "https://api.etsy.com/v3"
                )
            )
            seeds = settings.get("seed_queries") or ["personalized ornament"]
            for q in seeds[:8]:
                listings.extend(api.search(q, limit=25))
            api.close()
        except Exception as exc:  # noqa: BLE001
            live_error = str(exc)

    listings = dedupe_listings(listings)
    save_jsonl(norm_dir / "listings.jsonl", listings)

    enriched = enrich_listings(listings)
    save_jsonl(norm_dir / "listings_enriched.jsonl", enriched)

    catalog = load_printway_catalog(catalog_path) if catalog_path.exists() else []
    weights = settings.get("opportunity_weights") or {}
    rules = settings.get("recommendation_rules") or {}

    opportunities = aggregate_opportunities(
        listings, catalog=catalog, weights=weights, rules=rules
    )
    save_jsonl(feat_dir / "opportunities.jsonl", opportunities)
    save_json(
        feat_dir / "opportunities_top.json",
        [o.model_dump(mode="json") for o in opportunities[:30]],
    )

    train_meta = train_models(opportunities, model_dir=model_dir)
    ml_preds = []
    if train_meta.get("status") == "ok":
        ml_preds = predict_batch(opportunities, model_dir=model_dir)
        save_jsonl(feat_dir / "ml_predictions.jsonl", ml_preds)

    # Report
    top = opportunities[:10]
    report_lines = [
        "# OpportunityOS — PW1 Product Research Report",
        "",
        f"- Listings ingested: **{len(listings)}**",
        f"- Opportunity clusters: **{len(opportunities)}**",
        f"- HAR query: `{side.get('query')}`",
        f"- Train: `{train_meta.get('status')}` "
        f"(acc={train_meta.get('classifier_accuracy')}, mae={train_meta.get('regressor_mae')})",
        "",
        "## Top opportunities",
        "",
    ]
    for i, o in enumerate(top, 1):
        report_lines += [
            f"### #{i} {o.product_type} — {o.niche}",
            f"- **Opportunity Score:** {o.opportunity_score}/100",
            f"- **Recommendation:** {o.recommendation}",
            f"- Demand {o.demand} · Growth {o.growth} · Competition {o.competition} · "
            f"Revenue {o.revenue} · Personalization {o.personalization} · "
            f"Seasonality {o.seasonality} · Production Fit {o.production_fit}",
            f"- Printway SKU: `{o.matched_printway_sku}`",
            f"- Listings: {o.listing_count} · Shops: {o.shop_count} · "
            f"Avg price: {o.avg_price}",
            f"- Reason: {o.reason}",
            f"- Sample: {o.sample_titles[:2]}",
            "",
        ]

    report_lines += [
        "## API registry coverage",
        "",
        f"```json\n{registry_summary()}\n```",
        "",
        f"Total endpoints registered: {len(list_apis())}",
        "",
    ]
    if live_error:
        report_lines += [f"> Live Etsy API skipped/error: `{live_error}`", ""]

    report_path = feat_dir / "report.md"
    report_path.write_text("\n".join(report_lines), encoding="utf-8")

    summary = {
        "listings": len(listings),
        "opportunities": len(opportunities),
        "top": [o.model_dump(mode="json") for o in top[:5]],
        "train": train_meta,
        "har_stats": side.get("stats"),
        "report": str(report_path),
        "api_registry": registry_summary(),
        "live_etsy_error": live_error,
    }
    save_json(feat_dir / "run_summary.json", summary)
    return summary
