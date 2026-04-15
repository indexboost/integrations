# Apache Integration

**Categoria:** Web Server (config-only)
**Prioridade:** Fase 1 — Core
**Código Renderfy necessário:** ❌ Não — apenas documentação + exemplo de `.htaccess`

## Descrição

Apache é o segundo web server mais utilizado. A integração usa `mod_rewrite` + `mod_proxy_http` para detectar crawlers via user-agent e redirecionar para o Renderfy.

## Como funciona

1. Módulos necessários: `mod_headers`, `mod_proxy`, `mod_proxy_http`, `mod_ssl`, `mod_rewrite`
2. `.htaccess` define `RewriteCond` para detectar user-agents de crawlers
3. `RewriteRule` proxy reverso para `https://service.renderfy.io/{url}`
4. Header `X-INDEXBOOST-TOKEN` enviado via `RequestHeader`

## Pré-requisitos

- Apache 2.4+
- Módulos habilitados: `headers`, `proxy`, `proxy_http`, `ssl`, `rewrite`
- Acesso ao `.htaccess` ou `httpd.conf`

## Arquivos a criar

```
docs/docs/integrations/apache.md         — Documentação completa (Docusaurus)
integrations/apache/.htaccess            — Config exemplo para .htaccess
integrations/apache/vhost.conf           — Config exemplo para vhost (443)
```

## Exemplo de .htaccess

```apache
# Renderfy.io Integration
<IfModule mod_headers.c>
    RequestHeader set X-INDEXBOOST-TOKEN "YOUR_TOKEN"
</IfModule>

<IfModule mod_rewrite.c>
    RewriteEngine On
    <IfModule mod_proxy_http.c>
        # Detect crawlers
        RewriteCond %{HTTP_USER_AGENT} googlebot|bingbot|gptbot|claudebot|... [NC]
        # Skip static files
        RewriteCond %{REQUEST_URI} ^(?!.*?\.(js|css|xml|png|jpg|jpeg|gif|pdf|...))
        # Proxy to Renderfy
        RewriteRule ^(.*) https://service.renderfy.io/%{REQUEST_SCHEME}://%{HTTP_HOST}/$1 [P,END]
    </IfModule>
</IfModule>
```

## Exemplo de vhost.conf (443)

```apache
<VirtualHost *:443>
    SSLProxyEngine on
    # ... rest of SSL config
</VirtualHost>
```

## Tarefas

- [ ] Criar `.htaccess` exemplo completo com lista de crawlers
- [ ] Criar `vhost.conf` exemplo com SSLProxyEngine
- [ ] Definir lista completa de user-agents
- [ ] Definir lista de extensões estáticas a ignorar
- [ ] Escrever documentação Docusaurus
- [ ] Nota: regras Renderfy devem estar NO TOPO do `.htaccess` (antes de qualquer `[L]` flag)
- [ ] Adicionar seção de troubleshooting (403/404 após integração)
- [ ] Testar com Apache real
