# Cloudflare Workers

No npm package required — deploy the Cloudflare Worker script.

See the full guide in [`cloudflare/README.md`](./cloudflare/README.md).

## Quick start

```bash
cd cloudflare
npm install
wrangler secret put INDEXBOOST_TOKEN
wrangler deploy
```

## How it works

The Cloudflare Worker intercepts requests at the CDN edge, detects crawler `User-Agent` strings, and proxies those requests to `https://render.getindexboost.com/`. Human traffic is forwarded to your origin without any modification.
