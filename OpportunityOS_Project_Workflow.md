# OpportunityOS
> AI Product Research Copilot for POD

## 1. Ý tưởng sản phẩm

OpportunityOS là hệ thống AI giúp đội R&D của Printway tìm sản phẩm POD có tiềm năng trước khi thị trường bão hòa.

Người dùng có thể hỏi:

> “Tìm sản phẩm quà tặng personalized đang lên trend, cạnh tranh chưa cao, Printway sản xuất được.”

Ví dụ output:

```text
#1 Pet Memorial Acrylic Ornament
Opportunity Score: 91/100

Demand             94
Growth             96
Competition        78
Revenue Potential  87
Personalization    95
Seasonality        81
Production Fit     96

Recommendation: BUILD

Reason:
Demand tăng nhanh hơn competition.
Phù hợp dây chuyền Acrylic của Printway.
Margin ước tính tốt.

Target niche:
- Pet memorial
- Loss of dog
- Christmas memorial

Suggested launch:
September - October

Material:
3mm clear acrylic
```

---

## 2. Sản phẩm cần trả lời 6 câu hỏi

1. Nên sản xuất cái gì?
2. Sản phẩm nào đang bắt đầu trend?
3. Niche nào demand cao nhưng competition thấp?
4. Người dùng đang thích design / quote / style nào?
5. Printway có sản xuất được không?
6. Nếu launch bây giờ thì cơ hội thành công như thế nào?

```text
Marketplace Data
        ↓
     OpportunityOS
        ↓
Business Decision
```

Không phải:

```text
Marketplace Data
        ↓
   nhiều biểu đồ
        ↓
user tự nghĩ
```

---

## 3. Workflow tổng thể

```text
                    ┌────────────────────┐
                    │ Printway Catalog   │
                    │ CSV / JSON         │
                    └─────────┬──────────┘
                              │
 Etsy ─────┐                  │
           │                  │
 Amazon ───┼──→ Data Engine ──┼─────┐
           │                        │
 Trends ───┘                        ↓
                            Product Normalizer
                                   │
                                   ↓
                             Product Taxonomy
                                   │
                                   ↓
                             Feature Engine
                                   │
                 ┌─────────────────┼───────────────┐
                 ↓                 ↓               ↓
               Demand          Competition      Growth
                 │                 │               │
                 └─────────────────┼───────────────┘
                                   ↓
                         Opportunity Engine
                                   │
                                   ↓
                         Opportunity Score
                                   │
                    ┌──────────────┴─────────────┐
                    ↓                            ↓
              Production Fit               AI Insights
                    │                            │
                    └─────────────┬──────────────┘
                                  ↓
                          Recommendation AI
                                  │
                    BUILD / WATCH / SKIP
                                  │
                                  ↓
                       Product Research Report
```

---

## 4. Flow A — Data Ingestion

MVP chỉ cần làm tốt 3 nguồn:

```text
Etsy
Amazon
Printway Catalog
```

Có thể mở rộng sau:

```text
Google Trends
Pinterest
TikTok Shop
Walmart
Facebook Ads
```

### Etsy data

```json
{
  "title": "Personalized Grandpa Gift From Granddaughter",
  "price": 19.99,
  "sales_estimate": 524,
  "reviews": 210,
  "rating": 4.9,
  "favorites": 1032,
  "shop": "GiftForGrandpa",
  "tags": [
    "grandpa gift",
    "father's day",
    "personalized ornament"
  ]
}
```

### Amazon data

```json
{
  "title": "Custom Grandpa Acrylic Ornament",
  "price": 17.99,
  "bsr": 4312,
  "reviews": 1100,
  "rating": 4.6,
  "monthly_sales": 420
}
```

---

## 5. Flow B — Product Normalization

Marketplace gọi sản phẩm bằng nhiều tên khác nhau.

Ví dụ Etsy:

```text
Personalized Grandpa Gift From Granddaughter
```

Printway Catalog:

```text
Custom Shape Acrylic Ornament
```

Hệ thống phải hiểu đây là cùng một Product Type.

### Pipeline

