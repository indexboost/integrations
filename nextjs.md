# Next.js Integration

**Categoria:** Node.js Framework (middleware)
**Prioridade:** Fase 2 — Frameworks
**Código Renderfy necessário:** ✅ Sim — pacote `renderfy-next` ou uso direto no `middleware.ts`

## Descrição

Next.js é o framework React mais popular com SSR/SSG. Embora Next.js já tenha SSR, muitas apps usam CSR (Client-Side Rendering) para rotas dinâmicas. A integração usa o Next.js Middleware (`middleware.ts`) para detectar crawlers e servir HTML do Renderfy.

## Como funciona

1. `middleware.ts` na raiz do projeto intercepta todas as requests
2. Verifica user-agent
3. Se crawler, faz `fetch` para Renderfy e retorna o HTML
4. Se não, `NextResponse.next()` segue normal

## Setup do usuário

```bash
npm install renderfy-next
```

```typescript
// middleware.ts
import { renderfyMiddleware } from "renderfy-next";

export const middleware = renderfyMiddleware({
  token: process.env.INDEXBOOST_TOKEN!,
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
```

## Arquivos a criar

```
packages/renderfy-next/                       — Pacote npm
  package.json
  src/
    index.ts
    middleware.ts                             — Next.js middleware factory
  README.md
docs/docs/integrations/nextjs.md             — Documentação Docusaurus
```

## Tarefas

- [ ] Criar pacote `renderfy-next`
- [ ] Implementar middleware factory
- [ ] Matcher config para ignorar `_next/static`, `api`, etc.
- [ ] `README.md`
- [ ] Publicar no npm
- [ ] Documentação Docusaurus
- [ ] Testar com Next.js 14+ real
