# Django (Python) Integration

**Categoria:** Backend Framework (pacote pip)
**Prioridade:** Fase 2 — Frameworks
**Código Renderfy necessário:** ✅ Sim — criar pacote `renderfy-django` (PyPI)

## Descrição

Django é o framework Python mais popular para web. A integração é um WSGI/ASGI middleware que intercepta crawlers e retorna HTML pré-renderizado.

## Como funciona

1. Middleware Django registrado em `MIDDLEWARE` (settings.py)
2. No `process_request`, verifica `request.META['HTTP_USER_AGENT']`
3. Se crawler, faz `requests.get()` para Renderfy e retorna `HttpResponse`
4. Se não crawler, retorna `None` e o request segue normal

## Setup do usuário

```bash
pip install renderfy-django
```

```python
# settings.py
MIDDLEWARE = [
    'renderfy_django.middleware.RenderfyMiddleware',
    # ... others
]

INDEXBOOST_TOKEN = os.environ.get('INDEXBOOST_TOKEN', '')
RENDERFY_SERVICE_URL = 'https://service.renderfy.io'  # optional
```

```env
INDEXBOOST_TOKEN=your_token_here
```

## Arquivos a criar

```
packages/renderfy-django/                     — Pacote pip
  setup.py / pyproject.toml
  renderfy_django/
    __init__.py
    middleware.py                             — Django middleware
    detector.py                              — Crawler user-agent detection
    client.py                                — HTTP client for Renderfy
    settings.py                              — Default settings
  tests/
    test_middleware.py
    test_detector.py
  README.md
docs/docs/integrations/django.md             — Documentação Docusaurus
```

## Estrutura do middleware

```python
import requests
from django.conf import settings
from django.http import HttpResponse
from .detector import CrawlerDetector

class RenderfyMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        self.token = getattr(settings, 'INDEXBOOST_TOKEN', '')
        self.service_url = getattr(settings, 'RENDERFY_SERVICE_URL', 'https://service.renderfy.io')
        self.detector = CrawlerDetector()

    def __call__(self, request):
        user_agent = request.META.get('HTTP_USER_AGENT', '')

        if self.token and self.detector.is_crawler(user_agent):
            path = request.get_full_path()
            if not self.detector.is_static_file(path):
                url = request.build_absolute_uri()
                rendered = self._fetch_rendered(url)
                if rendered:
                    return HttpResponse(
                        rendered.content,
                        status=rendered.status_code,
                        content_type=rendered.headers.get('content-type', 'text/html'),
                    )

        return self.get_response(request)

    def _fetch_rendered(self, url):
        try:
            return requests.get(
                f"{self.service_url}/{url}",
                headers={"X-INDEXBOOST-TOKEN": self.token},
                timeout=30,
            )
        except requests.RequestException:
            return None
```

## Tarefas

- [ ] Criar pacote `renderfy-django`
- [ ] Implementar `middleware.py` (WSGI middleware)
- [ ] Implementar `detector.py` (crawler detection)
- [ ] Implementar `client.py` (HTTP client com retry/timeout)
- [ ] Suporte a Django settings (`INDEXBOOST_TOKEN`, `RENDERFY_SERVICE_URL`)
- [ ] Testes com pytest
- [ ] `README.md` do pacote
- [ ] `pyproject.toml` / `setup.py`
- [ ] Publicar no PyPI
- [ ] Documentação Docusaurus
- [ ] Testar com Django 4+ / 5+ real
- [ ] Suporte ASGI (async middleware) — opcional
