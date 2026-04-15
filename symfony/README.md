# IndexBoost — Symfony

Serve rendered HTML to crawlers using a Symfony **EventSubscriber** that hooks into `KernelEvents::REQUEST` at the highest priority.

## Requirements

- PHP 8.1+
- Symfony 5.4+ or 6.x / 7.x
- `allow_url_fopen = On` in `php.ini` (or swap `file_get_contents` for Symfony's `HttpClient`)

## Installation

### 1. Copy the subscriber

```
src/EventSubscriber/IndexBoostSubscriber.php
```

Place it inside your Symfony project's `src/EventSubscriber/` directory.

### 2. Register the service (optional)

In Symfony 4+, services in `src/` are **autowired and autoconfigured by default**. If your `services.yaml` has the standard configuration, no changes are needed.

If you disabled autoconfigure, add the tag manually:

```yaml
App\EventSubscriber\IndexBoostSubscriber:
    tags:
        - { name: kernel.event_subscriber }
```

### 3. Set the environment variable

Add to your `.env` or `.env.local`:

```
INDEXBOOST_TOKEN=your_token_here
```

Or export it in your server environment / Docker container.

## How It Works

The subscriber listens to `KernelEvents::REQUEST` with priority **255** (runs before routing, security, etc.). When a crawler is detected and the path is not a static asset:

1. It fetches the rendered HTML from `https://render.getindexboost.com/?url={encoded_url}` with the `X-INDEXBOOST-TOKEN` header.
2. Sets the Symfony `Response` directly, bypassing controllers entirely.
3. On any error or non-crawler request, it returns without touching the response.

## Using Symfony HttpClient (Alternative)

Replace the `file_get_contents` block with:

```php
use Symfony\Contracts\HttpClient\HttpClientInterface;

public function __construct(private readonly HttpClientInterface $http)
{
    $this->token = (string) ($_ENV['INDEXBOOST_TOKEN'] ?? '');
}

// In onKernelRequest:
$response = $this->http->request('GET', $renderUrl, [
    'headers' => ['X-INDEXBOOST-TOKEN' => $this->token],
    'timeout' => 10,
]);
if ($response->getStatusCode() >= 200 && $response->getStatusCode() < 300) {
    $event->setResponse(new Response($response->getContent(), 200, [
        'Content-Type' => 'text/html; charset=UTF-8',
    ]));
}
```

## Configuration

| Variable | Required | Description |
|---|---|---|
| `INDEXBOOST_TOKEN` | ✅ | Your IndexBoost API token |
