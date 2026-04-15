<?php

declare(strict_types=1);

namespace App\EventSubscriber;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\KernelEvents;

/**
 * IndexBoost render subscriber.
 *
 * Intercepts incoming requests from web crawlers and serves rendered HTML
 * fetched from the IndexBoost render service.
 *
 * Register via config/services.yaml (autowired by default in Symfony 4+).
 */
final class IndexBoostSubscriber implements EventSubscriberInterface
{
    private const RENDER_BASE = 'https://render.getindexboost.com';

    private const CRAWLER_PATTERN = '@googlebot|bingbot|yandex|baiduspider|facebookexternalhit'
        . '|twitterbot|rogerbot|linkedinbot|embedly|quora|pinterest|slackbot|vkShare'
        . '|W3C_Validator|redditbot|applebot|whatsapp|flipboard|tumblr|bitlybot'
        . '|skypeuripreview|nuzzel|discordbot|google-read-aloud|duckduckbot|kakaotalk'
        . '|headlesschrome|lighthousebot|seobilitybot|seokicks-robot|ahrefsbot|semrushbot@i';

    private const STATIC_PATTERN = '@\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot'
        . '|pdf|zip|gz|mp4|webm|mp3|ogg|wav|flac|avi|mov|wmv|swf|json|xml|txt|csv|rss'
        . '|atom|map)(\?.*)?$@i';

    private string $token;

    public function __construct()
    {
        $this->token = (string) ($_ENV['INDEXBOOST_TOKEN'] ?? getenv('INDEXBOOST_TOKEN') ?? '');
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::REQUEST => ['onKernelRequest', 255], // highest priority
        ];
    }

    public function onKernelRequest(RequestEvent $event): void
    {
        if (!$event->isMainRequest()) {
            return;
        }

        if ($this->token === '') {
            return;
        }

        $request = $event->getRequest();
        $ua = $request->headers->get('User-Agent', '');
        $path = $request->getPathInfo();

        if (!preg_match(self::CRAWLER_PATTERN, $ua)) {
            return;
        }

        if (preg_match(self::STATIC_PATTERN, $path)) {
            return;
        }

        $targetUrl = $request->getUri();
        $encodedUrl = rawurlencode($targetUrl);
        $renderUrl = self::RENDER_BASE . '/?url=' . $encodedUrl;

        $context = stream_context_create([
            'http' => [
                'method'  => 'GET',
                'header'  => 'X-INDEXBOOST-TOKEN: ' . $this->token,
                'timeout' => 10,
            ],
        ]);

        try {
            /** @var string|false $html */
            $html = @file_get_contents($renderUrl, false, $context);

            if ($html === false) {
                return;
            }

            // Check HTTP status from $http_response_header (populated by file_get_contents)
            $statusLine = $http_response_header[0] ?? 'HTTP/1.1 200';
            preg_match('@HTTP/\d+\.\d+\s+(\d+)@', $statusLine, $m);
            $status = (int) ($m[1] ?? 200);

            if ($status < 200 || $status >= 300) {
                return;
            }

            $response = new Response($html, Response::HTTP_OK, [
                'Content-Type' => 'text/html; charset=UTF-8',
            ]);

            $event->setResponse($response);
        } catch (\Throwable) {
            // Fall through to normal Symfony handling
        }
    }
}
