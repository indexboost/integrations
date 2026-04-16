<?php

namespace IndexBoost\Laravel\Middleware;

use Closure;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Http;
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

        if (!$request->isMethod('GET')) {
            return false;
        }

        if (preg_match(self::STATIC_EXTENSIONS, $request->path())) {
            return false;
        }

        foreach ((array) config('indexboost.ignored_uris', []) as $pattern) {
            if (preg_match($pattern, $request->getRequestUri())) {
                return false;
            }
        }

        $ua      = $request->userAgent() ?? '';
        $pattern = (string) config('indexboost.crawler_pattern', '');

        return $pattern !== '' && preg_match("/{$pattern}/i", $ua) === 1;
    }

    private function fetchRendered(Request $request): ?string
    {
        $serviceUrl = rtrim((string) config('indexboost.service_url', 'https://render.getindexboost.com'), '/');
        $token      = (string) config('indexboost.token');
        $timeout    = (int) config('indexboost.timeout', 30);
        $fullUrl    = $request->fullUrl();

        try {
            $response = Http::timeout($timeout)
                ->withHeaders([
                    'X-INDEXBOOST-TOKEN'     => $token,
                    'X-Original-User-Agent'  => $request->userAgent() ?? '',
                ])
                ->get($serviceUrl . '/', ['url' => $fullUrl]);

            if (!$response->successful()) {
                return null;
            }

            $body = $response->body();

            return $body !== '' ? $body : null;
        } catch (ConnectionException) {
            return null;
        } catch (\Throwable) {
            return null;
        }
    }
}
