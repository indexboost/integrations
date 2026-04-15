# indexboost-django

IndexBoost Render middleware for **Django 4+**.

## Installation

```bash
pip install indexboost-django
```

## Setup

```python
# settings.py
MIDDLEWARE = [
    "indexboost_django.middleware.IndexBoostMiddleware",  # ← first
    "django.middleware.security.SecurityMiddleware",
    # ...
]

INDEXBOOST_TOKEN = env("INDEXBOOST_TOKEN")  # from app.getindexboost.com
```

```bash
# .env
INDEXBOOST_TOKEN=your_token_here
```

## Settings

| Setting | Default | Description |
|---|---|---|
| `INDEXBOOST_TOKEN` | — | **Required.** Render token |
| `INDEXBOOST_SERVICE_URL` | `https://render.getindexboost.com` | Render service URL |
| `INDEXBOOST_ENABLED` | `True` | Enable/disable |
| `INDEXBOOST_TIMEOUT` | `30` | HTTP timeout (seconds) |
| `INDEXBOOST_IGNORED_PATHS` | `[r"^/api/", r"^/admin/"]` | List of regex patterns to skip |

## With Django REST Framework

The middleware skips `/api/` paths by default, so DRF endpoints are not affected.

## License

MIT
