<?php

namespace IndexBoost\Laravel\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Symfony\Component\HttpFoundation\Response as BaseResponse;

class IndexBoostRender
{
    /**
     * File extensions that should never be rendered.
     */
    private const STATIC_EXTENSIONS = '/\.(js|css|png|jpg|jpeg|gif|webp|svg|ico|woff|woff2|ttf|eot|otf|pdf|zip|xml|map|txt|json|csv|gz|br)$/i';

    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): BaseResponse
    {
        if (!$this->shouldRender($request)) {
            return $next($request);
        }

        $html = $this->fetchRendered($request);

        if ($html === null) {
            return $next($request);
        }

        return new Response($html, 200, [
            'Content-Type'          => 'text/html; charset=UTF-8',
            'X-IndexBoost-Rendered' => 'true',
            'Cache-Control'         => 'public, max-age=3600',
        ]);
    }

    private function shouldRender(Request $request): bool
    {
        if (!config('indexboost.enabled', true)) {
            return false;
        }

        if (!config('indexboost.token')) {
            return false;
        }

        // Only GET requests
        if (!$request->isMethod('GET')) {
            return false;
        }

        // Skip static assets
        if (preg_match(self::STATIC_EXTENSIONS, $request->path())) {
            return false;
        }

        // Check ignored URI patterns
        foreach ((array) config('indexboost.ignored_uris', []) as $pattern) {
            if (preg_match($pattern, $request->getRequestUri())) {
                return false;
            }
        }

        // Check user agent
        $ua = $request->userAgent() ?? '';
        $pattern = config('indexboost.crawler_pattern');

        return preg_match("/{$pattern}/i", $ua) === 1;
    }

    private function fetchRendered(Request $request): ?string
    {
        $serviceUrl = rtrim((string) config('indexboost.service_url', 'https://render.getindexboost.com'), '/');
        $token      = (string) config('indexboost.token');
        $timeout    = (int) config('indexboost.timeout', 30);
        $fullUrl    = $request->fullUrl();

        $renderUrl = $serviceUrl . '/?url=' . urlencode($fullUrl);

        $context = stream_context_create([
            'http' => [
                'method'  => 'GET',
                'header'  => implode("\r\n", [
                    "X-INDEXBOOST-TOKEN: {$token}",
                    "X-Original-User-Agent: " . ($request->userAgent() ?? ''),
                ]),
                'timeout' => $timeout,
                'ignore_errors' => true,
            ],
            'ssl' => [
                'verify_peer'      => true,
                'verify_peer_name' => true,
            ],
        ]);

        $html = @file_get_contents($renderUrl, false, $context);

        if ($html === false || empty($html)) {
            return null;
        }

        // Check response code from $http_response_header
        $statusLine = $http_response_header[0] ?? '';
        if (!str_contains($statusLine, '200')) {
            return null;
        }

        return $html;
    }
}
