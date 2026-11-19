# Marketplace API Catalog — PW1 / OpportunityOS (Printway)

> Mục tiêu: thu thập API / nguồn dữ liệu phục vụ **Product Opportunity Hub**  
> Input → Demand / Growth / Competition / Revenue / Seasonality / Personalization / Production Fit → **Opportunity Score** + **BUILD | WATCH | SKIP**

**Đề PW1 (tóm tắt):** Biến dữ liệu rời rạc từ **7+ nguồn marketplace** thành **1 Opportunity Score** + **1 bản đề xuất sản phẩm hành động** cho R&D in-house Printway.

**MVP data (workflow):** Etsy + Amazon + Printway Catalog  
**Mở rộng theo request:** Shopee, Lazada, AliExpress (+ Trends sau)

---

## 0. Unified listing schema (chuẩn hoá trước khi train / score)

Mọi sàn map về schema này (khớp `OpportunityOS_Project_Workflow.md`):

```json
{
  "source": "etsy|amazon|shopee|lazada|aliexpress",
  "source_id": "string",
  "url": "string",
  "title": "string",
  "description": "string|null",
  "price": 19.99,
  "currency": "USD",
  "sales_estimate": 524,
  "monthly_sales": null,
  "reviews": 210,
  "rating": 4.9,
  "favorites": 1032,
  "bsr": null,
  "shop": "GiftForGrandpa",
  "shop_id": "string|null",
  "tags": ["grandpa gift", "personalized ornament"],
  "category_path": ["Home & Living", "Home Decor", "Ornaments"],
  "images": ["https://..."],
  "is_personalized": true,
  "ships_from": "US|null",
  "scraped_at": "ISO-8601",
  "raw": {}
}
```

| Feature engine | Field chính |
|---|---|
| Demand | `sales_estimate`, `reviews`, `favorites`, `bsr`, search volume |
| Growth | delta sales/reviews theo snapshot thời gian |
| Competition | #listing/query, #shop, price density, rating distribution |
| Revenue | `price * sales_estimate` |
| Seasonality | tags/title occasion + time series |
| Personalization | tags/title keywords + listing attributes |
| Production Fit | map → Printway catalog (material, blank type) |

---

## 1. ETSY (priority #1)

### 1A. Official — Open API v3 (khuyến nghị production)

| | |
|---|---|
| Docs | https://developers.etsy.com/documentation/ |
| Base | `https://openapi.etsy.com/v3` |
| Auth | OAuth2 + header `x-api-key: <keystring>` |
| Rate | Theo app tier (cần monitor `X-Limit-Per-Second` / daily) |

**Endpoints cần cho research / training:**

| Method | Path | Dùng cho |
|---|---|---|
| GET | `/application/listings/active` | Search listing active theo `keywords`, `taxonomy_id`, `min_price`, `max_price`, `sort_on`, `sort_order`, `limit`, `offset` |
| GET | `/application/listings/{listing_id}` | Chi tiết 1 listing |
| GET | `/application/listings/batch` | Batch listing IDs |
| GET | `/application/listings/{listing_id}/images` | Ảnh |
| GET | `/application/listings/{listing_id}/inventory` | Giá / variant / personalization |
| GET | `/application/shops/{shop_id}` | Shop meta (sales total nếu có scope) |
| GET | `/application/shops/{shop_id}/listings/active` | Toàn shop competitor |
| GET | `/application/shops/{shop_id}/reviews` | Review velocity proxy |
| GET | `/application/seller-taxonomy/nodes` | Taxonomy tree |
| GET | `/application/buyer-taxonomy/nodes` | Buyer taxonomy |
| GET | `/application/listings/{listing_id}/properties` | Attributes (material, occasion…) |
| GET | `/application/listings/active` + `taxonomy_id` | Competition density theo category |

**Field map → unified schema:**

| Etsy | Unified |
|---|---|
| `listing_id` | `source_id` |
| `title` | `title` |
| `description` | `description` |
| `price.amount/divisor` | `price` |
| `price.currency_code` | `currency` |
| `num_favorers` | `favorites` |
| `views` (nếu có) | demand proxy |
| `tags` | `tags` |
| `taxonomy_path` / `shop_section` | `category_path` |
| `shop.shop_name` | `shop` |
| `is_personalizable` / `is_customizable` | `is_personalized` |
| `url` | `url` |

> Lưu ý: Etsy Open API **không luôn trả total sales** public. Sales estimate thường suy từ shop sales + listing age + reviews/favorites (feature engineering).

---

### 1B. Internal web AJAX — từ HAR `www.etsy.com.har` (search `home decor`)

