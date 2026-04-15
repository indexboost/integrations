# Cloudflare Integration

**Categoria:** CDN / Edge (Worker script)
**Prioridade:** Fase 1 — Core
**Código Renderfy necessário:** ✅ Sim — Cloudflare Worker script (JS/ESM) fornecido por nós

## Descrição

Cloudflare é o CDN mais popular. A integração usa Cloudflare Workers para interceptar requisições no edge e redirecionar crawlers para o Renderfy. Funciona independente do origin server.

## Como funciona

1. Cloudflare Workers intercepta toda requisição antes de chegar ao origin
2. Worker detecta se o user-agent é um crawler
3. Se sim, faz `fetch` para `https://service.renderfy.io/{url}` com o token
4. Se não, deixa passar para o origin normalmente

## Pré-requisitos

- Domínio com DNS proxied pelo Cloudflare (orange cloud)
- Acesso ao Cloudflare Dashboard (pelo menos Worker Admin)
- Cloudflare Workers habilitado (free tier funciona)

## Notas importantes

- Cloudflare bloqueia AI crawlers por padrão em domínios novos. O usuário precisa permitir explicitamente em "Control AI crawlers"
- A integração só funciona se o Cloudflare estiver configurado como proxy (DNS proxied)

## Arquivos a criar

```
docs/docs/integrations/cloudflare.md     — Documentação completa (Docusaurus)
integrations/cloudflare/worker.js        — Worker script ESM completo
integrations/cloudflare/wrangler.toml    — Config do Wrangler (deploy tool)
```

## Exemplo de Worker (ESM)

```javascript
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const ua = (request.headers.get("user-agent") || "").toLowerCase();

    const crawlers = /googlebot|bingbot|gptbot|claudebot|perplexitybot|...$/;
    const staticFiles = /\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|ttf|pdf)$/i;

    if (crawlers.test(ua) && !staticFiles.test(url.pathname)) {
      const renderfyUrl = `https://service.renderfy.io/${url.toString()}`;
      return fetch(renderfyUrl, {
        headers: {
          "X-INDEXBOOST-TOKEN": env.INDEXBOOST_TOKEN,
          "X-Original-User-Agent": ua,
        },
      });
    }

    return fetch(request);
  },
};
```

## Tarefas

- [ ] Criar Worker script ESM completo (`worker.js`)
- [ ] Criar `wrangler.toml` de exemplo
- [ ] Definir lista completa de crawlers no regex
- [ ] Definir lista de extensões estáticas a ignorar
- [ ] Documentar setup passo-a-passo no Docusaurus:
  - [ ] Criar Worker
  - [ ] Colar código
  - [ ] Configurar route (`*example.com/*`)
  - [ ] Adicionar variável de ambiente `INDEXBOOST_TOKEN`
  - [ ] Deploy
- [ ] Adicionar nota sobre "Control AI crawlers" no Cloudflare
- [ ] Documentar Failure mode: Fail open
- [ ] Testar com Cloudflare real
