"""Parse Etsy HAR captures into UnifiedListing rows + side signals."""

from __future__ import annotations

import base64
import json
import re
from html import unescape
from pathlib import Path
from typing import Any
from urllib.parse import parse_qs, urlparse

from bs4 import BeautifulSoup

from opportunity_os.normalize.schema import Marketplace, UnifiedListing


def _decode_content(content: dict[str, Any]) -> str:
    text = content.get("text") or ""
    if not text:
        return ""
    if content.get("encoding") == "base64":
        try:
            return base64.b64decode(text).decode("utf-8", "replace")
        except Exception:  # noqa: BLE001
            return ""
    return text


def _parse_price(raw: str, currency_hint: str | None = None) -> tuple[float | None, str | None]:
    if not raw:
        return None, currency_hint
    s = unescape(raw).strip()
    # Vietnamese-style thousands: 34,435,262
    digits = re.sub(r"[^\d.,]", "", s)
    if not digits:
        return None, currency_hint
    # if multiple commas and no dot -> thousands separators
    if digits.count(",") >= 1 and "." not in digits:
        digits = digits.replace(",", "")
    else:
        digits = digits.replace(",", "")
        # keep last dot as decimal if present
    try:
        return float(digits), currency_hint
    except ValueError:
        return None, currency_hint


def parse_listing_cards_html(
    html: str,
    *,
    query: str | None = None,
    currency: str | None = "VND",
) -> list[UnifiedListing]:
    if not html:
        return []
    soup = BeautifulSoup(html, "lxml")
    cards = soup.select("[data-listing-id], [data-palette-listing-id]")
    out: list[UnifiedListing] = []
    seen: set[str] = set()

    for card in cards:
        lid = card.get("data-listing-id") or card.get("data-palette-listing-id")
        if not lid or lid in seen:
            continue
        seen.add(lid)

        title = None
        img = card.select_one("img[alt]")
        if img and img.get("alt"):
            title = unescape(img["alt"]).strip()
        if not title:
            tnode = card.select_one("h3, [data-listing-card-title], .v2-listing-card__title")
            if tnode:
                title = tnode.get_text(" ", strip=True)
        if not title:
            # title attr on links
            a = card.select_one("a[title]")
            if a and a.get("title"):
                title = unescape(a["title"]).strip()
        if not title:
            continue

        price_el = card.select_one(".currency-value, [class*='currency-value']")
        price_raw = price_el.get_text(strip=True) if price_el else None
        price, cur = _parse_price(price_raw or "", currency)

        # Prefer parent <li> — shop links often sit outside inner card div
        scope = card.find_parent("li") or card

        shop = None
        shop_a = scope.select_one('a[href*="/shop/"]')
        if shop_a and shop_a.get("href"):
            m = re.search(r"/shop/([^/?#]+)", shop_a["href"])
            if m:
                shop = m.group(1)
        text_blob = scope.get_text(" ", strip=True)
        if not shop:
            for pat in (
                r"from shop\s+([A-Za-z0-9_-]+)",
                r"・\s*By\s+([A-Za-z0-9_-]+)",
                r"By\s+([A-Za-z0-9_-]+)",
                r"Made by\s+([A-Za-z0-9_-]+)",
            ):
                m = re.search(pat, text_blob, re.I)
                if m:
                    shop = m.group(1)
                    break

        url = None
        link = scope.select_one(f'a[href*="/listing/{lid}"]') or scope.select_one(
            "a[href*='/listing/']"
        )
        if link and link.get("href"):
            href = link["href"]
            url = href if href.startswith("http") else f"https://www.etsy.com{href}"

        image_url = None
        if img and img.get("src"):
            image_url = img["src"]

        reviews = None
        rm = re.search(r"\(([\d,]+)\)", text_blob)
        if rm:
            try:
                reviews = float(rm.group(1).replace(",", ""))
            except ValueError:
                reviews = None

        rating = None
        rate_m = re.search(r"([\d.]+)\s*out of\s*5", text_blob, re.I)
        if rate_m:
            try:
                rating = float(rate_m.group(1))
            except ValueError:
                rating = None

        personalized = bool(re.search(r"personaliz|custom|monogram", title, re.I))

        out.append(
            UnifiedListing(
                source=Marketplace.ETSY,
                source_id=str(lid),
                url=url,
                title=title,
                price=price,
                currency=cur,
                reviews=reviews,
                rating=rating,
                shop=shop,
                images=[image_url] if image_url else [],
                is_personalized=personalized,
                query=query,
                raw={"price_raw": price_raw, "from": "listingCards_html"},
            )
        )
    return out


