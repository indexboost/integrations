# Django — `indexboost-django`

**PyPI package:** [`indexboost-django`](https://pypi.org/project/indexboost-django/)

See the full guide in [`django/README.md`](./django/README.md).

## Quick start

```bash
pip install indexboost-django
```

```python
# settings.py
MIDDLEWARE = [
    "indexboost.middleware.IndexBoostMiddleware",
    # ... other middleware
]

INDEXBOOST_TOKEN = os.environ.get("INDEXBOOST_TOKEN", "")
```

```bash
# .env
INDEXBOOST_TOKEN=your_token_here
```

## How it works

The Django middleware intercepts requests from known crawlers and proxies them to `https://render.getindexboost.com/` with your token. Human traffic passes through to your Django views as usual.
