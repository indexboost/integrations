# Nuxt 3 — `@indexboost/nuxt`

**npm package:** [`@indexboost/nuxt`](https://www.npmjs.com/package/@indexboost/nuxt)

See the full guide in [`nuxt/README.md`](./nuxt/README.md).

## Quick start

```bash
npm install @indexboost/nuxt
```

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ["@indexboost/nuxt"],
  runtimeConfig: {
    indexboostToken: process.env.INDEXBOOST_TOKEN,
  },
});
```

```bash
# .env
INDEXBOOST_TOKEN=your_token_here
```
