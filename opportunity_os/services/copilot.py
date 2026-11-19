"""AI Copilot — tool-calling style agent (deterministic tools + optional LLM)."""

from __future__ import annotations

import re
from typing import Any

from opportunity_os.normalize.extract import extract_product_signals
from opportunity_os.normalize.schema import Marketplace, UnifiedListing
from opportunity_os.features.engine import (
    aggregate_opportunities,
    load_printway_catalog,
    match_printway,
)
from opportunity_os.services.reports import generate_compare_report, generate_research_report
from opportunity_os.services.store import DataStore, get_store
from opportunity_os.utils.config import load_settings, root_path


def _parse_intent(question: str) -> dict[str, Any]:
    q = question.lower()
    intent = "discover"
    if any(w in q for w in ("compare", "vs", "versus", "so sánh")):
        intent = "compare"
    elif any(w in q for w in ("why shouldn't", "why not", "skip", "không nên")):
        intent = "why_not"
    elif any(w in q for w in ("normalize", "what product", "product type", "đây là")):
        intent = "normalize"
    elif any(w in q for w in ("report", "research report", "báo cáo")):
        intent = "report"
    elif any(w in q for w in ("launch", "q4", "build", "what should")):
        intent = "discover"

    filters: dict[str, Any] = {}
    if "q4" in q or "christmas" in q or "holiday" in q:
        filters["season"] = "Q4"
    if "personal" in q or "custom" in q:
        filters["personalized"] = True
    if "acrylic" in q:
        filters["material"] = "acrylic"
    if "pet" in q:
        filters["q"] = "pet"
    if "grandpa" in q or "grandfather" in q:
        filters["q"] = "grandpa"
    if "tumbler" in q:
        filters["q"] = "tumbler"
    if "mug" in q:
        filters["q"] = "mug"
    if "hoodie" in w if False else "hoodie" in q:
        filters["q"] = "hoodie"
    # extract quoted niches
    niches = re.findall(r"[\"']([^\"']+)[\"']", question)
    if niches:
        filters["compare_names"] = niches
    return {"intent": intent, "filters": filters, "raw": question}


def search_market(store: DataStore, filters: dict[str, Any], limit: int = 10) -> list[dict]:
    return store.list_opportunities(
        q=filters.get("q"),
        material=filters.get("material"),
        min_score=filters.get("min_score"),
        recommendation=filters.get("recommendation"),
        limit=limit,
    )


def normalize_title(title: str) -> dict[str, Any]:
    listing = UnifiedListing(
        source=Marketplace.OTHER,
        source_id="user-input",
        title=title,
    )
    sig = extract_product_signals(listing)
    settings = load_settings()
    catalog_path = root_path() / (settings.get("paths") or {}).get(
        "printway_catalog", "data/printway/catalog.json"
    )
    catalog = load_printway_catalog(catalog_path) if catalog_path.exists() else []
    pw, fit = match_printway(
        sig.product_type or "",
        sig.material_hint,
        title,
        catalog,
    )
    # score single synthetic cluster lightly
    opps = aggregate_opportunities([listing], catalog=catalog)
    opp = opps[0].model_dump(mode="json") if opps else {}
    return {
        "title": title,
        "detected": sig.model_dump(mode="json"),
        "printway_sku": pw.sku if pw else None,
        "printway_product_type": pw.product_type if pw else None,
        "production_fit": fit,
        "opportunity": opp,
        "confidence": min(0.95, 0.55 + (0.1 if sig.object else 0) + (0.15 if sig.personalized else 0) + fit / 500),
    }


def compare_niches(store: DataStore, names: list[str]) -> dict[str, Any]:
    rows = []
    for name in names:
        found = store.list_opportunities(q=name, limit=3)
        if found:
            rows.append(found[0])
    if not rows and names:
        # fallback top
        rows = store.list_opportunities(limit=len(names) or 3)
    report = generate_compare_report(rows)
    return {"items": rows, "report_markdown": report}


