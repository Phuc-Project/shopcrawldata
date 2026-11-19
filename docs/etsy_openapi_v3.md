# Etsy Open API v3 — notes for OpportunityOS / PW1

Source: https://developers.etsy.com/documentation/

## Auth (required)

Every request:

```http
x-api-key: <keystring>:<shared_secret>
```

Scoped / private endpoints also need:

```http
Authorization: Bearer <access_token>
```

- Register app: https://www.etsy.com/developers  
- Keys: https://www.etsy.com/developers/your-apps  
- OAuth connect: `https://www.etsy.com/oauth/connect` (PKCE S256)  
- Token: `POST https://api.etsy.com/v3/public/oauth/token`

### App types

| Type | Use for PW1 |
|---|---|
| **Seller App** | Own Printway shop only — fast approve |
| **Personal App** | Limited research beyond own shop — needs review |
| **Commercial Access** | Scale multi-seller — manual review |

> API Terms: **screen-scraping is not allowed** for commercial apps. Prefer Open API for production; HAR/web AJAX only for hackathon offline demos / field discovery.

## Hosts

| Use | Base |
|---|---|
| REST v3 | `https://api.etsy.com/v3` |
| Ping | `GET /application/openapi-ping` |
| Listings search | `GET /application/listings/active?keywords=` |
| Listing detail | `GET /application/listings/{id}` |
| Taxonomy | `GET /application/seller-taxonomy/nodes` |

(Some client libs still show `openapi.etsy.com` — official quickstart uses **`api.etsy.com`**.)

## Rate limits

- Application-level **QPS** + **QPD** (sliding 24h window)
- Headers: `x-limit-per-second`, `x-remaining-this-second`, `x-limit-per-day`, `x-remaining-today`
- On exceed: HTTP **429** + `retry-after`
- See portal for your app’s quota: https://www.etsy.com/developers/your-apps

## Env for OpportunityOS

```bash
export ETSY_API_KEY='keystring:shared_secret'
export ETSY_ACCESS_TOKEN='userId.token...'   # optional, scoped calls
```

```bash
python -m opportunity_os.cli ping-etsy
python -m opportunity_os.cli run --live-etsy
```

## PW1 endpoints we use

See `opportunity_os/connectors/registry.py` → `etsy.*` and `docs/marketplace_api_catalog_pw1.md`.
