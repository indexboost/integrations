# Bubble.io Integration

**Categoria:** Plataforma No-Code
**Prioridade:** Fase 4 — Complementar
**Código Renderfy necessário:** ❌ Não — usa Cloudflare Worker na frente

## Descrição

Bubble.io é uma plataforma no-code. Não permite middleware customizado. A integração funciona colocando Cloudflare como proxy DNS na frente do Bubble e usando a [integração Cloudflare](./cloudflare.md).

## Como funciona

1. Apontar DNS do domínio para Cloudflare (proxy mode)
2. Instalar Cloudflare Worker com script Renderfy
3. Cloudflare intercepta crawlers e serve HTML do Renderfy
4. Usuários normais acessam Bubble diretamente

## Arquivos a criar

```
docs/docs/integrations/bubble.md             — Documentação Docusaurus
```

> Não precisa de código específico — reutiliza a [integração Cloudflare](./cloudflare.md)

## Tarefas

- [ ] Documentação Docusaurus com guia passo-a-passo
- [ ] Screenshots do Cloudflare + Bubble DNS config
- [ ] Referenciar integração Cloudflare
