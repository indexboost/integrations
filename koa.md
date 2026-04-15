# Koa (Node.js) Integration

**Categoria:** Node.js Middleware
**Prioridade:** Fase 4 — Complementar
**Código Renderfy necessário:** ✅ Sim — usa pacote `renderfy-node` (mesmo do Express)

## Descrição

Koa é um framework Node.js minimalista. Usa o mesmo pacote `renderfy-node` com um adaptador Koa.

## Setup do usuário

```bash
npm install renderfy-node
```

```javascript
const Koa = require("koa");
const { koaMiddleware } = require("renderfy-node");

const app = new Koa();
app.use(koaMiddleware({ token: "YOUR_TOKEN" }));
```

## Arquivos a criar

```
docs/docs/integrations/koa.md               — Documentação Docusaurus
```

> O código é parte do pacote `renderfy-node` (ver [express.md](./express.md))

## Tarefas

- [ ] Implementar `koaMiddleware` no pacote `renderfy-node`
- [ ] Documentação Docusaurus
- [ ] Testar com Koa real
