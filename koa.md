# Koa — `@indexboost/node`

Koa is supported via the same `@indexboost/node` package as Express.

**npm package:** [`@indexboost/node`](https://www.npmjs.com/package/@indexboost/node)

```bash
npm install @indexboost/node
```

```typescript
import Koa from "koa";
import { createKoaMiddleware } from "@indexboost/node";

const app = new Koa();
app.use(createKoaMiddleware({ token: process.env.INDEXBOOST_TOKEN! }));
```

See [`express/README.md`](./express/README.md) for full options.