def answer_question(question: str, store: DataStore | None = None) -> dict[str, Any]:
    store = store or get_store()
    parsed = _parse_intent(question)
    intent = parsed["intent"]
    filters = parsed["filters"]
    tools_used: list[str] = []

    if intent == "normalize":
        tools_used.append("normalize_title")
        # use whole question as title-ish
        title = re.sub(
            r"(?i)normalize|what product|product type|is this|đây là",
            "",
            question,
        ).strip(" :?-")
        result = normalize_title(title or question)
        opp = result.get("opportunity") or {}
        text = (
            f"**Detected:** {result['detected'].get('product_type')} "
            f"(niche: {result['detected'].get('niche')})\n"
            f"Printway: `{result.get('printway_product_type')}` · fit **{result.get('production_fit'):.0f}**\n"
            f"Confidence: {result.get('confidence', 0):.0%}\n\n"
            f"Opportunity Score: **{opp.get('opportunity_score', 'n/a')}** → "
            f"**{opp.get('recommendation', 'n/a')}**\n"
            f"{opp.get('reason', '')}"
        )
        return {
            "intent": intent,
            "answer": text,
            "data": result,
            "tools_used": tools_used,
        }

    if intent == "compare":
        tools_used += ["search_market", "compare_niches"]
        names = filters.get("compare_names") or re.split(r",| and | vs | versus | / ", question)
        names = [n.strip() for n in names if len(n.strip()) > 2][:5]
        # strip question words
        names = [
            re.sub(
                r"(?i)^(compare|please|the|niches?)\s+",
                "",
                n,
            ).strip()
            for n in names
        ]
        result = compare_niches(store, names)
        return {
            "intent": intent,
            "answer": result["report_markdown"],
            "data": result,
            "tools_used": tools_used,
        }

    if intent == "report":
        tools_used += ["search_market", "generate_report"]
        rows = search_market(store, filters, limit=1) or store.list_opportunities(limit=1)
        if not rows:
            return {
                "intent": intent,
                "answer": "No opportunities in store. Run the data pipeline first.",
                "data": {},
                "tools_used": tools_used,
            }
        md = generate_research_report(rows[0])
        return {"intent": intent, "answer": md, "data": {"opportunity": rows[0]}, "tools_used": tools_used}

    if intent == "why_not":
        tools_used.append("search_market")
        rows = search_market(store, filters, limit=5)
        # pick high demand low fit if possible
        candidate = None
        for r in rows or store.list_opportunities(limit=20):
            if float(r.get("production_fit") or 0) < 50 and float(r.get("demand") or 0) >= 60:
                candidate = r
                break
        candidate = candidate or (rows[0] if rows else None) or (
            store.list_opportunities(limit=1) or [None]
        )[0]
        if not candidate:
            return {
                "intent": intent,
                "answer": "No data loaded.",
                "data": {},
                "tools_used": tools_used,
            }
        text = (
            f"Although market signals may look interesting "
            f"(Demand **{candidate.get('demand')}**, Score **{candidate.get('opportunity_score')}**),\n"
            f"Printway **Production Fit is {candidate.get('production_fit')}**.\n\n"
            f"**Product:** {candidate.get('product_type')} — {candidate.get('niche')}\n"
            f"**Recommendation: {candidate.get('recommendation')}**\n\n"
            f"Main issues:\n"
            f"- production / material fit may be insufficient\n"
            f"- competition or margin structure may not justify BUILD\n\n"
            f"Reasoning: {candidate.get('reason')}"
        )
        return {
            "intent": intent,
            "answer": text,
            "data": {"opportunity": candidate},
            "tools_used": tools_used,
        }

    # discover default
    tools_used.append("search_market")
    rows = search_market(store, filters, limit=8)
    if not rows:
        rows = store.list_opportunities(limit=8)
    if not rows:
        return {
            "intent": intent,
            "answer": "Store empty. Run: `python scripts/run_pw1_pipeline.py`",
            "data": {},
            "tools_used": tools_used,
        }
    lines = ["## Top opportunities", ""]
    for i, r in enumerate(rows[:5], 1):
        lines.append(
            f"{i}. **{r.get('product_type')}** — {r.get('niche')}  "
            f"**{r.get('opportunity_score')}** `{r.get('recommendation')}`  "
            f"(fit {r.get('production_fit')}, growth {r.get('growth')})"
        )
    lines += [
        "",
        f"_Filters:_ `{filters}`",
        "",
        "Score is **deterministic** from marketplace features; this answer only ranks and explains.",
    ]
    return {
        "intent": intent,
        "answer": "\n".join(lines),
        "data": {"opportunities": rows[:5]},
        "tools_used": tools_used,
    }
