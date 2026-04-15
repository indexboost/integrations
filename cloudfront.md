# CloudFront (AWS) Integration

**Categoria:** CDN / Edge (Lambda@Edge)
**Prioridade:** Fase 3 — CDN / Edge
**Código Renderfy necessário:** ✅ Sim — Lambda@Edge function fornecida por nós

## Descrição

CloudFront é o CDN da AWS. A integração usa Lambda@Edge (viewer-request) para interceptar crawlers no edge e redirecionar para o Renderfy.

## Como funciona

1. Lambda@Edge associada ao behavior do CloudFront (viewer-request)
2. Verifica `user-agent` header
3. Se crawler, modifica origin para `service.renderfy.io`
4. Se não, deixa seguir para o origin normal

## Arquivos a criar

```
docs/docs/integrations/cloudfront.md         — Documentação Docusaurus
integrations/cloudfront/lambda.js            — Lambda@Edge function
integrations/cloudfront/template.yaml        — SAM/CloudFormation template
```

## Tarefas

- [ ] Criar Lambda@Edge function (`lambda.js`)
- [ ] Criar SAM template para deploy
- [ ] Documentar setup passo-a-passo no Docusaurus
- [ ] Testar com CloudFront real
