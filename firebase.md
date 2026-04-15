# Firebase Integration

**Categoria:** Hosting Platform (Cloud Functions)
**Prioridade:** Fase 4 — Complementar
**Código Renderfy necessário:** ✅ Sim — Cloud Function + rewrite config

## Descrição

Firebase Hosting não suporta middleware nativamente. A integração requer Cloud Functions para interceptar requests, ou usar Cloudflare como proxy na frente do Firebase.

## Opção 1: Cloud Function

```javascript
// functions/index.js
const functions = require("firebase-functions");
const fetch = require("node-fetch");

const CRAWLERS = /googlebot|bingbot|gptbot|claudebot/i;

exports.renderfyRender = functions.https.onRequest(async (req, res) => {
  const ua = req.headers["user-agent"] || "";
  if (CRAWLERS.test(ua)) {
    const url = `https://${req.hostname}${req.originalUrl}`;
    const response = await fetch(`https://service.renderfy.io/${url}`, {
      headers: { "X-INDEXBOOST-TOKEN": process.env.INDEXBOOST_TOKEN },
    });
    const html = await response.text();
    res.status(response.status).send(html);
  } else {
    // serve static files normally
    res.redirect(req.originalUrl);
  }
});
```

## Opção 2: Via Cloudflare

Colocar Cloudflare como proxy DNS na frente do Firebase e usar a [integração Cloudflare](./cloudflare.md).

## Arquivos a criar

```
docs/docs/integrations/firebase.md           — Documentação Docusaurus
integrations/firebase/functions/index.js     — Cloud Function
integrations/firebase/firebase.json          — Rewrite config
```

## Tarefas

- [ ] Criar Cloud Function exemplo
- [ ] Criar `firebase.json` com rewrite rules
- [ ] Documentar setup passo-a-passo
- [ ] Documentar alternativa via Cloudflare
- [ ] Documentação Docusaurus
