# Express.js (Node.js) Integration

**Categoria:** Node.js Middleware (pacote npm)
**Prioridade:** Fase 1 — Core
**Código Renderfy necessário:** ✅ Sim — criar pacote `renderfy-node` (npm)

## Descrição

Express.js é o framework Node.js mais usado. A integração é um middleware que detecta crawlers e faz proxy para o Renderfy. Também compatível com Koa e Hapi via adaptadores.

## Como funciona

1. Middleware Express intercepta toda request
2. Verifica se o `user-agent` é um crawler
3. Se sim, faz `fetch` para `https://service.renderfy.io/{url}` e retorna o HTML
4. Se não, chama `next()` e a request segue normal

## Setup do usuário

```bash
npm install renderfy-node
```

```javascript
const express = require("express");
const renderfy = require("renderfy-node");

const app = express();
app.use(renderfy.middleware({ token: "YOUR_TOKEN" }));
// ... rest of routes
```

## Arquivos a criar

```
packages/renderfy-node/              — Pacote npm
  package.json
  src/
    index.ts                        — Exports
    middleware.ts                    — Express middleware
    detector.ts                     — Crawler user-agent detector
    types.ts                        — TypeScript types
  README.md
docs/docs/integrations/express.md   — Documentação Docusaurus
```

## API do pacote

```typescript
interface RenderfyOptions {
  token: string;
  serviceUrl?: string; // default: "https://service.renderfy.io"
  crawlers?: RegExp;   // override crawler detection
  ignoredExtensions?: string[]; // override static file extensions
  beforeRender?: (req: Request) => boolean; // custom skip logic
  timeout?: number;    // proxy timeout in ms (default: 30000)
}

// Express middleware
renderfy.middleware(options: RenderfyOptions): RequestHandler;

// Generic (for Koa/Hapi/custom)
renderfy.shouldRender(userAgent: string, url: string): boolean;
renderfy.getRenderedPage(url: string, token: string): Promise<Response>;
```

## Tarefas

- [ ] Criar repo/pacote `renderfy-node`
- [ ] Implementar `detector.ts` — lista de crawlers + extensões
- [ ] Implementar `middleware.ts` — Express middleware
- [ ] Implementar handler genérico para Koa/Hapi/custom
- [ ] TypeScript types
- [ ] Testes unitários (vitest/jest)
- [ ] `README.md` do pacote
- [ ] Publicar no npm
- [ ] Documentação Docusaurus (texto + setup steps)
- [ ] Testar com Express.js real + curl bot user-agent