```text
Listing
   ↓
LLM Extraction
   ↓
Semantic Embedding
   ↓
Vector Search Printway Catalog
   ↓
Rules
   ↓
LLM Reranker
   ↓
Normalized Product
```

### LLM extraction

```json
{
  "object": "ornament",
  "occasion": "father's day",
  "recipient": "grandpa",
  "personalized": true,
  "material_hint": "acrylic"
}
```

### Vector search

```text
1. Custom Shape Acrylic Ornament  0.94
2. Wooden Ornament                0.71
3. Acrylic Plaque                 0.66
```

### Output

```json
{
  "product_type": "Custom Shape Acrylic Ornament",
  "category": "Home Decor",
  "material": "Acrylic",
  "confidence": 0.94
}
```

Mục tiêu:

```text
100 listing khác tên
       ↓
1 Product Type
```

---

## 6. Flow C — Niche Extraction

Product Type và Niche là hai khái niệm khác nhau.

Ví dụ:

```text
Product:
Acrylic Ornament

Niches:
Pet Memorial
Grandpa Gift
First Christmas
Newlywed
Baby's First Christmas
Memorial Mom
```

AI đọc:

```text
title
tags
description
```

Output:

```json
{
  "product": "Acrylic Ornament",
  "niche": "Grandpa Gift",
  "recipient": "Grandfather",
  "occasion": "Father's Day",
  "personalization": "Name + message"
}
```

---

## 7. Flow D — Feature Engine

Mỗi opportunity có các feature:

```text
Demand
Growth
Competition
Revenue
Seasonality
Personalization
Production Fit
```

### Demand

Có thể dựa trên:

```text
sales
reviews velocity
favorites
BSR
search volume
```

### Growth

```text
sales 30 days ago: 100
sales now:         150

growth = +50%
```

Quan trọng hơn:

```text
Demand Growth = +50%
Competition Growth = +12%
```

### Competition

Có thể kết hợp:

```text
listing count
strong seller ratio
review barrier
market concentration
```

Ví dụ:

```text
10,000 listings

nhưng top sellers chiếm 90%
```

=> Khó chen vào.

---

## 8. Opportunity Gap

```text
Opportunity Gap =
Demand Growth - Competition Growth
```

Ví dụ:

```text
Pet Memorial

Demand Growth:      +43%
Competition Growth: +12%

Opportunity Gap:    +31%
```

Business insight:

> Demand đang tăng nhanh hơn tốc độ cạnh tranh.

---

## 9. Opportunity Score

Đề xuất trọng số:

```text
Demand                   20%
Growth                    20%
Competition               15%
Revenue Potential         15%
Personalization Potential 10%
Seasonality               10%
Production Fit            10%
```

Công thức:

```text
Opportunity Score =

Demand × .20
+ Growth × .20
+ Competition × .15
+ Revenue × .15
+ Personalization × .10
+ Seasonality × .10
+ ProductionFit × .10
```

Ví dụ:

```text
Demand          92
Growth          95
Competition     75
Revenue         86
Personalization 98
Seasonality     82
Production Fit  96
```

Output:

```text
Opportunity Score = 88/100
```

---

## 10. Competition Score

Nên định nghĩa theo hướng:

```text
Competition Opportunity = 80
```

nghĩa là:

> cạnh tranh thấp, opportunity tốt.

UI:

```text
Competition Opportunity
████████░░ 80

Low competition
```

---

## 11. Cross-market Normalization

Không nên so raw metric trực tiếp giữa marketplace.

Ví dụ:

```text
Etsy demand percentile:   91
Amazon demand percentile: 84
Google trend percentile:  88
```

Sau đó:

```text
Demand =
Etsy × .45
+ Amazon × .45
+ Trends × .10
```

---

## 12. Production Fit

Ví dụ Printway catalog:

```json
{
  "product_type": "Custom Acrylic Ornament",
  "material": "Acrylic",
  "difficulty": 2,
  "margin_min": 35,
  "margin_max": 55,
  "available": true
}
```

Production Fit có thể dựa trên:

```text
Material compatibility
Manufacturing capability
Difficulty
Margin
Existing equipment
```

Ví dụ:

```text
Market Opportunity: 94
Production Fit: 22
```

=> Recommendation:

