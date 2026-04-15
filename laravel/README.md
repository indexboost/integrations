# indexboost/laravel

IndexBoost Render middleware for **Laravel 10+**.

## Installation

```bash
composer require indexboost/laravel
```

Publish the config:

```bash
php artisan vendor:publish --tag=indexboost-config
```

## Setup

Add your token to `.env`:

```dotenv
INDEXBOOST_TOKEN=your_token_here
```

Register the middleware in `bootstrap/app.php` (Laravel 11+):

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->prepend(\IndexBoost\Laravel\Middleware\IndexBoostRender::class);
})
```

Or in `app/Http/Kernel.php` (Laravel 10):

```php
protected $middleware = [
    \IndexBoost\Laravel\Middleware\IndexBoostRender::class,
    // ... existing
];
```

## Configuration

`config/indexboost.php`:

| Key | Default | Description |
|---|---|---|
| `token` | `INDEXBOOST_TOKEN` env | Render token |
| `service_url` | `https://render.getindexboost.com` | Render service URL |
| `enabled` | `true` | Enable/disable |
| `timeout` | `30` | HTTP timeout (seconds) |
| `crawler_pattern` | built-in | PCRE regex for crawlers |
| `ignored_uris` | `[/api/, /admin/]` | URI patterns to skip |

## License

MIT
