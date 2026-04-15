# Hapi — `@indexboost/node`

Hapi is supported via the same `@indexboost/node` package as Express and Koa.

See the full guide in [`express/README.md`](./express/README.md) (Hapi section).

## Quick start

```bash
npm install @indexboost/node
```

```typescript
import Hapi from "@hapi/server";
import { indexBoostHapiPlugin } from "@indexboost/node/hapi";

const server = Hapi.server({ port: 3000 });

await server.register({
  plugin: indexBoostHapiPlugin,
  options: {
    token: process.env.INDEXBOOST_TOKEN!,
  },
});
```

```bash
# .env
INDEXBOOST_TOKEN=your_token_here
```