```text
SKIP
```

Reason:

> Market hấp dẫn nhưng Printway hiện không có production capability phù hợp.

---

## 13. Recommendation Engine

Ba trạng thái chính:

```text
BUILD
WATCH
SKIP
```

Rule gợi ý:

```text
score >= 80
production fit >= 75
→ BUILD
```

```text
score 60-79
→ WATCH
```

```text
score < 60
hoặc production fit thấp
→ SKIP
```

LLM dùng để giải thích:

```text
BUILD

Why:
• Etsy demand +44% trong 30 ngày.
• Amazon cũng xuất hiện growth signal.
• Competition chỉ tăng 13%.
• Personalization potential cao.
• Acrylic production fit đạt 94%.
```

---

## 14. AI Copilot

User hỏi:

```text
What should we launch for Q4?
```

Workflow:

```text
Question
   ↓
Intent Parser
   ↓
Filters
   ↓
Database Query
   ↓
Opportunity Engine
   ↓
Top Opportunities
   ↓
LLM
   ↓
Answer
```

Ví dụ:

> Find personalized Christmas products with high growth and acrylic production fit.

AI parse thành:

```json
{
  "season": "Q4",
  "personalized": true,
  "material": "acrylic",
  "min_growth": 20
}
```

---

## 15. Homepage

```text
┌────────────────────────────────────────────┐
│ OpportunityOS                                 │
│ Find your next winning product             │
│                                            │
│ [ Ask OpportunityOS anything...            ] │
│                                            │
│ Etsy ✓ Amazon ✓ Q4 ✓ Acrylic ✓            │
└────────────────────────────────────────────┘
```

Opportunity Card:

```text
Emerging Opportunities

#1 Pet Memorial Acrylic Ornament
91 / 100

Growth       +43%
Competition  Low
Prod. Fit    96

🔥 Rising Fast

[BUILD] [View Research]
```

---

## 16. Opportunity Feed

Route:

```text
/opportunities
```

| Product | Score | Growth | Competition | Fit | Action |
|---|---:|---:|---|---:|---|
| Pet Memorial Ornament | 91 | +43% | Low | 96 | BUILD |
| Grandpa Ornament | 87 | +31% | Medium | 94 | BUILD |
| Gardening Sign | 71 | +14% | Medium | 81 | WATCH |
| Metal Pet Tag | 58 | +4% | High | 89 | SKIP |

Filters:

```text
Marketplace
Season
Category
Material
Niche
Score
Growth
Competition
```

---

## 17. Product Detail

Route:

```text
/product/:id
```

Header:

```text
Pet Memorial Acrylic Ornament

Opportunity Score
91
```

Breakdown:

```text
Demand              94
Growth              96
Competition         82
Revenue             86
Personalization     95
Seasonality         83
Production Fit      96
```

Why now:

```text
Demand       +43%
Competition  +12%

Opportunity Gap +31%
```

---

## 18. Marketplace Evidence

```text
Evidence

ETSY
842 listings analysed
Median price: $18.9
Est revenue growth: +41%

AMAZON
312 products analysed
Median price: $19.7
Demand signal: Strong
```

---

## 19. Design Insight

```text
Trending Design Elements

Colors
• Black
• Gold
• Transparent

Themes
• Angel wings
• Paw prints
• Memorial hearts

Quotes
• Forever in our hearts
• Always by my side
• Until we meet again

Personalization
• Pet name
• Year
• Photo
```

AI gợi ý:

```text
Suggested design direction

Minimal acrylic ornament
Black serif typography
Pet photo
Gold memorial accent
```

---

## 20. Niche Compare

Route:

```text
/compare
```

Ví dụ:

```text
Pet Memorial
Grandpa Gift
Gardening
```

| Metric | Pet | Grandpa | Gardening |
|---|---:|---:|---:|
| Opportunity | 91 | 84 | 68 |
| Growth | 94 | 81 | 63 |
| Competition | 84 | 69 | 65 |
| Fit | 96 | 95 | 83 |
| Decision | BUILD | BUILD | WATCH |

AI:

```text
Winner: Pet Memorial

Reason:
Demand growth mạnh nhất,
competition growth thấp,
production fit acrylic rất cao.
```

