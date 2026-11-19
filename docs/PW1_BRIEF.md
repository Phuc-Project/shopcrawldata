# PW1 — Product Opportunity Hub (AI Product Research Copilot)

> Nguồn: [Lark Wiki](https://ecomdycom.sg.larksuite.com/wiki/WQptwo5gtiDFvbke9nKlSBRdgyc)  
> (Wiki private — cần login; body HTML export thiếu block. Spec chi tiết bám `OpportunityOS_Project_Workflow.md` + TOC đề thi.)

## Tóm tắt yêu cầu (từ export)

> Biến các dữ liệu rời rạc từ **7+ nguồn marketplace** thành một **Opportunity Score** duy nhất với **01 bản đề xuất sản phẩm hành động được**, giúp đội **R&D In-house của Printway** phát hiện cơ hội trước khi thị trường bão hòa.

## Cấu trúc đề (TOC)

1. Vấn đề  
2. Đối tượng người dùng  
3. Nhiệm vụ  
4. Đầu vào  
5. Đầu ra mong đợi  
6. Yêu cầu bắt buộc  
7. Tech Stack gợi ý  
8. Tình huống mẫu  
9. Tiêu chí chấm điểm  
10. Sản phẩm cần nộp  
11. Độ khó / Nhãn  

## 6 câu hỏi sản phẩm phải trả lời

1. Nên sản xuất cái gì?  
2. Sản phẩm nào đang bắt đầu trend?  
3. Niche nào demand cao nhưng competition thấp?  
4. User thích design / quote / style nào?  
5. Printway có sản xuất được không?  
6. Launch bây giờ thì cơ hội thế nào?  

## MVP bắt buộc (Workflow §31)

```
1. Etsy data
2. Amazon data
3. Printway Catalog
4. Product Normalization
5. Opportunity Score
6. BUILD / WATCH / SKIP
7. Opportunity Feed
8. Detail page
9. AI Copilot
10. Generate Report
```

## Opportunity Score (weights)

| Feature | Weight |
|---|---:|
| Demand | 20% |
| Growth | 20% |
| Competition | 15% |
| Revenue Potential | 15% |
| Personalization | 10% |
| Seasonality | 10% |
| Production Fit | 10% |

## Recommendation

- `BUILD`: score ≥ 80 **và** production_fit ≥ 75  
- `WATCH`: score 60–79  
- `SKIP`: score < 60 **hoặc** production fit thấp  

## Tech stack (gợi ý workflow)

- Frontend: Next.js · Tailwind · shadcn/ui · Recharts  
- Backend: FastAPI · Python  
- DB: PostgreSQL + pgvector (MVP có thể JSONL)  
- AI: Gemini / GPT / Claude — **LLM không tính score**; score deterministic  
- ETL: Python · Pandas  

## 3 demo flow

1. **Discover** — “fastest growing personalized Q4” → ranked BUILD list  
2. **Normalize + Score** — title → product type + score + BUILD/WATCH/SKIP  
3. **Decision** — compare niches → winner + research report  

## Positioning

> OpportunityOS tells Printway **what to build next** — before everyone else starts selling it.  
> We don't tell you what's trending. We tell you **what you should manufacture**.

## Implementation map (repo)

| Brief item | Code |
|---|---|
| Etsy data | `opportunity_os/connectors/etsy*.py` + HAR |
| Amazon data | `connectors/amazon.py` + `data/raw/amazon/` |
| Printway catalog | `data/printway/catalog.json` |
| Normalization | `normalize/` |
| Opportunity Score | `features/engine.py` |
| BUILD/WATCH/SKIP | rules in engine + settings.yaml |
| Feed / Detail API | `apps/api` FastAPI |
| AI Copilot | `services/copilot` |
| Report | `services/reports` |
| Full API catalog 5 sàn | `docs/marketplace_api_catalog_pw1.md` |
