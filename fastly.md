# Fastly Integration

**Categoria:** CDN / Edge (VCL)
**Prioridade:** Fase 3 — CDN / Edge
**Código Renderfy necessário:** ✅ Sim — VCL snippet fornecido por nós

## Descrição

Fastly é um CDN de alta performance. A integração usa VCL (Varnish Configuration Language) para detectar crawlers e redirecionar para o Renderfy como backend.

## Como funciona

1. VCL snippet no `vcl_recv` detecta crawlers
2. Se crawler, seta backend para `service.renderfy.io`
3. Adiciona header `X-INDEXBOOST-TOKEN`
4. Modifica URL para incluir URL original

## Arquivos a criar

```
docs/docs/integrations/fastly.md             — Documentação Docusaurus
integrations/fastly/snippet.vcl              — VCL snippet
```

## Tarefas

- [ ] Criar VCL snippet para crawler detection + proxy
- [ ] Documentar configuração de backend no Fastly
- [ ] Documentação Docusaurus
- [ ] Testar com Fastly real
