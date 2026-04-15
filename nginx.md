# Nginx Integration

**Categoria:** Web Server (config-only)
**Prioridade:** Fase 1 — Core
**Código Renderfy necessário:** ❌ Não — apenas documentação + exemplo de config

## Descrição

Nginx é o web server mais utilizado no mundo. A integração consiste em adicionar regras ao `nginx.conf` que detectam user-agents de crawlers e fazem proxy_pass para o serviço Renderfy.

## Como funciona

1. Bloco `map` define variável `$render` baseada no `$http_user_agent`
2. No `location /` verifica se `$render = 1`
3. Se sim, faz `proxy_pass` para `https://service.renderfy.io/{scheme}://{host}/{uri}`
4. Header `X-INDEXBOOST-TOKEN` é enviado junto

## Casos de uso

- **SPA (Single Page Application):** Nginx serve os arquivos estáticos (index.html + JS/CSS). Crawlers são redirecionados para Renderfy.
- **PHP Application:** Nginx serve PHP via FastCGI. Crawlers interceptados antes do PHP processar.
- **Reverse Proxy:** Nginx proxeia para um backend (Node, Python, etc.). Crawlers redirecionados antes do proxy.

## Arquivos a criar

```
docs/docs/integrations/nginx.md          — Documentação completa (Docusaurus)
integrations/nginx/nginx.conf            — Config exemplo para SPA
integrations/nginx/nginx-php.conf        — Config exemplo para PHP apps
integrations/nginx/nginx-reverse-proxy.conf — Config exemplo para reverse proxy
```

## Exemplo de config (SPA)

```nginx
map $http_user_agent $render {
    default       0;
    "~*googlebot"  1;
    "~*bingbot"    1;
    "~*gptbot"     1;
    "~*claudebot"  1;
    # ... outros crawlers
}

server {
    listen 80;
    server_name example.com;

    location / {
        if ($render = 1) {
            rewrite (.*) /renderfy last;
        }
        try_files $uri $uri/ /index.html;
    }

    location /renderfy {
        internal;
        proxy_set_header X-INDEXBOOST-TOKEN "YOUR_TOKEN";
        proxy_pass https://service.renderfy.io/$scheme://$host$request_uri;
    }
}
```

## Tarefas

- [ ] Criar config exemplo: SPA (`nginx.conf`)
- [ ] Criar config exemplo: PHP app (`nginx-php.conf`)
- [ ] Criar config exemplo: Reverse proxy (`nginx-reverse-proxy.conf`)
- [ ] Definir lista completa de user-agents (crawlers) no `map` block
- [ ] Definir lista de extensões estáticas a ignorar (`.js`, `.css`, `.png`, etc.)
- [ ] Escrever documentação completa no Docusaurus
- [ ] Adicionar seção de verificação (como testar se está funcionando)
- [ ] Testar com Nginx real + curl com user-agent de bot
