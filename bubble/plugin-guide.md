# IndexBoost — Bubble (No-Code)

Integrate IndexBoost render caching into your **Bubble** app using the **API Connector** plugin to serve rendered HTML to web crawlers.

> **Note:** Bubble is a fully managed no-code platform and does not expose HTTP request/response middleware. The integration is done at the **DNS/CDN layer** in front of your Bubble app, not inside Bubble itself.

---

## Recommended Approach: Cloudflare Worker in front of Bubble

The cleanest way to add render caching to a Bubble app is to proxy it through **Cloudflare Workers** (or any supported CDN/proxy from this list).

### Steps

1. Your Bubble app is hosted at `yourapp.bubbleapps.io` (or a custom domain).
2. Point your custom domain's DNS to **Cloudflare** (free plan is sufficient).
3. Deploy the IndexBoost Cloudflare Worker:

   👉 See [`integrations/cloudflare/`](../cloudflare/)

4. Set the `INDEXBOOST_TOKEN` secret in the Cloudflare dashboard.
5. The worker will intercept crawler requests and serve rendered HTML from IndexBoost, while passing all regular user traffic through to Bubble.

---

## Alternative: Netlify as Reverse Proxy

If you prefer Netlify:

1. Create a `netlify.toml` that proxies `/*` to your Bubble app URL.
2. Add the IndexBoost Edge Function.

   👉 See [`integrations/netlify/`](../netlify/)

```toml
# netlify.toml
[[redirects]]
  from = "/*"
  to = "https://yourapp.bubbleapps.io/:splat"
  status = 200
  force = true

[[edge_functions]]
  path = "/*"
  function = "render"
```

---

## Bubble API Connector (Supplementary)

If you want to **trigger a render from within Bubble** (e.g., after publishing new content), you can use the API Connector plugin to call the IndexBoost API:

### 1. Install the API Connector plugin

**Bubble Editor → Plugins → Add plugins → API Connector → Install**

### 2. Create an API call

| Field | Value |
|---|---|
| API Name | IndexBoost |
| Authentication | None (use header) |
| Method | GET |
| URL | `https://render.getindexboost.com/?url=<url>` |
| Header | `X-INDEXBOOST-TOKEN` → your token |
| Parameter | `url` (type: text, sent as query param) |

### 3. Use in workflows

In a Bubble workflow (e.g., "When a page is published"), call the API Connector action with the page URL to warm the IndexBoost cache.

---

## How Crawler Detection Works

IndexBoost (via Cloudflare Worker or Netlify Edge Function) detects crawlers by `User-Agent`. Googlebot, Bingbot, and 30+ other crawlers receive the rendered HTML. Regular visitors pass through to your Bubble app with zero latency impact.

---

## Requirements

| Requirement | Notes |
|---|---|
| Custom domain | Required (not `yourapp.bubbleapps.io`) |
| Cloudflare (free) | Easiest CDN integration |
| IndexBoost token | Get yours at [getindexboost.com](https://getindexboost.com) |

---

## Supported CDN Integrations

| CDN | Guide |
|---|---|
| Cloudflare Workers | [cloudflare/](../cloudflare/) |
| Netlify Edge | [netlify/](../netlify/) |
| Fastly | [fastly/](../fastly/) |
| Akamai | [akamai/](../akamai/) |
| Amazon CloudFront | [cloudfront/](../cloudfront/) |