HAR có **60 entries**, host chính `www.etsy.com`. Các API JSON hữu ích:

#### Base pattern
```
https://www.etsy.com/api/v3/ajax/...
Headers quan trọng:
  x-csrf-token
  x-detected-locale: VND|en-US|VN
  x-page-guid
  x-recs-primary-location
  content-type: application/json
  cookie (session + datadome)
```

#### Endpoints captured

| # | Method | Endpoint | Size | Vai trò OpportunityOS |
|---|---|---|---|---|
| 1 | GET | `/api/v3/ajax/public/search/zero-pane-trending-searches/true` | ~2KB | **Trend seeds** — query đang hot |
| 2 | POST | `/api/v3/ajax/public/search/taxonomy/get-category-filter-nodes-all` | ~81KB | **Taxonomy + facet counts** (competition density theo category) |
| 3 | POST | `/api/v3/ajax/bespoke/member/neu/specs/listingCards` | ~1.3MB | **Listing cards HTML** cho search results (title, price, shop, image, listing_id) |
| 4 | POST | `/api/v3/ajax/bespoke/member/neu/specs/async_active_filters` | ~5KB | Active filters UI |
| 5 | POST | `/api/v3/ajax/bespoke/member/neu/specs/queryIngresses` | ~15KB | **Related queries** (niche expansion) |
| 6 | POST | `/api/v3/ajax/bespoke/member/neu/specs/search-pathways` | ~21KB | **Search pathways / reformulation pills** |
| 7 | POST | `/api/v3/ajax/bespoke/member/neu/specs/search_async_narrowing_modules` | ~90KB | Etsy’s picks / narrowing modules |
| 8 | POST | `/api/v3/ajax/bespoke/member/neu/specs/search_async_perso_query_suggestions` | ~13KB | Personalized related searches |
| 9 | POST | `/api/v3/ajax/bespoke/member/neu/specs/search_async_related_niches` | ~2KB | Related niches (A/B, có thể empty) |
| 10 | POST | `/api/v3/ajax/bespoke/member/neu/specs/search_async_recs` | ~1KB | Similar-to-recently-viewed |
| 11 | POST | `/api/v3/ajax/bespoke/member/neu/specs/search_async_ppfy_recs` | ~4KB | Promoted picks |
| 12 | POST | `/api/v3/ajax/bespoke/member/neu/specs/home_async` | ~75KB | Home modules |
| 13 | GET | `/api/v3/ajax/bespoke/public/neu/specs/catnav-mobile` | ~114KB | Category nav tree |
| 14 | GET | `/api/v3/ajax/bespoke/public/neu/specs/submenu` | ~6KB | Catnav submenu |
| 15 | GET | `/api/v3/ajax/member/users/listings-favorites-collections-map?listing_ids[]=` | small | Favorite state (member) |

#### Spec body pattern (bespoke)
```json
{
  "log_performance_metrics": true,
  "specs": {
    "listingCards": [
      "Search2_ApiSpecs_LazyListingCards",
      {
        "listing_ids": [1748141078, 4295011799],
        "ad_ids": [637405582],
        "ads_logging_keys": ["..."],
        "organic_logging_keys": ["..."]
      }
    ]
  },
  "runtime_analysis": false
}
```

#### Trending searches response sample
```json
[
  {
    "title": "Home Decor",
    "search_term": "Home Decor",
    "url": "https://www.etsy.com/search?q=home+decor&...",
    "image": "https://i.etsystatic.com/...",
    "module_title": "Gifts as special as they are"
  }
]
```

#### Taxonomy filter response
```json
{
  "id_to_category_node": {
    "map": {
      "1": { "name": "Accessories", "urlPath": "accessories", "parentId": null, "facetCountSortedChildrenIds": [] }
    }
  }
}
```
`category_facet_map` trong request body = `{ taxonomy_id: result_count }` → **proxy competition**.

#### listingCards
- Response chủ yếu **HTML** trong `output.listingCards` (+ `jsData` impression keys).
- Parse được: `data-listing-id`, title, image, shop path `/shop/{name}`, price (`currency-value`), review count trong ngoặc.
- HAR query mẫu: `q=home+decor`, `result_count=48`.

#### Search page entry (HTML SSR)
```
GET https://www.etsy.com/search?q={query}&...
```
Cần SSR/HTML parse hoặc lazy `listingCards` sau khi có `listing_ids` từ page.

> **Anti-bot:** DataDome (`/include/tags.js`, cookie `datadome`). Internal AJAX **không ổn định** cho production; dùng Open API chính + HAR để hiểu field/UX. Crawl web chỉ demo/hackathon với rate limit + cache.

