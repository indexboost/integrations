# Symfony (PHP) Integration

**Categoria:** Backend Framework (pacote Composer)
**Prioridade:** Fase 2 — Frameworks
**Código Renderfy necessário:** ✅ Sim — criar pacote `renderfy/symfony` (Composer/Packagist)

## Descrição

Symfony é o framework PHP enterprise mais robusto. A integração usa um Event Subscriber no `kernel.request` para interceptar crawlers antes do controller processar.

## Como funciona

1. Event subscriber registrado no `kernel.request` com prioridade alta
2. Detecta user-agent de crawler no `Request` object
3. Se crawler, faz HTTP request (via HttpClient) para Renderfy
4. Retorna `Response` do Renderfy — short-circuits o controller
5. Se não crawler, não faz nada e o request segue normal

## Setup do usuário

```bash
composer require renderfy/symfony
```

```yaml
# config/packages/renderfy.yaml
renderfy:
    token: '%env(INDEXBOOST_TOKEN)%'
    service_url: 'https://service.renderfy.io'
    enabled: true
```

```env
INDEXBOOST_TOKEN=your_token_here
```

## Arquivos a criar

```
packages/renderfy-symfony/                     — Pacote Composer
  composer.json
  src/
    RenderfyBundle.php                         — Bundle class
    DependencyInjection/
      RenderfyExtension.php                    — Config loader
      Configuration.php                       — Config tree
    EventSubscriber/
      CrawlerSubscriber.php                   — kernel.request subscriber
    Service/
      CrawlerDetector.php                     — User-agent detection
      RenderfyClient.php                       — HTTP client wrapper
    Resources/
      config/
        services.yaml                          — Service definitions
  README.md
docs/docs/integrations/symfony.md             — Documentação Docusaurus
```

## Estrutura do subscriber

```php
<?php

namespace Renderfy\Symfony\EventSubscriber;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpFoundation\Response;

class CrawlerSubscriber implements EventSubscriberInterface
{
    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::REQUEST => ['onKernelRequest', 256],
        ];
    }

    public function onKernelRequest(RequestEvent $event): void
    {
        if (!$event->isMainRequest() || !$this->enabled) {
            return;
        }

        $request = $event->getRequest();

        if (!$this->crawlerDetector->isCrawler($request->headers->get('User-Agent', ''))) {
            return;
        }

        if ($this->crawlerDetector->isStaticFile($request->getPathInfo())) {
            return;
        }

        $rendered = $this->renderfyClient->fetch($request->getUri());
        $event->setResponse(new Response($rendered['body'], $rendered['status']));
    }
}
```

## Tarefas

- [ ] Criar pacote `renderfy/symfony`
- [ ] Implementar `RenderfyBundle`
- [ ] Implementar `CrawlerSubscriber` em `kernel.request`
- [ ] Implementar `CrawlerDetector` (shared com Laravel)
- [ ] Implementar `RenderfyClient` (via Symfony HttpClient)
- [ ] `Configuration.php` com tree builder
- [ ] `services.yaml` com autowiring
- [ ] Testes com PHPUnit
- [ ] `README.md` do pacote
- [ ] Publicar no Packagist
- [ ] Documentação Docusaurus
- [ ] Testar com Symfony 6+ / 7+ real
- [ ] Compatível com PHP 8.1+ e PHP 8.4