---

## 21. Product Research Report

Button:

```text
Generate Research Report
```

Output:

```text
PRODUCT RESEARCH REPORT

Product:
Pet Memorial Acrylic Ornament

Decision:
BUILD

Opportunity Score:
91 / 100

Market Evidence
...

Recommended Niches
...

Design Insights
...

Recommended Material
3mm Clear Acrylic

Recommended Price
$17.99–22.99

Launch Window
Sep 15 – Oct 15

Initial Test
15 designs

Risk
Competition may increase approaching Christmas.

Next Action
Create 15 designs and validate CTR.
```

Export:

```text
Markdown
PDF
```

---

## 22. Early Trend Radar

Cron job mỗi ngày:

```text
Yesterday
vs
Today
```

Detect:

```text
keyword velocity
sales velocity
listing growth
cross-platform appearance
```

Alert:

```text
🚨 Early Opportunity

"Pet Loss Christmas Ornament"

Demand velocity +67%
Competition velocity +8%

Confidence: High
```

---

## 23. Database

PostgreSQL + pgvector.

Tables:

```text
marketplaces
products
listings
product_types
niches
keywords
trend_snapshots
opportunity_scores
production_catalog
reports
```

### listings

```text
id
marketplace
external_id
title
description
price
sales
reviews
rating
url
product_type_id
niche_id
created_at
```

### opportunity_scores

```text
product_type
niche

demand_score
growth_score
competition_score
revenue_score
personalization_score
seasonality_score
production_fit_score

overall_score

recommendation
reason
```

---

## 24. Tech Stack

### Frontend

```text
Next.js
Tailwind CSS
shadcn/ui
Recharts
```

### Backend

```text
FastAPI
Python
```

### Database

```text
PostgreSQL
pgvector
```

### AI

```text
Gemini / GPT / Claude
```

### Embedding

```text
Embedding Model
+
pgvector
```

### ETL

```text
Python
Pandas
```

### Report

```text
Markdown
→ HTML
→ PDF
```

---

## 25. Backend Modules

```text
services/

ingestion/
    etsy.py
    amazon.py

normalization/
    extractor.py
    embedding.py
    matcher.py
    reranker.py

trends/
    velocity.py
    seasonality.py

scoring/
    demand.py
    growth.py
    competition.py
    revenue.py
    production_fit.py
    opportunity.py

insights/
    niche.py
    design.py

copilot/
    agent.py
    tools.py

reports/
    generator.py
```

---

## 26. Repo Structure

```text
opportunityos/

apps/
    web/
    api/

services/
    ingestion/
    normalization/
    scoring/
    trends/
    insights/
    reports/

packages/
    database/
    shared/

data/
    printway_catalog.csv
    sample_etsy.json
    sample_amazon.json

docs/
    architecture.md
    scoring.md
```

---

## 27. API

### Opportunities

```http
GET /api/opportunities
```

```http
GET /api/opportunities/{id}
```

### Research

```http
POST /api/research
```

```json
{
  "query": "personalized pet gifts for Q4"
}
```

### Normalize

```http
POST /api/normalize
```

Input:

```json
{
  "title": "Personalized Grandpa Gift From Granddaughter"
}
```

Output:

```json
{
  "product_type": "Custom Shape Acrylic Ornament",
  "confidence": 0.94
}
```

### Compare

```http
POST /api/compare
```

### Report

```http
POST /api/report
```

---

## 28. AI Architecture

Không nên làm:

```text
user
 ↓
GPT
 ↓
random answer
```

Nên làm:

```text
User
 ↓
AI Agent
 ↓
Tool Calls
 ├── search_market
 ├── get_trends
 ├── compare_niches
 ├── get_production_fit
 ├── calculate_opportunity
 └── generate_report
 ↓
Database / Engine
 ↓
AI explanation
```

Cách pitch technical:

> LLM không tính Opportunity Score. Score được tính deterministic từ dữ liệu. LLM được dùng cho semantic normalization, intent understanding và explanation.

---

## 29. Ba Demo Flow Chính

### Demo 1 — Discover

User:

> Find the fastest growing personalized products for Q4.

