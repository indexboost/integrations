# Nuxt.js Integration

**Categoria:** Node.js Framework (Nuxt module)
**Prioridade:** Fase 4 — Complementar
**Código Renderfy necessário:** ✅ Sim — pacote `renderfy-nuxt` (npm)

## Descrição

Nuxt.js é o framework Vue.js com SSR/SSG. A integração é um Nuxt server middleware que detecta crawlers.

## Setup do usuário

```bash
npm install renderfy-nuxt
```

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ["renderfy-nuxt"],
  renderfy: {
    token: process.env.INDEXBOOST_TOKEN,
  },
});
```

## Arquivos a criar

```
packages/renderfy-nuxt/                       — Pacote npm
  package.json
  src/
    module.ts                                — Nuxt module
    runtime/
      server-middleware.ts                   — Server middleware
  README.md
docs/docs/integrations/nuxt.md               — Documentação Docusaurus
```

## Tarefas

- [ ] Criar pacote `renderfy-nuxt`
- [ ] Implementar Nuxt module
- [ ] Implementar server middleware
- [ ] `README.md`
- [ ] Publicar no npm
- [ ] Documentação Docusaurus
- [ ] Testar com Nuxt 3+ real
