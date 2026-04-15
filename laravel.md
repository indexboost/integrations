# Laravel — `indexboost/laravel`

**Composer package:** [`indexboost/laravel`](https://packagist.org/packages/indexboost/laravel)

See the full guide in [`laravel/README.md`](./laravel/README.md).

## Quick start

```bash
composer require indexboost/laravel
```

```php
// app/Http/Kernel.php — add to $middlewareGroups 'web'
\IndexBoost\Laravel\Middleware\IndexBoostRender::class,
```

```bash
# .env
INDEXBOOST_TOKEN=your_token_here
```

## How it works

The Laravel middleware checks each incoming request's `User-Agent`. If it matches a known crawler, the middleware fetches the rendered HTML from `https://render.getindexboost.com/` and returns it. All other requests are handled by your Laravel application normally.