Output:

```text
1 Pet Memorial Ornament   91 BUILD
2 Family Ornament         87 BUILD
3 Couple Ornament         82 BUILD
```

### Demo 2 — Normalize + Score

Input:

```text
Personalized Grandpa Gift For Father's Day
From Granddaughter
```

System:

```text
Detected:

Custom Shape Acrylic Ornament
Home Decor
Acrylic

Confidence 94%
```

Sau đó:

```text
Opportunity Score 88

BUILD
```

### Demo 3 — Decision

User:

> Compare Pet Memorial, Memorial Family and Gardening.

Output:

```text
Pet Memorial        91 BUILD
Family Memorial     83 BUILD
Gardening           67 WATCH
```

Sau đó generate report.

---

## 30. Demo Trick

User hỏi:

> Why shouldn't we launch this product?

AI trả:

```text
Although market demand is strong (92),
Printway Production Fit is only 34.

Main issue:
• material not supported
• manufacturing difficulty high
• estimated margin below threshold

Recommendation:
SKIP
```

Điểm mạnh:

> Hệ thống không phải cứ trend là recommend bán.

---

## 31. MVP Bắt Buộc

```text
1. Etsy data
2. Amazon data
3. Printway Catalog
4. Product Normalization
5. Opportunity Score
6. BUILD/WATCH/SKIP
7. Opportunity Feed
8. Detail page
9. AI Copilot
10. Generate Report
```

---

## 32. Bonus Sau MVP

```text
Early Trend Alert
Design Insight
Competitor Tracker
Google Trends
Pinterest Trends
Image analysis
```

---

## 33. Phân Chia Team 4 Người

### Person 1 — Frontend

```text
Dashboard
Opportunity Detail
Compare
Copilot UI
Report UI
```

### Person 2 — Data

```text
Etsy
Amazon
ETL
Database
Trend calculations
```

### Person 3 — AI

```text
Normalization
Embeddings
LLM reranker
Copilot
Design insight
```

### Person 4 — Backend / Scoring

```text
API
Opportunity Score
Production Fit
Integration
Deployment
```

---

## 34. Thứ Tự Code

```text
Printway taxonomy
        ↓
Product normalization
        ↓
Sample marketplace data
        ↓
Aggregation
        ↓
Opportunity Score
        ↓
Recommendation
        ↓
API
        ↓
UI
        ↓
AI Copilot
        ↓
Report
        ↓
Bonus
```

---

## 35. Ba Thứ Cốt Lõi Để Win

### 1. Normalization chuẩn

```text
random marketplace title
→ đúng Printway Product Type
```

### 2. Score explain được

Không:

```text
AI says 91
```

Mà:

```text
91 because:

Demand       +18.4
Growth       +19.2
Competition  +12.3
Revenue      +12.9
...
```

### 3. Recommendation actionable

Không:

> Pet gifts are trending.

Mà:

> BUILD Custom Shape Acrylic Ornament cho niche Pet Memorial, material 3mm clear acrylic, launch trước Q4, test 15 design tập trung vào photo + pet name.

---

## 36. Positioning

Không nên pitch:

> OpportunityOS is an AI marketplace analytics platform.

Nên pitch:

> OpportunityOS tells Printway what to build next — before everyone else starts selling it.

Hoặc:

> From marketplace noise to one product decision.

---

## 37. USP

Các tool khác:

```text
keyword
↓
charts
↓
user tự research
```

OpportunityOS:

```text
cross-market data
↓
normalize
↓
score
↓
factory fit
↓
BUILD / WATCH / SKIP
```

USP:

> We don't tell you what's trending. We tell you what you should manufacture.

---

## 38. Product Flow Cuối Cùng

```text
DISCOVER
   ↓
UNDERSTAND
   ↓
SCORE
   ↓
DECIDE
   ↓
ACT
```

Ví dụ:

```text
Discover
Pet Memorial đang nổi

Understand
Đây là Acrylic Ornament

Score
91/100

Decide
BUILD

Act
Material: Acrylic
Niche: Pet Memorial
Launch: Sep-Oct
15 initial designs
```

Toàn bộ UI, backend và AI nên phục vụ flow này.