#### Pipeline Etsy đề xuất (hackathon)
```
seed queries (POD blanks + niches)
    → trending-searches + queryIngresses + pathways  (expand keywords)
    → OpenAPI findAllListingsActive OR search HTML + listingCards
    → listing detail (tags, personalization, shop)
    → taxonomy facet counts (competition)
    → normalize → feature store → score
```

---

## 2. AMAZON (priority #1)

### 2A. Official — Creators API (thay PA-API 5.0)

| | |
|---|---|
| Docs | https://affiliate-program.amazon.com/creatorsapi/docs/en-us/introduction |
| Ops | `SearchItems`, `GetItems`, `GetVariations`, `GetBrowseNodes` |
| Auth | Associates + Client credentials (Credential ID/Secret) |
| Constraint | Thường cần Associates + qualifying sales; max **10 items**/SearchItems call |

**SearchItems** — params quan trọng:

| Param | Dùng cho |
|---|---|
| `keywords` | Query research |
| `searchIndex` | Category slice (HomeAndKitchen, Fashion, …) |
| `browseNodeId` | Subcategory competition |
| `minPrice` / `maxPrice` | Price band |
| `minReviewsRating` | Quality filter |
| `sortBy` | `AvgCustomerReviews`, `NewestArrivals`, `Featured`, `Price:*`, `Relevance` |
| `itemPage` | Pagination |
| `resources` | `itemInfo.title`, `itemInfo.features`, `itemInfo.byLineInfo`, `images.*`, `offers.listings.price`, `customerReviews`, browse nodes… |

**GetItems** — ASIN detail (title, price, rating, features, parent ASIN).  
**GetBrowseNodes** — category tree + children.  
**GetVariations** — variant matrix (size/color) → competition depth.

**Field map:**

| Amazon | Unified |
|---|---|
| ASIN | `source_id` |
| title | `title` |
| offers price | `price` |
| customerReviews.count | `reviews` |
| customerReviews.starRating | `rating` |
| Browse node rank (nếu có / scrape) | `bsr` |
| detailPageURL | `url` |

> BSR & monthly sales: Creators API **không luôn expose BSR**. Hackathon thường: (a) ước từ review velocity, (b) Keepa/CamelCamelCamel-style third party, (c) parse public product page cẩn thận (ToS risk).

### 2B. Public page signals (bổ sung, không phải official API)
- Search: `https://www.amazon.com/s?k={query}`
- Product: `/dp/{ASIN}`
- Signals: rating, ratings count, “bought in past month”, badge Best Seller, price, bullet points  
→ chỉ dùng khi official thiếu field; cache + throttle.

---

## 3. SHOPEE (vn) — open.shopee.com

### 3A. Official Partner API v2 (seller-scoped)

| | |
|---|---|
| Docs | https://open.shopee.com/ |
| Live | `https://partner.shopeemobile.com` |
| Auth | `partner_id` + `sign` (HMAC) + `access_token` + `shop_id` + `timestamp` |

**Product module (shop của mình — không phải marketplace-wide search public):**

| API | Path | Dùng |
|---|---|---|
| get_item_list | `/api/v2/product/get_item_list` | List item_id shop |
| search_item | `/api/v2/product/search_item` | Search trong shop (`item_name`, sku) |
| get_item_base_info | `/api/v2/product/get_item_base_info` | name, price_info, stock, category_id, images, desc |
| get_model_list | `/api/v2/product/get_model_list` | Variants |
| get_item_extra_info | (module product) | sales / liked (tuỳ region/version) |
| get_comment | `/api/v2/product/get_comment` | Reviews |
| get_category | `/api/v2/product/get_category` | Category tree |
| get_attributes | `/api/v2/product/get_attributes` | Attr schema |

> **Giới hạn quan trọng:** Open Platform = **quản lý shop seller**, không phải public catalog search toàn Shopee như buyer app. Để research đối thủ marketplace-wide cần nguồn khác (affiliate/data partner, hoặc dataset tĩnh cho demo).

### 3B. Buyer-side (không official — chỉ nghiên cứu / demo)
App/web Shopee dùng internal hosts kiểu `shopee.vn/api/v4/...` (search, item/get, recommend).  
Pattern phổ biến (thay đổi thường xuyên, có anti-bot):

| Gợi ý path (tham khảo) | Mục đích |
|---|---|
| `/api/v4/search/search_items` | Search |
| `/api/v4/item/get` | Item detail |
| `/api/v4/product/get_shop_info` | Shop |
| `/api/v4/recommend/...` | Related |

**Không hardcode production** — capture HAR riêng `shopee.vn` khi cần, giống Etsy.

