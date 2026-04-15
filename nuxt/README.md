# @indexboost/nuxt

IndexBoost Render module for **Nuxt 3**.

Detects crawlers (Googlebot, GPTBot, ClaudeBot, etc.) at the Nitro server layer and returns rendered HTML from `render.getindexboost.com`.

## Installation

```bash
npm install @indexboost/nuxt
```

## Setup

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ["@indexboost/nuxt"],

  indexboost: {
    token: process.env.INDEXBOOST_TOKEN, // from app.getindexboost.com
  },
});
```

```bash
# .env
INDEXBOOST_TOKEN=your_token_here
```

## Options

| Option | Type | Default | Description |
|---|---|---|---|
| `token` | `string` | `INDEXBOOST_TOKEN` env var | Render token |
| `serviceUrl` | `string` | `https://render.getindexboost.com` | Override render URL |
| `enabled` | `boolean` | `true` | Disable without removing config |

## License

MIT
