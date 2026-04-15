# Vercel Integration

**Categoria:** Hosting Platform (Edge Middleware)
**Prioridade:** Fase 3 — CDN / Edge
**Código Renderfy necessário:** ✅ Sim — `middleware.ts` na raiz do projeto

## Descrição

Vercel é a plataforma de hosting do Next.js. A integração usa o Edge Middleware nativo do Vercel para detectar crawlers.

## Setup do usuário

```typescript
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const CRAWLERS = /googlebot|bingbot|gptbot|claudebot|perplexitybot/i;

export function middleware(request: NextRequest) {
  const ua = request.headers.get("user-agent") || "";

  if (CRAWLERS.test(ua)) {
    const url = request.nextUrl.clone();
    const renderfyUrl = `https://service.renderfy.io/${url.toString()}`;
    return fetch(renderfyUrl, {
      headers: { "X-INDEXBOOST-TOKEN": process.env.INDEXBOOST_TOKEN || "" },
    });
  }

  return NextResponse.next();
}
```

## Arquivos a criar

```
docs/docs/integrations/vercel.md             — Documentação Docusaurus
integrations/vercel/middleware.ts             — Exemplo de middleware
```

## Tarefas

- [ ] Criar `middleware.ts` exemplo
- [ ] Documentar variável `INDEXBOOST_TOKEN` no Vercel Dashboard
- [ ] Documentação Docusaurus
- [ ] Testar com Vercel real
