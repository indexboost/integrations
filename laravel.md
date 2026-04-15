# Laravel (PHP) Integration

**Categoria:** Backend Framework (pacote Composer)
**Prioridade:** Fase 2 — Frameworks
**Código Renderfy necessário:** ✅ Sim — criar pacote `renderfy/laravel` (Composer/Packagist)

## Descrição

Laravel é o framework PHP mais popular. A integração é um HTTP Middleware que intercepta requests de crawlers e retorna HTML pré-renderizado pelo Renderfy.

## Como funciona

1. Middleware Laravel registrado globalmente ou em rotas específicas
2. Verifica `$request->header('User-Agent')` contra lista de crawlers
3. Se crawler, faz HTTP request para `https://service.renderfy.io/{url}`
4. Retorna response do Renderfy com headers apropriados
5. Se não crawler, `$next($request)` segue normal

## Setup do usuário

```bash
composer require renderfy/laravel
```

```bash
php artisan vendor:publish --tag=renderfy-config
```

```php
// config/renderfy.php
return [
    'token' => env('INDEXBOOST_TOKEN'),
    'service_url' => env('RENDERFY_SERVICE_URL', 'https://service.renderfy.io'),
    'enabled' => env('RENDERFY_ENABLED', true),
];
```

```env
INDEXBOOST_TOKEN=your_token_here
```

## Arquivos a criar

```
packages/renderfy-laravel/                    — Pacote Composer
  composer.json
  src/
    RenderfyServiceProvider.php               — Auto-discovery provider
    RenderfyMiddleware.php                    — HTTP Middleware
    CrawlerDetector.php                      — User-agent detection
    config/
      renderfy.php                            — Config publishable
  README.md
docs/docs/integrations/laravel.md            — Documentação Docusaurus
```

## Estrutura do middleware

```php
<?php

namespace Renderfy\Laravel;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RenderfyMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!config('renderfy.enabled')) {
            return $next($request);
        }

        if (!CrawlerDetector::isCrawler($request->userAgent())) {
            return $next($request);
        }

        if (CrawlerDetector::isStaticFile($request->getPathInfo())) {
            return $next($request);
        }

        $renderedHtml = $this->fetchRendered($request->fullUrl());
        return response($renderedHtml['body'], $renderedHtml['status'])
            ->withHeaders($renderedHtml['headers']);
    }
}
```

## Tarefas

- [ ] Criar pacote `renderfy/laravel`
- [ ] Implementar `RenderfyServiceProvider` com auto-discovery
- [ ] Implementar `RenderfyMiddleware`
- [ ] Implementar `CrawlerDetector` (shared logic)
- [ ] Config publishable via `vendor:publish`
- [ ] Suporte a `.env` (`INDEXBOOST_TOKEN`, `RENDERFY_ENABLED`)
- [ ] Testes com PHPUnit/Pest
- [ ] `README.md` do pacote
- [ ] Publicar no Packagist
- [ ] Documentação Docusaurus
- [ ] Testar com Laravel 10+ real
- [ ] Compatível com PHP 8.1+ (production-v5) e PHP 8.4 (production-v6)
