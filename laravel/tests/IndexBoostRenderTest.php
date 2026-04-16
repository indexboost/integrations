<?php

namespace IndexBoost\Laravel\Tests;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use IndexBoost\Laravel\Middleware\IndexBoostRender;
use Symfony\Component\HttpFoundation\Response;

class IndexBoostRenderTest extends TestCase
{
    private IndexBoostRender $middleware;

    protected function setUp(): void
    {
        parent::setUp();
        $this->middleware = new IndexBoostRender();
    }

    // ── Pass-through cases ────────────────────────────────────────────────────

    public function test_non_crawler_request_passes_through(): void
    {
        Http::fake();

        $request  = $this->makeRequest('GET', '/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120');
        $response = $this->callMiddleware($request);

        $this->assertSame(200, $response->getStatusCode());
        $this->assertSame('from-app', $response->getContent());
        Http::assertNothingSent();
    }

    public function test_post_request_passes_through(): void
    {
        Http::fake();

        $request  = $this->makeRequest('POST', '/', 'Googlebot/2.1');
        $response = $this->callMiddleware($request);

        $this->assertSame('from-app', $response->getContent());
        Http::assertNothingSent();
    }

    public function test_static_asset_passes_through(): void
    {
        Http::fake();

        $request  = $this->makeRequest('GET', '/app.css', 'Googlebot/2.1');
        $response = $this->callMiddleware($request);

        $this->assertSame('from-app', $response->getContent());
        Http::assertNothingSent();
    }

    public function test_ignored_api_path_passes_through(): void
    {
        Http::fake();

        $request  = $this->makeRequest('GET', '/api/users', 'Googlebot/2.1');
        $response = $this->callMiddleware($request);

        $this->assertSame('from-app', $response->getContent());
        Http::assertNothingSent();
    }

    public function test_disabled_config_passes_through(): void
    {
        Http::fake();
        config(['indexboost.enabled' => false]);

        $request  = $this->makeRequest('GET', '/', 'Googlebot/2.1');
        $response = $this->callMiddleware($request);

        $this->assertSame('from-app', $response->getContent());
        Http::assertNothingSent();
    }

    public function test_missing_token_passes_through(): void
    {
        Http::fake();
        config(['indexboost.token' => null]);

        $request  = $this->makeRequest('GET', '/', 'Googlebot/2.1');
        $response = $this->callMiddleware($request);

        $this->assertSame('from-app', $response->getContent());
        Http::assertNothingSent();
    }

    // ── Render cases ─────────────────────────────────────────────────────────

    public function test_crawler_request_returns_rendered_html(): void
    {
        Http::fake([
            '*' => Http::response('<html><body>Rendered</body></html>', 200),
        ]);

        $request  = $this->makeRequest('GET', '/', 'Googlebot/2.1 (+http://www.google.com/bot.html)');
        $response = $this->callMiddleware($request);

        $this->assertSame(200, $response->getStatusCode());
        $this->assertSame('<html><body>Rendered</body></html>', $response->getContent());
        $this->assertSame('true', $response->headers->get('X-IndexBoost-Rendered'));
        $this->assertStringContainsString('text/html', $response->headers->get('Content-Type') ?? '');
    }

    public function test_gptbot_is_detected_as_crawler(): void
    {
        Http::fake([
            '*' => Http::response('<html>GPT rendered</html>', 200),
        ]);

        $request  = $this->makeRequest('GET', '/page', 'GPTBot/1.0');
        $response = $this->callMiddleware($request);

        $this->assertSame('<html>GPT rendered</html>', $response->getContent());
    }

    public function test_render_service_error_falls_through(): void
    {
        Http::fake([
            '*' => Http::response('Server error', 500),
        ]);

        $request  = $this->makeRequest('GET', '/', 'Googlebot/2.1');
        $response = $this->callMiddleware($request);

        $this->assertSame('from-app', $response->getContent());
        $this->assertNull($response->headers->get('X-IndexBoost-Rendered'));
    }

    public function test_render_service_connection_failure_falls_through(): void
    {
        Http::fake(function () {
            throw new \Illuminate\Http\Client\ConnectionException('Connection refused');
        });

        $request  = $this->makeRequest('GET', '/', 'Googlebot/2.1');
        $response = $this->callMiddleware($request);

        $this->assertSame('from-app', $response->getContent());
    }

    public function test_correct_token_header_is_sent(): void
    {
        Http::fake([
            '*' => Http::response('<html>ok</html>', 200),
        ]);

        $request = $this->makeRequest('GET', '/', 'Googlebot/2.1');
        $this->callMiddleware($request);

        Http::assertSent(function (\Illuminate\Http\Client\Request $req) {
            return $req->header('X-INDEXBOOST-TOKEN')[0] === 'test-token-12345';
        });
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private function makeRequest(string $method, string $uri, string $userAgent): Request
    {
        $request = Request::create("http://example.com{$uri}", $method);
        $request->headers->set('User-Agent', $userAgent);
        return $request;
    }

    private function callMiddleware(Request $request): Response
    {
        $next = fn() => new Response('from-app', 200);
        return $this->middleware->handle($request, $next);
    }
}
