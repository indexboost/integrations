# Next.js — `@indexboost/next`

**npm package:** [`@indexboost/next`](https://www.npmjs.com/package/@indexboost/next)

See the full guide in [`nextjs/README.md`](./nextjs/README.md).

## Quick start

```bash
npm install @indexboost/next
```

Create `middleware.ts` at the root of your Next.js project:

```typescript
import { createMiddleware } from "@indexboost/next";

export const middleware = createMiddleware({
  token: process.env.INDEXBOOST_TOKEN!,
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2)).*)"  ],
};
```

```bash
# .env.local
INDEXBOOST_TOKEN=your_token_here
```