def _query_from_url(url: str) -> str | None:
    try:
        qs = parse_qs(urlparse(url).query)
        if "q" in qs and qs["q"]:
            return qs["q"][0]
    except Exception:  # noqa: BLE001
        return None
    return None


def parse_etsy_har(har_path: str | Path) -> dict[str, Any]:
    """Return listings + side channels extracted from an Etsy HAR file."""
    path = Path(har_path)
    har = json.loads(path.read_text(encoding="utf-8", errors="ignore"))
    entries = har.get("log", {}).get("entries", [])

    listings: list[UnifiedListing] = []
    trending: list[dict[str, Any]] = []
    taxonomy_nodes: dict[str, Any] = {}
    related_queries: list[str] = []
    api_hits: list[dict[str, Any]] = []
    default_query: str | None = None
    currency = "VND"

    for e in entries:
        req = e.get("request", {})
        res = e.get("response", {})
        url = req.get("url", "")
        method = req.get("method", "GET")
        path_u = urlparse(url).path
        cont = res.get("content") or {}
        body = _decode_content(cont)
        status = res.get("status")

        if "etsy.com" in url and "/api/" in path_u:
            api_hits.append(
                {
                    "method": method,
                    "path": path_u,
                    "status": status,
                    "size": cont.get("size"),
                    "url": url[:240],
                }
            )

        # locale currency
        for h in req.get("headers", []):
            if h.get("name", "").lower() == "x-detected-locale":
                # VND|en-US|VN
                parts = (h.get("value") or "").split("|")
                if parts:
                    currency = parts[0] or currency

        q = _query_from_url(url)
        if q:
            default_query = q

        # trending
        if "zero-pane-trending-searches" in path_u and body:
            try:
                data = json.loads(body)
                if isinstance(data, list):
                    trending.extend(data)
            except json.JSONDecodeError:
                pass

        # taxonomy
        if "get-category-filter-nodes-all" in path_u and body:
            try:
                data = json.loads(body)
                taxonomy_nodes = data.get("id_to_category_node") or data
            except json.JSONDecodeError:
                pass

        # listing cards
        if path_u.endswith("/listingCards") and body:
            try:
                data = json.loads(body)
                html = (data.get("output") or {}).get("listingCards") or ""
                # try query from recs location header
                loc_q = default_query
                for h in req.get("headers", []):
                    if h.get("name", "").lower() == "x-recs-primary-location":
                        loc_q = _query_from_url(h.get("value") or "") or loc_q
                listings.extend(
                    parse_listing_cards_html(html, query=loc_q, currency=currency)
                )
            except json.JSONDecodeError:
                pass

        # search HTML page
        if path_u == "/search" and body and "data-listing-id" in body:
            listings.extend(
                parse_listing_cards_html(body, query=q or default_query, currency=currency)
            )

        # query ingresses / related — pull queries from request body if present
        if "queryIngresses" in path_u:
            post = (req.get("postData") or {}).get("text") or ""
            for m in re.findall(r'"query"\s*:\s*"([^"]+)"', post):
                related_queries.append(m)
            if body:
                for m in re.findall(r"q=([a-zA-Z0-9+\-% ]+)", body):
                    related_queries.append(m.replace("+", " ")[:80])

        if "search-pathways" in path_u and body:
            for m in re.findall(r'>([A-Za-z][^<]{2,40})</', body):
                t = unescape(m).strip()
                if t and len(t) < 40:
                    related_queries.append(t)

    # dedupe listings
    dedup: dict[str, UnifiedListing] = {}
    for lst in listings:
        dedup[lst.source_id] = lst
    listings = list(dedup.values())

    # unique related
    rel_u: list[str] = []
    seen_r: set[str] = set()
    for r in related_queries:
        k = r.strip().lower()
        if not k or k in seen_r:
            continue
        seen_r.add(k)
        rel_u.append(r.strip())

    return {
        "source_har": str(path),
        "query": default_query,
        "currency": currency,
        "listings": listings,
        "trending": trending,
        "related_queries": rel_u[:100],
        "taxonomy_nodes": taxonomy_nodes,
        "api_hits": api_hits,
        "stats": {
            "listing_count": len(listings),
            "trending_count": len(trending),
            "related_query_count": len(rel_u),
            "api_hit_count": len(api_hits),
        },
    }