**Field map (khi có data):**

| Shopee | Unified |
|---|---|
| `itemid` | `source_id` |
| `name` | `title` |
| `price` / 1e5 | `price` (VND) |
| `historical_sold` / `sold` | `sales_estimate` |
| `item_rating.rating_star` | `rating` |
| `item_rating.rating_count` | `reviews` |
| `liked_count` | `favorites` |
| `shop_name` | `shop` |
| `categories` | `category_path` |

---

## 4. LAZADA (vn)

### 4A. Official — Lazada Open Platform (LAZOP) — seller

| | |
|---|---|
| Docs | https://open.lazada.com/ |
| Auth | App Key/Secret + access token (OAuth) |
| Sign | HMAC-SHA256 |

**Product / catalog APIs (seller):**

| API | Path | Dùng |
|---|---|---|
| GetCategoryTree | `/category/tree/get` | Taxonomy |
| GetCategoryAttributes | `/category/attributes/get` | Attributes |
| GetBrands | `/brands/get` | Brands |
| GetProducts | `/products/get` | Sản phẩm **của seller** |
| Create/Update Product | `/product/create`, `/product/update` | Không dùng cho research |
| SearchSPUs (Seller Center legacy) | `Action=SearchSPUs` | SPU theo category/keyword (seller tooling) |

Endpoint region ví dụ: `https://api.lazada.vn/rest` (VN).

> Giống Shopee: official = **seller ops**, không full public marketplace firehose.

### 4B. Affiliate / public research
- Lazada Affiliate / Creator APIs (tuỳ country) có product query — đăng ký affiliate portal.
- Buyer web internal API thay đổi nhanh — capture HAR `www.lazada.vn` khi implement.

**Field map mục tiêu:**

| Lazada | Unified |
|---|---|
| itemId / sku | `source_id` |
| name | `title` |
| price | `price` |
| review / rating | `reviews` / `rating` |
| sold / volume | `sales_estimate` |
| sellerName | `shop` |
| category path | `category_path` |

---

## 5. ALIEXPRESS

### 5A. Official — Affiliate API (phù hợp research nhất trong 5 sàn)

| | |
|---|---|
| Portal | https://portals.aliexpress.com/ / Taobao Open |
| Gateway | `https://eco.taobao.com/router/rest` hoặc `https://api-sg.aliexpress.com/sync` (tuỳ app) |
| Auth | `app_key` + `sign` (MD5/HMAC) — **không cần user session** cho affiliate product APIs |

**APIs core:**

| method | Mục đích | Field gold |
|---|---|---|
| `aliexpress.affiliate.product.query` | Search keyword/category | title, sale_price, **lastest_volume**, evaluate_rate, shop_id, categories |
| `aliexpress.affiliate.productdetail.get` | Detail theo product_ids | full detail |
| `aliexpress.affiliate.hotproduct.query` | Hot / trending products | demand seeds |
| `aliexpress.affiliate.hotproduct.download` | Bulk hot products | training corpus |
| `aliexpress.affiliate.category.get` | Category tree | taxonomy |
| `aliexpress.affiliate.product.smartmatch` | Recommend | related products |
| `aliexpress.affiliate.featuredpromo.get` | Promo themes | seasonality campaigns |
| `aliexpress.affiliate.featuredpromo.products.get` | Products in promo | seasonal SKUs |
| `aliexpress.affiliate.image.search` | Image search | design similarity |

**`product.query` params:** `keywords`, `category_ids`, `min_sale_price`, `max_sale_price`, `page_no`, `page_size`, `sort` (`LAST_VOLUME_DESC` rất quan trọng cho Demand), `target_currency`, `target_language`, `ship_to_country`, `delivery_days`, `fields`.

**Field map:**

| AE Affiliate | Unified |
|---|---|
| `product_id` | `source_id` |
| `product_title` | `title` |
| `sale_price` | `price` |
| `lastest_volume` | `sales_estimate` / `monthly_sales` |
| `evaluate_rate` | `rating` (proxy %) |
| `shop_id` | `shop_id` |
| `first/second_level_category_*` | `category_path` |
| `product_detail_url` | `url` |
| `product_main_image_url` | `images[0]` |

---

## 6. Ma trận: sàn × nhu cầu PW1

