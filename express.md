# Express / Koa / Hapi — `@indexboost/node`

**npm package:** [`@indexboost/node`](https://www.npmjs.com/package/@indexboost/node)

See the full guide in [`express/README.md`](./express/README.md).

## Quick start

```bash
npm install @indexboost/node
```

```typescript
import express from "express";
import { createMiddleware } from "@indexboost/node";

const app = express();
app.use(createMiddleware({ token: process.env.INDEXBOOST_TOKEN! }));
```

For Koa and Hapi adapters see [`express/README.md`](./express/README.md).
