# Vercel Edge Functions

No npm package required — deploy the Edge Function.

See the full guide in [`vercel/README.md`](./vercel/README.md).

## Quick start

1. Copy [`vercel/api/render.js`](./vercel/api/render.js) into your project's `api/` directory.
2. Copy the rewrite rules from [`vercel/vercel.json`](./vercel/vercel.json) into your `vercel.json`.
3. Set `INDEXBOOST_TOKEN` in your Vercel project environment variables.
4. Deploy: `vercel --prod`

## How it works

A Vercel Edge Function intercepts requests matching the crawler detection pattern and proxies them to `https://render.getindexboost.com/` with your token. Human traffic is served by your normal Vercel deployment.
