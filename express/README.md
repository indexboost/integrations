# @indexboost/node

IndexBoost Render middleware for Node.js. Works with **Express**, **Koa**, **Hapi**, **Fastify** and any other Node.js HTTP framework.

Detects crawler User-Agents (Googlebot, GPTBot, ClaudeBot, Bingbot, etc.) and transparently returns rendered HTML from `render.getindexboost.com`, so bots always see complete, indexable content — even on SPAs with heavy JavaScript.

## Installation

```bash
npm install @indexboost/node
# or
pnpm add @indexboost/node
```

## Quick start — Express

```typescript
import express from "express";
import { createMiddleware } from "@indexboost/node";

const app = express();

// Add as the FIRST middleware, before your routes
app.use(
  createMiddleware({
    token: process.env.INDEXBOOST_TOKEN!, // from app.getindexboost.com
  })
);

app.get("/", (req, res) => res.send("<h1>Hello</h1>"));
app.listen(3000);
```

## Quick start — Koa

```typescript
import Koa from "koa";
import { createKoaMiddleware } from "@indexboost/node/koa";

const app = new Koa();
app.use(createKoaMiddleware({ token: process.env.INDEXBOOST_TOKEN! }));
```

## Options

| Option | Type | Default | Description |
|---|---|---|---|
| `token` | `string` | **required** | Render token from app.getindexboost.com |
| `serviceUrl` | `string` | `https://render.getindexboost.com` | Override render service URL |
| `crawlerPattern` | `RegExp` | built-in list | Custom crawler UA regexp |
| `ignoredExtensions` | `string[]` | built-in list | Extra extensions to skip |
| `skip` | `(req) => boolean` | — | Custom skip logic |
| `timeout` | `number` | `30000` | Fetch timeout in ms |

## How it works

```
Crawler request
  ↓
@indexboost/node middleware
  ↓ isCrawler(user-agent)?
  ├─ No  → next() → your app handles it normally
  └─ Yes → fetch https://render.getindexboost.com/?url=<page>
              header: X-INDEXBOOST-TOKEN: <token>
              ↓
           Returns rendered HTML to the crawler
```

## Environment variables

```bash
# .env
INDEXBOOST_TOKEN=your_token_here
```

Get your token at [app.getindexboost.com](https://app.getindexboost.com) → Sites → your site → Render Tokens.

## Detected crawlers

Googlebot, Bingbot, GPTBot, ClaudeBot, PerplexityBot, DuckDuckBot, Slurp, NaverBot, YandexBot, Baiduspider, FacebookExternalHit, Twitterbot, LinkedInBot, WhatsApp, TelegramBot, Applebot, Rogerbot, SemrushBot, AhrefsBot, Bytespider, DotBot, MJ12bot, Pinterestbot — and [more](https://getindexboost.com/docs/crawlers).

## License

MIT
