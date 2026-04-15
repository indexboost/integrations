# Docker Integration

**Categoria:** Hosting / Self-hosted (config-only)
**Prioridade:** Fase 1 — Core
**Código Renderfy necessário:** ❌ Não — apenas docker-compose config

## Descrição

Para usuários que usam Docker, fornecemos configurações prontas para colocar um reverse proxy (Nginx) na frente do app containerizado que redireciona crawlers para o Renderfy.

## Como funciona

1. Docker Compose com serviço Nginx como reverse proxy
2. Nginx detecta crawlers e faz proxy_pass para Renderfy
3. Requests normais vão para o container do app

## Arquivos a criar

```
docs/docs/integrations/docker.md         — Documentação Docusaurus
integrations/docker/docker-compose.yml   — Compose exemplo
integrations/docker/nginx.conf           — Nginx config para o proxy container
```

## Exemplo docker-compose.yml

```yaml
services:
  app:
    image: your-app:latest
    ports:
      - "3000"

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - app
```

## Tarefas

- [ ] Criar `docker-compose.yml` exemplo
- [ ] Criar `nginx.conf` adaptado para proxy container
- [ ] Documentação Docusaurus
- [ ] Testar com Docker Compose real
