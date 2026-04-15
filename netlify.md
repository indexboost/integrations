# Netlify Integration

**Categoria:** Hosting Platform / Edge
**Prioridade:** Fase 3 — CDN / Edge
**Código Renderfy necessário:** ❌ Não — apenas configuração via `netlify.toml` ou `_redirects`

## Descrição

Netlify é uma plataforma popular para deploy de sites JAMstack/SPAs. A integração usa Edge Functions ou redirects baseados em user-agent para redirecionar crawlers para o Renderfy.

## Como funciona

### Opção 1: Netlify Edge Functions (recomendado)
1. Edge Function intercepta requests
2. Verifica user-agent
3. Se crawler, faz proxy para Renderfy
4. Se não, serve o site normalmente

### Opção 2: Via Cloudflare (fallback)
Se o domínio usa Cloudflare como DNS, usar a integração Cloudflare Workers na frente do Netlify.

## Setup do usuário (Edge Functions)

```toml
# netlify.toml
[[edge_functions]]
  path = "/*"
  function = "renderfy-render"
```

```typescript
// netlify/edge-functions/renderfy-render.ts
import type { Context } from "@netlify/edge-functions";

const CRAWLERS = /googlebot|bingbot|gptbot|claudebot|perplexitybot/i;
const STATIC = /\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|ttf|pdf)$/i;

export default async (request: Request, context: Context) => {
  const ua = request.headers.get("user-agent") || "";
  const url = new URL(request.url);

  if (CRAWLERS.test(ua) && !STATIC.test(url.pathname)) {
    const renderfyUrl = `https://service.renderfy.io/${url.toString()}`;
    return fetch(renderfyUrl, {
      headers: {
        "X-INDEXBOOST-TOKEN": Deno.env.get("INDEXBOOST_TOKEN") || "",
      },
    });
  }

  return context.next();
};
```

## Arquivos a criar

```
docs/docs/integrations/netlify.md                          — Documentação Docusaurus
integrations/netlify/netlify.toml                          — Config exemplo
integrations/netlify/edge-functions/renderfy-render.ts   — Edge Function
```

## Tarefas

- [ ] Criar Edge Function exemplo (`renderfy-render.ts`)
- [ ] Criar `netlify.toml` de exemplo
- [ ] Documentar variável de ambiente `INDEXBOOST_TOKEN` no Netlify Dashboard
- [ ] Documentação Docusaurus
- [ ] Testar com site Netlify real
- [ ] Documentar alternativa via Cloudflare
