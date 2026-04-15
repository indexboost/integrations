# Netlify Edge Functions

No npm package required — copy the Edge Function file.

See the full guide in [`netlify/README.md`](./netlify/README.md).

## Quick start

1. Copy [`netlify/netlify/edge-functions/render.ts`](./netlify/netlify/edge-functions/render.ts) into your project's `netlify/edge-functions/` directory.
2. Set `INDEXBOOST_TOKEN` in your Netlify site environment variables (Netlify UI → Site settings → Environment variables).
3. Deploy: `netlify deploy --prod`

## How it works

The Deno-based Edge Function runs on Netlify's edge network, detects crawler `User-Agent` strings, and proxies those requests to `https://render.getindexboost.com/`. All other traffic hits your normal site.
