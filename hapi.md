# Hapi (Node.js) Integration

**Categoria:** Node.js Middleware
**Prioridade:** Fase 4 — Complementar
**Código Renderfy necessário:** ✅ Sim — usa pacote `renderfy-node` (mesmo do Express)

## Descrição

Hapi é um framework Node.js enterprise. Usa o mesmo pacote `renderfy-node` com um plugin Hapi.

## Setup do usuário

```bash
npm install renderfy-node
```

```javascript
const Hapi = require("@hapi/hapi");
const { hapiPlugin } = require("renderfy-node");

const server = Hapi.server({ port: 3000 });
await server.register({
  plugin: hapiPlugin,
  options: { token: "YOUR_TOKEN" },
});
```

## Arquivos a criar

```
docs/docs/integrations/hapi.md              — Documentação Docusaurus
```

> O código é parte do pacote `renderfy-node` (ver [express.md](./express.md))

## Tarefas

- [ ] Implementar `hapiPlugin` no pacote `renderfy-node`
- [ ] Documentação Docusaurus
- [ ] Testar com Hapi real
