from __future__ import annotations

import re
from typing import Iterable

from .schema import ExtractedProduct, UnifiedListing

PERSONALIZATION_RE = re.compile(
    r"\b(personaliz|custom|monogram|name |your (photo|text|name)|engrav|"
    r"made to order|customiz|add your)\b",
    re.I,
)

OCCASION_PATTERNS: list[tuple[str, re.Pattern[str]]] = [
    ("christmas", re.compile(r"\b(christmas|xmas|noel|holiday)\b", re.I)),
    ("father's day", re.compile(r"\bfather'?s?\s*day|dad gift|grandpa\b", re.I)),
    ("mother's day", re.compile(r"\bmother'?s?\s*day|mom gift|grandma\b", re.I)),
    ("wedding", re.compile(r"\bwedding|bride|groom|anniversary\b", re.I)),
    ("memorial", re.compile(r"\bmemorial|sympathy|in loving memory|loss of\b", re.I)),
    ("baby", re.compile(r"\bbaby|newborn|onesie|baptism|christening\b", re.I)),
    ("valentine", re.compile(r"\bvalentine|love you\b", re.I)),
    ("graduation", re.compile(r"\bgraduat", re.I)),
    ("birthday", re.compile(r"\bbirthday\b", re.I)),
]

RECIPIENT_PATTERNS: list[tuple[str, re.Pattern[str]]] = [
    ("grandpa", re.compile(r"\bgrandpa|grandfather|papa\b", re.I)),
    ("grandma", re.compile(r"\bgrandma|grandmother|nana\b", re.I)),
    ("dad", re.compile(r"\b\bdad\b|father\b", re.I)),
    ("mom", re.compile(r"\bmom\b|mother\b", re.I)),
    ("pet", re.compile(r"\bpet|dog|cat|puppy|kitten\b", re.I)),
    ("couple", re.compile(r"\bcouple|husband|wife|boyfriend|girlfriend\b", re.I)),
    ("teacher", re.compile(r"\bteacher\b", re.I)),
    ("baby", re.compile(r"\bbaby|infant|toddler\b", re.I)),
]

OBJECT_PATTERNS: list[tuple[str, re.Pattern[str]]] = [
    ("ornament", re.compile(r"\bornament\b", re.I)),
    ("tumbler", re.compile(r"\btumbler|stanley|water bottle\b", re.I)),
    ("mug", re.compile(r"\bmug|cup\b", re.I)),
    ("t-shirt", re.compile(r"\bt-?shirt|tee\b", re.I)),
    ("hoodie", re.compile(r"\bhoodie|sweatshirt\b", re.I)),
    ("blanket", re.compile(r"\bblanket|throw\b", re.I)),
    ("canvas", re.compile(r"\bcanvas|wall art|poster|print\b", re.I)),
    ("necklace", re.compile(r"\bnecklace|jewelry|bracelet\b", re.I)),
    ("phone case", re.compile(r"\bphone case|iphone case\b", re.I)),
    ("sign", re.compile(r"\bsign|plaque|door hanger\b", re.I)),
    ("snow globe", re.compile(r"\bsnow globe\b", re.I)),
    ("pillow", re.compile(r"\bpillow|cushion\b", re.I)),
    ("sticker", re.compile(r"\bsticker|decal\b", re.I)),
    ("rug", re.compile(r"\brug|carpet\b", re.I)),
    ("candle", re.compile(r"\bcandle\b", re.I)),
]

MATERIAL_PATTERNS: list[tuple[str, re.Pattern[str]]] = [
    ("acrylic", re.compile(r"\bacrylic\b", re.I)),
    ("wood", re.compile(r"\bwood|wooden|bamboo\b", re.I)),
    ("ceramic", re.compile(r"\bceramic\b", re.I)),
    ("metal", re.compile(r"\bmetal|steel|aluminum|brass\b", re.I)),
    ("glass", re.compile(r"\bglass\b", re.I)),
    ("cotton", re.compile(r"\bcotton|fabric|textile\b", re.I)),
    ("leather", re.compile(r"\bleather\b", re.I)),
    ("paper", re.compile(r"\bpaper|cardstock\b", re.I)),
    ("crystal", re.compile(r"\bcrystal\b", re.I)),
]


def _first_match(text: str, patterns: list[tuple[str, re.Pattern[str]]]) -> str | None:
    for name, pat in patterns:
        if pat.search(text):
            return name
    return None


def _all_matches(text: str, patterns: list[tuple[str, re.Pattern[str]]]) -> list[str]:
    return [name for name, pat in patterns if pat.search(text)]


def extract_product_signals(listing: UnifiedListing) -> ExtractedProduct:
    blob_parts = [
        listing.title or "",
        listing.description or "",
        " ".join(listing.tags or []),
        " ".join(listing.category_path or []),
        listing.query or "",
    ]
    text = " | ".join(blob_parts)

    personalized = bool(
        listing.is_personalized
        if listing.is_personalized is not None
        else PERSONALIZATION_RE.search(text)
    )
    obj = _first_match(text, OBJECT_PATTERNS) or _guess_object_from_title(listing.title)
    occasion = _first_match(text, OCCASION_PATTERNS)
    recipient = _first_match(text, RECIPIENT_PATTERNS)
    material = _first_match(text, MATERIAL_PATTERNS)

    niche_bits = [x for x in (recipient, occasion) if x]
    if personalized and "personalized" not in (niche_bits or []):
        niche_bits.insert(0, "personalized")
    niche = " ".join(niche_bits) if niche_bits else (listing.query or "general")

    product_type = obj or "unknown product"
    if material and material.lower() not in product_type.lower():
        product_type = f"{material} {product_type}".strip()

    styles = _all_matches(text, OBJECT_PATTERNS)[:5]
    return ExtractedProduct(
        object=obj,
        occasion=occasion,
        recipient=recipient,
        personalized=personalized,
        material_hint=material,
        niche=niche.title() if niche else "General",
        product_type=product_type.title(),
        style_keywords=styles,
    )


def _guess_object_from_title(title: str) -> str | None:
    tokens = re.findall(r"[A-Za-z][A-Za-z\-']+", title or "")
    if not tokens:
        return None
    stop = {
        "the",
        "a",
        "an",
        "and",
        "for",
        "with",
        "from",
        "your",
        "custom",
        "personalized",
        "gift",
        "new",
        "set",
        "of",
        "in",
        "on",
    }
    keep = [t for t in tokens if t.lower() not in stop]
    if not keep:
        return None
    return " ".join(keep[:3]).lower()


def enrich_listings(listings: Iterable[UnifiedListing]) -> list[dict]:
    rows = []
    for lst in listings:
        sig = extract_product_signals(lst)
        d = lst.model_dump(mode="json")
        d["extract"] = sig.model_dump(mode="json")
        d["opportunity_key"] = f"{sig.product_type}|{sig.niche}"
        rows.append(d)
    return rows
