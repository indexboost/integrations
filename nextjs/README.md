# @indexboost/next

IndexBoost Render middleware for **Next.js 14+** (App Router and Pages Router).

Detects crawler User-Agents (Googlebot, GPTBot, ClaudeBot, Bingbot, etc.) at the Next.js Middleware layer and transparently returns rendered HTML from `render.getindexboost.com`.

Works on both **Vercel Edge Runtime** and **Node.js runtime**.

## Installation

```bash
npm install @indexboost/next
# or
pnpm add @indexboost/next
```

## Setup

Create `middleware.ts` at the **root of your project** (next to `package.json`):

```typescript
// middleware.ts
import { createMiddleware } from "@indexboost/next";

export const middleware = createMiddleware({
  token: process.env.INDEXBOOST_TOKEN!, // from app.getindexboost.com
});

// Apply to all routes except Next.js internals and static files
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2)).*)",
  ],
};
```

Add the token to your environment:

```bash
# .env.local
INDEXBOOST_TOKEN=your_token_here
```

Get your token at [app.getindexboost.com](https://app.getindexboost.com) → Sites → your site → Render Tokens.

## Options

| Option | Type | Default | Description |
|---|---|---|---|
| `token` | `string` | **required** | Render token |
| `serviceUrl` | `string` | `https://render.getindexboost.com` | Override render URL |
| `crawlerPattern` | `RegExp` | built-in list | Custom crawler UA regexp |
| `skip` | `(req: NextRequest) => boolean` | — | Custom skip logic |
| `timeout` | `number` | `25000` | Fetch timeout in ms |

## Advanced usage

```typescript
// middleware.ts
import { createMiddleware } from "@indexboost/next";

export const middleware = createMiddleware({
  token: process.env.INDEXBOOST_TOKEN!,

  // Skip render caching for admin and API routes
  skip: (req) =>
    req.nextUrl.pathname.startsWith("/admin") ||
    req.nextUrl.pathname.startsWith("/dashboard"),
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
```

## Vercel deployment

Add the token as an environment variable in your Vercel project:

```
Vercel Dashboard → Project → Settings → Environment Variables
INDEXBOOST_TOKEN = your_token_here
```

## How it works

```
Incoming request
  ↓
Next.js Middleware (middleware.ts)
  ↓ isCrawler(user-agent)?
  ├─ No  → NextResponse.next() → Next.js handles normally
  └─ Yes → fetch https://render.getindexboost.com/?url=<page>
              header: X-INDEXBOOST-TOKEN: <token>
              ↓
           Returns rendered HTML to the crawler
```

## License

MIT