| Nhu cầu | Etsy OpenAPI | Etsy HAR/AJAX | Amazon Creators | Shopee Partner | Lazada Open | AE Affiliate |
|---|---|---|---|---|---|---|
| Keyword search listings | ✅ | ✅ | ✅ | ⚠️ shop only | ⚠️ seller only | ✅ |
| Price | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Reviews / rating | ⚠️ limited | parse | ✅ | ✅ comment API | ⚠️ | evaluate_rate |
| Favorites / liked | ✅ num_favorers | — | — | ⚠️ | — | — |
| Sales volume | ⚠️ estimate | ⚠️ | ⚠️ estimate/BSR | ⚠️ | ⚠️ | ✅ lastest_volume |
| Tags / niche text | ✅ | title only | features | desc | attrs | title |
| Taxonomy | ✅ | ✅ facet map | browse nodes | ✅ | ✅ | ✅ |
| Trending queries | — | ✅ zero-pane + pathways | — | — | — | hotproduct |
| Personalization flag | ✅ | — | title NLP | — | — | title NLP |
| Competitor density | count results | facet counts | totalResultCount | — | — | total_record_count |
| Production fit | NLP→Printway | same | same | same | same | same |

**Legend:** ✅ tốt · ⚠️ partial / shop-scoped / estimate · — không có

---

## 7. Nguồn bổ sung (workflow “7+ sources”)

| Source | API / cách lấy | Feature |
|---|---|---|
| Printway Catalog | CSV/JSON nội bộ | Production Fit ground truth |
| Google Trends | `pytrends` / Trends API | Growth + Seasonality |
| Pinterest | Trends / organic crawl | Design style demand |
| TikTok Shop | Partner API / research tools | Viral demand |
| Walmart | Open API / Affiliates | US competition |
| Facebook Ads Library | Graph API ads_archive | Creative + spend proxy |
| Keepa (Amazon) | Keepa API (trả phí) | BSR history, price history |

---

## 8. Thứ tự triển khai Data Engine (khuyến nghị)

### Phase A — Hackathon MVP (ổn định + đủ train)
1. **Etsy Open API v3** — active listings + taxonomy + shop  
2. **AliExpress Affiliate** — `product.query` sort `LAST_VOLUME_DESC` + `hotproduct`  
3. **Amazon Creators API** (nếu có cred) **hoặc** dataset tĩnh Amazon + thin scrape có kiểm soát  
4. **Printway catalog** JSON  
5. Normalize → embeddings → Opportunity features → score model  

### Phase B — từ HAR Etsy (đã có file)
1. Parser `zero-pane-trending-searches` → seed keywords POD  
2. Parser `get-category-filter-nodes-all` → competition by taxonomy  
3. Parser `listingCards` HTML → listing rows  
4. Parser `queryIngresses` / `search-pathways` → niche graph  

### Phase C — SEA marketplaces
1. Đăng ký Shopee/Lazada partner **nếu** có shop Printway để lấy ground-truth listing của mình  
2. HAR capture Shopee.vn + Lazada.vn cho public search (demo only)  
3. Map sold/rating vào unified schema  

### Phase D — Training
```
raw listings (multi-source)
  → normalize (schema §0)
  → LLM extract {object, occasion, recipient, personalized, material_hint}
  → embed title+tags
  → cluster product_type + niche
  → aggregate metrics per (product_type, niche)
  → label BUILD/WATCH/SKIP (rule + expert)
  → train ranker / classifier Opportunity Score
```

---

## 9. Query seeds gợi ý (POD / Printway)

```
personalized ornament, acrylic ornament, pet memorial, grandpa gift,
custom tshirt, embroidered hoodie, tumbler personalized, name necklace,
wedding gift, baby onesie custom, canvas print, blanket personalized,
mug custom photo, phone case personalized, poster custom, wooden sign
```

Chạy qua: Etsy pathways + AE hotproduct + Amazon SearchItems để expand.

---

## 10. File hiện có trong repo

| File | Nội dung |
|---|---|
| `www.etsy.com.har` | 60 requests — search home decor + full ajax specs |
| `OpportunityOS_Project_Workflow.md` | Architecture + feature engine |
| `HN AI Hackathon 2026 ... Lark Docs.html` | PW1 brief (Product Opportunity Hub) |
| `docs/marketplace_api_catalog_pw1.md` | (file này) |

---

## 11. Next actions (implementation)

1. `connectors/etsy_openapi.py` — listings/active + taxonomy  
2. `connectors/etsy_har_parser.py` — parse HAR → parquet training  
3. `connectors/aliexpress_affiliate.py` — product.query + hotproduct  
4. `connectors/amazon_creators.py` — SearchItems/GetItems  
5. `normalize/listing_schema.py` + `features/opportunity_features.py`  
6. Dataset folder `data/raw/{etsy,amazon,ae}/` + `data/normalized/`  

---

*Generated for PW1 Printway / OpportunityOS — 2026-08-21*
