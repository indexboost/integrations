# IndexBoost — Netlify Edge Functions

Serve rendered HTML to crawlers using **Netlify Edge Functions** (Deno runtime, runs at the CDN edge).

## Quick Start

### 1. Copy the files

```
netlify/
  netlify.toml
  netlify/edge-functions/render.ts
```

Place `netlify.toml` in your project root and the edge function in `netlify/edge-functions/`.

### 2. Set the environment variable

```bash
netlify env:set INDEXBOOST_TOKEN your_token_here
```

Or set it in **Netlify UI → Site Settings → Environment Variables**.

### 3. Deploy

```bash
netlify deploy --prod
```

## How It Works

The Edge Function runs **before** Netlify serves any file. If the request comes from a crawler (Googlebot, Bingbot, etc.) and is not a static asset, it fetches the rendered HTML from IndexBoost and returns it. All other requests fall through to the normal Netlify behavior via `context.next()`.

## Configuration

| Env Var | Required | Description |
|---|---|---|
| `INDEXBOOST_TOKEN` | ✅ | Your IndexBoost API token |

## Supported Frameworks

Works with any static site or SPA deployed on Netlify: Next.js (static export), Nuxt static, Gatsby, Hugo, Jekyll, Astro, SvelteKit, etc.

> **Note:** If you use Next.js with server-side rendering on Netlify, prefer the [`@indexboost/next`](../nextjs/) package instead.
