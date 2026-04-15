# HAProxy Integration

**Categoria:** Web Server / Load Balancer (config-only)
**Prioridade:** Fase 4 — Complementar
**Código Renderfy necessário:** ❌ Não — apenas configuração HAProxy

## Descrição

HAProxy é um load balancer e reverse proxy de alta performance. A integração usa ACLs para detectar crawlers e redirecionar para um backend Renderfy.

## Como funciona

1. ACL detecta user-agent de crawler
2. `use_backend` condicional envia para backend Renderfy
3. Backend Renderfy faz proxy para `service.renderfy.io`

## Exemplo de config

```haproxy
frontend http
    bind *:80

    acl is_crawler hdr_sub(User-Agent) -i googlebot bingbot gptbot claudebot
    acl is_static path_end .js .css .png .jpg .gif .svg .ico .woff .ttf

    use_backend renderfy if is_crawler !is_static

    default_backend app

backend app
    server app1 127.0.0.1:3000

backend renderfy
    http-request set-header X-INDEXBOOST-TOKEN YOUR_TOKEN
    server renderfy service.renderfy.io:443 ssl verify required
```

## Arquivos a criar

```
docs/docs/integrations/haproxy.md            — Documentação Docusaurus
integrations/haproxy/haproxy.cfg             — Config exemplo
```

## Tarefas

- [ ] Criar config HAProxy exemplo
- [ ] Documentação Docusaurus
- [ ] Testar com HAProxy real
